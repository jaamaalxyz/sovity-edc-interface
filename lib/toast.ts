/**
 * Toast Notification Utility
 * Wrapper around sonner toast library for consistent toast notifications
 */

import { toast as sonnerToast } from "sonner";

export const toast = {
  /**
   * Show a success toast notification
   * @param message - The message to display
   * @param description - Optional description
   */
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error toast notification
   * @param message - The message to display
   * @param description - Optional description
   */
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show an info toast notification
   * @param message - The message to display
   * @param description - Optional description
   */
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a warning toast notification
   * @param message - The message to display
   * @param description - Optional description
   */
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a loading toast notification
   * @param message - The message to display
   * @returns The toast ID for updating or dismissing later
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Show a promise toast that updates based on promise state
   * @param promise - The promise to track
   * @param messages - Success, error, and loading messages
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  /**
   * Dismiss a specific toast or all toasts
   * @param toastId - Optional toast ID to dismiss specific toast
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};
