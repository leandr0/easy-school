// RevenuesTableDesktop.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import { Switch } from '@/app/dashboard/components/switch';
import RevenueStatus from '../RevenueStatus';
import BRLCurrency from '@/app/dashboard/components/currency';
import { MonthYearFormatter } from '@/app/dashboard/components/month_year_formatter';
import { ActionType } from '@/app/lib/types/revenue';
import { RevenueCourseClassStudentModel } from '@/app/lib/definitions/revenue_course_class_student_definitons';
import { Pagination } from '@/app/dashboard/components/Pagination';


interface RevenuesTableDesktopProps {
  revenues: RevenueModel[];
  setActionType: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setStudentId: React.Dispatch<React.SetStateAction<string | null>>;
  setRevenue: React.Dispatch<React.SetStateAction<RevenueModel | null>>;
  loadRevenueDetails: (studentId: string, revenueId: string) => Promise<RevenueCourseClassStudentModel[]>;
}

export default function RevenuesTableDesktop({
  revenues,
  setActionType,
  setStudentId,
  setRevenue,
  loadRevenueDetails
}: RevenuesTableDesktopProps) {

  const [expandedRows, setExpandedRows] = useState<{ [id: string]: RevenueCourseClassStudentModel[] }>({});
  const [loadingRow, setLoadingRow] = useState<string | null>(null);
  const [localStudentId, setLocalStudentId] = useState<string | null>(null);

  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(5);

  // clamp current page if revenues length changes
  const totalCount = revenues?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!revenues?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return revenues.slice(start, end);
  }, [revenues, page, pageSize]);

  useEffect(() => {
    setStudentId(localStudentId);
  }, [localStudentId, setStudentId]);

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
    if (expandedRows[revenueId]) {
      setExpandedRows(prev => {
        const copy = { ...prev };
        delete copy[revenueId];
        return copy;
      });
    } else {
      try {
        setLoadingRow(revenueId);
        const details = await loadRevenueDetails(studentId, revenueId);
        setExpandedRows(prev => ({ ...prev, [revenueId]: details }));
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoadingRow(null);
      }
    }
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

      {/* Rows (paginated) */}
      <div className="bg-white">
        {currentItems?.map((revenue) => {
          const isExpanded = !!expandedRows[revenue.id!];
          return (
            <div key={revenue.id}>
              <div
                className={`grid grid-cols-12 w-full border-b text-sm last-of-type:border-none transition hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
              >
                <div
                  className="py-3 px-3 col-span-1 flex justify-start items-center cursor-pointer"
                  onClick={() => toggleRow(revenue.student?.id!, revenue.id!)}
                >
                  {loadingRow === revenue.id ? (
                    <span className="animate-pulse">⏳</span>
                  ) : isExpanded ? (
                    <ChevronUp size={16} className="text-blue-600" />
                  ) : (
                    <ChevronDown size={16} className="text-blue-600" />
                  )}
                </div>

                <div className="py-3 pr-3 col-span-2 flex items-center gap-2">
                  <p className="truncate text-sm">{revenue.student?.name}</p>
                </div>

                <div className="py-1 col-span-1 text-center">
                  <MonthYearFormatter month={revenue.month} year={revenue.year} locale="pt-BR" />
                </div>

                <div className="text-center py-3 col-span-2">
                  <BRLCurrency value={revenue.amount ?? 0} />
                </div>

                <div className="px-3 py-3 col-span-1 text-center">
                  <p className="truncate text-xs md:text-sm">{revenue.due_date}</p>
                </div>

                <div className="text-center py-3 col-span-2">
                  <RevenueStatus status={revenue.status || ''} />
                </div>

                <div className="px-3 py-3 col-span-1 text-center">
                  <Switch
                    checked={Boolean(revenue.paid)}
                    onChange={() => handleIdentifyPayment(revenue.student?.id!, revenue)}
                    color="green"
                    disabled={revenue.paid}
                  />
                </div>

                <div className="px-3 py-3 col-span-1 text-center">
                  <Switch
                    checked={Boolean(revenue.reminder_message_sent)}
                    onChange={() => handleSendReminder(revenue.student?.id!, revenue)}
                    color="green"
                    disabled={revenue.paid}
                  />
                </div>

                <div className="px-3 py-3 col-span-1 text-center">
                  <Switch
                    checked={Boolean(revenue.payment_message_sent)}
                    onChange={() => handleSendPaymentRequest(revenue.student?.id!, revenue)}
                    color="green"
                    disabled={revenue.paid}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="col-span-12 text-sm px-6 py-3 border-b bg-white border-t-0">
                  <div className="grid gap-2">
                    {expandedRows[revenue.id!].map((entry, index) => (
                      <div key={index} className="grid grid-cols-12 text-gray-700">
                        <div className="col-span-5 whitespace-nowrap">
                          <strong>Turma:</strong> {entry.course_class?.name ?? "N/A"}
                        </div>
                        <div className="col-span-3 whitespace-nowrap">
                          <strong>Preço:</strong> <BRLCurrency value={entry.course_price ?? 0} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state for current page */}
        {!currentItems?.length && (
          <div className="p-6 text-center text-sm text-gray-500">
            Nenhum registro encontrado.
          </div>
        )}
      </div>

      {/* Pager */}
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </>
  );
}
