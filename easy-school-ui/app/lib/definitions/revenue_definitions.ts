import { StudentModel } from "./students_definitions";

export type RevenueModel = {
    id?: string;
    paid?: boolean;
    status?: string;
    reminder_message_sent?: boolean;
    payment_message_sent?: boolean;
    year?: number;
    month?: number;
    amount?: number;
    student?: StudentModel;
    due_date?: number;
  };