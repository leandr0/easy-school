"use client"

import { AddStudents, UpdateCourseClass } from '../buttons/ui_buttons';
import CourseStatus from './course_classes_status';
import React, { useEffect, useState } from "react";
import { CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';
import { getAllCourseClass } from '@/app/services/courseClassService';

export default async function CoursesClassTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const [course_classes, setCourseClasses] = useState<CourseClassTeacherModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCourseClass()
      .then(setCourseClasses)
      .catch((err) => setError(err.message));
  }, []);


  return (
    <div className="mt-6 flow-root">

      <div className="inline-block min-w-full align-middle">

        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

          <div className="md:hidden">
            {course_classes?.map((course_class) => (

              <div key={course_class.id} className="mb-2 w-full rounded-md bg-white p-4">

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{course_class.name}</p>
                    </div>
                  </div>
                  <CourseStatus status={course_class.status ? "Ativo" : "Inativo"} />
                </div>
                <div>
                  <div className="mb-2 flex items-center">
                    <p>{course_class.teacher?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Desktop View */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="grid text-center grid-cols-6 text-left text-sm font-normal rounded-lg bg-gray-50 text-center">
              <div className="px-4 py-3 font-medium sm:pl-6 border-b col-span-2">
                Nome
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1">
                Status
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-2">
                Professor
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1">
                <span className="sr-only">Edit</span>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white text-center">
              {course_classes?.map((course_class) => (
                <div
                  key={course_class.id}
                  className="grid grid-cols-6 w-full border-b text-sm last-of-type:border-none">

                  <div className="py-3 pl-6 pr-3 col-span-2">
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm">{course_class.name}</p>
                    </div>
                  </div>

                  <div className="px-3 py-3 col-span-1">
                    <CourseStatus status={course_class.status ? "Ativo" : "Inativo"} />
                  </div>

                  <div className="px-3 py-3 col-span-2 ">
                    <p className="truncate text-xs md:text-sm">{course_class.teacher?.name}</p>
                  </div>

                  <div className="py-3 pr-3 col-span-1 flex justify-center">
                    <div className="flex justify-center">
                      <AddStudents id_course_class={course_class.id as string} disabled={!!!course_class.status} />
                      <UpdateCourseClass id={course_class.id as string} disabled={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
