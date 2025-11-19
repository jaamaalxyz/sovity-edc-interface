/**
 * Tests for usePaginatedData hook
 */

import { act, renderHook } from "@testing-library/react";

import { usePaginatedData } from "@/hooks/usePaginatedData";

interface TestItem {
  id: number;
  name: string;
}

describe("usePaginatedData", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createTestData = (count: number): TestItem[] =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

  const defaultFilterFn = (item: TestItem, query: string) =>
    item.name.toLowerCase().includes(query.toLowerCase());

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.searchQuery).toBe("");
      expect(result.current.debouncedSearchQuery).toBe("");
      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalItems).toBe(25);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.paginatedData).toHaveLength(25); // Server-side pagination returns all
      expect(result.current.filteredData).toHaveLength(25);
    });

    it("should initialize with custom page size", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 5,
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.pageSize).toBe(5);
      expect(result.current.totalPages).toBe(5);
    });

    it("should handle empty data", () => {
      const { result } = renderHook(() =>
        usePaginatedData([], {
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(0);
    });
  });

  describe("search functionality", () => {
    it("should update search query", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      expect(result.current.searchQuery).toBe("Item 1");
      // Debounced value should still be empty
      expect(result.current.debouncedSearchQuery).toBe("");
    });

    it("should debounce search query", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          debounceDelay: 300,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      expect(result.current.debouncedSearchQuery).toBe("");

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.debouncedSearchQuery).toBe("Item 1");
    });

    it("should filter data based on search query", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should match: Item 1, Item 10, Item 11, ..., Item 19
      expect(result.current.filteredData.length).toBeGreaterThan(0);
      expect(
        result.current.filteredData.every((item) =>
          item.name.includes("Item 1")
        )
      ).toBe(true);
    });

    it("should reset to page 1 when search query changes", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      // Go to page 2
      act(() => {
        result.current.handlePageChange(2);
      });
      expect(result.current.currentPage).toBe(2);

      // Search should reset to page 1
      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("should handle custom debounce delay", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          debounceDelay: 500,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(result.current.debouncedSearchQuery).toBe("");

      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.debouncedSearchQuery).toBe("Item 1");
    });
  });

  describe("pagination without search", () => {
    it("should return all data for server-side pagination", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      // Without search, should return all data (server handles pagination)
      expect(result.current.paginatedData).toHaveLength(25);
      expect(result.current.paginatedData).toEqual(data);
    });

    it("should calculate correct fetch params for server-side pagination", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.fetchLimit).toBe(10);
      expect(result.current.fetchOffset).toBe(0);

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.fetchLimit).toBe(10);
      expect(result.current.fetchOffset).toBe(10);

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(result.current.fetchLimit).toBe(10);
      expect(result.current.fetchOffset).toBe(20);
    });
  });

  describe("pagination with search", () => {
    it("should paginate filtered results client-side", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 5,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // First page of search results
      expect(result.current.paginatedData.length).toBeLessThanOrEqual(5);
      expect(
        result.current.paginatedData.every((item) =>
          item.name.includes("Item 1")
        )
      ).toBe(true);
    });

    it("should fetch all data when searching", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // When searching, fetch more data
      expect(result.current.fetchLimit).toBe(1000);
      expect(result.current.fetchOffset).toBe(0);
    });

    it("should navigate between pages of search results", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 5,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const firstPageResults = [...result.current.paginatedData];

      act(() => {
        result.current.handlePageChange(2);
      });

      const secondPageResults = [...result.current.paginatedData];

      // Different results on different pages
      expect(firstPageResults).not.toEqual(secondPageResults);
    });
  });

  describe("page range calculation", () => {
    it("should show all pages when total pages <= 5", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.pageRange).toEqual([1, 2, 3]);
    });

    it("should show range with ellipsis for many pages", () => {
      const data = createTestData(100);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.pageRange).toEqual([1, 2, 3, -1, 10]);
    });

    it("should update page range when page changes", () => {
      const data = createTestData(100);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.handlePageChange(5);
      });

      expect(result.current.pageRange).toEqual([1, -1, 3, 4, 5, 6, 7, -1, 10]);
    });
  });

  describe("custom filter function", () => {
    it("should use custom filter function", () => {
      const data = createTestData(25);
      const customFilter = (item: TestItem, query: string) =>
        item.id.toString() === query;

      const { result } = renderHook(() =>
        usePaginatedData(data, {
          filterFn: customFilter,
        })
      );

      act(() => {
        result.current.setSearchQuery("5");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].id).toBe(5);
    });

    it("should handle case-insensitive filtering", () => {
      const data: TestItem[] = [
        { id: 1, name: "Apple" },
        { id: 2, name: "banana" },
        { id: 3, name: "CHERRY" },
      ];

      const caseInsensitiveFilter = (item: TestItem, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase());

      const { result } = renderHook(() =>
        usePaginatedData(data, {
          filterFn: caseInsensitiveFilter,
        })
      );

      act(() => {
        result.current.setSearchQuery("a");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.filteredData).toHaveLength(2); // Apple and banana
    });
  });

  describe("data updates", () => {
    it("should update when data prop changes", () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePaginatedData(data, { filterFn: defaultFilterFn }),
        { initialProps: { data: createTestData(25) } }
      );

      expect(result.current.totalItems).toBe(25);

      rerender({ data: createTestData(50) });

      expect(result.current.totalItems).toBe(50);
    });

    it("should maintain search when data updates", () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePaginatedData(data, { filterFn: defaultFilterFn }),
        { initialProps: { data: createTestData(25) } }
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const searchQuery = result.current.searchQuery;

      rerender({ data: createTestData(50) });

      expect(result.current.searchQuery).toBe(searchQuery);
    });
  });

  describe("edge cases", () => {
    it("should handle no matches found", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("NoMatch");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.filteredData).toHaveLength(0);
      expect(result.current.paginatedData).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPages).toBe(1);
    });

    it("should handle single page of results", () => {
      const data = createTestData(5);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          pageSize: 10,
          filterFn: defaultFilterFn,
        })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(5);
    });

    it("should handle clearing search", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePaginatedData(data, {
          filterFn: defaultFilterFn,
        })
      );

      act(() => {
        result.current.setSearchQuery("Item 1");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const filteredLength = result.current.filteredData.length;
      expect(filteredLength).toBeLessThan(25);

      act(() => {
        result.current.setSearchQuery("");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.filteredData).toHaveLength(25);
    });
  });
});
