/**
 * Integration Tests for Policies Page
 * Tests complete user flows and interactions
 */

import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PoliciesPage from "@/app/policies/page";
import { apiClient } from "@/lib/api-client";
import { renderWithQueryClient } from "@/lib/test-utils";
import type { PolicyDefinition } from "@/types/policy";

// Mock the API client
jest.mock("@/lib/api-client", () => ({
  apiClient: {
    getPolicies: jest.fn(),
    getPolicy: jest.fn(),
    createPolicy: jest.fn(),
    deletePolicy: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/policies",
}));

// Mock toast
jest.mock("@/lib/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock error logger
jest.mock("@/lib/error-logger", () => ({
  logError: jest.fn(),
}));

describe("Policies Page Integration Tests", () => {
  const mockPolicies: PolicyDefinition[] = [
    {
      "@id": "policy-1",
      "@type": "PolicyDefinition",
      policy: {
        permissions: [
          {
            action: "USE",
            constraints: [],
          },
        ],
      },
    },
    {
      "@id": "policy-2",
      "@type": "PolicyDefinition",
      policy: {
        permissions: [
          {
            action: "TRANSFER",
            constraints: [
              {
                leftOperand: "region",
                operator: "eq" as import("@/types/policy").ConstraintOperator,
                rightOperand: "EU",
              },
            ],
          },
        ],
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Page Load", () => {
    it("should display loading state then show policies", async () => {
      (apiClient.getPolicies as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockPolicies), 100))
      );

      renderWithQueryClient(<PoliciesPage />);

      // Should show skeleton loaders while loading
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);

      // Wait for policies to load
      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      expect(screen.getByText("policy-2")).toBeInTheDocument();
    });

    it("should handle error when loading fails", async () => {
      (apiClient.getPolicies as jest.Mock).mockReset();
      (apiClient.getPolicies as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to load")
      );

      renderWithQueryClient(<PoliciesPage />);

      // Page should still render even with error
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /policies/i })
        ).toBeInTheDocument();
      });

      // Should show error message eventually (after loading completes)
      await waitFor(
        () => {
          const errorElement = screen.queryByText(/failed to load/i);
          expect(errorElement).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    }, 10000);

    it("should display empty state when no policies exist", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([]);

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
          expect(
            screen.getByText(/create your first policy/i)
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe("Search Functionality", () => {
    it("should filter policies based on search query", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      // Search for specific policy
      const searchInput = screen.getByPlaceholderText(/search policies/i);
      await user.type(searchInput, "policy-1");

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
        expect(screen.queryByText("policy-2")).not.toBeInTheDocument();
      });
    });

    it('should show "no matches" message when search returns no results', async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search policies/i);
      await user.type(searchInput, "nonexistent-policy");

      await waitFor(() => {
        expect(
          screen.getByText(/no policies match your search/i)
        ).toBeInTheDocument();
      });
    });

    it("should clear search and show all policies", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search policies/i);
      await user.type(searchInput, "policy-1");

      await waitFor(() => {
        expect(screen.queryByText("policy-2")).not.toBeInTheDocument();
      });

      // Clear search
      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
        expect(screen.getByText("policy-2")).toBeInTheDocument();
      });
    });
  });

  describe("Create Policy Flow", () => {
    it("should open create modal and create a new policy", async () => {
      jest.clearAllMocks();
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([]);
      const user = userEvent.setup();

      const newPolicy: PolicyDefinition = {
        "@id": "new-policy",
        "@type": "PolicyDefinition",
        policy: {
          permissions: [
            {
              action: "USE",
              constraints: [],
            },
          ],
        },
      };

      (apiClient.createPolicy as jest.Mock).mockResolvedValue(newPolicy);

      // Create a fresh query client for this test
      const { createTestQueryClient } = require("@/lib/test-utils");
      const queryClient = createTestQueryClient();

      renderWithQueryClient(<PoliciesPage />, { queryClient });

      await waitFor(
        () => {
          expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // Click create button
      const createButton = screen.getByRole("button", {
        name: /create policy/i,
      });
      await user.click(createButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByText("Create New Policy")).toBeInTheDocument();
      });

      // Fill in form
      const modal = screen.getByRole("dialog");
      const idInput = within(modal).getByLabelText(
        /policy id/i
      ) as HTMLInputElement;

      // Use paste for reliable input
      idInput.focus();
      await user.paste("new-policy");

      // The form has a default permission, update the action
      const actionInput = within(modal).getByLabelText(
        /action/i
      ) as HTMLInputElement;
      await user.clear(actionInput);
      actionInput.focus();
      await user.paste("USE");

      // Wait for inputs to be filled
      await waitFor(() => {
        expect(idInput.value).toBe("new-policy");
        expect(actionInput.value).toBe("USE");
      });

      // Submit form
      const submitButton = within(modal).getByRole("button", {
        name: /create policy/i,
      });
      await user.click(submitButton);

      // Wait for API call
      await waitFor(
        () => {
          expect(apiClient.createPolicy).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText("Create New Policy")).not.toBeInTheDocument();
      });

      // Verify API was called with correct structure
      expect(apiClient.createPolicy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "new-policy",
          policy: expect.objectContaining({
            permissions: expect.arrayContaining([
              expect.objectContaining({
                action: expect.stringContaining("USE"),
              }),
            ]),
          }),
        })
      );
    }, 10000);

    it("should cancel policy creation", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([]);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
      });

      // Open create modal
      const createButton = screen.getByRole("button", {
        name: /create policy/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Policy")).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText("Create New Policy")).not.toBeInTheDocument();
      });

      // API should not be called
      expect(apiClient.createPolicy).not.toHaveBeenCalled();
    });

    it("should validate required fields", async () => {
      (apiClient.getPolicies as jest.Mock).mockReset();
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([]);
      (apiClient.createPolicy as jest.Mock).mockReset();
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // Open create modal
      const createButton = screen.getByRole("button", {
        name: /create policy/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Policy")).toBeInTheDocument();
      });

      // Clear the ID field to trigger validation
      const modal = screen.getByRole("dialog");
      const idInput = within(modal).getByLabelText(
        /policy id/i
      ) as HTMLInputElement;

      // Focus and clear to ensure it's empty
      idInput.focus();
      await user.clear(idInput);

      // Also clear the action field (which has a default value)
      const actionInput = within(modal).getByLabelText(
        /action/i
      ) as HTMLInputElement;
      actionInput.focus();
      await user.clear(actionInput);

      // Try to submit without filling required fields
      const submitButton = within(modal).getByRole("button", {
        name: /create policy/i,
      });
      await user.click(submitButton);

      // Wait a bit for validation to process
      await new Promise((resolve) => setTimeout(resolve, 500));

      // API should not be called when form is invalid
      expect(apiClient.createPolicy).not.toHaveBeenCalled();
    }, 10000);
  });

  describe("View Policy Flow", () => {
    it("should open policy details modal when clicking on policy card", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      // Click on first policy card's view button
      const viewButtons = screen.getAllByRole("button", {
        name: /view details/i,
      });
      await user.click(viewButtons[0]);

      // Details modal should open
      await waitFor(() => {
        expect(screen.getByText("Policy Details")).toBeInTheDocument();
      });

      // Should display policy information in the modal
      const modal = screen.getByRole("dialog");
      expect(within(modal).getAllByText("policy-1")[0]).toBeInTheDocument();
    });

    it("should close policy details modal", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      // Open details modal
      const viewButtons = screen.getAllByRole("button", {
        name: /view details/i,
      });
      await user.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Policy Details")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Policy Details")).not.toBeInTheDocument();
      });
    });
  });

  describe("Delete Policy Flow", () => {
    it("should open delete confirmation and delete policy", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      (apiClient.deletePolicy as jest.Mock).mockResolvedValue(undefined);

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      // Click delete button using aria-label
      const deleteButton = screen.getByRole("button", {
        name: /delete policy policy-1/i,
      });
      await user.click(deleteButton);

      // Confirmation dialog should open
      await waitFor(() => {
        expect(
          screen.getByText(/are you sure you want to delete/i)
        ).toBeInTheDocument();
      });

      // Confirm deletion - find the Delete button in the dialog
      const dialog = screen.getByRole("dialog");
      const confirmButton = within(dialog).getByRole("button", {
        name: /^delete$/i,
      });
      await user.click(confirmButton);

      // Dialog should close
      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure you want to delete/i)
        ).not.toBeInTheDocument();
      });

      // Verify API was called
      expect(apiClient.deletePolicy).toHaveBeenCalledWith("policy-1");
    });

    it("should cancel policy deletion", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      // Click delete button using aria-label
      const deleteButton = screen.getByRole("button", {
        name: /delete policy policy-1/i,
      });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.getByText(/are you sure you want to delete/i)
        ).toBeInTheDocument();
      });

      // Cancel deletion
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure you want to delete/i)
        ).not.toBeInTheDocument();
      });

      // API should not be called
      expect(apiClient.deletePolicy).not.toHaveBeenCalled();

      // Policy should still be visible
      expect(screen.getByText("policy-1")).toBeInTheDocument();
    });
  });

  describe("Pagination Flow", () => {
    it("should paginate through policies", async () => {
      const manyPolicies: PolicyDefinition[] = Array.from(
        { length: 25 },
        (_, i) => ({
          "@id": `policy-${i + 1}`,
          "@type": "PolicyDefinition",
          policy: {
            permissions: [
              {
                action: "USE",
                constraints: [],
              },
            ],
          },
        })
      );

      (apiClient.getPolicies as jest.Mock).mockResolvedValue(manyPolicies);
      const user = userEvent.setup();

      renderWithQueryClient(<PoliciesPage />);

      await waitFor(() => {
        expect(screen.getByText("policy-1")).toBeInTheDocument();
      });

      // Should show first 9 policies (default page size)
      // Check that we have policies on page 1
      expect(screen.getByText("policy-1")).toBeInTheDocument();
      expect(screen.getByText("policy-9")).toBeInTheDocument();

      // Click next page
      const nextButtons = screen.getAllByRole("button", { name: /next/i });
      // Use the last next button (the main pagination one)
      const nextButton = nextButtons[nextButtons.length - 1];
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("policy-10")).toBeInTheDocument();
      });

      // Verify we're on page 2 (policy-10 through policy-18)
      expect(screen.getByText("policy-18")).toBeInTheDocument();
    });
  });

  describe("Error Recovery", () => {
    it("should handle transient errors gracefully", async () => {
      // First call fails, second succeeds (React Query will retry)
      (apiClient.getPolicies as jest.Mock)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(mockPolicies);

      // Create a QueryClient with retries enabled for this test
      const { QueryClient } = require("@tanstack/react-query");
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1, // Retry once
            retryDelay: 100, // Short delay for tests
            gcTime: 0,
            staleTime: 0,
          },
          mutations: {
            retry: false,
          },
        },
      });

      renderWithQueryClient(<PoliciesPage />, { queryClient });

      // Should eventually load policies after retry
      await waitFor(
        () => {
          expect(screen.getByText("policy-1")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      expect(screen.getByText("policy-2")).toBeInTheDocument();
    }, 10000); // Test timeout
  });
});
