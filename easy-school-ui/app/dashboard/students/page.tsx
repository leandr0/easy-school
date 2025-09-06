import Search from '@/app/ui/search';
import { CreateStudent } from '@/app/dashboard/components/ui_buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import StudentsTable from './components/StudentsTable';

import { Metadata } from 'next';
import { getAllStudents } from '@/bff/services/student.server';
 
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
  const students = await getAllStudents();
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Alunos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar alunos..." />
        <CreateStudent />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <StudentsTable query={query} currentPage={currentPage} students={students}/>
      </Suspense>
    </div>
  );
}