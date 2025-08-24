
import { DashBoardGrowthModel, DashBoardTotalCardsLanguageModel, DashBoardTotalCardsModel } from "../lib/definitions/dashboard_definition";


import { externalApiClient } from "../config/clientAPI";

const clientApi = externalApiClient.resource('/dashboard');

// Fetch all students
export async function getTeacherCourseClassLanguageStudent(): Promise<DashBoardTotalCardsModel> {
  return clientApi.get("/cards/total");
}

export async function getGrowthData(): Promise<DashBoardGrowthModel[]> {
  return clientApi.get("/growth");
}