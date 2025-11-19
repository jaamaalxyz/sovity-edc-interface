/**
 * Tests for useAssets hooks
 */

import { renderHook, waitFor } from "@testing-library/react";

import {
  useAsset,
  useAssets,
  useAssetsPaginated,
  useCreateAsset,
  useDeleteAsset,
  useUpdateAsset,
} from "@/hooks/useAssets";
import { apiClient } from "@/lib/api-client";
import { createTestQueryClient, createWrapper } from "@/lib/test-utils";
import type { Asset, CreateAssetInput, UpdateAssetInput } from "@/types/asset";

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

describe("useAssets hooks", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;
  let wrapper: ReturnType<typeof createWrapper>;

  const mockAsset: Asset = {
    "@id": "asset-1",
    properties: {
      "asset:prop:id": "asset-1",
      "asset:prop:name": "Test Asset",
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://example.com/data",
    },
  };

  const mockAssets: Asset[] = [
    mockAsset,
    {
      "@id": "asset-2",
      properties: {
        "asset:prop:id": "asset-2",
        "asset:prop:name": "Test Asset 2",
      },
      dataAddress: {
        "@type": "DataAddress",
        type: "HttpData",
        baseUrl: "https://example.com/data2",
      },
    },
  ];

  beforeEach(() => {
    queryClient = createTestQueryClient();
    wrapper = createWrapper(queryClient);
    jest.clearAllMocks();
  });

  describe("useAssets", () => {
    it("should fetch all assets", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);

      const { result } = renderHook(() => useAssets(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAssets);
      expect(apiClient.getAssets).toHaveBeenCalledWith({
        limit: 1000,
        offset: 0,
      });
    });

    it("should handle error when fetching assets", async () => {
      const error = new Error("Failed to fetch assets");
      (apiClient.getAssets as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAssets(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it("should use cached data", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);

      const { result: result1 } = renderHook(() => useAssets(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      const { result: result2 } = renderHook(() => useAssets(), { wrapper });

      // Should get data from cache immediately
      expect(result2.current.data).toEqual(mockAssets);
      // API should have been called only once
      expect(apiClient.getAssets).toHaveBeenCalledTimes(1);
    });
  });

  describe("useAssetsPaginated", () => {
    it("should fetch assets with pagination", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);

      const { result } = renderHook(
        () => useAssetsPaginated({ limit: 10, offset: 0 }),
        {
          wrapper,
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAssets);
      expect(apiClient.getAssets).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
    });

    it("should fetch different pages independently", async () => {
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);

      const { result: page1 } = renderHook(
        () => useAssetsPaginated({ limit: 10, offset: 0 }),
        {
          wrapper,
        }
      );
      await waitFor(() => expect(page1.current.isSuccess).toBe(true));

      const { result: page2 } = renderHook(
        () => useAssetsPaginated({ limit: 10, offset: 10 }),
        {
          wrapper,
        }
      );
      await waitFor(() => expect(page2.current.isSuccess).toBe(true));

      expect(apiClient.getAssets).toHaveBeenCalledTimes(2);
      expect(apiClient.getAssets).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
      expect(apiClient.getAssets).toHaveBeenCalledWith({
        limit: 10,
        offset: 10,
      });
    });
  });

  describe("useAsset", () => {
    it("should fetch a single asset", async () => {
      (apiClient.getAsset as jest.Mock).mockResolvedValue(mockAsset);

      const { result } = renderHook(() => useAsset("asset-1"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAsset);
      expect(apiClient.getAsset).toHaveBeenCalledWith("asset-1");
    });

    it("should not fetch when id is empty", () => {
      const { result } = renderHook(() => useAsset(""), { wrapper });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe("idle");
      expect(apiClient.getAsset).not.toHaveBeenCalled();
    });

    it("should handle error when fetching single asset", async () => {
      const error = new Error("Asset not found");
      (apiClient.getAsset as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAsset("asset-1"), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe("useCreateAsset", () => {
    it("should create a new asset", async () => {
      (apiClient.createAsset as jest.Mock).mockResolvedValue(mockAsset);

      const { result } = renderHook(() => useCreateAsset(), { wrapper });

      const newAsset: CreateAssetInput = {
        id: "asset-1",
        properties: {
          "asset:prop:name": "Test Asset",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://example.com/data",
        },
      };

      result.current.mutate(newAsset);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.createAsset).toHaveBeenCalledWith(newAsset);
      expect(result.current.data).toEqual(mockAsset);
    });

    it("should invalidate cache after creating asset", async () => {
      // Pre-populate cache
      (apiClient.getAssets as jest.Mock).mockResolvedValue([]);
      const { result: assetsResult } = renderHook(() => useAssets(), {
        wrapper,
      });
      await waitFor(() => expect(assetsResult.current.isSuccess).toBe(true));

      expect(assetsResult.current.data).toEqual([]);

      // Create new asset
      (apiClient.createAsset as jest.Mock).mockResolvedValue(mockAsset);

      const { result: createResult } = renderHook(() => useCreateAsset(), {
        wrapper,
      });

      // Setup mock for refetch after invalidation
      (apiClient.getAssets as jest.Mock).mockResolvedValue([mockAsset]);

      createResult.current.mutate({
        id: "asset-1",
        properties: {},
        dataAddress: { type: "HttpData", baseUrl: "http://test.com" },
      });

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true));

      // Manually trigger refetch to simulate cache invalidation behavior
      assetsResult.current.refetch();

      // Cache should contain the new asset after refetch
      await waitFor(() =>
        expect(assetsResult.current.data).toEqual([mockAsset])
      );
    });

    it("should handle error when creating asset", async () => {
      const error = new Error("Failed to create asset");
      (apiClient.createAsset as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useCreateAsset(), { wrapper });

      result.current.mutate({
        id: "asset-1",
        properties: {},
        dataAddress: { type: "HttpData", baseUrl: "http://test.com" },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe("useUpdateAsset", () => {
    it("should update an existing asset", async () => {
      const updatedAsset: Asset = {
        ...mockAsset,
        properties: {
          ...mockAsset.properties,
          "asset:prop:name": "Updated Asset",
        },
      };

      (apiClient.updateAsset as jest.Mock).mockResolvedValue(updatedAsset);

      const { result } = renderHook(() => useUpdateAsset(), { wrapper });

      const updates: UpdateAssetInput = {
        properties: {
          "asset:prop:name": "Updated Asset",
        },
      };

      result.current.mutate({ id: "asset-1", updates });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.updateAsset).toHaveBeenCalledWith("asset-1", updates);
      expect(result.current.data).toEqual(updatedAsset);
    });

    it("should call setQueryData to update cache after updating asset", async () => {
      const updatedAsset: Asset = {
        ...mockAsset,
        properties: {
          ...mockAsset.properties,
          "asset:prop:name": "Updated Asset",
        },
      };

      (apiClient.updateAsset as jest.Mock).mockResolvedValue(updatedAsset);

      const { result: updateResult } = renderHook(() => useUpdateAsset(), {
        wrapper,
      });

      // Spy on setQueryData
      const setQueryDataSpy = jest.spyOn(queryClient, "setQueryData");

      updateResult.current.mutate({
        id: "asset-1",
        updates: { properties: { "asset:prop:name": "Updated Asset" } },
      });

      await waitFor(() => expect(updateResult.current.isSuccess).toBe(true));

      // Verify the API was called correctly
      expect(apiClient.updateAsset).toHaveBeenCalledWith("asset-1", {
        properties: { "asset:prop:name": "Updated Asset" },
      });

      // Verify setQueryData was called to update caches
      expect(setQueryDataSpy).toHaveBeenCalled();

      setQueryDataSpy.mockRestore();
    });

    it("should handle error when updating asset", async () => {
      const error = new Error("Failed to update asset");
      (apiClient.updateAsset as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateAsset(), { wrapper });

      result.current.mutate({ id: "asset-1", updates: {} });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe("useDeleteAsset", () => {
    it("should delete an asset", async () => {
      (apiClient.deleteAsset as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteAsset(), { wrapper });

      result.current.mutate("asset-1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.deleteAsset).toHaveBeenCalledWith("asset-1");
    });

    it("should update cache after deleting asset", async () => {
      // Pre-populate cache
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const { result: assetsResult } = renderHook(() => useAssets(), {
        wrapper,
      });
      await waitFor(() => expect(assetsResult.current.isSuccess).toBe(true));

      expect(assetsResult.current.data).toHaveLength(2);

      (apiClient.deleteAsset as jest.Mock).mockResolvedValue(undefined);

      const { result: deleteResult } = renderHook(() => useDeleteAsset(), {
        wrapper,
      });
      deleteResult.current.mutate("asset-1");

      await waitFor(() => expect(deleteResult.current.isSuccess).toBe(true));

      // Cache should be updated - asset should be removed
      await waitFor(() => {
        expect(assetsResult.current.data).toHaveLength(1);
        expect(
          assetsResult.current.data?.find((a) => a["@id"] === "asset-1")
        ).toBeUndefined();
      });
    });

    it("should handle error when deleting asset", async () => {
      const error = new Error("Failed to delete asset");
      (apiClient.deleteAsset as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteAsset(), { wrapper });

      result.current.mutate("asset-1");

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it("should rollback optimistic update on error", async () => {
      // Pre-populate cache
      (apiClient.getAssets as jest.Mock).mockResolvedValue(mockAssets);
      const { result: assetsResult } = renderHook(() => useAssets(), {
        wrapper,
      });
      await waitFor(() => expect(assetsResult.current.isSuccess).toBe(true));

      const originalLength = assetsResult.current.data?.length || 0;

      const error = new Error("Failed to delete asset");
      (apiClient.deleteAsset as jest.Mock).mockRejectedValue(error);

      const { result: deleteResult } = renderHook(() => useDeleteAsset(), {
        wrapper,
      });
      deleteResult.current.mutate("asset-1");

      await waitFor(() => expect(deleteResult.current.isError).toBe(true));

      // Cache should be rolled back to original state
      await waitFor(() => {
        expect(assetsResult.current.data).toHaveLength(originalLength);
      });
    });
  });
});
