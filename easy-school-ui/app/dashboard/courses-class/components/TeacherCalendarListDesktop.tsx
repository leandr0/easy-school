'use client';

import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import TimeDisplay from '../../../ui/components/time_display';

interface Props {
  teachers: TeacherModel[];
  teacherCalendars: CalendarRangeHourDayModel[];
  selectedTeacherId: string;
  onTeacherSelect: (teacherId: string) => void;
}

/**
 * Desktop-only table that highlights ALL rows for the selected teacher.
 * - Groups calendars by teacher.
 * - Radio appears in the first row (via rowSpan), but clicking ANY row selects that teacher.
 */
export default function TeacherCalendarListDesktop({
  teachers,
  teacherCalendars,
  selectedTeacherId,
  onTeacherSelect,
}: Props) {
  // Build map teacherId -> { teacher, calendars[] }
  const grouped: Record<
    string,
    { teacher: TeacherModel; calendars: CalendarRangeHourDayModel[] }
  > = {};

  for (const t of teachers) {
    const tid = String(t.id ?? '');
    if (!grouped[tid]) grouped[tid] = { teacher: t, calendars: [] };
  }
  for (const cal of teacherCalendars) {
    const tid = String(cal.teacher?.id ?? '');
    if (!tid) continue;
    if (!grouped[tid]) {
      grouped[tid] = {
        teacher: (cal.teacher as TeacherModel) ?? ({} as TeacherModel),
        calendars: [],
      };
    }
    grouped[tid].calendars.push(cal);
  }

  const teacherEntries = Object.entries(grouped).sort((a, b) => {
    const aSel = String(a[0]) === String(selectedTeacherId) ? -1 : 0;
    const bSel = String(b[0]) === String(selectedTeacherId) ? -1 : 0;
    if (aSel !== bSel) return aSel - bSel; // selected first
    return (a[1].teacher.name || '').localeCompare(b[1].teacher.name || '');
  });

  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <div className="bg-gray-100 p-3 grid grid-cols-4 text-sm font-medium">
        <div className="px-4">Nome</div>
        <div className="px-4">Dia</div>
        <div className="px-3">Hora início</div>
        <div className="px-3">Hora fim</div>
      </div>

      <table className="min-w-full bg-white">
        <tbody>
          {teacherEntries.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                Selecione critérios e clique em “Buscar professor”.
              </td>
            </tr>
          )}

          {teacherEntries.map(([teacherId, { teacher, calendars }]) => {
            const rows = calendars.length > 0 ? calendars : [null]; // single empty row if no calendars
            const isSelected = String(teacherId) === String(selectedTeacherId);

            return rows.map((cal, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === rows.length - 1;

              const rowClass = [
                'text-sm cursor-pointer transition-colors',
                isSelected ? 'bg-blue-100' : 'hover:bg-gray-50',
                isFirst ? '[&>td:first-child]:rounded-tl-md [&>td:last-child]:rounded-tr-md' : '',
                isLast ? '[&>td:first-child]:rounded-bl-md [&>td:last-child]:rounded-br-md' : '',
                isSelected ? '[&>td:first-child]:border-l-4 [&>td:first-child]:border-l-blue-400' : '',
              ].join(' ');

              return (
                <tr
                  key={`${teacherId}-${idx}`}
                  className={rowClass}
                  onClick={() => onTeacherSelect(teacherId)}
                  aria-selected={isSelected}
                >
                  {isFirst && (
                    <td
                      rowSpan={rows.length}
                      className="px-4 py-3 align-middle border-b border-gray-200 w-1/4"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="desktop-teacher-selection"
                          value={teacherId}
                          checked={isSelected}
                          readOnly
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded pointer-events-none"
                        />
                        <p className="font-medium">{teacher?.name}</p>
                        {isSelected && (
                          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            Selecionado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {teacher?.phone_number}
                        {teacher?.phone_number && teacher?.email ? ' • ' : ''}
                        {teacher?.email}
                      </div>
                    </td>
                  )}

                  {/* Availability cells */}
                  <td className="px-4 py-3 border-b border-gray-200 w-1/4">
                    {cal ? (
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                        {cal.week_day?.week_day}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 border-b border-gray-200 w-1/4">
                    {cal ? (
                      <TimeDisplay hour={cal.start_hour} minute={cal.start_minute} />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 border-b border-gray-200 w-1/4">
                    {cal ? (
                      <TimeDisplay hour={cal.end_hour} minute={cal.end_minute} />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
