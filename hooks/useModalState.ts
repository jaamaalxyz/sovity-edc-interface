/**
 * Modal State Management Hook
 */

import { useReducer } from "react";

export type ModalType = "idle" | "create" | "edit" | "view" | "delete";

export interface ModalState<T> {
  type: ModalType;
  selectedItem: T | null;
}

export type ModalAction<T> =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; payload: T }
  | { type: "OPEN_VIEW"; payload: T }
  | { type: "OPEN_DELETE"; payload: T }
  | { type: "CLOSE" };

function modalReducer<T>(
  state: ModalState<T>,
  action: ModalAction<T>
): ModalState<T> {
  switch (action.type) {
    case "OPEN_CREATE":
      return { type: "create", selectedItem: null };

    case "OPEN_EDIT":
      return { type: "edit", selectedItem: action.payload };

    case "OPEN_VIEW":
      return { type: "view", selectedItem: action.payload };

    case "OPEN_DELETE":
      return { type: "delete", selectedItem: action.payload };

    case "CLOSE":
      return { type: "idle", selectedItem: null };

    default:
      return state;
  }
}

export function useModalState<T = any>() {
  const [state, dispatch] = useReducer(modalReducer<T>, {
    type: "idle",
    selectedItem: null,
  });

  return {
    state,
    dispatch,
    isCreateOpen: state.type === "create",
    isEditOpen: state.type === "edit",
    isViewOpen: state.type === "view",
    isDeleteOpen: state.type === "delete",
    selectedItem: state.selectedItem,
    openCreate: () => dispatch({ type: "OPEN_CREATE" }),
    openEdit: (item: T) => dispatch({ type: "OPEN_EDIT", payload: item }),
    openView: (item: T) => dispatch({ type: "OPEN_VIEW", payload: item }),
    openDelete: (item: T) => dispatch({ type: "OPEN_DELETE", payload: item }),
    close: () => dispatch({ type: "CLOSE" }),
  };
}
