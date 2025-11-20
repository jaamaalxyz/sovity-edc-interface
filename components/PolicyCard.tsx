import { FiShield, FiTrash2 } from "react-icons/fi";

import type { PolicyDefinition } from "@/types/policy";

import Button from "./Button";
import Card, { CardBody } from "./Card";

interface PolicyCardProps {
  policy: PolicyDefinition;
  onView: (policy: PolicyDefinition) => void;
  onDelete: (policy: PolicyDefinition) => void;
}

export default function PolicyCard({
  policy,
  onView,
  onDelete,
}: PolicyCardProps) {
  const policyId = policy["@id"];
  const permissions = policy.policy?.permissions || [];
  const prohibitions = policy.policy?.prohibitions || [];
  const obligations = policy.policy?.obligations || [];

  const totalRules =
    permissions.length + prohibitions.length + obligations.length;

  return (
    <Card className="h-full">
      <CardBody>
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-1 items-start gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <FiShield className="size-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-gray-900">
                {policyId}
              </h3>
              <p className="text-sm text-gray-500">Policy Definition</p>
            </div>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          {permissions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                {permissions.length} Permission
                {permissions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {prohibitions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {prohibitions.length} Prohibition
                {prohibitions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {obligations.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {obligations.length} Obligation
                {obligations.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {totalRules === 0 && (
          <p className="mb-4 text-sm text-gray-500">No rules defined</p>
        )}

        <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(policy)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(policy)}
            aria-label={`Delete policy ${policyId}`}
          >
            <FiTrash2 className="size-4 text-red-600" aria-hidden="true" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
