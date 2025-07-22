'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useState } from "react";
import { CourseClassCompleteModel, CourseClassEditForm, CourseClassModel, CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';
import { createCourseClass, getCourseClassById } from '@/app/lib/actions/course_class_actions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { getAllTeachersAvailable, getAllTeachersAvailableByLanguage } from '@/app/lib/actions/teacher_actions';
import { findCourse, getAllCoursesAvailable } from '@/app/lib/actions/course_actions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Switch } from '../components/switch';
import WeekDaySelector from '../components/create_class/WeekDaySelector';
import TimeSelector from '../components/create_class/TimeSelector';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllWeekDays, getWeekDaysByCourseClass } from '@/app/lib/actions/calendar_week_day_actions';
import { fetchAvailabilityTeacher } from '@/app/lib/actions/calendar_range_hour_day_actions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';

export default function EditCourseClassForm({ course_class_id }: { course_class_id: string }) {

  const router = useRouter();

  const [courseClass, setCourseClass] = useState<CourseClassTeacherModel>();
  const [couses, setCourses] = useState<CourseModel[]>([]);
  const [teachers, setTeachers] = useState<TeacherModel[]>([]);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [actionType, setActionType] = useState<string | null>(null);
  const [teacherCalendars, setTeacherCalendars] = useState<CalendarRangeHourDayModel[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CourseClassEditForm>({

    course_class: {
      id: course_class_id,
      course: {} as CourseClassCompleteModel,
      name: "",
      teacher: {} as TeacherModel,
      language: {} as LanguageModel,
    },

  });

  //TODO: mostrar somente o curso da turma
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

// Extract the functionality into a standalone function
async function fetchAndSetWeekDays(
  course_class_id: string, 
  setFormData: React.Dispatch<React.SetStateAction<CourseClassEditForm>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    const weekDays = await getWeekDaysByCourseClass(course_class_id);
    
    const ids = weekDays
      .map((wd) => wd?.id?.toString())
      .filter((id): id is string => typeof id === 'string');
    
    setFormData((prev) => ({
      ...prev,
      week_day_ids: ids,
    }));
    
    console.log("Computed week_day_ids:", ids);
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
  }
}

// Then in your component:
useEffect(() => {
  fetchAndSetWeekDays(course_class_id, setFormData, setError);
}, []);

  useEffect(() => {
    getCourseClassById(course_class_id)
      .then((courseClass) => {

        console.log("fetching course class");
        console.log(courseClass);

        setCourseClass(courseClass);

        if (courseClass.teacher) {
          setTeachers(prevTeachers => {
            // Check if this teacher already exists in the array
            const teacherExists = prevTeachers.some(
              teacher => teacher.id === courseClass.teacher.id
            );

            // Only add if the teacher doesn't already exist
            if (!teacherExists) {
              return [...prevTeachers, courseClass.teacher];
            }
            return prevTeachers; // Return unchanged if teacher already exists
          });
        }


        setFormData((prev) => ({
          ...prev,
          course_class: {
            teacher: courseClass.teacher,
            course: courseClass.course,
            status: courseClass.status,
            name: courseClass.name,
            start_hour: courseClass.start_hour,
            start_minute: courseClass.start_minute,
            duration_hour: courseClass.duration_hour,
            duration_minute: courseClass.duration_minute,
            language: courseClass.language,
          },
        }));



      })
      .catch((err) => setError(err.message));
  }, []);

  /**
  useEffect(() => {
    getAllTeachersAvailableByLanguageFromCourseClass(course_class_id)
      .then(setTeachers)
      .catch((err) => setError(err.message));
  }, []);
 */


  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "course_id") {
      // Update formData state
      setFormData((prev) => ({
        ...prev,
        course_id: value,
        teacher_id: "",
      }));

      // Fetch selected course details
      if (value) {
        try {

          const selectedCourse: CourseModel = await findCourse(value);

          if (selectedCourse.language?.id) {
            // Fetch teachers by language
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
    } else {
      // Handle normal text inputs (course name, etc.)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  function setWeekDayIds(form: CourseClassEditForm): CourseClassEditForm {
    // Create a copy of the form to avoid mutating the original
    const updatedForm = { ...form };

    // Initialize week_day_ids as an empty array if it doesn't exist
    updatedForm.week_day_ids = [];

    // If week_days exists and has entries, extract IDs
    if (updatedForm.week_days && updatedForm.week_days.length > 0) {
      // Filter out any week_day entries that don't have an ID and map to just the IDs
      updatedForm.week_day_ids = updatedForm.week_days
        .filter(weekDay => weekDay.id !== undefined)
        .map(weekDay => weekDay.id as string);
    }

    return updatedForm;
  }

  /**
 * Fixed version of fetchTeacherAvailability function with proper type checking
 */
  const fetchTeacherAvailability = async () => {
    setTeacherCalendars([]);

    // Make sure all values exist before calculating
    const startHour = formData.course_class?.start_hour ? parseInt(formData.course_class.start_hour) : 0;
    const startMinute = formData.course_class?.start_minute ? parseInt(formData.course_class.start_minute) : 0;
    const durationHour = formData.course_class?.duration_hour ? parseInt(formData.course_class.duration_hour) : 0;
    const durationMinute = formData.course_class?.duration_minute ? parseInt(formData.course_class.duration_minute) : 0;

    const end_hour = startHour + durationHour;
    const end_minute = startMinute + durationMinute;

    // Update the formData with week_day_ids
    const updatedFormData = setWeekDayIds(formData);
    setFormData(updatedFormData);

    console.log("Form Data ::");
    console.log(formData);


    console.log("updatedFormData ::");
    console.log(updatedFormData);


    // Make sure the language ID exists
    const languageId = formData.course_class?.course.language?.id;
    console.log("language id");
    console.log(languageId);

    if (!languageId || !formData.week_day_ids || formData.week_day_ids.length === 0) {
      // Handle missing required fields - either show an error message or return early
      console.error("Missing required fields for teacher availability");
      return;
    }

    try {
      const availability = await fetchAvailabilityTeacher(
        formData.week_day_ids,
        parseInt(languageId),
        startHour,
        startMinute,
        end_hour,
        end_minute
      );

      setTeacherCalendars(availability);
    } catch (error) {
      console.error("Error fetching teacher availability:", error);
      // Handle error appropriately (show message to user, etc.)
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'fetch_teacher_availability') {
      await fetchTeacherAvailability();
      await fetchAndSetWeekDays(course_class_id, setFormData, setError);
    }


    if (actionType === 'bla-bla') {

      try {

        console.log(formData);

        await createCourseClass(formData?.course_class!);

        setMessage("✅ Course Class created successfully!");
        setFormData({
          course_class: {
            id: course_class_id,
            course: {} as CourseClassCompleteModel,
            name: "",
            teacher: {} as TeacherModel,
            language: {} as LanguageModel,
          }

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

  const [forceUpdate, setForceUpdate] = useState(0);

  // Add this effect to trigger a re-render after data is loaded
  useEffect(() => {
    if (courseClass?.status === true) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [courseClass]);


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


  const handleTimeChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev.course_class) {
        // Handle the case where course_class might be undefined
        return prev;
      }

      return {
        ...prev,
        course_class: {
          ...prev.course_class,
          [field]: value,
        },
      };
    });
  };

  return (

    <form onSubmit={handleSubmit} >

      <div className="mb-4">
        <div className="relative">
          <select
            aria-disabled={true}
            id="course_id"
            name="course_id"
            value={formData.course_class?.course.id}
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="operadora-error"
          >
            {couses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>



      {/** Nome do curso for desktop  **/}
      <table className="hidden min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <th>Nome do Curso:</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr>
            <td>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.course_class?.name}
                onChange={handleChange}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="md:block mb-1 mt-4">
        <Switch
          checked={Boolean(formData.course_class?.status)}
          onChange={(checked) => {
            setFormData(prev => ({
              ...prev,
              status: checked,
            }));
          }}
          label={formData.course_class?.status ? 'Ativo' : 'Inativo'}
          color="green"
        />
      </div>


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
                startHour={formData.course_class?.start_hour || "00"}
                startMinute={formData.course_class?.start_minute || "00"}
                durationHour={formData.course_class?.duration_hour || "00"}
                durationMinute={formData.course_class?.duration_minute || "00"}
                onTimeChange={handleTimeChange}
              />
            </div>

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


      {/* Desktop professor label (new addition) */}
      <div className="hidden md:block mb-1 mt-4">
        <label className="block text-sm font-medium">
          <strong>Professores:</strong>
        </label>
      </div>

      <div className="inline-block min-w-full align-middle">

        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mt-2 flow-root">

            {/* Teacher Selection Table */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                  <th scope="col" className="px-3 py-5 font-medium">Telefone</th>
                  <th scope="col" className="px-3 py-5 font-medium">email</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {teachers?.map((teacher) => {

                  // Check if this teacher is selected
                  const isSelected = formData.course_class?.teacher.id === teacher.id;

                  return (
                    <tr
                      key={teacher.id}
                      className={`w-full cursor-pointer border-b py-3 text-sm last-of-type:border-none
            ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
            [&:first-child>td:first-child]:rounded-tl-lg
            [&:first-child>td:last-child]:rounded-tr-lg
            [&:last-child>td:first-child]:rounded-bl-lg
            [&:last-child>td:last-child]:rounded-br-lg`}
                      onClick={() => {
                        if (teacher.id) {
                          // Update form data directly
                          setFormData(prev => ({
                            ...prev,
                            teacher_id: teacher.id
                          }));
                        }
                      }}
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-4 w-4 items-center justify-center">
                            <input
                              type="radio"
                              name="teacher-selection"
                              checked={isSelected}
                              onChange={() => { }} // Empty onChange to avoid React warnings
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <p>{teacher.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">{teacher.phone_number}</td>
                      <td className="whitespace-nowrap px-3 py-3">{teacher.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/courses-class"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button
          onClick={() => setActionType('save_couse_class')}
          value="save_couse_class"
          className='hover:bg-purple-500' type="submit">Atualizar Turma</Button>
      </div>

    </form>
  );
}