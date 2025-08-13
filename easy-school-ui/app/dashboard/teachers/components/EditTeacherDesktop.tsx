'use client';

import React from 'react';
import { Button } from '@/app/ui/button';
import { TeacherModel, TeacherUpdateModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import { TeacherInfoComponent } from './TeacherInfoComponent';
import { LanguageSelectListComponent } from './LanguageSelectListComponent';
import { TeacherWeekDayAvailabilityComponent } from './TeacherWeekDayAvailabilityComponent';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { CalendarWeekDaySelectComponent } from './CalendarWeekDaySelectComponent';
import { TeacherAvailabilityInputComponent } from './TeacherAvailabilityInputComponent';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { CreateCourseClassModel } from '@/app/lib/definitions/course_class_definitions';

interface Props {
  formData: TeacherModel;
  message: string;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
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
  teacherWeeDayAvailables: CalendarRangeHourDayModel[];
  weekDays: CalendarWeekDayModel[];
  calendarRangeHour: CalendarRangeHourDayModel;
  selectedWeekDay: TeacherWeekDayAvailableModel;
}

export default function TeacherEditDesktop({
  formData,
  message,
  error,
  onChange,
  onSubmit,
  handleLanguageToggle,
  setSelectedWeekDayUddi,
  handleCompensationChange,
  handleCheckboxChange,
  handleWeekDayChange,
  handleInputChange,
  handleInputChangeCalendarRangeHourDay,
  onSwitchStatus,
  setFormData,
  setActionType,
  teacherWeeDayAvailables,
  weekDays,
  calendarRangeHour,
  selectedWeekDay
}: Props) {
  return (
    <form onSubmit={onSubmit} className="p-4">


      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg  p-2 md:pt-0">
            <TeacherInfoComponent
              formData={formData}
              handleInputChange={handleInputChange}
              onCompensationChange={handleCompensationChange}
              onSwitchStatus={onSwitchStatus}
            />
          </div>
          <LanguageSelectListComponent
            languages={formData.languages!}
            language_ids={formData.language_ids ? formData.language_ids : []}
            handleLanguageToggle={handleLanguageToggle}
            handleCheckboxChange={handleCheckboxChange}
          />

          <TeacherWeekDayAvailabilityComponent
            teacherWeeDayAvailables={teacherWeeDayAvailables}
            setFormData={setFormData}
            setActionType={setActionType}
            setSelectedWeekDayUddi={setSelectedWeekDayUddi}
          />

          {message && (
            <div className={`mb-4 p-3 rounded-md text-center ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-center">
              Error: {error}
            </div>
          )}

          <section className="mx-auto w-full max-w-4xl pt-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-gray-900">Adicionar disponibilidade</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <CalendarWeekDaySelectComponent
                    weekDays={weekDays}
                    formData={selectedWeekDay}
                    handleWeekDayChange={handleWeekDayChange}
                  />
                </div>
                <div>
                  <TeacherAvailabilityInputComponent
                    formData={calendarRangeHour}
                    handleInputChange={handleInputChangeCalendarRangeHourDay}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
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
          </section>

        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <a
          href="/dashboard/teachers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </a>
        <Button className='hover:bg-purple-500' type="submit" onClick={() => setActionType('update_teacher')}>Salvar Professor</Button>
      </div>
    </form>
  );
}
