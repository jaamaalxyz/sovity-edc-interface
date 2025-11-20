"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiBookOpen, FiEdit3, FiPlus, FiTrash2 } from "react-icons/fi";
import { z } from "zod";

import type { PolicyTemplate } from "@/lib/policy-templates";

import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import PolicyTemplateSelector from "./PolicyTemplateSelector";

export const constraintSchema = z.object({
  leftOperand: z.string().min(1, "Left operand is required"),
  operator: z.string().min(1, "Operator is required"),
  rightOperand: z.string().min(1, "Right operand is required"),
});

export const permissionSchema = z.object({
  action: z.string().min(1, "Action is required"),
  constraints: z.array(constraintSchema).optional(),
});

export const policySchema = z.object({
  id: z.string().min(1, "Policy ID is required"),
  permissions: z
    .array(permissionSchema)
    .min(1, "At least one permission is required"),
});

export type PolicyFormData = z.infer<typeof policySchema>;

interface PolicyFormProps {
  onSubmit: (data: PolicyFormData) => Promise<void>;
  onCancel: () => void;
}

export default function PolicyForm({ onSubmit, onCancel }: PolicyFormProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PolicyTemplate | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      permissions: [{ action: "use", constraints: [] }],
    },
  });

  const {
    fields: permissions,
    append: appendPermission,
    remove: removePermission,
    replace: replacePermissions,
  } = useFieldArray({
    control,
    name: "permissions",
  });

  // Handle template selection
  const handleTemplateSelect = (template: PolicyTemplate) => {
    // Generate a policy ID based on template
    const policyId = `${template.id}-${Date.now()}`;
    setValue("id", policyId);

    // Convert template permissions to form data
    const formPermissions = template.permissions.map((permission) => ({
      action: permission.action,
      constraints:
        permission.constraints?.map((constraint) => ({
          leftOperand: constraint.leftOperand,
          operator: constraint.operator,
          rightOperand: String(constraint.rightOperand),
        })) || [],
    }));

    replacePermissions(formPermissions);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Template Selection Banner */}
        {selectedTemplate && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedTemplate.icon}</span>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    Using Template: {selectedTemplate.name}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedTemplate(null);
                  setShowTemplateSelector(true);
                }}
              >
                <FiEdit3 className="mr-1" />
                Change
              </Button>
            </div>
          </div>
        )}

        {/* Template Button */}
        {!selectedTemplate && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  Start with a Template
                </h4>
                <p className="text-sm text-gray-600">
                  Choose from pre-configured policy templates for common use
                  cases
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowTemplateSelector(true)}
              >
                <FiBookOpen className="mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        )}
        <Input
          label="Policy ID"
          {...register("id")}
          error={errors.id?.message}
          required
          helperText="Unique identifier for the policy"
        />

        <fieldset>
          <div className="mb-3 flex items-center justify-between">
            <legend className="block text-sm font-medium text-gray-700">
              Permissions{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </legend>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => appendPermission({ action: "", constraints: [] })}
            >
              <FiPlus className="mr-1" aria-hidden="true" />
              Add Permission
            </Button>
          </div>

          <div className="space-y-4" role="list">
            {permissions.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-gray-200 p-4"
                role="listitem"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h4 className="text-sm font-medium text-gray-700">
                    Permission {index + 1}
                  </h4>
                  {permissions.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removePermission(index)}
                      aria-label={`Remove permission ${index + 1}`}
                    >
                      <FiTrash2
                        className="size-4 text-red-600"
                        aria-hidden="true"
                      />
                    </Button>
                  )}
                </div>

                <Input
                  label="Action"
                  {...register(`permissions.${index}.action`)}
                  error={errors.permissions?.[index]?.action?.message}
                  required
                  placeholder="e.g., use, transfer, display"
                  helperText="The action permitted by this permission"
                />
              </div>
            ))}
          </div>

          {errors.permissions?.message && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.permissions.message}
            </p>
          )}
        </fieldset>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create Policy
          </Button>
        </div>
      </form>

      {/* Template Selector Modal */}
      <Modal
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        title="Choose a Policy Template"
        size="xl"
      >
        <PolicyTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onCancel={() => setShowTemplateSelector(false)}
        />
      </Modal>
    </>
  );
}
