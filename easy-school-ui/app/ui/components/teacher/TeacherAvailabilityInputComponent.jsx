'use client';

import React from 'react';

export function TeacherAvailabilityInputComponent({ formData, handleInputChange }) {
  return (
    <div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">Horário de Início:</div>
            <div>
              <input
                type="number"
                name="start_hour"
                id="start_hour"
                value={formData?.start_hour || ""}
                onChange={handleInputChange}
                placeholder="Hora"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="start_minute"
                id="start_minute"
                value={formData?.start_minute || ""}
                onChange={handleInputChange}
                placeholder="Minuto"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">Horário final:</div>
            <div>
              <input
                type="number"
                name="end_hour"
                id="end_hour"
                value={formData?.end_hour || ""}
                onChange={handleInputChange}
                placeholder="Hora"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="end_minute"
                id="end_minute"
                value={formData?.end_minute || ""}
                onChange={handleInputChange}
                placeholder="Minuto"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Horário de Início:</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                name="start_hour"
                id="mobile-start-hour"
                value={formData?.start_hour || ""}
                onChange={handleInputChange}
                placeholder="Hora"
                className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                name="start_minute"
                id="mobile-start-minute"
                value={formData?.start_minute || ""}
                onChange={handleInputChange}
                placeholder="Minuto"
                className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Horário final:</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                name="end_hour"
                id="mobile-end-hour"
                value={formData?.end_hour || ""}
                onChange={handleInputChange}
                placeholder="Hora"
                className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                name="end_minute"
                id="mobile-end-minute"
                value={formData?.end_minute || ""}
                onChange={handleInputChange}
                placeholder="Minuto"
                className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}