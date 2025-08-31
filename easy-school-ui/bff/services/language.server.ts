import { DashBoardTotalCardsLanguageModel } from "@/app/lib/definitions/dashboard_definition";
import { LanguageModel } from "@/app/lib/definitions/language_definitions";

import { bffApiClient } from "@/app/config/clientAPI";

const clientApi = bffApiClient.resource('/languages');

// Fetch all students
export async function getAllLanguages(): Promise<LanguageModel[]> {
  return await clientApi.get();
}

// Create a new student
export async function createLanguage(course: LanguageModel): Promise<void> {
  clientApi.post(course);
}

export async function getLanguageTotalStudents(): Promise<DashBoardTotalCardsLanguageModel[]> {
  return clientApi.get("/total-students");
}