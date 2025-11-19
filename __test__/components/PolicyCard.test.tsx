/**
 * PolicyCard Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import PolicyCard from "@/components/PolicyCard";
import type { PolicyDefinition } from "@/types/policy";

const mockPolicy: PolicyDefinition = {
  "@id": "test-policy-1",
  "@type": "PolicyDefinition",
  policy: {
    "@id": "policy-1",
    permissions: [
      { action: "use", constraint: [] },
      { action: "transfer", constraint: [] },
    ],
    prohibitions: [{ action: "distribute", constraint: [] }],
    obligations: [],
  },
};

const mockPolicyWithObligations: PolicyDefinition = {
  "@id": "test-policy-2",
  "@type": "PolicyDefinition",
  policy: {
    "@id": "policy-2",
    permissions: [{ action: "use", constraint: [] }],
    prohibitions: [],
    obligations: [{ action: "notify", constraint: [] }],
  },
};

const mockEmptyPolicy: PolicyDefinition = {
  "@id": "empty-policy",
  "@type": "PolicyDefinition",
  policy: {
    "@id": "empty",
    permissions: [],
    prohibitions: [],
    obligations: [],
  },
};

describe("PolicyCard", () => {
  const mockOnView = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders policy ID", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("test-policy-1")).toBeInTheDocument();
  });

  it("displays permission count", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("2 Permissions")).toBeInTheDocument();
  });

  it("displays prohibition count", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("1 Prohibition")).toBeInTheDocument();
  });

  it("displays obligation count", () => {
    render(
      <PolicyCard
        policy={mockPolicyWithObligations}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("1 Obligation")).toBeInTheDocument();
  });

  it("uses singular form when count is 1", () => {
    render(
      <PolicyCard
        policy={mockPolicyWithObligations}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("1 Permission")).toBeInTheDocument();
    expect(screen.getByText("1 Obligation")).toBeInTheDocument();
  });

  it("uses plural form when count is greater than 1", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("2 Permissions")).toBeInTheDocument();
  });

  it('shows "No rules defined" when policy has no rules', () => {
    render(
      <PolicyCard
        policy={mockEmptyPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("No rules defined")).toBeInTheDocument();
  });

  it("calls onView when View Details is clicked", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText("View Details"));
    expect(mockOnView).toHaveBeenCalledWith(mockPolicy);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find((btn) => btn.querySelector("svg"));
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith(mockPolicy);
    }
  });

  it("displays policy definition label", () => {
    render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Policy Definition")).toBeInTheDocument();
  });

  it("has correct styling for permission badge", () => {
    const { container } = render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    const permissionBadge = screen.getByText("2 Permissions");
    expect(permissionBadge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("has correct styling for prohibition badge", () => {
    const { container } = render(
      <PolicyCard
        policy={mockPolicy}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    const prohibitionBadge = screen.getByText("1 Prohibition");
    expect(prohibitionBadge).toHaveClass("bg-red-100", "text-red-800");
  });

  it("has correct styling for obligation badge", () => {
    const { container } = render(
      <PolicyCard
        policy={mockPolicyWithObligations}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );
    const obligationBadge = screen.getByText("1 Obligation");
    expect(obligationBadge).toHaveClass("bg-blue-100", "text-blue-800");
  });
});
