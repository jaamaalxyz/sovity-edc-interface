/**
 * usePaginatedData Hook
 * Encapsulates pagination and search logic for server-side paginated data
 * Keeps components clean and presentational
 */

import { useMemo, useState } from "react";

import { useDebounce } from "./useDebounce";

export interface PaginatedDataOptions<T> {
  pageSize?: number;
  debounceDelay?: number;
  filterFn: (item: T, searchQuery: string) => boolean;
}

export interface PaginatedDataResult<T> {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageRange: number[];
  handlePageChange: (page: number) => void;

  // Data
  paginatedData: T[];
  filteredData: T[];

  // Server fetch params
  fetchLimit: number;
  fetchOffset: number;
}

/**
 * Hook for managing paginated data with search
 * Combines server-side pagination with client-side search filtering
 *
 * @param data - The data array from the server
 * @param options - Configuration options
 * @returns Pagination and search state and handlers
 *
 * @example
 * const assets = usePaginatedData(assetsFromServer, {
 *   pageSize: 9,
 *   filterFn: (asset, query) => asset['@id'].toLowerCase().includes(query.toLowerCase())
 * });
 */
export function usePaginatedData<T>(
  data: T[],
  options: PaginatedDataOptions<T>
): PaginatedDataResult<T> {
  const { pageSize = 10, debounceDelay = 300, filterFn } = options;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  // Pagination state - track page per search query
  const [pageForQuery, setPageForQuery] = useState({ query: "", page: 1 });

  // Derive current page - reset to 1 when search changes
  const currentPage =
    debouncedSearchQuery === pageForQuery.query ? pageForQuery.page : 1;

  // Calculate offset for server-side pagination
  const offset = (currentPage - 1) * pageSize;

  // When searching, fetch more data for client-side filtering
  // When not searching, use server-side pagination
  const fetchLimit = debouncedSearchQuery ? 1000 : pageSize;
  const fetchOffset = debouncedSearchQuery ? 0 : offset;

  // Client-side filtering for search
  const filteredData = useMemo(() => {
    if (!debouncedSearchQuery) return data;
    return data.filter((item) => filterFn(item, debouncedSearchQuery));
  }, [data, debouncedSearchQuery, filterFn]);

  // Client-side pagination for search results
  const paginatedData = useMemo(() => {
    if (!debouncedSearchQuery) {
      // Server-side pagination - return all data from server
      return data;
    }
    // Client-side pagination for search results
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [data, filteredData, currentPage, pageSize, debouncedSearchQuery]);

  // Calculate pagination metadata
  const totalItems = debouncedSearchQuery ? filteredData.length : data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Calculate page range for UI (smart pagination with dots)
  const pageRange = useMemo(() => {
    const delta = 2; // Pages to show on each side of current
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents '...'
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Page change handler
  const handlePageChange = (newPage: number) => {
    setPageForQuery({ query: debouncedSearchQuery, page: newPage });
  };

  return {
    // Search
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,

    // Pagination
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    pageRange,
    handlePageChange,

    // Data
    paginatedData,
    filteredData,

    // Server fetch params
    fetchLimit,
    fetchOffset,
  };
}
