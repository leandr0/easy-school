'use server';
import { ClassControlModel, ClassControlResponseModel } from "@/app/lib/definitions/class_control_definitions";
import { URLPathParam } from "@/app/lib/url_path_param";

import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";
import { HttpError } from "@/app/config/api";

const clientApi = bffApiClient.resource('/class-control');

export async function storeFrequencyClass(data: any): Promise<void> {

  await clientApi.post(data, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json' } });
}

export async function filteringDataRange(startDate: string, endDate: string, courseClassId: number): Promise<ClassControlModel[]> {

  try {
    
    const pathParams = new URLPathParam();
    pathParams.append("course-class");
    pathParams.append(courseClassId);

    const getParams = new URLSearchParams();
    getParams.append("start_date", startDate);
    getParams.append("end_date", endDate);

    return await clientApi.get<ClassControlModel[]>(pathParams.toString() + "?" + getParams.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
  }
  catch (error: any) {
    if (error instanceof HttpError && error.status === 404) return [];
    return error(error.status, error.message);
  } 
}


export async function controlFilteringDataRange(startDate: string, endDate: string, courseClassId: number): Promise<ClassControlResponseModel[]> {

  const startDateObj = new Date(startDate);

  const startYear = startDateObj.getFullYear();
  const startMonth = startDateObj.getMonth() + 1;
  const startDay = startDateObj.getDate();

  const endDateObj = new Date(endDate);

  const endYear = endDateObj.getFullYear();
  const endMonth = endDateObj.getMonth() + 1;
  const endDay = endDateObj.getDate();

  const pathParams = new URLPathParam();
  pathParams.append("course-class");
  pathParams.append(courseClassId);

  const getParams = new URLSearchParams();
  getParams.append("start_day", startDay.toString());
  getParams.append("start_month", startMonth.toString());
  getParams.append("start_year", startYear.toString());

  getParams.append("end_day", endDay.toString());
  getParams.append("end_month", endMonth.toString());
  getParams.append("end_year", endYear.toString());

  return await clientApi.get("/control" + pathParams.toString() + "?" + getParams.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}