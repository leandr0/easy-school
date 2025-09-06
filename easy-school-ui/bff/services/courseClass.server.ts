'use server';
import { CourseClassCompleteModel, CourseClassEditForm, CourseClassModel, CourseClassTeacher, CourseClassTeacherModel, CreateCourseClassModel } from "@/app/lib/definitions/course_class_definitions";
import { URLPathParam } from "@/app/lib/url_path_param";
import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";

const clientApi = bffApiClient.resource('/course-class');

export async function getAllCourseClass(): Promise<CourseClassTeacherModel[]> {
  return clientApi.get('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function getAllCourseClassAvailable(): Promise<CourseClassCompleteModel[]> {
  return clientApi.get("/available", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}


export async function getCourseClassById(id:any): Promise<CourseClassCompleteModel> {
  return clientApi.get("/"+id, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}


export async function createCourseClass(course: CreateCourseClassModel): Promise<void> {
  clientApi.post(course, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json'} });
}

export async function updateCourseClass(course: CreateCourseClassModel): Promise<void> {
  clientApi.put(course, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json'} });
}

export async function getCourseClassByTeacherId(teacherId: any): Promise<CourseClassTeacher[]> {
  
  const pathParams = new URLPathParam();
  pathParams.append("teacher");
  pathParams.append(teacherId);
  

  return clientApi.get(pathParams.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}