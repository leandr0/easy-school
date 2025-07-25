'use client';
import { useState, useEffect } from 'react';
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import { Switch } from '../../components/switch'; 
import RevenueStatus from '../RevenueStatus';
import BRLCurrency from '../../components/currency';
import { MonthYearFormatter } from '../../components/month_year_formatter';
import { ActionType } from '@/app/lib/types/revenue';


// Define the props interface
interface RevenuesTableDesktopProps {
  revenues: RevenueModel[];
  setActionType: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setStudentId: React.Dispatch<React.SetStateAction<string | null>>;
  setRevenue: React.Dispatch<React.SetStateAction<RevenueModel | null>>;
}

export default function RevenuesTableDesktop({
  revenues,
  setActionType,
  setStudentId,
  setRevenue,
}: RevenuesTableDesktopProps) {

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localStudentId, setLocalStudentId] = useState<string | null>(null);

  const toggleExpanded = (id: string, currentStudentId: string | undefined) => {
    setExpandedId(prev => prev === id ? null : id);
    setLocalStudentId(currentStudentId ?? null);
  };

  // 🔁 Só notifica o componente pai após a renderização
  useEffect(() => {
    if (expandedId && localStudentId) {
      setStudentId(localStudentId);
    } else {
      setStudentId(null);
    }
  }, [expandedId, localStudentId, setStudentId]);

  // Handler for the "Identificar Pagamento" button
  const handleIdentifyPayment = (studentId: string, revenue: RevenueModel) => {
    setActionType('payment_confirmation'); // This will trigger the payment confirmation flow
    setStudentId(studentId);
    setRevenue(revenue);
    setExpandedId(null); // Close the expanded row after action
  };

  // Handler for "Enviar Mensagem de Lembrete"
  const handleSendReminder = (studentId: string, revenue: RevenueModel) => {
    setActionType('send_reminder_message');
    setStudentId(studentId);
    setRevenue(revenue);
    setExpandedId(null); // Close the expanded row after action
  };

  // Handler for "Enviar Mensagem de Cobrança" 
  const handleSendPaymentRequest = (studentId: string, revenue: RevenueModel) => {
    setActionType('send_payment_message');
    setStudentId(studentId);
    setRevenue(revenue);
    setExpandedId(null); // Close the expanded row after action
  };

  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-12 text-left text-sm font-normal bg-gray-50 text-center rounded-lg">
        <div className="px-4 py-3 font-medium sm:pl-6 border-b col-span-3">Nome</div>
        <div className="px-3 py-3 font-medium border-b col-span-1">Mês/Ano</div>
        <div className="px-3 py-3 font-medium border-b col-span-2">Valor</div>
        <div className="px-3 py-3 font-medium border-b col-span-1">Vencimento</div>
        <div className="px-3 py-3 font-medium border-b col-span-2">Status</div>
        <div className="px-3 py-3 font-medium border-b col-span-1">Pago</div>
        <div className="col-span-2 px-3 py-3 border-b flex flex-col justify-start items-center">
          <div className="font-medium text-sm leading-tight">Mensagens</div>
          <div className="grid grid-cols-2 gap-1 mt-1 w-full text-xs font-normal">
            <div className="border rounded p-1 bg-white">Lembrete</div>
            <div className="border rounded p-1 bg-white">Cobrança</div>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="bg-white">
        {revenues?.map((revenue) => {

          return (
            <div key={revenue.id}>
              {/* Data Row */}
              <div
                className={`grid grid-cols-12 w-full border-b text-sm last-of-type:border-none transition 
                  cursor-pointer hover:bg-gray-100 `}
              >
                <div className="py-3 pl-6 pr-3 col-span-3 flex items-center gap-2">
                  <p className="truncate text-sm">{revenue.student?.name}</p>
                </div>

                <div className="px-3 py-1 col-span-1 text-center">
                  <MonthYearFormatter
                    month={revenue.month}
                    year={revenue.year}
                    locale="pt-BR"
                  />
                </div>
                <div className="text-center py-3 col-span-2">
                  <BRLCurrency value={revenue.amount ?? 0} />
                </div>
                <div className="px-3 py-3 col-span-1 text-center">
                  <p className="truncate text-xs md:text-sm">
                    {revenue.student?.due_date}
                  </p>
                </div>
                <div className="text-center py-3 col-span-2">
                  <RevenueStatus status={revenue.status || ''} />
                </div>
                <div className="px-3 py-3 col-span-1 text-center">
                  <Switch checked={Boolean(revenue.paid)} onChange={() => { handleIdentifyPayment(revenue.student?.id!, revenue)}} color="green" disabled={revenue.paid}/>
                </div>
                <div className="px-3 py-3 col-span-1 text-center">
                  <Switch checked={Boolean(revenue.reminderMessageSent)} onChange={() => { handleSendReminder(revenue.student?.id!, revenue)}} color="green" disabled={revenue.paid}/>
                </div>
                <div className="px-3 py-3 col-span-1 text-center">
                  <Switch checked={Boolean(revenue.paymentMessageSent)} onChange={() => {handleSendPaymentRequest(revenue.student?.id!, revenue) }} color="green" disabled={revenue.paid}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}