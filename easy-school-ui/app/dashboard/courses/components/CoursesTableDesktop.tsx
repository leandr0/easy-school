"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UpdateBase } from "../../components/ui_buttons";
import CourseStatus from "./CourseStatus";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";
import Image from 'next/image';
import { Pagination } from "../../components/Pagination";
type Props = {
  courses: CourseModel[];
};

export default function CoursesTableDesktop({ courses }: Props) {



  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(5);

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
    <div>
      <table className="min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              Nome
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              Status
            </th>
            <th scope="col" className="relative py-3 pl-6 pr-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {currentItems?.map((course) => (
            <tr
              key={course.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none
              [&:first-child>td:first-child]:rounded-tl-lg
              [&:first-child>td:last-child]:rounded-tr-lg
              [&:last-child>td:first-child]:rounded-bl-lg
              [&:last-child>td:last-child]:rounded-br-lg"
            >



              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={course.language?.image_url!}
                    alt={`${course.language?.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <p>{course.name}</p>
                </div>
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                <CourseStatus status={course.status ? "Ativo" : "Inativo"} />
              </td>

              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                  <UpdateBase
                    id={String(course.id)}
                    // fix: ensure proper template interpolation
                    link={`/dashboard/courses/${course.id}/edit`}
                    disabled={false}
                  />
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
          pageSizeOptions={[5, 10, 20, 50, 100]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>

  );
}
