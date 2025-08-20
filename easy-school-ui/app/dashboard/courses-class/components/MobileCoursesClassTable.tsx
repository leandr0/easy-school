"use client"

import { AddStudents, UpdateCourseClass } from '../../components/ui_buttons';
import CourseStatus from './CourseClassesStatus';
import React, { useEffect, useState } from "react";
import { CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';

interface MobileCoursesClassTableProps {
  courseClasses: CourseClassTeacherModel[];
}

export default function MobileCoursesClassTable({
  courseClasses,
}: MobileCoursesClassTableProps) {
  console.log(`Mobile ${courseClasses}`);


  return (
    <div className="mt-6">
      {courseClasses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma turma encontrada</h3>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {courseClasses.map((course_class) => (
            <div key={course_class.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Card Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {course_class.name!.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {course_class.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <CourseStatus status={course_class.status ? "Ativo" : "Inativo"} />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-4 py-3">
                <div className="space-y-3">
                  
                  {/* Teacher Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Professor</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-900">
                        {course_class.teacher?.name || 'Não atribuído'}
                      </p>
                      {course_class.teacher?.email && (
                        <p className="text-xs text-gray-500 mt-1">
                          {course_class.teacher.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {course_class.status ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ações disponíveis</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {course_class.status ? 'Todas' : 'Limitadas'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer - Action Buttons */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end space-x-2">
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
          ))}
        </div>
      )}
    </div>
  );
}