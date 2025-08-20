import { MessageModel } from "../lib/definitions/messages_definitions";
import { RevenueModel } from "../lib/definitions/revenue_definitions";
import { TeacherModel } from "../lib/definitions/teacher_definitions";

import { apiClient } from "@/app/config/api";
import { URLPathParam } from "../lib/url_path_param";


const clientApi = apiClient.resource('/revenues');

export async function getRevenuesByRangeDate(startMonth:string,startYear:string,endMonth:string,endYear:string): Promise<RevenueModel[]> {
  
  const queryParams = new URLSearchParams();
  queryParams.append("start_month",startMonth);
  queryParams.append("start_year",startYear);
  queryParams.append("end_month",endMonth);
  queryParams.append("end_year",endYear);
  
  return clientApi.get<RevenueModel[]>(`?${queryParams.toString()}`);
}

export async function sendReminderMessage(revenueId: string): Promise<void> {

  const params = new URLPathParam();
  params.append(revenueId);
  params.append("reminder-message");

  clientApi.put<void>(params.toString());

}

export async function sendPaymentMessage(revenueId: string): Promise<void> {

  const params = new URLPathParam();
  params.append(revenueId);
  params.append("payment-message");

  clientApi.put<void>(params.toString());

}

export async function updatePaymentStatus(revenue: RevenueModel): Promise<void> {
  
  const params = new URLPathParam();
  params.append(revenue.id!);
  params.append("payment-status");

  clientApi.put<void>(params.toString(), { status: revenue.status });

}