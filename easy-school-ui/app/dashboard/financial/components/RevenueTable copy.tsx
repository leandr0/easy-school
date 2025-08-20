// RevenuesTable.tsx
'use client';

import React, { useEffect, useState, useCallback } from "react";
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import { getRevenuesByRangeDate, sendPaymentMessage, sendReminderMessage, updatePaymentStatus } from '@/app/services/revenueService';

import RevenuesTableDesktop from "./desktop/RevenueTableDesktop";
import RevenuesTableMobile from './mobile/RevenueTableMobile';
import { getReminderMessage, getPaymentMessage } from "@/app/services/revenueMessageService";
import RevenueLinkModal from "./desktop/RevenueLinkModal";
import RevenuePaymentIdentifiedModal from "./desktop/RevenuePaymentIdentifiedModal";
import RevenuePaymentIdentifiedModalMobile from "./mobile/RevenuePaymentIdentifiedModalMobile";
import RevenueLinkModalMobile from "./mobile/RevenueLinkModalMobile";
import { ActionType } from "@/app/lib/types/revenue";
import { getByStudentId } from "@/app/services/courseClassStudentService";
import { CourseClassStudentModel } from "@/app/lib/definitions/course_class_students_definitions";
import RevenueMonthRangeFilter, { MonthRange } from "./RevenueMonthRangeFilter";

export default function RevenuesTable() {

  const [revenues, setRevenues] = useState<RevenueModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<RevenueModel | null>(null);

  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkToDisplay, setLinkToDisplay] = useState<string | null>(null);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [revenueToConfirm, setRevenueToConfirm] = useState<RevenueModel | null>(null);

  const loadRevenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // For real scenario
      const year = String(now.getFullYear());                   // "2025"

      const data = await getRevenuesByRangeDate(month, year, month, year);
      setRevenues(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsModalLoading(false);
    }
  }, []);

  const loadRevenueDetails = useCallback(async (studentId: string): Promise<CourseClassStudentModel[]> => {
    try {
      return await getByStudentId(studentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [];
    }
  }, []);

  useEffect(() => {
    loadRevenues();
  }, [loadRevenues, isModalLoading]);

  const clearActionState = useCallback(() => { }, []);

  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes("is not valid JSON")) {
        return `❌ The service returned an unexpected format.`;
      }
      return `❌ ${err.message}`;
    }
    return "❌ Unknown error occurred.";
  }, []);

  useEffect(() => {
    const handleAction = async () => {
      if (!actionType || !studentId) return;

      try {
        switch (actionType) {
          case 'payment_confirmation': {
            const selectedRevenue = revenues.find(rev => rev.id === revenue?.id);
            if (selectedRevenue) {
              setRevenueToConfirm(selectedRevenue);
              setShowPaymentConfirmModal(true);
              return;
            } else {
              setMessage("❌ Revenue not found for confirmation.");
            }
            break;
          }

          case 'send_reminder_message': {
            setMessage(`Generating reminder message for student ID: ${studentId}...`);
            try {
              const generatedLink = await getReminderMessage(studentId);
              setLinkToDisplay(generatedLink);
              setShowLinkModal(true);
              setMessage("");
              await loadRevenueDetails(studentId);
            } catch (err) {
              setMessage(handleApiError(err));
            }
            break;
          }

          case 'send_payment_message': {
            setMessage(`Generating payment message for student ID: ${studentId}...`);
            try {
              const generatedLink = await getPaymentMessage(studentId);
              setLinkToDisplay(generatedLink);
              setShowLinkModal(true);
              setMessage("");
            } catch (err) {
              setMessage(handleApiError(err));
            }
            break;
          }

          default:
            setMessage("❌ Unknown action type.");
        }
      } catch (err) {
        setMessage(handleApiError(err));
      }

      if (actionType !== 'payment_confirmation') {
        clearActionState();
      }
    };

    handleAction();
  }, [actionType, studentId, revenues, handleApiError, clearActionState, revenue, loadRevenueDetails]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleConfirmPayment = async (confirmedRevenueId: string) => {
    setShowPaymentConfirmModal(false);
    setRevenueToConfirm(null);
    setMessage("Confirmando pagamento...");

    try {
      updatePaymentStatus(revenue!);
      setShowPaymentConfirmModal(true);
      setMessage("");
      handleCloseLinkModal();
    } catch (err) {
      setMessage(handleApiError(err));
    } finally {
      setRevenue(null);
      setActionType(null);
      clearActionState();
      setIsModalLoading(true);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentConfirmModal(false);
    setRevenueToConfirm(null);
    setMessage("Ação de pagamento cancelada.");
    clearActionState();
  };

  const handleOpenLink = async () => {
    if (linkToDisplay) {
      window.open(linkToDisplay, '_blank');
    }
    if (revenue?.id) {
      try {
        if (actionType === "send_reminder_message") {
          await sendReminderMessage(revenue.id);
          setMessage("✅ Reminder message sent successfully!");
        } else if (actionType === "send_payment_message") {
          await sendPaymentMessage(revenue.id);
          setMessage("✅ Payment message sent successfully!");
        }
      } catch (err) {
        setMessage(handleApiError(err));
      } finally {
        setRevenue(null);
        setActionType(null);
      }
    }
    setTimeout(() => {
      handleCloseLinkModal();
    }, 200);
    setIsModalLoading(true);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    setLinkToDisplay(null);
    clearActionState();
  };


  type RangeFilter = {
    startYm: string; // "YYYY-MM"
    endYm: string; // "YYYY-MM"
  };

  const now = new Date();
  const defaultYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [filter, setFilter] = useState<RangeFilter>({
    startYm: defaultYm,
    endYm: defaultYm,
  });

  const [hasActiveFilter, setHasActiveFilter] = useState(false);

  function ymToParts(ym: string) {
    // ym = "YYYY-MM"
    const [year, month] = ym.split("-");
    return { month, year };
  }
  const handleFilterRange = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);     

      const { startYm, endYm } = filter;
      if (endYm < startYm) throw new Error('Data final deve ser maior ou igual à data inicial.');

      const { month: startMonth, year: startYear } = ymToParts(startYm);
      const { month: endMonth, year: endYear } = ymToParts(endYm);

      const data = await getRevenuesByRangeDate(startMonth, startYear, endMonth, endYear);
      setRevenues(data);
      setHasActiveFilter(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsModalLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!hasActiveFilter) {
      loadRevenues();
    }
  }, [loadRevenues, isModalLoading, hasActiveFilter]);


  if (loading) return <p className="text-blue-500 text-center">Carregando receitas...</p>;
  if (error) return (
    <div className="text-center">
      <p className="text-red-500">Erro: {error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >Tentar novamente</button>
    </div>
  );



  return (
    <div>
      {message && (
        <p className={`text-center mt-2 ${message.includes('❌') ? 'text-red-500' : message.includes('✅') ? 'text-green-500' : 'text-blue-500'}`}>{message}</p>
      )}

      <RevenueMonthRangeFilter
        value={filter}
        onChange={setFilter}
        onApply={handleFilterRange}
        busy={loading}
      />

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg p-2 md:pt-0">
            <div className="hidden md:block">
              <RevenuesTableDesktop
                revenues={revenues}
                setActionType={setActionType}
                setStudentId={setStudentId}
                setRevenue={setRevenue}
                loadRevenueDetails={loadRevenueDetails}
                onFilterRange={handleFilterRange}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
            <div className="md:hidden">
              <RevenuesTableMobile
                revenues={revenues}
                setActionType={setActionType}
                setStudentId={setStudentId}
                setRevenue={setRevenue}
                loadRevenueDetails={loadRevenueDetails}
              />
            </div>
          </div>
        </div>
      </div>

      <RevenuePaymentIdentifiedModal show={showPaymentConfirmModal} revenue={revenueToConfirm} onConfirm={handleConfirmPayment} onCancel={handleCancelPayment} />
      <RevenueLinkModal show={showLinkModal} link={linkToDisplay} onOpenLink={handleOpenLink} onClose={handleCloseLinkModal} />
      <RevenuePaymentIdentifiedModalMobile show={showPaymentConfirmModal} revenue={revenueToConfirm} onConfirm={handleConfirmPayment} onCancel={handleCancelPayment} />
      <RevenueLinkModalMobile show={showLinkModal} link={linkToDisplay} onOpenLink={handleOpenLink} onClose={handleCloseLinkModal} />
    </div>
  );
}
