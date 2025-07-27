import { CourseClassStudentModel, CreateCourseClassStudentModel } from "../lib/definitions/course_class_students_definitions";
import { apiClient } from "@/app/config/api";

const clientApi = apiClient.resource('/course_class_students');

import { URLPathParam } from "../lib/url_path_param";


export async function createCourseClassStudent(model: CreateCourseClassStudentModel): Promise<void> {
  clientApi.post("/student-list",model);
}

export async function deleteByStudentAndCourseClass(student_id: any, course_class_id: any): Promise<void> {
  
  const params = new URLPathParam();
  params.append(student_id);  
  params.append("student");
  params.append(course_class_id);  
  params.append("course-class");

  clientApi.delete(params.toString());
  
}

export async function getByStudentId (student_id: any): Promise<CourseClassStudentModel[]> {

  const params = new URLPathParam();
  params.append(student_id);  
  params.append("student");


  return clientApi.get(params.toString());
  
}
