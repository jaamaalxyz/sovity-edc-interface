/**
 * usePagination Hook
 * Manages pagination state and provides helper functions
 */

import { useMemo, useState } from "react";

export interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  // Current page data
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  // Paginated data
  paginatedData: T[];

  // Navigation methods
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;

  // State checks
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;

  // Page range for UI
  pageRange: number[];
}

/**
 * Hook to manage client-side pagination
 * @param data - Array of data to paginate
 * @param options - Pagination options
 * @returns Pagination state and methods
 *
 * @example
 * const { paginatedData, currentPage, totalPages, nextPage, prevPage } =
 *   usePagination(allAssets, { pageSize: 10 });
 */
export function usePagination<T>(
  data: T[],
  options: PaginationOptions = {}
): PaginationResult<T> {
  const { initialPage = 1, pageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate pagination values
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is within bounds
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, safePage, pageSize]);

  // Navigation methods
  const goToPage = (page: number) => {
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(newPage);
  };

  const nextPage = () => goToPage(safePage + 1);
  const prevPage = () => goToPage(safePage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  // State checks
  const hasNextPage = safePage < totalPages;
  const hasPrevPage = safePage > 1;
  const isFirstPage = safePage === 1;
  const isLastPage = safePage === totalPages;

  // Calculate page range for UI (show 5 pages max)
  const pageRange = useMemo(() => {
    const delta = 2; // Pages to show on each side of current
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, safePage - delta);
      i <= Math.min(totalPages - 1, safePage + delta);
      i++
    ) {
      range.push(i);
    }

    if (safePage - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents '...'
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (safePage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [safePage, totalPages]);

  return {
    currentPage: safePage,
    pageSize,
    totalItems,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
    pageRange,
  };
}
