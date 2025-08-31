// useTeacherEdit.ts
'use client';

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { TeacherModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import type { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import type { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import type { LanguageModel } from '@/app/lib/definitions/language_definitions'; 
import { getTeacherById, updateTeacher } from './services/teachersApi.client';
import { getRangesByTeacher, createRangesForTeacher, deleteRanges } from './services/calendarApi.client';
import { getLanguages } from './services/languagesApi.client';
import { pad2, toInt, isValidRange } from '@/app/lib/utils/time';


type State = {
  form: TeacherModel;
  ranges: CalendarRangeHourDayModel[];
  weekDays: CalendarWeekDayModel[];
  tempRange: Partial<CalendarRangeHourDayModel>;
  selectedUddi: string | null;
  toRemove: TeacherWeekDayAvailableModel[];
  message: string;
  error: string | null;
  loading: boolean;
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'SET_FORM'; payload: Partial<TeacherModel> }
  | { type: 'SET_RANGES'; payload: CalendarRangeHourDayModel[] }
  | { type: 'SET_WEEK_DAYS'; payload: CalendarWeekDayModel[] }
  | { type: 'SET_TEMP_RANGE'; payload: Partial<CalendarRangeHourDayModel> }
  | { type: 'SET_SELECTED_UDDI'; payload: string | null }
  | { type: 'PUSH_TO_REMOVE'; payload: TeacherWeekDayAvailableModel }
  | { type: 'REMOVE_RANGE_BY_UDDI'; payload: string }
  | { type: 'ADD_RANGE'; payload: CalendarRangeHourDayModel };

const initial: State = {
  form: { status: true, languages: [], language_ids: [], calendar_range_hour_days: [] },
  ranges: [],
  weekDays: [],
  tempRange: {},
  selectedUddi: null,
  toRemove: [],
  message: '',
  error: null,
  loading: true,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'SET_LOADING': return { ...s, loading: a.payload };
    case 'SET_ERROR': return { ...s, error: a.payload };
    case 'SET_MESSAGE': return { ...s, message: a.payload };
    case 'SET_FORM': return { ...s, form: { ...s.form, ...a.payload } };
    case 'SET_RANGES': return { ...s, ranges: a.payload };
    case 'SET_WEEK_DAYS': return { ...s, weekDays: a.payload };
    case 'SET_TEMP_RANGE': return { ...s, tempRange: { ...s.tempRange, ...a.payload } };
    case 'SET_SELECTED_UDDI': return { ...s, selectedUddi: a.payload };
    case 'PUSH_TO_REMOVE':
      return s.toRemove.some(x => x.uddi === a.payload.uddi) ? s : { ...s, toRemove: [...s.toRemove, a.payload] };
    case 'REMOVE_RANGE_BY_UDDI':
      return { ...s, ranges: s.ranges.filter(r => r.uddi !== a.payload) };
    case 'ADD_RANGE':
      return { ...s, ranges: [...s.ranges, a.payload] };
    default: return s;
  }
}

export function useTeacherEdit(teacherId: string) {
  const [s, dispatch] = useReducer(reducer, initial);

  // load all
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const [ranges, langs] = await Promise.all([
          getRangesByTeacher(teacherId),
          getLanguages(),
        ]);

        const withUddi = ranges.map(r => ({ ...r, uddi: r.uddi ?? uuidv4() }));
        dispatch({ type: 'SET_RANGES', payload: withUddi });
        dispatch({ type: 'SET_FORM', payload: { languages: langs } });

        if (withUddi.length && withUddi[0].teacher) {
          const t = withUddi[0].teacher as TeacherModel;
          dispatch({
            type: 'SET_FORM',
            payload: {
              id: t.id ?? '',
              name: t.name ?? '',
              email: t.email ?? '',
              phone_number: t.phone_number ?? '',
              compensation: t.compensation?.toString() ?? '',
              start_date: t.start_date ?? '',
              status: t.status ?? true,
              language_ids: t.languages?.map(l => String(l.id)) ?? [],
            },
          });
        } else {
          const t = await getTeacherById(teacherId);
          dispatch({
            type: 'SET_FORM',
            payload: {
              id: t.id ?? '',
              name: t.name ?? '',
              email: t.email ?? '',
              phone_number: t.phone_number ?? '',
              compensation: t.compensation?.toString() ?? '',
              start_date: t.start_date ?? '',
              status: t.status ?? true,
            },
          });
        }

        dispatch({ type: 'SET_TEMP_RANGE', payload: { start_hour: '', start_minute: '', end_hour: '', end_minute: '' } });
      } catch (e: any) {
        dispatch({ type: 'SET_ERROR', payload: e?.message ?? 'Erro ao carregar' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, [teacherId]);

  // actions
  const toggleLanguage = useCallback((langId: string) => {
    const list = new Set(s.form.language_ids ?? []);
    list.has(langId) ? list.delete(langId) : list.add(langId);
    dispatch({ type: 'SET_FORM', payload: { language_ids: Array.from(list) } });
  }, [s.form.language_ids]);

  const addAvailability = useCallback((wd: { id?: string | number; week_day?: string }) => {
    const wdId = String(wd.id ?? '').trim();
    const wdLabel = String(wd.week_day ?? '').trim();
    const sh = toInt(String(s.tempRange.start_hour ?? ''));
    const sm = toInt(String(s.tempRange.start_minute ?? ''));
    const eh = toInt(String(s.tempRange.end_hour ?? ''));
    const em = toInt(String(s.tempRange.end_minute ?? ''));

    if (!wdId || !wdLabel) return dispatch({ type: 'SET_MESSAGE', payload: '❌ Selecione um dia da semana.' });
    const ok = isValidRange(sh, sm, eh, em);
    if (!ok.ok) return dispatch({ type: 'SET_MESSAGE', payload: `❌ ${ok.msg}` });

    const dup = s.ranges.some(r =>
      String(r.week_day?.id) === wdId &&
      String(r.start_hour) === String(s.tempRange.start_hour) &&
      String(r.start_minute) === String(s.tempRange.start_minute) &&
      String(r.end_hour) === String(s.tempRange.end_hour) &&
      String(r.end_minute) === String(s.tempRange.end_minute)
    );
    if (dup) return dispatch({ type: 'SET_MESSAGE', payload: '❌ Disponibilidade idêntica já existe.' });

    dispatch({
      type: 'ADD_RANGE',
      payload: {
        uddi: uuidv4(),
        start_hour: pad2(sh),
        start_minute: pad2(sm),
        end_hour: pad2(eh),
        end_minute: pad2(em),
        week_day: { id: wdId, week_day: wdLabel },
        teacher: { id: s.form.id },
      } as CalendarRangeHourDayModel,
    });

    dispatch({ type: 'SET_TEMP_RANGE', payload: { start_hour: '', start_minute: '', end_hour: '', end_minute: '' } });
    dispatch({ type: 'SET_MESSAGE', payload: '✅ Disponibilidade adicionada.' });
  }, [s.tempRange, s.ranges, s.form.id]);

  const removeAvailabilityByUddi = useCallback((uddi: string) => {
    const item = s.ranges.find(r => r.uddi === uddi);
    if (item && (item.id || item.id === 0)) {
      dispatch({
        type: 'PUSH_TO_REMOVE',
        payload: {
          id: String(item.id) as any,
          uddi: item.uddi,
          week_day: item.week_day,
          start_hour: item.start_hour,
          start_minute: item.start_minute,
          end_hour: item.end_hour,
          end_minute: item.end_minute,
        },
      });
    }
    dispatch({ type: 'REMOVE_RANGE_BY_UDDI', payload: uddi });
  }, [s.ranges]);

  const save = useCallback(async (teacherId: string) => {
    // remove queued
    if (s.toRemove.length) {
      const ids = s.toRemove.map(x => String(x.id)).filter(Boolean);
      if (ids.length) await deleteRanges(ids);
    }
    // add new (items without id)
    const toAdd = s.ranges.filter(r => !('id' in r) || r.id === undefined || r.id === null);
    if (toAdd.length) await createRangesForTeacher(teacherId, toAdd);

    // update teacher (sync selected languages)
    const languages = (s.form.languages ?? []).filter(l => l.id && (s.form.language_ids ?? []).includes(String(l.id)));
    await updateTeacher({ ...s.form, languages });

    dispatch({ type: 'SET_MESSAGE', payload: '✅ Teacher updated successfully!' });
  }, [s.toRemove, s.ranges, s.form]);

  return {
    state: s,
    actions: {
      setForm: (p: Partial<TeacherModel>) => dispatch({ type: 'SET_FORM', payload: p }),
      setTempRange: (p: Partial<CalendarRangeHourDayModel>) => dispatch({ type: 'SET_TEMP_RANGE', payload: p }),
      setSelectedUddi: (u: string | null) => dispatch({ type: 'SET_SELECTED_UDDI', payload: u }),
      setWeekDays: (w: CalendarWeekDayModel[]) => dispatch({ type: 'SET_WEEK_DAYS', payload: w }),
      setError: (m: string | null) => dispatch({ type: 'SET_ERROR', payload: m }),
      setMessage: (m: string) => dispatch({ type: 'SET_MESSAGE', payload: m }),
      toggleLanguage,
      addAvailability,
      removeAvailabilityByUddi,
      save,
    },
  };
}
