import { CalendarRangeHourDayModel } from "@/app/lib/definitions/calendat_range_hour_day_definitions";
import { URLPathParam } from "@/app/lib/url_path_param";
import { bffApiClient } from "@/app/config/clientAPI";


const clientApi = bffApiClient.resource('/calendar/range-hour-days');

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

  return await clientApi.get(`/teacher/available?${params.toString()}`);
}

export async function fetchCalendarRangeHourDayByTeacher(teacher_id: any): Promise<CalendarRangeHourDayModel[]> {

  const pathParams = new URLPathParam();
  pathParams.append("teacher");
  pathParams.append(teacher_id);

//const res = await fetch(`/api/calendar/range-hour-days/${teacher_id}`, { method: 'GET', cache: 'no-store' });

  console.log(`/calendar/range-hour-days${pathParams.toString()}`);

  return await clientApi.get(pathParams.toString());
}

export async function deleteRangeHourDayList(ids: string[],): Promise<void> {

  const queryParams = new URLSearchParams();
  queryParams.set("ids", ids.join(','));

  await clientApi.delete("/resources?"+queryParams.toString());
}

export async function createByTeacherId(teacher_id:any, body:CalendarRangeHourDayModel[]): Promise<CalendarRangeHourDayModel[]> {
  
  const pathParams = new URLPathParam();
  pathParams.append("teacher");
  pathParams.append(teacher_id);

  return await clientApi.post(pathParams.toString(),body);
}
