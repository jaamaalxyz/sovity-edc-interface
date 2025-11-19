/**
 * Assets Page - Refactored with React Query and useReducer
 * Manages asset data with server state (React Query) and UI state (useReducer)
 */

"use client";

import { useCallback } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import AssetCard from "@/components/AssetCard";
import AssetCardSkeleton from "@/components/AssetCardSkeleton";
import AssetDetailsModal from "@/components/AssetDetailsModal";
import AssetForm, { type AssetFormData } from "@/components/AssetForm";
import Button from "@/components/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import {
  useAssetsPaginated,
  useCreateAsset,
  useDeleteAsset,
  useUpdateAsset,
} from "@/hooks/useAssets";
import { useModalState } from "@/hooks/useModalState";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { logError } from "@/lib/error-logger";
import { toast } from "@/lib/toast";
import type { Asset } from "@/types/asset";

export default function AssetsPage() {
  const createAssetMutation = useCreateAsset();
  const updateAssetMutation = useUpdateAsset();
  const deleteAssetMutation = useDeleteAsset();
  const modal = useModalState<Asset>();

  // Get initial pagination parameters
  const initialPagination = usePaginatedData<Asset>([], {
    pageSize: 9,
    filterFn: () => true,
  });

  // Fetch assets with server-side pagination
  const {
    data: assets = [],
    isLoading,
    error,
    refetch,
  } = useAssetsPaginated({
    limit: initialPagination.fetchLimit,
    offset: initialPagination.fetchOffset,
  });

  // Memoized filter function for assets
  const filterAssets = useCallback((asset: Asset, query: string) => {
    const searchLower = query.toLowerCase();
    const assetId = asset["@id"].toLowerCase();
    const name = (
      asset.properties?.["asset:prop:name"] ||
      asset.properties?.name ||
      ""
    )
      .toString()
      .toLowerCase();
    const description = (
      asset.properties?.["asset:prop:description"] ||
      asset.properties?.description ||
      ""
    )
      .toString()
      .toLowerCase();

    return (
      assetId.includes(searchLower) ||
      name.includes(searchLower) ||
      description.includes(searchLower)
    );
  }, []);

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
    paginatedData: paginatedAssets,
    filteredData: filteredAssets,
  } = usePaginatedData<Asset>(assets, {
    pageSize: 9,
    filterFn: filterAssets,
  });

  // Handlers
  const handleCreateAsset = async (data: AssetFormData) => {
    try {
      await createAssetMutation.mutateAsync({
        id: data.id,
        properties: {
          name: data.name,
          description: data.description,
          contentType: data.contentType,
          version: data.version,
        },
        dataAddress: {
          type: data.dataAddressType,
          baseUrl: data.baseUrl,
        },
      });
      toast.success(
        "Asset created successfully",
        `Asset "${data.name}" has been created.`
      );
      modal.close();
    } catch (error) {
      logError(error, "AssetCreation", {
        assetId: data.id,
        action: "create",
      });
      toast.error(
        "Failed to create asset",
        "Please try again or check the logs for more details."
      );
    }
  };

  const handleUpdateAsset = async (data: AssetFormData) => {
    if (!modal.selectedItem) return;

    try {
      await updateAssetMutation.mutateAsync({
        id: modal.selectedItem["@id"],
        updates: {
          properties: {
            name: data.name,
            description: data.description,
            contentType: data.contentType,
            version: data.version,
          },
          dataAddress: {
            "@type": "DataAddress",
            type: data.dataAddressType,
            baseUrl: data.baseUrl,
          },
        },
      });
      toast.success(
        "Asset updated successfully",
        `Asset "${data.name}" has been updated.`
      );
      modal.close();
    } catch (error) {
      logError(error, "AssetUpdate", {
        assetId: modal.selectedItem["@id"],
        action: "update",
      });
      toast.error(
        "Failed to update asset",
        "Please try again or check the logs for more details."
      );
    }
  };

  const handleDeleteAsset = async () => {
    if (!modal.selectedItem) return;

    const assetName =
      modal.selectedItem.properties?.["asset:prop:name"] ||
      modal.selectedItem.properties?.name ||
      modal.selectedItem["@id"];

    try {
      await deleteAssetMutation.mutateAsync(modal.selectedItem["@id"]);
      toast.success(
        "Asset deleted successfully",
        `Asset "${assetName}" has been deleted.`
      );
      modal.close();
    } catch (error) {
      logError(error, "AssetDeletion", {
        assetId: modal.selectedItem["@id"],
        action: "delete",
      });
      toast.error(
        "Failed to delete asset",
        "Please try again or check the logs for more details."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
          <p className="mt-1 text-gray-600">Manage your dataspace assets</p>
        </div>
        <Button onClick={modal.openCreate}>
          <FiPlus className="mr-2" />
          Create Asset
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search assets by ID, name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorMessage
          message={(error as any)?.message || "Failed to load assets"}
          onRetry={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <AssetCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAssets.length === 0 && !error && (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {debouncedSearchQuery
              ? "No assets match your search criteria."
              : "No assets found. Create your first asset to get started."}
          </p>
        </div>
      )}

      {/* Assets Grid */}
      {!isLoading && paginatedAssets.length > 0 && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedAssets.map((asset) => (
              <AssetCard
                key={asset["@id"]}
                asset={asset}
                onView={modal.openView}
                onEdit={modal.openEdit}
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

      {/* Create Asset Modal */}
      <Modal
        isOpen={modal.isCreateOpen}
        onClose={modal.close}
        title="Create New Asset"
        size="lg"
      >
        <AssetForm onSubmit={handleCreateAsset} onCancel={modal.close} />
      </Modal>

      {/* Edit Asset Modal */}
      <Modal
        isOpen={modal.isEditOpen}
        onClose={modal.close}
        title="Edit Asset"
        size="lg"
      >
        {modal.selectedItem && (
          <AssetForm
            asset={modal.selectedItem}
            onSubmit={handleUpdateAsset}
            onCancel={modal.close}
            isEdit
          />
        )}
      </Modal>

      {/* Asset Details Modal */}
      <AssetDetailsModal
        asset={modal.selectedItem}
        isOpen={modal.isViewOpen}
        onClose={modal.close}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={modal.isDeleteOpen}
        onClose={modal.close}
        onConfirm={handleDeleteAsset}
        title="Delete Asset"
        message={`Are you sure you want to delete the asset "${
          modal.selectedItem?.properties?.["asset:prop:name"] ||
          modal.selectedItem?.properties?.name ||
          modal.selectedItem?.["@id"]
        }"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteAssetMutation.isPending}
      />
    </div>
  );
}
