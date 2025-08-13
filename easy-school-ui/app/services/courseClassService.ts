import { CourseClassCompleteModel, CourseClassEditForm, CourseClassModel, CourseClassTeacher, CourseClassTeacherModel, CreateCourseClassModel } from "../lib/definitions/course_class_definitions";

import { apiClient } from "@/app/config/api";
import { URLPathParam } from "../lib/url_path_param";

const clientApi = apiClient.resource('/course/classes');

export async function getAllCourseClass(): Promise<CourseClassTeacherModel[]> {
  return clientApi.get();
}

export async function getAllCourseClassAvailable(): Promise<CourseClassCompleteModel[]> {
  return clientApi.get("/available");
}


export async function getCourseClassById(id:any): Promise<CourseClassCompleteModel> {
  return clientApi.get("/"+id);
}


export async function createCourseClass(course: CreateCourseClassModel): Promise<void> {
  clientApi.post(course);
}

export async function updateCourseClass(course: CreateCourseClassModel): Promise<void> {
  clientApi.put(course);
}

export async function getCourseClassByTeacherId(teacherId: any): Promise<CourseClassTeacher[]> {
  
  const pathParams = new URLPathParam();
  pathParams.append("teacher");
  pathParams.append(teacherId);

  return clientApi.get(pathParams.toString());
}