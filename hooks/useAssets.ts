/**
 * Custom hooks for Asset data fetching and mutations
 * Uses React Query for server state management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { QuerySpec } from "@/types/api";
import type { Asset, CreateAssetInput, UpdateAssetInput } from "@/types/asset";

// Query keys for caching
export const assetKeys = {
  all: ["assets"] as const,
  list: (params: QuerySpec) => ["assets", "list", params] as const,
  detail: (id: string) => ["assets", id] as const,
};

/**
 * Fetch all assets (without pagination - for backward compatibility)
 */
export function useAssets() {
  return useQuery({
    queryKey: assetKeys.all,
    queryFn: () => apiClient.getAssets({ limit: 1000, offset: 0 }),
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch assets with pagination and filtering (server-side)
 */
export function useAssetsPaginated(querySpec: QuerySpec = {}) {
  return useQuery({
    queryKey: assetKeys.list(querySpec),
    queryFn: () => apiClient.getAssets(querySpec),
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Keep previous data while fetching new page
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single asset by ID
 */
export function useAsset(id: string) {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: () => apiClient.getAsset(id),
    enabled: !!id, // Only fetch if ID is provided
  });
}

/**
 * Create a new asset
 */
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: CreateAssetInput) => apiClient.createAsset(asset),
    onSuccess: (newAsset) => {
      // Invalidate and refetch assets list
      queryClient.invalidateQueries({ queryKey: assetKeys.all });

      // Optionally set the new asset in cache
      queryClient.setQueryData(assetKeys.detail(newAsset["@id"]), newAsset);

      // Invalidate all paginated queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["assets", "list"],
        exact: false,
      });
    },
    // Optimistic update (optional)
    onMutate: async (newAsset) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: assetKeys.all });

      // Snapshot previous value
      const previousAssets = queryClient.getQueryData(assetKeys.all);

      // Optimistically update cache
      queryClient.setQueryData<Asset[]>(assetKeys.all, (old = []) => [
        {
          "@id": newAsset.id,
          properties: newAsset.properties,
          dataAddress: newAsset.dataAddress,
        } as Asset,
        ...old,
      ]);

      // Return context with snapshot
      return { previousAssets };
    },
    // Rollback on error
    onError: (_error, _newAsset, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(assetKeys.all, context.previousAssets);
      }
    },
  });
}

/**
 * Update an existing asset
 */
export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateAssetInput }) =>
      apiClient.updateAsset(id, updates),
    onSuccess: (updatedAsset, { id }) => {
      // Update the specific asset in cache
      queryClient.setQueryData(assetKeys.detail(id), updatedAsset);

      // Update the asset in the list
      queryClient.setQueryData<Asset[]>(assetKeys.all, (old = []) =>
        old.map((asset) => (asset["@id"] === id ? updatedAsset : asset))
      );

      // Invalidate all paginated queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["assets", "list"],
        exact: false,
      });
    },
  });
}

/**
 * Delete an asset
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAsset(id),
    onSuccess: (_data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: assetKeys.detail(id) });

      // Update the list
      queryClient.setQueryData<Asset[]>(assetKeys.all, (old = []) =>
        old.filter((asset) => asset["@id"] !== id)
      );

      // Invalidate all paginated queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["assets", "list"],
        exact: false,
      });
    },
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: assetKeys.all });
      const previousAssets = queryClient.getQueryData(assetKeys.all);

      queryClient.setQueryData<Asset[]>(assetKeys.all, (old = []) =>
        old.filter((asset) => asset["@id"] !== id)
      );

      return { previousAssets };
    },
    onError: (_error, _id, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(assetKeys.all, context.previousAssets);
      }
    },
  });
}
