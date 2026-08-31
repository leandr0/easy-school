"use client";

import React, { useMemo, useState } from "react";

import { BookModel } from "@/app/lib/definitions/books_definitions";
import { matchesQuery, sortItems, nextSort, SortDirection } from "@/app/dashboard/components/tableUtils";

import BooksTableDesktop from "./BooksTableDesktop";
import BooksTableMobile from "./BooksTableMobile";

type Props = {
  query: string;
  currentPage: number;
  books: BookModel[];
};

export type BookSortKey = "name" | "chapters" | "status";

function sortValue(book: BookModel, key: BookSortKey) {
  switch (key) {
    case "chapters":
      return book.chapters?.length ?? 0;
    case "status":
      return book.status;
    default:
      return book.name;
  }
}

export default function BooksTable({ query, currentPage, books }: Props) {

  const [sortKey, setSortKey] = useState<BookSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: BookSortKey) => {
    const next = nextSort(sortKey, sortDirection, key);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  const visibleBooks = useMemo(() => {
    const filtered = (books ?? []).filter((book) => matchesQuery(query, book.name));
    return sortItems(filtered, (book) => sortValue(book, sortKey), sortDirection);
  }, [books, query, sortKey, sortDirection]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Desktop */}
          <div className="hidden md:block">
            <BooksTableDesktop
              books={visibleBooks}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <BooksTableMobile
              books={visibleBooks}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
