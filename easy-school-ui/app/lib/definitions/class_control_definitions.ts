import { CourseClassModel } from "./course_class_definitions";
import { StudentModel } from "./students_definitions";
import { TeacherModel } from "./teacher_definitions";

export type ClassControlModel = {
    id?: number;
    day?: number;
    month?: number;
    year?: number;
    replacement?: boolean;
    content?: string;
    teacher_id?: number;
    course_class_id?: number;
    students?: number[];
    course_class?: CourseClassModel;
  };

  export type ClassControlResponseModel = {
    class_control?: ClassControlModel;
    students?: StudentModel[];
    teacher?: TeacherModel;

  };