'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useEffect, useRef, useState } from "react";
import { CourseClassAddStudentsForm} from '@/app/lib/definitions/course_class_definitions';
import { getCourseClassById } from '@/app/services/courseClassService';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import SelectableStudentsTable, { SelectableStudentsTableRef } from '../students/students_selectable_table';
import { CreateCourseClassStudentModel } from '@/app/lib/definitions/course_class_students_definitions';
import { createCourseClassStudent, deleteByStudentAndCourseClass } from '@/app/services/courseClassStudentService';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { getStudentsInCourseClass, getStudentsNotInCourseClass } from '@/app/services/studentService';
import { DeleteStudantFromCourseClassList } from '../buttons/ui_buttons';

export default function AddStudentsCourseClassForm({ course_class_id }: { course_class_id: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState<CourseClassAddStudentsForm>({ id: course_class_id });
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [availableStudents, setAvailableStudents] = useState<StudentModel[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [actionType, setActionType] = useState<string | null>(null);

  const studentsTableRef = useRef<SelectableStudentsTableRef>(null);

  const loadCourseClassData = async () => {
    try {
      const courseClass = await getCourseClassById(course_class_id);
      setFormData(prev => ({
        ...prev,
        teacher: courseClass.teacher,
        course: courseClass.course,
        name: courseClass.name
      }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const loadStudentsInClass = async () => {
    try {
      const studentsInClass = await getStudentsInCourseClass(course_class_id);
      setStudents(studentsInClass);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const loadAvailableStudents = async () => {
    try {
      const studentsNotInClass = await getStudentsNotInCourseClass(course_class_id);
      setAvailableStudents(studentsNotInClass);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      loadStudentsInClass(),
      loadAvailableStudents()
    ]);
    setSelectedStudentIds([]);
  };

  useEffect(() => {
    loadCourseClassData();
    refreshAllData();
  }, [course_class_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'add_students') {
      try {

        const newCourseClassStudent: CreateCourseClassStudentModel = {
          course_class_id,
          student_ids: selectedStudentIds,
        };

        
        // Get the selected students from availableStudents
        const selectedStudents = availableStudents.filter(student => 
          selectedStudentIds.includes(student.id ?? '')
        );

        // Remove selected students from availableStudents
        const updatedAvailableStudents = availableStudents.filter(student => 
          !selectedStudentIds.includes(student.id ?? '')
        );

        // Add selected students to the students list
        const updatedStudents = [...students, ...selectedStudents];

        // Update the state
        setAvailableStudents(updatedAvailableStudents);
        setStudents(updatedStudents);
        setSelectedStudentIds([]);

        //Uncomment this when you want to persist to database
        await createCourseClassStudent(newCourseClassStudent);

        setMessage("✅ Students added successfully!");
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
        router.push("/dashboard/courses-class");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ Unknown error occurred.");
        }
      }
    }

    if (actionType === 'remove_student_from_class') {
      try {
        await deleteByStudentAndCourseClass(formData.student?.id, formData.id);
        
        // Refresh data after removing student
        await refreshAllData();
        
        setMessage("✅ Student removed successfully!");
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

      {/* Course name */}
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
                  name="course_name"
                  id="course_name"
                  value={formData?.course?.name || ''}
                  readOnly
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>


      {/** Nome do curso for desktop  **/}
      <table className="hidden min-w-full text-gray-900 md:table mt-3">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <th>Nome da Turma:</th>
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
                  <th scope="col" className="px-3 py-5 font-medium">Edit</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {students?.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className={`w-full cursor-pointer border-b py-3 text-sm last-of-type:border-none            
            [&:first-child>td:first-child]:rounded-tl-lg
            [&:first-child>td:last-child]:rounded-tr-lg
            [&:last-child>td:first-child]:rounded-bl-lg
            [&:last-child>td:last-child]:rounded-br-lg`}
                      onClick={() => {
                        if (student.id) {
                          // Update form data directly
                          setFormData(prev => ({
                            ...prev,
                            student: {
                              ...prev.student,
                              id: student.id,
                              name: student.name,
                              phone_number: student.phone_number,
                              email: student.email,
                              status: student.status,
                              due_date: student.due_date,
                              start_date: student.start_date,
                            }
                          }));
                        }
                      }}
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{student.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">{student.phone_number}</td>
                      <td className="whitespace-nowrap px-3 py-3">{student.email}</td>

                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex justify gap-3">
                          <DeleteStudantFromCourseClassList id={student.id as string} disabled={true} setActionType={setActionType}/>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Table of selectable students */}
      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <SelectableStudentsTable
          ref={studentsTableRef}
          students={availableStudents}
          selectedStudentIds={selectedStudentIds}
          onSelectionChange={setSelectedStudentIds}
        />
        <Button
          className="hover:bg-purple-500"
          type="submit"
          name="action"
          onClick={() => setActionType('add_students')}
          value="add_students"
        >
          Adicionar Alunos
        </Button>
      </div>

      {/* Footer buttons */}
      <div className="mt-6 flex justify-end gap-4">
      
        <Button
          className="hover:bg-purple-500"
          type="submit"
          name="action"
          onClick={() => setActionType('save_class')}
          value="save_class"
        >
          Voltar
        </Button>
      </div>

      {/* Display messages */}
      {message && (
        <div className="mt-4 p-4 rounded-md bg-gray-100">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700">
          Error: {error}
        </div>
      )}

    </form>
  );
}