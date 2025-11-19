/**
 * ConfirmDialog Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import ConfirmDialog from "@/components/ConfirmDialog";

describe("ConfirmDialog", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
      />
    );
    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
      />
    );
    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
  });

  it("renders with custom button text", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
        confirmText="Yes, delete"
        cancelText="No, keep it"
      />
    );
    expect(screen.getByText("Yes, delete")).toBeInTheDocument();
    expect(screen.getByText("No, keep it")).toBeInTheDocument();
  });

  it("renders with default button text", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
      />
    );
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
      />
    );

    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("applies danger variant by default", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
      />
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-red-600");
  });

  it("applies primary variant when specified", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure?"
        variant="primary"
      />
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-primary-600");
  });

  it("disables buttons when loading", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
        loading={true}
      />
    );

    expect(screen.getByText("Cancel")).toBeDisabled();
    expect(screen.getByText("Confirm")).toBeDisabled();
  });

  it("shows loading state on confirm button", () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure?"
        loading={true}
      />
    );

    // Check for loading spinner in the confirm button
    const confirmButton = screen.getByText("Confirm").closest("button");
    const spinner = confirmButton?.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
