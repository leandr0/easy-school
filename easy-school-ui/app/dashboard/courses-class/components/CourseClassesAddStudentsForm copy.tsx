'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import React, { useEffect, useRef, useState } from "react";
import { CourseClassAddStudentsForm } from '@/app/lib/definitions/course_class_definitions';
import { getCourseClassById } from '@/app/services/courseClassService';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import SelectableStudentsTable, { SelectableStudentsTableRef } from '../../../ui/students/students_selectable_table';
import { CreateCourseClassStudentModel } from '@/app/lib/definitions/course_class_students_definitions';
import { createCourseClassStudent, deleteByStudentAndCourseClass } from '@/app/services/courseClassStudentService';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { getStudentsInCourseClass, getStudentsNotInCourseClass } from '@/app/services/studentService';
import DeleteStudantFromCourseClassList from '@/app/ui/buttons/ui_buttons';

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
      if (err instanceof Error) setError(err.message);
    }
  };

  const loadStudentsInClass = async () => {
    try {
      const studentsInClass = await getStudentsInCourseClass(course_class_id);
      setStudents(studentsInClass);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const loadAvailableStudents = async () => {
    try {
      const studentsNotInClass = await getStudentsNotInCourseClass(course_class_id);
      setAvailableStudents(studentsNotInClass);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([loadStudentsInClass(), loadAvailableStudents()]);
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

        // Optimistic: move from available -> current list
        const selected = availableStudents.filter(s => selectedStudentIds.includes(s.id ?? ''));
        setAvailableStudents(prev => prev.filter(s => !selectedStudentIds.includes(s.id ?? '')));
        setStudents(prev => [...prev, ...selected]);
        setSelectedStudentIds([]);

        await createCourseClassStudent(newCourseClassStudent);
        setMessage("✅ Students added successfully!");
      } catch (err: unknown) {
        setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Unknown error occurred.");
        // Optional: refresh to ensure truth
        await refreshAllData();
      }
    }

    if (actionType === 'save_class') {
      try {
        router.push("/dashboard/courses-class");
      } catch (err: unknown) {
        setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Unknown error occurred.");
      }
    }
  };

  // Inline remove with optimistic UI + rollback
  const handleRemoveStudent = async (studentId: string) => {
    setError(null);

    const removed = students.find(s => String(s.id) === String(studentId));
    if (!removed) return;

    // optimistic
    setStudents(prev => prev.filter(s => String(s.id) !== String(studentId)));
    setAvailableStudents(prev => [removed, ...prev]);

    try {
      await deleteByStudentAndCourseClass(studentId, course_class_id);
      setMessage('✅ Student removed successfully!');
      // If you prefer, force refresh:
      // await refreshAllData();
    } catch (err: any) {
      // rollback
      setStudents(prev => [removed, ...prev]);
      setAvailableStudents(prev => prev.filter(s => String(s.id) !== String(studentId)));
      setError(err?.message || 'Failed to remove student');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-0">
      {/* ---------- DESKTOP (unchanged layout) ---------- */}
      <div className="hidden md:block">
        {/* Course name */}
        <table className="min-w-full text-gray-900">
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

        {/* Class name */}
        <table className="min-w-full text-gray-900 mt-3">
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
                    value={formData?.name || ''}
                    readOnly
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Current students (table) */}
        <div className="mb-1 mt-4">
          <label className="block text-sm font-medium"><strong>Alunos:</strong></label>
        </div>

        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="mt-2 flow-root">
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                    <th scope="col" className="px-3 py-5 font-medium">Telefone</th>
                    <th scope="col" className="px-3 py-5 font-medium">email</th>
                    <th scope="col" className="px-3 py-5 font-medium">Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {students?.map((student) => (
                    <tr
                      key={student.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none"
                      onClick={() => {
                        if (student.id) {
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
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">{student.name}</td>
                      <td className="whitespace-nowrap px-3 py-3">{student.phone_number}</td>
                      <td className="whitespace-nowrap px-3 py-3">{student.email}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex gap-3">
                          <DeleteStudantFromCourseClassList
                            id={student.id as string}
                            disabled={false}
                            onClick={() => handleRemoveStudent(String(student.id))}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-6 text-sm text-gray-500">Nenhum aluno matriculado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selectable (available) */}
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

        {/* Footer */}
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
      </div>

      {/* ---------- MOBILE (new optimized layout) ---------- */}
      <div className="md:hidden space-y-4">
        {/* Header card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs uppercase text-gray-500">Curso</div>
          <div className="mt-1 flex items-center gap-2">
            <BookOpenIcon className="h-[18px] w-[18px] text-gray-600" />
            <span className="text-sm font-semibold">
              {formData?.course?.name || 'Curso não definido'}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase text-gray-500">Turma</div>
            <div className="mt-1 text-sm font-semibold">
              {formData?.name || '—'}
            </div>
          </div>
        </div>

        {/* Current students list (cards) */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Alunos</div>
          {students.length > 0 ? (
            <ul className="divide-y divide-gray-200 bg-white">
              {students.map((s) => (
                <li key={s.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{s.name}</div>
                      <div className="text-xs text-gray-500">
                        {s.phone_number}
                        {s.phone_number && s.email ? ' • ' : ''}
                        {s.email}
                      </div>
                    </div>
                    <DeleteStudantFromCourseClassList
                      id={s.id as string}
                      disabled={false}
                      onClick={() => handleRemoveStudent(String(s.id))}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500 bg-white">
              Nenhum aluno matriculado.
            </div>
          )}
        </div>

        {/* Available students (reuses your table; usually responsive) */}
        <div className="rounded-lg border border-gray-200 bg-white p-2">
          <div className="px-2 py-2 text-sm font-medium">Adicionar alunos</div>
          <SelectableStudentsTable
            ref={studentsTableRef}
            students={availableStudents}
            selectedStudentIds={selectedStudentIds}
            onSelectionChange={setSelectedStudentIds}
          />
        </div>

        {/* Sticky action bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 flex gap-2">
          <Button
            className="flex-1"
            type="submit"
            name="action"
            onClick={() => setActionType('add_students')}
            value="add_students"
          >
            Adicionar
          </Button>
          <Button
            className="flex-1"
            type="submit"
            name="action"
            onClick={() => setActionType('save_class')}
            value="save_class"
          >
            Voltar
          </Button>
        </div>
        <div className="h-16" /> {/* bottom spacer so content isn't hidden */}
      </div>

      {/* Messages */}
      {message && <div className="mt-4 p-4 rounded-md bg-gray-100">{message}</div>}
      {error && <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700">Error: {error}</div>}
    </form>
  );
}
