'use client';

import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import DeleteStudantFromCourseClassList from '@/app/dashboard/components/ui_buttons';
import SelectableStudentsTable, { SelectableStudentsTableRef } from '../../students/components/StudentsSelectableTable';
import { AddStudentsCommonProps } from './CourseClassesAddStudentsForm';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination';

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




  // 🔢 pagination state
  const [studentsPage, setStudentsPage] = useState<number>(1);        // 1-based
  const [studentsPageSize, setStudentsPageSize] = useState<number>(3);

  // clamp current page if revenues length changes
  const studentsTotalCount = students?.length ?? 0;
  const studentsTotalPages = Math.max(1, Math.ceil(studentsTotalCount / Math.max(1, studentsPageSize)));

  useEffect(() => {
    if (studentsPage > studentsTotalPages) setStudentsPage(studentsTotalPages);
  }, [studentsTotalPages, studentsPage]);

  // slice current page
  const currentStudents = useMemo(() => {
    if (!students?.length) return [];
    const start = (studentsPage - 1) * studentsPageSize;
    const end = start + studentsPageSize;
    return students.slice(start, end);
  }, [students, studentsPage, studentsPageSize]);



  const [availableStudentsPage, setAvailableStudentsPage] = useState<number>(1);        // 1-based
  const [availableStudentsPageSize, setAvailableStudentsPageSize] = useState<number>(3);

  // clamp current page if revenues length changes
  const availableStudentsTotalCount = availableStudents?.length ?? 0;
  const availableStudentsTotalPages = Math.max(1, Math.ceil(availableStudentsTotalCount / Math.max(1, availableStudentsPageSize)));

  useEffect(() => {
    if (availableStudentsPage > availableStudentsTotalPages) setAvailableStudentsPage(availableStudentsTotalPages);
  }, [availableStudentsTotalPages, availableStudentsPage]);

  // slice current page
  const currentAvailableStudents = useMemo(() => {
    if (!availableStudents?.length) return [];
    const start = (availableStudentsPage - 1) * availableStudentsPageSize;
    const end = start + availableStudentsPageSize;
    return availableStudents.slice(start, end);
  }, [availableStudents, availableStudentsPage, availableStudentsPageSize]);


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
        {currentStudents.length > 0 ? (
          <ul className="divide-y divide-gray-200 bg-white">
            {currentStudents.map((s) => (
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
        <div className="mt-3">
          <Pagination
            totalCount={studentsTotalCount}
            currentPage={studentsPage}
            pageSize={studentsPageSize}
            onPageChange={setStudentsPage}
            onPageSizeChange={(s) => { setStudentsPageSize(s); setStudentsPage(1); }}
            pageSizeOptions={[3, 5]}
            // Optional: localized labels
            labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
          />
        </div>
      </div>

      {/* Available students */}
      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <div className="px-2 py-2 text-sm font-medium">Adicionar alunos</div>
        <SelectableStudentsTable
          ref={selectableRef as React.RefObject<SelectableStudentsTableRef>}
          students={currentAvailableStudents}
          selectedStudentIds={selectedStudentIds}
          onSelectionChange={setSelectedStudentIds}
        />
        <div className="mt-3">
          <Pagination
            totalCount={availableStudentsTotalCount}
            currentPage={availableStudentsPage}
            pageSize={availableStudentsPageSize}
            onPageChange={setAvailableStudentsPage}
            onPageSizeChange={(s) => { setAvailableStudentsPageSize(s); setAvailableStudentsPage(1); }}
            pageSizeOptions={[5, 10, 15]}
            // Optional: localized labels
            labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
          />
        </div>
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
