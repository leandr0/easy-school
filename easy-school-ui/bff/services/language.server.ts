'use server';
import { DashBoardTotalCardsLanguageModel } from "@/app/lib/definitions/dashboard_definition";
import { LanguageModel } from "@/app/lib/definitions/language_definitions";

import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";

const clientApi = bffApiClient.resource('/languages');

// Fetch all students
export async function getAllLanguages(): Promise<LanguageModel[]> {
  return await clientApi.get('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}

// Create a new student
export async function createLanguage(course: LanguageModel): Promise<void> {
  clientApi.post(course);
}

export async function getLanguageTotalStudents(): Promise<DashBoardTotalCardsLanguageModel[]> {
  return clientApi.get("/total-students", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}