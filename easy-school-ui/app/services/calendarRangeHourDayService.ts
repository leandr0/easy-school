import { CalendarRangeHourDayModel } from "../lib/definitions/calendat_range_hour_day_definitions";

import { apiClient } from "@/app/config/api";

const clientApi = apiClient.resource('/calendar/range-hour-days');

export async function fetchAvailabilityTeacher(
    calendar_week_day_ids: string[],
    language_id: number,
    start_hour: number,
    start_minute: number,
    end_hour: number,
    end_minute: number
  ): Promise<CalendarRangeHourDayModel[]> {


    const params = new URLSearchParams();
    params.set("calendar_week_day_ids", calendar_week_day_ids.join(','));
    params.append("language_id", language_id.toString());
    params.append("start_hour", start_hour.toString());
    params.append("start_minute", start_minute.toString());
    params.append("end_hour", end_hour.toString());
    params.append("end_minute", end_minute.toString());
  
    return await clientApi.get(`?${params.toString()}`);
  }
  