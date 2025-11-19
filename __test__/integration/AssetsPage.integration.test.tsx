/**
 * Integration Tests for Assets Page
 * Tests complete user flows and interactions
 */

import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AssetsPage from "@/app/assets/page";
import { apiClient } from "@/lib/api-client";
import { renderWithQueryClient } from "@/lib/test-utils";
import type { Asset } from "@/types/asset";

// Mock the API client
jest.mock("@/lib/api-client", () => ({
  apiClient: {
    getAssets: jest.fn(),
    getAsset: jest.fn(),
    createAsset: jest.fn(),
    updateAsset: jest.fn(),
    deleteAsset: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/assets",
}));

// Mock toast
jest.mock("@/lib/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock error logger
jest.mock("@/lib/error-logger", () => ({
  logError: jest.fn(),
}));

describe("Assets Page Integration Tests", () => {
  const mockAssets: Asset[] = [
    {
      "@id": "asset-1",
      properties: {
        "asset:prop:id": "asset-1",
        "asset:prop:name": "Test Asset 1",
        "asset:prop:description": "First test asset",
      },
      dataAddress: {
        "@type": "DataAddress",
        type: "HttpData",
        baseUrl: "https://example.com/data1",
      },
    },
    {
      "@id": "asset-2",
      properties: {
        "asset:prop:id": "asset-2",
        "asset:prop:name": "Test Asset 2",
        "asset:prop:description": "Second test asset",
      },
      dataAddress: {
        "@type": "DataAddress",
        type: "HttpData",
        baseUrl: "https://example.com/data2",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Page Load", () => {
    it("should display loading state then show assets", async () => {
      (apiClient.getAssets as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockAssets), 100))
      );

      renderWithQueryClient(<AssetsPage />);

      // Should show loading state with skeleton loaders
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);

      // Wait for assets to load
      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      expect(screen.getByText("Test Asset 2")).toBeInTheDocument();
    });

    it("should handle error when loading fails", async () => {
      const errorMessage = "Failed to load assets";
      (apiClient.getAssets as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      renderWithQueryClient(<AssetsPage />);

      // Page should still render even with error
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /assets/i })
        ).toBeInTheDocument();
      });

      // Should show error message eventually (after loading completes)
      await waitFor(
        () => {
          expect(
            screen.getByText(/failed to load assets/i)
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it("should display empty state when no assets exist", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue([]);

      renderWithQueryClient(<AssetsPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/no assets found/i)).toBeInTheDocument();
          expect(
            screen.getByText(/create your first asset/i)
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe("Search Functionality", () => {
    it("should filter assets based on search query", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      // Find search input and type
      const searchInput = screen.getByPlaceholderText(/search assets/i);
      await user.type(searchInput, "Asset 1");

      // Should show only matching asset
      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
        expect(screen.queryByText("Test Asset 2")).not.toBeInTheDocument();
      });
    });

    it('should show "no matches" message when search returns no results', async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search assets/i);
      await user.type(searchInput, "NonexistentAsset");

      await waitFor(() => {
        expect(
          screen.getByText(/no assets match your search/i)
        ).toBeInTheDocument();
      });
    });

    it("should clear search and show all assets", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search assets/i);
      await user.type(searchInput, "Asset 1");

      await waitFor(() => {
        expect(screen.queryByText("Test Asset 2")).not.toBeInTheDocument();
      });

      // Clear search
      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
        expect(screen.getByText("Test Asset 2")).toBeInTheDocument();
      });
    });
  });

  describe("Create Asset Flow", () => {
    it("should open create modal and create a new asset", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue([]);
      const user = userEvent.setup();

      const newAsset: Asset = {
        "@id": "new-asset",
        properties: {
          "asset:prop:id": "new-asset",
          "asset:prop:name": "New Asset",
        },
        dataAddress: {
          "@type": "DataAddress",
          type: "HttpData",
          baseUrl: "https://example.com/new",
        },
      };

      (apiClient.createAsset as jest.Mock).mockResolvedValue(newAsset);

      renderWithQueryClient(<AssetsPage />);

      // Wait for initial load
      await waitFor(
        () => {
          expect(screen.getByText(/no assets found/i)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // Click create button
      const createButton = screen.getByRole("button", {
        name: /create asset/i,
      });
      await user.click(createButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByText("Create New Asset")).toBeInTheDocument();
      });

      // Fill in form - find inputs within the modal
      const modal = screen.getByRole("dialog");
      const idInput = within(modal).getByLabelText(
        /asset id/i
      ) as HTMLInputElement;
      const nameInput = within(modal).getByLabelText(
        /name/i
      ) as HTMLInputElement;
      const urlInput = within(modal).getByLabelText(
        /base url/i
      ) as HTMLInputElement;

      await user.type(idInput, "new-asset");
      await user.type(nameInput, "New Asset");

      // Use paste for URL to avoid timing issues with long strings
      urlInput.focus();
      await user.paste("https://example.com/new");

      // Wait for all inputs to be filled
      await waitFor(() => {
        expect(idInput.value).toBe("new-asset");
        expect(nameInput.value).toBe("New Asset");
        expect(urlInput.value).toBe("https://example.com/new");
      });

      // Submit form
      const submitButton = within(modal).getByRole("button", {
        name: /create/i,
      });
      await user.click(submitButton);

      // Wait for API call to be made
      await waitFor(
        () => {
          expect(apiClient.createAsset).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );

      // Modal should close after successful creation
      await waitFor(() => {
        expect(screen.queryByText("Create New Asset")).not.toBeInTheDocument();
      });

      // Verify API was called with correct structure
      expect(apiClient.createAsset).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "new-asset",
          properties: expect.objectContaining({
            name: expect.stringContaining("New"),
          }),
          dataAddress: expect.objectContaining({
            type: "HttpData",
            baseUrl: "https://example.com/new",
          }),
        })
      );
    });

    it("should cancel asset creation", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue([]);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText(/no assets found/i)).toBeInTheDocument();
      });

      // Open create modal
      const createButton = screen.getByRole("button", {
        name: /create asset/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Asset")).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText("Create New Asset")).not.toBeInTheDocument();
      });

      // API should not be called
      expect(apiClient.createAsset).not.toHaveBeenCalled();
    });
  });

  describe("View Asset Flow", () => {
    it("should open asset details modal when clicking on asset card", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      // Click on first asset card's view button
      const viewButtons = screen.getAllByRole("button", {
        name: /view details/i,
      });
      await user.click(viewButtons[0]);

      // Details modal should open
      await waitFor(() => {
        expect(screen.getByText("Asset Details")).toBeInTheDocument();
      });

      // Should display asset information in the modal
      const modal = screen.getByRole("dialog");
      expect(within(modal).getAllByText("asset-1")[0]).toBeInTheDocument();
      // "Test Asset 1" appears multiple times in the modal (name field and properties)
      expect(within(modal).getAllByText("Test Asset 1")[0]).toBeInTheDocument();
    });

    it("should close asset details modal", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      // Open details modal
      const viewButtons = screen.getAllByRole("button", {
        name: /view details/i,
      });
      await user.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Asset Details")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Asset Details")).not.toBeInTheDocument();
      });
    });
  });

  describe("Edit Asset Flow", () => {
    it("should open edit modal and update asset", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      const updatedAsset: Asset = {
        ...mockAssets[0],
        properties: {
          ...mockAssets[0].properties,
          "asset:prop:name": "Updated Asset Name",
        },
      };

      (apiClient.updateAsset as jest.Mock).mockResolvedValue(updatedAsset);

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      // Click edit button using aria-label
      const editButton = screen.getByRole("button", {
        name: /edit test asset 1/i,
      });
      await user.click(editButton);

      // Edit modal should open
      await waitFor(() => {
        expect(screen.getByText("Edit Asset")).toBeInTheDocument();
      });

      // Update name
      const modal = screen.getByRole("dialog");
      const nameInput = within(modal).getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Asset Name");

      // Submit
      const updateButton = within(modal).getByRole("button", {
        name: /update asset/i,
      });
      await user.click(updateButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText("Edit Asset")).not.toBeInTheDocument();
      });

      // Verify API was called
      expect(apiClient.updateAsset).toHaveBeenCalled();
    });
  });

  describe("Delete Asset Flow", () => {
    it("should open delete confirmation and delete asset", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      (apiClient.deleteAsset as jest.Mock).mockResolvedValue(undefined);

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      // Click delete button using aria-label
      const deleteButton = screen.getByRole("button", {
        name: /delete test asset 1/i,
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
      expect(apiClient.deleteAsset).toHaveBeenCalledWith("asset-1");
    });

    it("should cancel asset deletion", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const user = userEvent.setup();

      renderWithQueryClient(<AssetsPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
      });

      // Click delete button using aria-label
      const deleteButton = screen.getByRole("button", {
        name: /delete test asset 1/i,
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
      expect(apiClient.deleteAsset).not.toHaveBeenCalled();

      // Asset should still be visible
      expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
    });
  });

  describe("Error Recovery", () => {
    it("should handle transient errors gracefully", async () => {
      // First call fails, second succeeds (React Query will retry)
      (apiClient.getAssets as jest.Mock)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(mockAssets);

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

      renderWithQueryClient(<AssetsPage />, { queryClient });

      // Should eventually load assets after retry
      await waitFor(
        () => {
          expect(screen.getByText("Test Asset 1")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      expect(screen.getByText("Test Asset 2")).toBeInTheDocument();
    }, 10000); // Test timeout
  });
});
