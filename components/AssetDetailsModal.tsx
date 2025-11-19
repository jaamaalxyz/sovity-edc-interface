/**
 * Asset Details Modal Component
 * Displays detailed information about an asset including associated contracts
 */

"use client";

import { useMemo } from "react";
import { MdLink, MdPolicy } from "react-icons/md";

import { useContracts } from "@/hooks/useContracts";
import type { Asset } from "@/types/asset";
import type { ContractDefinition } from "@/types/contract";

import Modal from "./Modal";

interface AssetDetailsModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetDetailsModal({
  asset,
  isOpen,
  onClose,
}: AssetDetailsModalProps) {
  // Fetch all contracts to find associated ones
  const { data: allContracts = [] } = useContracts();

  // Find contracts that reference this asset
  const associatedContracts = useMemo(() => {
    if (!asset) return [];

    return allContracts.filter((contract: ContractDefinition) => {
      // Defensive check: ensure assetsSelector exists and is an array
      if (
        !contract.assetsSelector ||
        !Array.isArray(contract.assetsSelector) ||
        contract.assetsSelector.length === 0
      )
        return false;

      // Check if any asset selector matches this asset
      return contract.assetsSelector.some((selector) => {
        // Defensive check: ensure selector has required properties
        if (!selector || typeof selector !== "object") return false;

        const assetId = asset["@id"];
        const operandLeft = selector.operandLeft;
        const operator = selector.operator;
        const operandRight = selector.operandRight;

        // Handle different selector types
        if (
          operandLeft === "https://w3id.org/edc/v0.0.1/ns/id" ||
          operandLeft?.includes("/id")
        ) {
          // ID-based selector
          if (operator === "=") {
            return assetId === operandRight;
          } else if (operator === "in") {
            return operandRight?.includes(assetId);
          }
        }

        // Could add more sophisticated matching here
        return false;
      });
    });
  }, [asset, allContracts]);

  if (!asset) return null;

  const renderProperty = (
    label: string,
    value: string | number | boolean | undefined
  ) => {
    if (value === undefined || value === null || value === "") return null;

    return (
      <div className="border-b border-gray-200 py-3 last:border-0">
        <dt className="mb-1 text-sm font-medium text-gray-500">{label}</dt>
        <dd className="break-all text-sm text-gray-900">{String(value)}</dd>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asset Details" size="lg">
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
          <dl className="divide-y divide-gray-200">
            {renderProperty("Asset ID", asset["@id"])}
            {renderProperty("Type", asset["@type"])}
            {renderProperty(
              "Name",
              asset.properties?.["asset:prop:name"] || asset.properties?.name
            )}
            {renderProperty(
              "Description",
              asset.properties?.["asset:prop:description"] ||
                asset.properties?.description
            )}
            {renderProperty(
              "Content Type",
              asset.properties?.["asset:prop:contenttype"] ||
                asset.properties?.contentType
            )}
            {renderProperty(
              "Version",
              asset.properties?.["asset:prop:version"] ||
                asset.properties?.version
            )}
            {renderProperty(
              "Created At",
              asset.createdAt
                ? new Date(asset.createdAt).toLocaleString()
                : undefined
            )}
          </dl>
        </div>

        {/* Properties */}
        {asset.properties && Object.keys(asset.properties).length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Properties
            </h3>
            <dl className="divide-y divide-gray-200">
              {Object.entries(asset.properties).map(([key, value]) => (
                <div key={key} className="py-3">
                  <dt className="mb-1 text-sm font-medium text-gray-500">
                    {key}
                  </dt>
                  <dd className="break-all text-sm text-gray-900">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Data Address */}
        {asset.dataAddress && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Data Address
            </h3>
            <dl className="divide-y divide-gray-200">
              {Object.entries(asset.dataAddress).map(([key, value]) => (
                <div key={key} className="py-3">
                  <dt className="mb-1 text-sm font-medium text-gray-500">
                    {key}
                  </dt>
                  <dd className="break-all text-sm text-gray-900">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Associated Contracts & Policies */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MdLink className="text-purple-600" size={20} />
            Associated Contracts & Policies
          </h3>
          {associatedContracts.length > 0 ? (
            <div className="space-y-3">
              {associatedContracts.map((contract) => (
                <div
                  key={contract["@id"]}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <MdLink className="text-purple-600" size={18} />
                    <span className="break-all text-sm font-medium text-gray-900">
                      {contract["@id"]}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MdPolicy className="mt-0.5 text-green-600" size={16} />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">
                          Access Policy:
                        </span>
                        <div className="mt-1 break-all rounded bg-white px-2 py-1 text-xs text-gray-900">
                          {contract.accessPolicyId}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MdPolicy className="mt-0.5 text-blue-600" size={16} />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">
                          Contract Policy:
                        </span>
                        <div className="mt-1 break-all rounded bg-white px-2 py-1 text-xs text-gray-900">
                          {contract.contractPolicyId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
              No contracts are currently associated with this asset.
              <p className="mt-1 text-xs">
                Create a contract definition to link this asset with policies.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
