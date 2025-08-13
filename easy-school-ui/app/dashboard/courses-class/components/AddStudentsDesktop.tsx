'use client';

import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import DeleteStudantFromCourseClassList from '@/app/ui/buttons/ui_buttons';
import SelectableStudentsTable, { SelectableStudentsTableRef } from '../../../ui/students/students_selectable_table';
import { AddStudentsCommonProps } from './CourseClassesAddStudentsForm';

export default function AddStudentsDesktop({
  formData,
  students,
  availableStudents,
  selectedStudentIds,
  setSelectedStudentIds,
  onRemoveStudent,
  onAddSelected,
  onBack,
  message,
  error,
  selectableRef,
}: AddStudentsCommonProps) {
  return (
    <div className="space-y-6">
      {/* Course name */}
      <table className="min-w-full text-gray-900">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr className="w-full border-b py-3 text-sm">
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
      <table className="min-w-full text-gray-900">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr className="w-full border-b py-3 text-sm">
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

      {/* Current students */}
      <div className="mb-1 mt-4">
        <label className="block text-sm font-medium"><strong>Alunos:</strong></label>
      </div>

      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mt-2 flow-root">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                  <th className="px-3 py-5 font-medium">Telefone</th>
                  <th className="px-3 py-5 font-medium">email</th>
                  <th className="px-3 py-5 font-medium">Edit</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {students.map((s) => (
                  <tr key={s.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">{s.name}</td>
                    <td className="whitespace-nowrap px-3 py-3">{s.phone_number}</td>
                    <td className="whitespace-nowrap px-3 py-3">{s.email}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex gap-3">
                        <DeleteStudantFromCourseClassList
                          id={s.id as string}
                          disabled={false}
                          onClick={() => onRemoveStudent(String(s.id))}
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

      {/* Available students */}
      <div className="rounded-lg bg-gray-50 p-2">
        <SelectableStudentsTable
          ref={selectableRef as React.RefObject<SelectableStudentsTableRef>}
          students={availableStudents}
          selectedStudentIds={selectedStudentIds}
          onSelectionChange={setSelectedStudentIds}
        />
        <Button className="hover:bg-purple-500" onClick={onAddSelected}>
          Adicionar Alunos
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-4">
        <Button className="hover:bg-purple-500" onClick={onBack}>
          Voltar
        </Button>
      </div>

      {message && <div className="mt-4 p-4 rounded-md bg-gray-100">{message}</div>}
      {error && <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700">Error: {error}</div>}
    </div>
  );
}
