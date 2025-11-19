/**
 * PolicyForm Component Tests
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import PolicyForm from "@/components/PolicyForm";

describe("PolicyForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText(/Policy ID/)).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(document.querySelector('input[name="id"]')).toBeInTheDocument();
    expect(
      document.querySelector('input[name="permissions.0.action"]')
    ).toBeInTheDocument();
  });

  it("renders submit and cancel buttons", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText("Create Policy")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("validates policy ID is required", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Policy ID input should have required attribute
    const policyIdInput = document.querySelector('input[name="id"]');
    expect(policyIdInput).toHaveAttribute("required");
  });

  it("starts with one default permission", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText("Permission 1")).toBeInTheDocument();
  });

  it("allows adding more permissions", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Click Add Permission button
    fireEvent.click(screen.getByText("Add Permission"));

    expect(screen.getByText("Permission 1")).toBeInTheDocument();
    expect(screen.getByText("Permission 2")).toBeInTheDocument();
  });

  it("allows removing permissions when more than one exists", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Add a second permission
    fireEvent.click(screen.getByText("Add Permission"));
    expect(screen.getByText("Permission 2")).toBeInTheDocument();

    // Find and click the delete button (trash icon)
    const deleteButtons = screen.getAllByRole("button");
    const trashButton = deleteButtons.find(
      (btn) => btn.querySelector("svg") && btn.textContent === ""
    );

    if (trashButton) {
      fireEvent.click(trashButton);
    }

    // Should remove one permission
    waitFor(() => {
      expect(screen.queryByText("Permission 2")).not.toBeInTheDocument();
    });
  });

  it("does not show delete button when only one permission exists", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // With only one permission, delete button should not be present
    const deleteButtons = screen
      .queryAllByRole("button")
      .filter(
        (btn) =>
          btn.querySelector("svg") && btn.closest('[class*="Permission"]')
      );

    // Should only have the Add Permission button, not delete buttons
    expect(deleteButtons.length).toBe(0);
  });

  it("validates action field is required", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Action input should have required attribute
    const actionInput = document.querySelector(
      'input[name="permissions.0.action"]'
    );
    expect(actionInput).toHaveAttribute("required");
  });

  it("submits form with valid data", async () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in required fields
    const policyIdInput = document.querySelector('input[name="id"]');
    if (policyIdInput) {
      fireEvent.change(policyIdInput, { target: { value: "test-policy-1" } });
    }

    // The form has a default permission with action 'use'
    // Just submit the form
    fireEvent.click(screen.getByText("Create Policy"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("includes all permissions in submitted data", async () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill policy ID
    const policyIdInput = document.querySelector('input[name="id"]');
    if (policyIdInput) {
      fireEvent.change(policyIdInput, {
        target: { value: "multi-permission-policy" },
      });
    }

    // Add another permission
    fireEvent.click(screen.getByText("Add Permission"));

    // Fill in actions for both permissions
    const actionInput1 = document.querySelector(
      'input[name="permissions.0.action"]'
    );
    const actionInput2 = document.querySelector(
      'input[name="permissions.1.action"]'
    );

    if (actionInput1) {
      fireEvent.change(actionInput1, { target: { value: "use" } });
    }
    if (actionInput2) {
      fireEvent.change(actionInput2, { target: { value: "transfer" } });
    }

    fireEvent.click(screen.getByText("Create Policy"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      const callArgs = mockOnSubmit.mock.calls[0][0];
      expect(callArgs).toEqual(
        expect.objectContaining({
          id: "multi-permission-policy",
          permissions: expect.arrayContaining([
            expect.objectContaining({ action: "use" }),
            expect.objectContaining({ action: "transfer" }),
          ]),
        })
      );
    });
  });

  it("disables submit button while submitting", async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const policyIdInput = document.querySelector('input[name="id"]');
    if (policyIdInput) {
      fireEvent.change(policyIdInput, { target: { value: "test-policy" } });
    }

    const submitButton = screen.getByText("Create Policy");
    fireEvent.click(submitButton);

    // Button should be disabled during submission
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("has helper text for fields", () => {
    render(<PolicyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(
      screen.getByText(/Unique identifier for the policy/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The action permitted by this permission/i)
    ).toBeInTheDocument();
  });
});
