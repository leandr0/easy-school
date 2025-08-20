"use client";

import React from "react";
import CourseStatus from "./CourseStatus";
import { UpdateBase } from "../../components/ui_buttons";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";

type Props = {
  courses: CourseModel[];
};

export default function CoursesTableMobile({ courses }: Props) {
  return (
    <div className="md:hidden">
      {courses?.map((course) => (
        <div key={course.id} className="mb-2 w-full rounded-md bg-white p-4">
          <div className="flex items-center justify-between border-b pb-3">
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
    </div>
  );
}
