'use client';

import React from 'react';
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions'; // Assuming this path is correct
import BRLCurrency from '@/app/dashboard/components/currency';

interface RevenuePaymentIdentifiedModalProps {
  show: boolean;
  revenue: RevenueModel | null;
  onConfirm: (revenueId: string) => void;
  onCancel: () => void;
}

export default function RevenuePaymentIdentifiedModal({
  show,
  revenue,
  onConfirm,
  onCancel,
}: RevenuePaymentIdentifiedModalProps) {
  if (!show || !revenue) {
    return null;
  }


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Pagamento</h3>
        <p className="text-sm text-gray-700 mb-6">
          Confirma o pagamento de{" "}
          <span className="font-bold">
            <BRLCurrency value={revenue.amount ?? 0} />
          </span>{" "}
          do aluno{" "}
          <span className="font-bold">{revenue.student?.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            Não
          </button>
          <button
            type="button"
            onClick={() => onConfirm(revenue.id!)} // Pass the revenue ID on confirm
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
