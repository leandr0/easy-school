'use client';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { UpdateTeacher } from '../../components/ui_buttons';
import TeacherStatus from './TeacherStatus';
import { Pagination } from '../../components/Pagination';
import { useEffect, useMemo, useState } from 'react';
import SortToggle from '@/app/dashboard/components/SortToggle';
import type { SortDirection } from '@/app/dashboard/components/tableUtils';
import type { TeacherSortKey } from './TeacherTable';

interface TeacherTableDesktopProps {
  teachers: TeacherModel[];
  sortKey: TeacherSortKey;
  sortDirection: SortDirection;
  onSort: (key: TeacherSortKey) => void;
}

export default function TeacherTableDesktop({
  teachers,
  sortKey,
  sortDirection,
  onSort,
}: TeacherTableDesktopProps) {

  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(5);

  // clamp current page if revenues length changes
  const totalCount = teachers?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!teachers?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return teachers.slice(start, end);
  }, [teachers, page, pageSize]);

  // Note: hooks above must run on every render, so the "no results" state
  // is handled here, after the hooks, rather than with an early return.
  if (!teachers?.length) {
    return (
      <div className="rounded-lg bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-gray-500">Nenhum professor encontrado</p>
        </div>
      </div>
    );
  }


  return (
    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
      <table className="min-w-full text-gray-900">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              <SortToggle
                label="Nome"
                active={sortKey === "name"}
                direction={sortDirection}
                onClick={() => onSort("name")}
              />
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              <SortToggle
                label="Status"
                active={sortKey === "status"}
                direction={sortDirection}
                onClick={() => onSort("status")}
              />
            </th>
            <th scope="col" className="relative py-3 pl-6 pr-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {currentItems.map((teacher) => (
            <tr
              key={teacher.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                  <p>{teacher.name}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                <TeacherStatus status={teacher.status ? "Ativo" : "Inativo"} />
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                  <UpdateTeacher id={teacher.id as string} disabled={false} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[5,10,15,20]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}
