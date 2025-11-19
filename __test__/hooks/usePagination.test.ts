/**
 * Tests for usePagination hook
 */

import { act, renderHook } from "@testing-library/react";

import { usePagination } from "@/hooks/usePagination";

describe("usePagination", () => {
  const createTestData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const data = createTestData(25);
      const { result } = renderHook(() => usePagination(data));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalItems).toBe(25);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(false);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPrevPage).toBe(false);
    });

    it("should initialize with custom page size", () => {
      const data = createTestData(25);
      const { result } = renderHook(() => usePagination(data, { pageSize: 5 }));

      expect(result.current.pageSize).toBe(5);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.paginatedData).toHaveLength(5);
    });

    it("should initialize with custom initial page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 2, pageSize: 10 })
      );

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedData[0]).toEqual({
        id: 11,
        name: "Item 11",
      });
    });

    it("should handle empty data array", () => {
      const { result } = renderHook(() => usePagination([]));

      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(0);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
    });

    it("should handle data with length less than page size", () => {
      const data = createTestData(5);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(5);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
    });
  });

  describe("pagination data", () => {
    it("should return correct data for first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0]).toEqual({
        id: 1,
        name: "Item 1",
      });
      expect(result.current.paginatedData[9]).toEqual({
        id: 10,
        name: "Item 10",
      });
    });

    it("should return correct data for middle page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0]).toEqual({
        id: 11,
        name: "Item 11",
      });
      expect(result.current.paginatedData[9]).toEqual({
        id: 20,
        name: "Item 20",
      });
    });

    it("should return correct data for last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.paginatedData).toHaveLength(5);
      expect(result.current.paginatedData[0]).toEqual({
        id: 21,
        name: "Item 21",
      });
      expect(result.current.paginatedData[4]).toEqual({
        id: 25,
        name: "Item 25",
      });
    });
  });

  describe("navigation methods", () => {
    it("should navigate to next page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("should navigate to previous page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 2, pageSize: 10 })
      );

      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.prevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("should navigate to first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, pageSize: 10 })
      );

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.goToFirstPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("should navigate to last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.currentPage).toBe(3);
    });

    it("should navigate to specific page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("should not go below page 1", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      act(() => {
        result.current.prevPage();
        result.current.prevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("should not go beyond last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, pageSize: 10 })
      );

      act(() => {
        result.current.nextPage();
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(3);
    });

    it("should clamp goToPage to valid range", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      act(() => {
        result.current.goToPage(100);
      });
      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.goToPage(-5);
      });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("state checks", () => {
    it("should correctly identify first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.hasPrevPage).toBe(false);
    });

    it("should correctly identify middle page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 2, pageSize: 10 })
      );

      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(false);
      expect(result.current.hasPrevPage).toBe(true);
      expect(result.current.hasNextPage).toBe(true);
    });

    it("should correctly identify last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, pageSize: 10 })
      );

      expect(result.current.isLastPage).toBe(true);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe("page range", () => {
    it("should show all pages when total pages <= 5", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.pageRange).toEqual([1, 2, 3]);
    });

    it("should show range with ellipsis for many pages on first page", () => {
      const data = createTestData(100);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      // Expected: [1, 2, 3, -1, 10] where -1 represents '...'
      expect(result.current.pageRange).toEqual([1, 2, 3, -1, 10]);
    });

    it("should show range with ellipsis for many pages on last page", () => {
      const data = createTestData(100);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 10, pageSize: 10 })
      );

      // Expected: [1, -1, 8, 9, 10] where -1 represents '...'
      expect(result.current.pageRange).toEqual([1, -1, 8, 9, 10]);
    });

    it("should show range with ellipsis on both sides for middle page", () => {
      const data = createTestData(100);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 5, pageSize: 10 })
      );

      // Expected: [1, -1, 3, 4, 5, 6, 7, -1, 10]
      expect(result.current.pageRange).toEqual([1, -1, 3, 4, 5, 6, 7, -1, 10]);
    });
  });

  describe("data changes", () => {
    it("should update when data changes", () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, { pageSize: 10 }),
        { initialProps: { data: createTestData(25) } }
      );

      expect(result.current.totalItems).toBe(25);
      expect(result.current.totalPages).toBe(3);

      rerender({ data: createTestData(50) });

      expect(result.current.totalItems).toBe(50);
      expect(result.current.totalPages).toBe(5);
    });

    it("should adjust current page when data shrinks", () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, { pageSize: 10 }),
        { initialProps: { data: createTestData(50) } }
      );

      act(() => {
        result.current.goToPage(5);
      });
      expect(result.current.currentPage).toBe(5);

      rerender({ data: createTestData(15) });

      // Should clamp to page 2 (last valid page)
      expect(result.current.currentPage).toBe(2);
    });

    it("should reset to page 1 when data becomes empty", () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, { pageSize: 10 }),
        { initialProps: { data: createTestData(25) } }
      );

      act(() => {
        result.current.goToPage(3);
      });

      rerender({ data: [] });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle single item", () => {
      const data = createTestData(1);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(1);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
    });

    it("should handle exact multiple of page size", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 10 })
      );

      expect(result.current.totalPages).toBe(3);

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.paginatedData).toHaveLength(10);
    });

    it("should handle page size of 1", () => {
      const data = createTestData(5);
      const { result } = renderHook(() => usePagination(data, { pageSize: 1 }));

      expect(result.current.totalPages).toBe(5);
      expect(result.current.paginatedData).toHaveLength(1);
      expect(result.current.paginatedData[0]).toEqual({
        id: 1,
        name: "Item 1",
      });
    });

    it("should handle page size larger than data", () => {
      const data = createTestData(5);
      const { result } = renderHook(() =>
        usePagination(data, { pageSize: 100 })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(5);
    });
  });
});
