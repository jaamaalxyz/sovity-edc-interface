/**
 * Tests for PolicyTemplateSelector Component
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PolicyTemplateSelector from "@/components/PolicyTemplateSelector";

describe("PolicyTemplateSelector", () => {
  const mockOnSelectTemplate = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render template selector", () => {
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    expect(
      screen.getByPlaceholderText(/search templates/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/all templates/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /use template/i })
    ).toBeInTheDocument();
  });

  it("should display category filters", () => {
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Check for category buttons
    expect(
      screen.getByRole("button", { name: /data sharing/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /access control/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /compliance/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /usage restrictions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /time-based/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /location-based/i })
    ).toBeInTheDocument();
  });

  it("should display templates by default", () => {
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Should show multiple templates (getAllByText since template names appear multiple times)
    const unrestrictedTemplates = screen.getAllByText(/unrestricted use/i);
    expect(unrestrictedTemplates.length).toBeGreaterThan(0);
  });

  it("should filter templates by category", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Click compliance category
    const complianceButton = screen.getByRole("button", {
      name: /compliance/i,
    });
    await user.click(complianceButton);

    // Should show GDPR template (compliance category)
    expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument();
  });

  it("should search templates", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search templates/i);
    await user.type(searchInput, "commercial");

    // Should show commercial use template (getAllByText for multiple matches)
    const commercialTemplates = screen.getAllByText(/commercial use allowed/i);
    expect(commercialTemplates.length).toBeGreaterThan(0);
  });

  it("should select a template", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Find and click a template card (get first occurrence)
    const unrestrictedTexts = screen.getAllByText(/unrestricted use/i);
    const unrestrictedCard = unrestrictedTexts[0].closest("div");
    expect(unrestrictedCard).toBeInTheDocument();
    if (unrestrictedCard) {
      await user.click(unrestrictedCard);
    }

    // Use Template button should now be enabled
    const useButton = screen.getByRole("button", { name: /use template/i });
    expect(useButton).not.toBeDisabled();
  });

  it("should call onSelectTemplate when Use Template is clicked", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Select a template (get first occurrence)
    const unrestrictedTexts = screen.getAllByText(/unrestricted use/i);
    const unrestrictedCard = unrestrictedTexts[0].closest("div");
    if (unrestrictedCard) {
      await user.click(unrestrictedCard);
    }

    // Click Use Template
    const useButton = screen.getByRole("button", { name: /use template/i });
    await user.click(useButton);

    expect(mockOnSelectTemplate).toHaveBeenCalledTimes(1);
    expect(mockOnSelectTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "unrestricted-use",
        name: "Unrestricted Use",
      })
    );
  });

  it("should call onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should show template details", () => {
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Should show permissions preview (getAllByText since it appears multiple times)
    const permissionLabels = screen.getAllByText(/permissions:/i);
    expect(permissionLabels.length).toBeGreaterThan(0);

    // Should show tags
    const tags = screen.queryAllByText(/open|public|unrestricted/i);
    expect(tags.length).toBeGreaterThan(0);
  });

  it("should show no results message when search has no matches", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search templates/i);
    await user.type(searchInput, "xyz123nonexistent");

    expect(screen.getByText(/no templates found/i)).toBeInTheDocument();
  });

  it("Use Template button should be disabled by default", () => {
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    const useButton = screen.getByRole("button", { name: /use template/i });
    expect(useButton).toBeDisabled();
  });

  it("should show use cases in details section", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Find and expand use cases
    const detailsElements = screen.getAllByText(/view use cases/i);
    expect(detailsElements.length).toBeGreaterThan(0);

    // Click the first one
    await user.click(detailsElements[0]);

    // Should show use cases (check for specific text rather than regex OR)
    const useCases = screen.queryAllByText(/open data|public|internal/i);
    expect(useCases.length).toBeGreaterThan(0);
  });

  it("should highlight selected template with visual indicator", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Select a template (get first occurrence)
    const unrestrictedTexts = screen.getAllByText(/unrestricted use/i);
    const unrestrictedCard = unrestrictedTexts[0].closest("div");
    if (unrestrictedCard) {
      await user.click(unrestrictedCard);

      // Should show selected indicator
      const selectedIcon = within(unrestrictedCard).getByLabelText(/selected/i);
      expect(selectedIcon).toBeInTheDocument();
    }
  });

  it("should allow switching between categories", async () => {
    const user = userEvent.setup();
    render(
      <PolicyTemplateSelector
        onSelectTemplate={mockOnSelectTemplate}
        onCancel={mockOnCancel}
      />
    );

    // Click compliance category
    await user.click(screen.getByRole("button", { name: /compliance/i }));
    expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument();

    // Switch to time-based
    await user.click(screen.getByRole("button", { name: /time-based/i }));
    expect(screen.getByText(/time-limited access/i)).toBeInTheDocument();

    // Switch back to all
    await user.click(screen.getByRole("button", { name: /all templates/i }));
    const unrestrictedTemplates = screen.getAllByText(/unrestricted use/i);
    expect(unrestrictedTemplates.length).toBeGreaterThan(0);
  });
});
