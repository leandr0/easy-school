'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useState } from "react";
import { CourseClassCreateForm, CourseClassModel } from '@/app/lib/definitions/course_class_definitions';
import { createCourseClass } from '@/app/lib/actions/course_class_actions';
import { BookOpenIcon, CalendarDaysIcon, ShoppingBagIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { findCourse, getAllCoursesAvailable } from '@/app/lib/actions/course_actions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { getAllTeachersAvailable, getAllTeachersAvailableByLanguage } from '@/app/lib/actions/teacher_actions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';

import { Select, SelectSection, SelectItem } from "@heroui/select";
import { CalendarIcon } from '@heroicons/react/20/solid';
import { fetchAvailabilityTeacher } from '@/app/lib/actions/calendar_range_hour_day_actions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import MaskedNumberInput from '../components/input_mask';
import TimeDisplay from '../components/time_display';

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
  const [couses, setCourses] = useState<CourseModel[]>([]);
  const [teachers, setTeachers] = useState<TeacherModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);
  const [teacherCalendars, setteacherCalendars] = useState<CalendarRangeHourDayModel[]>([]);




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        [name]: value,
      },
    }));
  };

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

  const handleWeekDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    console.log("Selected:", selected); // 🧪 check this
    setFormData(prev => ({
      ...prev,
      week_day_ids: selected
    }));

    console.log("Selecteds:", formData.week_day_ids); // 🧪 check this
  };

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

  /** 
  useEffect(() => {
    getAllTeachersAvailable()
      .then(setTeachers)
      .catch((err) => setError(err.message));
  }, []);
**/
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

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    setteacherCalendars([]);

    if (name === "course_id") {
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
    } else {
      // Handle normal text inputs (course name, etc.)
      setFormData((prev) => ({
        ...prev,
        course_class: {
          ...prev.course_class,
          [name]: value,
        },
      }));


    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'fetch_teacher_availability') {

      setteacherCalendars([]);

      const end_hour = parseInt(formData.course_class?.start_hour!) + parseInt(formData.course_class?.duration_hour!);
      const end_minute = parseInt(formData.course_class?.start_minute!) + parseInt(formData.course_class?.duration_minute!);

      setteacherCalendars(await fetchAvailabilityTeacher(formData.week_day_ids!,
        parseInt(formData.language_id!),
        parseInt(formData.course_class?.start_hour!),
        parseInt(formData.course_class?.start_minute!),
        end_hour, end_minute));

      console.log("Vamos buscar os titchas ...");

    }

    else if (actionType === 'add_teacher_availability') {
      try {
        await createCourseClass(formData.course_class!);

        setMessage("✅ Course Class created successfully!");
        setFormData({
          course_class: {
            course_id: "",
            name: "",
            teacher_id: "",
          },
          week_day_ids: [], // 👈 reset week_day_ids too
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

  const handleTeacherSelect = (teacherId: string) => {

    setFormData(prev => ({
      ...prev,
      course_class: {
        ...prev.course_class,
        teacher_id: teacherId,
      }
    }));
  };



  return (

    <form onSubmit={handleSubmit} >

      <div className="mb-4">
        <div className="relative">
          <select
            id="course_id"
            name="course_id"
            value={formData.course_class?.course_id}
            onChange={handleChange}
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

      <div className="mb-4">
        <div className="relative">
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
        </div>
      </div>

      {/** Nome do curso for mobile  **/}
      <div className="mb-4 md:hidden">
        <label htmlFor="name-mobile" className="block text-sm font-medium mb-1">
          Nome do Curso:
        </label>
        <div className="relative">
          <input
            type="text"
            name="name"
            id="name-mobile"
            value={formData.course_class?.name}
            onChange={handleChange}
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder="Digite o nome do curso"
          />
          <ShoppingBagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>


      <div className="mt-6 flow-root">

        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-4 md:pt-5">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Dias da Semana:</label>
              <div className="rounded-lg bg-white border border-gray-200 p-2 flex flex-wrap gap-2" >
                {weekDays
                  .filter(day => day.id)
                  .map(day => {
                    const isChecked = formData.week_day_ids?.includes(day.id!);
                    return (

                      <label
                        key={day.id}
                        className={`flex text-[12px] items-center p-2 rounded-md cursor-pointer mb-1 ${isChecked ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleWeekDayToggle(day.id!)}
                          className="h-4 w-4 text-blue-600 border-gray-300 mr-3 "
                        />
                        {day.week_day}
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="inline-block min-w-full align-middle  grid grid-cols-2">
              <div className="hidden md:block ">
                <div className="grid grid-cols-2 gap-6 text-sm mb-4">

                  {/* Horário de Início */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Início
                    </label>
                    <div className="flex gap-2">
                      <MaskedNumberInput
                        name="start_hour"
                        id="start_hour"
                        value={formData.course_class?.start_hour || ""}
                        onChange={(val) =>
                          setFormData(prev => ({
                            ...prev,
                            course_class: {
                              ...prev.course_class,
                              start_hour: val,
                            },
                          }))
                        }
                        min={0}
                        max={23}
                        mask="99"
                        placeholder="HH"
                        className="w-12"
                      />
                      <MaskedNumberInput
                        name="start_minute"
                        id="start_minute"
                        value={formData.course_class?.start_minute || ""}
                        onChange={(val) =>
                          setFormData(prev => ({
                            ...prev,
                            course_class: {
                              ...prev.course_class,
                              start_minute: val,
                            },
                          }))
                        }
                        min={0}
                        max={59}
                        mask="99"
                        placeholder="MM"
                        className="w-12"
                      />
                    </div>
                  </div>

                  {/* Duração */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duração
                    </label>
                    <div className="flex gap-2">
                      <MaskedNumberInput
                        name="duration_hour"
                        id="duration_hour"
                        value={formData.course_class?.duration_hour || ""}
                        onChange={(val) =>
                          setFormData(prev => ({
                            ...prev,
                            course_class: {
                              ...prev.course_class,
                              duration_hour: val,
                            },
                          }))
                        }
                        min={1}
                        max={2}
                        mask="99"
                        placeholder="DH"
                        className="w-12"
                      />
                      <MaskedNumberInput
                        name="duration_minute"
                        id="duration_minute"
                        value={formData.course_class?.duration_minute || ""}
                        onChange={(val) =>
                          setFormData(prev => ({
                            ...prev,
                            course_class: {
                              ...prev.course_class,
                              duration_minute: val,
                            },
                          }))
                        }
                        min={0}
                        max={59}
                        mask="99"
                        placeholder="DM"
                        className="w-12"
                      />
                    </div>
                  </div>

                </div>
              </div>
              <div className="hidden md:block w-1/2">
              <div className="grid grid-cols-1 gap-6 text-sm mb-4">
              <div className="mt-6 flex justify-end gap-4">
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
      </div>



      

      <div className="md:hidden">
        <label className="block text-sm font-medium mb-1">
          Professores:
        </label>
      </div>


      <div className="hidden md:block mb-1 mt-4">
        <label className="block text-sm font-medium">
          <strong>Professores:</strong>
        </label>
      </div>

      <div className="inline-block min-w-full align-middle">

        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mt-2 flow-root">

            <div className="md:hidden">
              {teachers?.map((teacher) => (

                <label
                  key={teacher.id}
                  className={`flex items-center p-4 mb-2 rounded-md border ${formData.course_class?.teacher_id === teacher.id
                    ? 'bg-blue-100 border-blue-400'
                    : 'bg-white border-gray-200 hover:bg-gray-100'
                    } cursor-pointer transition`}>

                  <input
                    type="radio"
                    name="teacher_id"
                    value={teacher.id ?? ''}
                    checked={formData.course_class?.teacher_id === (teacher.id ?? '')}
                    onChange={() => {
                      if (teacher.id) {
                        setFormData(prev => ({
                          ...prev,
                          teacher_id: teacher.id,
                        }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{teacher.name}</span>
                    <span className="text-xs text-gray-600">{teacher.phone_number}</span>
                    <span className="text-xs text-gray-600">{teacher.email}</span>
                  </div>
                </label>
              ))}
            </div>
            
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                    <th scope="col" className="px-3 py-5 font-medium">Telefone</th>
                    <th scope="col" className="px-3 py-5 font-medium">email</th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Dia</th>
                    <th scope="col" className="px-3 py-5 font-medium">Hora início</th>
                    <th scope="col" className="px-3 py-5 font-medium">Hora fim</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {teacherCalendars?.map((teacherCalendars) => {
                    // Check if this teacher is selected
                    const isSelected = formData.course_class?.teacher_id === teacherCalendars.teacher?.id;

                    return (
                      <tr
                        key={teacherCalendars.teacher?.id}
                        className={`w-full cursor-pointer border-b py-3 text-sm last-of-type:border-none
                                  ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                                  [&:first-child>td:first-child]:rounded-tl-lg
                                  [&:first-child>td:last-child]:rounded-tr-lg
                                  [&:last-child>td:first-child]:rounded-bl-lg
                                  [&:last-child>td:last-child]:rounded-br-lg`}
                        onClick={() => {
                          if (teacherCalendars.teacher?.id) {
                            // Update form data directly
                            setFormData(prev => ({
                              ...prev,
                              course_class: {
                                teacher_id: teacherCalendars.teacher?.id
                              }
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
                            <p>{teacherCalendars.teacher?.name}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{teacherCalendars.teacher?.phone_number}</td>
                        <td className="whitespace-nowrap px-3 py-3">{teacherCalendars.teacher?.email}</td>
                        <td className="whitespace-nowrap px-3 py-3">{teacherCalendars.week_day?.week_day}</td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <TimeDisplay
                            hour={teacherCalendars.start_hour}
                            minute={teacherCalendars.start_minute}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <TimeDisplay
                            hour={teacherCalendars.end_hour}
                            minute={teacherCalendars.end_minute}
                          />
                        </td>
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
        <Button className='hover:bg-purple-500' type="submit">Criar Turma</Button>
      </div>

    </form>
  );
}