'use client';

import React, { useEffect, useState, useCallback } from "react";
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import { getAll, sendPaymentMessage, sendReminderMessage, updatePaymentStatus } from '@/app/services/revenueService';

import RevenuesTableDesktop from "./desktop/RevenueTableDesktop";
import RevenuesTableMobile from './mobile/RevenueTableMobile';
import { getReminderMessage, getPaymentMessage } from "@/app/services/revenueMessageService";
import RevenueLinkModal from "./desktop/RevenueLinkModal";
import RevenuePaymentIdentifiedModal from "./desktop/RevenuePaymentIdentifiedModal";
import RevenuePaymentIdentifiedModalMobile from "./mobile/RevenuePaymentIdentifiedModalMobile";
import RevenueLinkModalMobile from "./mobile/RevenueLinkModalMobile";
import { ActionType } from "@/app/lib/types/revenue";



export default function RevenuesTable() {
  const [revenues, setRevenues] = useState<RevenueModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<RevenueModel | null>(null);

  const [isModalLoading, setIsModalLoading] = useState(false);
  // States for the LinkModal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkToDisplay, setLinkToDisplay] = useState<string | null>(null);

  // States for the RevenuePaymentIdentifiedModal
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [revenueToConfirm, setRevenueToConfirm] = useState<RevenueModel | null>(null);

  const loadRevenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAll();
      setRevenues(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsModalLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRevenues();
  }, [loadRevenues, isModalLoading]);

  // Helper function to clear action state
  const clearActionState = useCallback(() => {
    //setActionType(null);
    //setStudentId(null);
    //setRevenueId(null);
  }, []);

  // Helper function to handle API errors
  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes("is not valid JSON")) {
        return `❌ The service returned an unexpected format. Please check 'revenueMessageService.ts' to ensure it's handling the API response correctly (e.g., expecting a plain string instead of JSON).`;
      }
      return `❌ ${err.message}`;
    }
    return "❌ Unknown error occurred.";
  }, []);

  // Handle different action types
  useEffect(() => {
    const handleAction = async () => {
      if (!actionType || !studentId) return;

      console.log(`Action type: ${actionType} for student ID: ${studentId}`);

      try {
        switch (actionType) {
          case 'payment_confirmation':
            const selectedRevenue = revenues.find(rev => rev.id === revenue?.id);
            if (selectedRevenue) {
              setRevenueToConfirm(selectedRevenue);
              setShowPaymentConfirmModal(true);

              return;
            } else {
              setMessage("❌ Revenue not found for confirmation.");
            }
            break;

          case 'send_reminder_message':
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

          case 'send_payment_message':
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

          default:
            setMessage("❌ Unknown action type.");
        }
      } catch (err) {
        setMessage(handleApiError(err));
      }

      // Clear action state for all cases except payment confirmation initiation
      if (actionType !== 'payment_confirmation') {
        clearActionState();
      }
    };

    handleAction();
  }, [actionType, studentId, revenues, handleApiError, clearActionState]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is primarily for form-related submissions if needed in the future
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

  // Function called when "Não" is clicked on the payment confirmation modal
  const handleCancelPayment = () => {
    setShowPaymentConfirmModal(false);
    setRevenueToConfirm(null);
    setMessage("Ação de pagamento cancelada.");
    clearActionState();
  };

  // Function to open the link in a new tab and send the message
  const handleOpenLink = async () => {
    if (linkToDisplay) {
      window.open(linkToDisplay, '_blank');
    }

    // Send the appropriate message based on the action type
    if (revenue && revenue.id) {
      try {



        if (actionType === "send_reminder_message") {
          await sendReminderMessage(revenue?.id!);
          setMessage("✅ Reminder message sent successfully!");
        } else if (actionType === "send_payment_message") {
          await sendPaymentMessage(revenue?.id!);
          setMessage("✅ Payment message sent successfully!");
        }


      } catch (err) {
        setMessage(handleApiError(err));
      } finally {
        setRevenue(null);
        setActionType(null);
      }
    }


    // Then reload data in the background
    setTimeout(async () => {
      handleCloseLinkModal();
    }, 200);

    setIsModalLoading(true);

  };

  // Function to close the link modal
  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    setLinkToDisplay(null);
    clearActionState();
  };

  if (loading) {
    return <p className="text-blue-500 text-center">Carregando receitas...</p>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">Erro: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <p className={`text-center mt-2 ${message.includes('❌') ? 'text-red-500' :
          message.includes('✅') ? 'text-green-500' :
            'text-blue-500'
          }`}>
          {message}
        </p>
      )}

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="hidden md:block">
              <RevenuesTableDesktop
                revenues={revenues}
                setActionType={setActionType}
                setStudentId={setStudentId}
                setRevenue={setRevenue}
              />
            </div>
            <div className="md:hidden">
              <RevenuesTableMobile
  revenues={revenues}
  setActionType={setActionType}
  setStudentId={setStudentId}
  setRevenue={setRevenue}
/>

            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <RevenuePaymentIdentifiedModal
        show={showPaymentConfirmModal}
        revenue={revenueToConfirm}
        onConfirm={handleConfirmPayment}
        onCancel={handleCancelPayment}
      />

      {/* Link Display Modal */}
      <RevenueLinkModal
        show={showLinkModal}
        link={linkToDisplay}
        onOpenLink={handleOpenLink}
        onClose={handleCloseLinkModal}
      />

       {/* Modais adaptados para Mobile */}
      <RevenuePaymentIdentifiedModalMobile
        show={showPaymentConfirmModal}
        revenue={revenueToConfirm}
        onConfirm={handleConfirmPayment}
        onCancel={handleCancelPayment}
      />

      <RevenueLinkModalMobile
        show={showLinkModal}
        link={linkToDisplay}
        onOpenLink={handleOpenLink}
        onClose={handleCloseLinkModal}
      />
    </form>
  );
}