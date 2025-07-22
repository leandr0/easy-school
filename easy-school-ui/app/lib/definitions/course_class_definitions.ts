import { CalendarWeekDayModel } from "./calendar_week_day_definitions";
import { CourseModel } from "./courses_definitions";
import { LanguageModel } from "./language_definitions";
import { StudentModel } from "./students_definitions";
import { TeacherModel } from "./teacher_definitions";

export type CourseClassModel = {
    id?: string;
    course_id?: string;
    name?: string;
    teacher_id?: string,
    status?:boolean,
    start_hour?: string;
    start_minute?: string;
    duration_hour?: string;
    duration_minute?: string;
    language?: LanguageModel;
  };

export type CreateCourseClassModel = {
    id?: string;
    course_id?: string;
    name?: string;
    teacher_id?: string,
    status?:boolean,
    start_hour?: string;
    start_minute?: string;
    duration_hour?: string;
    duration_minute?: string;
    language?: LanguageModel;
    week_day_ids?: string[];
  };


  export type CourseClassCreateForm ={
    course_class?: CreateCourseClassModel;
    week_days?: CalendarWeekDayModel[];
    week_day_ids?: string[];
    language_id?: string;
  }

  export type CourseClassCompleteModel={
    id?: string;
    course:CourseClassModel, 
    name?: string;
    //teacher_id?: string,
    teacher: TeacherModel,
    status?:boolean,
    start_hour?: string;
    start_minute?: string;
    duration_hour?: string;
    duration_minute?: string;
    language: LanguageModel;

  }


  export type CourseClassEditForm ={
    course_class?: CourseClassCompleteModel;
    week_days?: CalendarWeekDayModel[];
    teacher?: TeacherModel;
    week_day_ids?: string[];
  }

  export type CourseClassTeacherModel = {
    id?: string;
    course: CourseModel
    name?: string;
    teacher?: TeacherModel,
    status?:boolean,
  };


  export type CourseClassAddStudentsForm = {
    id?: string;
    course?: CourseModel;
    name?: string;
    teacher?: TeacherModel,
    status?:boolean,
    student?:StudentModel,
  };