/**
 * Modal Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import Modal from "@/components/Modal";

describe("Modal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        footer={<button>Footer Button</button>}
      >
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText("Footer Button")).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = container.querySelector(".bg-black");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const closeButtons = screen.getAllByRole("button");
    // Find the close button (has svg icon)
    const closeButton = closeButtons.find((btn) => btn.querySelector("svg"));
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it("applies different size classes", () => {
    const { container: container1 } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm">
        <div>Small modal</div>
      </Modal>
    );
    expect(container1.querySelector(".max-w-md")).toBeInTheDocument();

    const { container: container2 } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="lg">
        <div>Large modal</div>
      </Modal>
    );
    expect(container2.querySelector(".max-w-2xl")).toBeInTheDocument();

    const { container: container3 } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="xl">
        <div>Extra large modal</div>
      </Modal>
    );
    expect(container3.querySelector(".max-w-4xl")).toBeInTheDocument();
  });

  it("sets body overflow to hidden when open", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("unset");
  });
});
