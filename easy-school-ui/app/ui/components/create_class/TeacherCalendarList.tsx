'use client';

import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import TimeDisplay from '../time_display';

interface TeacherCalendarListProps {
  teachers: TeacherModel[];
  teacherCalendars: CalendarRangeHourDayModel[];
  selectedTeacherId: string;
  onTeacherSelect: (teacherId: string) => void;
}

export default function TeacherCalendarList({
  teachers,
  teacherCalendars,
  selectedTeacherId,
  onTeacherSelect
}: TeacherCalendarListProps) {
  // Group calendars by teacher ID for the rowspan functionality
  const groupedCalendars = teacherCalendars.reduce((acc, calendar) => {
    const teacherId = calendar.teacher?.id || '';
    if (!acc[teacherId]) {
      acc[teacherId] = [];
    }
    acc[teacherId].push(calendar);
    return acc;
  }, {} as Record<string, CalendarRangeHourDayModel[]>);

  return (
    <div className="inline-block min-w-full align-middle">
      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <div className="mt-2 flow-root">
          {/* Mobile view for teachers list */}
          <div className="md:hidden">
            {teachers.length > 0 && teacherCalendars.length <= 0 && (
              teachers.map((teacher) => (
                <label
                  key={teacher.id}
                  className={`flex items-center p-4 mb-2 rounded-md border ${
                    selectedTeacherId === teacher.id
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  } cursor-pointer transition`}
                >
                  <input
                    type="radio"
                    name="teacher_id"
                    value={teacher.id ?? ''}
                    checked={selectedTeacherId === (teacher.id ?? '')}
                    onChange={() => {
                      if (teacher.id) {
                        onTeacherSelect(teacher.id);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{teacher.name}</span>
                    <span className="text-xs text-gray-600">{teacher.phone_number}</span>
                    <span className="text-xs text-gray-600">{teacher.email}</span>
                  </div>
                </label>
              ))
            )}

            {/* Mobile view for teacher calendars */}
            {teacherCalendars.length > 0 && (
              teacherCalendars.map((calendar) => (
                <label
                  key={calendar.teacher?.id}
                  className={`flex items-center p-4 mb-2 rounded-md border ${
                    selectedTeacherId === calendar.teacher?.id
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  } cursor-pointer transition`}
                >
                  <input
                    type="radio"
                    name="teacher_calendar_id"
                    value={calendar.teacher?.id ?? ''}
                    checked={selectedTeacherId === (calendar.teacher?.id ?? '')}
                    onChange={() => {
                      if (calendar.teacher?.id) {
                        onTeacherSelect(calendar.teacher.id);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{calendar.teacher?.name}</span>
                    <div className="mt-2 flex items-center text-xs">
                      <span className="bg-gray-200 px-2 py-1 rounded">{calendar.week_day?.week_day}</span>
                      <span className="mx-2">
                        <TimeDisplay hour={calendar.start_hour} minute={calendar.start_minute} /> - 
                        <TimeDisplay hour={calendar.end_hour} minute={calendar.end_minute} />
                      </span>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
          
          {/* Desktop view with rowspan */}
          <div className="hidden md:block">
            {teacherCalendars.length > 0 ? (
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="bg-gray-100 p-3 grid grid-cols-4 text-sm font-medium">
                  <div className="px-4">Nome</div>
                  <div className="px-4">Dia</div>
                  <div className="px-3">Hora início</div>
                  <div className="px-3">Hora fim</div>
                </div>
                
                {/* We need to use a table for rowspan instead of grid */}
                <div className="divide-y divide-gray-200 bg-white">
                  <table className="min-w-full">
                    <tbody>
                      {Object.entries(groupedCalendars).map(([teacherId, calendars]) => {
                        // Check if this teacher is selected
                        const isSelected = selectedTeacherId === teacherId;
                        const rowCount = calendars.length;
                        
                        return calendars.map((calendar, index) => (
                          <tr 
                            key={`${teacherId}-${index}`} 
                            className={`text-sm ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => onTeacherSelect(teacherId)}
                          >
                            {/* Teacher name cell with rowspan - only show on first row */}
                            {index === 0 && (
                              <td rowSpan={rowCount} className="px-4 py-3 align-middle border-b border-gray-200 w-1/4">
                                <div className="flex items-center gap-3">
                                  <div className="relative flex h-4 w-4 items-center justify-center">
                                    <input
                                      type="radio"
                                      name="teacher-selection"
                                      checked={isSelected}
                                      onChange={() => {}} // Empty onChange to avoid React warnings
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                  </div>
                                  <p>{calendar.teacher?.name}</p>
                                </div>
                              </td>
                            )}
                            {/* These cells appear for every row */}
                            <td className="px-4 py-3 border-b border-gray-200 w-1/4">{calendar.week_day?.week_day}</td>
                            <td className="px-3 py-3 border-b border-gray-200 w-1/4">
                              <TimeDisplay
                                hour={calendar.start_hour}
                                minute={calendar.start_minute}
                              />
                            </td>
                            <td className="px-3 py-3 border-b border-gray-200 w-1/4">
                              <TimeDisplay
                                hour={calendar.end_hour}
                                minute={calendar.end_minute}
                              />
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 italic">
                Selecione critérios e clique em "Buscar professor" para ver os professores disponíveis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}