import CreateBookForm from "@/app/dashboard/books/components/CreateBookForm";
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import { createBook } from "@/bff/services/book.server";

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Livros', href: '/dashboard/books' },
          {
            label: 'Cadastrar Livro',
            href: '/dashboard/books/create',
            active: true,
          },
        ]}
      />
      <CreateBookForm onSave={createBook} />
    </main>
  );
}
