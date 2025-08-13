"use client";

import React, { useEffect, useState } from "react";
import { CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';
import { getAllCourseClass } from '@/app/services/courseClassService';
import DesktopCoursesClassTable from './DesktopCoursesClassTable';
import MobileCoursesClassTable from "./MobileCoursesClassTable";

export default function CoursesClassTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [courseClasses, setCourseClasses] = useState<CourseClassTeacherModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllCourseClass()
      .then(data => {
        setCourseClasses(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);


const filteredCourses = React.useMemo(() => {
  const safeCourses = courseClasses ?? [];

  if (!query || query.trim() === '') return safeCourses;

  return safeCourses.filter(course =>
    course.name?.toLowerCase().includes(query.toLowerCase()) ||
    course.teacher?.name?.toLowerCase().includes(query.toLowerCase())
  );
}, [courseClasses, query]);



  if (loading) {
    return <div className="text-center p-8 text-gray-500">Carregando turmas...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Erro: {error}</div>;
  }

  console.log("courseClasses in parent:", courseClasses);

  return (
    <div className="mt-6 flow-root">

      <div className="inline-block min-w-full align-middle">

        <div className="rounded-lg p-2 md:pt-0">

          <div className="md:hidden">
            <MobileCoursesClassTable
              courseClasses={filteredCourses}/>
          </div>


          <div className="hidden md:block">
            <DesktopCoursesClassTable
              courseClasses={filteredCourses}/>
          </div>

        </div>
      </div>
    </div>
  );
}
