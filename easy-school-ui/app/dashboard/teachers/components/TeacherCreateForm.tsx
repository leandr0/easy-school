// CreateTeacherForm.tsx
'use client';

import { Button } from '@/app/ui/button';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import React, { useState, useEffect } from 'react';

import { TeacherInfoComponent } from './TeacherInfoComponent';
import { LanguageSelectListComponent } from './LanguageSelectListComponent';
import { TeacherWeekDayAvailabilityComponent } from './TeacherWeekDayAvailabilityComponent';
import { CalendarWeekDaySelectComponent } from './CalendarWeekDaySelectComponent';
import { TeacherAvailabilityInputComponent } from './TeacherAvailabilityInputComponent';
import { CancelAndRedirect } from '../../../ui/buttons/ui_buttons';
import { createTeacher } from '@/app/services/teacherService';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { CreateTeacherFormModel, TeacherModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllLanguages } from '@/app/services/languageService';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';

// --- NEW: Mobile wrapper component import (file below)
import { CreateTeacherFormMobile } from './CreateTeacherFormMobile';

export default function CreateTeacherForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTeacherFormModel>({
    name: '',
    status: true,
    phone_number: '',
    compensation: '',
    language_ids: [],
  });

  const [teacherWeeDayAvailables, setTeacherWeeDayAvailables] = useState<TeacherWeekDayAvailableModel[]>([]);
  const [calendarRangeHourDayModels, setCalendarRangeHourDayModels] = useState<CalendarRangeHourDayModel[]>([]);
  const [languages, setLanguages] = useState<LanguageModel[]>([]);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [teacher, setTeacher] = useState<TeacherModel>();
  const [actionType, setActionType] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleWeekDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedWeekDay = weekDays.find(day => day.id?.toString() === selectedId);
    if (selectedWeekDay) {
      setFormData(prev => ({
        ...prev,
        week_day: selectedWeekDay,
      }));
    }
  };

  const handleLanguageToggle = (langId: string) => {
    setFormData(prev => {
      const exists = prev.language_ids.includes(langId);
      return {
        ...prev,
        language_ids: exists
          ? prev.language_ids.filter(id => id !== langId)
          : [...prev.language_ids, langId],
      };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, langId: string) => {
    e.stopPropagation();
    const { checked } = e.target;
    setFormData(prev => {
      let updated = [...prev.language_ids];
      if (checked && !updated.includes(langId)) updated.push(langId);
      if (!checked && updated.includes(langId)) updated = updated.filter(id => id !== langId);
      return { ...prev, language_ids: updated };
    });
  };

  useEffect(() => {
    getAllLanguages()
      .then(setLanguages)
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    getAllWeekDays()
      .then(list =>
        setWeekDays([
          { id: '', week_day: 'Selecione um dia da semana ... ' },
          ...list,
        ]),
      )
      .catch(err => setError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'add_teacher_availability') {
      if (!formData.week_day || formData.week_day.id === '') {
        setMessage('❌ Por favor, selecione um dia da semana.');
        return;
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
        start_hour: '',
        start_minute: '',
        end_hour: '',
        end_minute: '',
      }));

      return;
    } else if (actionType === 'remove_week_day_availability') {
      setTeacherWeeDayAvailables(prev => prev.filter(item => item.uddi !== formData.week_day?.id));
      return;
    }

    try {
      const newTeacher: TeacherModel = {
        name: formData.name,
        phone_number: formData.phone_number,
        email: formData.email,
        status: formData.status,
        compensation: formData.compensation,
        start_date: formData.start_date,
        language_ids: formData.language_ids,
        calendar_range_hour_days: teacherWeeDayAvailables.map(item => ({
          week_day: item.week_day,
          start_hour: item.start_hour,
          start_minute: item.start_minute,
          end_hour: item.end_hour,
          end_minute: item.end_minute,
        })),
      };

      await createTeacher(newTeacher);

      setMessage('✅ Teacher created successfully!');
      setFormData({
        name: '',
        status: true,
        language_ids: [],
      });

      router.push('/dashboard/teachers');
    } catch (err: any) {
      setMessage(`❌ ${err?.message || 'Unknown error occurred.'}`);
    }
  };

  const handleCompensationChange = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      compensation: amount.toString(),
    }));
  };

  const sharedProps = {
    formData,
    languages,
    weekDays,
    teacherWeeDayAvailables,
    message,
    setActionType,
    handleInputChange,
    handleCompensationChange,
    handleLanguageToggle,
    handleCheckboxChange,
    handleWeekDayChange,
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Desktop layout */}
      <div className="hidden md:block">
        <TeacherInfoComponent
          formData={formData}
          handleInputChange={handleInputChange}
          onCompensationChange={handleCompensationChange}
        />

        <LanguageSelectListComponent
          languages={languages}
          language_ids={formData.language_ids}
          handleLanguageToggle={handleLanguageToggle}
          handleCheckboxChange={handleCheckboxChange}
        />

        {message && (
          <div className={`mt-4 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <TeacherWeekDayAvailabilityComponent
          teacherWeeDayAvailables={teacherWeeDayAvailables}
          setFormData={setFormData}
          setActionType={setActionType}
        />

        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-4 md:pt-5">
              <CalendarWeekDaySelectComponent
                weekDays={weekDays}
                formData={formData}
                handleWeekDayChange={handleWeekDayChange}
              />

              <TeacherAvailabilityInputComponent
                formData={formData}
                handleInputChange={handleInputChange}
              />

              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="submit"
                  name="action"
                  onClick={() => setActionType('add_teacher_availability')}
                  value="add_teacher_availability"
                  className="hover:bg-purple-500"
                >
                  Adicionar disponibilidade
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <CancelAndRedirect redirectLink="/dashboard/teachers" name="Cancel" />
          <Button onClick={() => setActionType('')} className="hover:bg-purple-500" type="submit">
            Criar Professor
          </Button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <CreateTeacherFormMobile
          {...sharedProps}
          onAddAvailability={() => setActionType('add_teacher_availability')}
          onCreateTeacher={() => setActionType('')}
          onCancel={() => router.push('/dashboard/teachers')}
        />
      </div>
    </form>
  );
}
