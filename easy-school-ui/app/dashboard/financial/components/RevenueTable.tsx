'use client';

import React, { useEffect, useState, useCallback } from "react";
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';

import RevenuesTableDesktop from "./desktop/RevenueTableDesktop";
import RevenuesTableMobile from './mobile/RevenueTableMobile';

import RevenueLinkModal from "./desktop/RevenueLinkModal";
import RevenuePaymentIdentifiedModal from "./desktop/RevenuePaymentIdentifiedModal";
import RevenuePaymentIdentifiedModalMobile from "./mobile/RevenuePaymentIdentifiedModalMobile";
import RevenueLinkModalMobile from "./mobile/RevenueLinkModalMobile";
import { ActionType } from "@/app/lib/types/revenue";
import RevenueMonthRangeFilter from "./RevenueMonthRangeFilter";

import { RevenueCourseClassStudentModel } from "@/app/lib/definitions/revenue_course_class_student_definitons";

import { getReminderMessage, getPaymentMessage } from "@/bff/services/revenueMessage.server";
import { getRevenuesByRangeDate, sendPaymentMessage, sendReminderMessage, updatePaymentStatus } from '@/bff/services/revenue.server';
import { fetchRevenueCourseClassStudentByStudentAndRevenue } from "@/bff/services/revenueCourseClass.server";
import { HttpError } from "@/app/config/api";

type Props = {
  onSendReminderMessage: (revenueId: string) => Promise<void>;
};

type RangeFilter = {
  startYm: string; // "YYYY-MM"
  endYm: string; // "YYYY-MM"
};

export default function RevenuesTable({ onSendReminderMessage }: Props) {
  const [revenues, setRevenues] = useState<RevenueModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<RevenueModel | null>(null);

  // Modal states - simplified
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkToDisplay, setLinkToDisplay] = useState<string | null>(null);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [revenueToConfirm, setRevenueToConfirm] = useState<RevenueModel | null>(null);

  // Filter states
  const now = new Date();
  const defaultYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [filter, setFilter] = useState<RangeFilter>({
    startYm: defaultYm,
    endYm: defaultYm,
  });

  // Helper functions
  function ymToParts(ym: string) {
    const [year, month] = ym.split("-");
    return { month, year };
  }

  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes("is not valid JSON")) {
        return `❌ The service returned an unexpected format.`;
      }
      return `❌ ${err.message}`;
    }
    return "❌ Unknown error occurred.";
  }, []);

  // Data loading functions
  const loadRevenues = useCallback(async (rangeFilter?: RangeFilter) => {
    try {
      setLoading(true);
      setError(null);

      const filterToUse = rangeFilter || filter;
      const { startYm, endYm } = filterToUse;

      if (endYm < startYm) {
        throw new Error('Data final deve ser maior ou igual à data inicial.');
      }

      const { month: startMonth, year: startYear } = ymToParts(startYm);
      const { month: endMonth, year: endYear } = ymToParts(endYm);

      const data = await getRevenuesByRangeDate(startMonth, startYear, endMonth, endYear);
      setRevenues(data);
    } catch (err) {
      if (!(err instanceof HttpError)) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const loadRevenueDetails = useCallback(async (studentId: string, revenueId: string): Promise<RevenueCourseClassStudentModel[]> => {
    try {
      return await fetchRevenueCourseClassStudentByStudentAndRevenue(studentId, revenueId);
    } catch (err) {
      if (!(err instanceof HttpError)) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      }
      return [];
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadRevenues();
  }, []); // Only run on mount

  const clearActionState = useCallback(() => {
    setActionType(null);
    setStudentId(null);
    setRevenue(null);
    setMessage("");
  }, []);

  // Handle actions - simplified
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
    };

    handleAction();
  }, [actionType, studentId, revenues, handleApiError, revenue]);

  // Filter handler
  const handleFilterRange = useCallback(async () => {
    await loadRevenues(filter);
  }, [loadRevenues, filter]);

  // Modal handlers
  const handleConfirmPayment = async (confirmedRevenueId: string) => {
    setShowPaymentConfirmModal(false);
    setRevenueToConfirm(null);
    setMessage("Confirmando pagamento...");

    try {
      await updatePaymentStatus(revenue!);
      setMessage("✅ Payment confirmed successfully!");
      // Reload data after successful payment confirmation
      await loadRevenues();
    } catch (err) {
      setMessage(handleApiError(err));
    } finally {
      clearActionState();
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
          await onSendReminderMessage(revenue.id);
          setMessage("✅ Reminder message sent successfully!");
        } else if (actionType === "send_payment_message") {
          await sendPaymentMessage(revenue.id);
          setMessage("✅ Payment message sent successfully!");
        }
        // Reload data after successful message sending
        await loadRevenues();
      } catch (err) {
        console.trace(`Error ${err}`);
        setMessage(handleApiError(err));
      } finally {
        clearActionState();
      }
    }

    setTimeout(() => {
      handleCloseLinkModal();
    }, 200);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    setLinkToDisplay(null);
    clearActionState();
  };

  // Render loading/error states
  if (loading) return <p className="text-blue-500 text-center">Carregando receitas...</p>;
  if (error) return (
    <div className="text-center">
      <p className="text-red-500">Erro: {error}</p>
      <button
        onClick={() => loadRevenues()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >Tentar novamente</button>
    </div>
  );

  return (
    <div>
      {message && (
        <p className={`text-center mt-2 ${message.includes('❌') ? 'text-red-500' : message.includes('✅') ? 'text-green-500' : 'text-blue-500'}`}>
          {message}
        </p>
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

      <RevenuePaymentIdentifiedModal
        show={showPaymentConfirmModal}
        revenue={revenueToConfirm}
        onConfirm={handleConfirmPayment}
        onCancel={handleCancelPayment}
      />
      <RevenueLinkModal
        show={showLinkModal}
        link={linkToDisplay}
        onOpenLink={handleOpenLink}
        onClose={handleCloseLinkModal}
      />
      <RevenuePaymentIdentifiedModalMobile show={showPaymentConfirmModal} revenue={revenueToConfirm} onConfirm={handleConfirmPayment} onCancel={handleCancelPayment} />
      <RevenueLinkModalMobile show={showLinkModal} link={linkToDisplay} onOpenLink={handleOpenLink} onClose={handleCloseLinkModal} />
    </div>
  );
}