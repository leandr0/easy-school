import { StudentCoursePriceModel, StudentModel } from "../lib/definitions/students_definitions";
import { apiClient } from "@/app/config/api";
import { URLPathParam } from "@/app/lib/url_path_param"

import { externalApiClient } from "../config/clientAPI";

const clientApi = externalApiClient.resource('/students');

export async function getAllStudents(): Promise<StudentModel[]> {
  return clientApi.get<StudentModel[]>();
}

export async function findById(id:any): Promise<StudentModel> {  
  return clientApi.get<StudentModel>('/'+id); 
}

export async function findByIdCoursePrice(id:any): Promise<StudentCoursePriceModel> {  

  const params = new URLPathParam();
  params.append(id);
  params.append("course-price");

  return clientApi.get<StudentCoursePriceModel>(params.toString()); 
}

export async function getStudentsNotInCourseClass(course_class_id:any): Promise<StudentModel[]> {

  const params = new URLSearchParams();
  params.append("not_in_course_class", course_class_id.toString());

  return clientApi.get<StudentModel[]>('?'+params.toString()); 
}

export async function getStudentsInCourseClass(course_class_id:any): Promise<StudentModel[]> {

  const params = new URLSearchParams();
  params.append("in_course_class", course_class_id.toString());

  return clientApi.get<StudentModel[]>('?'+params.toString()); 
}

export async function createStudent(student: StudentModel): Promise<void> {
  return clientApi.post<void>(student);
}

export async function updateStudentAndCoursePrice(student: StudentModel): Promise<void> {
  return clientApi.put("/course-price",student);
}