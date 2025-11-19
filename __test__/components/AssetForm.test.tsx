/**
 * AssetForm Component Tests
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AssetForm from "@/components/AssetForm";
import type { Asset } from "@/types/asset";

describe("AssetForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText(/Asset ID/)).toBeInTheDocument();
    expect(screen.getByText(/^Name/)).toBeInTheDocument();
    expect(screen.getByText(/Description/)).toBeInTheDocument();
    expect(screen.getByText(/Content Type/)).toBeInTheDocument();
    expect(screen.getByText(/Version/)).toBeInTheDocument();
    expect(document.querySelector('input[name="id"]')).toBeInTheDocument();
    expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
  });

  it("renders submit and cancel buttons", () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText("Create Asset")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("validates required fields have required attribute", () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(document.querySelector('input[name="id"]')).toHaveAttribute(
      "required"
    );
    expect(document.querySelector('input[name="name"]')).toHaveAttribute(
      "required"
    );
    expect(
      document.querySelector('select[name="contentType"]')
    ).toHaveAttribute("required");
  });

  it("submits form with valid data", async () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in required fields using querySelector
    const idInput = document.querySelector('input[name="id"]');
    const nameInput = document.querySelector('input[name="name"]');
    const contentTypeSelect = document.querySelector(
      'select[name="contentType"]'
    );
    const dataAddressTypeInput = document.querySelector(
      'input[name="dataAddressType"]'
    );

    if (idInput)
      fireEvent.change(idInput, { target: { value: "test-asset-1" } });
    if (nameInput)
      fireEvent.change(nameInput, { target: { value: "Test Asset" } });
    if (contentTypeSelect)
      fireEvent.change(contentTypeSelect, {
        target: { value: "application/json" },
      });
    if (dataAddressTypeInput)
      fireEvent.change(dataAddressTypeInput, { target: { value: "HttpData" } });

    // Submit form
    fireEvent.click(screen.getByText("Create Asset"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("populates form when editing existing asset", () => {
    const existingAsset: Asset = {
      "@id": "existing-asset",
      properties: {
        "asset:prop:name": "Existing Asset",
        "asset:prop:description": "Test description",
        "asset:prop:contenttype": "text/csv",
        "asset:prop:version": "2.0.0",
      },
      dataAddress: {
        type: "HttpData",
        baseUrl: "https://example.com",
      },
    };

    render(
      <AssetForm
        asset={existingAsset}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
      />
    );

    expect(screen.getByDisplayValue("existing-asset")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Asset")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();

    // Check contentType select has correct value
    const contentTypeSelect = document.querySelector(
      'select[name="contentType"]'
    ) as HTMLSelectElement;
    expect(contentTypeSelect).toHaveValue("text/csv");

    expect(screen.getByDisplayValue("2.0.0")).toBeInTheDocument();
    expect(screen.getByDisplayValue("HttpData")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();
  });

  it("disables asset ID field when editing", () => {
    const existingAsset: Asset = {
      "@id": "existing-asset",
      properties: {
        name: "Existing Asset",
      },
    };

    render(
      <AssetForm
        asset={existingAsset}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
      />
    );

    const assetIdField = document.querySelector('input[name="id"]');
    expect(assetIdField).toBeDisabled();
  });

  it("changes submit button text when editing", () => {
    const existingAsset: Asset = {
      "@id": "existing-asset",
      properties: {
        name: "Existing Asset",
      },
    };

    render(
      <AssetForm
        asset={existingAsset}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
      />
    );

    expect(screen.getByText("Update Asset")).toBeInTheDocument();
    expect(screen.queryByText("Create Asset")).not.toBeInTheDocument();
  });

  it("has default values for content type and data address type", () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const contentTypeSelect = document.querySelector(
      'select[name="contentType"]'
    );
    const dataAddressTypeInput = document.querySelector(
      'input[name="dataAddressType"]'
    );

    expect(contentTypeSelect).toHaveValue("application/json");
    expect(dataAddressTypeInput).toHaveValue("HttpData");
  });

  it("allows optional fields to be empty", async () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill only required fields
    const idInput = document.querySelector('input[name="id"]');
    const nameInput = document.querySelector('input[name="name"]');
    const contentTypeSelect = document.querySelector(
      'select[name="contentType"]'
    );
    const dataAddressTypeInput = document.querySelector(
      'input[name="dataAddressType"]'
    );

    if (idInput)
      fireEvent.change(idInput, { target: { value: "test-asset-1" } });
    if (nameInput)
      fireEvent.change(nameInput, { target: { value: "Test Asset" } });
    if (contentTypeSelect)
      fireEvent.change(contentTypeSelect, {
        target: { value: "application/json" },
      });
    if (dataAddressTypeInput)
      fireEvent.change(dataAddressTypeInput, { target: { value: "HttpData" } });

    // Description, version, and baseUrl should be optional
    fireEvent.click(screen.getByText("Create Asset"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("renders MIME type select with predefined options", () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const contentTypeSelect = document.querySelector(
      'select[name="contentType"]'
    ) as HTMLSelectElement;

    expect(contentTypeSelect).toBeInTheDocument();

    // Check for some common MIME types
    const options = Array.from(contentTypeSelect.options).map(
      (opt) => opt.value
    );
    expect(options).toContain("application/json");
    expect(options).toContain("application/xml");
    expect(options).toContain("text/csv");
    expect(options).toContain("application/pdf");
  });

  it("allows selecting custom MIME type", async () => {
    render(<AssetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const contentTypeSelect = document.querySelector(
      'select[name="contentType"]'
    ) as HTMLSelectElement;

    expect(contentTypeSelect).toBeInTheDocument();

    // Select the "Custom MIME type" option
    fireEvent.change(contentTypeSelect, { target: { value: "__custom__" } });

    await waitFor(
      () => {
        // Should now show an input field instead of select
        const customInput = document.querySelector('input[name="contentType"]');
        expect(customInput).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("displays custom MIME type value when editing with non-standard MIME type", () => {
    const existingAsset: Asset = {
      "@id": "existing-asset",
      properties: {
        "asset:prop:name": "Existing Asset",
        "asset:prop:contenttype": "application/custom-type",
      },
    };

    render(
      <AssetForm
        asset={existingAsset}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
      />
    );

    // Should display custom input with the custom MIME type
    const customInput = document.querySelector('input[name="contentType"]');
    expect(customInput).toBeInTheDocument();
    expect(customInput).toHaveValue("application/custom-type");
  });
});
