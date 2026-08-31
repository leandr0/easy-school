import Search from '@/app/ui/search';
import { CreateBook } from '@/app/dashboard/components/ui_buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import BooksTable from '@/app/dashboard/books/components/BooksTable';
import { getAllBooks } from '@/bff/services/book.server';
import { Can, CanProvider } from '@/components/Can';
import { getAbility } from '@/lib/authz/session';

export const metadata: Metadata = {
  title: 'Livros',
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

  const books = await getAllBooks();

  const ability = await getAbility();

  return (
    <CanProvider perms={ability?.list ?? []}>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Livros</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Can perm='admin.all'>
            <Search placeholder="Buscar livros..." />
            <CreateBook />
          </Can>
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <BooksTable query={query} currentPage={currentPage} books={books} />
        </Suspense>
      </div>
    </CanProvider>
  );
}
