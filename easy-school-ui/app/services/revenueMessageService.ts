import { MessageModel } from "../lib/definitions/messages_definitions";
import { TeacherModel } from "../lib/definitions/teacher_definitions";

import { apiClient } from "@/app/config/api";
import { URLPathParam } from "../lib/url_path_param";


const clientApi = apiClient.resource('/revenue/messages');

// Fetch all students
export async function getAllMessages(): Promise<MessageModel> {
  return clientApi.get<MessageModel>();
}


// Create a new student
export async function saveMessages(message: MessageModel): Promise<void> {
  return clientApi.post<void>(message);
}



export async function getReminderMessage(student_id: string): Promise<string> {

  const params = new URLPathParam();
    params.append("reminder-message");
    params.append("student");
    params.append(student_id);
    params.append("link");

  return clientApi.get<string>(params.toString());
}

export async function getPaymentMessage(student_id: string): Promise<string> {

  const params = new URLPathParam();
    params.append("payment-message");
    params.append("student");
    params.append(student_id);
    params.append("link");

  return clientApi.get<string>(params.toString());
}