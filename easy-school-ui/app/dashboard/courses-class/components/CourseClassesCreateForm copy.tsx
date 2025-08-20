'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import React, { useEffect, useState, useCallback } from "react";
import { CourseClassCreateForm} from '@/app/lib/definitions/course_class_definitions';
import { createCourseClass} from '@/app/services/courseClassService';

import { findCourse, getAllCoursesAvailable } from '@/app/services/courseService';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { getAllTeachersAvailable, getAllTeachersAvailableByLanguage } from '@/app/services/teacherService';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllWeekDays } from '@/app/services/calendarWeekDayService';

import { fetchAvailabilityTeacher } from '@/app/services/calendarRangeHourDayService';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';

// Import the new components
import CourseSelector from './CourseSelector';
import CourseNameInput from './CourseNameInput';
import WeekDaySelector from './WeekDaySelector';
import TimeSelector from './TimeSelector';
import TeacherCalendarList from './TeacherCalendarListDesktop';
import FormActions from './FormActions';

export default function CreateCourseClassForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CourseClassCreateForm>({
    language_id: "",
    course_class: {
      course_id: "",
      name: "",
      teacher_id: "",
    }
  });

  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [teachers, setTeachers] = useState<TeacherModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [teacherCalendars, setTeacherCalendars] = useState<CalendarRangeHourDayModel[]>([]);

  // Initialize courses and week days
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [coursesData, weekDaysData] = await Promise.all([
          getAllCoursesAvailable(),
          getAllWeekDays()
        ]);

        const updatedCourses = [
          {
            id: "",
            name: "Selecione um curso ... ",
            status: true,
          },
          ...coursesData,
        ];

        const updatedWeekDays = [
          {
            id: "",
            week_day: "Selecione um dia da semana ... ",
          },
          ...weekDaysData,
        ];

        setCourses(updatedCourses);
        setWeekDays(updatedWeekDays);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    initializeData();
  }, []);

  const handleWeekDayToggle = useCallback((id: string) => {
    setFormData(prev => {
      const current = prev.week_day_ids || [];
      const updated = current.includes(id)
        ? current.filter(day => day !== id)
        : [...current, id];
      return {
        ...prev,
        week_day_ids: updated,
      };
    });
  }, []);

  const handleCourseChange = useCallback(async (value: string) => {
    setIsLoading(true);
    setTeacherCalendars([]);
    setError(null);

    try {
      // Update formData state
      setFormData(prev => ({
        ...prev,
        course_class: {
          ...prev.course_class,
          course_id: value,
          teacher_id: "",
        }
      }));

      if (value) {
        const selectedCourse: CourseModel = await findCourse(value);

        if (selectedCourse.language?.id) {
          // Fetch teachers by language
          setFormData((prev) => ({
            ...prev,
            language_id: selectedCourse.language?.id,
          }));

          const teachersByLanguage = await getAllTeachersAvailableByLanguage(selectedCourse.language.id);
          setTeachers(teachersByLanguage);
        } else {
          // No language found, fallback to all teachers
          const allTeachers = await getAllTeachersAvailable();
          setTeachers(allTeachers);
        }
      } else {
        // Empty selection, fallback to all teachers
        const allTeachers = await getAllTeachersAvailable();
        setTeachers(allTeachers);
      }
    } catch (error) {
      console.error("Error fetching course or teachers:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNameChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        name: value,
      },
    }));
  }, []);

  const handleTimeChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        [field]: value,
      },
    }));
  }, []);

  const handleTeacherSelect = useCallback(async (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        teacher_id: teacherId,
      }
    }));
  }, []);

  const fetchTeacherAvailability = useCallback(async () => {
    if (!formData.week_day_ids?.length || 
        !formData.course_class?.start_hour || 
        !formData.course_class?.start_minute ||
        !formData.course_class?.end_hour ||
        !formData.course_class?.end_minute ||
        !formData.language_id) {
      setError("Por favor, preencha todos os campos necessários antes de buscar professores.");
      return;
    }

    setIsLoading(true);
    setTeacherCalendars([]);
    setError(null);

    // Reset teacher selection when fetching new availability
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        teacher_id: "",
      }
    }));

    try {

      const availability = await fetchAvailabilityTeacher(
        formData.week_day_ids,
        parseInt(formData.language_id),
        parseInt(formData.course_class.start_hour),
        parseInt(formData.course_class.start_minute),
        parseInt(formData.course_class.end_hour),
        parseInt(formData.course_class.end_minute)
      );
      
      setTeacherCalendars(availability);
    } catch (error) {
      console.error("Error fetching teacher availability:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [formData.week_day_ids, formData.course_class, formData.language_id]);

  const handleCreateCourseClass = useCallback(async () => {
    if (!formData.course_class?.teacher_id) {
      setError("Por favor, selecione um professor antes de criar a turma.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Create Course Class");
      console.log(formData);

      const courseClassData = {
        ...formData.course_class,
        week_day_ids: formData.week_day_ids,
      };

      await createCourseClass(courseClassData);

      setMessage("✅ Course Class created successfully!");
      
      // Reset form
      setFormData({
        language_id: "",
        course_class: {
          course_id: "",
          name: "",
          teacher_id: "",
        },
        week_day_ids: [],
      });

      // Navigate after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard/courses-class");
      }, 1500);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      <CourseSelector 
        courses={courses} 
        selectedCourseId={formData.course_class?.course_id || ""} 
        onCourseChange={handleCourseChange}

      />
      
      <CourseNameInput 
        courseName={formData.course_class?.name || ""} 
        onNameChange={handleNameChange}

      />
      
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-4 md:pt-5">
            <WeekDaySelector 
              weekDays={weekDays} 
              selectedDays={formData.week_day_ids || []} 
              onWeekDayToggle={handleWeekDayToggle}

            />
            
            <div className="inline-block min-w-full align-middle grid grid-cols-1 md:grid-cols-2">
              <TimeSelector 
                startHour={formData.course_class?.start_hour || ""}
                startMinute={formData.course_class?.start_minute || ""}
                endHour={formData.course_class?.end_hour || ""}
                endMinute={formData.course_class?.end_minute || ""}
                onTimeChange={handleTimeChange}

              />
              
              <div className="hidden md:block mt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={fetchTeacherAvailability}
                    disabled={isLoading}
                    className='hover:bg-purple-500'>
                    {isLoading ? 'Buscando...' : 'Buscar professor'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <Button
          type="button"
          onClick={fetchTeacherAvailability}
          disabled={isLoading}
          className='w-full hover:bg-purple-500'>
          {isLoading ? 'Buscando...' : 'Buscar professor'}
        </Button>
      </div>

      <div className="md:hidden">
        <label className="block text-sm font-medium mb-1">
          Professores:
        </label>
      </div>

      <div className="hidden md:block mb-1">
        <label className="block text-sm font-medium">
          <strong>Professores:</strong>
        </label>
      </div>

      <TeacherCalendarList 
        teachers={teachers}
        teacherCalendars={teacherCalendars}
        selectedTeacherId={formData.course_class?.teacher_id || ""}
        onTeacherSelect={handleTeacherSelect}
      />

      <FormActions 
        onCancel={() => router.push("/dashboard/courses-class")}
        onSubmit={handleCreateCourseClass}

        submitText={isLoading ? 'Criando...' : 'Criar Turma'}
      />
    </div>
  );
}