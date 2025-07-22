import { TeacherModel } from "../definitions/teacher_definitions";

import { apiClient } from "@/app/config/api";



const clientApi = apiClient.resource('/teachers');

// Fetch all students
export async function getAllTeachers(): Promise<TeacherModel[]> {
  return clientApi.get<TeacherModel[]>();
}

export async function getAllTeachersAvailable(): Promise<TeacherModel[]> {
  return clientApi.get<TeacherModel[]>("/available");
}

export async function getAllTeachersAvailableByLanguage(language_id: any): Promise<TeacherModel[]> {

  const params = new URLSearchParams();
  params.append("language", language_id.toString());

  return clientApi.get<TeacherModel[]>('/available?' + params.toString());
}

export async function getAllTeachersAvailableByLanguageFromCourseClass(course_class_id: any): Promise<TeacherModel[]> {

  const params = new URLSearchParams();
  params.append("course_class", course_class_id.toString());

  return clientApi.get<TeacherModel[]>('/available?' + params.toString());
}

// Create a new student
export async function createTeacher(teacher: TeacherModel): Promise<void> {
  return clientApi.post<void>(teacher);
}