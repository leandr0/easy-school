import { CourseModel } from "../lib/definitions/courses_definitions";
import { apiClient } from "@/app/config/api";

import { externalApiClient } from "../config/clientAPI";

const clientApi = externalApiClient.resource('/courses');

// Fetch all students
export async function getAllCourses(): Promise<CourseModel[]> {
  return clientApi.get();
}

export async function getAllCoursesAvailable(): Promise<CourseModel[]> {
  return clientApi.get("/available");
}

export async function findCourse(course_id:any): Promise<CourseModel> {
  return clientApi.get("/"+course_id);
}



export async function createCourse(course: CourseModel): Promise<CourseModel> {
  return clientApi.post(course);
}