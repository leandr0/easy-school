"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CourseClassTeacherModel } from "@/app/lib/definitions/course_class_definitions";
import DesktopCoursesClassTable from "./DesktopCoursesClassTable";
import MobileCoursesClassTable from "./MobileCoursesClassTable";
import { Pagination } from "../../components/Pagination";
import { matchesQuery, sortItems, nextSort, SortDirection } from "@/app/dashboard/components/tableUtils";

/** SSR-safe media query hook */
function useMediaQuery(query: string) {
  const getMql = () => (typeof window !== "undefined" ? window.matchMedia(query) : null);

  const subscribe = (cb: () => void) => {
    const mql = getMql();
    if (!mql) return () => {};
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

export type CourseClassSortKey = "name" | "status" | "teacher";

function sortValue(courseClass: CourseClassTeacherModel, key: CourseClassSortKey) {
  switch (key) {
    case "status":
      return courseClass.status;
    case "teacher":
      return courseClass.teacher?.user?.name;
    default:
      return courseClass.name;
  }
}

export default function CoursesClassTable({
  query,
  currentPage,
  courseClasses,
}: {
  query: string;
  currentPage: number;
  courseClasses: CourseClassTeacherModel[];
}) {
  const [error] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<CourseClassSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: CourseClassSortKey) => {
    const next = nextSort(sortKey, sortDirection, key);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  // Filter + sort
  const filteredCourses = useMemo(() => {
    const safe = courseClasses ?? [];
    const filtered = safe.filter(
      (c) => matchesQuery(query, c.name, c.teacher?.user?.name)
    );
    return sortItems(filtered, (c) => sortValue(c, sortKey), sortDirection);
  }, [courseClasses, query, sortKey, sortDirection]);

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

  const totalCount = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  // Clamp page when data/size changes (after hydration)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Current slice
  const currentItems = useMemo(() => {
    if (!filteredCourses.length) return [];
    const start = (page - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, page, pageSize]);

  if (error) {
    return <div className="text-center p-8 text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          {/* Render both; CSS handles visibility. This is SSR-stable. */}
          <div className="md:hidden">
            <MobileCoursesClassTable
              courseClasses={currentItems}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
          <div className="hidden md:block">
            <DesktopCoursesClassTable
              courseClasses={currentItems}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        </div>
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
  );
}
