// TeacherWeekDayAvailabilityComponent.tsx
'use client';

import React from 'react';
import { DeleteWeekDayAvailability } from '../../../ui/buttons/ui_buttons';

type Item = {
  uddi?: string;
  week_day?: { id?: string | number; week_day?: string };
  start_hour?: string | number;
  start_minute?: string | number;
  end_hour?: string | number;
  end_minute?: string | number;
};

interface Props {
  teacherWeeDayAvailables: Item[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setActionType: (action: string) => void;
  setSelectedWeekDayUddi?: (uddi: string) => void;
}

const pad2 = (v?: string | number) => String(v ?? '').padStart(2, '0');

export function TeacherWeekDayAvailabilityComponent({
  teacherWeeDayAvailables,
  setFormData,
  setActionType,
  setSelectedWeekDayUddi,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-4xl pt-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Disponibilidade</h3>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="grid grid-cols-4 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
              <div>Dia</div>
              <div>Hora Início</div>
              <div>Hora Fim</div>
              <div className="text-right">Ações</div>
            </div>

            <div className="divide-y divide-gray-200">
              {teacherWeeDayAvailables?.map((row) => (
                <div
                  key={row.uddi}
                  className="grid grid-cols-4 items-center px-4 py-3 hover:bg-gray-50"
                  onClick={() => {
                    if (row.uddi) {
                      setFormData((prev: any) => ({
                        ...prev,
                        week_day: { ...(prev.week_day || {}), id: row.uddi },
                      }));
                    }
                  }}
                >
                  <div className="truncate">{row.week_day?.week_day}</div>
                  <div className="font-mono">{pad2(row.start_hour)}:{pad2(row.start_minute)}</div>
                  <div className="font-mono">{pad2(row.end_hour)}:{pad2(row.end_minute)}</div>
                  <div className="text-right">
                    <DeleteWeekDayAvailability
                      disabled={true}
                      setActionType={(action) => {
                        if (row.uddi) setSelectedWeekDayUddi?.(row.uddi);
                        setActionType(action);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile list */}
        <div className="space-y-3 md:hidden">
          {teacherWeeDayAvailables?.map((row) => (
            <div
              key={row.uddi}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
              onClick={() => {
                if (row.uddi) {
                  setFormData((prev: any) => ({
                    ...prev,
                    week_day: { ...(prev.week_day || {}), id: row.uddi },
                  }));
                }
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">
                  {row.week_day?.week_day || '—'}
                </div>
                <DeleteWeekDayAvailability
                  disabled={true}
                  setActionType={(action) => {
                    if (row.uddi) setSelectedWeekDayUddi?.(row.uddi);
                    setActionType(action);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>
                  <span className="mr-1 font-medium text-gray-600">Início:</span>
                  <span className="font-mono">{pad2(row.start_hour)}:{pad2(row.start_minute)}</span>
                </div>
                <div>
                  <span className="mr-1 font-medium text-gray-600">Fim:</span>
                  <span className="font-mono">{pad2(row.end_hour)}:{pad2(row.end_minute)}</span>
                </div>
              </div>
            </div>
          ))}
          {(!teacherWeeDayAvailables || teacherWeeDayAvailables.length === 0) && (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
              Nenhuma disponibilidade adicionada ainda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
