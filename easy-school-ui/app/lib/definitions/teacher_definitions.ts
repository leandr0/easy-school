import { CalendarWeekDayModel } from "./calendar_week_day_definitions";
import { CalendarRangeHourDayModel } from "./calendat_range_hour_day_definitions";
import { LanguageModel } from "./language_definitions";

export type TeacherModel = {
    id?: string;
    name?: string;
    phone_number?: string;
    email?: string;
    status?: boolean;
    compensation?: string;
    start_date?: string;
    languages?:LanguageModel[];
    language_ids?:string[];
    calendar_range_hour_days?:CalendarRangeHourDayModel[];
  };

export type TeacherUpdateModel = {
    id?: string;
    name?: string;
    phone_number?: string;
    email?: string;
    status?: boolean;
    compensation?: string;
    start_date?: string;
    languages:LanguageModel[];
    language_ids:string[];
    calendar_range_hour_days:CalendarRangeHourDayModel[];
  };

  export type CreateTeacherFormModel = {
    id?: string,
    name?: string,
    phone_number?: string,
    email?: string,
    status?: boolean,
    compensation?: string,
    start_date?: string,
    language_ids:string[],
    week_day?:CalendarWeekDayModel;
    start_hour?: string;
    start_minute?: string;
    end_hour?: string;
    end_minute?: string;
  };

  export type TeacherWeekDayAvailableModel = {
    id?:string;
    uddi?:string;
    week_day?:CalendarWeekDayModel;
    start_hour?: string;
    start_minute?: string;
    end_hour?: string;
    end_minute?: string;
  };
