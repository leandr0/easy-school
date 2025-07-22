'use client';

import { Button } from '@/app/ui/button';
import React from "react";
import { useTeacherForm } from '@/app/hooks/useTeacherForm';

// Import components
import { TeacherInfoComponent } from '../components/teacher/TeacherInfoComponent';
import { LanguageSelectListComponent } from '../components/teacher/LanguageSelectListComponent';
import { TeacherWeekDayAvailabilityComponent } from '../components/teacher/TeacherWeekDayAvailabilityComponent';
import { CalendarWeekDaySelectComponent } from '../components/teacher/CalendarWeekDaySelectComponent';
import { TeacherAvailabilityInputComponent } from '../components/teacher/TeacherAvailabilityInputComponent';
import { CancelAndRedirect } from '../buttons/ui_buttons';

export default function CreateTeacherForm() {
  const {
    formData,
    teacherWeeDayAvailables,
    languages,
    weekDays,
    message,
    actionType,
    setActionType,
    setFormData,
    handleInputChange,
    handleWeekDayChange,
    handleLanguageToggle,
    handleCheckboxChange,
    handleSubmit
  } = useTeacherForm();

  return (
    
    <form onSubmit={handleSubmit}>
      {/* Teacher Information Component */}
      <TeacherInfoComponent 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />

      {/* Language Selection Component */}
      <LanguageSelectListComponent 
        languages={languages} 
        formData={formData} 
        handleLanguageToggle={handleLanguageToggle} 
        handleCheckboxChange={handleCheckboxChange} 
      />

      {/* Display message if any */}
      {message && (
        <div className={`mt-4 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Teacher Week Day Availability Component */}
      <TeacherWeekDayAvailabilityComponent 
        teacherWeeDayAvailables={teacherWeeDayAvailables} 
        setFormData={setFormData} 
        setActionType={setActionType} 
      />

      {/* Calendar Week Day Selection and Availability Input */}
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-4 md:pt-5">
            {/* Calendar Week Day Select Component */}
            <CalendarWeekDaySelectComponent 
              weekDays={weekDays} 
              formData={formData} 
              handleWeekDayChange={handleWeekDayChange} 
            />

            {/* Teacher Availability Input Component */}
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
                className='hover:bg-purple-500'>
                Adicionar disponibilidade
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Form submission buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <CancelAndRedirect redirectLink='/dashboard/teachers' name='Cancel' />
        <Button 
          onClick={() => setActionType('')}
          className='hover:bg-purple-500' 
          type="submit">
          Criar Professor
        </Button>
      </div>
    </form>
  );
}