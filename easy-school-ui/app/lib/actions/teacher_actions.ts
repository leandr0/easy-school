import { TeacherModel } from "../definitions/teacher_definitions";


const API_URL = "http://localhost:8080/teachers";

// Fetch all students
export async function getAllTeachers(): Promise<TeacherModel[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return response.json();
}

export async function getAllTeachersAvailable(): Promise<TeacherModel[]> {
  const response = await fetch(API_URL+"/available");
  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return response.json();
}

export async function getAllTeachersAvailableByLanguage(language_id:any): Promise<TeacherModel[]> {
  const response = await fetch(API_URL+"/available?language="+language_id);
  if (!response.ok) {
    throw new Error("Failed to fetch teachers by language");
  }
  return response.json();
}

export async function getAllTeachersAvailableByLanguageFromCourseClass(course_class_id:any): Promise<TeacherModel[]> {
  const response = await fetch(API_URL+"/available?course_class="+course_class_id);
  if (!response.ok) {
    throw new Error("Failed to fetch teachers by language");
  }
  return response.json();
}

// Create a new student
export async function createTeacher(teacher: TeacherModel): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacher),
  });

  if (!response.ok) {
    throw new Error("Failed to create teacher");
  }
}