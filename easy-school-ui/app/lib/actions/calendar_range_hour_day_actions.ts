import { CalendarWeekDayModel } from "../definitions/calendar_week_day_definitions";
import { CalendarRangeHourDayModel } from "../definitions/calendat_range_hour_day_definitions";

const API_URL = "http://localhost:8080/calendar/range-hour-days";

export async function fetchAvailabilityTeacher(
    calendar_week_day_ids: string[],
    language_id: number,
    start_hour: number,
    start_minute: number,
    end_hour: number,
    end_minute: number
  ): Promise<CalendarRangeHourDayModel[]> {


    const params = new URLSearchParams();
    calendar_week_day_ids.forEach(id => params.append("calendar_week_day_ids", id));
    params.append("language_id", language_id.toString());
    params.append("start_hour", start_hour.toString());
    params.append("start_minute", start_minute.toString());
    params.append("end_hour", end_hour.toString());
    params.append("end_minute", end_minute.toString());
  
    const response = await fetch(`${API_URL}?${params.toString()}`);
  
    if (!response.ok) {
      throw new Error("Failed to fetch availability");
    }
  
    return await response.json();
  }
  