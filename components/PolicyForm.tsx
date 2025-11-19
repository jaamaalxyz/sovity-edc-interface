/**
 * Policy Form Component
 * Form for creating policies
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { z } from "zod";

import Button from "./Button";
import Input from "./Input";

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
  const {
    register,
    handleSubmit,
    control,
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
  } = useFieldArray({
    control,
    name: "permissions",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
  );
}
