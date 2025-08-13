'use client';

import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';

interface Props {
  teachers: TeacherModel[];
  teacherCalendars: CalendarRangeHourDayModel[];
  selectedTeacherId: string;
  onTeacherSelect: (teacherId: string) => void;
}

export default function TeacherCalendarListMobile({
  teachers,
  teacherCalendars,
  selectedTeacherId,
  onTeacherSelect,
}: Props) {
  // Group calendars by teacher id
  const grouped: Record<string, { teacher: TeacherModel; calendars: CalendarRangeHourDayModel[] }> = {};

  // Ensure every teacher appears even if they have 0 calendars
  for (const t of teachers) {
    const tid = String(t.id ?? '');
    if (!grouped[tid]) grouped[tid] = { teacher: t, calendars: [] };
  }
  // Attach calendars
  for (const cal of teacherCalendars) {
    const tid = String(cal.teacher?.id ?? '');
    if (!tid) continue;
    if (!grouped[tid]) grouped[tid] = { teacher: (cal.teacher as TeacherModel) ?? ({} as TeacherModel), calendars: [] };
    grouped[tid].calendars.push(cal);
  }

  // Create a sorted list (selected first, then alphabetical)
  const items = Object.entries(grouped)
    .map(([id, pack]) => ({ id, ...pack }))
    .sort((a, b) => {
      const aSel = String(a.id) === String(selectedTeacherId) ? -1 : 0;
      const bSel = String(b.id) === String(selectedTeacherId) ? -1 : 0;
      if (aSel !== bSel) return aSel - bSel;
      return (a.teacher.name || '').localeCompare(b.teacher.name || '');
    });

  const toggle = (id: string) => {
    // tap again on the same teacher to unselect
    onTeacherSelect(String(selectedTeacherId) === String(id) ? '' : id);
  };

  if (items.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-500 bg-white rounded-lg border border-gray-200">
        Ajuste os filtros e toque em “Buscar professor”.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(({ id, teacher, calendars }) => {
        const selected = String(id) === String(selectedTeacherId);
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={[
              'w-full text-left rounded-lg border p-4 transition-colors',
              selected
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-white active:bg-gray-50',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{teacher?.name}</div>
              {selected && (
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

            {/* Availability chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {calendars && calendars.length > 0 ? (
                calendars.map((c, idx) => (
                  <span
                    key={`${id}-${idx}`}
                    className={[
                      'px-2 py-1 rounded text-xs',
                      selected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800',
                    ].join(' ')}
                  >
                    {c.week_day?.week_day}{' '}
                    {`${(c.start_hour ?? '00')}:${(c.start_minute ?? '00')} - ${(c.end_hour ?? '00')}:${(c.end_minute ?? '00')}`}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Sem horários</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
