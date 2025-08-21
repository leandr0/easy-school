import { Revenue } from "../definitions";
import { CourseClassModel } from "./course_class_definitions";
import { StudentModel } from "./students_definitions";

 export type RevenueCourseClassStudentModel = {
    
    id?: string;
    course_price?: number;
    student: StudentModel;
    revenue: Revenue;
    course_class:CourseClassModel;

 } 