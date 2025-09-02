"use client";

import React, { useEffect, useState } from "react";
import { CourseClassTeacherModel } from '@/app/lib/definitions/course_class_definitions';
import DesktopCoursesClassTable from './DesktopCoursesClassTable';
import MobileCoursesClassTable from "./MobileCoursesClassTable";
import { getAllCourseClass } from "@/bff/services/courseClass.server"; 


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
      const ctrl = new AbortController();

      setLoading(true);
      const fetchTeacherData = async () => {
  
        const data = await getAllCourseClass();
        setCourseClasses(data);
      }
  
      
      fetchTeacherData();
  
      setLoading(false);
      return () => ctrl.abort();
  
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
