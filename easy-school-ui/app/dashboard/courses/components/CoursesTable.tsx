"use client";

import React, { useEffect, useState } from "react";


import { CourseModel } from "@/app/lib/definitions/courses_definitions";

import CoursesTableDesktop from "./CoursesTableDesktop";
import CoursesTableMobile from "./CoursesTableMobile";

type Props = {
  query: string;
  currentPage: number;
  courses:CourseModel[];
};

export default function CoursesTable({ query, currentPage,courses}: Props) {
  
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
