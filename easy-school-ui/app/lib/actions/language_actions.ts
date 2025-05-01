import { LanguageModel } from "../definitions/language_definitions";

const API_URL = "http://localhost:8080/languages";

// Fetch all students
export async function getAllLanguages(): Promise<LanguageModel[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }
  return response.json();
}


// Create a new student
export async function createLanguage(course: LanguageModel): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("Failed to create language");
  }
}