'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type Props = {
  label: string;
  active: boolean;
  direction: 'asc' | 'desc';
  onClick: () => void;
  className?: string;
};

/**
 * Clickable column-header label with a sort-direction indicator. Drop it
 * inside a <th> (or any header cell) to make that column sortable, e.g.:
 *
 *   <th><SortToggle label="Nome" active={sortKey === 'name'} .../></th>
 */
export default function SortToggle({ label, active, direction, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={`inline-flex items-center gap-1 font-medium hover:text-gray-700 focus:outline-none ${className ?? ''}`}
    >
      {label}
      {active ? (
        direction === 'asc' ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
      )}
    </button>
  );
}
