'use server';
import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";

const clientApi = bffApiClient.resource('/courses');

export async function getAllCourses(): Promise<CourseModel[]> {
  return clientApi.get('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function getAllCoursesAvailable(): Promise<CourseModel[]> {
  return clientApi.get("/available", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

export async function findCourse(course_id:any): Promise<CourseModel> {
  return clientApi.get("/"+course_id, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store'} });
}

export async function createCourse(course: CourseModel): Promise<CourseModel> {
  return clientApi.post(course, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}