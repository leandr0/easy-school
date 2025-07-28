'use client';

import React from 'react';
import { Button } from '@/app/ui/button';
import BRLCurrency from '../components/currency';

interface Props {
  newPrice: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmUpdateModalDesktop({ newPrice, onCancel, onConfirm }: Props) {
  return (
    <div className="hidden md:flex fixed inset-0 bg-gray-600 bg-opacity-75 items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Update</h3>
        <p className="mb-6 text-gray-700">
          Are you sure you want to update the course price to{' '}
          <BRLCurrency value={parseFloat(newPrice) || 0} />?
        </p>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
