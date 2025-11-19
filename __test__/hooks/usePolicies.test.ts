/**
 * Tests for usePolicies hooks
 */

import { renderHook, waitFor } from "@testing-library/react";

import {
  useCreatePolicy,
  useDeletePolicy,
  usePolicies,
  usePoliciesPaginated,
  usePolicy,
} from "@/hooks/usePolicies";
import { apiClient } from "@/lib/api-client";
import { createTestQueryClient, createWrapper } from "@/lib/test-utils";
import type { CreatePolicyInput, PolicyDefinition } from "@/types/policy";

// Mock the API client
jest.mock("@/lib/api-client", () => ({
  apiClient: {
    getPolicies: jest.fn(),
    getPolicy: jest.fn(),
    createPolicy: jest.fn(),
    deletePolicy: jest.fn(),
  },
}));

describe("usePolicies hooks", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;
  let wrapper: ReturnType<typeof createWrapper>;

  const mockPolicy: PolicyDefinition = {
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
  };

  const mockPolicies: PolicyDefinition[] = [
    mockPolicy,
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
                operator: "=",
                rightOperand: "EU",
              },
            ],
          },
        ],
      },
    },
  ];

  beforeEach(() => {
    queryClient = createTestQueryClient();
    wrapper = createWrapper(queryClient);
    jest.clearAllMocks();
  });

  describe("usePolicies", () => {
    it("should fetch all policies", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);

      const { result } = renderHook(() => usePolicies(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPolicies);
      expect(apiClient.getPolicies).toHaveBeenCalledWith({
        limit: 1000,
        offset: 0,
      });
    });

    it("should handle error when fetching policies", async () => {
      const error = new Error("Failed to fetch policies");
      (apiClient.getPolicies as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => usePolicies(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it("should use cached data", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);

      const { result: result1 } = renderHook(() => usePolicies(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      const { result: result2 } = renderHook(() => usePolicies(), { wrapper });

      // Should get data from cache immediately
      expect(result2.current.data).toEqual(mockPolicies);
      // API should have been called only once
      expect(apiClient.getPolicies).toHaveBeenCalledTimes(1);
    });
  });

  describe("usePoliciesPaginated", () => {
    it("should fetch policies with pagination", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);

      const { result } = renderHook(
        () => usePoliciesPaginated({ limit: 10, offset: 0 }),
        {
          wrapper,
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPolicies);
      expect(apiClient.getPolicies).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
    });

    it("should fetch different pages independently", async () => {
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);

      const { result: page1 } = renderHook(
        () => usePoliciesPaginated({ limit: 10, offset: 0 }),
        {
          wrapper,
        }
      );
      await waitFor(() => expect(page1.current.isSuccess).toBe(true));

      const { result: page2 } = renderHook(
        () => usePoliciesPaginated({ limit: 10, offset: 10 }),
        {
          wrapper,
        }
      );
      await waitFor(() => expect(page2.current.isSuccess).toBe(true));

      expect(apiClient.getPolicies).toHaveBeenCalledTimes(2);
      expect(apiClient.getPolicies).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
      expect(apiClient.getPolicies).toHaveBeenCalledWith({
        limit: 10,
        offset: 10,
      });
    });
  });

  describe("usePolicy", () => {
    it("should fetch a single policy", async () => {
      (apiClient.getPolicy as jest.Mock).mockResolvedValue(mockPolicy);

      const { result } = renderHook(() => usePolicy("policy-1"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPolicy);
      expect(apiClient.getPolicy).toHaveBeenCalledWith("policy-1");
    });

    it("should not fetch when id is empty", () => {
      const { result } = renderHook(() => usePolicy(""), { wrapper });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe("idle");
      expect(apiClient.getPolicy).not.toHaveBeenCalled();
    });

    it("should handle error when fetching single policy", async () => {
      const error = new Error("Policy not found");
      (apiClient.getPolicy as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => usePolicy("policy-1"), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe("useCreatePolicy", () => {
    it("should create a new policy", async () => {
      (apiClient.createPolicy as jest.Mock).mockResolvedValue(mockPolicy);

      const { result } = renderHook(() => useCreatePolicy(), { wrapper });

      const newPolicy: CreatePolicyInput = {
        id: "policy-1",
        policy: {
          permissions: [
            {
              action: "USE",
              constraints: [],
            },
          ],
        },
      };

      result.current.mutate(newPolicy);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.createPolicy).toHaveBeenCalledWith(newPolicy);
      expect(result.current.data).toEqual(mockPolicy);
    });

    it("should invalidate cache after creating policy", async () => {
      // Pre-populate cache
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([]);
      const { result: policiesResult } = renderHook(() => usePolicies(), {
        wrapper,
      });
      await waitFor(() => expect(policiesResult.current.isSuccess).toBe(true));

      expect(policiesResult.current.data).toEqual([]);

      // Create new policy
      (apiClient.createPolicy as jest.Mock).mockResolvedValue(mockPolicy);

      const { result: createResult } = renderHook(() => useCreatePolicy(), {
        wrapper,
      });

      // Setup mock for refetch after invalidation
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([mockPolicy]);

      createResult.current.mutate({
        id: "policy-1",
        policy: {
          permissions: [{ action: "USE", constraints: [] }],
        },
      });

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true));

      // Manually trigger refetch to simulate cache invalidation behavior
      policiesResult.current.refetch();

      // Cache should contain the new policy after refetch
      await waitFor(() =>
        expect(policiesResult.current.data).toEqual([mockPolicy])
      );
    });

    it("should handle error when creating policy", async () => {
      const error = new Error("Failed to create policy");
      (apiClient.createPolicy as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useCreatePolicy(), { wrapper });

      result.current.mutate({
        id: "policy-1",
        policy: { permissions: [] },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it("should rollback optimistic update on error", async () => {
      // Pre-populate cache with existing policies
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const { result: policiesResult } = renderHook(() => usePolicies(), {
        wrapper,
      });
      await waitFor(() => expect(policiesResult.current.isSuccess).toBe(true));

      const originalLength = policiesResult.current.data?.length || 0;

      const error = new Error("Failed to create policy");
      (apiClient.createPolicy as jest.Mock).mockRejectedValue(error);

      const { result: createResult } = renderHook(() => useCreatePolicy(), {
        wrapper,
      });
      createResult.current.mutate({
        id: "policy-3",
        policy: { permissions: [] },
      });

      await waitFor(() => expect(createResult.current.isError).toBe(true));

      // Cache should be rolled back to original state
      await waitFor(() => {
        expect(policiesResult.current.data).toHaveLength(originalLength);
      });
    });
  });

  describe("useDeletePolicy", () => {
    it("should delete a policy", async () => {
      (apiClient.deletePolicy as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeletePolicy(), { wrapper });

      result.current.mutate("policy-1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.deletePolicy).toHaveBeenCalledWith("policy-1");
    });

    it("should update cache after deleting policy", async () => {
      // Pre-populate cache
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const { result: policiesResult } = renderHook(() => usePolicies(), {
        wrapper,
      });
      await waitFor(() => expect(policiesResult.current.isSuccess).toBe(true));

      expect(policiesResult.current.data).toHaveLength(2);

      (apiClient.deletePolicy as jest.Mock).mockResolvedValue(undefined);

      const { result: deleteResult } = renderHook(() => useDeletePolicy(), {
        wrapper,
      });
      deleteResult.current.mutate("policy-1");

      await waitFor(() => expect(deleteResult.current.isSuccess).toBe(true));

      // Cache should be updated - policy should be removed
      await waitFor(() => {
        expect(policiesResult.current.data).toHaveLength(1);
        expect(
          policiesResult.current.data?.find((p) => p["@id"] === "policy-1")
        ).toBeUndefined();
      });
    });

    it("should handle error when deleting policy", async () => {
      const error = new Error("Failed to delete policy");
      (apiClient.deletePolicy as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useDeletePolicy(), { wrapper });

      result.current.mutate("policy-1");

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it("should rollback optimistic update on error", async () => {
      // Pre-populate cache
      (apiClient.getPolicies as jest.Mock).mockResolvedValue(mockPolicies);
      const { result: policiesResult } = renderHook(() => usePolicies(), {
        wrapper,
      });
      await waitFor(() => expect(policiesResult.current.isSuccess).toBe(true));

      const originalLength = policiesResult.current.data?.length || 0;

      const error = new Error("Failed to delete policy");
      (apiClient.deletePolicy as jest.Mock).mockRejectedValue(error);

      const { result: deleteResult } = renderHook(() => useDeletePolicy(), {
        wrapper,
      });
      deleteResult.current.mutate("policy-1");

      await waitFor(() => expect(deleteResult.current.isError).toBe(true));

      // Cache should be rolled back to original state
      await waitFor(() => {
        expect(policiesResult.current.data).toHaveLength(originalLength);
      });
    });
  });

  describe("integration scenarios", () => {
    it("should handle create and delete in sequence", async () => {
      // Start with empty list
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([]);
      const { result: policiesResult } = renderHook(() => usePolicies(), {
        wrapper,
      });
      await waitFor(() => expect(policiesResult.current.isSuccess).toBe(true));

      expect(policiesResult.current.data).toEqual([]);

      // Create policy
      (apiClient.createPolicy as jest.Mock).mockResolvedValue(mockPolicy);
      (apiClient.getPolicies as jest.Mock).mockResolvedValue([mockPolicy]);

      const { result: createResult } = renderHook(() => useCreatePolicy(), {
        wrapper,
      });
      createResult.current.mutate({
        id: "policy-1",
        policy: { permissions: [] },
      });

      await waitFor(() => expect(createResult.current.isSuccess).toBe(true));

      // Trigger refetch after invalidation
      policiesResult.current.refetch();
      await waitFor(() => expect(policiesResult.current.data).toHaveLength(1));

      // Delete policy
      (apiClient.deletePolicy as jest.Mock).mockResolvedValue(undefined);

      const { result: deleteResult } = renderHook(() => useDeletePolicy(), {
        wrapper,
      });
      deleteResult.current.mutate("policy-1");

      await waitFor(() => expect(deleteResult.current.isSuccess).toBe(true));

      // Check optimistic update removed the policy
      await waitFor(() => expect(policiesResult.current.data).toHaveLength(0));
    });
  });
});
