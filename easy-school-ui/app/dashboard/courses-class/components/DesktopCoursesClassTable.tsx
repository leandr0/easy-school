"use client"

import { AddStudents, UpdateCourseClass } from '../../components/ui_buttons';
import CourseStatus from './CourseClassesStatus';
import React from "react";
import { CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';

import Image from 'next/image';

interface DesktopCoursesClassTableProps {
  courseClasses: CourseClassTeacherModel[];
}

export default function DesktopCoursesClassTable({
  courseClasses
}: DesktopCoursesClassTableProps) {


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2">
          {/* Table Header */}
          <div className="grid grid-cols-6 text-left text-sm font-normal rounded-lg bg-gray-100 shadow-sm">
            <div className="px-4 py-4 font-semibold sm:pl-6 border-b col-span-2 text-gray-700">
              Nome da Turma
            </div>
            <div className="px-3 py-4 font-semibold border-b col-span-1 text-center text-gray-700">
              Status
            </div>
            <div className="px-3 py-4 font-semibold border-b col-span-2 text-gray-700">
              Professor Responsável
            </div>
            <div className="px-3 py-4 font-semibold border-b col-span-1 text-center text-gray-700">
              Ações
            </div>
          </div>

          {/* Table Body */}
          <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
            {courseClasses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>

                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma turma encontrada</h3>
                </div>
              </div>
            ) : (
              courseClasses.map((course_class, index) => (
                <div
                  key={course_class.id}
                  className={`grid grid-cols-6 w-full border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors ${index === courseClasses.length - 1 ? 'border-b-0' : ''
                    }`}>

                  <div className="py-4 pl-6 pr-3 col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={course_class.course.language?.image_url!}
                          alt={`${course_class.course.language?.name}'s profile picture`}
                          className="mr-4 rounded-full"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate">{course_class.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-4 col-span-1 flex justify-center items-center">
                    <CourseStatus status={course_class.status ? "Ativo" : "Inativo"} />
                  </div>

                  <div className="px-3 py-4 col-span-2 flex items-center">
                    <div>
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {course_class.teacher?.name || 'Não atribuído'}
                      </p>
                      {course_class.teacher?.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {course_class.teacher.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="py-4 pr-3 col-span-1 flex justify-center items-center">
                    <div className="flex gap-2">
                      <AddStudents
                        id_course_class={course_class.id as string}
                        disabled={!course_class.status}
                      />
                      <UpdateCourseClass
                        id={course_class.id as string}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}