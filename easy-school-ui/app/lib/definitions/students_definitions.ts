export type StudentModel = {
    id?: string;
    name?: string;
    phone_number?: string;
    email?: string,
    status?: boolean,
    due_date?: string,
    start_date?: string,
  };

  export type CoursePriceModel = {
    id?: string;
    name?: string;
    course_price?: number;    
  };

  export type StudentCoursePriceModel =  StudentModel & {
    courses?: CoursePriceModel[];
  };