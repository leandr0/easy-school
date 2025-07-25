'use client';

import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import { Switch } from "../../components/switch";
import RevenueStatus from "../RevenueStatus";
import BRLCurrency from "../../components/currency";
import { MonthYearFormatter } from "../../components/month_year_formatter";
import { ActionType } from '@/app/lib/types/revenue';


interface RevenuesTableMobileProps {
  revenues: RevenueModel[];
  setActionType: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setStudentId: React.Dispatch<React.SetStateAction<string | null>>;
  setRevenue: React.Dispatch<React.SetStateAction<RevenueModel | null>>;
}

export default function RevenuesTableMobile({
  revenues,
  setActionType,
  setStudentId,
  setRevenue,
}: RevenuesTableMobileProps) {

  const handleIdentifyPayment = (studentId: string, revenue: RevenueModel) => {
    setActionType('payment_confirmation');
    setStudentId(studentId);
    setRevenue(revenue);
  };

  const handleSendReminder = (studentId: string, revenue: RevenueModel) => {
    setActionType('send_reminder_message');
    setStudentId(studentId);
    setRevenue(revenue);
  };

  const handleSendPaymentRequest = (studentId: string, revenue: RevenueModel) => {
    setActionType('send_payment_message');
    setStudentId(studentId);
    setRevenue(revenue);
  };

  return (
    <div className="space-y-4 mt-6">
      {revenues?.map((revenue) => (
        <div key={revenue.id} className="bg-white shadow rounded-lg p-4 border text-sm space-y-3">
          <div>
            <p className="text-gray-500">Nome</p>
            <p className="font-medium">{revenue.student?.name}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Mês/Ano</p>
              <MonthYearFormatter month={revenue.month} year={revenue.year} locale="pt-BR" />
            </div>
            <div className="text-right">
              <p className="text-gray-500">Valor</p>
              <BRLCurrency value={revenue.amount ?? 0} />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Vencimento</p>
              <p>{revenue.student?.due_date}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Status</p>
              <RevenueStatus status={revenue.status || ""} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">Pago</p>
            <Switch
              checked={Boolean(revenue.paid)}
              onChange={() => handleIdentifyPayment(revenue.student?.id!, revenue)}
              color="green"
              disabled={revenue.paid}
            />
          </div>
          <div>
            <p className="text-gray-500 mb-2">Mensagens</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs">Lembrete</span>
                <Switch
                  checked={Boolean(revenue.reminderMessageSent)}
                  onChange={() => handleSendReminder(revenue.student?.id!, revenue)}
                  color="green"
                  disabled={revenue.paid}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Cobrança</span>
                <Switch
                  checked={Boolean(revenue.paymentMessageSent)}
                  onChange={() => handleSendPaymentRequest(revenue.student?.id!, revenue)}
                  color="green"
                  disabled={revenue.paid}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
