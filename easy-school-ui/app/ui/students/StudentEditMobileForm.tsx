'use client';

import React from 'react';
import { StudentCoursePriceModel, CoursePriceModel } from '@/app/lib/definitions/students_definitions';
import { Button } from '@/app/ui/button';
import DateInput from '../components/DateInput';
import { Switch } from '../components/switch';
import BRLCurrency from '../components/currency';
import { PencilIcon } from 'lucide-react';

interface Props {
  formData: StudentCoursePriceModel;
  message: string;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEditCourse: (course: CoursePriceModel) => void;
  onSwitchStatus: (checked: boolean) => void;
}

export default function StudentEditMobileForm({
  formData,
  message,
  error,
  onChange,
  onSubmit,
  onEditCourse,
  onSwitchStatus,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 text-center">Error: {error}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          id="due_date"
          name="due_date"
          type="number"
          value={formData.due_date}
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <DateInput
          name="start_date"
          value={formData.start_date}
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <Switch
          label={formData.status ? 'Active' : 'Inactive'}
          checked={formData.status!}
          onChange={onSwitchStatus}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Courses</h3>
        {formData.courses?.map(course => (
          <div key={course.name} className="relative border rounded-md px-3 py-2 mb-2 shadow-sm bg-white">
  <button
    type="button"
    onClick={() => onEditCourse(course)}
    className="absolute top-2 right-2 rounded-md border p-1 hover:bg-gray-100"
    title="Edit course price"
  >
    <PencilIcon className="w-4 h-4" color="blue" />
  </button>
  <div className="text-sm font-medium text-gray-800">{course.name}</div>
  <div className="text-sm text-gray-600"><BRLCurrency value={course.course_price} /></div>
</div>

        ))}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <a
          href="/dashboard/students"
          className="bg-gray-200 px-4 py-2 rounded text-sm text-gray-700"
        >
          Cancel
        </a>
        <Button type="submit" className="bg-blue-600 text-white">Save</Button>
      </div>
    </form>
  );
}
