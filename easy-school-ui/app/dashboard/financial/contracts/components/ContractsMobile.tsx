'use client';

import React from 'react';
import { ContractCourseModel } from '@/app/lib/definitions/contracts_definitions';
import BRLCurrency from '@/app/dashboard/components/currency';

interface Props {
  courses: ContractCourseModel[];
  prices: Record<string, string>;
  onPriceChange: (courseId: string, value: string) => void;
}

export default function ContractsMobile({ courses, prices, onPriceChange }: Props) {
  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <div key={course.id} className="rounded-md border bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-1">{course.name}</div>
          <div className="text-xs text-gray-500 mb-2">
            Preço atual: <BRLCurrency value={course.course_price ?? 0} />
          </div>
          <label htmlFor={`price-mobile-${course.id}`} className="block text-xs text-gray-500 mb-1">
            Novo Preço
          </label>
          <BRLCurrency
            asInput
            id={`price-mobile-${course.id}`}
            value={prices[course.id ?? ''] ?? ''}
            onChange={(val) => course.id && onPriceChange(course.id, val.toString())}
            className="w-full rounded-md border border-gray-300 py-2 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Novo preço"
            showSymbol
          />
        </div>
      ))}
    </div>
  );
}
