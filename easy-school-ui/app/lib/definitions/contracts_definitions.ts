import { CoursePriceModel, StudentModel } from "./students_definitions";

// A "contract" is the distinct price a student pays for each of their active
// courses. It reuses the existing student/course-price data (course_class_students
// table) under domain-specific naming for the Financeiro > Contratos page.
export type ContractCourseModel = CoursePriceModel;

export type StudentContractModel = StudentModel & {
  courses?: ContractCourseModel[];
};
