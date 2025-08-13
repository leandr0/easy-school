import React from 'react';
import { Button } from '@/app/ui/button';

// Components
import CourseSelector from './CourseSelector';
import CourseNameInput from './CourseNameInput';
import WeekDaySelector from './WeekDaySelector';
import TimeSelector from './TimeSelector';
import TeacherCalendarList from './TeacherCalendarListDesktop';
import FormActions from './FormActions';

// Types
import { CourseClassCreateForm } from '@/app/lib/definitions/course_class_definitions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import TeacherCalendarListMobile from './TeacherCalendarListMobile';

// Props interface for better type safety
interface CreateCourseClassFormMobileProps {
  formData: CourseClassCreateForm;
  message: string;
  error: string | null;
  courses: CourseModel[];
  teachers: TeacherModel[];
  weekDays: CalendarWeekDayModel[];
  teacherCalendars: CalendarRangeHourDayModel[];
  isLoading: boolean;
  handleCourseChange: (value: string) => void;
  handleNameChange: (value: string) => void;
  handleWeekDayToggle: (id: string) => void;
  handleTimeChange: (field: string, value: string) => void;
  handleTeacherSelect: (id: string) => void;
  fetchTeacherAvailability: () => void;
  handleCreateCourseClass: () => void;
  onCancel: () => void;
}

// Alert components for consistency
const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    {message}
  </div>
);

const SuccessAlert: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
    {message}
  </div>
);

// Time selection and search section for mobile
const TimeSelectionSection: React.FC<{
  formData: CourseClassCreateForm;
  isLoading: boolean;
  onTimeChange: (field: string, value: string) => void;
  onFetchAvailability: () => void;
}> = ({ formData, isLoading, onTimeChange, onFetchAvailability }) => (
  <div className="space-y-4">
    <TimeSelector
      startHour={formData.course_class?.start_hour || ""}
      startMinute={formData.course_class?.start_minute || ""}
      endHour={formData.course_class?.end_hour || ""}
      endMinute={formData.course_class?.end_minute || ""}
      onTimeChange={onTimeChange}
    />
    
    <Button
      type="button"
      onClick={onFetchAvailability}
      disabled={isLoading}
      className="w-full hover:bg-purple-500 transition-colors duration-200"
    >
      {isLoading ? 'Buscando...' : 'Buscar professor'}
    </Button>
  </div>
);

// Teacher selection section for mobile
const TeacherSelectionSection: React.FC<{
  teachers: TeacherModel[];
  teacherCalendars: CalendarRangeHourDayModel[];
  selectedTeacherId: string;
  onTeacherSelect: (id: string) => void;
}> = ({ teachers, teacherCalendars, selectedTeacherId, onTeacherSelect }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium">
      <strong>Professores:</strong>
    </label>
    <TeacherCalendarListMobile
      teachers={teachers}
      teacherCalendars={teacherCalendars}
      selectedTeacherId={selectedTeacherId}
      onTeacherSelect={onTeacherSelect}
    />
  </div>
);

// Main mobile component
export default function CreateCourseClassFormMobile({
  formData,
  message,
  error,
  courses,
  teachers,
  weekDays,
  teacherCalendars,
  isLoading,
  handleCourseChange,
  handleNameChange,
  handleWeekDayToggle,
  handleTimeChange,
  handleTeacherSelect,
  fetchTeacherAvailability,
  handleCreateCourseClass,
  onCancel,
}: CreateCourseClassFormMobileProps) {
  // Safe access to nested properties
  const courseClass = formData.course_class || {};
  const weekDayIds = formData.week_day_ids || [];

  return (
    <div className="space-y-6 p-4">
      {/* Alert Messages */}
      {error && <ErrorAlert message={error} />}
      {message && <SuccessAlert message={message} />}

      {/* Course Selection */}
      <CourseSelector
        courses={courses}
        selectedCourseId={courseClass.course_id || ""}
        onCourseChange={handleCourseChange}
      />

      {/* Course Name Input */}
      <CourseNameInput
        courseName={courseClass.name || ""}
        onNameChange={handleNameChange}
      />

      {/* Week Day Selection */}
      <WeekDaySelector
        weekDays={weekDays}
        selectedDays={weekDayIds}
        onWeekDayToggle={handleWeekDayToggle}
      />

      {/* Time Selection and Search */}
      <TimeSelectionSection
        formData={formData}
        isLoading={isLoading}
        onTimeChange={handleTimeChange}
        onFetchAvailability={fetchTeacherAvailability}
      />

      {/* Teacher Selection */}
      <TeacherSelectionSection
        teachers={teachers}
        teacherCalendars={teacherCalendars}
        selectedTeacherId={courseClass.teacher_id || ""}
        onTeacherSelect={handleTeacherSelect}
      />

      {/* Form Actions */}
      <FormActions
        onCancel={onCancel}
        onSubmit={handleCreateCourseClass}
        submitText={isLoading ? 'Criando...' : 'Criar Turma'}
      />
    </div>
  );
}