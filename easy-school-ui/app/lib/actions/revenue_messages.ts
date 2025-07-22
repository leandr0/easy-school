import { MessageModel } from "../definitions/messages_definitions";
import { TeacherModel } from "../definitions/teacher_definitions";

import { apiClient } from "@/app/config/api";


const clientApi = apiClient.resource('/revenue/messages');

// Fetch all students
export async function getAllMessages(): Promise<MessageModel> {
  return clientApi.get<MessageModel>();
}


// Create a new student
export async function saveMessages(message: MessageModel): Promise<void> {
  return clientApi.post<void>(message);
}