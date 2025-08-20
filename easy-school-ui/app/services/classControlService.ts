
import { apiClient } from "@/app/config/api";
import { ClassControlModel, ClassControlResponseModel } from "../lib/definitions/class_control_definitions";
import { URLPathParam } from "../lib/url_path_param";

const clientApi = apiClient.resource('/class_control');

export async function storeFrequencyClass(data: any): Promise<void> {
  clientApi.post(data);
}

export async function filteringDataRange(startDate: string, endDate: string, courseClassId: number): Promise<ClassControlModel[]> {

  const pathParams = new URLPathParam();
  pathParams.append(courseClassId);
  pathParams.append("course_class");

  const getParams = new URLSearchParams();
  getParams.append("start_date", startDate);
  getParams.append("end_date", endDate);

  return clientApi.get(pathParams.toString() + "?" + getParams.toString());
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
  pathParams.append(courseClassId);
  pathParams.append("course_class");

  const getParams = new URLSearchParams();
  getParams.append("start_day", startDay.toString());
  getParams.append("start_month", startMonth.toString());
  getParams.append("start_year", startYear.toString());

  getParams.append("end_day", endDay.toString());
  getParams.append("end_month", endMonth.toString());
  getParams.append("end_year", endYear.toString());

  return clientApi.get("/control"+pathParams.toString() + "?" + getParams.toString());
}