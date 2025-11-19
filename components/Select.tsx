/**
 * Select Component
 * Reusable form select with label, error state, and grouped options support
 */

import clsx from "clsx";
import {
  forwardRef,
  ReactNode,
  SelectHTMLAttributes,
  useId,
  useMemo,
} from "react";

export interface SelectOption {
  value: string;
  label: string;
  category?: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  placeholder?: string;
  children?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      groups,
      placeholder,
      className,
      id: providedId,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = useMemo(() => `${inputId}-error`, [inputId]);
    const helperTextId = useMemo(() => `${inputId}-helper`, [inputId]);

    const ariaDescribedBy = useMemo(() => {
      const ids: string[] = [];
      if (error) ids.push(errorId);
      if (helperText && !error) ids.push(helperTextId);
      return ids.length > 0 ? ids.join(" ") : undefined;
    }, [error, helperText, errorId, helperTextId]);

    // Render options from groups or flat options list
    const renderOptions = () => {
      if (children) {
        return children;
      }

      if (groups && groups.length > 0) {
        return groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ));
      }

      if (options && options.length > 0) {
        return options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ));
      }

      return null;
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-lg border px-3 py-2 shadow-sm",
            "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500",
            "disabled:cursor-not-allowed disabled:bg-gray-100",
            {
              "border-red-500 focus:ring-red-500": error,
              "border-gray-300": !error,
            },
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={ariaDescribedBy}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {renderOptions()}
        </select>
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
