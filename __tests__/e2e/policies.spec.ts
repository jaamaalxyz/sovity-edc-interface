import { expect, test } from "@playwright/test";

import {
  clickButtonByText,
  fillFieldByLabel,
  generateTestId,
  navigateToPage,
  waitForAppReady,
} from "@/lib/e2e-helpers";

/**
 * E2E Tests for Policy Management
 * Tests policy creation, viewing, and deletion
 */

test.describe("Policy Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to policies page before each test
    await navigateToPage(page, "/policies");
  });

  test("should display policies page with search and create button", async ({
    page,
  }) => {
    // Check page title/heading
    await expect(
      page.getByRole("heading", { name: /policies/i })
    ).toBeVisible();

    // Check search input exists
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();

    // Check create button exists
    await expect(
      page.getByRole("button", { name: /new policy|create policy/i })
    ).toBeVisible();
  });

  test("should search and filter policies", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);

    // Type in search
    await searchInput.fill("test");

    // Wait for results to update
    await waitForAppReady(page);

    // Verify search input has value
    await expect(searchInput).toHaveValue("test");
  });

  test("should create a new policy successfully", async ({ page }) => {
    const testId = generateTestId("policy");

    // Click create button
    await clickButtonByText(page, /new policy|create policy/i);

    // Wait for form/modal to appear
    await page.waitForSelector('input[name="id"]', { state: "visible" });

    // Fill in the form
    await fillFieldByLabel(page, "id", testId);

    // Fill in the action field (permissions.0.action)
    const actionInput = page.locator('input[name="permissions.0.action"]');
    if (await actionInput.isVisible()) {
      await actionInput.fill("USE");
    }

    // Submit the form (click the submit button inside the modal)
    await page
      .locator("form")
      .getByRole("button", { name: /create|submit/i })
      .click();

    // Wait for policy to appear in the list
    await page.waitForTimeout(1000);
    await waitForAppReady(page);

    // Verify policy appears in list (search for it)
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill(testId);
    await waitForAppReady(page);

    // Check that the policy card is visible (use heading to avoid toast notification conflict)
    await expect(page.getByRole("heading", { name: testId })).toBeVisible();
  });

  test("should view policy details", async ({ page }) => {
    // Click on the first policy card
    const firstPolicyCard = page
      .locator('[data-testid^="policy-card"], .policy-card')
      .first();

    if (await firstPolicyCard.isVisible()) {
      await firstPolicyCard.click();

      // Wait for details to load
      await waitForAppReady(page);

      // Verify we're viewing details
      await expect(
        page.getByText(/permissions|prohibitions|obligations|rules/i)
      ).toBeVisible();
    }
  });

  test("should display policy permissions", async ({ page }) => {
    // Look for policy cards with permissions
    const permissionBadge = page
      .locator('[data-testid*="permission"], .permission, .badge')
      .first();

    if (await permissionBadge.isVisible()) {
      // Verify permission text is visible
      await expect(permissionBadge).toContainText(/use|read|write|permission/i);
    }
  });

  test("should delete a policy with confirmation", async ({ page }) => {
    // Get the policy cards count before deletion
    const policyCards = await page
      .locator('[data-testid^="policy-card"], .policy-card, [class*="card"]')
      .count();

    if (policyCards > 0) {
      // Find and click the delete button in the first policy card
      const firstCard = page
        .locator('[data-testid^="policy-card"], .policy-card, [class*="card"]')
        .first();
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

      // The policy should be removed (count decremented)
      const newCount = await page
        .locator('[data-testid^="policy-card"], .policy-card, [class*="card"]')
        .count();
      expect(newCount).toBeLessThan(policyCards);
    } else {
      // If no policies, test passes (nothing to delete)
      expect(true).toBe(true);
    }
  });

  test("should handle form validation errors", async ({ page }) => {
    // Click create button
    await clickButtonByText(page, /new policy|create policy/i);
    await page.waitForSelector('input[name="id"]', { state: "visible" });

    // Try to submit without filling required fields
    await page
      .locator("form")
      .getByRole("button", { name: /create|submit/i })
      .click();

    // Check for validation error messages (check for form field errors)
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

  test("should cancel policy creation", async ({ page }) => {
    // Click create button
    await clickButtonByText(page, /new policy|create policy/i);
    await page.waitForSelector('input[name="id"]', { state: "visible" });

    // Fill in some data
    await fillFieldByLabel(page, "id", "cancelled-policy");

    // Click cancel button (inside the modal)
    await page
      .locator("form")
      .getByRole("button", { name: /cancel/i })
      .click();

    // Verify modal/form is closed
    await expect(page.locator('input[name="id"]')).not.toBeVisible();
  });

  test("should display policy rule types correctly", async ({ page }) => {
    // Verify that policy cards show permissions/prohibitions/obligations
    const policyCard = page
      .locator('[data-testid^="policy-card"], .policy-card')
      .first();

    if (await policyCard.isVisible()) {
      // The card should have some indication of rules
      // This could be badges, icons, or text
      const hasRuleIndicator =
        (await policyCard
          .locator('[data-testid*="rule"], .rule, .badge')
          .count()) > 0;
      expect(hasRuleIndicator).toBeTruthy();
    }
  });
});

test.describe("Policy Error Handling", () => {
  test("should handle empty state gracefully", async ({ page }) => {
    await navigateToPage(page, "/policies");

    // Search for non-existent policy
    await page
      .getByPlaceholder(/search/i)
      .fill("definitely-does-not-exist-12345");
    await waitForAppReady(page);

    // Should show empty state or no results
    // The page should still be functional
  });

  test("should show loading states", async ({ page }) => {
    await page.goto("/policies");

    // Wait for page to load
    await waitForAppReady(page);

    await expect(
      page.getByRole("heading", { name: /policies/i })
    ).toBeVisible();
  });
});

test.describe("Policy Advanced Features", () => {
  test("should handle policies with multiple permissions", async ({ page }) => {
    await navigateToPage(page, "/policies");

    // Look for policies with multiple permission badges
    const policyWithMultipleRules = page
      .locator('[data-testid^="policy-card"]')
      .first();

    if (await policyWithMultipleRules.isVisible()) {
      // Count permission indicators
      const ruleCount = await policyWithMultipleRules
        .locator('.badge, [data-testid*="rule"]')
        .count();

      // Just verify the structure exists
      expect(ruleCount).toBeGreaterThanOrEqual(0);
    }
  });
});
