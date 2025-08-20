'use client';

import { Button } from '@/app/ui/button';
import React, { memo, useCallback, useState } from 'react';

export type MonthRange = { startYm: string; endYm: string };

type Props = {
  value: MonthRange;                      // controlled value: { startYm: "YYYY-MM", endYm: "YYYY-MM" }
  onChange: (next: MonthRange) => void;   // called on each field change
  onApply: () => Promise<void> | void;    // called when user clicks "Filtrar"
  busy?: boolean;                         // optional: disable while loading
  className?: string;
};

const RevenueMonthRangeFilter: React.FC<Props> = ({
  value, onChange, onApply, busy = false, className = ''
}) => {
  const [error, setError] = useState('');

  const apply = useCallback(async () => {
    setError('');
    if (value.endYm < value.startYm) {
      setError('Data final deve ser maior ou igual à data inicial.');
      return;
    }
    await onApply();
  }, [value, onApply]);

  return (
    <div className={`mb-3 rounded-lg bg-white p-3 border ${className}`}>
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs text-gray-600 mb-1">Início (mês/ano)</label>
          <input
            type="month"
            className="w-full border rounded px-2 py-1"
            value={value.startYm}
            onChange={(e) => onChange({ ...value, startYm: e.target.value })}
            min="2000-01-01"
            max="2100-12-31"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs text-gray-600 mb-1">Fim (mês/ano)</label>
          <input
            type="month"
            className="w-full border rounded px-2 py-1"
            value={value.endYm}
            onChange={(e) => onChange({ ...value, endYm: e.target.value })}
            min="2000-01"
            max="2100-12"
          />
        </div>

        <div className="col-span-12 sm:col-span-2">
          

          <Button
            className='hover:bg-purple-500'
            type="submit"
            disabled={busy}
            onClick={apply}>
            {busy ? 'Filtrando…' : 'Filtrar'}
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

export default memo(RevenueMonthRangeFilter);
