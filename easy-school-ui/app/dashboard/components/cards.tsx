'use client';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { DashBoardTotalCardsModel } from '@/app/lib/definitions/dashboard_definition';

import { useState, useEffect } from 'react';

import { getTeacherCourseClassLanguageStudent } from '@/bff/services/dashboard.server';

const iconMap = {
  teacher: AcademicCapIcon,
  student: UserGroupIcon,
  course_class: BookOpenIcon,
  language: LanguageIcon,
};

export default function CardWrapper() {
  const [totalNumber, setTotalNumber] = useState<DashBoardTotalCardsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching dashboard data...');
        const data = await getTeacherCourseClassLanguageStudent();
        console.log('Dashboard data received:', data);
        
        setTotalNumber(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Error loading cards</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!totalNumber) {
    return (
      <div className="col-span-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">No data available</p>
      </div>
    );
  }

  return (
    <>
      <Card title="Professores" value={totalNumber.total_teacher || 0} type="teacher" />
      <Card title="Cursos" value={totalNumber.total_course_class || 0} type="course_class" />
      <Card title="Idiomas" value={totalNumber.total_language || 0} type="language" />
      <Card title="Alunos" value={totalNumber.total_student || 0} type="student" />
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl bg-gray-100 p-2 shadow-sm animate-pulse">
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'language' | 'teacher' | 'course_class' | 'student';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}