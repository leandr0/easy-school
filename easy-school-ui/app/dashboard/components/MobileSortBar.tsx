'use client';

import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import type { SortDirection } from './tableUtils';

type Option<K extends string> = { value: K; label: string };

type Props<K extends string> = {
  options: Option<K>[];
  sortKey: K;
  direction: SortDirection;
  onSortKeyChange: (key: K) => void;
  onDirectionToggle: () => void;
};

/**
 * Compact "sort by" control for card-style mobile lists that don't have
 * table headers to click on. Sits above the list without changing the
 * surrounding layout.
 */
export default function MobileSortBar<K extends string>({
  options,
  sortKey,
  direction,
  onSortKeyChange,
  onDirectionToggle,
}: Props<K>) {
  return (
    <div className="mb-2 flex items-center justify-end gap-2 text-sm">
      <label htmlFor="mobile-sort" className="text-gray-500">
        Ordenar por:
      </label>
      <select
        id="mobile-sort"
        className="rounded-md border bg-white px-2 py-1 text-sm"
        value={sortKey}
        onChange={(e) => onSortKeyChange(e.target.value as K)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onDirectionToggle}
        aria-label={direction === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white hover:bg-accent hover:text-accent-foreground"
      >
        {direction === 'asc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
      </button>
    </div>
  );
}
