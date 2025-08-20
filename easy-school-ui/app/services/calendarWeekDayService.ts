import { CalendarWeekDayModel } from "../lib/definitions/calendar_week_day_definitions";

import { apiClient } from "@/app/config/api";

const clientApi = apiClient.resource('/week-days');

export async function getAllWeekDays(): Promise<CalendarWeekDayModel[]> {
  return clientApi.get();
}

export async function getWeekDaysByCourseClass(courseClassId: string): Promise<CalendarWeekDayModel[]> {
  return clientApi.get("/"+courseClassId+"/course-class");
}