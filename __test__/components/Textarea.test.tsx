/**
 * Textarea Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import Textarea from "@/components/Textarea";

describe("Textarea", () => {
  it("renders textarea field", () => {
    render(<Textarea placeholder="Enter description" />);
    expect(
      screen.getByPlaceholderText("Enter description")
    ).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter description")
    ).toBeInTheDocument();
  });

  it("shows required asterisk when required", () => {
    render(<Textarea label="Bio" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Textarea label="Bio" error="Bio is required" />);
    expect(screen.getByText("Bio is required")).toBeInTheDocument();
  });

  it("displays helper text when no error", () => {
    render(<Textarea label="Bio" helperText="Tell us about yourself" />);
    expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(
      <Textarea
        label="Bio"
        error="Bio is required"
        helperText="Tell us about yourself"
      />
    );
    expect(screen.getByText("Bio is required")).toBeInTheDocument();
    expect(
      screen.queryByText("Tell us about yourself")
    ).not.toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    const { container } = render(<Textarea error="Error" />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("border-red-500");
  });

  it("handles onChange events", () => {
    const handleChange = jest.fn();
    const { container } = render(<Textarea onChange={handleChange} />);
    const textarea = container.querySelector("textarea");

    if (textarea) {
      fireEvent.change(textarea, { target: { value: "test content" } });
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it("can be disabled", () => {
    const { container } = render(<Textarea disabled />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:bg-gray-100");
  });

  it("applies custom className", () => {
    const { container } = render(<Textarea className="custom-textarea" />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("custom-textarea");
  });

  it("defaults to 4 rows", () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("forwards ref correctly", () => {
    const ref = jest.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
