'use client';

import React from 'react';
import { ContractCourseModel } from '@/app/lib/definitions/contracts_definitions';
import BRLCurrency from '@/app/dashboard/components/currency';

interface Props {
  courses: ContractCourseModel[];
  prices: Record<string, string>;
  onPriceChange: (courseId: string, value: string) => void;
}

export default function ContractsDesktop({ courses, prices, onPriceChange }: Props) {
  return (
    <div className="mt-2 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2">
          <table className="min-w-full text-gray-900">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Curso</th>
                <th scope="col" className="px-3 py-5 font-medium">Preço Atual</th>
                <th scope="col" className="px-3 py-5 font-medium">Novo Preço</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {courses.map((course) => (
                <tr key={course.id} className="border-b text-sm">
                  <td className="px-4 py-3">{course.name}</td>
                  <td className="px-3 py-3">
                    <BRLCurrency value={course.course_price ?? 0} />
                  </td>
                  <td className="px-3 py-3">
                    <BRLCurrency
                      asInput
                      id={`price-${course.id}`}
                      value={prices[course.id ?? ''] ?? ''}
                      onChange={(val) => course.id && onPriceChange(course.id, val.toString())}
                      className="w-40 rounded-md border border-gray-300 py-2 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Novo preço"
                      showSymbol
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
