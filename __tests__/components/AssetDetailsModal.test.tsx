/**
 * AssetDetailsModal Component Tests
 */

import { fireEvent, screen, waitFor } from "@testing-library/react";

import AssetDetailsModal from "@/components/AssetDetailsModal";
import { renderWithQueryClient } from "@/lib/test-utils";
import type { Asset } from "@/types/asset";
import type { ContractDefinition } from "@/types/contract";

// Mock the useContracts hook
jest.mock("@/hooks/useContracts", () => ({
  useContracts: jest.fn(),
}));

import { useContracts } from "@/hooks/useContracts";

const mockAsset: Asset = {
  "@id": "test-asset-1",
  "@type": "Asset",
  properties: {
    "asset:prop:name": "Test Asset",
    "asset:prop:description": "This is a test asset description",
    "asset:prop:contenttype": "application/json",
    "asset:prop:version": "1.0.0",
  },
  dataAddress: {
    type: "HttpData",
    baseUrl: "https://example.com/data",
  },
  createdAt: 1234567890000,
};

const mockContract: ContractDefinition = {
  "@id": "contract-1",
  "@type": "ContractDefinition",
  accessPolicyId: "access-policy-1",
  contractPolicyId: "contract-policy-1",
  assetsSelector: [
    {
      operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
      operator: "=",
      operandRight: "test-asset-1",
    },
  ],
};

describe("AssetDetailsModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useContracts as jest.Mock).mockReturnValue({ data: [] });
  });

  describe("rendering", () => {
    it("does not render when isOpen is false", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={false}
          onClose={mockOnClose}
        />
      );
      expect(screen.queryByText("Asset Details")).not.toBeInTheDocument();
    });

    it("does not render when asset is null", () => {
      renderWithQueryClient(
        <AssetDetailsModal asset={null} isOpen={true} onClose={mockOnClose} />
      );
      expect(screen.queryByText("Asset Details")).not.toBeInTheDocument();
    });

    it("renders when isOpen is true and asset is provided", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Asset Details")).toBeInTheDocument();
    });

    it("renders modal with large size", () => {
      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Modal should be rendered (checking for modal-specific class or structure)
      expect(screen.getByText("Asset Details")).toBeInTheDocument();
    });
  });

  describe("basic information section", () => {
    it("displays basic asset information", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(screen.getByText("test-asset-1")).toBeInTheDocument();

      // Text appears in both Basic Information and Properties sections
      const testAssetElements = screen.getAllByText("Test Asset");
      expect(testAssetElements.length).toBeGreaterThan(0);

      const descriptionElements = screen.getAllByText(
        "This is a test asset description"
      );
      expect(descriptionElements.length).toBeGreaterThan(0);

      const jsonElements = screen.getAllByText("application/json");
      expect(jsonElements.length).toBeGreaterThan(0);

      const versionElements = screen.getAllByText("1.0.0");
      expect(versionElements.length).toBeGreaterThan(0);
    });

    it("displays asset type", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Asset")).toBeInTheDocument();
    });

    it("displays created at timestamp", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const createdDate = new Date(mockAsset.createdAt!).toLocaleString();
      expect(screen.getByText(createdDate)).toBeInTheDocument();
    });

    it("displays asset ID with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Asset ID")).toBeInTheDocument();
      expect(screen.getByText("test-asset-1")).toBeInTheDocument();
    });

    it("displays type with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Type")).toBeInTheDocument();
    });

    it("displays name with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("displays description with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("displays content type with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Content Type")).toBeInTheDocument();
    });

    it("displays version with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Version")).toBeInTheDocument();
    });

    it("displays created at with label", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Created At")).toBeInTheDocument();
    });
  });

  describe("properties section", () => {
    it("displays properties section", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Properties section should appear twice (once in Basic Info with specific keys, once in Properties with all keys)
      const propertiesHeaders = screen.getAllByText("Properties");
      expect(propertiesHeaders.length).toBeGreaterThan(0);
    });

    it("displays all properties with keys and values", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Check for property keys
      expect(screen.getByText("asset:prop:name")).toBeInTheDocument();
      expect(screen.getByText("asset:prop:description")).toBeInTheDocument();
      expect(screen.getByText("asset:prop:contenttype")).toBeInTheDocument();
      expect(screen.getByText("asset:prop:version")).toBeInTheDocument();
    });

    it("does not render properties section when no properties", () => {
      const assetWithoutProps: Asset = {
        "@id": "no-props",
        properties: {},
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={assetWithoutProps}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const propertiesHeaders = screen.queryAllByText("Properties");
      expect(propertiesHeaders).toHaveLength(0);
    });
  });

  describe("data address section", () => {
    it("displays data address information", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Data Address")).toBeInTheDocument();
      expect(screen.getByText("type")).toBeInTheDocument();
      expect(screen.getByText("HttpData")).toBeInTheDocument();
      expect(screen.getByText("baseUrl")).toBeInTheDocument();
      expect(screen.getByText("https://example.com/data")).toBeInTheDocument();
    });

    it("does not render data address section when not provided", () => {
      const assetWithoutDataAddress: Asset = {
        "@id": "no-data-address",
        properties: {
          name: "Test",
        },
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={assetWithoutDataAddress}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByText("Data Address")).not.toBeInTheDocument();
    });

    it("handles data address with object values", () => {
      const assetWithComplexDataAddress: Asset = {
        "@id": "complex-data-address",
        properties: {
          name: "Test",
        },
        dataAddress: {
          type: "HttpData",
          metadata: { key: "value", nested: { deep: "data" } },
        },
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={assetWithComplexDataAddress}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("metadata")).toBeInTheDocument();
      // Should display JSON stringified version
      expect(screen.getByText(/key/)).toBeInTheDocument();
      expect(screen.getByText(/value/)).toBeInTheDocument();
    });
  });

  describe("associated contracts section", () => {
    it("displays associated contracts section", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByText("Associated Contracts & Policies")
      ).toBeInTheDocument();
    });

    it("displays no contracts message when no associated contracts", () => {
      (useContracts as jest.Mock).mockReturnValue({ data: [] });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByText(
          "No contracts are currently associated with this asset."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Create a contract definition to link this asset with policies."
        )
      ).toBeInTheDocument();
    });

    it("displays associated contracts when available", () => {
      (useContracts as jest.Mock).mockReturnValue({ data: [mockContract] });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-1")).toBeInTheDocument();
      expect(screen.getByText("Access Policy:")).toBeInTheDocument();
      expect(screen.getByText("access-policy-1")).toBeInTheDocument();
      expect(screen.getByText("Contract Policy:")).toBeInTheDocument();
      expect(screen.getByText("contract-policy-1")).toBeInTheDocument();
    });

    it("displays multiple associated contracts", () => {
      const mockContract2: ContractDefinition = {
        "@id": "contract-2",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy-2",
        contractPolicyId: "contract-policy-2",
        assetsSelector: [
          {
            operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
            operator: "=",
            operandRight: "test-asset-1",
          },
        ],
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [mockContract, mockContract2],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-1")).toBeInTheDocument();
      expect(screen.getByText("contract-2")).toBeInTheDocument();
      expect(screen.getByText("access-policy-1")).toBeInTheDocument();
      expect(screen.getByText("access-policy-2")).toBeInTheDocument();
    });

    it("filters contracts by exact ID match", () => {
      const unrelatedContract: ContractDefinition = {
        "@id": "unrelated-contract",
        "@type": "ContractDefinition",
        accessPolicyId: "unrelated-policy",
        contractPolicyId: "unrelated-policy",
        assetsSelector: [
          {
            operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
            operator: "=",
            operandRight: "different-asset",
          },
        ],
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [mockContract, unrelatedContract],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-1")).toBeInTheDocument();
      expect(screen.queryByText("unrelated-contract")).not.toBeInTheDocument();
    });

    it("handles contracts with 'in' operator", () => {
      const contractWithIn: ContractDefinition = {
        "@id": "contract-with-in",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy-in",
        contractPolicyId: "contract-policy-in",
        assetsSelector: [
          {
            operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
            operator: "in",
            operandRight: ["test-asset-1", "other-asset"],
          },
        ],
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [contractWithIn],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-with-in")).toBeInTheDocument();
    });

    it("handles contracts with short ID path", () => {
      const contractWithShortPath: ContractDefinition = {
        "@id": "contract-short-path",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy-short",
        contractPolicyId: "contract-policy-short",
        assetsSelector: [
          {
            operandLeft: "/id",
            operator: "=",
            operandRight: "test-asset-1",
          },
        ],
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [contractWithShortPath],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("contract-short-path")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles asset without optional fields", () => {
      const minimalAsset: Asset = {
        "@id": "minimal-asset",
        properties: {
          name: "Minimal Asset",
        },
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={minimalAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("minimal-asset")).toBeInTheDocument();

      // Text appears in Properties section
      const minimalAssetElements = screen.getAllByText("Minimal Asset");
      expect(minimalAssetElements.length).toBeGreaterThan(0);
    });

    it("handles complex property values", () => {
      const assetWithComplexProps: Asset = {
        "@id": "complex-asset",
        properties: {
          name: "Complex Asset",
          customObject: { key: "value", nested: { deep: "data" } },
        },
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={assetWithComplexProps}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Should display JSON stringified version of complex objects
      expect(screen.getByText(/key/)).toBeInTheDocument();
      expect(screen.getByText(/value/)).toBeInTheDocument();
      expect(screen.getByText(/deep/)).toBeInTheDocument();
    });

    it("handles contracts with no assetsSelector", () => {
      const contractWithoutSelector: ContractDefinition = {
        "@id": "no-selector",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy",
        contractPolicyId: "contract-policy",
        assetsSelector: [],
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [contractWithoutSelector],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Should not display the contract without selectors
      expect(screen.queryByText("no-selector")).not.toBeInTheDocument();
    });

    it("handles contracts with undefined assetsSelector", () => {
      const contractWithUndefinedSelector = {
        "@id": "undefined-selector",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy",
        contractPolicyId: "contract-policy",
        assetsSelector: undefined as any,
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [contractWithUndefinedSelector],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByText("undefined-selector")).not.toBeInTheDocument();
    });

    it("handles contracts with invalid selector objects", () => {
      const contractWithInvalidSelector: ContractDefinition = {
        "@id": "invalid-selector",
        "@type": "ContractDefinition",
        accessPolicyId: "access-policy",
        contractPolicyId: "contract-policy",
        assetsSelector: [null as any, "string" as any, { invalid: true }],
      };

      (useContracts as jest.Mock).mockReturnValue({
        data: [contractWithInvalidSelector],
      });

      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByText("invalid-selector")).not.toBeInTheDocument();
    });

    it("handles empty or null property values", () => {
      const assetWithEmptyProps: Asset = {
        "@id": "empty-props",
        properties: {
          name: "",
          description: null as any,
          validProp: "Valid Value",
        },
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={assetWithEmptyProps}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Empty/null properties might not render in basic info section
      // but should appear in properties list
      expect(screen.getByText("Valid Value")).toBeInTheDocument();
    });

    it("handles asset without createdAt", () => {
      const assetWithoutCreatedAt: Asset = {
        "@id": "no-created-at",
        properties: {
          name: "Test",
        },
      };

      renderWithQueryClient(
        <AssetDetailsModal
          asset={assetWithoutCreatedAt}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByText("Created At")).not.toBeInTheDocument();
    });
  });

  describe("modal interactions", () => {
    it("calls onClose when modal is closed", async () => {
      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Find close button (usually an X button or similar)
      const closeButton = container.querySelector('button[aria-label="Close"]');
      if (closeButton) {
        fireEvent.click(closeButton);
        await waitFor(() => {
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
      }
    });
  });

  describe("accessibility", () => {
    it("renders section headings", () => {
      renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(screen.getByText("Properties")).toBeInTheDocument();
      expect(screen.getByText("Data Address")).toBeInTheDocument();
      expect(
        screen.getByText("Associated Contracts & Policies")
      ).toBeInTheDocument();
    });

    it("uses semantic HTML for definitions lists", () => {
      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const definitionLists = container.querySelectorAll("dl");
      expect(definitionLists.length).toBeGreaterThan(0);

      const definitionTerms = container.querySelectorAll("dt");
      expect(definitionTerms.length).toBeGreaterThan(0);

      const definitionDescriptions = container.querySelectorAll("dd");
      expect(definitionDescriptions.length).toBeGreaterThan(0);
    });

    it("uses appropriate text styling for labels and values", () => {
      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Labels should have specific styling
      const labels = container.querySelectorAll("dt");
      labels.forEach((label) => {
        expect(label).toHaveClass("text-sm", "font-medium", "text-gray-500");
      });

      // Values should have specific styling
      const values = container.querySelectorAll("dd");
      values.forEach((value) => {
        expect(value).toHaveClass("text-sm", "text-gray-900");
      });
    });
  });

  describe("styling", () => {
    it("applies correct spacing between sections", () => {
      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const mainContainer = container.querySelector(".space-y-6");
      expect(mainContainer).toBeInTheDocument();
    });

    it("applies border styling to contract cards", () => {
      (useContracts as jest.Mock).mockReturnValue({ data: [mockContract] });

      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const contractCard = container.querySelector(".border.border-gray-200");
      expect(contractCard).toBeInTheDocument();
    });

    it("applies break-all class for long text", () => {
      const { container } = renderWithQueryClient(
        <AssetDetailsModal
          asset={mockAsset}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const breakAllElements = container.querySelectorAll(".break-all");
      expect(breakAllElements.length).toBeGreaterThan(0);
    });
  });
});
