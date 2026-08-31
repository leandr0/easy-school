"use client";

import React, { useMemo, useState } from "react";


import { CourseModel } from "@/app/lib/definitions/courses_definitions";
import { matchesQuery, sortItems, nextSort, SortDirection } from "@/app/dashboard/components/tableUtils";

import CoursesTableDesktop from "./CoursesTableDesktop";
import CoursesTableMobile from "./CoursesTableMobile";

type Props = {
  query: string;
  currentPage: number;
  courses:CourseModel[];
};

export type CourseSortKey = "name" | "status";

function sortValue(course: CourseModel, key: CourseSortKey) {
  switch (key) {
    case "status":
      return course.status;
    default:
      return course.name;
  }
}

export default function CoursesTable({ query, currentPage,courses}: Props) {

  const [sortKey, setSortKey] = useState<CourseSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: CourseSortKey) => {
    const next = nextSort(sortKey, sortDirection, key);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  const visibleCourses = useMemo(() => {
    const filtered = (courses ?? []).filter((course) =>
      matchesQuery(query, course.name, course.language?.name)
    );
    return sortItems(filtered, (course) => sortValue(course, sortKey), sortDirection);
  }, [courses, query, sortKey, sortDirection]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Desktop */}
          <div className="hidden md:block">
            <CoursesTableDesktop
              courses={visibleCourses}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <CoursesTableMobile
              courses={visibleCourses}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
