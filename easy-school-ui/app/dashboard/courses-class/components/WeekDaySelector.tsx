'use client';

import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';

interface WeekDaySelectorProps {
  weekDays: CalendarWeekDayModel[];
  selectedDays: string[];
  onWeekDayToggle: (id: string) => void;
}

export default function WeekDaySelector({
  weekDays,
  selectedDays,
  onWeekDayToggle
}: WeekDaySelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Dias da Semana:</label>
      <div className="rounded-lg bg-white border border-gray-200 p-2 flex flex-wrap gap-2">
        {weekDays
          .filter(day => day.id)
          .map(day => {
            const dayId = String(day.id);
            const isChecked = selectedDays?.some(selectedId => String(selectedId) === dayId) || false;
            
            return (
              <label
                key={day.id}
                className={`flex text-[12px] items-center p-2 rounded-md cursor-pointer mb-1 ${
                  isChecked ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onWeekDayToggle(day.id!)}
                  className="h-4 w-4 text-blue-600 border-gray-300 mr-3"
                />
                {day.week_day}
              </label>
            );
          })}
      </div>
    </div>
  );
}