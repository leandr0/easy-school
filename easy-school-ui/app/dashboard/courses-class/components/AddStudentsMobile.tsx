'use client';

import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import DeleteStudantFromCourseClassList from '@/app/dashboard/components/ui_buttons';
import SelectableStudentsTable , { SelectableStudentsTableRef }from '../../students/components/students_selectable_table';
import { AddStudentsCommonProps } from './CourseClassesAddStudentsForm';

export default function AddStudentsMobile({
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
    <div className="space-y-4 p-4">
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
          <div className="mt-1 text-sm font-semibold">{formData?.name || '—'}</div>
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
                    onClick={() => onRemoveStudent(String(s.id))}
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

      {/* Available students */}
      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <div className="px-2 py-2 text-sm font-medium">Adicionar alunos</div>
        <SelectableStudentsTable
          ref={selectableRef as React.RefObject<SelectableStudentsTableRef>}
          students={availableStudents}
          selectedStudentIds={selectedStudentIds}
          onSelectionChange={setSelectedStudentIds}
        />
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 flex gap-2">
        <Button className="flex-1" onClick={onAddSelected}>
          Adicionar
        </Button>
        <Button className="flex-1" onClick={onBack}>
          Voltar
        </Button>
      </div>
      <div className="h-16" />

      {message && <div className="mt-4 p-4 rounded-md bg-gray-100">{message}</div>}
      {error && <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700">Error: {error}</div>}
    </div>
  );
}
