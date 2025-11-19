/**
 * React Query Client Configuration
 * Centralized configuration for all query settings
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache time: unused data stays in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests twice with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.code && error.code.startsWith("4")) {
          return false;
        }
        return failureCount < 2;
      },
      // Refetch on window focus to keep data fresh
      refetchOnWindowFocus: true,
      // Refetch on reconnect to sync after network issues
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});
