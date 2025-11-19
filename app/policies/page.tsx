/**
 * Policies Page - Refactored with React Query and useReducer
 * Manages policy data with server state (React Query) and UI state (useReducer)
 */

"use client";

import { useCallback } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import Button from "@/components/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import PolicyCard from "@/components/PolicyCard";
import PolicyCardSkeleton from "@/components/PolicyCardSkeleton";
import PolicyDetailsModal from "@/components/PolicyDetailsModal";
import PolicyForm, { type PolicyFormData } from "@/components/PolicyForm";
import { useModalState } from "@/hooks/useModalState";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import {
  useCreatePolicy,
  useDeletePolicy,
  usePoliciesPaginated,
} from "@/hooks/usePolicies";
import { logError } from "@/lib/error-logger";
import { toast } from "@/lib/toast";
import type { PolicyDefinition } from "@/types/policy";

export default function PoliciesPage() {
  const createPolicyMutation = useCreatePolicy();
  const deletePolicyMutation = useDeletePolicy();
  const modal = useModalState<PolicyDefinition>();

  // Get initial pagination parameters
  const initialPagination = usePaginatedData<PolicyDefinition>([], {
    pageSize: 9,
    filterFn: () => true,
  });

  // Fetch policies with server-side pagination
  const {
    data: policies = [],
    isLoading,
    error,
    refetch,
  } = usePoliciesPaginated({
    limit: initialPagination.fetchLimit,
    offset: initialPagination.fetchOffset,
  });

  // Memoized filter function for policies
  const filterPolicies = useCallback(
    (policy: PolicyDefinition, query: string) => {
      const searchLower = query.toLowerCase();
      const policyId = policy["@id"].toLowerCase();
      return policyId.includes(searchLower);
    },
    []
  );

  // Apply pagination and search to fetched data
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    pageRange,
    handlePageChange,
    paginatedData: paginatedPolicies,
    filteredData: filteredPolicies,
  } = usePaginatedData<PolicyDefinition>(policies, {
    pageSize: 9,
    filterFn: filterPolicies,
  });

  // Handlers
  const handleCreatePolicy = async (data: PolicyFormData) => {
    try {
      await createPolicyMutation.mutateAsync({
        id: data.id,
        policy: {
          permissions: data.permissions.map((p) => ({
            action: p.action,
            constraints: (p.constraints || []).map((c) => ({
              leftOperand: c.leftOperand,
              operator:
                c.operator as import("@/types/policy").ConstraintOperator,
              rightOperand: c.rightOperand,
            })),
          })),
        },
      });
      toast.success(
        "Policy created successfully",
        `Policy "${data.id}" has been created.`
      );
      modal.close();
    } catch (error) {
      logError(error, "PolicyCreation", {
        policyId: data.id,
        action: "create",
      });
      toast.error(
        "Failed to create policy",
        "Please try again or check the logs for more details."
      );
    }
  };

  const handleDeletePolicy = async () => {
    if (!modal.selectedItem) return;

    const policyId = modal.selectedItem["@id"];

    try {
      await deletePolicyMutation.mutateAsync(policyId);
      toast.success(
        "Policy deleted successfully",
        `Policy "${policyId}" has been deleted.`
      );
      modal.close();
    } catch (error) {
      logError(error, "PolicyDeletion", {
        policyId: policyId,
        action: "delete",
      });
      toast.error(
        "Failed to delete policy",
        "Please try again or check the logs for more details."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          <p className="mt-1 text-gray-600">Manage your dataspace policies</p>
        </div>
        <Button onClick={modal.openCreate}>
          <FiPlus className="mr-2" />
          Create Policy
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search policies by ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorMessage
          message={(error as any)?.message || "Failed to load policies"}
          onRetry={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PolicyCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPolicies.length === 0 && !error && (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {debouncedSearchQuery
              ? "No policies match your search criteria."
              : "No policies found. Create your first policy to get started."}
          </p>
        </div>
      )}

      {/* Policies Grid */}
      {!isLoading && paginatedPolicies.length > 0 && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPolicies.map((policy) => (
              <PolicyCard
                key={policy["@id"]}
                policy={policy}
                onView={modal.openView}
                onDelete={modal.openDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            pageRange={pageRange}
          />
        </>
      )}

      {/* Create Policy Modal */}
      <Modal
        isOpen={modal.isCreateOpen}
        onClose={modal.close}
        title="Create New Policy"
        size="lg"
      >
        <PolicyForm onSubmit={handleCreatePolicy} onCancel={modal.close} />
      </Modal>

      {/* Policy Details Modal */}
      <PolicyDetailsModal
        policy={modal.selectedItem}
        isOpen={modal.isViewOpen}
        onClose={modal.close}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={modal.isDeleteOpen}
        onClose={modal.close}
        onConfirm={handleDeletePolicy}
        title="Delete Policy"
        message={`Are you sure you want to delete the policy "${modal.selectedItem?.["@id"]}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deletePolicyMutation.isPending}
      />
    </div>
  );
}
