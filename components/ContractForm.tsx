/**
 * Contract Form Component
 * Form for creating contract definitions
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { z } from "zod";

import type { Asset } from "@/types/asset";
import type { AssetSelector } from "@/types/contract";
import type { PolicyDefinition } from "@/types/policy";

import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

const assetSelectorSchema = z.object({
  operandLeft: z.string().min(1, "Left operand is required"),
  operator: z.string().min(1, "Operator is required"),
  operandRight: z.string().min(1, "Right operand is required"),
});

export const contractSchema = z.object({
  id: z.string().min(1, "Contract ID is required"),
  accessPolicyId: z.string().min(1, "Access policy is required"),
  contractPolicyId: z.string().min(1, "Contract policy is required"),
  assetsSelector: z
    .array(assetSelectorSchema)
    .min(1, "At least one asset selector is required"),
});

export type ContractFormData = z.infer<typeof contractSchema>;

interface ContractFormProps {
  onSubmit: (data: ContractFormData) => Promise<void>;
  onCancel: () => void;
  policies?: PolicyDefinition[];
  assets?: Asset[];
}

const OPERATORS = [
  { value: "=", label: "Equals (=)" },
  { value: "in", label: "In" },
  { value: "like", label: "Like" },
];

const COMMON_OPERANDS = [
  { value: "https://w3id.org/edc/v0.0.1/ns/id", label: "Asset ID" },
  {
    value: "https://w3id.org/edc/v0.0.1/ns/name",
    label: "Asset Name",
  },
  {
    value: "https://w3id.org/edc/v0.0.1/ns/contenttype",
    label: "Content Type",
  },
];

export default function ContractForm({
  onSubmit,
  onCancel,
  policies = [],
  assets = [],
}: ContractFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      assetsSelector: [
        {
          operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
          operator: "=",
          operandRight: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assetsSelector",
  });

  const policyOptions = policies.map((policy) => ({
    value: policy["@id"],
    label: policy["@id"],
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contract ID */}
      <Input
        label="Contract Definition ID"
        {...register("id")}
        error={errors.id?.message}
        required
        placeholder="contract-definition-1"
        helperText="Unique identifier for this contract definition"
      />

      {/* Access Policy Selection */}
      <Controller
        name="accessPolicyId"
        control={control}
        render={({ field }) => (
          <Select
            label="Access Policy"
            {...field}
            options={policyOptions}
            error={errors.accessPolicyId?.message}
            required
            placeholder="Select an access policy"
            helperText="Policy that controls who can access the assets"
          />
        )}
      />

      {/* Contract Policy Selection */}
      <Controller
        name="contractPolicyId"
        control={control}
        render={({ field }) => (
          <Select
            label="Contract Policy"
            {...field}
            options={policyOptions}
            error={errors.contractPolicyId?.message}
            required
            placeholder="Select a contract policy"
            helperText="Policy that defines the contract terms"
          />
        )}
      />

      {/* Asset Selectors */}
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="mb-3 px-2 text-sm font-semibold text-gray-900">
          Asset Selectors
        </legend>
        <p className="mb-4 text-sm text-gray-600">
          Define criteria to select which assets this contract applies to
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  Selector {index + 1}
                </h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 size={16} />
                    <span>Remove</span>
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {/* Left Operand */}
                <Controller
                  name={`assetsSelector.${index}.operandLeft`}
                  control={control}
                  render={({ field: operandField }) => (
                    <Select
                      label="Property"
                      {...operandField}
                      options={COMMON_OPERANDS}
                      error={
                        errors.assetsSelector?.[index]?.operandLeft?.message
                      }
                      required
                      helperText="Asset property to match"
                    />
                  )}
                />

                {/* Operator */}
                <Controller
                  name={`assetsSelector.${index}.operator`}
                  control={control}
                  render={({ field: operatorField }) => (
                    <Select
                      label="Operator"
                      {...operatorField}
                      options={OPERATORS}
                      error={errors.assetsSelector?.[index]?.operator?.message}
                      required
                      helperText="Comparison operator"
                    />
                  )}
                />

                {/* Right Operand */}
                <Input
                  label="Value"
                  {...register(`assetsSelector.${index}.operandRight`)}
                  error={errors.assetsSelector?.[index]?.operandRight?.message}
                  required
                  placeholder={
                    assets.length > 0
                      ? `e.g., ${assets[0]["@id"]}`
                      : "Enter value to match"
                  }
                  helperText="Value to match against the property"
                />
              </div>
            </div>
          ))}

          {/* Add Selector Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              append({
                operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
                operator: "=",
                operandRight: "",
              })
            }
            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          >
            <FiPlus size={18} />
            <span>Add Another Selector</span>
          </Button>
        </div>

        {errors.assetsSelector && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.assetsSelector.message ||
              errors.assetsSelector.root?.message}
          </p>
        )}
      </fieldset>

      {/* Form Actions */}
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
          Create Contract Definition
        </Button>
      </div>
    </form>
  );
}
