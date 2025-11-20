/**
 * Select Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { forwardRef } from "react";

import Select, { SelectOption, SelectOptionGroup } from "@/components/Select";

const simpleOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const groupedOptions: SelectOptionGroup[] = [
  {
    label: "Group 1",
    options: [
      { value: "g1-option1", label: "Group 1 Option 1" },
      { value: "g1-option2", label: "Group 1 Option 2" },
    ],
  },
  {
    label: "Group 2",
    options: [
      { value: "g2-option1", label: "Group 2 Option 1" },
      { value: "g2-option2", label: "Group 2 Option 2" },
    ],
  },
];

describe("Select", () => {
  describe("rendering", () => {
    it("renders a select element", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<Select label="Test Label" options={simpleOptions} />);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<Select options={simpleOptions} />);
      const label = document.querySelector("label");
      expect(label).not.toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      render(<Select placeholder="Select an option" options={simpleOptions} />);
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders placeholder as disabled option", () => {
      render(<Select placeholder="Select an option" options={simpleOptions} />);
      const placeholderOption = screen.getByText("Select an option");
      expect(placeholderOption).toHaveAttribute("disabled");
      expect(placeholderOption).toHaveAttribute("value", "");
    });

    it("renders with helper text", () => {
      render(
        <Select helperText="This is helper text" options={simpleOptions} />
      );
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });

    it("renders with error message", () => {
      render(<Select error="This is an error" options={simpleOptions} />);
      expect(screen.getByText("This is an error")).toBeInTheDocument();
    });

    it("does not show helper text when error is present", () => {
      render(
        <Select
          error="This is an error"
          helperText="This is helper text"
          options={simpleOptions}
        />
      );
      expect(screen.getByText("This is an error")).toBeInTheDocument();
      expect(screen.queryByText("This is helper text")).not.toBeInTheDocument();
    });
  });

  describe("options", () => {
    it("renders simple options", () => {
      render(<Select options={simpleOptions} />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("renders grouped options", () => {
      render(<Select groups={groupedOptions} />);
      expect(screen.getByText("Group 1 Option 1")).toBeInTheDocument();
      expect(screen.getByText("Group 2 Option 1")).toBeInTheDocument();
    });

    it("renders optgroup elements for grouped options", () => {
      const { container } = render(<Select groups={groupedOptions} />);
      const optgroups = container.querySelectorAll("optgroup");
      expect(optgroups).toHaveLength(2);
      expect(optgroups[0]).toHaveAttribute("label", "Group 1");
      expect(optgroups[1]).toHaveAttribute("label", "Group 2");
    });

    it("renders custom children when provided", () => {
      render(
        <Select>
          <option value="custom1">Custom Option 1</option>
          <option value="custom2">Custom Option 2</option>
        </Select>
      );
      expect(screen.getByText("Custom Option 1")).toBeInTheDocument();
      expect(screen.getByText("Custom Option 2")).toBeInTheDocument();
    });

    it("prioritizes children over options prop", () => {
      render(
        <Select options={simpleOptions}>
          <option value="custom">Custom Option</option>
        </Select>
      );
      expect(screen.getByText("Custom Option")).toBeInTheDocument();
      // Simple options should not be rendered
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("renders nothing when no options, groups, or children provided", () => {
      const { container } = render(<Select />);
      const selectElement = container.querySelector("select");
      const options = selectElement?.querySelectorAll("option");
      expect(options).toHaveLength(0);
    });
  });

  describe("required field", () => {
    it("shows asterisk when required", () => {
      render(<Select label="Test Label" required options={simpleOptions} />);
      const asterisk = screen.getByText("*");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveAttribute("aria-label", "required");
    });

    it("does not show asterisk when not required", () => {
      render(<Select label="Test Label" options={simpleOptions} />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("applies required attribute to select element", () => {
      render(<Select required options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveAttribute("required");
    });
  });

  describe("error state", () => {
    it("applies error styling when error is present", () => {
      render(<Select error="Error message" options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("border-red-500");
    });

    it("applies normal styling when no error", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("border-gray-300");
      expect(selectElement).not.toHaveClass("border-red-500");
    });

    it("sets aria-invalid to true when error is present", () => {
      render(<Select error="Error message" options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-invalid to false when no error", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveAttribute("aria-invalid", "false");
    });

    it("displays error message with role alert", () => {
      render(<Select error="Error message" options={simpleOptions} />);
      const errorElement = screen.getByRole("alert");
      expect(errorElement).toHaveTextContent("Error message");
    });

    it("error message has aria-live polite", () => {
      render(<Select error="Error message" options={simpleOptions} />);
      const errorElement = screen.getByRole("alert");
      expect(errorElement).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("disabled state", () => {
    it("applies disabled styling", () => {
      render(<Select disabled options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("disabled:cursor-not-allowed");
      expect(selectElement).toHaveClass("disabled:bg-gray-100");
    });

    it("sets disabled attribute", () => {
      render(<Select disabled options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("associates label with select using htmlFor and id", () => {
      render(<Select label="Test Label" options={simpleOptions} />);
      const label = screen.getByText("Test Label");
      const selectElement = document.querySelector("select");
      const labelFor = label.getAttribute("for");
      const selectId = selectElement?.getAttribute("id");
      expect(labelFor).toBe(selectId);
      expect(selectId).toBeTruthy();
    });

    it("uses provided id when given", () => {
      render(
        <Select id="custom-id" label="Test Label" options={simpleOptions} />
      );
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveAttribute("id", "custom-id");
    });

    it("generates unique id when not provided", () => {
      const { container: container1 } = render(
        <Select label="Label 1" options={simpleOptions} />
      );
      const { container: container2 } = render(
        <Select label="Label 2" options={simpleOptions} />
      );

      const select1 = container1.querySelector("select");
      const select2 = container2.querySelector("select");

      expect(select1?.id).toBeTruthy();
      expect(select2?.id).toBeTruthy();
      expect(select1?.id).not.toBe(select2?.id);
    });

    it("sets aria-describedby to error id when error is present", () => {
      render(
        <Select
          id="test-select"
          error="Error message"
          options={simpleOptions}
        />
      );
      const selectElement = document.querySelector("select");
      const describedBy = selectElement?.getAttribute("aria-describedby");
      expect(describedBy).toContain("test-select-error");
    });

    it("sets aria-describedby to helper text id when no error", () => {
      render(
        <Select
          id="test-select"
          helperText="Helper text"
          options={simpleOptions}
        />
      );
      const selectElement = document.querySelector("select");
      const describedBy = selectElement?.getAttribute("aria-describedby");
      expect(describedBy).toContain("test-select-helper");
    });

    it("sets aria-describedby to error id when both error and helper text present", () => {
      render(
        <Select
          id="test-select"
          error="Error message"
          helperText="Helper text"
          options={simpleOptions}
        />
      );
      const selectElement = document.querySelector("select");
      const describedBy = selectElement?.getAttribute("aria-describedby");
      expect(describedBy).toContain("test-select-error");
      expect(describedBy).not.toContain("test-select-helper");
    });

    it("does not set aria-describedby when no error or helper text", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("styling", () => {
    it("applies base styling classes", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("w-full");
      expect(selectElement).toHaveClass("rounded-lg");
      expect(selectElement).toHaveClass("border");
      expect(selectElement).toHaveClass("px-3");
      expect(selectElement).toHaveClass("py-2");
      expect(selectElement).toHaveClass("shadow-sm");
    });

    it("applies focus styling classes", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("focus:border-transparent");
      expect(selectElement).toHaveClass("focus:outline-none");
      expect(selectElement).toHaveClass("focus:ring-2");
      expect(selectElement).toHaveClass("focus:ring-primary-500");
    });

    it("applies custom className", () => {
      render(<Select className="custom-class" options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("custom-class");
    });

    it("merges custom className with base classes", () => {
      render(<Select className="custom-class" options={simpleOptions} />);
      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("custom-class");
      expect(selectElement).toHaveClass("w-full");
    });

    it("applies error text styling", () => {
      render(<Select error="Error message" options={simpleOptions} />);
      const errorElement = screen.getByRole("alert");
      expect(errorElement).toHaveClass("mt-1");
      expect(errorElement).toHaveClass("text-sm");
      expect(errorElement).toHaveClass("text-red-600");
    });

    it("applies helper text styling", () => {
      render(<Select helperText="Helper text" options={simpleOptions} />);
      const helperElement = screen.getByText("Helper text");
      expect(helperElement).toHaveClass("mt-1");
      expect(helperElement).toHaveClass("text-sm");
      expect(helperElement).toHaveClass("text-gray-500");
    });
  });

  describe("onChange behavior", () => {
    it("calls onChange handler when value changes", () => {
      const handleChange = jest.fn();
      render(<Select onChange={handleChange} options={simpleOptions} />);
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, { target: { value: "option2" } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("updates select value when changed", () => {
      render(<Select options={simpleOptions} />);
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, { target: { value: "option2" } });
      expect(selectElement.value).toBe("option2");
    });
  });

  describe("controlled component", () => {
    it("works as controlled component with value prop", () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <Select
          value="option1"
          onChange={handleChange}
          options={simpleOptions}
        />
      );
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      expect(selectElement.value).toBe("option1");

      rerender(
        <Select
          value="option2"
          onChange={handleChange}
          options={simpleOptions}
        />
      );
      expect(selectElement.value).toBe("option2");
    });

    it("maintains value when controlled", () => {
      const handleChange = jest.fn();
      render(
        <Select
          value="option1"
          onChange={handleChange}
          options={simpleOptions}
        />
      );
      const selectElement = document.querySelector(
        "select"
      ) as HTMLSelectElement;
      fireEvent.change(selectElement, { target: { value: "option2" } });
      // Value should still be option1 since parent controls it
      expect(selectElement.value).toBe("option1");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to select element", () => {
      const ref = { current: null };
      const TestComponent = forwardRef<HTMLSelectElement>(
        (props, forwardedRef) => (
          <Select ref={forwardedRef} options={simpleOptions} />
        )
      );
      TestComponent.displayName = "TestComponent";

      render(<TestComponent ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it("allows ref to access select methods", () => {
      const ref = { current: null as HTMLSelectElement | null };
      const TestComponent = forwardRef<HTMLSelectElement>(
        (props, forwardedRef) => (
          <Select ref={forwardedRef} options={simpleOptions} />
        )
      );
      TestComponent.displayName = "TestComponent";

      render(<TestComponent ref={ref} />);
      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.blur).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles empty options array", () => {
      const { container } = render(<Select options={[]} />);
      const selectElement = container.querySelector("select");
      const options = selectElement?.querySelectorAll("option");
      expect(options).toHaveLength(0);
    });

    it("handles empty groups array", () => {
      const { container } = render(<Select groups={[]} />);
      const selectElement = container.querySelector("select");
      const optgroups = selectElement?.querySelectorAll("optgroup");
      expect(optgroups).toHaveLength(0);
    });

    it("handles options with special characters", () => {
      const specialOptions: SelectOption[] = [
        { value: "option<>1", label: 'Option with <>"&' },
        { value: "option&2", label: "Option & Test" },
      ];
      render(<Select options={specialOptions} />);
      expect(screen.getByText('Option with <>"&')).toBeInTheDocument();
      expect(screen.getByText("Option & Test")).toBeInTheDocument();
    });

    it("handles long option labels", () => {
      const longOptions: SelectOption[] = [
        {
          value: "long",
          label:
            "This is a very long option label that might need to wrap or be truncated",
        },
      ];
      render(<Select options={longOptions} />);
      expect(
        screen.getByText(
          "This is a very long option label that might need to wrap or be truncated"
        )
      ).toBeInTheDocument();
    });

    it("handles options with category (unused in current implementation)", () => {
      const categorizedOptions: SelectOption[] = [
        { value: "opt1", label: "Option 1", category: "Category A" },
        { value: "opt2", label: "Option 2", category: "Category B" },
      ];
      render(<Select options={categorizedOptions} />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("display name", () => {
    it("has correct display name", () => {
      expect(Select.displayName).toBe("Select");
    });
  });

  describe("integration", () => {
    it("works with all props together", () => {
      const handleChange = jest.fn();
      render(
        <Select
          id="full-select"
          label="Full Example"
          placeholder="Choose one"
          helperText="This is helper text"
          required
          options={simpleOptions}
          onChange={handleChange}
          className="custom-class"
        />
      );

      expect(screen.getByText("Full Example")).toBeInTheDocument();
      expect(screen.getByText("Choose one")).toBeInTheDocument();
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();

      const selectElement = document.querySelector("select");
      expect(selectElement).toHaveClass("custom-class");
      expect(selectElement).toHaveAttribute("required");
      expect(selectElement).toHaveAttribute("id", "full-select");

      fireEvent.change(selectElement!, { target: { value: "option1" } });
      expect(handleChange).toHaveBeenCalled();
    });

    it("switches between error and helper text correctly", () => {
      const { rerender } = render(
        <Select helperText="Helper text" options={simpleOptions} />
      );
      expect(screen.getByText("Helper text")).toBeInTheDocument();

      rerender(
        <Select
          error="Error message"
          helperText="Helper text"
          options={simpleOptions}
        />
      );
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });
  });
});
