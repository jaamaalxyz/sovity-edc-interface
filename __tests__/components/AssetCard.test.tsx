/**
 * AssetCard Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import AssetCard from "@/components/AssetCard";
import type { Asset } from "@/types/asset";

const mockAsset: Asset = {
  "@id": "test-asset-1",
  "@type": "Asset",
  properties: {
    "asset:prop:name": "Test Asset",
    "asset:prop:description": "This is a test asset",
    "asset:prop:contenttype": "application/json",
  },
  dataAddress: {
    type: "HttpData",
  },
};

describe("AssetCard", () => {
  const mockOnView = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders asset information correctly", () => {
    render(
      <AssetCard
        asset={mockAsset}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test Asset")).toBeInTheDocument();
    expect(screen.getByText("test-asset-1")).toBeInTheDocument();
    expect(screen.getByText("This is a test asset")).toBeInTheDocument();
    expect(screen.getByText("application/json")).toBeInTheDocument();
  });

  it("calls onView when View Details is clicked", () => {
    render(
      <AssetCard
        asset={mockAsset}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText("View Details"));
    expect(mockOnView).toHaveBeenCalledWith(mockAsset);
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <AssetCard
        asset={mockAsset}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole("button");
    const editButton = buttons.find((btn) => btn.querySelector("svg"));
    if (editButton) {
      fireEvent.click(editButton);
    }
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it("handles asset with minimal properties", () => {
    const minimalAsset: Asset = {
      "@id": "minimal-asset",
      properties: {},
    };

    render(
      <AssetCard
        asset={minimalAsset}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const assetIdElements = screen.getAllByText("minimal-asset");
    expect(assetIdElements.length).toBeGreaterThan(0);
    expect(screen.getByText("No description")).toBeInTheDocument();
  });
});
