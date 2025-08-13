"use client"

import React, { useEffect, useState } from "react";
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { getAllTeachers } from '@/app/services/teacherService';
import TeacherTableMobile from './TeacherTableMobile';
import TeacherTableDesktop from "./TeacherTableDesktop";

export default function TeacherTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [teachers, setTeachers] = useState<TeacherModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAllTeachers()
      .then(setTeachers)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {/* Mobile View */}
        <div className="md:hidden">
          <TeacherTableMobile 
            teachers={teachers}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <TeacherTableDesktop 
            teachers={teachers}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}