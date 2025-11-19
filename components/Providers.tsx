/**
 * Providers Component
 * Wraps the app with necessary providers (React Query, Error Boundary, etc.)
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import { isDevelopment } from "@/lib/env";
import { queryClient } from "@/lib/query-client";

import ErrorBoundary from "./ErrorBoundary";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>{children}</ErrorBoundary>
      <Toaster position="top-right" richColors closeButton />
      {/* DevTools only in development */}
      {isDevelopment && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
