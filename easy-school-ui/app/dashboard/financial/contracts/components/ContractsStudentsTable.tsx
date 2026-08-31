'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { Pagination } from '../../../components/Pagination';

type SortField = 'name' | 'phone_number' | 'username';
type SortDirection = 'asc' | 'desc';

interface Props {
  students: StudentModel[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onSearchChange?: (query: string) => void;
}

const COLUMNS: { field: SortField; label: string }[] = [
  { field: 'name', label: 'Nome' },
  { field: 'phone_number', label: 'Telefone' },
  { field: 'username', label: 'Email' },
];

export default function ContractsStudentsTable({ students, selectedStudentId, onSelectStudent, onSearchChange }: Props) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => (student.user?.name ?? '').toLowerCase().includes(query));
  }, [students, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const aVal = (a.user?.[sortField] ?? '').toString().toLowerCase();
      const bVal = (b.user?.[sortField] ?? '').toString().toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const handleSort = (field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        return prevField;
      }
      setSortDirection('asc');
      return field;
    });
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    // Typing a new search means the user is moving on to a different
    // student — clear out whatever is currently selected/displayed so the
    // previous student's contract details and save message don't linger
    // on screen while they look for someone else.
    onSearchChange?.(value);
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return <span className="ml-1 text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div>
      <div className="relative mb-3 w-full md:w-1/2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <label htmlFor="student-search" className="sr-only">
          Buscar aluno por nome
        </label>
        <input
          id="student-search"
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar aluno por nome..."
          className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        {/* Mobile */}
        <div className="md:hidden">
          {currentItems.length === 0 && (
            <p className="p-4 text-sm text-gray-500">Nenhum aluno encontrado.</p>
          )}
          {currentItems.map((student) => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                type="button"
                key={student.id}
                onClick={() => student.id && onSelectStudent(student.id)}
                className={`mb-2 w-full rounded-md border p-4 text-left transition ${
                  isSelected ? 'border-blue-400 bg-blue-100' : 'border-gray-200 bg-white hover:bg-gray-100'
                }`}
              >
                <p className="truncate font-medium">{student.user?.name}</p>
                <p className="text-sm text-gray-500">{student.user?.phone_number}</p>
                <p className="truncate text-sm text-gray-500">{student.user?.username}</p>
              </button>
            );
          })}
        </div>

        {/* Desktop */}
        <table className="hidden min-w-full text-gray-900 md:table">
          <thead className="text-left text-sm font-normal">
            <tr>
              {COLUMNS.map(({ field, label }) => (
                <th key={field} scope="col" className="px-4 py-3 font-medium sm:pl-6">
                  <button
                    type="button"
                    onClick={() => handleSort(field)}
                    className="flex items-center hover:text-blue-600"
                  >
                    {label}
                    {sortIndicator(field)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-sm text-gray-500">
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
            {currentItems.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <tr
                  key={student.id}
                  onClick={() => student.id && onSelectStudent(student.id)}
                  className={`cursor-pointer border-b text-sm last-of-type:border-none ${
                    isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">{student.user?.name}</td>
                  <td className="whitespace-nowrap px-3 py-3">{student.user?.phone_number}</td>
                  <td className="whitespace-nowrap px-3 py-3">{student.user?.username}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          pageSizeOptions={[5, 10, 15]}
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}
