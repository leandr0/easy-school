"use client";

import React, { useEffect, useMemo, useState } from "react";
import CourseStatus from "./CourseStatus";
import { UpdateBase } from "../../components/ui_buttons";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";
import Image from 'next/image';
import { Pagination } from "@/app/dashboard/components/Pagination";

type Props = {
  courses: CourseModel[];
};

export default function CoursesTableMobile({ courses }: Props) {


  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(3);

  // clamp current page if revenues length changes
  const totalCount = courses?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!courses?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return courses.slice(start, end);
  }, [courses, page, pageSize]);

  return (
    <div className="md:hidden">
      {currentItems?.map((course) => (
        <div key={course.id} className="mb-2 w-full rounded-md bg-white p-4">
          <div className="flex items-center justify-between border-b pb-3">
            <Image
              src={course.language?.image_url!}
              alt={`${course.language?.name}'s profile picture`}
              className="mr-4 rounded-full"
              width={25}
              height={25}
            />
            <p className="font-medium">{course.name}</p>
            <CourseStatus status={course.status ? "Ativo" : "Inativo"} />
          </div>

          <div className="mt-3 flex justify-end">
            <UpdateBase
              id={String(course.id)}
              link={`/dashboard/courses/${course.id}/edit`}
              disabled={false}
            />
          </div>
        </div>
      ))}
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[3, 5, 10]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}
