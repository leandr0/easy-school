'use client';

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { DeleteWeekDayAvailability } from '../../components/ui_buttons';
import { Pagination } from '../../components/Pagination'; 

type Item = {
  uddi?: string;
  week_day?: { id?: string | number; week_day?: string };
  start_hour?: string | number;
  start_minute?: string | number;
  end_hour?: string | number;
  end_minute?: string | number;
};

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

interface Props {
  teacherWeeDayAvailables: Item[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setActionType: (action: string) => void;
  setSelectedWeekDayUddi?: (uddi: string) => void;
}

const pad2 = (v?: string | number) => String(v ?? '').padStart(2, '0');

export function TeacherWeekDayAvailabilityComponent({
  teacherWeeDayAvailables,
  setFormData,
  setActionType,
  setSelectedWeekDayUddi,
}: Props) {


  // Breakpoint (SSR-safe)
  const isMdUp = useMediaQuery("(min-width: 768px)");

  // Derive options from breakpoint (memoized)
  const pageSizeOptions = useMemo(
    () => (isMdUp ? [4, 8] : [3,6]),
    [isMdUp]
  );

  // IMPORTANT: Use SSR-stable defaults on *initial* render.
  // Never read matchMedia in the initializer — that causes client-first diff.
  const [page, setPage] = useState<number>( 1); // 1-based
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

  const totalCount = teacherWeeDayAvailables.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  // Clamp page when data/size changes (after hydration)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);


  // Current slice
  const currentItems = useMemo(() => {
    if (!teacherWeeDayAvailables.length) return [];
    const start = (page - 1) * pageSize;
    return teacherWeeDayAvailables.slice(start, start + pageSize);
  }, [teacherWeeDayAvailables, page, pageSize]);




  return (
    <section className="mx-auto w-full max-w-4xl pt-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Disponibilidade</h3>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="grid grid-cols-4 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
              <div>Dia</div>
              <div>Hora Início</div>
              <div>Hora Fim</div>
              <div className="text-right">Ações</div>
            </div>

            <div className="divide-y divide-gray-200">
              {currentItems?.map((row) => (
                <div
                  key={row.uddi}
                  className="grid grid-cols-4 items-center px-4 py-3 hover:bg-gray-50"
                  onClick={() => {
                    if (row.uddi) {
                      setFormData((prev: any) => ({
                        ...prev,
                        week_day: { ...(prev.week_day || {}), id: row.uddi },
                      }));
                    }
                  }}
                >
                  <div className="truncate">{row.week_day?.week_day}</div>
                  <div className="font-mono">{pad2(row.start_hour)}:{pad2(row.start_minute)}</div>
                  <div className="font-mono">{pad2(row.end_hour)}:{pad2(row.end_minute)}</div>
                  <div className="text-right">
                    <DeleteWeekDayAvailability
                      disabled={true}
                      setActionType={(action) => {
                        if (row.uddi) setSelectedWeekDayUddi?.(row.uddi);
                        setActionType(action);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile list */}
        <div className="space-y-3 md:hidden">
          {currentItems?.map((row) => (
            <div
              key={row.uddi}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
              onClick={() => {
                if (row.uddi) {
                  setFormData((prev: any) => ({
                    ...prev,
                    week_day: { ...(prev.week_day || {}), id: row.uddi },
                  }));
                }
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">
                  {row.week_day?.week_day || '—'}
                </div>
                <DeleteWeekDayAvailability
                  disabled={true}
                  setActionType={(action) => {
                    if (row.uddi) setSelectedWeekDayUddi?.(row.uddi);
                    setActionType(action);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>
                  <span className="mr-1 font-medium text-gray-600">Início:</span>
                  <span className="font-mono">{pad2(row.start_hour)}:{pad2(row.start_minute)}</span>
                </div>
                <div>
                  <span className="mr-1 font-medium text-gray-600">Fim:</span>
                  <span className="font-mono">{pad2(row.end_hour)}:{pad2(row.end_minute)}</span>
                </div>
              </div>
            </div>
          ))}
          {(!teacherWeeDayAvailables || teacherWeeDayAvailables.length === 0) && (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
              Nenhuma disponibilidade adicionada ainda.
            </div>
          )}
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
            pageSizeOptions={pageSizeOptions}
            labels={{
              previous: "Anterior",
              next: "Próxima",
              of: "de",
              perPage: "por página",
              page: "Página",
              goTo: "Ir para",
            }}
          />
        </div>
      </div>

    </section>
  );
}
