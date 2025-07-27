import { CourseClassModel } from "./course_class_definitions";
import { StudentModel } from "./students_definitions";

export type CreateCourseClassStudentModel = {
    
    course_class_id?: string;
    student_ids?: string[]
  };


 export type CourseClassStudentModel = {
    
    id?: string;
    course_price?: number;
    course_class: CourseClassModel;
    student: StudentModel;

 } 