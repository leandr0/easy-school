'use client';

import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export function CalendarWeekDaySelectComponent({ weekDays, formData, handleWeekDayChange }) {
  return (
    <div className="mb-4">
      <div className="relative">
        <select
          id="week_day_id"
          name="week_day_id"
          value={formData.week_day?.id || ""}
          onChange={handleWeekDayChange}
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        >
          {weekDays.map((weekDay) => (
            <option key={weekDay.id} value={weekDay.id}>
              {weekDay.week_day}
            </option>
          ))}
        </select>
        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}