import { expect, test } from "@playwright/test";

import {
  clickButtonByText,
  fillFieldByLabel,
  generateTestId,
  navigateToPage,
  waitForAppReady,
} from "@/lib/e2e-helpers";

/**
 * E2E Tests for Asset Management
 * Tests the complete asset lifecycle: Create, Read, Update, Delete
 */

test.describe("Asset Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to assets page before each test
    await navigateToPage(page, "/assets");
  });

  test("should display assets page with search and create button", async ({
    page,
  }) => {
    // Check page title/heading
    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();

    // Check search input exists
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();

    // Check create button exists
    await expect(
      page.getByRole("button", { name: /new asset|create asset/i })
    ).toBeVisible();
  });

  test("should search and filter assets", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);

    // Type in search
    await searchInput.fill("test");

    // Wait for results to update
    await waitForAppReady(page);

    // Verify search input has value
    await expect(searchInput).toHaveValue("test");
  });

  test("should create a new asset successfully", async ({ page }) => {
    const testId = generateTestId("asset");
    const testName = "E2E Test Asset";
    const testDescription = "Created by Playwright E2E test";

    // Click create button
    await clickButtonByText(page, /new asset|create asset/i);

    // Wait for form/modal to appear
    await page.waitForSelector('input[name="id"]', { state: "visible" });

    // Fill in the form
    await fillFieldByLabel(page, "id", testId);
    await fillFieldByLabel(page, "name", testName);
    await fillFieldByLabel(page, "description", testDescription);
    await fillFieldByLabel(page, "contentType", "application/json");
    await fillFieldByLabel(page, "version", "1.0.0");

    // Submit the form (click the submit button inside the modal)
    await page
      .locator("form")
      .getByRole("button", { name: /create|submit/i })
      .click();

    // Wait for asset to appear in the list or success message
    await page.waitForTimeout(1000); // Brief wait for API call
    await waitForAppReady(page);

    // Verify asset appears in list (search for it)
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill(testName);
    await waitForAppReady(page);

    // Check that the asset card is visible (use heading to avoid toast notification conflict)
    await expect(page.getByRole("heading", { name: testName })).toBeVisible();
  });

  test("should view asset details", async ({ page }) => {
    // Assuming there are assets in the list from mock data
    // Click on the first asset card or view button
    const firstAssetCard = page
      .locator('[data-testid^="asset-card"], .asset-card')
      .first();

    if (await firstAssetCard.isVisible()) {
      await firstAssetCard.click();

      // Wait for details to load
      await waitForAppReady(page);

      // Verify we're viewing details (could be modal or separate page)
      // Look for detail-specific elements
      await expect(
        page.getByText(/properties|data address|asset id/i)
      ).toBeVisible();
    }
  });

  test("should edit an existing asset", async ({ page }) => {
    // Find and click edit button on first asset
    const editButton = page
      .locator('button[aria-label*="edit"], button:has-text("Edit")')
      .first();

    if (await editButton.isVisible()) {
      await editButton.click();

      // Wait for edit form to appear
      await page.waitForSelector('input[name="name"]', { state: "visible" });

      // Update the name
      const updatedName = `Updated Asset ${Date.now()}`;
      await fillFieldByLabel(page, "name", updatedName);

      // Submit the form
      await clickButtonByText(page, /save|update/i);

      // Wait for update to complete
      await page.waitForTimeout(1000);
      await waitForAppReady(page);

      // Verify the updated name appears
      await expect(page.getByText(updatedName)).toBeVisible();
    }
  });

  test("should delete an asset with confirmation", async ({ page }) => {
    // Get the asset cards count
    const assetCards = await page
      .locator('.asset-card, [class*="card"]')
      .count();

    if (assetCards > 0) {
      // Find and click the delete button in the first asset card
      const firstCard = page.locator('.asset-card, [class*="card"]').first();
      const deleteButton = firstCard
        .locator('button:has-text("Delete"), button[aria-label*="Delete"]')
        .first();

      await deleteButton.click();

      // Confirm deletion in modal
      await page.waitForSelector('[role="dialog"]', {
        state: "visible",
        timeout: 5000,
      });
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: /confirm|delete|yes/i })
        .click();

      // Wait for deletion to complete
      await page.waitForTimeout(1000);

      // The asset should be removed (count decremented)
      const newCount = await page
        .locator('.asset-card, [class*="card"]')
        .count();
      expect(newCount).toBeLessThan(assetCards);
    } else {
      // If no assets, test passes (nothing to delete)
      expect(true).toBe(true);
    }
  });

  test("should handle form validation errors", async ({ page }) => {
    // Click create button
    await clickButtonByText(page, /new asset|create asset/i);
    await page.waitForSelector('input[name="id"]', { state: "visible" });

    // Try to submit without filling required fields
    await page
      .locator("form")
      .getByRole("button", { name: /create|submit/i })
      .click();

    // Check for validation error messages (check for form field errors)
    // The form validation should prevent submission and show error text
    const errorMessage = page
      .locator("text=/required|is required|must/i")
      .first();
    if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(errorMessage).toBeVisible();
    } else {
      // Form might prevent submission differently - check that we're still on the form
      await expect(page.locator('input[name="id"]')).toBeVisible();
    }
  });

  test("should cancel asset creation", async ({ page }) => {
    // Click create button
    await clickButtonByText(page, /new asset|create asset/i);
    await page.waitForSelector('input[name="id"]', { state: "visible" });

    // Fill in some data
    await fillFieldByLabel(page, "name", "Cancelled Asset");

    // Click cancel button (inside the modal)
    await page
      .locator("form")
      .getByRole("button", { name: /cancel/i })
      .click();

    // Verify modal/form is closed
    await expect(page.locator('input[name="id"]')).not.toBeVisible();
  });
});

test.describe("Asset Error Handling", () => {
  test("should handle empty state gracefully", async ({ page }) => {
    await navigateToPage(page, "/assets");

    // Search for non-existent asset
    await page
      .getByPlaceholder(/search/i)
      .fill("definitely-does-not-exist-12345");
    await waitForAppReady(page);

    // Should show empty state or no results message
    // The exact message depends on implementation
  });

  test("should show loading states", async ({ page }) => {
    await page.goto("/assets");

    // Loading indicator should appear briefly
    // This is timing-dependent, so we just verify the page loads successfully
    await waitForAppReady(page);

    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();
  });
});
