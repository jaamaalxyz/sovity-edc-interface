"use client";

import { forwardRef, useEffect, useState } from "react";

import {
  CUSTOM_MIME_TYPE_VALUE,
  getMimeTypesByCategory,
  isValidMimeTypeFormat,
  MIME_TYPES,
} from "@/lib/mime-types";

import Input from "./Input";
import Select from "./Select";

interface MimeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

const MimeTypeSelect = forwardRef<HTMLSelectElement, MimeTypeSelectProps>(
  (
    {
      value,
      onChange,
      onBlur,
      error,
      label = "Content Type",
      helperText = "MIME type of the asset data",
      required,
      disabled,
      name,
    },
    ref
  ) => {
    // Check if current value is a custom (non-standard) MIME type
    const isCustomValue = !MIME_TYPES.some((mt) => mt.value === value);
    const [showCustomInput, setShowCustomInput] = useState(
      value ? isCustomValue : false
    );
    const [customValue, setCustomValue] = useState(isCustomValue ? value : "");
    const [customError, setCustomError] = useState<string>();

    // Sync custom value when value prop changes
    useEffect(() => {
      const isNowCustom = !MIME_TYPES.some((mt) => mt.value === value);
      setShowCustomInput(value ? isNowCustom : false);
      if (isNowCustom && value) {
        setCustomValue(value);
      }
    }, [value]);

    // Group MIME types by category for optgroup
    const groupedMimeTypes = Array.from(getMimeTypesByCategory().entries()).map(
      ([category, options]) => ({
        label: category,
        options,
      })
    );

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;

      if (newValue === CUSTOM_MIME_TYPE_VALUE) {
        setShowCustomInput(true);
        setCustomValue("");
        setCustomError(undefined);
        // Don't call onChange with empty string - wait for user to type
      } else {
        setShowCustomInput(false);
        setCustomValue("");
        setCustomError(undefined);
        onChange(newValue);
      }
    };

    const handleCustomInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = e.target.value;
      setCustomValue(newValue);

      // Validate MIME type format
      if (newValue && !isValidMimeTypeFormat(newValue)) {
        setCustomError("Invalid MIME type format (expected: type/subtype)");
      } else {
        setCustomError(undefined);
      }

      onChange(newValue);
    };

    const handleCustomInputBlur = () => {
      if (onBlur) {
        onBlur();
      }
    };

    return (
      <div className="w-full">
        {!showCustomInput ? (
          <Select
            ref={ref}
            name={name}
            label={label}
            value={value || ""}
            onChange={handleSelectChange}
            onBlur={onBlur}
            error={error}
            helperText={helperText}
            required={required}
            disabled={disabled}
            groups={[
              ...groupedMimeTypes,
              {
                label: "Other",
                options: [
                  {
                    value: CUSTOM_MIME_TYPE_VALUE,
                    label: "Custom MIME type...",
                  },
                ],
              },
            ]}
          />
        ) : (
          <div className="space-y-2">
            <Input
              name={name}
              label={label}
              value={customValue}
              onChange={handleCustomInputChange}
              onBlur={handleCustomInputBlur}
              error={customError || error}
              helperText="Enter a custom MIME type (e.g., application/custom)"
              placeholder="e.g., application/custom"
              required={required}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setCustomValue("");
                setCustomError(undefined);
                onChange("application/json");
              }}
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              disabled={disabled}
            >
              ← Choose from predefined MIME types
            </button>
          </div>
        )}
      </div>
    );
  }
);

MimeTypeSelect.displayName = "MimeTypeSelect";

export default MimeTypeSelect;
