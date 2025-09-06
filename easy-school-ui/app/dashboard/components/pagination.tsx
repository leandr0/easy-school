import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Reusable, responsive Pagination component for tables and lists.
 */

const DOTS = "DOTS" as const;

type UsePaginationArgs = {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
};

type PaginationRange = Array<number | typeof DOTS>;

function usePagination({ totalCount, pageSize, siblingCount = 1, currentPage }: UsePaginationArgs): PaginationRange {
  const totalPageCount = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
  const totalPageNumbers = siblingCount * 2 + 5;
  if (totalPageNumbers >= totalPageCount) {
    return [...Array(totalPageCount)].map((_, i) => i + 1);
  }
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;
  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPageCount];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
    return [firstPageIndex, DOTS, ...rightRange];
  }
  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
}

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

export type PaginationProps = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  siblingCount?: number;
  className?: string;
  labels?: {
    previous?: string;
    next?: string;
    of?: string;
    perPage?: string;
    page?: string;
    goTo?: string;
  };
};

export const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  siblingCount = 1,
  className,
  labels = { previous: "Previous", next: "Next", of: "of", perPage: "por página", page: "Page", goTo: "Go to" },
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
  const paginationRange = usePagination({ totalCount, pageSize, siblingCount, currentPage });
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const goTo = (p: number) => onPageChange(Math.min(Math.max(p, 1), totalPages));

  return (
    <nav className={"flex w-full items-center justify-between gap-3 " + (className ?? "")} role="navigation" aria-label="Pagination">
      <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="whitespace-nowrap">
              {labels?.perPage ?? 'Por página'}:
            </label>
            <select
              id="page-size"
              className="rounded-md border bg-background px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
        <span>
          {labels?.page ?? 'Page'} {currentPage} {labels?.of ?? 'of'} {totalPages} ({totalCount} items)
        </span>
      </div>

      {/* Compact Mobile */}
      <div className="flex flex-1 items-center justify-center sm:hidden">
        <ButtonIcon aria-label={labels?.previous ?? 'Previous'} disabled={!canGoPrev} onClick={() => canGoPrev && goTo(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </ButtonIcon>
        <span className="text-sm">
          {labels?.page ?? 'Page'} {currentPage} {labels?.of ?? 'of'} {totalPages}
        </span>
        <ButtonIcon aria-label={labels?.next ?? 'Next'} disabled={!canGoNext} onClick={() => canGoNext && goTo(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </ButtonIcon>
      </div>

      {/* Desktop pager */}
      <ul className="hidden sm:flex select-none items-center gap-1">
        <li>
          <ButtonIcon aria-label={labels?.previous ?? 'Previous'} disabled={!canGoPrev} onClick={() => canGoPrev && goTo(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </ButtonIcon>
        </li>
        {paginationRange.map((item, idx) => {
          if (item === DOTS) {
            return (
              <li key={`dots-${idx}`} className="px-2 py-1 text-sm text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </li>
            );
          }
          const pageNumber = item as number;
          const isActive = pageNumber === currentPage;
          return (
            <li key={pageNumber}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                className={
                  "min-w-9 rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 " +
                  (isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent hover:text-accent-foreground")
                }
                onClick={() => goTo(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li>
          <ButtonIcon aria-label={labels?.next ?? 'Next'} disabled={!canGoNext} onClick={() => canGoNext && goTo(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </ButtonIcon>
        </li>
      </ul>
    </nav>
  );
};

const ButtonIcon: React.FC<React.ComponentPropsWithoutRef<"button">> = ({ className, children, ...rest }) => (
  <button
    type="button"
    className={
      "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 " +
      (className ?? "")
    }
    {...rest}
  >
    {children}
  </button>
);
