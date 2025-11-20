import clsx from "clsx";
import { forwardRef, InputHTMLAttributes, useId, useMemo } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id: providedId, ...props }, ref) => {
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
        <input
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
        />
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

Input.displayName = "Input";

export default Input;
