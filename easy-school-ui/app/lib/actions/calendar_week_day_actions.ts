import { CalendarWeekDayModel } from "../definitions/calendar_week_day_definitions";

const API_URL = "http://localhost:8080/week-days";

// Fetch all students
export async function getAllWeekDays(): Promise<CalendarWeekDayModel[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

export async function getWeekDaysByCourseClass(courseClassId: string): Promise<CalendarWeekDayModel[]> {

  const response = await fetch(API_URL+"/"+courseClassId+"/course-class");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}