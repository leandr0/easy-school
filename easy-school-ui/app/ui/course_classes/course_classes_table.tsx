"use client"

import {AddStudents, DeleteSolicitacao, UpdateCourseClass, UpdateSolicitacao } from '../buttons/ui_buttons';
import CourseStatus from './course_classes_status';
import React, { useEffect, useState } from "react";
import { CourseClassModel, CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';
import { getAllCourseClass } from '@/app/lib/actions/course_class_actions';

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
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nome
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Professor
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {course_classes?.map((course_class) => (
                <tr
                  key={course_class.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{course_class.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  <CourseStatus status={course_class.status ? "Ativo" : "Inativo" } />                    
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{course_class.teacher?.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <AddStudents id_course_class={course_class.id as string} disabled={!!!course_class.status} />
                      <UpdateCourseClass id={course_class.id as string} disabled={false} />
                      <DeleteSolicitacao id={course_class.id as string} disabled={false} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
