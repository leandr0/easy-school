import Search from '@/app/ui/search';
import { CreateCourse } from '@/app/dashboard/components/ui_buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { getAllCourses } from "@/bff/services/course.server";

import CoursesTable from '@/app/dashboard/courses/components/CoursesTable';

import { Metadata } from 'next';
import { Can, CanProvider } from '@/components/Can';
import { getAbility } from '@/lib/authz/session';

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
  const courses = await getAllCourses();
  const ability = await getAbility();

  return (
    <CanProvider perms={ability?.list ?? []}>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Cursos</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Buscar cursos..." />
          <Can perm="admin.all">
            <CreateCourse />
          </Can>
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <CoursesTable query={query} currentPage={currentPage} courses={courses} />
        </Suspense>
      </div>
    </CanProvider>
  );
}