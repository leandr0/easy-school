import { StudentModel } from "../definitions/students_definitions";

const API_URL = "http://localhost:8080/students";

// Fetch all students
export async function getAllStudents(): Promise<StudentModel[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  return response.json();
}


// Fetch all students
export async function getStudentsNotInCourseClass(course_class_id:any): Promise<StudentModel[]> {
  const response = await fetch(API_URL+"?not_in_course_class="+course_class_id);
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  return response.json();
}

export async function getStudentsInCourseClass(course_class_id:any): Promise<StudentModel[]> {
  const response = await fetch(API_URL+"?in_course_class="+course_class_id);
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  return response.json();
}

// Create a new student
export async function createStudent(student: StudentModel): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error("Failed to create student");
  }
}