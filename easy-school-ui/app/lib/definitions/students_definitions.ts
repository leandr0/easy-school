import { UserModel } from "./user_definitions";

export type StudentModel = {
    id?: string;    
    due_date?: string,
    user?: UserModel | null;
  };

  export type CoursePriceModel = {
    id?: string;
    name?: string;
    course_price?: number;    
  };

  export type StudentCoursePriceModel =  StudentModel & {
    courses?: CoursePriceModel[];
  };