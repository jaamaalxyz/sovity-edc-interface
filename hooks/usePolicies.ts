/**
 * Custom hooks for Policy data fetching and mutations
 * Uses React Query for server state management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { QuerySpec } from "@/types/api";
import type { CreatePolicyInput, PolicyDefinition } from "@/types/policy";

// Query keys for caching
export const policyKeys = {
  all: ["policies"] as const,
  list: (params: QuerySpec) => ["policies", "list", params] as const,
  detail: (id: string) => ["policies", id] as const,
};

/**
 * Fetch all policies (without pagination - for backward compatibility)
 */
export function usePolicies() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: () => apiClient.getPolicies({ limit: 1000, offset: 0 }),
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch policies with pagination and filtering (server-side)
 */
export function usePoliciesPaginated(querySpec: QuerySpec = {}) {
  return useQuery({
    queryKey: policyKeys.list(querySpec),
    queryFn: () => apiClient.getPolicies(querySpec),
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Keep previous data while fetching new page
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single policy by ID
 */
export function usePolicy(id: string) {
  return useQuery({
    queryKey: policyKeys.detail(id),
    queryFn: () => apiClient.getPolicy(id),
    enabled: !!id,
  });
}

/**
 * Create a new policy
 */
export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policy: CreatePolicyInput) => apiClient.createPolicy(policy),
    onSuccess: (newPolicy) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.all });
      queryClient.setQueryData(policyKeys.detail(newPolicy["@id"]), newPolicy);

      // Invalidate all paginated queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["policies", "list"],
        exact: false,
      });
    },
    // Optimistic update
    onMutate: async (newPolicy) => {
      await queryClient.cancelQueries({ queryKey: policyKeys.all });
      const previousPolicies = queryClient.getQueryData(policyKeys.all);

      queryClient.setQueryData<PolicyDefinition[]>(
        policyKeys.all,
        (old = []) => [
          {
            "@id": newPolicy.id,
            "@type": "PolicyDefinition",
            policy: newPolicy.policy,
          } as PolicyDefinition,
          ...old,
        ]
      );

      return { previousPolicies };
    },
    onError: (_error, _newPolicy, context) => {
      if (context?.previousPolicies) {
        queryClient.setQueryData(policyKeys.all, context.previousPolicies);
      }
    },
  });
}

/**
 * Delete a policy
 */
export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deletePolicy(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: policyKeys.detail(id) });
      queryClient.setQueryData<PolicyDefinition[]>(policyKeys.all, (old = []) =>
        old.filter((policy) => policy["@id"] !== id)
      );

      // Invalidate all paginated queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["policies", "list"],
        exact: false,
      });
    },
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: policyKeys.all });
      const previousPolicies = queryClient.getQueryData(policyKeys.all);

      queryClient.setQueryData<PolicyDefinition[]>(policyKeys.all, (old = []) =>
        old.filter((policy) => policy["@id"] !== id)
      );

      return { previousPolicies };
    },
    onError: (_error, _id, context) => {
      if (context?.previousPolicies) {
        queryClient.setQueryData(policyKeys.all, context.previousPolicies);
      }
    },
  });
}
