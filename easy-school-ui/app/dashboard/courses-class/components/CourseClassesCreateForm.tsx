"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { getAllCoursesAvailable, findCourse } from '@/app/lib/actions/course_actions';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';
import { fetchAvailabilityTeacher } from '@/app/services/calendarRangeHourDayService';
import { createCourseClass } from '@/app/services/courseClassService';

import { CourseClassCreateForm } from '@/app/lib/definitions/course_class_definitions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';

import CreateCourseClassFormMobile from "./CreateCourseClassFormMobile";
import CreateCourseClassFormDesktop from "./CreateCourseClassFormDesktop";

export default function CreateCourseClassForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CourseClassCreateForm>({
    language_id: "",
    course_class: {
      course_id: "",
      name: "",
      teacher_id: "",
    },
    week_day_ids: [],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [teachers, setTeachers] = useState<TeacherModel[]>([]); // <-- now filled ONLY after "Buscar professor"
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [teacherCalendars, setTeacherCalendars] = useState<CalendarRangeHourDayModel[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courseList, weekDayList] = await Promise.all([
          getAllCoursesAvailable(),
          getAllWeekDays(),
        ]);

        setCourses([{ id: "", name: "Selecione um curso ...", status: true }, ...courseList]);
        setWeekDays([{ id: "", week_day: "Selecione um dia ..." }, ...weekDayList]);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchInitialData();
  }, []);

  // When course changes: set language, and CLEAR teachers + calendars + selected teacher
  const handleCourseChange = useCallback(async (value: string) => {
    setIsLoading(true);

    // Reset availability-derived data and selection
    setTeacherCalendars([]);
    setTeachers([]);
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        course_id: value,
        teacher_id: "", // reset selected teacher when course changes
      },
    }));

    try {
      if (!value) {
        setFormData(prev => ({ ...prev, language_id: "" }));
        return;
      }

      const course = await findCourse(value);
      const languageId = course.language?.id || "";
      setFormData(prev => ({ ...prev, language_id: languageId }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWeekDayToggle = useCallback((id: string) => {
    setFormData(prev => {
      const days = prev.week_day_ids || [];
      return {
        ...prev,
        week_day_ids: days.includes(id)
          ? days.filter(day => day !== id)
          : [...days, id],
      };
    });
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

  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        name: value,
      },
    }));
  }, []);

  const handleTeacherSelect = useCallback((teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        teacher_id: teacherId, // '' to unselect is allowed
      },
    }));
  }, []);

  // Only fill teachers list when clicking "Buscar professor"
  const fetchTeacherAvailability = useCallback(async () => {
    const { week_day_ids, course_class, language_id } = formData;

    if (
      !week_day_ids?.length ||
      !course_class?.start_hour ||
      !course_class?.start_minute ||
      !course_class?.end_hour ||
      !course_class?.end_minute ||
      !language_id
    ) {
      setError("Preencha todos os campos obrigatórios para buscar professores.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const availability = await fetchAvailabilityTeacher(
        week_day_ids,
        parseInt(language_id),
        parseInt(course_class.start_hour),
        parseInt(course_class.start_minute),
        parseInt(course_class.end_hour),
        parseInt(course_class.end_minute),
      );

      // Save raw availability for the schedule table
      setTeacherCalendars(availability);

      // Derive unique teachers from availability
      const map = new Map<string, TeacherModel>();
      for (const cal of availability) {
        const t = (cal as any).teacher as TeacherModel | undefined;
        if (!t?.id) continue;
        const key = String(t.id);
        if (!map.has(key)) map.set(key, t);
      }
      setTeachers(Array.from(map.values()));

      // Optional: if the currently selected teacher is not in the new availability, unselect
      setFormData(prev => {
        const selected = prev.course_class?.teacher_id || "";
        if (!selected) return prev;
        const stillThere = map.has(String(selected));
        return stillThere
          ? prev
          : { ...prev, course_class: { ...prev.course_class!, teacher_id: "" } };
      });
    } catch (err) {
      setError((err as Error).message);
      setTeacherCalendars([]);
      setTeachers([]);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleCreateCourseClass = useCallback(async () => {
    if (!formData.course_class?.teacher_id) {
      setError("Selecione um professor antes de criar a turma.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData.course_class,
        week_day_ids: formData.week_day_ids,
      };

      await createCourseClass(payload);
      setMessage("✅ Turma criada com sucesso!");
      setFormData({
        language_id: "",
        course_class: { course_id: "", name: "", teacher_id: "" },
        week_day_ids: [],
      });

      setTeachers([]); // clear list after creation
      setTeacherCalendars([]);

      setTimeout(() => router.push("/dashboard/courses-class"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  const props = {
    formData,
    message,
    error,
    courses,
    teachers,           // now empty until Buscar professor is clicked
    weekDays,
    teacherCalendars,   // schedules reflect last search
    isLoading,
    handleCourseChange, // clears teachers & calendars and resets selection
    handleNameChange,
    handleWeekDayToggle,
    handleTimeChange,
    handleTeacherSelect,
    fetchTeacherAvailability, // populates teachers + calendars
    handleCreateCourseClass,
  };

  return (
    <>
      <div className="md:hidden">
        <CreateCourseClassFormMobile
          {...props}
          onCancel={() => router.push("/dashboard/courses-class")}
        />
      </div>

      <div className="hidden md:block">
        <CreateCourseClassFormDesktop
          {...props}
          onCancel={() => router.push("/dashboard/courses-class")}
        />
      </div>
    </>
  );
}
