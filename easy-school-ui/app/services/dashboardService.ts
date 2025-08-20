import { apiClient } from "@/app/config/api";
import { DashBoardGrowthModel, DashBoardTotalCardsLanguageModel, DashBoardTotalCardsModel } from "../lib/definitions/dashboard_definition";

const clientApi = apiClient.resource('/dashboard');

// Fetch all students
export async function getTeacherCourseClassLanguageStudent(): Promise<DashBoardTotalCardsModel> {
  return clientApi.get("/cards/total");
}

export async function getGrowthData(): Promise<DashBoardGrowthModel[]> {
  return clientApi.get("/growth");
}