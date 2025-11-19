/**
 * Contract Details Modal Component
 * Displays detailed information about a contract definition
 */

"use client";

import { MdClose, MdLink, MdPolicy } from "react-icons/md";

import type { ContractDefinition } from "@/types/contract";

import Button from "./Button";
import Modal from "./Modal";

interface ContractDetailsModalProps {
  contract: ContractDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractDetailsModal({
  contract,
  isOpen,
  onClose,
}: ContractDetailsModalProps) {
  if (!contract) return null;

  const contractId = contract["@id"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contract Definition Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Contract ID */}
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MdLink className="text-blue-600" size={18} />
            Contract ID
          </h3>
          <div className="rounded-lg bg-gray-50 p-3">
            <code className="break-all text-sm text-gray-900">
              {contractId}
            </code>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MdPolicy className="text-green-600" size={18} />
            Associated Policies
          </h3>
          <div className="space-y-3">
            {/* Access Policy */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                Access Policy
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Access
                </span>
                <code className="break-all text-sm text-gray-900">
                  {contract.accessPolicyId}
                </code>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Defines who can access the assets in this contract
              </p>
            </div>

            {/* Contract Policy */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                Contract Policy
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  Contract
                </span>
                <code className="break-all text-sm text-gray-900">
                  {contract.contractPolicyId}
                </code>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Defines the terms and conditions of the contract
              </p>
            </div>
          </div>
        </div>

        {/* Asset Selectors */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Asset Selectors
          </h3>
          <div className="space-y-3">
            {contract.assetsSelector && contract.assetsSelector.length > 0 ? (
              contract.assetsSelector.map((selector, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-2 text-xs font-medium text-gray-500">
                    Selector {index + 1}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">
                        Property:
                      </span>
                      <code className="break-all rounded bg-white px-2 py-1 text-xs text-gray-900">
                        {selector.operandLeft}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">
                        Operator:
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {selector.operator}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Value:</span>
                      <code className="break-all rounded bg-white px-2 py-1 text-xs text-gray-900">
                        {selector.operandRight}
                      </code>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                No asset selectors defined
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        {contract.createdAt && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Metadata
            </h3>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Created:</span>{" "}
                {new Date(contract.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <Button onClick={onClose} variant="ghost">
            <MdClose size={18} />
            <span>Close</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
