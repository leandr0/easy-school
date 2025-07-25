import { StudentModel } from "./students_definitions";

export type RevenueModel = {
    id?: string;
    paid?: boolean;
    status?: string;
    reminderMessageSent?: boolean;
    paymentMessageSent?: boolean;
    year?: number;
    month?: number;
    amount?: number;
    student?: StudentModel;
  };