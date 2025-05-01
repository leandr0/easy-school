import { CreateCourseClassStudentModel } from "../definitions/course_class_students_definitions";


const API_URL = "http://localhost:8080/course_class_students";




// Create a new student
export async function createCourseClassStudent(model: CreateCourseClassStudentModel): Promise<void> {
  const response = await fetch(API_URL+"/student-list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  });

  if (!response.ok) {
    throw new Error("Failed to create course class");
  }
}


export async function deleteByStudentAndCourseClass(student_id: any, course_class_id: any): Promise<void> {
  const response = await fetch(API_URL+"/"+student_id+"/student/"+course_class_id+"/course-class", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to create course class");
  }
}