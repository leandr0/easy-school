'use server';
import { URLPathParam } from "@/app/lib/url_path_param"
import { bffApiClient } from "@/app/config/clientAPI";
import { HttpError } from "@/app/config/api";
import { StudentCoursePriceModel, StudentModel, CoursePriceModel } from "@/app/lib/definitions/students_definitions";
import { bearerHeaders } from "@/app/lib/authz.server";

const clientApi = bffApiClient.resource('/students');

export async function getAllStudents(): Promise<StudentModel[]> {
  return await clientApi.get<StudentModel[]>(``, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function findById(id: any): Promise<StudentModel> {
  return await clientApi.get<StudentModel>('/' + id, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function findByIdCoursePrice(id: any): Promise<StudentCoursePriceModel> {

  const params = new URLPathParam();
  params.append(id);
  params.append("course-price");

  return await clientApi.get<StudentCoursePriceModel>(params.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function getStudentsNotInCourseClass(course_class_id: any): Promise<StudentModel[]> {

  const pathParams = new URLPathParam
  pathParams.append("course-class");
  pathParams.append(course_class_id);
  pathParams.append("candidate-students");

  try {
    return await clientApi.get<StudentModel[]>(pathParams.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
  } catch (err) {
    // "No candidates left" (every student already enrolled) is a normal,
    // successful state — some backend versions represent it as a 404 instead
    // of an empty array. Treat that specific case as an empty list instead of
    // letting it fail: this call runs alongside getStudentsInCourseClass in a
    // Promise.all when the "add students" page refreshes its lists, so left
    // unhandled it would abort that refresh and the enrolled-students list
    // would silently stop updating right when the candidates pool ran out.
    if (err instanceof HttpError && err.status === 404) {
      return [];
    }
    throw err;
  }
}

export async function getStudentsInCourseClass(course_class_id: any): Promise<StudentModel[]> {

  const pathParams = new URLPathParam
  pathParams.append("course-class");
  pathParams.append(course_class_id);
  pathParams.append("students");

  return await clientApi.get<StudentModel[]>(pathParams.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function createStudent(student: StudentModel): Promise<void> {

  return await clientApi.post<void>(student, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json' } });
}

export async function updateStudentAndCoursePrice(student: StudentModel): Promise<void> {

  return await clientApi.put("/course-price", student, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json' } });
}

// "Contratos": updates ONLY the per-student course price (contract) for each active
// course, without touching any personal/user data.
export async function updateStudentContracts(studentId: any, courses: CoursePriceModel[]): Promise<CoursePriceModel[]> {

  const params = new URLPathParam();
  params.append(studentId);
  params.append("course-price");

  return await clientApi.put(params.toString(), courses, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json' } });
}