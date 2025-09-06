
import { DashBoardGrowthModel, DashBoardTotalCardsModel } from "@/app/lib/definitions/dashboard_definition";


import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";

const clientApi = bffApiClient.resource('/dashboard');

export async function getTeacherCourseClassLanguageStudent(): Promise<DashBoardTotalCardsModel> {
  return clientApi.get("/cards/total", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}

export async function getGrowthData(): Promise<DashBoardGrowthModel[]> {
  return clientApi.get("/growth", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}