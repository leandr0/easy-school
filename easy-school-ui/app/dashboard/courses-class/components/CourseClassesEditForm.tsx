'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button, CancelButton } from '@/app/ui/button';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Switch } from '@/app/dashboard/components/switch';

import WeekDaySelector from '@/app/dashboard/courses-class/components/WeekDaySelector';
import TimeSelector from '@/app/dashboard/courses-class/components/TimeSelector';
import TeacherCalendarList from '@/app/dashboard/courses-class/components/TeacherCalendarListDesktop';


import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';


import { getAllWeekDays, getWeekDaysByCourseClass } from '@/bff/services/calendarWeekDay.server';
import { getCourseClassById, updateCourseClass } from '@/bff/services/courseClass.server';
import { fetchAvailabilityTeacher } from '@/bff/services/calendarRangeHourDay.server';



type TeacherWithCalendars = {
  teacher: TeacherModel;
  calendars: CalendarRangeHourDayModel[];
};

export default function EditCourseClassPage() {
  // Supports routes like /dashboard/courses-class/[id]/edit OR /[course_class_id]/edit
  const params = useParams<{ id?: string; course_class_id?: string }>();
  const courseClassId = params?.id ?? params?.course_class_id ?? '';
  const router = useRouter();

  // ---- Editable class fields
  const [courseName, setCourseName] = useState<string>('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(true);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [weekDayIds, setWeekDayIds] = useState<string[]>([]);
  const [startHour, setStartHour] = useState('00');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('00');
  const [endMinute, setEndMinute] = useState('00');
  const [courseId, setCourseId] = useState<string>('');

  // Language (needed for availability search)
  const [languageId, setLanguageId] = useState<string>('');

  // Teachers
  const [currentTeacherData, setCurrentTeacherData] = useState<TeacherWithCalendars | null>(null);
  const [availableTeacherData, setAvailableTeacherData] = useState<TeacherWithCalendars[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ---- Load class, ALL weekdays, and SELECTED weekdays
  useEffect(() => {
    if (!courseClassId) return;

    (async () => {
      try {
        setError('');

        // 1) Load class
        const klass = await getCourseClassById(courseClassId);

        const cid = String(
          (klass as any)?.course?.id ??
          (klass as any)?.course_class?.course?.id ??
          ''
        );
        setCourseId(cid);

        setCourseName(
          String(
            (klass as any)?.course?.name ??
            (klass as any)?.course_class?.course?.name ??
            ''
          )
        );

        setName(klass.name ?? '');
        setStatus(Boolean(klass.status));
        setStartHour((klass as any).start_hour ?? '00');
        setStartMinute((klass as any).start_minute ?? '00');
        setEndHour((klass as any).end_hour ?? '00');
        setEndMinute((klass as any).end_minute ?? '00');

        const langId = String(
          (klass as any)?.language?.id ??
          (klass as any)?.course?.language?.id ??
          ''
        );
        setLanguageId(langId);

        if (klass.teacher) {
          setCurrentTeacherData({ teacher: klass.teacher, calendars: [] });
          setSelectedTeacherId(klass.teacher.id ?? '');
        } else {
          setCurrentTeacherData(null);
          setSelectedTeacherId('');
        }

        // 2) Load both: all weekdays + this class's selected weekdays
        const [allWds, selectedWds] = await Promise.all([
          getAllWeekDays(),
          getWeekDaysByCourseClass(courseClassId),
        ]);

        setWeekDays(allWds || []);
        const selectedIds = (selectedWds || [])
          .map(wd => wd?.id)
          .filter((id): id is string => Boolean(id))
          .map(String);
        setWeekDayIds(selectedIds);
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar a turma');
        console.error(e);
      }
    })();
  }, [courseClassId]);

  // ---- Search available teachers using current edited filters
  const searchTeachers = async () => {
    try {
      setLoading(true);
      setError('');

      if (!languageId) {
        setError('Idioma não definido para a turma.');
        return;
      }
      if (weekDayIds.length === 0) {
        setError('Selecione ao menos um dia da semana.');
        return;
      }

      const calendars = await fetchAvailabilityTeacher(
        weekDayIds,
        parseInt(languageId, 10),
        parseInt(startHour || '0', 10),
        parseInt(startMinute || '0', 10),
        parseInt(endHour || '0', 10),
        parseInt(endMinute || '0', 10)
      );

      // Group calendars by teacher
      const byId = new Map<string, TeacherWithCalendars>();
      for (const c of calendars) {
        const t = (c as any).teacher as TeacherModel | undefined;
        const tid = t?.id ? String(t.id) : '';
        if (!tid) continue;
        if (!byId.has(tid)) byId.set(tid, { teacher: t!, calendars: [] });
        byId.get(tid)!.calendars.push(c);
      }

      setAvailableTeacherData(Array.from(byId.values()));
    } catch (e: any) {
      setError(e?.message || 'Erro ao buscar professores');
    } finally {
      setLoading(false);
    }
  };

  // ---- Merge current + available (dedupe) and put selected first
  const mergedTeachers = useMemo(() => {
    const byId = new Map<string, TeacherWithCalendars>();

    const upsert = (pack: TeacherWithCalendars | null) => {
      if (!pack?.teacher?.id) return;
      const id = String(pack.teacher.id);
      if (!byId.has(id)) {
        byId.set(id, { teacher: pack.teacher, calendars: [...(pack.calendars || [])] });
      } else {
        const existing = byId.get(id)!;
        const seen = new Set(existing.calendars.map(
          c => `${c.week_day?.id}-${c.start_hour}:${c.start_minute}-${c.end_hour}:${c.end_minute}`
        ));
        for (const cal of (pack.calendars || [])) {
          const key = `${cal.week_day?.id}-${cal.start_hour}:${cal.start_minute}-${cal.end_hour}:${cal.end_minute}`;
          if (!seen.has(key)) {
            existing.calendars.push(cal);
            seen.add(key);
          }
        }
      }
    };

    upsert(currentTeacherData);
    for (const row of availableTeacherData) upsert(row);

    const list = Array.from(byId.values());
    list.sort((a, b) => {
      const aSel = String(a.teacher.id) === String(selectedTeacherId) ? -1 : 0;
      const bSel = String(b.teacher.id) === String(selectedTeacherId) ? -1 : 0;
      if (aSel !== bSel) return aSel - bSel; // selected first
      return (a.teacher.name || '').localeCompare(b.teacher.name || '');
    });

    return list;
  }, [currentTeacherData, availableTeacherData, selectedTeacherId]);

  const teachersProp = useMemo(
    () => mergedTeachers.map(m => m.teacher),
    [mergedTeachers]
  );
  const calendarsProp = useMemo(
    () => mergedTeachers.flatMap(m => m.calendars),
    [mergedTeachers]
  );

  // ---- Weekday & time handlers
  const toggleWeekDay = (id: string) => {
    const s = String(id);
    setWeekDayIds(prev => prev.includes(s) ? prev.filter(d => d !== s) : [...prev, s]);
  };

  const handleTimeChange = (field: string, value: string) => {
    if (field === 'start_hour') setStartHour(value);
    if (field === 'start_minute') setStartMinute(value);
    if (field === 'end_hour') setEndHour(value);
    if (field === 'end_minute') setEndMinute(value);
  };

  // ---- Save all (details + teacher)
  const saveAll = async () => {
    try {
      if (!courseClassId) return;
      setSaving(true);
      setError('');

      await updateCourseClass({
        id: courseClassId,
        course: courseId ? { id: courseId } : undefined,
        name,
        status,
        start_hour: startHour,
        start_minute: startMinute,
        end_hour: endHour,
        end_minute: endMinute,
        language: languageId ? ({ id: languageId } as any) : undefined,
        teacher: selectedTeacherId ? ({ id: selectedTeacherId } as any) : undefined,
      } as any);

      router.push('/dashboard/courses-class');
    } catch (e: any) {
      setError(e?.message || 'Erro ao salvar alterações');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!courseClassId) return <div className="p-6">Carregando…</div>;

  // ---------- Helpers for MOBILE teacher cards ----------
  const calendarsByTeacher = useMemo(() => {
    const map: Record<string, CalendarRangeHourDayModel[]> = {};
    for (const t of teachersProp) {
      const tid = String(t.id ?? '');
      map[tid] = calendarsProp.filter(c => String(c.teacher?.id ?? '') === tid);
    }
    return map;
  }, [teachersProp, calendarsProp]);

  const selectedTeacher = useMemo(
    () => teachersProp.find(t => String(t.id ?? '') === String(selectedTeacherId)),
    [teachersProp, selectedTeacherId]
  );
  const availableTeachers = useMemo(
    () => teachersProp.filter(t => String(t.id ?? '') !== String(selectedTeacherId))
      .sort((a, b) => (a.name || '').localeCompare(b.name || '')),
    [teachersProp, selectedTeacherId]
  );

  const toggleSelect = (tid: string) => {
    setSelectedTeacherId(prev => (String(prev) === String(tid) ? '' : tid));
  };

  return (
    <div className="p-6 space-y-6">
      {/* -------------------- DESKTOP -------------------- */}
      <div className="hidden md:block space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
          {/* Course name (context) */}
          <div className="mb-2">
            <div className="text-xs uppercase text-gray-500">Curso</div>
            <div className="mt-1 flex items-center gap-2">
              <BookOpenIcon className="h-[18px] w-[18px] text-gray-600" />
              <span className="text-sm font-semibold">
                {courseName || 'Curso não definido'}
              </span>
            </div>
          </div>

          {/* Class name */}
          <div>
            <label htmlFor="class-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Turma
            </label>
            <input
              id="class-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Status */}
          <div className="md:block mb-1 mt-4">
            <Switch
              checked={Boolean(status)}
              onChange={(checked: boolean) => setStatus(checked)}
              label={status ? 'Ativo' : 'Inativo'}
              color="green"
            />
          </div>

          {/* Weekdays */}
          <WeekDaySelector
            weekDays={weekDays}
            selectedDays={weekDayIds}
            onWeekDayToggle={toggleWeekDay}
          />

          {/* Time range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimeSelector
              startHour={startHour}
              startMinute={startMinute}
              endHour={endHour}
              endMinute={endMinute}
              onTimeChange={handleTimeChange}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={searchTeachers} aria-disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar Professor'}
            </Button>
            <Button onClick={saveAll} aria-disabled={saving || !name}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <CancelButton onClick={() => router.back()}>Cancelar</CancelButton>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Teacher list (desktop uses table component) */}
        <div>
          <div className="mb-2 text-sm text-gray-600">
            {selectedTeacherId
              ? `Selecionado: ${teachersProp.find(t => String(t.id) === String(selectedTeacherId))?.name ?? ''}`
              : 'Nenhum professor selecionado'}
          </div>

          <TeacherCalendarList
            teachers={teachersProp}
            teacherCalendars={calendarsProp}
            selectedTeacherId={selectedTeacherId}
            onTeacherSelect={(id) => setSelectedTeacherId(id)}
          />
        </div>
      </div>

      {/* -------------------- MOBILE -------------------- */}
      <div className="md:hidden space-y-4">
        {/* Card with course + form */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
          <div>
            <div className="text-xs uppercase text-gray-500">Curso</div>
            <div className="mt-1 flex items-center gap-2">
              <BookOpenIcon className="h-[18px] w-[18px] text-gray-600" />
              <span className="text-sm font-semibold">
                {courseName || 'Curso não definido'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="class-name-m" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Turma
            </label>
            <input
              id="class-name-m"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-1">
            <Switch
              checked={Boolean(status)}
              onChange={(checked: boolean) => setStatus(checked)}
              label={status ? 'Ativo' : 'Inativo'}
              color="green"
            />
          </div>

          <WeekDaySelector
            weekDays={weekDays}
            selectedDays={weekDayIds}
            onWeekDayToggle={toggleWeekDay}
          />

          <TimeSelector
            startHour={startHour}
            startMinute={startMinute}
            endHour={endHour}
            endMinute={endMinute}
            onTimeChange={handleTimeChange}
          />
        </div>

        {/* Selected teacher card */}
        {selectedTeacher && (
          <div className="rounded-lg overflow-hidden border border-blue-300">
            <div className="bg-blue-50 px-4 py-2 text-sm font-medium">Selecionado</div>
            <button
              className="w-full text-left px-4 py-3 bg-white active:bg-blue-50"
              onClick={() => toggleSelect(String(selectedTeacher.id))}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{selectedTeacher.name}</div>
                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Selecionado
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedTeacher.phone_number}
                {selectedTeacher.phone_number && selectedTeacher.email ? ' • ' : ''}
                {selectedTeacher.email}
              </div>
              {/* Schedules */}
              <div className="mt-2 flex flex-wrap gap-2">
                {(calendarsByTeacher[String(selectedTeacher.id)] || []).map((cal, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {cal.week_day?.week_day} {cal.start_hour}:{cal.start_minute} - {cal.end_hour}:{cal.end_minute}
                  </span>
                ))}
              </div>
            </button>
          </div>
        )}

        {/* Available teachers */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Disponíveis</div>
          {availableTeachers.length > 0 ? (
            <ul className="divide-y divide-gray-200 bg-white">
              {availableTeachers.map((t) => {
                const tid = String(t.id ?? '');
                const cals = calendarsByTeacher[tid] || [];
                return (
                  <li key={tid}>
                    <button
                      className="w-full text-left px-4 py-3 active:bg-gray-50"
                      onClick={() => toggleSelect(tid)}
                    >
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t.phone_number}
                        {t.phone_number && t.email ? ' • ' : ''}
                        {t.email}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {cals.length > 0 ? (
                          cals.map((cal, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {cal.week_day?.week_day} {cal.start_hour}:{cal.start_minute} - {cal.end_hour}:{cal.end_minute}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Sem horários</span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500 bg-white">
              Ajuste os filtros e toque em “Buscar Professor”.
            </div>
          )}
        </div>

        {/* Sticky bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 flex gap-2">
          <Button onClick={searchTeachers} aria-disabled={loading} className="flex-1">
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button onClick={saveAll} aria-disabled={saving || !name} className="flex-1">
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <CancelButton onClick={() => router.back()} className="flex-1">
            Cancelar
          </CancelButton>
        </div>
        <div className="h-16" /> {/* spacer to not hide content behind sticky bar */}
      </div>
    </div>
  );
}
