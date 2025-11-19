/**
 * React Query hooks for Contract Definition management
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { logError } from "@/lib/error-logger";
import type { ApiError, QuerySpec } from "@/types/api";
import type {
  ContractDefinition,
  CreateContractInput,
  UpdateContractInput,
} from "@/types/contract";

// Query key factory for contracts
export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (params?: QuerySpec) => [...contractKeys.lists(), params] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
};

/**
 * Hook to fetch all contracts with optional query specification
 */
export function useContracts(
  querySpec?: QuerySpec
): UseQueryResult<ContractDefinition[], ApiError> {
  return useQuery({
    queryKey: contractKeys.list(querySpec),
    queryFn: async () => {
      try {
        return await apiClient.getContracts(querySpec);
      } catch (error) {
        logError(error as Error, "useContracts", { querySpec });
        throw error;
      }
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch contracts with pagination support
 */
export function useContractsPaginated(querySpec?: QuerySpec) {
  return useQuery({
    queryKey: contractKeys.list(querySpec),
    queryFn: async () => {
      try {
        return await apiClient.getContracts(querySpec);
      } catch (error) {
        logError(error as Error, "useContractsPaginated", { querySpec });
        throw error;
      }
    },
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single contract by ID
 */
export function useContract(
  id: string,
  options?: { enabled?: boolean }
): UseQueryResult<ContractDefinition, ApiError> {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: async () => {
      try {
        return await apiClient.getContract(id);
      } catch (error) {
        logError(error as Error, "useContract", { contractId: id });
        throw error;
      }
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: 30000,
  });
}

/**
 * Hook to create a new contract
 */
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractInput: CreateContractInput) => {
      try {
        return await apiClient.createContract(contractInput);
      } catch (error) {
        logError(error as Error, "useCreateContract", { contractInput });
        throw error;
      }
    },
    onMutate: async (newContract) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: contractKeys.lists() });

      // Snapshot the previous value
      const previousContracts = queryClient.getQueryData(contractKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData<ContractDefinition[]>(
        contractKeys.lists(),
        (old = []) => [
          ...old,
          {
            "@id": newContract.id,
            "@type": "ContractDefinition",
            accessPolicyId: newContract.accessPolicyId,
            contractPolicyId: newContract.contractPolicyId,
            assetsSelector: newContract.assetsSelector,
            createdAt: Date.now(),
          },
        ]
      );

      return { previousContracts };
    },
    onError: (error: ApiError, _variables, context) => {
      // Rollback on error
      if (context?.previousContracts) {
        queryClient.setQueryData(
          contractKeys.lists(),
          context.previousContracts
        );
      }
      toast.error(`Failed to create contract: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Contract created successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing contract
 */
export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateContractInput;
    }) => {
      try {
        return await apiClient.updateContract(id, updates);
      } catch (error) {
        logError(error as Error, "useUpdateContract", {
          contractId: id,
          updates,
        });
        throw error;
      }
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: contractKeys.detail(id) });

      // Snapshot the previous value
      const previousContract = queryClient.getQueryData(
        contractKeys.detail(id)
      );

      // Optimistically update the cache
      queryClient.setQueryData<ContractDefinition>(
        contractKeys.detail(id),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            ...updates,
          };
        }
      );

      return { previousContract };
    },
    onError: (error: ApiError, { id }, context) => {
      // Rollback on error
      if (context?.previousContract) {
        queryClient.setQueryData(
          contractKeys.detail(id),
          context.previousContract
        );
      }
      toast.error(`Failed to update contract: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Contract updated successfully");
    },
    onSettled: (_data, _error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
}

/**
 * Hook to delete a contract
 */
export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.deleteContract(id);
      } catch (error) {
        logError(error as Error, "useDeleteContract", { contractId: id });
        throw error;
      }
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: contractKeys.lists() });

      // Snapshot the previous value
      const previousContracts = queryClient.getQueryData(contractKeys.lists());

      // Optimistically remove from the list
      queryClient.setQueryData<ContractDefinition[]>(
        contractKeys.lists(),
        (old = []) => old.filter((contract) => contract["@id"] !== id)
      );

      return { previousContracts };
    },
    onError: (error: ApiError, _id, context) => {
      // Rollback on error
      if (context?.previousContracts) {
        queryClient.setQueryData(
          contractKeys.lists(),
          context.previousContracts
        );
      }
      toast.error(`Failed to delete contract: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Contract deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
}
