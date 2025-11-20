/**
 * ContractDetailsModal Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import ContractDetailsModal from "@/components/ContractDetailsModal";
import type { ContractDefinition } from "@/types/contract";

const mockContract: ContractDefinition = {
  "@id": "contract-1",
  "@type": "ContractDefinition",
  accessPolicyId: "access-policy-1",
  contractPolicyId: "contract-policy-1",
  assetsSelector: [
    {
      operandLeft: "asset:prop:id",
      operator: "=",
      operandRight: "asset-1",
    },
    {
      operandLeft: "asset:prop:type",
      operator: "IN",
      operandRight: "data",
    },
  ],
  createdAt: 1700000000000,
};

const mockContractWithSingleSelector: ContractDefinition = {
  "@id": "contract-2",
  "@type": "ContractDefinition",
  accessPolicyId: "access-policy-2",
  contractPolicyId: "contract-policy-2",
  assetsSelector: [
    {
      operandLeft: "asset:prop:name",
      operator: "=",
      operandRight: "Test Asset",
    },
  ],
};

const mockContractWithNoSelectors: ContractDefinition = {
  "@id": "contract-3",
  "@type": "ContractDefinition",
  accessPolicyId: "access-policy-3",
  contractPolicyId: "contract-policy-3",
  assetsSelector: [],
};

const mockContractWithoutCreatedAt: ContractDefinition = {
  "@id": "contract-4",
  "@type": "ContractDefinition",
  accessPolicyId: "access-policy-4",
  contractPolicyId: "contract-policy-4",
  assetsSelector: [],
};

const mockContractWithLongIds: ContractDefinition = {
  "@id": "contract-with-a-very-long-id-that-should-be-displayed-properly",
  "@type": "ContractDefinition",
  accessPolicyId:
    "access-policy-with-a-very-long-id-that-should-be-displayed-properly",
  contractPolicyId:
    "contract-policy-with-a-very-long-id-that-should-be-displayed-properly",
  assetsSelector: [
    {
      operandLeft:
        "asset:prop:very-long-property-name-that-should-wrap-properly",
      operator: "=",
      operandRight:
        "very-long-value-that-should-also-wrap-properly-in-the-interface",
    },
  ],
  createdAt: 1700000000000,
};

describe("ContractDetailsModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("modal visibility", () => {
    it("does not render when isOpen is false", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={false}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.queryByText("Contract Definition Details")
      ).not.toBeInTheDocument();
    });

    it("does not render when contract is null", () => {
      render(
        <ContractDetailsModal
          contract={null}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.queryByText("Contract Definition Details")
      ).not.toBeInTheDocument();
    });

    it("renders when isOpen is true and contract is provided", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("Contract Definition Details")
      ).toBeInTheDocument();
    });

    it("returns null early when contract is null", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={null}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("contract ID section", () => {
    it("displays contract ID heading", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Contract ID")).toBeInTheDocument();
    });

    it("displays contract ID value", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("contract-1")).toBeInTheDocument();
    });

    it("renders contract ID as code element", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const codeElements = container.querySelectorAll("code");
      const contractIdCode = Array.from(codeElements).find(
        (el) => el.textContent === "contract-1"
      );
      expect(contractIdCode).toBeInTheDocument();
    });

    it("displays long contract ID with break-all class", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContractWithLongIds}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText(
          "contract-with-a-very-long-id-that-should-be-displayed-properly"
        )
      ).toBeInTheDocument();
      const codeElements = container.querySelectorAll("code");
      const longIdCode = Array.from(codeElements).find((el) =>
        el.textContent?.includes("contract-with-a-very-long-id")
      );
      expect(longIdCode).toHaveClass("break-all");
    });

    it("renders link icon for contract ID section", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const linkIcon = container.querySelector(".text-blue-600");
      expect(linkIcon).toBeInTheDocument();
    });
  });

  describe("policies section", () => {
    it("displays associated policies heading", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Associated Policies")).toBeInTheDocument();
    });

    it("displays policy icon", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const policyIcon = container.querySelector(".text-green-600");
      expect(policyIcon).toBeInTheDocument();
    });

    it("displays access policy section", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Access Policy")).toBeInTheDocument();
    });

    it("displays access policy ID", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("access-policy-1")).toBeInTheDocument();
    });

    it("displays access policy badge", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Access")).toBeInTheDocument();
    });

    it("displays access policy description", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("Defines who can access the assets in this contract")
      ).toBeInTheDocument();
    });

    it("applies correct styling to access policy badge", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const accessBadge = screen.getByText("Access");
      expect(accessBadge).toHaveClass("bg-green-100", "text-green-800");
    });

    it("displays contract policy section", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Contract Policy")).toBeInTheDocument();
    });

    it("displays contract policy ID", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("contract-policy-1")).toBeInTheDocument();
    });

    it("displays contract policy badge", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    it("displays contract policy description", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("Defines the terms and conditions of the contract")
      ).toBeInTheDocument();
    });

    it("applies correct styling to contract policy badge", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const contractBadge = screen.getByText("Contract");
      expect(contractBadge).toHaveClass("bg-blue-100", "text-blue-800");
    });
  });

  describe("asset selectors section", () => {
    it("displays asset selectors heading", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Asset Selectors")).toBeInTheDocument();
    });

    it("displays multiple asset selectors", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Selector 1")).toBeInTheDocument();
      expect(screen.getByText("Selector 2")).toBeInTheDocument();
    });

    it("displays selector operandLeft (property)", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("asset:prop:id")).toBeInTheDocument();
      expect(screen.getByText("asset:prop:type")).toBeInTheDocument();
    });

    it("displays selector operator", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("=")).toBeInTheDocument();
      expect(screen.getByText("IN")).toBeInTheDocument();
    });

    it("displays selector operandRight (value)", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("asset-1")).toBeInTheDocument();
      expect(screen.getByText("data")).toBeInTheDocument();
    });

    it("displays property label", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const propertyLabels = screen.getAllByText("Property:");
      expect(propertyLabels.length).toBe(2);
    });

    it("displays operator label", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const operatorLabels = screen.getAllByText("Operator:");
      expect(operatorLabels.length).toBe(2);
    });

    it("displays value label", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const valueLabels = screen.getAllByText("Value:");
      expect(valueLabels.length).toBe(2);
    });

    it("applies correct styling to operator badge", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const equalsBadge = screen.getByText("=");
      expect(equalsBadge).toHaveClass("bg-purple-100", "text-purple-800");
    });

    it("displays single selector", () => {
      render(
        <ContractDetailsModal
          contract={mockContractWithSingleSelector}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Selector 1")).toBeInTheDocument();
      expect(screen.queryByText("Selector 2")).not.toBeInTheDocument();
    });

    it('displays "No asset selectors defined" when empty', () => {
      render(
        <ContractDetailsModal
          contract={mockContractWithNoSelectors}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("No asset selectors defined")
      ).toBeInTheDocument();
    });

    it("handles long selector values with break-all class", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContractWithLongIds}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const codeElements = container.querySelectorAll("code");
      const longPropertyCode = Array.from(codeElements).find((el) =>
        el.textContent?.includes("very-long-property-name")
      );
      expect(longPropertyCode).toHaveClass("break-all");
    });

    it("displays selectors with correct numbering", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Selector 1")).toBeInTheDocument();
      expect(screen.getByText("Selector 2")).toBeInTheDocument();
    });
  });

  describe("metadata section", () => {
    it("displays metadata section when createdAt exists", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Metadata")).toBeInTheDocument();
    });

    it("displays created timestamp", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const createdDate = new Date(mockContract.createdAt!).toLocaleString();
      expect(screen.getByText(createdDate)).toBeInTheDocument();
    });

    it("displays Created label", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
    });

    it("does not display metadata section when createdAt is undefined", () => {
      render(
        <ContractDetailsModal
          contract={mockContractWithoutCreatedAt}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.queryByText("Metadata")).not.toBeInTheDocument();
    });

    it("formats timestamp correctly", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const expectedDate = new Date(1700000000000).toLocaleString();
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });
  });

  describe("close button", () => {
    it("displays close button", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const closeButton = screen.getByText("Close");
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("renders close button with ghost variant", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const closeButton = screen.getByText("Close").closest("button");
      expect(closeButton).toHaveClass("bg-transparent");
    });

    it("renders close icon", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const closeButton = screen.getByText("Close").closest("button");
      expect(closeButton?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("modal properties", () => {
    it("passes correct title to Modal component", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("Contract Definition Details")
      ).toBeInTheDocument();
    });

    it("renders with large size", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveClass("max-w-2xl");
    });

    it("has correct dialog role", () => {
      const { container } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles contract with undefined assetsSelector", () => {
      const contractWithUndefinedSelectors = {
        ...mockContract,
        assetsSelector: undefined as any,
      };
      render(
        <ContractDetailsModal
          contract={contractWithUndefinedSelectors}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("No asset selectors defined")
      ).toBeInTheDocument();
    });

    it("handles contract with null assetsSelector", () => {
      const contractWithNullSelectors = {
        ...mockContract,
        assetsSelector: null as any,
      };
      render(
        <ContractDetailsModal
          contract={contractWithNullSelectors}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("No asset selectors defined")
      ).toBeInTheDocument();
    });

    it("handles very long contract IDs", () => {
      render(
        <ContractDetailsModal
          contract={mockContractWithLongIds}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText(
          "contract-with-a-very-long-id-that-should-be-displayed-properly"
        )
      ).toBeInTheDocument();
    });

    it("handles very long policy IDs", () => {
      render(
        <ContractDetailsModal
          contract={mockContractWithLongIds}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText(
          "access-policy-with-a-very-long-id-that-should-be-displayed-properly"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "contract-policy-with-a-very-long-id-that-should-be-displayed-properly"
        )
      ).toBeInTheDocument();
    });

    it("handles special characters in selector values", () => {
      const contractWithSpecialChars: ContractDefinition = {
        "@id": "contract-special",
        "@type": "ContractDefinition",
        accessPolicyId: "policy-1",
        contractPolicyId: "policy-2",
        assetsSelector: [
          {
            operandLeft: "asset:prop:path",
            operator: "=",
            operandRight: "/path/to/resource?query=value&param=123",
          },
        ],
      };
      render(
        <ContractDetailsModal
          contract={contractWithSpecialChars}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(
        screen.getByText("/path/to/resource?query=value&param=123")
      ).toBeInTheDocument();
    });
  });

  describe("integration", () => {
    it("renders all sections for complete contract", () => {
      render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Modal title
      expect(
        screen.getByText("Contract Definition Details")
      ).toBeInTheDocument();

      // Contract ID section
      expect(screen.getByText("Contract ID")).toBeInTheDocument();
      expect(screen.getByText("contract-1")).toBeInTheDocument();

      // Policies section
      expect(screen.getByText("Associated Policies")).toBeInTheDocument();
      expect(screen.getByText("access-policy-1")).toBeInTheDocument();
      expect(screen.getByText("contract-policy-1")).toBeInTheDocument();

      // Asset selectors section
      expect(screen.getByText("Asset Selectors")).toBeInTheDocument();
      expect(screen.getByText("Selector 1")).toBeInTheDocument();

      // Metadata section
      expect(screen.getByText("Metadata")).toBeInTheDocument();

      // Close button
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("renders minimal contract without optional fields", () => {
      render(
        <ContractDetailsModal
          contract={mockContractWithoutCreatedAt}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-4")).toBeInTheDocument();
      expect(screen.queryByText("Metadata")).not.toBeInTheDocument();
    });

    it("maintains correct structure after re-render", () => {
      const { rerender } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-1")).toBeInTheDocument();

      rerender(
        <ContractDetailsModal
          contract={mockContractWithSingleSelector}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-2")).toBeInTheDocument();
      expect(screen.queryByText("contract-1")).not.toBeInTheDocument();
    });

    it("handles toggling modal open/close", () => {
      const { rerender } = render(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={false}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.queryByText("Contract Definition Details")
      ).not.toBeInTheDocument();

      rerender(
        <ContractDetailsModal
          contract={mockContract}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByText("Contract Definition Details")
      ).toBeInTheDocument();
    });
  });
});
