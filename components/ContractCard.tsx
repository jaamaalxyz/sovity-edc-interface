"use client";

import { FiTrash2 } from "react-icons/fi";
import { MdLink, MdPolicy, MdVisibility } from "react-icons/md";

import type { ContractDefinition } from "@/types/contract";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";

interface ContractCardProps {
  contract: ContractDefinition;
  onView: (contract: ContractDefinition) => void;
  onDelete: (contract: ContractDefinition) => void;
}

export default function ContractCard({
  contract,
  onView,
  onDelete,
}: ContractCardProps) {
  const contractId = contract["@id"];
  const assetSelectorsCount = contract.assetsSelector?.length || 0;

  return (
    <Card
      className="transition-all hover:shadow-md"
      data-testid="contract-card"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <MdLink className="text-blue-600" size={20} />
              <h3
                className="truncate text-lg font-semibold text-gray-900"
                title={contractId}
              >
                {contractId}
              </h3>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {/* Policy Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MdPolicy className="text-green-600" size={16} />
            <span className="font-medium text-gray-700">Access Policy:</span>
            <span
              className="truncate text-gray-600"
              title={contract.accessPolicyId}
            >
              {contract.accessPolicyId}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MdPolicy className="text-blue-600" size={16} />
            <span className="font-medium text-gray-700">Contract Policy:</span>
            <span
              className="truncate text-gray-600"
              title={contract.contractPolicyId}
            >
              {contract.contractPolicyId}
            </span>
          </div>
        </div>

        {/* Asset Selectors */}
        <div className="flex items-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
            {assetSelectorsCount} Asset Selector
            {assetSelectorsCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <Button
            variant="ghost"
            onClick={() => onView(contract)}
            className="flex-1"
            data-testid="view-contract-button"
          >
            <MdVisibility size={18} />
            <span>View Details</span>
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(contract)}
            data-testid="delete-contract-button"
          >
            <FiTrash2 size={16} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
