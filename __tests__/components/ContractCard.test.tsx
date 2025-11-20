/**
 * ContractCard Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import ContractCard from "@/components/ContractCard";
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
      operator: "=",
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
      operandLeft: "asset:prop:id",
      operator: "=",
      operandRight: "asset-2",
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

const mockContractWithLongId: ContractDefinition = {
  "@id": "contract-with-a-very-long-id-that-should-be-truncated-in-the-ui",
  "@type": "ContractDefinition",
  accessPolicyId:
    "access-policy-with-a-very-long-id-that-should-be-truncated-in-the-ui",
  contractPolicyId:
    "contract-policy-with-a-very-long-id-that-should-be-truncated-in-the-ui",
  assetsSelector: [
    {
      operandLeft: "asset:prop:id",
      operator: "=",
      operandRight: "asset-1",
    },
  ],
};

describe("ContractCard", () => {
  const mockOnView = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders contract card component", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const card = container.querySelector(
        ".rounded-lg.border.border-gray-200.bg-white.shadow"
      );
      expect(card).toBeInTheDocument();
    });

    it("renders contract ID", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("contract-1")).toBeInTheDocument();
    });

    it("renders contract ID with title attribute for truncation", () => {
      render(
        <ContractCard
          contract={mockContractWithLongId}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const heading = screen.getByRole("heading", {
        name: "contract-with-a-very-long-id-that-should-be-truncated-in-the-ui",
      });
      expect(heading).toHaveAttribute(
        "title",
        "contract-with-a-very-long-id-that-should-be-truncated-in-the-ui"
      );
    });

    it("renders access policy ID", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("Access Policy:")).toBeInTheDocument();
      expect(screen.getByText("access-policy-1")).toBeInTheDocument();
    });

    it("renders contract policy ID", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("Contract Policy:")).toBeInTheDocument();
      expect(screen.getByText("contract-policy-1")).toBeInTheDocument();
    });

    it("renders access policy ID with title attribute for truncation", () => {
      render(
        <ContractCard
          contract={mockContractWithLongId}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const accessPolicySpan = screen.getByTitle(
        "access-policy-with-a-very-long-id-that-should-be-truncated-in-the-ui"
      );
      expect(accessPolicySpan).toBeInTheDocument();
    });

    it("renders contract policy ID with title attribute for truncation", () => {
      render(
        <ContractCard
          contract={mockContractWithLongId}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const contractPolicySpan = screen.getByTitle(
        "contract-policy-with-a-very-long-id-that-should-be-truncated-in-the-ui"
      );
      expect(contractPolicySpan).toBeInTheDocument();
    });
  });

  describe("asset selectors", () => {
    it("displays correct asset selector count for multiple selectors", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("2 Asset Selectors")).toBeInTheDocument();
    });

    it("displays singular form for single asset selector", () => {
      render(
        <ContractCard
          contract={mockContractWithSingleSelector}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("1 Asset Selector")).toBeInTheDocument();
    });

    it("displays zero asset selectors when none exist", () => {
      render(
        <ContractCard
          contract={mockContractWithNoSelectors}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("0 Asset Selectors")).toBeInTheDocument();
    });

    it("has correct styling for asset selector badge", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const badge = screen.getByText("2 Asset Selectors");
      expect(badge).toHaveClass("bg-purple-100", "text-purple-800");
    });
  });

  describe("button interactions", () => {
    it("calls onView when View Details button is clicked", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      const viewButton = screen.getByTestId("view-contract-button");
      fireEvent.click(viewButton);

      expect(mockOnView).toHaveBeenCalledTimes(1);
      expect(mockOnView).toHaveBeenCalledWith(mockContract);
    });

    it("calls onDelete when delete button is clicked", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId("delete-contract-button");
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockContract);
    });

    it("displays View Details button with correct text", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });

    it("renders view button with ghost variant", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const viewButton = screen.getByTestId("view-contract-button");
      expect(viewButton).toHaveClass("bg-transparent");
    });

    it("renders delete button with danger variant", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const deleteButton = screen.getByTestId("delete-contract-button");
      expect(deleteButton).toHaveClass("bg-red-600");
    });
  });

  describe("icons", () => {
    it("renders link icon for contract ID", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      // MdLink icon is rendered
      const linkIcon = container.querySelector(".text-blue-600");
      expect(linkIcon).toBeInTheDocument();
    });

    it("renders policy icons for access and contract policies", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      // MdPolicy icons are rendered
      const policyIcons = container.querySelectorAll(".text-green-600");
      expect(policyIcons.length).toBeGreaterThan(0);
    });

    it("renders visibility icon in view button", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const viewButton = screen.getByTestId("view-contract-button");
      expect(viewButton.querySelector("svg")).toBeInTheDocument();
    });

    it("renders trash icon in delete button", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const deleteButton = screen.getByTestId("delete-contract-button");
      expect(deleteButton.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("renders heading with correct role", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const heading = screen.getByRole("heading", { name: "contract-1" });
      expect(heading).toBeInTheDocument();
    });

    it("renders buttons with correct role", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("provides title attribute for truncated contract ID", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const heading = screen.getByRole("heading", { name: "contract-1" });
      expect(heading).toHaveAttribute("title", "contract-1");
    });

    it("provides title attributes for truncated policy IDs", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByTitle("access-policy-1")).toBeInTheDocument();
      expect(screen.getByTitle("contract-policy-1")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies hover shadow transition to card", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const card = container.querySelector(
        ".rounded-lg.border.border-gray-200.bg-white.shadow"
      );
      expect(card).toHaveClass("transition-all", "hover:shadow-md");
    });

    it("applies correct text styles to contract ID heading", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const heading = screen.getByRole("heading", { name: "contract-1" });
      expect(heading).toHaveClass(
        "truncate",
        "text-lg",
        "font-semibold",
        "text-gray-900"
      );
    });

    it("applies correct spacing classes to card body", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );
      const cardBody = container.querySelector(".space-y-3");
      expect(cardBody).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles missing createdAt field gracefully", () => {
      const contractWithoutCreatedAt: ContractDefinition = {
        "@id": "contract-no-date",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy",
        contractPolicyId: "contract-policy",
        assetsSelector: [],
      };

      expect(() =>
        render(
          <ContractCard
            contract={contractWithoutCreatedAt}
            onView={mockOnView}
            onDelete={mockOnDelete}
          />
        )
      ).not.toThrow();
    });

    it("handles contract with undefined assetsSelector", () => {
      const contractWithUndefinedSelectors = {
        ...mockContract,
        assetsSelector: undefined as any,
      };

      render(
        <ContractCard
          contract={contractWithUndefinedSelectors}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("0 Asset Selectors")).toBeInTheDocument();
    });

    it("does not call onView when clicking on card body", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      const cardBody = container.querySelector(".space-y-3");
      if (cardBody) {
        fireEvent.click(cardBody);
        expect(mockOnView).not.toHaveBeenCalled();
      }
    });

    it("only calls the respective handler when each button is clicked", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      const viewButton = screen.getByTestId("view-contract-button");
      fireEvent.click(viewButton);

      expect(mockOnView).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).not.toHaveBeenCalled();

      jest.clearAllMocks();

      const deleteButton = screen.getByTestId("delete-contract-button");
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnView).not.toHaveBeenCalled();
    });
  });

  describe("integration", () => {
    it("renders complete contract card with all sections", () => {
      const { container } = render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      // Card structure
      const card = container.querySelector(
        ".rounded-lg.border.border-gray-200.bg-white.shadow"
      );
      expect(card).toBeInTheDocument();

      // Contract ID section
      expect(screen.getByText("contract-1")).toBeInTheDocument();

      // Policy section
      expect(screen.getByText("Access Policy:")).toBeInTheDocument();
      expect(screen.getByText("access-policy-1")).toBeInTheDocument();
      expect(screen.getByText("Contract Policy:")).toBeInTheDocument();
      expect(screen.getByText("contract-policy-1")).toBeInTheDocument();

      // Asset selectors section
      expect(screen.getByText("2 Asset Selectors")).toBeInTheDocument();

      // Actions section
      expect(screen.getByTestId("view-contract-button")).toBeInTheDocument();
      expect(screen.getByTestId("delete-contract-button")).toBeInTheDocument();
    });

    it("maintains component state after multiple interactions", () => {
      render(
        <ContractCard
          contract={mockContract}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      const viewButton = screen.getByTestId("view-contract-button");
      const deleteButton = screen.getByTestId("delete-contract-button");

      // Multiple clicks on view button
      fireEvent.click(viewButton);
      fireEvent.click(viewButton);
      fireEvent.click(viewButton);

      expect(mockOnView).toHaveBeenCalledTimes(3);

      // Click delete button
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);

      // Verify contract data is still rendered correctly
      expect(screen.getByText("contract-1")).toBeInTheDocument();
      expect(screen.getByText("2 Asset Selectors")).toBeInTheDocument();
    });
  });
});
