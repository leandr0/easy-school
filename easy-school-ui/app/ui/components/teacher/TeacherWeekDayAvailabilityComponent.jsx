'use client';

import React from 'react';
import { DeleteWeekDayAvailability } from '../../buttons/ui_buttons';

export function TeacherWeekDayAvailabilityComponent({ teacherWeeDayAvailables, setFormData, setActionType }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Desktop view */}
          <div className="hidden md:block">
            <div className="rounded-lg bg-white overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-4 py-5 text-sm font-medium bg-gray-50">
                <div>Dia</div>
                <div>Hora Inicio</div>
                <div>Hora Fim</div>
                <div></div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {teacherWeeDayAvailables?.map((teacherWeeDayAvailable) => (
                  <div
                    key={teacherWeeDayAvailable.uddi}
                    className="grid grid-cols-4 gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      if (teacherWeeDayAvailable.uddi) {
                        setFormData(prev => ({
                          ...prev,
                          week_day: {
                            ...prev.week_day,
                            id: teacherWeeDayAvailable.uddi
                          }
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span>{teacherWeeDayAvailable.week_day?.week_day}</span>
                    </div>
                    <div className="flex items-center">
                      <span>{teacherWeeDayAvailable.start_hour + ":" + teacherWeeDayAvailable.start_minute}</span>
                    </div>
                    <div className="flex items-center">
                      <span>{teacherWeeDayAvailable.end_hour + ":" + teacherWeeDayAvailable.end_minute}</span>
                    </div>
                    <div className="flex justify-end">
                      <DeleteWeekDayAvailability disabled={true} setActionType={setActionType} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile view */}
          <div className="md:hidden">
            <div className="text-lg font-medium mb-2">Disponibilidade</div>
            <div className="space-y-3">
              {teacherWeeDayAvailables?.map((teacherWeeDayAvailable) => (
                <div 
                  key={teacherWeeDayAvailable.uddi}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  onClick={() => {
                    if (teacherWeeDayAvailable.uddi) {
                      setFormData(prev => ({
                        ...prev,
                        week_day: {
                          ...prev.week_day,
                          id: teacherWeeDayAvailable.uddi
                        }
                      }));
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{teacherWeeDayAvailable.week_day?.week_day}</div>
                    <DeleteWeekDayAvailability disabled={true} setActionType={setActionType} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Início:</span> {teacherWeeDayAvailable.start_hour + ":" + teacherWeeDayAvailable.start_minute}
                    </div>
                    <div>
                      <span className="font-medium">Fim:</span> {teacherWeeDayAvailable.end_hour + ":" + teacherWeeDayAvailable.end_minute}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}