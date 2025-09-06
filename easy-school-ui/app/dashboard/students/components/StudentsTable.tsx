'use client';
import { UpdateBase } from '@/app/dashboard/components/ui_buttons';
import StudentStatus from './StudentsStatus';
import { formatDateToLocal } from '@/app/lib/utils';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Pagination } from '../../components/Pagination';

/** SSR-safe media query hook */
function useMediaQuery(query: string) {
  const getMql = () => (typeof window !== "undefined" ? window.matchMedia(query) : null);

  const subscribe = (cb: () => void) => {
    const mql = getMql();
    if (!mql) return () => { };
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };

  const getSnapshot = () => {
    const mql = getMql();
    return mql ? mql.matches : false; // client snapshot
  };

  const getServerSnapshot = () => false; // ALWAYS false on server for deterministic SSR

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}


export default function StudentsTable({
  query,
  currentPage,
  students,
}: {
  query: string;
  currentPage: number;
  students: StudentModel[];
}) {



  // Breakpoint (SSR-safe)
  const isMdUp = useMediaQuery("(min-width: 768px)");

  // Derive options from breakpoint (memoized)
  const pageSizeOptions = useMemo(
    () => (isMdUp ? [5, 10, 15, 20] : [3, 5, 10]),
    [isMdUp]
  );

  // IMPORTANT: Use SSR-stable defaults on *initial* render.
  // Never read matchMedia in the initializer — that causes client-first diff.
  const [page, setPage] = useState<number>(currentPage || 1); // 1-based
  const [pageSize, setPageSize] = useState<number>(3);        // <-- SSR-stable default

  // After hydration, reconcile pageSize with breakpoint/options
  useEffect(() => {
    // If current pageSize isn't valid for the new breakpoint, snap to first option
    if (!pageSizeOptions.includes(pageSize)) {
      setPageSize(pageSizeOptions[0]);  // e.g., 5 on desktop, 3 on mobile
      setPage(1);
    } else {
      // Optional: if SSR default (3) but we’re desktop and your desired default is 5
      if (isMdUp && pageSize === 3 && pageSizeOptions[0] !== 3) {
        setPageSize(pageSizeOptions[0]); // move to 5 on desktop post-hydration
        setPage(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdUp, pageSizeOptions]);

  const totalCount = students.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  // Clamp page when data/size changes (after hydration)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Current slice
  const currentItems = useMemo(() => {
    if (!students.length) return [];
    const start = (page - 1) * pageSize;
    return students.slice(start, start + pageSize);
  }, [students, page, pageSize]);



  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {currentItems?.map((student) => (
              <div key={student.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="max-w-[70%]">
                    <div className="mb-2">
                      <p className="font-medium truncate">{student.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">Vencimento: <span className="font-bold">{student.due_date}</span></p>
                  </div>
                  <StudentStatus status={student.status ? "Ativo" : "Inativo"} />
                </div>

                <div className="flex flex-col w-full justify-between pt-4">
                  <div className="space-y-2 w-full">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm font-medium">Tel:</span>
                        <p className="text-sm">{student.phone_number}</p>
                      </div>
                      <div className="flex justify-end">
                        <UpdateBase id={student.id as string} link='/dashboard/students/${id}/edit' disabled={false} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm font-medium">Email:</span>
                      <p className="text-sm break-words">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm font-medium">Inscrição:</span>
                      <p className="text-sm">{student.start_date ? formatDateToLocal(student.start_date) : 'Não disponível'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="grid grid-cols-13 text-left text-sm font-normal rounded-lg bg-gray-50 text-center">
              <div className="px-4 py-3 font-medium sm:pl-6 border-b col-span-3">
                Nome
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-2">
                Telefone
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-3">
                Email
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1">
                Status
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1 text-center">
                Vencimento
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-2">
                Inscrição
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1">
                <span className="sr-only">Edit</span>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white">
              {currentItems?.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-13 w-full border-b text-sm last-of-type:border-none">

                  <div className="py-3 pl-6 pr-3 col-span-3">
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm">{student.name}</p>
                    </div>
                  </div>

                  <div className="px-3 py-3 col-span-2">
                    <p className="truncate text-xs md:text-sm">{student.phone_number}</p>
                  </div>

                  <div className="px-3 py-3 col-span-3">
                    <p className="truncate text-xs md:text-sm">{student.email}</p>
                  </div>
                  <div className="px-3 py-3 col-span-1">
                    <StudentStatus status={student.status ? "Ativo" : "Inativo"} />
                  </div>
                  <div className="text-center py-3 col-span-1 text-center ml-[23px]">
                    <p className="text-xs md:text-sm">{student.due_date}</p>
                  </div>
                  <div className="px-3 py-3 col-span-2 text-center">
                    <p className="truncate text-xs md:text-sm">{student.start_date ? formatDateToLocal(student.start_date) : 'Não disponível'}</p>
                  </div>
                  <div className="py-3 pr-3 col-span-1 flex justify-center">
                    <div className="flex justify-center">
                      <UpdateBase id={student.id as string} link='/dashboard/students/${id}/edit' disabled={false} />
                    </div>
                  </div>
                </div>

              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[5, 10, 15]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}