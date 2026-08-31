"use client";

import React, { useEffect, useMemo, useState } from "react";
import BookStatus from "./BookStatus";
import { UpdateBase } from "@/app/dashboard/components/ui_buttons";
import { BookModel } from "@/app/lib/definitions/books_definitions";
import { Pagination } from "@/app/dashboard/components/Pagination";
import { Can } from "@/components/Can";
import MobileSortBar from "@/app/dashboard/components/MobileSortBar";
import type { SortDirection } from "@/app/dashboard/components/tableUtils";
import type { BookSortKey } from "./BooksTable";

type Props = {
  books: BookModel[];
  sortKey: BookSortKey;
  sortDirection: SortDirection;
  onSort: (key: BookSortKey) => void;
};

const SORT_OPTIONS: { value: BookSortKey; label: string }[] = [
  { value: "name", label: "Nome" },
  { value: "chapters", label: "Capítulos" },
  { value: "status", label: "Status" },
];

export default function BooksTableMobile({ books, sortKey, sortDirection, onSort }: Props) {

  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(3);

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
    <div className="md:hidden">
      <MobileSortBar
        options={SORT_OPTIONS}
        sortKey={sortKey}
        direction={sortDirection}
        onSortKeyChange={onSort}
        onDirectionToggle={() => onSort(sortKey)}
      />
      {currentItems?.map((book) => (
        <div key={book.id} className="mb-2 w-full rounded-md bg-white p-4">
          <div className="flex items-center justify-between border-b pb-3">
            <p className="font-medium">{book.name}</p>
            <BookStatus status={book.status ? "Ativo" : "Inativo"} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {book.chapters?.length ?? 0} capítulo(s)
            </span>
            <Can perm="admin.all">
              <UpdateBase
                id={String(book.id)}
                link={`/dashboard/books/${book.id}/edit`}
                disabled={false}
              />
            </Can>
          </div>
        </div>
      ))}
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[3, 5, 10]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}
