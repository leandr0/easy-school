"use client";

import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import TeacherTableMobile from './TeacherTableMobile';
import TeacherTableDesktop from "./TeacherTableDesktop";
import { bffApiClient } from "@/app/config/clientAPI";
import React, { useMemo, useState } from "react";
import { matchesQuery, sortItems, nextSort, SortDirection } from "@/app/dashboard/components/tableUtils";


const clientApi = bffApiClient.resource('/teachers');

export type TeacherSortKey = "name" | "status";

function sortValue(teacher: TeacherModel, key: TeacherSortKey) {
  switch (key) {
    case "status":
      return teacher.status;
    default:
      return teacher.name;
  }
}

export default function TeacherTable({
  query,
  currentPage,
  teachers,
}: {
  query: string;
  currentPage: number;
  teachers:TeacherModel[];
}) {

  const [sortKey, setSortKey] = useState<TeacherSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: TeacherSortKey) => {
    const next = nextSort(sortKey, sortDirection, key);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  const visibleTeachers = useMemo(() => {
    const filtered = (teachers ?? []).filter((teacher) =>
      matchesQuery(query, teacher.name, teacher.email, teacher.phone_number)
    );
    return sortItems(filtered, (teacher) => sortValue(teacher, sortKey), sortDirection);
  }, [teachers, query, sortKey, sortDirection]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {/* Mobile View */}
        <div className="md:hidden">
          <TeacherTableMobile
            teachers={visibleTeachers}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <TeacherTableDesktop
            teachers={visibleTeachers}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
}
