import { RevenueModel } from "@/app/lib/definitions/revenue_definitions";
import { URLPathParam } from "@/app/lib/url_path_param";

import { bffApiClient } from "@/app/config/clientAPI";

const clientApi = bffApiClient.resource('/revenues');

export async function getRevenuesByRangeDate(startMonth:string,startYear:string,endMonth:string,endYear:string): Promise<RevenueModel[]> {
  
  const queryParams = new URLSearchParams();
  queryParams.append("start_month",startMonth);
  queryParams.append("start_year",startYear);
  queryParams.append("end_month",endMonth);
  queryParams.append("end_year",endYear);
  
  return await clientApi.get<RevenueModel[]>(`/date-range?${queryParams.toString()}`);
}

export async function sendReminderMessage(revenueId: string): Promise<void> {

  const params = new URLPathParam();
  params.append(revenueId);
  params.append("reminder-message");

  await clientApi.put<void>(params.toString());

}

export async function sendPaymentMessage(revenueId: string): Promise<void> {

  const params = new URLPathParam();
  params.append(revenueId);
  params.append("payment-message");

  await clientApi.put<void>(params.toString());

}

export async function updatePaymentStatus(revenue: RevenueModel): Promise<void> {
  
  const params = new URLPathParam();
  params.append(revenue.id!);
  params.append("payment-status");

  await clientApi.put<void>(params.toString(), { status: revenue.status });

}