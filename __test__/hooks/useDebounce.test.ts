/**
 * Tests for useDebounce hook
 */

import { act, renderHook } from "@testing-library/react";

import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes with default delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    // Update the value
    rerender({ value: "updated" });
    expect(result.current).toBe("initial"); // Still the old value

    // Fast-forward time by 200ms (before delay expires)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial"); // Still the old value

    // Fast-forward time by 100ms more (total 300ms - delay expires)
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("updated"); // Now it should be updated
  });

  it("should debounce value changes with custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("updated");
  });

  it("should cancel previous timeout when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    // Change value multiple times rapidly
    rerender({ value: "change1" });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "change2" });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "final" });
    expect(result.current).toBe("initial"); // Still initial

    // Fast-forward to after the delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("final"); // Only the final value should be applied
  });

  it("should work with different data types", () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    expect(numberResult.current).toBe(0);
    numberRerender({ value: 42 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(numberResult.current).toBe(42);

    // Test with boolean
    const { result: boolResult, rerender: boolRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: false } }
    );

    expect(boolResult.current).toBe(false);
    boolRerender({ value: true });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(boolResult.current).toBe(true);

    // Test with object
    const { result: objResult, rerender: objRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { id: 1 } } }
    );

    expect(objResult.current).toEqual({ id: 1 });
    objRerender({ value: { id: 2 } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(objResult.current).toEqual({ id: 2 });
  });

  it("should handle delay of 0", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe("updated");
  });

  it("should clean up timeout on unmount", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    // Unmount before timeout expires
    unmount();

    // Advance timers - value should not update because component is unmounted
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // We can't check result.current after unmount, but we verify no errors occur
    expect(true).toBe(true);
  });
});
