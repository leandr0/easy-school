import Search from '@/app/ui/search';
import {  CreateCourseClass } from '@/app/dashboard/components/ui_buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

import { Metadata } from 'next';
import CoursesClassTable from './components/CourseClassesTable';

import { getAllCourseClass } from "@/bff/services/courseClass.server"; 
 
export const metadata: Metadata = {
  title: 'Turmas',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const courseClasses = await getAllCourseClass();

  const totalPages = 1;
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Turmas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar turmas..." />
        <CreateCourseClass/>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <CoursesClassTable query={query} currentPage={currentPage} courseClasses={courseClasses}/>
      </Suspense>
    </div>
  );
}