/**
 * Test Utilities
 * Helper functions and wrappers for testing with React Query
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

/**
 * Creates a new QueryClient for each test to ensure test isolation
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests to make them faster and more predictable
        retry: false,
        // Disable caching in tests
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component that provides QueryClientProvider for testing
 */
interface TestWrapperProps {
  children: ReactNode;
}

export function createWrapper(queryClient: QueryClient) {
  return function TestWrapper({ children }: TestWrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Custom render function that wraps components with QueryClientProvider
 * Use this instead of @testing-library/react's render for components that use React Query
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export function renderWithQueryClient(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const queryClient = options?.queryClient ?? createTestQueryClient();
  const Wrapper = createWrapper(queryClient);

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

/**
 * Re-export everything from React Testing Library
 */
export * from "@testing-library/react";
