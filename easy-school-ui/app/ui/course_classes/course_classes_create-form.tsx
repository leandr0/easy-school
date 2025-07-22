'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useEffect, useState } from "react";
import { CourseClassCreateForm } from '@/app/lib/definitions/course_class_definitions';
import { createCourseClass } from '@/app/lib/actions/course_class_actions';
import { BookOpenIcon } from '@heroicons/react/24/outline';

import { findCourse, getAllCoursesAvailable } from '@/app/lib/actions/course_actions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { getAllTeachersAvailable, getAllTeachersAvailableByLanguage } from '@/app/lib/actions/teacher_actions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';

import { fetchAvailabilityTeacher } from '@/app/lib/actions/calendar_range_hour_day_actions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';

// Import the new components
import CourseSelector from '../components/create_class/CourseSelector';
import CourseNameInput from '../components/create_class/CourseNameInput';
import WeekDaySelector from '../components/create_class/WeekDaySelector';
import TimeSelector from '../components/create_class/TimeSelector';
import TeacherCalendarList from '../components/create_class/TeacherCalendarList';
import FormActions from '../components/create_class/FormActions';

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
  const [actionType, setActionType] = useState<string | null>(null);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [teacherCalendars, setTeacherCalendars] = useState<CalendarRangeHourDayModel[]>([]);

  useEffect(() => {
    getAllCoursesAvailable()
      .then((courses) => {
        const updatedCourses = [
          {
            id: "",
            name: "Selecione um curso ... ",
            status: true,
          },
          ...courses,
        ];

        setCourses(updatedCourses);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    getAllWeekDays()
      .then((weekDays) => {
        const updatedWeekDays = [
          {
            id: "",
            week_day: "Selecione um dia da semana ... ",
          },
          ...weekDays,
        ];

        setWeekDays(updatedWeekDays);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleWeekDayToggle = (id: string) => {
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
  };

  const handleCourseChange = async (value: string) => {
    setTeacherCalendars([]);

    // Update formData state
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        course_id: value,
        teacher_id: "",
      }
    }));

    // Fetch selected course details
    if (value) {
      try {
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
      } catch (error) {
        console.error("Error fetching course or teachers:", error);
        setError((error as Error).message);
      }
    } else {
      // Empty selection, fallback to all teachers
      const allTeachers = await getAllTeachersAvailable();
      setTeachers(allTeachers);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        name: value,
      },
    }));
  };

  const handleTimeChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        [field]: value,
      },
    }));
  };

  const handleTeacherSelect = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        teacher_id: teacherId,
      }
    }));
  };

  const fetchTeacherAvailability = async () => {
    setTeacherCalendars([]);

    if(formData.course_class)
        formData.course_class.teacher_id = "";

    const end_hour = parseInt(formData.course_class?.start_hour!) + parseInt(formData.course_class?.duration_hour!);
    const end_minute = parseInt(formData.course_class?.start_minute!) + parseInt(formData.course_class?.duration_minute!);

    const availability = await fetchAvailabilityTeacher(
      formData.week_day_ids!,
      parseInt(formData.language_id!),
      parseInt(formData.course_class?.start_hour!),
      parseInt(formData.course_class?.start_minute!),
      end_hour, 
      end_minute
    );
    
    setTeacherCalendars(availability);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'fetch_teacher_availability') {
      await fetchTeacherAvailability();
    } 
    else if (actionType === 'add_teacher_availability') {
      try {
        
        console.log("Create Course Class");
        console.log(formData);

        if(formData.course_class)
          formData.course_class.week_day_ids = formData.week_day_ids;  

        await createCourseClass(formData.course_class!);

        setMessage("✅ Course Class created successfully!");
        setFormData({
          course_class: {
            course_id: "",
            name: "",
            teacher_id: "",
          },
          week_day_ids: [],
        });

        router.push("/dashboard/courses-class");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ Unknown error occurred.");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CourseSelector 
        courses={courses} 
        selectedCourseId={formData.course_class?.course_id || ""} 
        onCourseChange={handleCourseChange} 
      />
      
      <CourseNameInput 
        courseName={formData.course_class?.name || ""} 
        onNameChange={handleNameChange} 
      />
      
      <div className="mt-6 flow-root">
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
                durationHour={formData.course_class?.duration_hour || ""}
                durationMinute={formData.course_class?.duration_minute || ""}
                onTimeChange={handleTimeChange}
              />
              
              <div className="hidden md:block mt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    name="action"
                    onClick={() => setActionType('fetch_teacher_availability')}
                    value="fetch_teacher_availability"
                    className='hover:bg-purple-500'>
                    Buscar professor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden mt-4">
        <Button
          type="submit"
          name="action"
          onClick={() => setActionType('fetch_teacher_availability')}
          value="fetch_teacher_availability"
          className='w-full hover:bg-purple-500'>
          Buscar professor
        </Button>
      </div>

      <div className="md:hidden">
        <label className="block text-sm font-medium mb-1 mt-4">
          Professores:
        </label>
      </div>

      <div className="hidden md:block mb-1 mt-4">
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
        onSubmit={() => setActionType('add_teacher_availability')}
      />
    </form>
  );
}