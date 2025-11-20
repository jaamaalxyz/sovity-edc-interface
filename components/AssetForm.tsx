"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import type { Asset } from "@/types/asset";

import Button from "./Button";
import Input from "./Input";
import MimeTypeSelect from "./MimeTypeSelect";
import Textarea from "./Textarea";

export const assetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
  name: z.string().min(1, "Asset name is required"),
  description: z.string().optional(),
  contentType: z.string().min(1, "Content type is required"),
  version: z.string().optional(),
  dataAddressType: z.string().min(1, "Data address type is required"),
  baseUrl: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: AssetFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function AssetForm({
  asset,
  onSubmit,
  onCancel,
  isEdit = false,
}: AssetFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: asset
      ? {
          id: asset["@id"],
          name: (asset.properties?.["asset:prop:name"] ||
            asset.properties?.name ||
            "") as string,
          description: (asset.properties?.["asset:prop:description"] ||
            asset.properties?.description ||
            "") as string,
          contentType: (asset.properties?.["asset:prop:contenttype"] ||
            asset.properties?.contentType ||
            "application/json") as string,
          version: (asset.properties?.["asset:prop:version"] ||
            asset.properties?.version ||
            "") as string,
          dataAddressType: (asset.dataAddress?.type || "HttpData") as string,
          baseUrl: (asset.dataAddress?.baseUrl || "") as string,
        }
      : {
          contentType: "application/json",
          dataAddressType: "HttpData",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Asset ID"
        {...register("id")}
        error={errors.id?.message}
        disabled={isEdit}
        required
        helperText="Unique identifier for the asset"
      />

      <Input
        label="Name"
        {...register("name")}
        error={errors.name?.message}
        required
        helperText="Display name for the asset"
      />

      <Textarea
        label="Description"
        {...register("description")}
        error={errors.description?.message}
        helperText="Optional description of the asset"
      />

      <Controller
        name="contentType"
        control={control}
        render={({ field }) => (
          <MimeTypeSelect
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.contentType?.message}
            required
          />
        )}
      />

      <Input
        label="Version"
        {...register("version")}
        error={errors.version?.message}
        placeholder="e.g., 1.0.0"
        helperText="Optional version information"
      />

      <fieldset className="border-t border-gray-200 pt-4">
        <legend className="mb-3 text-sm font-semibold text-gray-900">
          Data Address
        </legend>

        <Input
          label="Type"
          {...register("dataAddressType")}
          error={errors.dataAddressType?.message}
          required
          placeholder="e.g., HttpData"
          helperText="Type of data address"
        />

        <div className="mt-4">
          <Input
            label="Base URL"
            {...register("baseUrl")}
            error={errors.baseUrl?.message}
            placeholder="https://example.com/api/data"
            helperText="Optional base URL for the data"
          />
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Update Asset" : "Create Asset"}
        </Button>
      </div>
    </form>
  );
}
