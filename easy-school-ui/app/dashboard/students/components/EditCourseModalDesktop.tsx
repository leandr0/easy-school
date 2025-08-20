// components/EditCourseModalDesktop.tsx
'use client';

import React from 'react';
import { Button } from '@/app/ui/button';
import { CoursePriceModel } from '@/app/lib/definitions/students_definitions';
import BRLCurrency from '@/app/dashboard/components/currency';

interface Props {
  course: CoursePriceModel;
  inputValue: string;
  onChange: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function EditCourseModalDesktop({ course, inputValue, onChange, onCancel, onSave }: Props) {
  return (
    <div className="hidden md:flex fixed inset-0 bg-gray-600 bg-opacity-75 items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Course Price</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Name:</label>
          <p className="text-gray-900 font-semibold">{course.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Price:</label>
          <p className="text-gray-900"><BRLCurrency value={course.course_price ?? 0} /></p>
        </div>
        <div className="mb-6">
          <label htmlFor="newCoursePrice" className="block text-sm font-medium text-gray-700 mb-1">New Price:</label>
          <BRLCurrency
            asInput
            id="newCoursePriceMobile"
            value={inputValue}
            onChange={(val) => onChange(val.toString())}
            className="w-full rounded-md border border-gray-300 py-2 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter new price"
            showSymbol
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
          <Button type="button" onClick={onSave} className="bg-blue-600 text-white hover:bg-blue-700">Save</Button>
        </div>
      </div>
    </div>
  );
}
