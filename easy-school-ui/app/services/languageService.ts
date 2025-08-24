import { DashBoardTotalCardsLanguageModel } from "../lib/definitions/dashboard_definition";
import { LanguageModel } from "../lib/definitions/language_definitions";
import { apiClient } from "@/app/config/api";

import { externalApiClient } from "../config/clientAPI";

const clientApi = externalApiClient.resource('/languages');

// Fetch all students
export async function getAllLanguages(): Promise<LanguageModel[]> {
  return await clientApi.get();
}


// Create a new student
export async function createLanguage(course: LanguageModel): Promise<void> {
  clientApi.post(course);
}

export async function getLanguageTotalStudents(): Promise<DashBoardTotalCardsLanguageModel[]> {
  return clientApi.get("/total_students");
}