"use client";

import React, { useEffect, useState } from "react";
import { getAllCourses } from "@/bff/services/course.server";

import { CourseModel } from "@/app/lib/definitions/courses_definitions";

import CoursesTableDesktop from "./CoursesTableDesktop";
import CoursesTableMobile from "./CoursesTableMobile";

type Props = {
  query: string;
  currentPage: number;
};

export default function CoursesTable({ query, currentPage }: Props) {
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getAllCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, currentPage]); // keep dependencies explicit if you later wire server-side filters



  if (loading) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
        Carregando cursos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Desktop */}
          <div className="hidden md:block">
            <CoursesTableDesktop
              courses={courses}
            />
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <CoursesTableMobile
              courses={courses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
