'use client';

import { BookOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import DeleteStudantFromCourseClassList from '@/app/dashboard/components/ui_buttons';
import SelectableStudentsTable, { SelectableStudentsTableRef, SelectableStudentsSortKey } from '../../students/components/StudentsSelectableTable';
import { AddStudentsCommonProps } from './CourseClassesAddStudentsForm';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination';
import SortToggle from '@/app/dashboard/components/SortToggle';
import { matchesQuery, sortItems, nextSort, SortDirection } from '@/app/dashboard/components/tableUtils';
import { StudentModel } from '@/app/lib/definitions/students_definitions';

type StudentSortKey = SelectableStudentsSortKey; // 'name' | 'phone' | 'email'

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
  pendingSaves,
}: AddStudentsCommonProps) {


  // ---- Alunos (enrolled): search + sort, ordered by name by default ----
  const [studentsQuery, setStudentsQuery] = useState('');
  const [studentsSortKey, setStudentsSortKey] = useState<StudentSortKey>('name');
  const [studentsSortDir, setStudentsSortDir] = useState<SortDirection>('asc');

  const handleStudentsSort = (key: StudentSortKey) => {
    const next = nextSort(studentsSortKey, studentsSortDir, key);
    setStudentsSortKey(next.key);
    setStudentsSortDir(next.direction);
  };

  const filteredSortedStudents = useMemo(() => {
    const filtered = (students ?? []).filter((s) =>
      matchesQuery(studentsQuery, s.user?.name, s.user?.phone_number, s.user?.username)
    );
    return sortItems(filtered, (s) => studentSortValue(s, studentsSortKey), studentsSortDir);
  }, [students, studentsQuery, studentsSortKey, studentsSortDir]);

  // 🔢 pagination state
  const [studentsPage, setStudentsPage] = useState<number>(1);        // 1-based
  const [studentsPageSize, setStudentsPageSize] = useState<number>(5);

  // clamp current page if revenues length changes
  const studentsTotalCount = filteredSortedStudents.length;
  const studentsTotalPages = Math.max(1, Math.ceil(studentsTotalCount / Math.max(1, studentsPageSize)));

  useEffect(() => {
    if (studentsPage > studentsTotalPages) setStudentsPage(studentsTotalPages);
  }, [studentsTotalPages, studentsPage]);

  // back to page 1 whenever the filter or sort changes
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

  const handleAvailableSort = (key: StudentSortKey) => {
    const next = nextSort(availableSortKey, availableSortDir, key);
    setAvailableSortKey(next.key);
    setAvailableSortDir(next.direction);
  };

  const filteredSortedAvailable = useMemo(() => {
    const filtered = (availableStudents ?? []).filter((s) =>
      matchesQuery(availableQuery, s.user?.name, s.user?.phone_number, s.user?.username)
    );
    return sortItems(filtered, (s) => studentSortValue(s, availableSortKey), availableSortDir);
  }, [availableStudents, availableQuery, availableSortKey, availableSortDir]);

  const [availableStudentsPage, setAvailableStudentsPage] = useState<number>(1);        // 1-based
  const [availableStudentsPageSize, setAvailableStudentsPageSize] = useState<number>(5);

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
      <div className="mb-1 mt-4 flex items-center justify-between">
        <label className="block text-sm font-medium"><strong>Alunos:</strong></label>
        {pendingSaves > 0 && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin" />
            Sincronizando...
          </span>
        )}
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          value={studentsQuery}
          onChange={(e) => setStudentsQuery(e.target.value)}
          placeholder="Buscar por nome, telefone ou email..."
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mt-2 flow-root">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">
                    <SortToggle
                      label="Nome"
                      active={studentsSortKey === 'name'}
                      direction={studentsSortDir}
                      onClick={() => handleStudentsSort('name')}
                    />
                  </th>
                  <th className="px-3 py-5 font-medium">
                    <SortToggle
                      label="Telefone"
                      active={studentsSortKey === 'phone'}
                      direction={studentsSortDir}
                      onClick={() => handleStudentsSort('phone')}
                    />
                  </th>
                  <th className="px-3 py-5 font-medium">
                    <SortToggle
                      label="email"
                      active={studentsSortKey === 'email'}
                      direction={studentsSortDir}
                      onClick={() => handleStudentsSort('email')}
                    />
                  </th>
                  <th className="px-3 py-5 font-medium">Edit</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentStudents.map((s) => (
                  <tr key={s.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">{s.user?.name}</td>
                    <td className="whitespace-nowrap px-3 py-3">{s.user?.phone_number}</td>
                    <td className="whitespace-nowrap px-3 py-3">{s.user?.username}</td>
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
                {students.length > 0 && filteredSortedStudents.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-sm text-gray-500">Nenhum aluno encontrado para essa busca.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3">
          <Pagination
            totalCount={studentsTotalCount}
            currentPage={studentsPage}
            pageSize={studentsPageSize}
            onPageChange={setStudentsPage}
            onPageSizeChange={(s) => { setStudentsPageSize(s); setStudentsPage(1); }}
            pageSizeOptions={[5, 10, 15]}
            // Optional: localized labels
            labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
          />
        </div>
      </div>

      {/* Available students */}
      <div className="rounded-lg bg-gray-50 p-2">
        <div className="relative max-w-sm mb-2">
          <input
            type="text"
            value={availableQuery}
            onChange={(e) => setAvailableQuery(e.target.value)}
            placeholder="Buscar por nome, telefone ou email..."
            className="peer block w-full rounded-md border border-gray-200 bg-white py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        {availableStudents.length > 0 && filteredSortedAvailable.length === 0 && (
          <p className="px-2 py-4 text-sm text-gray-500">Nenhum aluno encontrado para essa busca.</p>
        )}
        <SelectableStudentsTable
          ref={selectableRef as React.RefObject<SelectableStudentsTableRef>}
          students={currentAvailableStudents}
          selectedStudentIds={selectedStudentIds}
          onSelectionChange={setSelectedStudentIds}
          sortKey={availableSortKey}
          sortDirection={availableSortDir}
          onSortChange={handleAvailableSort}
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
        <Button className="hover:bg-purple-500 mt-3" disabled={selectedStudentIds.length === 0} onClick={onAddSelected}>
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
