import { expect, Page } from "@playwright/test";

/**
 * E2E Test Helpers
 * Common utilities for Playwright tests
 */

/**
 * Wait for the app to be fully loaded
 */
export async function waitForAppReady(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateToPage(page: Page, path: string) {
  await page.goto(path);
  await waitForAppReady(page);
}

/**
 * Generate a unique ID for testing
 */
export function generateTestId(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Fill form field by label (supports input, textarea, and select)
 */
export async function fillFieldByLabel(
  page: Page,
  label: string,
  value: string
) {
  const field = page.locator(
    `input[name="${label}"], textarea[name="${label}"], select[name="${label}"]`
  );

  // Get the element type
  const tagName = await field.evaluate((el) => el.tagName.toLowerCase());

  if (tagName === "select") {
    await field.selectOption(value);
  } else {
    await field.fill(value);
  }
}

/**
 * Click button by text or regex pattern
 */
export async function clickButtonByText(page: Page, text: string | RegExp) {
  await page.getByRole("button", { name: text }).click();
}

/**
 * Wait for toast/notification to appear
 */
export async function waitForToast(page: Page, message?: string) {
  if (message) {
    await expect(page.getByText(message)).toBeVisible({ timeout: 5000 });
  } else {
    // Wait for any toast to appear
    await page.waitForSelector('[role="status"], [role="alert"]', {
      timeout: 5000,
    });
  }
}

/**
 * Confirm deletion in modal
 */
export async function confirmDeletion(page: Page) {
  // Wait for modal to appear
  await page.waitForSelector('[role="dialog"]', { state: "visible" });

  // Click confirm button
  await clickButtonByText(page, /confirm|delete|yes/i);
}

/**
 * Close modal
 */
export async function closeModal(page: Page) {
  // Try clicking close button or backdrop
  const closeButton = page
    .locator(
      'button:has-text("Cancel"), button:has-text("Close"), button[aria-label="Close"]'
    )
    .first();
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
}
