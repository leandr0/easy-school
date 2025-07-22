import { CourseModel } from "../definitions/courses_definitions";

const API_URL = "http://localhost:8080/courses";

// Fetch all students
export async function getAllCourses(): Promise<CourseModel[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

export async function getAllCoursesAvailable(): Promise<CourseModel[]> {
  const response = await fetch(API_URL+"/available");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

export async function findCourse(course_id:any): Promise<CourseModel> {
  const response = await fetch(API_URL+"/"+course_id);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}



export async function createCourse(course: CourseModel): Promise<CourseModel> {
  console.log(course);
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("Failed to create course");
  }
  return response.json();
}