"use client"
import Image from 'next/image';
import { AddPropriedade, DeleteSolicitacao, UpdateSolicitacao } from '../buttons/ui_buttons';
import CourseStatus from './classes_status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSolicitacoes } from '@/app/lib/data/solicitacao';
import React, { useEffect, useState } from "react";

import { getAllCourses } from '@/app/lib/actions/course_actions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';

export default async function CoursesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCourses()
      .then(setCourses)
      .catch((err) => setError(err.message));
  }, []);


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {courses?.map((course) => (

              <div key={course.id} className="mb-2 w-full rounded-md bg-white p-4">

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{course.name}</p>
                    </div>
                  </div>
                  <CourseStatus status={course.status ? "Ativo" : "Inativo"} />  
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
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {courses?.map((course) => (
                <tr
                  key={course.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{course.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  <CourseStatus status={course.status ? "Ativo" : "Inativo" } />                    
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <AddPropriedade idSolicitacao={course.id as string} disabled={false} />
                      <UpdateSolicitacao id={course.id as string} disabled={false} />
                      <DeleteSolicitacao id={course.id as string} disabled={false} />
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
