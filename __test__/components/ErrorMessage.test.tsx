/**
 * ErrorMessage Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import ErrorMessage from "@/components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("displays error icon", () => {
    const { container } = render(<ErrorMessage message="Error" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const handleRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={handleRetry} />);
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText("Try again")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const handleRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={handleRetry} />);

    fireEvent.click(screen.getByText("Try again"));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("has error styling", () => {
    const { container } = render(<ErrorMessage message="Error" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("bg-red-50", "border-red-200");
  });
});
