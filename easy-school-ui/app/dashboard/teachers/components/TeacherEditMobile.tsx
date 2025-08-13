'use client';

import React from 'react';
import { Button } from '@/app/ui/button';
import { TeacherModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import { TeacherInfoComponent } from './TeacherInfoComponent';
import { LanguageSelectListComponent } from './LanguageSelectListComponent';
import { TeacherWeekDayAvailabilityComponent } from './TeacherWeekDayAvailabilityComponent';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { CalendarWeekDaySelectComponent } from './CalendarWeekDaySelectComponent';
import { TeacherAvailabilityInputComponent } from './TeacherAvailabilityInputComponent';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';

interface Props {
  formData: TeacherModel;
  message: string;
  error: string | null;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  // handlers
  onSwitchStatus: (checked: boolean) => void;
  handleLanguageToggle: (langId: string) => void;
  setSelectedWeekDayUddi: (uddi: string) => void;
  handleCompensationChange: (amount: number) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, langId: string) => void;
  handleWeekDayChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChangeCalendarRangeHourDay: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<TeacherModel>>;
  setActionType: React.Dispatch<React.SetStateAction<string | null>>;

  // data
  teacherWeeDayAvailables: CalendarRangeHourDayModel[];
  weekDays: CalendarWeekDayModel[];
  calendarRangeHour: CalendarRangeHourDayModel;
  selectedWeekDay: TeacherWeekDayAvailableModel;
}

export default function TeacherEditMobile({
  formData,
  message,
  error,
  onSubmit,
  onSwitchStatus,
  handleLanguageToggle,
  setSelectedWeekDayUddi,
  handleCompensationChange,
  handleCheckboxChange,
  handleWeekDayChange,
  handleInputChange,
  handleInputChangeCalendarRangeHourDay,
  setFormData,
  setActionType,
  teacherWeeDayAvailables,
  weekDays,
  calendarRangeHour,
  selectedWeekDay,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="md:hidden p-4 space-y-6">
      {/* Alerts */}
      {message && (
        <div className={`p-3 rounded-md text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 text-center">
          Error: {error}
        </div>
      )}

      {/* 1) Teacher info */}

          <TeacherInfoComponent
            formData={formData}
            handleInputChange={handleInputChange}
            onCompensationChange={handleCompensationChange}
            onSwitchStatus={onSwitchStatus}
          />
    

      {/* 2) Languages */}
     
          <LanguageSelectListComponent
            languages={formData.languages ?? []}
            language_ids={formData.language_ids ?? []}
            handleLanguageToggle={handleLanguageToggle}
            handleCheckboxChange={handleCheckboxChange}
          />
  

      {/* 3) Current availability list (tap to select row; trash to mark for removal) */}
     
        
    
          <TeacherWeekDayAvailabilityComponent
            teacherWeeDayAvailables={teacherWeeDayAvailables}
            setFormData={setFormData}
            setActionType={setActionType}
            setSelectedWeekDayUddi={setSelectedWeekDayUddi}
          />
       

      {/* 4) Add new availability */}
      <section className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 pt-2">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Adicionar disponibilidade</h2>
        </div>

        <div className="p-4 space-y-4">
          <CalendarWeekDaySelectComponent
            weekDays={weekDays}
            formData={selectedWeekDay}
            handleWeekDayChange={handleWeekDayChange}
          />

          <TeacherAvailabilityInputComponent
            formData={calendarRangeHour}
            handleInputChange={handleInputChangeCalendarRangeHourDay}
          />

          <Button
            type="submit"
            name="action"
            onClick={() => setActionType('add_teacher_availability')}
            value="add_teacher_availability"
            className="w-full hover:bg-purple-500"
          >
            Adicionar disponibilidade
          </Button>
        </div>
      </section>

      {/* Footer actions */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 -mx-4">
        <div className="flex gap-3">
          <a
            href="/dashboard/teachers"
            className="flex-1 inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </a>
          <Button
            className="flex-1 hover:bg-purple-500"
            type="submit"
            onClick={() => setActionType('update_teacher')}
          >
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
