/**
 * AssetDetailsModal Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import AssetDetailsModal from "@/components/AssetDetailsModal";
import type { Asset } from "@/types/asset";

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

describe("AssetDetailsModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByText("Asset Details")).not.toBeInTheDocument();
  });

  it("does not render when asset is null", () => {
    render(
      <AssetDetailsModal asset={null} isOpen={true} onClose={mockOnClose} />
    );
    expect(screen.queryByText("Asset Details")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true and asset is provided", () => {
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText("Asset Details")).toBeInTheDocument();
  });

  it("displays basic asset information", () => {
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("test-asset-1")).toBeInTheDocument();
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
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Asset")).toBeInTheDocument();
  });

  it("displays created at timestamp", () => {
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check if the created date is displayed (formatted)
    const createdDate = new Date(mockAsset.createdAt!).toLocaleString();
    expect(screen.getByText(createdDate)).toBeInTheDocument();
  });

  it("displays all properties", () => {
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Properties")).toBeInTheDocument();
    // Properties should be displayed multiple times (in different sections)
    const nameElements = screen.getAllByText(/Test Asset/);
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it("displays data address information", () => {
    render(
      <AssetDetailsModal
        asset={mockAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Data Address")).toBeInTheDocument();
    expect(screen.getByText("HttpData")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/data")).toBeInTheDocument();
  });

  it("handles asset without optional fields", () => {
    const minimalAsset: Asset = {
      "@id": "minimal-asset",
      properties: {
        name: "Minimal Asset",
      },
    };

    render(
      <AssetDetailsModal
        asset={minimalAsset}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("minimal-asset")).toBeInTheDocument();
    const minimalAssetElements = screen.getAllByText("Minimal Asset");
    expect(minimalAssetElements.length).toBeGreaterThan(0);
  });

  it("handles complex property values", () => {
    const assetWithComplexProps: Asset = {
      "@id": "complex-asset",
      properties: {
        name: "Complex Asset",
        customObject: { key: "value" },
      },
    };

    render(
      <AssetDetailsModal
        asset={assetWithComplexProps}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Should display JSON stringified version of complex objects
    expect(screen.getByText(/key/)).toBeInTheDocument();
    expect(screen.getByText(/value/)).toBeInTheDocument();
  });
});
