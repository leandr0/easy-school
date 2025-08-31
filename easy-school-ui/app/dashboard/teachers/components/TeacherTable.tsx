"use client"

import React, { useEffect, useState } from "react";
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import TeacherTableMobile from './TeacherTableMobile';
import TeacherTableDesktop from "./TeacherTableDesktop";
import { bffApiClient } from "@/app/config/clientAPI";
import { getAllTeachers } from "@/bff/services/teacher.server";


const clientApi = bffApiClient.resource('/teachers');

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
    const ctrl = new AbortController();
    setIsLoading(true);

    const fetchTeacherData = async () => {

      const data = await getAllTeachers();
      setTeachers(data);
    }

    fetchTeacherData();

    setIsLoading(false);
    return () => ctrl.abort();

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