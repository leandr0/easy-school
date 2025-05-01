import { LanguageModel } from "./language_definitions";

export type CourseModel = {
    id?: string;
    name?: string;
    status?: boolean,
    language?: LanguageModel,
  };