'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { TeacherModel, TeacherWeekDayAvailableModel } from "@/app/lib/definitions/teacher_definitions";
import TeacherEditDesktop from "./EditTeacherDesktop";
import { CalendarRangeHourDayModel } from "@/app/lib/definitions/calendat_range_hour_day_definitions";
import { CalendarWeekDayModel } from "@/app/lib/definitions/calendar_week_day_definitions";
import { v4 as uuidv4 } from 'uuid';
import TeacherEditMobile from "./TeacherEditMobile";
import { LanguageModel } from "@/app/lib/definitions/language_definitions";
import { getAllLanguages } from "@/bff/services/language.server";
import { createByTeacherId, deleteRangeHourDayList, fetchCalendarRangeHourDayByTeacher } from "@/bff/services/calendarRangeHourDay.server";
import { getTeacherById, updateTeacher } from "@/bff/services/teacher.server";
import { HttpError } from "@/app/config/api";
import { getAllWeekDays } from "@/bff/services/calendarWeekDay.server";

export default function TeacherEditForm({ teacher, languages, calendars }: { teacher: TeacherModel, languages: LanguageModel[], calendars: CalendarRangeHourDayModel[] }) {
  const router = useRouter();

  teacher.languages = languages;

  const [formData, setFormData] = useState<TeacherModel>(teacher || {});

  // Availabilities shown in the editor
  const [calendarRangeHourDayModels, setCalendarRangeHourDayModels] = useState<CalendarRangeHourDayModel[]>([]);
  const [calendarRangeHour, setCalendarRangeHour] = useState<CalendarRangeHourDayModel>();

  // Items to remove (persist later)
  const [teacherWeeDayForRemove, setTeacherWeeDayForRemove] = useState<TeacherWeekDayAvailableModel[]>([]);
  const [selectedWeekDayUddi, setSelectedWeekDayUddi] = useState<string | null>(null);

  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [selectedWeekDay, setSelectedWeekDay] = useState<TeacherWeekDayAvailableModel>({
    end_hour: "",
    end_minute: "",
    start_hour: "",
    start_minute: "",
    id: "",
    uddi: "",
    week_day: { id: "", week_day: "" }
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);


  const deleteTeacherRangeHourDayList = useCallback(async (ids: string[]) => {
    setError(null);

    try {
      return await deleteRangeHourDayList(ids);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message || 'Erro desconhecido');
    }
  }, []);


  const createByTeacher = useCallback(async (teacher_id: string, payload: CalendarRangeHourDayModel[]) => {
    setError(null);

    try {
      return await createByTeacherId(teacher_id, payload);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message || 'Erro desconhecido');
    }
  }, []);


  const saveTeacher = useCallback(async (payload: TeacherModel) => {
    setError(null);

    try {
      return await updateTeacher(payload);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message || 'Erro desconhecido');
    }
  }, []);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {

        if (calendars.length > 0 && calendars[0].teacher) {
          const calendarsWithUddi = calendars.map(c => ({ ...c, uddi: uuidv4() }));
          setCalendarRangeHourDayModels(calendarsWithUddi);

        } else {
          setCalendarRangeHourDayModels([]);
        }

        setCalendarRangeHour({
          end_hour: "",
          end_minute: "",
          start_hour: "",
          start_minute: "",
        });

      }
      catch (err: any) {
        setError(err.message);
      }
    };

    fetchTeacherData();
  }, [teacher]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      if (actionType === 'remove_week_day_availability') {
        if (selectedWeekDayUddi) {
          const selectedItem = calendarRangeHourDayModels.find(t => t.uddi === selectedWeekDayUddi);

          // Only track for removal if it has a valid persisted ID
          const isValidId = (id: unknown): id is string | number =>
            (typeof id === "string" && id.trim().length > 0) ||
            (typeof id === "number" && !Number.isNaN(id));

          if (selectedItem && isValidId(selectedItem.id)) {
            const removeItem: TeacherWeekDayAvailableModel = {
              id: String(selectedItem.id) as any,
              uddi: selectedItem.uddi,
              week_day: selectedItem.week_day,
              start_hour: selectedItem.start_hour,
              start_minute: selectedItem.start_minute,
              end_hour: selectedItem.end_hour,
              end_minute: selectedItem.end_minute,
            };

            setTeacherWeeDayForRemove(prev =>
              prev.some(p => p.uddi === removeItem.uddi) ? prev : [...prev, removeItem]
            );
          }

          // Optimistically remove from the visible list
          setCalendarRangeHourDayModels(prev => prev.filter(item => item.uddi !== selectedWeekDayUddi));
          setSelectedWeekDayUddi(null);
        }
        return;
      }

      // helpers (put them above your component or inside it before use)
      const isFilled = (v?: string | number | null) =>
        v !== null && v !== undefined && String(v).trim() !== '';

      const toInt = (v: string | number | undefined | null) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
      };

      const inRange = (n: number, min: number, max: number) => n >= min && n <= max;

      const toMinutes = (h: number, m: number) => h * 60 + m;

      // inside your handleSubmit (or wherever you handle the 'add_teacher_availability' action):
      if (actionType === 'add_teacher_availability') {
        // 1) Validate weekday
        const wdId = selectedWeekDay.week_day?.id?.toString().trim() || '';
        const wdLabel = selectedWeekDay.week_day?.week_day?.toString().trim() || '';
        if (!wdId || !wdLabel) {
          setMessage('❌ Selecione um dia da semana.');
          return;
        }

        // 2) Validate time fields existence
        const shStr = calendarRangeHour?.start_hour ?? '';
        const smStr = calendarRangeHour?.start_minute ?? '';
        const ehStr = calendarRangeHour?.end_hour ?? '';
        const emStr = calendarRangeHour?.end_minute ?? '';

        if (![shStr, smStr, ehStr, emStr].every(isFilled)) {
          setMessage('❌ Preencha horas e minutos de início e fim.');
          return;
        }

        // 3) Parse and validate ranges
        const sh = toInt(shStr);
        const sm = toInt(smStr);
        const eh = toInt(ehStr);
        const em = toInt(emStr);

        if (
          [sh, sm, eh, em].some(Number.isNaN) ||
          !inRange(sh, 0, 23) ||
          !inRange(eh, 0, 23) ||
          !inRange(sm, 0, 59) ||
          !inRange(em, 0, 59)
        ) {
          setMessage('❌ Horários inválidos. Use horas 0–23 e minutos 0–59.');
          return;
        }

        // 4) Validate ordering and minimum duration (>= 60 minutes)
        const startTotal = toMinutes(sh, sm);
        const endTotal = toMinutes(eh, em);

        if (endTotal <= startTotal) {
          setMessage('❌ O horário final deve ser maior que o inicial.');
          return;
        }
        if (endTotal - startTotal < 60) {
          setMessage('❌ A disponibilidade deve ter pelo menos 1 hora.');
          return;
        }

        // 5) (Opcional) evitar duplicatas exatas para o mesmo dia
        const isDuplicate = calendarRangeHourDayModels.some((r) =>
          String(r.week_day?.id) === wdId &&
          String(r.start_hour) === String(shStr) &&
          String(r.start_minute) === String(smStr) &&
          String(r.end_hour) === String(ehStr) &&
          String(r.end_minute) === String(emStr)
        );
        if (isDuplicate) {
          setMessage('❌ Já existe uma disponibilidade idêntica para este dia e horário.');
          return;
        }

        // 6) Build and add
        const addCalendarWeekDay: CalendarRangeHourDayModel = {
          uddi: uuidv4(),
          start_hour: String(sh).padStart(2, '0'),
          start_minute: String(sm).padStart(2, '0'),
          end_hour: String(eh).padStart(2, '0'),
          end_minute: String(em).padStart(2, '0'),
          week_day: { id: wdId, week_day: wdLabel },
          teacher: { id: formData.id },
        };

        setCalendarRangeHourDayModels((prev) => [...prev, addCalendarWeekDay]);

        // reset inputs
        setSelectedWeekDay({
          end_hour: '',
          end_minute: '',
          start_hour: '',
          start_minute: '',
          id: '',
          uddi: '',
          week_day: { id: '', week_day: '' },
        });
        setCalendarRangeHour({ end_hour: '', end_minute: '', start_minute: '', start_hour: '' });

        setMessage('✅ Disponibilidade adicionada.');
        return;
      }


      if (actionType === 'update_teacher') {
        // Persisting languages with the chosen IDs
        const filteredLanguages = formData.languages?.filter(language =>
          language.id && formData.language_ids?.includes(language.id.toString())
        ) || [];

        const updatedFormData: TeacherModel = { ...formData, languages: filteredLanguages };

        if (teacherWeeDayForRemove.length) {
          const ids: string[] = teacherWeeDayForRemove.map(item => item.id).filter(id => id !== undefined) as string[];
          deleteTeacherRangeHourDayList(ids);
        }

        // Keep only the items WITHOUT id (new ones to add),
        // and log the result *inside* the updater (ensures the log sees the filtered list).
        setCalendarRangeHourDayModels(prev => {
          const toAdd = prev.filter(item => !item.id);
          return toAdd;
        });

        if (calendarRangeHourDayModels && calendarRangeHourDayModels.length > 0) {
          createByTeacher(teacher.id!, calendarRangeHourDayModels);
        }

        saveTeacher(updatedFormData);
        setMessage("✅ Teacher updated successfully!");
        router.push("/dashboard/teachers");
        router.refresh();
        return;
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Unknown error occurred.");
    }
  };


  const getTeacher = useCallback(async (teacher_id: string): Promise<TeacherModel> => {
    setError(null);
    const data = await getTeacherById(teacher_id);
    return data;
  }, []);


  const getWeekDays = useCallback(async () => {
    setError(null);

    try {
      const res = await getAllWeekDays();

      const list: CalendarWeekDayModel[] = res;

      setWeekDays([
        { id: '', week_day: 'Selecione um dia da semana ... ' }, // placeholder
        ...list,
      ]);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message || 'Erro desconhecido');
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    // call it (no payload needed for GET)
    getWeekDays();

    return () => ctrl.abort();
  }, [getWeekDays]);

  const handleLanguageToggle = (langId: string) => {
    setFormData(prev => {
      const exists = prev.language_ids!.includes(langId);
      return {
        ...prev,
        language_ids: exists
          ? prev.language_ids!.filter(id => id !== langId)
          : [...prev.language_ids!, langId],
      };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, langId: string) => {
    e.stopPropagation();
    const { checked } = e.target;
    setFormData(prev => {
      let updated = [...prev.language_ids!];
      if (checked && !updated.includes(langId)) updated.push(langId);
      if (!checked && updated.includes(langId)) updated = updated.filter(id => id !== langId);
      return { ...prev, language_ids: updated };
    });
  };

  const handleWeekDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const itemWeekDay = weekDays.find(day => day.id?.toString() === selectedId);
    if (itemWeekDay) {
      setSelectedWeekDay({
        week_day: { id: itemWeekDay.id, week_day: itemWeekDay.week_day }
      } as TeacherWeekDayAvailableModel);
    }
  };

  const handleInputChangeCalendarRangeHourDay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCalendarRangeHour(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked as any) : value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked as any) : value,
    }));
  };

  const handleCompensationChange = (amount: number) => {
    setFormData(prev => ({ ...prev, compensation: amount.toString() }));
  };

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <TeacherEditDesktop
          formData={formData}
          message={message}
          error={error}
          setFormData={setFormData}
          setActionType={setActionType}
          teacherWeeDayAvailables={calendarRangeHourDayModels}
          onChange={() => { }}
          onSubmit={handleSubmit}
          handleCheckboxChange={handleCheckboxChange}
          handleLanguageToggle={handleLanguageToggle}
          handleCompensationChange={handleCompensationChange}
          handleWeekDayChange={handleWeekDayChange}
          handleInputChange={handleInputChange}
          onSwitchStatus={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
          weekDays={weekDays}
          setSelectedWeekDayUddi={setSelectedWeekDayUddi}
          calendarRangeHour={calendarRangeHour!}
          handleInputChangeCalendarRangeHourDay={handleInputChangeCalendarRangeHourDay}
          selectedWeekDay={selectedWeekDay!}
        />
      </div>

      <div className="block md:hidden px-4 space-y-6">
        <TeacherEditMobile
          formData={formData}
          message={message}
          error={error}
          setFormData={setFormData}
          setActionType={setActionType}
          teacherWeeDayAvailables={calendarRangeHourDayModels}
          onSubmit={handleSubmit}
          handleCheckboxChange={handleCheckboxChange}
          handleLanguageToggle={handleLanguageToggle}
          handleCompensationChange={handleCompensationChange}
          handleWeekDayChange={handleWeekDayChange}
          handleInputChange={handleInputChange}
          onSwitchStatus={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
          weekDays={weekDays}
          setSelectedWeekDayUddi={setSelectedWeekDayUddi}
          calendarRangeHour={calendarRangeHour!}
          handleInputChangeCalendarRangeHourDay={handleInputChangeCalendarRangeHourDay}
          selectedWeekDay={selectedWeekDay!}
        />
      </div>
    </div>
  );
}
