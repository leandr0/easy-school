import { CourseClassCompleteModel, CourseClassModel, CourseClassTeacherModel, CreateCourseClassModel } from "../definitions/course_class_definitions";


const API_URL = "http://localhost:8080/course/classes";

// Fetch all students
export async function getAllCourseClass(): Promise<CourseClassTeacherModel[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses class");
  }
  return response.json();
}


export async function getCourseClassById(id:any): Promise<CourseClassCompleteModel> {
  const response = await fetch(API_URL+"/"+id);
  if (!response.ok) {
    throw new Error("Failed to fetch courses class");
  }
  return response.json();
}


export async function createCourseClass(course: CreateCourseClassModel): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("Failed to create course class");
  }
}

export async function updateCourseClass(course: CourseClassModel): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("Failed to create course class");
  }
}