import { bffApiClient } from "@/app/config/clientAPI";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";

const clientApi = bffApiClient.resource('/courses');

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