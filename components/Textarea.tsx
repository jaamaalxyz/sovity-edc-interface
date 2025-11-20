import clsx from "clsx";
import { forwardRef, TextareaHTMLAttributes, useId, useMemo } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = providedId || generatedId;
    const errorId = useMemo(() => `${textareaId}-error`, [textareaId]);
    const helperTextId = useMemo(() => `${textareaId}-helper`, [textareaId]);

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
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
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
          rows={4}
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

Textarea.displayName = "Textarea";

export default Textarea;
