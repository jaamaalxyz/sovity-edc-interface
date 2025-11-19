/**
 * Contracts Page
 * Manages contract definitions that link assets to policies
 */

"use client";

import { useCallback } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import Button from "@/components/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import ContractCard from "@/components/ContractCard";
import ContractCardSkeleton from "@/components/ContractCardSkeleton";
import ContractDetailsModal from "@/components/ContractDetailsModal";
import ContractForm, { type ContractFormData } from "@/components/ContractForm";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useAssets } from "@/hooks/useAssets";
import {
  useContractsPaginated,
  useCreateContract,
  useDeleteContract,
} from "@/hooks/useContracts";
import { useModalState } from "@/hooks/useModalState";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { usePolicies } from "@/hooks/usePolicies";
import { logError } from "@/lib/error-logger";
import { toast } from "@/lib/toast";
import type { ContractDefinition } from "@/types/contract";

export default function ContractsPage() {
  const createContractMutation = useCreateContract();
  const deleteContractMutation = useDeleteContract();
  const modal = useModalState<ContractDefinition>();

  // Fetch assets and policies for the form
  const { data: assets = [] } = useAssets();
  const { data: policies = [] } = usePolicies();

  // Get initial pagination parameters
  const initialPagination = usePaginatedData<ContractDefinition>([], {
    pageSize: 9,
    filterFn: () => true,
  });

  // Fetch contracts with server-side pagination
  const {
    data: contracts = [],
    isLoading,
    error,
    refetch,
  } = useContractsPaginated({
    limit: initialPagination.fetchLimit,
    offset: initialPagination.fetchOffset,
  });

  // Memoized filter function for contracts
  const filterContracts = useCallback(
    (contract: ContractDefinition, query: string) => {
      const searchLower = query.toLowerCase();
      const contractId = contract["@id"].toLowerCase();
      const accessPolicyId = contract.accessPolicyId.toLowerCase();
      const contractPolicyId = contract.contractPolicyId.toLowerCase();

      return (
        contractId.includes(searchLower) ||
        accessPolicyId.includes(searchLower) ||
        contractPolicyId.includes(searchLower)
      );
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
    paginatedData: paginatedContracts,
    filteredData: filteredContracts,
  } = usePaginatedData<ContractDefinition>(contracts, {
    pageSize: 9,
    filterFn: filterContracts,
  });

  // Handlers
  const handleCreateContract = async (data: ContractFormData) => {
    try {
      await createContractMutation.mutateAsync({
        id: data.id,
        accessPolicyId: data.accessPolicyId,
        contractPolicyId: data.contractPolicyId,
        assetsSelector: data.assetsSelector,
      });
      toast.success(
        "Contract created successfully",
        `Contract "${data.id}" has been created.`
      );
      modal.close();
    } catch (error) {
      logError(error, "ContractCreation", {
        contractId: data.id,
        action: "create",
      });
      toast.error(
        "Failed to create contract",
        "Please try again or check the logs for more details."
      );
    }
  };

  const handleDeleteContract = async () => {
    if (!modal.selectedItem) return;

    const contractId = modal.selectedItem["@id"];

    try {
      await deleteContractMutation.mutateAsync(contractId);
      toast.success(
        "Contract deleted successfully",
        `Contract "${contractId}" has been deleted.`
      );
      modal.close();
    } catch (error) {
      logError(error, "ContractDeletion", {
        contractId,
        action: "delete",
      });
      toast.error(
        "Failed to delete contract",
        "Please try again or check the logs for more details."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contract Definitions
          </h1>
          <p className="mt-1 text-gray-600">
            Link assets to policies for data sharing
          </p>
        </div>
        <Button onClick={modal.openCreate}>
          <FiPlus className="mr-2" />
          Create Contract
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search contracts by ID or policy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorMessage
          message={(error as any)?.message || "Failed to load contracts"}
          onRetry={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ContractCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredContracts.length === 0 && !error && (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {debouncedSearchQuery
              ? "No contracts match your search criteria."
              : "No contracts found. Create your first contract to link assets and policies."}
          </p>
          {policies.length === 0 && !debouncedSearchQuery && (
            <p className="mt-2 text-sm text-amber-600">
              Note: You need to create policies first before creating contracts.
            </p>
          )}
        </div>
      )}

      {/* Contracts Grid */}
      {!isLoading && paginatedContracts.length > 0 && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedContracts.map((contract) => (
              <ContractCard
                key={contract["@id"]}
                contract={contract}
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

      {/* Create Contract Modal */}
      <Modal
        isOpen={modal.isCreateOpen}
        onClose={modal.close}
        title="Create Contract Definition"
        size="lg"
      >
        <ContractForm
          onSubmit={handleCreateContract}
          onCancel={modal.close}
          policies={policies}
          assets={assets}
        />
      </Modal>

      {/* Contract Details Modal */}
      <ContractDetailsModal
        contract={modal.selectedItem}
        isOpen={modal.isViewOpen}
        onClose={modal.close}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={modal.isDeleteOpen}
        onClose={modal.close}
        onConfirm={handleDeleteContract}
        title="Delete Contract"
        message={`Are you sure you want to delete the contract "${modal.selectedItem?.["@id"]}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteContractMutation.isPending}
      />
    </div>
  );
}
