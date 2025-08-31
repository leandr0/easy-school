import { URLPathParam } from "@/app/lib/url_path_param"
import { bffApiClient } from "@/app/config/clientAPI";
import { StudentCoursePriceModel, StudentModel } from "@/app/lib/definitions/students_definitions";

const clientApi = bffApiClient.resource('/students');

export async function getAllStudents(): Promise<StudentModel[]> {
  return await clientApi.get<StudentModel[]>();
}

export async function findById(id:any): Promise<StudentModel> {  
  return await clientApi.get<StudentModel>('/'+id); 
}

export async function findByIdCoursePrice(id:any): Promise<StudentCoursePriceModel> {  

  const params = new URLPathParam();
  params.append(id);
  params.append("course-price");

  return await  clientApi.get<StudentCoursePriceModel>(params.toString()); 
}

export async function getStudentsNotInCourseClass(course_class_id:any): Promise<StudentModel[]> {

  const pathParams = new URLPathParam
  pathParams.append("course-class");
  pathParams.append(course_class_id);
  pathParams.append("candidate-students");

  return await clientApi.get<StudentModel[]>(pathParams.toString()); 
}

export async function getStudentsInCourseClass(course_class_id:any): Promise<StudentModel[]> {

  const pathParams = new URLPathParam
  pathParams.append("course-class");
  pathParams.append(course_class_id);
  pathParams.append("students");

  return await clientApi.get<StudentModel[]>(pathParams.toString()); 
}

export async function createStudent(student: StudentModel): Promise<void> {
  console.log(`createStudent ${student}`);
  return await clientApi.post<void>(student);
}

export async function updateStudentAndCoursePrice(student: StudentModel): Promise<void> {
  console.log(`updateStudentAndCoursePrice ${JSON.stringify(student)}`);
  return await clientApi.put("/course-price",student);
}