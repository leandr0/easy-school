import { bffApiClient } from "@/app/config/clientAPI";
import { CalendarWeekDayModel } from "@/app/lib/definitions/calendar_week_day_definitions";
import { URLPathParam } from "@/app/lib/url_path_param";


const clientApi = bffApiClient.resource('/week-days');

export async function getAllWeekDays(): Promise<CalendarWeekDayModel[]> {
    return clientApi.get();
}

export async function getWeekDaysByCourseClass(courseClassId: string): Promise<CalendarWeekDayModel[]> {

    const pathParams = new URLPathParam();
    pathParams.append("course-class");
    pathParams.append(courseClassId);

    return clientApi.get(pathParams.toString());
}