'use client';

import { BookOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import DeleteStudantFromCourseClassList from '@/app/dashboard/components/ui_buttons';
import SelectableStudentsTable, { SelectableStudentsTableRef, SelectableStudentsSortKey } from '../../students/components/StudentsSelectableTable';
import { AddStudentsCommonProps } from './CourseClassesAddStudentsForm';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination';
import MobileSortBar from '@/app/dashboard/components/MobileSortBar';
import { matchesQuery, sortItems, nextSort, SortDirection } from '@/app/dashboard/components/tableUtils';
import { StudentModel } from '@/app/lib/definitions/students_definitions';

type StudentSortKey = SelectableStudentsSortKey; // 'name' | 'phone' | 'email'

const SORT_OPTIONS: { value: StudentSortKey; label: string }[] = [
  { value: 'name', label: 'Nome' },
  { value: 'phone', label: 'Telefone' },
  { value: 'email', label: 'Email' },
];

function studentSortValue(s: StudentModel, key: StudentSortKey) {
  switch (key) {
    case 'phone':
      return s.user?.phone_number;
    case 'email':
      return s.user?.username;
    default:
      return s.user?.name;
  }
}

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
  pendingSaves,
}: AddStudentsCommonProps) {


  // ---- Alunos (enrolled): search + sort, ordered by name by default ----
  const [studentsQuery, setStudentsQuery] = useState('');
  const [studentsSortKey, setStudentsSortKey] = useState<StudentSortKey>('name');
  const [studentsSortDir, setStudentsSortDir] = useState<SortDirection>('asc');

  const filteredSortedStudents = useMemo(() => {
    const filtered = (students ?? []).filter((s) =>
      matchesQuery(studentsQuery, s.user?.name, s.user?.phone_number, s.user?.username)
    );
    return sortItems(filtered, (s) => studentSortValue(s, studentsSortKey), studentsSortDir);
  }, [students, studentsQuery, studentsSortKey, studentsSortDir]);

  // 🔢 pagination state
  const [studentsPage, setStudentsPage] = useState<number>(1);        // 1-based
  const [studentsPageSize, setStudentsPageSize] = useState<number>(3);

  // clamp current page if revenues length changes
  const studentsTotalCount = filteredSortedStudents.length;
  const studentsTotalPages = Math.max(1, Math.ceil(studentsTotalCount / Math.max(1, studentsPageSize)));

  useEffect(() => {
    if (studentsPage > studentsTotalPages) setStudentsPage(studentsTotalPages);
  }, [studentsTotalPages, studentsPage]);

  useEffect(() => {
    setStudentsPage(1);
  }, [studentsQuery, studentsSortKey, studentsSortDir]);

  // slice current page
  const currentStudents = useMemo(() => {
    if (!filteredSortedStudents.length) return [];
    const start = (studentsPage - 1) * studentsPageSize;
    const end = start + studentsPageSize;
    return filteredSortedStudents.slice(start, end);
  }, [filteredSortedStudents, studentsPage, studentsPageSize]);


  // ---- Available students: search + sort, ordered by name by default ----
  const [availableQuery, setAvailableQuery] = useState('');
  const [availableSortKey, setAvailableSortKey] = useState<StudentSortKey>('name');
  const [availableSortDir, setAvailableSortDir] = useState<SortDirection>('asc');

  const filteredSortedAvailable = useMemo(() => {
    const filtered = (availableStudents ?? []).filter((s) =>
      matchesQuery(availableQuery, s.user?.name, s.user?.phone_number, s.user?.username)
    );
    return sortItems(filtered, (s) => studentSortValue(s, availableSortKey), availableSortDir);
  }, [availableStudents, availableQuery, availableSortKey, availableSortDir]);

  const [availableStudentsPage, setAvailableStudentsPage] = useState<number>(1);        // 1-based
  const [availableStudentsPageSize, setAvailableStudentsPageSize] = useState<number>(3);

  // clamp current page if revenues length changes
  const availableStudentsTotalCount = filteredSortedAvailable.length;
  const availableStudentsTotalPages = Math.max(1, Math.ceil(availableStudentsTotalCount / Math.max(1, availableStudentsPageSize)));

  useEffect(() => {
    if (availableStudentsPage > availableStudentsTotalPages) setAvailableStudentsPage(availableStudentsTotalPages);
  }, [availableStudentsTotalPages, availableStudentsPage]);

  useEffect(() => {
    setAvailableStudentsPage(1);
  }, [availableQuery, availableSortKey, availableSortDir]);

  // slice current page
  const currentAvailableStudents = useMemo(() => {
    if (!filteredSortedAvailable.length) return [];
    const start = (availableStudentsPage - 1) * availableStudentsPageSize;
    const end = start + availableStudentsPageSize;
    return filteredSortedAvailable.slice(start, end);
  }, [filteredSortedAvailable, availableStudentsPage, availableStudentsPageSize]);


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

      {pendingSaves > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin" />
          Sincronizando alterações...
        </div>
      )}

      {/* Current students list (cards) */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Alunos</div>
        <div className="p-2 bg-white space-y-2">
          <div className="relative">
            <input
              type="text"
              value={studentsQuery}
              onChange={(e) => setStudentsQuery(e.target.value)}
              placeholder="Buscar aluno..."
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <MobileSortBar
            options={SORT_OPTIONS}
            sortKey={studentsSortKey}
            direction={studentsSortDir}
            onSortKeyChange={setStudentsSortKey}
            onDirectionToggle={() => setStudentsSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          />
        </div>
        {currentStudents.length > 0 ? (
          <ul className="divide-y divide-gray-200 bg-white">
            {currentStudents.map((s) => (
              <li key={s.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.user?.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.user?.phone_number}
                      {s.user?.phone_number && s.user?.username ? ' • ' : ''}
                      {s.user?.username}
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
            {students.length === 0 ? 'Nenhum aluno matriculado.' : 'Nenhum aluno encontrado para essa busca.'}
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
        <div className="px-2 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={availableQuery}
              onChange={(e) => setAvailableQuery(e.target.value)}
              placeholder="Buscar aluno..."
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <MobileSortBar
            options={SORT_OPTIONS}
            sortKey={availableSortKey}
            direction={availableSortDir}
            onSortKeyChange={setAvailableSortKey}
            onDirectionToggle={() => setAvailableSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          />
        </div>
        {availableStudents.length > 0 && filteredSortedAvailable.length === 0 && (
          <p className="px-2 py-4 text-sm text-gray-500">Nenhum aluno encontrado para essa busca.</p>
        )}
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
        <Button className="flex-1" disabled={selectedStudentIds.length === 0} onClick={onAddSelected}>
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
