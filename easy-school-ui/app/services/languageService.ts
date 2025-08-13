import { LanguageModel } from "../lib/definitions/language_definitions";
import { apiClient } from "@/app/config/api";

const clientApi = apiClient.resource('/languages');

// Fetch all students
export async function getAllLanguages(): Promise<LanguageModel[]> {
  return await clientApi.get();
}


// Create a new student
export async function createLanguage(course: LanguageModel): Promise<void> {
  clientApi.post(course);
}