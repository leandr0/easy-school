import { CourseClassCompleteModel, CourseClassEditForm, CourseClassModel, CourseClassTeacherModel, CreateCourseClassModel } from "../lib/definitions/course_class_definitions";

import { apiClient } from "@/app/config/api";

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