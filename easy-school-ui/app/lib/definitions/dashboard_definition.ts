export type DashBoardTotalCardsModel = {
    total_teacher?: number;
    total_course_class?: number;
    total_language?: number;
    total_student?: number;
  };


export type DashBoardTotalCardsLanguageModel = {
  name: string;
  image_url: string;
  total_students: number;
};


export type DashBoardGrowthModel = {
  total:number;
  month: string;
};