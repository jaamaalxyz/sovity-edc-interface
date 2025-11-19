/**
 * Policy Details Modal Component
 * Displays detailed information about a policy
 */

import type {
  Duty,
  Permission,
  PolicyDefinition,
  Prohibition,
} from "@/types/policy";

import Modal from "./Modal";

interface PolicyDetailsModalProps {
  policy: PolicyDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyDetailsModal({
  policy,
  isOpen,
  onClose,
}: PolicyDetailsModalProps) {
  if (!policy) return null;

  const renderPermission = (permission: Permission, index: number) => (
    <div
      key={index}
      className="rounded-lg border border-green-200 bg-green-50 p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Permission {index + 1}
        </span>
      </div>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-700">Action</dt>
          <dd className="text-sm text-gray-900">
            {typeof permission.action === "string"
              ? permission.action
              : permission.action.type}
          </dd>
        </div>
        {permission.constraint && permission.constraint.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-700">Constraints</dt>
            <dd className="text-sm text-gray-900">
              {permission.constraint.map((c, i) => (
                <div key={i} className="mt-1">
                  {c.leftOperand} {c.operator} {String(c.rightOperand)}
                </div>
              ))}
            </dd>
          </div>
        )}
        {permission.target && (
          <div>
            <dt className="text-sm font-medium text-gray-700">Target</dt>
            <dd className="text-sm text-gray-900">{permission.target}</dd>
          </div>
        )}
      </dl>
    </div>
  );

  const renderProhibition = (prohibition: Prohibition, index: number) => (
    <div key={index} className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          Prohibition {index + 1}
        </span>
      </div>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-700">Action</dt>
          <dd className="text-sm text-gray-900">
            {typeof prohibition.action === "string"
              ? prohibition.action
              : prohibition.action.type}
          </dd>
        </div>
        {prohibition.constraint && prohibition.constraint.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-700">Constraints</dt>
            <dd className="text-sm text-gray-900">
              {prohibition.constraint.map((c, i) => (
                <div key={i} className="mt-1">
                  {c.leftOperand} {c.operator} {String(c.rightOperand)}
                </div>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );

  const renderObligation = (obligation: Duty, index: number) => (
    <div
      key={index}
      className="rounded-lg border border-blue-200 bg-blue-50 p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          Obligation {index + 1}
        </span>
      </div>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-700">Action</dt>
          <dd className="text-sm text-gray-900">
            {typeof obligation.action === "string"
              ? obligation.action
              : obligation.action.type}
          </dd>
        </div>
        {obligation.constraint && obligation.constraint.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-700">Constraints</dt>
            <dd className="text-sm text-gray-900">
              {obligation.constraint.map((c, i) => (
                <div key={i} className="mt-1">
                  {c.leftOperand} {c.operator} {String(c.rightOperand)}
                </div>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Policy Details" size="lg">
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Policy ID</dt>
              <dd className="break-all text-sm text-gray-900">
                {policy["@id"]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{policy["@type"]}</dd>
            </div>
          </dl>
        </div>

        {/* Permissions */}
        {policy.policy?.permissions && policy.policy.permissions.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Permissions
            </h3>
            <div className="space-y-3">
              {policy.policy.permissions.map((permission, index) =>
                renderPermission(permission, index)
              )}
            </div>
          </div>
        )}

        {/* Prohibitions */}
        {policy.policy?.prohibitions &&
          policy.policy.prohibitions.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Prohibitions
              </h3>
              <div className="space-y-3">
                {policy.policy.prohibitions.map((prohibition, index) =>
                  renderProhibition(prohibition, index)
                )}
              </div>
            </div>
          )}

        {/* Obligations */}
        {policy.policy?.obligations && policy.policy.obligations.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Obligations
            </h3>
            <div className="space-y-3">
              {policy.policy.obligations.map((obligation, index) =>
                renderObligation(obligation, index)
              )}
            </div>
          </div>
        )}

        {/* Raw Policy JSON */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Raw Policy
          </h3>
          <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs">
            {JSON.stringify(policy, null, 2)}
          </pre>
        </div>
      </div>
    </Modal>
  );
}
