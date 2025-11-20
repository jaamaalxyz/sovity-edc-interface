/**
 * ContractForm Component Tests
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ContractForm from "@/components/ContractForm";
import type { Asset } from "@/types/asset";
import type { PolicyDefinition } from "@/types/policy";

const mockPolicies: PolicyDefinition[] = [
  {
    "@id": "policy-1",
    "@type": "PolicyDefinition",
    policy: {
      permissions: [{ action: "USE", constraint: [] }],
    },
  },
  {
    "@id": "policy-2",
    "@type": "PolicyDefinition",
    policy: {
      permissions: [{ action: "TRANSFER", constraint: [] }],
    },
  },
];

const mockAssets: Asset[] = [
  {
    "@id": "asset-1",
    properties: {
      name: "Test Asset 1",
    },
  },
  {
    "@id": "asset-2",
    properties: {
      name: "Test Asset 2",
    },
  },
];

describe("ContractForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the form with all required fields", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
          assets={mockAssets}
        />
      );

      expect(screen.getByText("Contract Definition ID")).toBeInTheDocument();
      expect(screen.getByText("Access Policy")).toBeInTheDocument();
      expect(screen.getByText("Contract Policy")).toBeInTheDocument();
      expect(screen.getByText("Asset Selectors")).toBeInTheDocument();
    });

    it("renders submit and cancel buttons", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(
        screen.getByText("Create Contract Definition")
      ).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("renders contract ID input field", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const idInput = document.querySelector('input[name="id"]');
      expect(idInput).toBeInTheDocument();
      expect(idInput).toHaveAttribute("required");
    });

    it("renders access policy select with options", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Access Policy")).toBeInTheDocument();
      const policyOptions = screen.getAllByText("policy-1");
      expect(policyOptions.length).toBeGreaterThan(0);
    });

    it("renders contract policy select with options", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Contract Policy")).toBeInTheDocument();
    });

    it("renders helper texts", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(
        screen.getByText("Unique identifier for this contract definition")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Policy that controls who can access the assets")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Policy that defines the contract terms")
      ).toBeInTheDocument();
    });

    it("renders placeholders", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const idInput = document.querySelector(
        'input[name="id"]'
      ) as HTMLInputElement;
      expect(idInput).toHaveAttribute("placeholder", "contract-definition-1");
    });
  });

  describe("asset selectors", () => {
    it("renders initial asset selector", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Selector 1")).toBeInTheDocument();
      expect(screen.getByText("Property")).toBeInTheDocument();
      expect(screen.getByText("Operator")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("renders asset selector description", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(
        screen.getByText(
          "Define criteria to select which assets this contract applies to"
        )
      ).toBeInTheDocument();
    });

    it("renders add selector button", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Add Another Selector")).toBeInTheDocument();
    });

    it("adds new selector when add button is clicked", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const addButton = screen.getByText("Add Another Selector");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Selector 2")).toBeInTheDocument();
      });
    });

    it("adds multiple selectors", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const addButton = screen.getByText("Add Another Selector");

      fireEvent.click(addButton);
      await waitFor(() => {
        expect(screen.getByText("Selector 2")).toBeInTheDocument();
      });

      fireEvent.click(addButton);
      await waitFor(() => {
        expect(screen.getByText("Selector 3")).toBeInTheDocument();
      });
    });

    it("does not show remove button for single selector", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });

    it("shows remove button when multiple selectors exist", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const addButton = screen.getByText("Add Another Selector");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getAllByText("Remove").length).toBeGreaterThan(0);
      });
    });

    it("removes selector when remove button is clicked", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      // Add a second selector
      const addButton = screen.getByText("Add Another Selector");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Selector 2")).toBeInTheDocument();
      });

      // Remove the second selector
      const removeButtons = screen.getAllByText("Remove");
      fireEvent.click(removeButtons[1]);

      await waitFor(() => {
        expect(screen.queryByText("Selector 2")).not.toBeInTheDocument();
      });
    });

    it("renders property select with common operands", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Asset ID")).toBeInTheDocument();
      expect(screen.getByText("Asset Name")).toBeInTheDocument();
      expect(screen.getByText("Content Type")).toBeInTheDocument();
    });

    it("renders operator select with options", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Equals (=)")).toBeInTheDocument();
      expect(screen.getByText("In")).toBeInTheDocument();
      expect(screen.getByText("Like")).toBeInTheDocument();
    });

    it("displays asset ID as placeholder when assets are provided", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
          assets={mockAssets}
        />
      );

      const valueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      expect(valueInput?.placeholder).toContain("asset-1");
    });

    it("displays default placeholder when no assets provided", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
          assets={[]}
        />
      );

      const valueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      expect(valueInput?.placeholder).toBe("Enter value to match");
    });

    it("renders selector with correct numbering", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Selector 1")).toBeInTheDocument();

      const addButton = screen.getByText("Add Another Selector");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Selector 2")).toBeInTheDocument();
      });
    });

    it("renders helper texts for selector fields", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Asset property to match")).toBeInTheDocument();
      expect(screen.getByText("Comparison operator")).toBeInTheDocument();
      expect(
        screen.getByText("Value to match against the property")
      ).toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("marks required fields with asterisk", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const asterisks = screen.getAllByText("*");
      expect(asterisks.length).toBeGreaterThan(0);
    });

    it("has required attribute on contract ID field", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const idInput = document.querySelector('input[name="id"]');
      expect(idInput).toHaveAttribute("required");
    });

    it("has required attribute on access policy select", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const accessPolicySelect = document.querySelector(
        'select[name="accessPolicyId"]'
      );
      expect(accessPolicySelect).toHaveAttribute("required");
    });

    it("has required attribute on contract policy select", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const contractPolicySelect = document.querySelector(
        'select[name="contractPolicyId"]'
      );
      expect(contractPolicySelect).toHaveAttribute("required");
    });

    it("has required attribute on selector value field", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const valueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      );
      expect(valueInput).toHaveAttribute("required");
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with valid data", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      // Fill in contract ID
      const idInput = document.querySelector(
        'input[name="id"]'
      ) as HTMLInputElement;
      fireEvent.change(idInput, {
        target: { value: "test-contract-1" },
      });

      // Select access policy
      const accessPolicySelect = document.querySelector(
        'select[name="accessPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(accessPolicySelect, {
        target: { value: "policy-1" },
      });

      // Select contract policy
      const contractPolicySelect = document.querySelector(
        'select[name="contractPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(contractPolicySelect, {
        target: { value: "policy-2" },
      });

      // Fill in selector value
      const selectorValueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      fireEvent.change(selectorValueInput, {
        target: { value: "test-asset-1" },
      });

      // Submit form
      const submitButton = screen.getByText("Create Contract Definition");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "test-contract-1",
            accessPolicyId: "policy-1",
            contractPolicyId: "policy-2",
            assetsSelector: expect.arrayContaining([
              expect.objectContaining({
                operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
                operator: "=",
                operandRight: "test-asset-1",
              }),
            ]),
          }),
          expect.anything()
        );
      });
    });

    it("calls onSubmit with multiple selectors", async () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      // Add second selector
      const addButton = screen.getByText("Add Another Selector");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Selector 2")).toBeInTheDocument();
      });

      // Fill in form
      const idInput = document.querySelector(
        'input[name="id"]'
      ) as HTMLInputElement;
      fireEvent.change(idInput, {
        target: { value: "test-contract-1" },
      });

      const accessPolicySelect = document.querySelector(
        'select[name="accessPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(accessPolicySelect, {
        target: { value: "policy-1" },
      });

      const contractPolicySelect = document.querySelector(
        'select[name="contractPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(contractPolicySelect, {
        target: { value: "policy-2" },
      });

      const selector1Value = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      fireEvent.change(selector1Value, {
        target: { value: "asset-1" },
      });

      const selector2Value = document.querySelector(
        'input[name="assetsSelector.1.operandRight"]'
      ) as HTMLInputElement;
      fireEvent.change(selector2Value, {
        target: { value: "asset-2" },
      });

      // Submit
      const submitButton = screen.getByText("Create Contract Definition");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            assetsSelector: expect.arrayContaining([
              expect.objectContaining({ operandRight: "asset-1" }),
              expect.objectContaining({ operandRight: "asset-2" }),
            ]),
          }),
          expect.anything()
        );
      });
    });

    it("disables submit button while submitting", async () => {
      mockOnSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      // Fill in required fields
      const idInput = document.querySelector(
        'input[name="id"]'
      ) as HTMLInputElement;
      fireEvent.change(idInput, {
        target: { value: "test-contract-1" },
      });

      const accessPolicySelect = document.querySelector(
        'select[name="accessPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(accessPolicySelect, {
        target: { value: "policy-1" },
      });

      const contractPolicySelect = document.querySelector(
        'select[name="contractPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(contractPolicySelect, {
        target: { value: "policy-2" },
      });

      const selectorValueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      fireEvent.change(selectorValueInput, {
        target: { value: "test-asset-1" },
      });

      const submitButton = screen.getByText("Create Contract Definition");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveAttribute("aria-busy", "true");
      });
    });
  });

  describe("cancel button", () => {
    it("calls onCancel when cancel button is clicked", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("disables cancel button while submitting", async () => {
      mockOnSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      // Fill in required fields
      const idInput = document.querySelector(
        'input[name="id"]'
      ) as HTMLInputElement;
      fireEvent.change(idInput, {
        target: { value: "test-contract-1" },
      });

      const accessPolicySelect = document.querySelector(
        'select[name="accessPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(accessPolicySelect, {
        target: { value: "policy-1" },
      });

      const contractPolicySelect = document.querySelector(
        'select[name="contractPolicyId"]'
      ) as HTMLSelectElement;
      fireEvent.change(contractPolicySelect, {
        target: { value: "policy-2" },
      });

      const selectorValueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      fireEvent.change(selectorValueInput, {
        target: { value: "test-asset-1" },
      });

      const submitButton = screen.getByText("Create Contract Definition");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const cancelButton = screen.getByText("Cancel");
        expect(cancelButton).toBeDisabled();
      });
    });
  });

  describe("default values", () => {
    it("initializes with one asset selector", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(screen.getByText("Selector 1")).toBeInTheDocument();
      expect(screen.queryByText("Selector 2")).not.toBeInTheDocument();
    });

    it("initializes selector with default operandLeft", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const operandLeftSelect = document.querySelector(
        'select[name="assetsSelector.0.operandLeft"]'
      ) as HTMLSelectElement;
      expect(operandLeftSelect?.value).toBe(
        "https://w3id.org/edc/v0.0.1/ns/id"
      );
    });

    it("initializes selector with default operator", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const operatorSelect = document.querySelector(
        'select[name="assetsSelector.0.operator"]'
      ) as HTMLSelectElement;
      expect(operatorSelect?.value).toBe("=");
    });
  });

  describe("edge cases", () => {
    it("handles empty policies array", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={[]}
        />
      );

      expect(screen.getByText("Access Policy")).toBeInTheDocument();
      expect(screen.getByText("Contract Policy")).toBeInTheDocument();
    });

    it("handles undefined policies prop", () => {
      render(<ContractForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText("Access Policy")).toBeInTheDocument();
    });

    it("handles undefined assets prop", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const valueInput = document.querySelector(
        'input[name="assetsSelector.0.operandRight"]'
      ) as HTMLInputElement;
      expect(valueInput?.placeholder).toBe("Enter value to match");
    });

    it("renders fieldset with legend for asset selectors", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const fieldset = document.querySelector("fieldset");
      expect(fieldset).toBeInTheDocument();

      const legend = document.querySelector("legend");
      expect(legend).toHaveTextContent("Asset Selectors");
    });
  });

  describe("accessibility", () => {
    it("renders form with proper semantic structure", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      expect(document.querySelector("form")).toBeInTheDocument();
      expect(document.querySelector("fieldset")).toBeInTheDocument();
      expect(document.querySelector("legend")).toBeInTheDocument();
    });

    it("associates labels with inputs", () => {
      render(
        <ContractForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          policies={mockPolicies}
        />
      );

      const idInput = document.querySelector('input[name="id"]');
      const label = screen.getByText("Contract Definition ID");

      expect(idInput).toHaveAttribute("id");
      expect(label).toHaveAttribute("for");
    });
  });
});
