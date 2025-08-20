// components/EditCourseModalMobile.tsx
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

export function EditCourseModalMobile({ course, inputValue, onChange, onCancel, onSave }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 p-2 overflow-y-auto block md:hidden">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm mx-auto space-y-4">
        <h3 className="text-base font-bold text-gray-800">Edit Course</h3>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Course Name</label>
          <p className="text-sm text-gray-900 font-medium truncate">{course.name}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Current Price</label>
          <p className="text-sm text-gray-900"><BRLCurrency value={course.course_price ?? 0} /></p>
        </div>
        <div>
          <label htmlFor="newCoursePriceMobile" className="block text-xs text-gray-500 mb-0.5">New Price</label>
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
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700">Cancel</Button>
          <Button type="button" onClick={onSave} className="bg-blue-600 text-white">Save</Button>
        </div>
      </div>
    </div>
  );
}
