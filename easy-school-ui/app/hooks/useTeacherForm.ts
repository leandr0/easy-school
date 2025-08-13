'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { CreateTeacherFormModel, TeacherModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { createTeacher } from '@/app/services/teacherService';
import { getAllLanguages } from '@/app/services/languageService';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';

export const useTeacherForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [actionType, setActionType] = useState<string | null>(null);

  // Form data states
  const [formData, setFormData] = useState<CreateTeacherFormModel>({
    name: "",
    status: true,
    phone_number: "",
    language_ids: [],
  });

  const [teacherWeeDayAvailables, setTeacherWeeDayAvailables] = useState<TeacherWeekDayAvailableModel[]>([]);
  const [languages, setLanguages] = useState<LanguageModel[]>([]);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWeekDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedWeekDay = weekDays.find(day => day.id?.toString() === selectedId);

    if (selectedWeekDay) {
      setFormData(prev => ({
        ...prev,
        week_day: selectedWeekDay
      }));
    }
  };

  const handleLanguageToggle = (langId: string) => {
    setFormData((prev) => {
      const exists = prev.language_ids.includes(langId);
      const updatedIds = exists
        ? prev.language_ids.filter(id => id !== langId)
        : [...prev.language_ids, langId];

      return {
        ...prev,
        language_ids: updatedIds
      };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, langId: string) => {
    e.stopPropagation(); // Stop event from bubbling up to the row
    const { checked } = e.target;

    setFormData((prev) => {
      let updatedIds = [...prev.language_ids];

      if (checked && !prev.language_ids.includes(langId)) {
        updatedIds = [...prev.language_ids, langId];
      } else if (!checked && prev.language_ids.includes(langId)) {
        updatedIds = prev.language_ids.filter(id => id !== langId);
      }

      return {
        ...prev,
        language_ids: updatedIds
      };
    });
  };

  // Data fetching
  useEffect(() => {
    getAllLanguages()
      .then(languages => {
        setLanguages(languages);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    getAllWeekDays()
      .then((weekDays) => {
        const updatedWeekDays = [
          {
            id: "",
            week_day: "Selecione um dia da semana ... ",
          },
          ...weekDays,
        ];

        setWeekDays(updatedWeekDays);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Form submission logic
  const handleAvailabilityAction = () => {
    if (actionType === 'add_teacher_availability') {
      if (!formData.week_day || formData.week_day.id === "") {
        setMessage("❌ Por favor, selecione um dia da semana.");
        return false;
      }

      const newAvailability: TeacherWeekDayAvailableModel = {
        uddi: uuid(),
        week_day: formData.week_day,
        start_hour: formData.start_hour,
        start_minute: formData.start_minute,
        end_hour: formData.end_hour,
        end_minute: formData.end_minute,
      };

      setTeacherWeeDayAvailables(prev => [...prev, newAvailability]);

      setFormData(prev => ({
        ...prev,
        week_day: undefined,
        start_hour: "",
        start_minute: "",
        end_hour: "",
        end_minute: "",
      }));

      return true;
    } 
    else if (actionType === 'remove_week_day_availability') {
      setTeacherWeeDayAvailables(prev => prev.filter(item => item.uddi !== formData.week_day?.id));
      return true;
    }
    return false;
  };

  const handleCreateTeacher = async () => {
    try {

      const newTeacher: TeacherModel = {
        name: formData.name,
        phone_number: formData.phone_number,
        email: formData.email,
        status: formData.status,
        compensation: formData.compensation,
        start_date: formData.start_date,
        language_ids: formData.language_ids,
        calendar_range_hour_days: teacherWeeDayAvailables.map((item): CalendarRangeHourDayModel => ({
          week_day: item.week_day,
          start_hour: item.start_hour,
          start_minute: item.start_minute,
          end_hour: item.end_hour,
          end_minute: item.end_minute,
        })),
      };

      await createTeacher(newTeacher);
      
      setMessage("✅ Teacher created successfully!");
      setFormData({
        name: "",
        status: true,
        language_ids: [],
      });

      router.push("/dashboard/teachers");
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
        console.error("Form submission error:", err);
      } else {
        setMessage("❌ Unknown error occurred.");
        console.error("Unknown form submission error:", err);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'add_teacher_availability' || actionType === 'remove_week_day_availability') {
      return handleAvailabilityAction();
    } else {
      return handleCreateTeacher();
    }
  };

  return {
    formData,
    setFormData,
    teacherWeeDayAvailables,
    setTeacherWeeDayAvailables,
    languages,
    weekDays,
    error,
    message,
    actionType,
    setActionType,
    handleInputChange,
    handleWeekDayChange,
    handleLanguageToggle,
    handleCheckboxChange,
    handleSubmit
  };
};