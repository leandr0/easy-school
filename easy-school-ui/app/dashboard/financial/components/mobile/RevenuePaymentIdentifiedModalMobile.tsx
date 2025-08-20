'use client';

import React from 'react';
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';
import BRLCurrency from '@/app/dashboard/components/currency';

interface RevenuePaymentIdentifiedModalProps {
  show: boolean;
  revenue: RevenueModel | null;
  onConfirm: (revenueId: string) => void;
  onCancel: () => void;
}

export default function RevenuePaymentIdentifiedModalMobile({
  show,
  revenue,
  onConfirm,
  onCancel,
}: RevenuePaymentIdentifiedModalProps) {
  if (!show || !revenue) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Confirmar Pagamento</h3>
        <p className="text-sm text-gray-700 mb-5 sm:mb-6">
          Confirma o pagamento de{" "}
          <span className="font-bold">
            <BRLCurrency value={revenue.amount ?? 0} />
          </span>{" "}
          do aluno{" "}
          <span className="font-bold">{revenue.student?.name}</span>?
        </p>
        <div className="flex flex-col sm:flex-row justify-end sm:gap-3 gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Não
          </button>
          <button
            onClick={() => onConfirm(revenue.id!)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
