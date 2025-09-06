'use server';
import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";
import { CourseClassStudentModel, CreateCourseClassStudentModel } from "@/app/lib/definitions/course_class_students_definitions";
import { URLPathParam } from "@/app/lib/url_path_param";

const clientApi = bffApiClient.resource('/course-class-students');

export async function createCourseClassStudent(model: CreateCourseClassStudentModel): Promise<void> {
  clientApi.post("/student-list",model, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json'} });
}

export async function deleteByStudentAndCourseClass(student_id: any, course_class_id: any): Promise<void> {
  
  const params = new URLPathParam();
  params.append("student");
  params.append(student_id);  
  params.append("course-class");
  params.append(course_class_id);

  await clientApi.delete(params.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json'} });
  
}

export async function getByStudentId (student_id: any): Promise<CourseClassStudentModel[]> {

  const params = new URLPathParam();
  params.append("student");
  params.append(student_id);  

  return clientApi.get(params.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
  
}
