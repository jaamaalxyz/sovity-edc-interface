/**
 * Tests for useModalState hook
 */

import { act, renderHook } from "@testing-library/react";

import { useModalState } from "@/hooks/useModalState";

interface TestItem {
  id: string;
  name: string;
}

describe("useModalState", () => {
  it("should initialize with idle state", () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.state.type).toBe("idle");
    expect(result.current.state.selectedItem).toBeNull();
    expect(result.current.isCreateOpen).toBe(false);
    expect(result.current.isEditOpen).toBe(false);
    expect(result.current.isViewOpen).toBe(false);
    expect(result.current.isDeleteOpen).toBe(false);
    expect(result.current.selectedItem).toBeNull();
  });

  describe("openCreate", () => {
    it("should open create modal", () => {
      const { result } = renderHook(() => useModalState());

      act(() => {
        result.current.openCreate();
      });

      expect(result.current.state.type).toBe("create");
      expect(result.current.state.selectedItem).toBeNull();
      expect(result.current.isCreateOpen).toBe(true);
      expect(result.current.isEditOpen).toBe(false);
      expect(result.current.isViewOpen).toBe(false);
      expect(result.current.isDeleteOpen).toBe(false);
    });
  });

  describe("openEdit", () => {
    it("should open edit modal with selected item", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "1", name: "Test Item" };

      act(() => {
        result.current.openEdit(testItem);
      });

      expect(result.current.state.type).toBe("edit");
      expect(result.current.state.selectedItem).toBe(testItem);
      expect(result.current.isEditOpen).toBe(true);
      expect(result.current.selectedItem).toBe(testItem);
    });
  });

  describe("openView", () => {
    it("should open view modal with selected item", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "2", name: "View Item" };

      act(() => {
        result.current.openView(testItem);
      });

      expect(result.current.state.type).toBe("view");
      expect(result.current.state.selectedItem).toBe(testItem);
      expect(result.current.isViewOpen).toBe(true);
      expect(result.current.selectedItem).toBe(testItem);
    });
  });

  describe("openDelete", () => {
    it("should open delete modal with selected item", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "3", name: "Delete Item" };

      act(() => {
        result.current.openDelete(testItem);
      });

      expect(result.current.state.type).toBe("delete");
      expect(result.current.state.selectedItem).toBe(testItem);
      expect(result.current.isDeleteOpen).toBe(true);
      expect(result.current.selectedItem).toBe(testItem);
    });
  });

  describe("close", () => {
    it("should close create modal", () => {
      const { result } = renderHook(() => useModalState());

      act(() => {
        result.current.openCreate();
      });
      expect(result.current.isCreateOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.state.type).toBe("idle");
      expect(result.current.state.selectedItem).toBeNull();
      expect(result.current.isCreateOpen).toBe(false);
    });

    it("should close edit modal and clear selected item", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "1", name: "Test Item" };

      act(() => {
        result.current.openEdit(testItem);
      });
      expect(result.current.isEditOpen).toBe(true);
      expect(result.current.selectedItem).toBe(testItem);

      act(() => {
        result.current.close();
      });

      expect(result.current.state.type).toBe("idle");
      expect(result.current.state.selectedItem).toBeNull();
      expect(result.current.isEditOpen).toBe(false);
      expect(result.current.selectedItem).toBeNull();
    });

    it("should close view modal and clear selected item", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "2", name: "View Item" };

      act(() => {
        result.current.openView(testItem);
      });
      expect(result.current.isViewOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.state.type).toBe("idle");
      expect(result.current.selectedItem).toBeNull();
    });

    it("should close delete modal and clear selected item", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "3", name: "Delete Item" };

      act(() => {
        result.current.openDelete(testItem);
      });
      expect(result.current.isDeleteOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.state.type).toBe("idle");
      expect(result.current.selectedItem).toBeNull();
    });
  });

  describe("modal transitions", () => {
    it("should transition from create to edit", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "1", name: "Test Item" };

      act(() => {
        result.current.openCreate();
      });
      expect(result.current.isCreateOpen).toBe(true);

      act(() => {
        result.current.openEdit(testItem);
      });
      expect(result.current.isCreateOpen).toBe(false);
      expect(result.current.isEditOpen).toBe(true);
      expect(result.current.selectedItem).toBe(testItem);
    });

    it("should transition from view to delete", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const viewItem: TestItem = { id: "1", name: "View Item" };
      const deleteItem: TestItem = { id: "2", name: "Delete Item" };

      act(() => {
        result.current.openView(viewItem);
      });
      expect(result.current.isViewOpen).toBe(true);
      expect(result.current.selectedItem).toBe(viewItem);

      act(() => {
        result.current.openDelete(deleteItem);
      });
      expect(result.current.isViewOpen).toBe(false);
      expect(result.current.isDeleteOpen).toBe(true);
      expect(result.current.selectedItem).toBe(deleteItem);
    });

    it("should handle rapid state changes", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const item1: TestItem = { id: "1", name: "Item 1" };
      const item2: TestItem = { id: "2", name: "Item 2" };

      act(() => {
        result.current.openCreate();
        result.current.openView(item1);
        result.current.openEdit(item2);
      });

      // Should end up in edit state with item2
      expect(result.current.isEditOpen).toBe(true);
      expect(result.current.selectedItem).toBe(item2);
    });
  });

  describe("dispatch", () => {
    it("should allow dispatching actions directly", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "1", name: "Test Item" };

      act(() => {
        result.current.dispatch({ type: "OPEN_VIEW", payload: testItem });
      });

      expect(result.current.state.type).toBe("view");
      expect(result.current.selectedItem).toBe(testItem);

      act(() => {
        result.current.dispatch({ type: "CLOSE" });
      });

      expect(result.current.state.type).toBe("idle");
      expect(result.current.selectedItem).toBeNull();
    });
  });

  describe("type safety", () => {
    it("should work with different item types", () => {
      interface User {
        userId: number;
        username: string;
      }

      const { result } = renderHook(() => useModalState<User>());
      const user: User = { userId: 123, username: "testuser" };

      act(() => {
        result.current.openEdit(user);
      });

      expect(result.current.selectedItem?.userId).toBe(123);
      expect(result.current.selectedItem?.username).toBe("testuser");
    });

    it("should work with primitive types", () => {
      const { result } = renderHook(() => useModalState<string>());

      act(() => {
        result.current.openView("test-string");
      });

      expect(result.current.selectedItem).toBe("test-string");
    });

    it("should work without type parameter", () => {
      const { result } = renderHook(() => useModalState());

      act(() => {
        result.current.openView({ anything: "goes" });
      });

      expect(result.current.selectedItem).toEqual({ anything: "goes" });
    });
  });

  describe("computed properties consistency", () => {
    it("should have consistent computed properties", () => {
      const { result } = renderHook(() => useModalState<TestItem>());
      const testItem: TestItem = { id: "1", name: "Test" };

      // Test each modal state
      const states = [
        { action: () => result.current.openCreate(), prop: "isCreateOpen" },
        { action: () => result.current.openEdit(testItem), prop: "isEditOpen" },
        { action: () => result.current.openView(testItem), prop: "isViewOpen" },
        {
          action: () => result.current.openDelete(testItem),
          prop: "isDeleteOpen",
        },
      ];

      states.forEach(({ action, prop }) => {
        act(action);

        // Only the specific property should be true
        expect(result.current.isCreateOpen).toBe(prop === "isCreateOpen");
        expect(result.current.isEditOpen).toBe(prop === "isEditOpen");
        expect(result.current.isViewOpen).toBe(prop === "isViewOpen");
        expect(result.current.isDeleteOpen).toBe(prop === "isDeleteOpen");
      });
    });
  });
});
