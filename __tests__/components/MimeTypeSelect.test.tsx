/**
 * MimeTypeSelect Component Tests
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { forwardRef } from "react";

import MimeTypeSelect from "@/components/MimeTypeSelect";
import { CUSTOM_MIME_TYPE_VALUE, MIME_TYPES } from "@/lib/mime-types";

describe("MimeTypeSelect", () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders select by default", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toBeInTheDocument();
    });

    it("renders with default label", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);
      expect(screen.getByText("Content Type")).toBeInTheDocument();
    });

    it("renders with custom label", () => {
      render(
        <MimeTypeSelect value="" onChange={mockOnChange} label="Custom Label" />
      );
      expect(screen.getByText("Custom Label")).toBeInTheDocument();
    });

    it("renders with default helper text", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);
      expect(
        screen.getByText("MIME type of the asset data")
      ).toBeInTheDocument();
    });

    it("renders with custom helper text", () => {
      render(
        <MimeTypeSelect
          value=""
          onChange={mockOnChange}
          helperText="Custom helper text"
        />
      );
      expect(screen.getByText("Custom helper text")).toBeInTheDocument();
    });

    it("renders grouped MIME types", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      // Check for some specific options
      expect(screen.getByText("JSON (application/json)")).toBeInTheDocument();
      expect(screen.getByText("PDF (application/pdf)")).toBeInTheDocument();
    });

    it("renders custom MIME type option", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);
      expect(screen.getByText("Custom MIME type...")).toBeInTheDocument();
    });

    it("shows optgroups for categories", () => {
      const { container } = render(
        <MimeTypeSelect value="" onChange={mockOnChange} />
      );
      const optgroups = container.querySelectorAll("optgroup");
      expect(optgroups.length).toBeGreaterThan(0);
    });
  });

  describe("standard MIME type selection", () => {
    it("calls onChange when selecting a standard MIME type", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;

      fireEvent.change(selectElement, {
        target: { value: "application/json" },
      });

      expect(mockOnChange).toHaveBeenCalledWith("application/json");
    });

    it("displays selected value", () => {
      render(
        <MimeTypeSelect value="application/json" onChange={mockOnChange} />
      );
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      expect(selectElement.value).toBe("application/json");
    });

    it("allows changing between standard MIME types", () => {
      const { rerender } = render(
        <MimeTypeSelect value="application/json" onChange={mockOnChange} />
      );

      let selectElement = document.querySelector("select") as HTMLSelectElement;
      expect(selectElement.value).toBe("application/json");

      rerender(
        <MimeTypeSelect value="application/xml" onChange={mockOnChange} />
      );

      selectElement = document.querySelector("select") as HTMLSelectElement;
      expect(selectElement.value).toBe("application/xml");
    });

    it("calls onBlur when select loses focus", () => {
      render(
        <MimeTypeSelect
          value="application/json"
          onChange={mockOnChange}
          onBlur={mockOnBlur}
        />
      );

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.blur(selectElement);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("custom MIME type mode", () => {
    it("switches to input when custom option is selected", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
        expect(document.querySelector("input")).toBeInTheDocument();
      });
    });

    it("shows custom input helper text", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "Enter a custom MIME type (e.g., application/custom)"
          )
        ).toBeInTheDocument();
      });
    });

    it("shows back button in custom mode", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        expect(
          screen.getByText("← Choose from predefined MIME types")
        ).toBeInTheDocument();
      });
    });

    it("calls onChange when typing custom MIME type", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input") as HTMLInputElement;
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "application/custom" } });

      expect(mockOnChange).toHaveBeenCalledWith("application/custom");
    });

    it("validates custom MIME type format", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "invalid-mime-type" } });

      await waitFor(() => {
        expect(
          screen.getByText("Invalid MIME type format (expected: type/subtype)")
        ).toBeInTheDocument();
      });
    });

    it("accepts valid custom MIME type format", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "application/custom" } });

      expect(
        screen.queryByText("Invalid MIME type format (expected: type/subtype)")
      ).not.toBeInTheDocument();
    });

    it("switches back to select when clicking back button", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        expect(
          screen.getByText("← Choose from predefined MIME types")
        ).toBeInTheDocument();
      });

      const backButton = screen.getByText(
        "← Choose from predefined MIME types"
      );
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(document.querySelector("select")).toBeInTheDocument();
      });
    });

    it("sets default value when switching back from custom mode", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const backButton = screen.getByText(
          "← Choose from predefined MIME types"
        );
        expect(backButton).toBeInTheDocument();
      });

      const backButton = screen.getByText(
        "← Choose from predefined MIME types"
      );
      fireEvent.click(backButton);

      expect(mockOnChange).toHaveBeenCalledWith("application/json");
    });

    it("clears custom error when switching back", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "invalid" } });

      await waitFor(() => {
        expect(
          screen.getByText("Invalid MIME type format (expected: type/subtype)")
        ).toBeInTheDocument();
      });

      const backButton = screen.getByText(
        "← Choose from predefined MIME types"
      );
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Invalid MIME type format (expected: type/subtype)"
          )
        ).not.toBeInTheDocument();
      });
    });

    it("calls onBlur when custom input loses focus", async () => {
      render(
        <MimeTypeSelect value="" onChange={mockOnChange} onBlur={mockOnBlur} />
      );

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.blur(input);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("initialization with custom value", () => {
    it("starts in custom input mode when value is not standard", () => {
      render(
        <MimeTypeSelect value="application/custom" onChange={mockOnChange} />
      );

      expect(document.querySelector("input")).toBeInTheDocument();
      expect(document.querySelector("select")).not.toBeInTheDocument();
    });

    it("displays custom value in input", () => {
      render(
        <MimeTypeSelect value="application/custom" onChange={mockOnChange} />
      );

      const input = document.querySelector("input") as HTMLInputElement;
      expect(input.value).toBe("application/custom");
    });

    it("starts in select mode when value is standard", () => {
      render(
        <MimeTypeSelect value="application/json" onChange={mockOnChange} />
      );

      expect(document.querySelector("select")).toBeInTheDocument();
      expect(document.querySelector("input")).not.toBeInTheDocument();
    });

    it("updates to custom mode when value changes to custom", () => {
      const { rerender } = render(
        <MimeTypeSelect value="application/json" onChange={mockOnChange} />
      );

      expect(document.querySelector("select")).toBeInTheDocument();

      rerender(
        <MimeTypeSelect value="application/custom" onChange={mockOnChange} />
      );

      expect(document.querySelector("input")).toBeInTheDocument();
    });

    it("updates to select mode when value changes to standard", () => {
      const { rerender } = render(
        <MimeTypeSelect value="application/custom" onChange={mockOnChange} />
      );

      expect(document.querySelector("input")).toBeInTheDocument();

      rerender(
        <MimeTypeSelect value="application/json" onChange={mockOnChange} />
      );

      expect(document.querySelector("select")).toBeInTheDocument();
    });
  });

  describe("required field", () => {
    it("applies required attribute to select", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} required />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveAttribute("required");
    });

    it("applies required attribute to custom input", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} required />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toHaveAttribute("required");
      });
    });
  });

  describe("disabled state", () => {
    it("disables select when disabled prop is true", () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} disabled />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toBeDisabled();
    });

    it("disables custom input when disabled prop is true", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} disabled />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeDisabled();
      });
    });

    it("disables back button when disabled prop is true", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} disabled />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const backButton = screen.getByText(
          "← Choose from predefined MIME types"
        );
        expect(backButton).toBeDisabled();
      });
    });
  });

  describe("error handling", () => {
    it("displays error message on select", () => {
      render(
        <MimeTypeSelect
          value=""
          onChange={mockOnChange}
          error="This is an error"
        />
      );
      expect(screen.getByText("This is an error")).toBeInTheDocument();
    });

    it("displays error message on custom input", async () => {
      render(
        <MimeTypeSelect
          value="application/custom"
          onChange={mockOnChange}
          error="External error"
        />
      );

      expect(screen.getByText("External error")).toBeInTheDocument();
    });

    it("prioritizes validation error over external error in custom input", async () => {
      render(
        <MimeTypeSelect
          value=""
          onChange={mockOnChange}
          error="External error"
        />
      );

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "invalid" } });

      await waitFor(() => {
        expect(
          screen.getByText("Invalid MIME type format (expected: type/subtype)")
        ).toBeInTheDocument();
        expect(screen.queryByText("External error")).not.toBeInTheDocument();
      });
    });
  });

  describe("name attribute", () => {
    it("applies name attribute to select", () => {
      render(
        <MimeTypeSelect value="" onChange={mockOnChange} name="contentType" />
      );
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveAttribute("name", "contentType");
    });

    it("applies name attribute to custom input", async () => {
      render(
        <MimeTypeSelect value="" onChange={mockOnChange} name="contentType" />
      );

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector('input[name="contentType"]');
        expect(input).toBeInTheDocument();
      });
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to select element", () => {
      const ref = { current: null };
      const TestComponent = forwardRef<HTMLSelectElement>(
        (props, forwardedRef) => (
          <MimeTypeSelect ref={forwardedRef} value="" onChange={mockOnChange} />
        )
      );
      TestComponent.displayName = "TestComponent";

      render(<TestComponent ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  describe("display name", () => {
    it("has correct display name", () => {
      expect(MimeTypeSelect.displayName).toBe("MimeTypeSelect");
    });
  });

  describe("edge cases", () => {
    it("handles MIME type with special characters", () => {
      render(
        <MimeTypeSelect
          value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={mockOnChange}
        />
      );
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      expect(selectElement.value).toBe(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });

    it("handles MIME type with plus sign", () => {
      render(
        <MimeTypeSelect value="application/ld+json" onChange={mockOnChange} />
      );
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      expect(selectElement.value).toBe("application/ld+json");
    });

    it("validates MIME type with hyphen and plus", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      await waitFor(() => {
        const input = document.querySelector("input");
        expect(input).toBeInTheDocument();
      });

      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, {
        target: { value: "application/vnd.test+json" },
      });

      expect(
        screen.queryByText("Invalid MIME type format (expected: type/subtype)")
      ).not.toBeInTheDocument();
    });

    it("does not call onChange when switching to custom mode initially", async () => {
      mockOnChange.mockClear();

      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      // Should not call onChange with empty value immediately
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("integration", () => {
    it("handles complete flow from select to custom and back", async () => {
      render(<MimeTypeSelect value="" onChange={mockOnChange} />);

      // Start with select
      expect(document.querySelector("select")).toBeInTheDocument();

      // Select custom option
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, {
        target: { value: CUSTOM_MIME_TYPE_VALUE },
      });

      // Should show custom input
      await waitFor(() => {
        expect(document.querySelector("input")).toBeInTheDocument();
      });

      // Type custom MIME type
      const input = document.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "application/custom" } });
      expect(mockOnChange).toHaveBeenCalledWith("application/custom");

      // Click back button
      const backButton = screen.getByText(
        "← Choose from predefined MIME types"
      );
      fireEvent.click(backButton);

      // Should show select again
      await waitFor(() => {
        expect(document.querySelector("select")).toBeInTheDocument();
      });

      // Should set default value
      expect(mockOnChange).toHaveBeenCalledWith("application/json");
    });
  });
});
