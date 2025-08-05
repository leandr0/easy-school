
import { apiClient } from "@/app/config/api";
import { ClassControlModel } from "../lib/definitions/class_control_definitions";
import { URLPathParam } from "../lib/url_path_param";

const clientApi = apiClient.resource('/class/control');

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

  return clientApi.get(pathParams.toString()+"?"+getParams.toString());
}