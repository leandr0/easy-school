
import { DashBoardGrowthModel, DashBoardTotalCardsLanguageModel, DashBoardTotalCardsModel } from "@/app/lib/definitions/dashboard_definition";


import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders, requireAuth } from "@/app/lib/authz.server";

const clientApi = bffApiClient.resource('/dashboard');

export async function getTeacherCourseClassLanguageStudent(): Promise<DashBoardTotalCardsModel> {
  await requireAuth(['ADMIN','TEACHER','STUDENT']);
  return clientApi.get("/cards/total", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}

export async function getGrowthData(): Promise<DashBoardGrowthModel[]> {
    await requireAuth(['ADMIN','TEACHER','STUDENT']);
  return await clientApi.get("/growth", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}

export async function getLanguageTotalStudents(): Promise<DashBoardTotalCardsLanguageModel[]> {
  return clientApi.get("/languages/total-students", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}