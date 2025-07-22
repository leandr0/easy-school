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
    name?: string;
    course_price?: string;    
  };

  export type StudentCoursePriceModel =  StudentModel & {
    courses?: CoursePriceModel[];
  };