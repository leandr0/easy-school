'use client';

import { Button } from '@/app/ui/button';
import React, { memo, useCallback, useState } from 'react';

export type DateRange = { startDate: string; endDate: string };

export type DatePrecision = 'year' | 'month' | 'day';

type Props = {
  value: DateRange;                       // controlled value: { startDate: "YYYY" | "YYYY-MM" | "YYYY-MM-DD", endDate: "YYYY" | "YYYY-MM" | "YYYY-MM-DD" }
  onChange: (next: DateRange) => void;    // called on each field change
  onApply: () => Promise<void> | void;    // called when user clicks "Filtrar"
  precision?: DatePrecision;              // 'year' | 'month' | 'day' - defaults to 'day'
  busy?: boolean;                         // optional: disable while loading
  className?: string;
  startLabel?: string;                    // custom label for start field
  endLabel?: string;                      // custom label for end field
  buttonText?: string;                    // custom button text
  busyText?: string;                      // custom busy button text
  errorMessage?: string;                  // custom error message
};

const AttendenceDateRangeFilter: React.FC<Props> = ({
  value,
  onChange,
  onApply,
  precision = 'day',
  busy = false,
  className = '',
  startLabel,
  endLabel,
  buttonText = 'Filtrar',
  busyText = 'Filtrando…',
  errorMessage = 'Data final deve ser maior ou igual à data inicial.'
}) => {
  const [error, setError] = useState('');

  // Get input type based on precision
  const getInputType = () => {
    switch (precision) {
      case 'year':
        return 'number';
      case 'month':
        return 'month';
      case 'day':
      default:
        return 'date';
    }
  };

  // Get default labels based on precision
  const getDefaultLabels = () => {
    switch (precision) {
      case 'year':
        return { start: 'Início (ano)', end: 'Fim (ano)' };
      case 'month':
        return { start: 'Início (mês/ano)', end: 'Fim (mês/ano)' };
      case 'day':
      default:
        return { start: 'Início (dia/mês/ano)', end: 'Fim (dia/mês/ano)' };
    }
  };

  const defaultLabels = getDefaultLabels();
  const inputType = getInputType();

  // Get min/max values based on precision
  const getMinMax = () => {
    switch (precision) {
      case 'year':
        return { min: 2000, max: 2100 };
      case 'month':
        return { min: '2000-01', max: '2100-12' };
      case 'day':
      default:
        return { min: '2000-01-01', max: '2100-12-31' };
    }
  };

  const { min, max } = getMinMax();

  const apply = useCallback(async () => {
    setError('');
    
    // Compare dates based on precision
    let startComparable: string | number = value.startDate;
    let endComparable: string | number = value.endDate;
    
    if (precision === 'year') {
      startComparable = parseInt(value.startDate);
      endComparable = parseInt(value.endDate);
    }
    
    if (endComparable < startComparable) {
      setError(errorMessage);
      return;
    }
    await onApply();
  }, [value, onApply, precision, errorMessage]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, startDate: e.target.value });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, endDate: e.target.value });
  };

  return (
    <div className={`mb-3 rounded-lg bg-white p-3 border ${className}`}>
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs text-gray-600 mb-1">
            {startLabel || defaultLabels.start}
          </label>
          {precision === 'year' ? (
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={value.startDate}
              onChange={handleStartChange}
              min={min as number}
              max={max as number}
              placeholder="YYYY"
            />
          ) : (
            <input
              type={inputType}
              className="w-full border rounded px-2 py-1"
              value={value.startDate}
              onChange={handleStartChange}
              min={min as string}
              max={max as string}
            />
          )}
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs text-gray-600 mb-1">
            {endLabel || defaultLabels.end}
          </label>
          {precision === 'year' ? (
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={value.endDate}
              onChange={handleEndChange}
              min={min as number}
              max={max as number}
              placeholder="YYYY"
            />
          ) : (
            <input
              type={inputType}
              className="w-full border rounded px-2 py-1"
              value={value.endDate}
              onChange={handleEndChange}
              min={min as string}
              max={max as string}
            />
          )}
        </div>

        <div className="col-span-12 sm:col-span-2">


          <Button
            className='hover:bg-purple-500'
            type="submit"
              onClick={apply}
             disabled={busy}
          >
            {busy ? busyText : buttonText}
          </Button>

        </div>

        {!!error && (
          <div className="col-span-12">
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AttendenceDateRangeFilter);