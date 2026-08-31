"use client";

import React, { useEffect, useMemo, useState } from "react";
import BookStatus from "./BookStatus";
import { UpdateBase } from "../../components/ui_buttons";
import { BookModel } from "@/app/lib/definitions/books_definitions";
import { Pagination } from "../../components/Pagination";
import { Can } from "@/components/Can";
import SortToggle from "@/app/dashboard/components/SortToggle";
import type { SortDirection } from "@/app/dashboard/components/tableUtils";
import type { BookSortKey } from "./BooksTable";

type Props = {
  books: BookModel[];
  sortKey: BookSortKey;
  sortDirection: SortDirection;
  onSort: (key: BookSortKey) => void;
};

export default function BooksTableDesktop({ books, sortKey, sortDirection, onSort }: Props) {

  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(5);

  const totalCount = books?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!books?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return books.slice(start, end);
  }, [books, page, pageSize]);

  return (
    <div>
      <table className="min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              <SortToggle
                label="Nome"
                active={sortKey === "name"}
                direction={sortDirection}
                onClick={() => onSort("name")}
              />
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              <SortToggle
                label="Capítulos"
                active={sortKey === "chapters"}
                direction={sortDirection}
                onClick={() => onSort("chapters")}
              />
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              <SortToggle
                label="Status"
                active={sortKey === "status"}
                direction={sortDirection}
                onClick={() => onSort("status")}
              />
            </th>
            <th scope="col" className="relative py-3 pl-6 pr-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {currentItems?.map((book) => (
            <tr
              key={book.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none
              [&:first-child>td:first-child]:rounded-tl-lg
              [&:first-child>td:last-child]:rounded-tr-lg
              [&:last-child>td:first-child]:rounded-bl-lg
              [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <p>{book.name}</p>
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {book.chapters?.length ?? 0}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                <BookStatus status={book.status ? "Ativo" : "Inativo"} />
              </td>

              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                  <Can perm="admin.all">
                    <UpdateBase
                      id={String(book.id)}
                      link={`/dashboard/books/${book.id}/edit`}
                      disabled={false}
                    />
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[5, 10, 20]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>

  );
}
