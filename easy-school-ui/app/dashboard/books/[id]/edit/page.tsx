import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import EditBookForm from "@/app/dashboard/books/components/EditBookForm";
import { createBook, findBook } from '@/bff/services/book.server';

export default async function Page({ params }: { params: { id: string } }) {

  const id = params.id;
  const book = await findBook(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Livros', href: '/dashboard/books' },
          {
            label: 'Editar Livro',
            href: `/dashboard/books/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditBookForm book={book} onSave={createBook} />
    </main>
  );
}
