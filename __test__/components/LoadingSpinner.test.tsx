/**
 * LoadingSpinner Component Tests
 */

import { render, screen } from "@testing-library/react";

import LoadingSpinner from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders spinner", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("renders with text", () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("does not render text when not provided", () => {
    const { container } = render(<LoadingSpinner />);
    const text = container.querySelector("p");
    expect(text).not.toBeInTheDocument();
  });

  it("applies small size class", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("w-4", "h-4");
  });

  it("applies medium size class by default", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("w-8", "h-8");
  });

  it("applies large size class", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("w-12", "h-12");
  });

  it("has primary color", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("text-primary-600");
  });
});
