/**
 * PolicyDetailsModal Component Tests
 */

import { render, screen } from "@testing-library/react";

import PolicyDetailsModal from "@/components/PolicyDetailsModal";
import type { PolicyDefinition } from "@/types/policy";

const mockPolicy: PolicyDefinition = {
  "@id": "test-policy-1",
  "@type": "PolicyDefinition",
  policy: {
    "@id": "policy-1",
    permissions: [
      {
        action: "use",
        constraint: [
          { leftOperand: "count", operator: "lt", rightOperand: 10 },
        ],
        target: "asset-1",
      },
    ],
    prohibitions: [
      {
        action: "distribute",
        constraint: [
          { leftOperand: "region", operator: "eq", rightOperand: "EU" },
        ],
      },
    ],
    obligations: [
      {
        action: "notify",
        constraint: [],
      },
    ],
  },
};

const mockPolicyWithObjectActions: PolicyDefinition = {
  "@id": "complex-policy",
  "@type": "PolicyDefinition",
  policy: {
    "@id": "complex",
    permissions: [
      {
        action: { type: "USE", constraint: [] },
        constraint: [],
      },
    ],
    prohibitions: [],
    obligations: [],
  },
};

describe("PolicyDetailsModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByText("Policy Details")).not.toBeInTheDocument();
  });

  it("does not render when policy is null", () => {
    render(
      <PolicyDetailsModal policy={null} isOpen={true} onClose={mockOnClose} />
    );
    expect(screen.queryByText("Policy Details")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true and policy is provided", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText("Policy Details")).toBeInTheDocument();
  });

  it("displays basic policy information", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("test-policy-1")).toBeInTheDocument();
    expect(screen.getByText("PolicyDefinition")).toBeInTheDocument();
  });

  it("displays permissions section", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.getByText("Permission 1")).toBeInTheDocument();
    expect(screen.getByText("use")).toBeInTheDocument();
  });

  it("displays permission constraints", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/count lt 10/)).toBeInTheDocument();
  });

  it("displays permission target", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("asset-1")).toBeInTheDocument();
  });

  it("displays prohibitions section", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Prohibitions")).toBeInTheDocument();
    expect(screen.getByText("Prohibition 1")).toBeInTheDocument();
    expect(screen.getByText("distribute")).toBeInTheDocument();
  });

  it("displays prohibition constraints", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/region eq EU/)).toBeInTheDocument();
  });

  it("displays obligations section", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Obligations")).toBeInTheDocument();
    expect(screen.getByText("Obligation 1")).toBeInTheDocument();
    expect(screen.getByText("notify")).toBeInTheDocument();
  });

  it("handles action as object", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicyWithObjectActions}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("USE")).toBeInTheDocument();
  });

  it("displays raw policy JSON", () => {
    render(
      <PolicyDetailsModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Raw Policy")).toBeInTheDocument();
    // Check if the JSON stringified content is present
    const jsonContent = JSON.stringify(mockPolicy, null, 2);
    // The pre tag should contain the JSON
    const preElement = screen
      .getByText("Raw Policy")
      .closest("div")
      ?.querySelector("pre");
    expect(preElement).toBeInTheDocument();
  });

  it("does not display sections for empty rule arrays", () => {
    const policyWithOnlyPermissions: PolicyDefinition = {
      "@id": "simple-policy",
      "@type": "PolicyDefinition",
      policy: {
        "@id": "simple",
        permissions: [{ action: "use", constraint: [] }],
      },
    };

    render(
      <PolicyDetailsModal
        policy={policyWithOnlyPermissions}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.queryByText("Prohibitions")).not.toBeInTheDocument();
    expect(screen.queryByText("Obligations")).not.toBeInTheDocument();
  });

  it("handles policies without constraints", () => {
    const policyWithoutConstraints: PolicyDefinition = {
      "@id": "no-constraints",
      "@type": "PolicyDefinition",
      policy: {
        "@id": "no-constraints",
        permissions: [{ action: "use" }],
      },
    };

    render(
      <PolicyDetailsModal
        policy={policyWithoutConstraints}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("use")).toBeInTheDocument();
    // Should not show constraints section
    expect(screen.queryByText("Constraints")).not.toBeInTheDocument();
  });
});
