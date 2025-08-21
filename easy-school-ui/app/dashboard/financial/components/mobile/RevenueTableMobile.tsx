'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import { CourseClassStudentModel } from '@/app/lib/definitions/course_class_students_definitions';
import { Switch } from '@/app/dashboard/components/switch';
import RevenueStatus from "../RevenueStatus";
import BRLCurrency from '@/app/dashboard/components/currency';
import { MonthYearFormatter } from '@/app/dashboard/components/month_year_formatter';
import { ActionType } from '@/app/lib/types/revenue';
import { RevenueCourseClassStudentModel } from '@/app/lib/definitions/revenue_course_class_student_definitons';

interface RevenuesTableMobileProps {
  revenues: RevenueModel[];
  setActionType: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setStudentId: React.Dispatch<React.SetStateAction<string | null>>;
  setRevenue: React.Dispatch<React.SetStateAction<RevenueModel | null>>;
  loadRevenueDetails: (studentId: string, revenueId: string) => Promise<RevenueCourseClassStudentModel[]>;
}

export default function RevenuesTableMobile({
  revenues,
  setActionType,
  setStudentId,
  setRevenue,
  loadRevenueDetails
}: RevenuesTableMobileProps) {
  const [expanded, setExpanded] = useState<{ [key: string]: CourseClassStudentModel[] }>({});
  const [loadingRow, setLoadingRow] = useState<string | null>(null);

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

  const toggleRow = async (studentId: string, revenueId: string) => {
    if (expanded[revenueId]) {
      setExpanded(prev => {
        const copy = { ...prev };
        delete copy[revenueId];
        return copy;
      });
    } else {
      try {
        setLoadingRow(revenueId);
        const details = await loadRevenueDetails(studentId,revenueId);
        setExpanded(prev => ({ ...prev, [revenueId]: details }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRow(null);
      }
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {revenues?.map((revenue) => {
        const isExpanded = !!expanded[revenue.id!];
        return (
          <div key={revenue.id} className="bg-white shadow rounded-lg p-4 border text-sm space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleRow(revenue.student?.id!, revenue.id!)}>
              <p className="font-medium">{revenue.student?.name}</p>
              {loadingRow === revenue.id ? (
                <span className="animate-pulse">⏳</span>
              ) : isExpanded ? (
                <ChevronUp size={16} className="text-blue-600" />
              ) : (
                <ChevronDown size={16} className="text-blue-600" />
              )}
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
                <p>{revenue.due_date}</p>
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
                    checked={Boolean(revenue.reminder_message_sent)}
                    onChange={() => handleSendReminder(revenue.student?.id!, revenue)}
                    color="green"
                    disabled={revenue.paid}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Cobrança</span>
                  <Switch
                    checked={Boolean(revenue.payment_message_sent)}
                    onChange={() => handleSendPaymentRequest(revenue.student?.id!, revenue)}
                    color="green"
                    disabled={revenue.paid}
                  />
                </div>
              </div>
            </div>

                {isExpanded && (
              <div className="mt-4 space-y-2 text-gray-700 bg-gray-50 rounded-md px-4 py-3 border border-gray-200">
                {expanded[revenue.id!].map((entry, index) => (
                  <div key={index} className={`flex flex-col sm:flex-row gap-2 ${index !== 0 ? 'border-t border-gray-200 pt-2' : ''}`}>
                    <div className="flex gap-1"><strong>Turma:</strong><span>{entry.course_class?.name ?? 'N/A'}</span></div>
                    <div className="flex gap-1"><strong>Preço:</strong><span><BRLCurrency value={entry.course_price ?? 0} /></span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}