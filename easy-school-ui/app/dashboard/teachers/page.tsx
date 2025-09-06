import Search from '@/app/ui/search';
import { CreateTeacher } from '@/app/dashboard/components/ui_buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import TeacherTable from '@/app/dashboard/teachers/components/TeacherTable';
import { getAllTeachers } from '@/bff/services/teacher.server';

export const metadata: Metadata = {
  title: 'Students',
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

  const totalPages = 1;

  const teachers = await getAllTeachers();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Professores</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar professores..." />
        <CreateTeacher />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <TeacherTable query={query} currentPage={currentPage} teachers={teachers} />
      </Suspense>
    </div>
  );
}