// CreateTeacherFormMobile.tsx
'use client';

import React from 'react';
import { Button } from '@/app/ui/button';
import {
  TeacherInfoComponent,
} from './TeacherInfoComponent';
import { LanguageSelectListComponent } from './LanguageSelectListComponent';

import { TeacherWeekDayAvailabilityComponent } from './TeacherWeekDayAvailabilityComponent'; 
import {
  CalendarWeekDaySelectComponent,
} from './CalendarWeekDaySelectComponent';
import {
  TeacherAvailabilityInputComponent,
} from './TeacherAvailabilityInputComponent';

import { CreateTeacherFormModel } from '@/app/lib/definitions/teacher_definitions';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';

type Props = {
  formData: CreateTeacherFormModel;
  languages: LanguageModel[];
  weekDays: CalendarWeekDayModel[];
  teacherWeeDayAvailables: TeacherWeekDayAvailableModel[];
  message: string;

  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompensationChange: (amount: number) => void;
  handleLanguageToggle: (langId: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, langId: string) => void;
  handleWeekDayChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  onAddAvailability: () => void;
  onCreateTeacher: () => void;
  onCancel: () => void;

  setActionType: (t: string | null) => void;
};

export function CreateTeacherFormMobile({
  formData,
  languages,
  weekDays,
  teacherWeeDayAvailables,
  message,
  handleInputChange,
  handleCompensationChange,
  handleLanguageToggle,
  handleCheckboxChange,
  handleWeekDayChange,
  onAddAvailability,
  onCreateTeacher,
  onCancel,
  setActionType,
}: Props) {
  return (
    <div className="relative">
      {/* Page header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-gray-900">Criar Professor</h1>
          <p className="text-xs text-gray-500 mt-0.5">Preencha as informações e as disponibilidades semanais.</p>
        </div>
      </header>

      <main className="px-4 py-4 space-y-5">
        {/* INFO */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-gray-900">Informações</h2>
            <p className="text-xs text-gray-500 mt-0.5">Nome, contato, valor hora/aula e data de início.</p>
          </div>
          <div className="px-2 pb-4">
            <TeacherInfoComponent
              formData={formData}
              handleInputChange={handleInputChange}
              onCompensationChange={handleCompensationChange}
            />
          </div>
        </section>

        {/* LANGUAGES */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-gray-900">Idiomas</h2>
            <p className="text-xs text-gray-500 mt-0.5">Selecione os idiomas que o professor pode lecionar.</p>
          </div>
          <div className="px-2 pb-4">
            <LanguageSelectListComponent
              languages={languages}
              formData={formData}
              handleLanguageToggle={handleLanguageToggle}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        </section>

        {/* FEEDBACK */}
        {message && (
          <div
            className={[
              'rounded-xl border px-3 py-2 text-sm',
              message.includes('✅')
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700',
            ].join(' ')}
          >
            {message}
          </div>
        )}

        {/* CURRENT AVAILABILITY */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-gray-900">Disponibilidades adicionadas</h2>
            <p className="text-xs text-gray-500 mt-0.5">Toque em um item para selecioná-lo antes de remover.</p>
          </div>
          <div className="px-2 pb-3">
            <TeacherWeekDayAvailabilityComponent
              teacherWeeDayAvailables={teacherWeeDayAvailables}
              setFormData={() => {}}
              setActionType={setActionType}
            />
          </div>
        </section>

        {/* ADD AVAILABILITY */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 pt-4">
            <h2 className="text-sm font-semibold text-gray-900">Adicionar disponibilidade</h2>
            <p className="text-xs text-gray-500 mt-0.5">Escolha o dia e informe os horários.</p>
          </div>

          <div className="px-4 mt-2">
            <CalendarWeekDaySelectComponent
              weekDays={weekDays}
              formData={formData}
              handleWeekDayChange={handleWeekDayChange}
            />
          </div>

          <div className="px-4 mt-3">
            <TeacherAvailabilityInputComponent
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>

          <div className="px-4 pt-1 pb-4">
            <Button
              type="submit"
              name="action"
              onClick={onAddAvailability}
              value="add_teacher_availability"
              className="w-full hover:bg-purple-500"
            >
              Adicionar disponibilidade
            </Button>
          </div>
        </section>

        {/* Spacer for sticky bar */}
        <div className="h-20" />
      </main>

      {/* Sticky action bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <div className="pointer-events-none bg-gradient-to-t from-white to-white/0 h-4" />
        <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
          <Button
            onClick={onCreateTeacher}
            type="submit"
            className="flex-1"
          >
            Criar Professor
          </Button>
          <Button onClick={onCancel} type="button" className="flex-1">
            Cancelar
          </Button>
        </div>
      </footer>
    </div>
  );
}
