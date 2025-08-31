
import { DashBoardGrowthModel, DashBoardTotalCardsModel } from "@/app/lib/definitions/dashboard_definition";


import { bffApiClient } from "@/app/config/clientAPI";

const clientApi = bffApiClient.resource('/dashboard');

export async function getTeacherCourseClassLanguageStudent(): Promise<DashBoardTotalCardsModel> {
  return clientApi.get("/cards/total");
}

export async function getGrowthData(): Promise<DashBoardGrowthModel[]> {
  return clientApi.get("/growth");
}