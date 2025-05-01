'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useState } from "react";
import { CourseClassModel, CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';
import { createCourseClass, getCourseClassById } from '@/app/lib/actions/course_class_actions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { getAllTeachersAvailable, getAllTeachersAvailableByLanguage, getAllTeachersAvailableByLanguageFromCourseClass } from '@/app/lib/actions/teacher_actions';
import { findCourse, getAllCoursesAvailable } from '@/app/lib/actions/course_actions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Switch } from '../components/switch';

export default function EditCourseClassForm({ course_class_id }: { course_class_id: string }) {

  const router = useRouter();

  const [courseClass, setCourseClass] = useState<CourseClassTeacherModel>();
  const [couses, setCourses] = useState<CourseModel[]>([]);
  const [teachers, setTeachers] = useState<TeacherModel[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CourseClassModel>({
    id: course_class_id,
    course_id: "",
    name: "",
    teacher_id: ""
  });

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
    getCourseClassById(course_class_id)
      .then((courseClass) => {

        setCourseClass(courseClass);
        console.log(courseClass);
        setFormData((prev) => ({
          ...prev,
          teacher_id: courseClass.teacher?.id || "",
          course_id: courseClass.course?.id,
          status: courseClass.status,
          name: courseClass.name
        }));

      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    getAllTeachersAvailableByLanguageFromCourseClass(course_class_id)
      .then(setTeachers)
      .catch((err) => setError(err.message));
  }, []);



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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      console.log(formData);

      await createCourseClass(formData);

      setMessage("✅ Course Class created successfully!");
      setFormData({
        id: "",
        course_id: "",
        name: "",
        teacher_id: "",
      });

      router.push("/dashboard/courses-class");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ Unknown error occurred.");
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


  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      status: event.target.checked,
    }));
  };


  return (

    <form onSubmit={handleSubmit} >

      <div className="mb-4">
        <div className="relative">
          <select
            id="course_id"
            name="course_id"
            value={formData.course_id}
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
                value={formData?.name}
                onChange={handleChange}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="md:block mb-1 mt-4">
      <Switch
        checked={Boolean(formData.status)}
        onChange={(checked) => {
          setFormData(prev => ({
            ...prev,
            status: checked,
          }));
        }}
        label={formData.status ? 'Ativo' : 'Inativo'}
        color="green"
      />
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
                  const isSelected = formData.teacher_id === teacher.id;

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
        <Button className='hover:bg-purple-500' type="submit">Atualizar Turma</Button>
      </div>

    </form>
  );
}