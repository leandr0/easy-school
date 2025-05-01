'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useState } from "react";
import { CourseClassCompleteModel} from '@/app/lib/definitions/course_class_definitions';
import { getCourseClassById } from '@/app/lib/actions/course_class_actions';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import SelectableStudentsTable from '../students/students_selectable_table';
import { CreateCourseClassStudentModel } from '@/app/lib/definitions/course_class_students_definitions';
import { createCourseClassStudent } from '@/app/lib/actions/course_class_students_actions';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { getStudentsInCourseClass } from '@/app/lib/actions/students_actions';


export default function AddStudentsCourseClassForm({ course_class_id }: { course_class_id: string }) {

  const router = useRouter();

  const [courseClass, setCourseClass] = useState<CourseClassCompleteModel>();

  const [students, setStudents] = useState<StudentModel[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CourseClassCompleteModel>({
    id: course_class_id,
  });

  const [actionType, setActionType] = useState<string | null>(null);


  useEffect(() => {
    getCourseClassById(course_class_id)
      .then((courseClass) => {

        setCourseClass(courseClass);
        
        setFormData((prev) => ({
          ...prev,
          teacher: courseClass.teacher,
          course: courseClass.course,
          name: courseClass.name
        }));

      })
      .catch((err) => setError(err.message));
  }, []);

   useEffect(() => {
    getStudentsInCourseClass(course_class_id)
        .then(setStudents)
        .catch((err) => setError(err.message));
    }, []);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'add_students') {

      try {
        console.log('Students to be added:', selectedStudentIds);

        const newCourseClassStudent: CreateCourseClassStudentModel = {
          course_class_id: course_class_id,
          student_ids: selectedStudentIds,
        };

        console.log('Course Class Students:', newCourseClassStudent);

        // Here call your backend to add students
        await createCourseClassStudent(newCourseClassStudent);

        setSelectedStudentIds([]);

        const updatedStudents = await getStudentsInCourseClass(course_class_id);
        setStudents(updatedStudents);
        //router.push("/dashboard/courses-class");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ Unknown error occurred.");
        }
      }

    }
    if (actionType === 'save_class') {

      try {
        
        // Here call your backend to add students
        // await createCourseClassStudent({ course_class_id, student_ids: selectedStudentIds });

        
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

    <form onSubmit={handleSubmit} >

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            name="course_name"
            id="course_name"
            value={formData?.course?.name}
            readOnly={true}
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
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
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData?.name}
                  readOnly={true}
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>


      {/* Desktop professor label (new addition) */}
      <div className="hidden md:block mb-1 mt-4">
        <label className="block text-sm font-medium">
          <strong>Alunos:</strong>
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
                {students?.map((student) => {

                  // Check if this teacher is selected
                  const isSelected = true;

                  return (
                    <tr
                      key={student.id}
                      className={`w-full cursor-pointer border-b py-3 text-sm last-of-type:border-none
            ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
            [&:first-child>td:first-child]:rounded-tl-lg
            [&:first-child>td:last-child]:rounded-tr-lg
            [&:last-child>td:first-child]:rounded-bl-lg
            [&:last-child>td:last-child]:rounded-br-lg`}
                      onClick={() => {
                        if (student.id) {
                          // Update form data directly
                          setFormData(prev => ({
                            ...prev,
                            teacher_id: student.id
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
                          <p>{student.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">{student.phone_number}</td>
                      <td className="whitespace-nowrap px-3 py-3">{student.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <SelectableStudentsTable
          course_class_id={course_class_id}
          onSelectionChange={setSelectedStudentIds}
        />
        <Button className='hover:bg-purple-500'
          type="submit" name="action" onClick={() => setActionType('add_students')}
          value="add_students" >Adicionar Alunos</Button>
      </div>


      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/courses-class"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button className='hover:bg-purple-500'
          type="submit" name="action" onClick={() => setActionType('save_class')}
          value="save_class">Salvar Turma</Button>
      </div>

    </form>
  );
}