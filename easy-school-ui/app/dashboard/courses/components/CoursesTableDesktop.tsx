"use client";

import React from "react";
import { UpdateBase } from "../../components/ui_buttons";
import CourseStatus from "./CourseStatus";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";

type Props = {
  courses: CourseModel[];
};

export default function CoursesTableDesktop({ courses }: Props) {
  return (
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
        {courses?.map((course) => (
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
  );
}
