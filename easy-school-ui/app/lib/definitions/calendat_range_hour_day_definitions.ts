import { CalendarWeekDayModel } from "./calendar_week_day_definitions";
import { TeacherModel } from "./teacher_definitions";

export type CalendarRangeHourDayModel = {
  id?: string;
  uddi?: string;
  week_day?: CalendarWeekDayModel;
  start_hour?: string;
  start_minute?: string;
  end_hour?: string;
  end_minute?: string;
  teacher?: TeacherModel;
};