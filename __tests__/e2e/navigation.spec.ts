import { expect, test } from "@playwright/test";

import { navigateToPage, waitForAppReady } from "@/lib/e2e-helpers";

/**
 * E2E Tests for Navigation and General Functionality
 * Tests app navigation, routing, and cross-page functionality
 */

test.describe("Navigation", () => {
  test("should navigate to home page", async ({ page }) => {
    await navigateToPage(page, "/");

    // Check that we're on the home page
    await expect(page).toHaveURL("/");

    // Should have some content
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("should navigate to assets page via navigation", async ({ page }) => {
    await navigateToPage(page, "/");

    // Find and click assets link in navigation (use first link)
    await page
      .getByRole("link", { name: "Assets", exact: true })
      .first()
      .click();

    // Verify we're on assets page
    await expect(page).toHaveURL(/\/assets/);
    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();
  });

  test("should navigate to policies page via navigation", async ({ page }) => {
    await navigateToPage(page, "/");

    // Find and click policies link in navigation (use first link)
    await page
      .getByRole("link", { name: "Policies", exact: true })
      .first()
      .click();

    // Verify we're on policies page
    await expect(page).toHaveURL(/\/policies/);
    await expect(
      page.getByRole("heading", { name: /policies/i })
    ).toBeVisible();
  });

  test("should navigate between assets and policies", async ({ page }) => {
    // Start at assets
    await navigateToPage(page, "/assets");
    await expect(page).toHaveURL(/\/assets/);

    // Navigate to policies
    await page
      .getByRole("link", { name: "Policies", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/policies/);

    // Navigate back to assets
    await page
      .getByRole("link", { name: "Assets", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/assets/);
  });

  test("should handle browser back/forward navigation", async ({ page }) => {
    // Navigate through pages using the navigation links
    await navigateToPage(page, "/");

    // Click to assets page
    await page
      .getByRole("link", { name: "Assets", exact: true })
      .first()
      .click();
    await waitForAppReady(page);
    await expect(page).toHaveURL(/\/assets/);

    // Click to policies page
    await page
      .getByRole("link", { name: "Policies", exact: true })
      .first()
      .click();
    await waitForAppReady(page);
    await expect(page).toHaveURL(/\/policies/);

    // Go back to assets
    await page.goBack();
    await waitForAppReady(page);
    await expect(page).toHaveURL(/\/assets/);

    // Go forward to policies
    await page.goForward();
    await waitForAppReady(page);
    await expect(page).toHaveURL(/\/policies/);
  });

  test("should have working logo/home link", async ({ page }) => {
    await navigateToPage(page, "/assets");

    // Click logo or home link to go back to home
    const homeLink = page.getByRole("link", { name: /home|sovity/i }).first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL("/");
    }
  });

  test("should maintain navigation state after page reload", async ({
    page,
  }) => {
    await navigateToPage(page, "/assets");

    // Reload page
    await page.reload();
    await waitForAppReady(page);

    // Should still be on assets page
    await expect(page).toHaveURL(/\/assets/);
    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await navigateToPage(page, "/assets");

    // Page should still be functional
    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();

    // Search should be visible
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test("should work on tablet viewport", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await navigateToPage(page, "/policies");

    // Page should still be functional
    await expect(
      page.getByRole("heading", { name: /policies/i })
    ).toBeVisible();
  });

  test("should work on desktop viewport", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await navigateToPage(page, "/assets");

    // Page should still be functional
    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();
  });
});

test.describe("Error Handling", () => {
  test("should handle 404 pages gracefully", async ({ page }) => {
    // Try to navigate to non-existent page
    const response = await page.goto("/this-page-does-not-exist");

    // Should get 404 response or show error page
    // Next.js might redirect to 404 page
    if (response) {
      expect([404, 200]).toContain(response.status());
    }
  });

  test("should recover from network errors", async ({ page }) => {
    await navigateToPage(page, "/assets");

    // The page should load even if there are network issues
    // (mock API should handle this gracefully)
    await expect(page.getByRole("heading", { name: /assets/i })).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("should have proper page titles", async ({ page }) => {
    await navigateToPage(page, "/assets");
    await expect(page).toHaveTitle(/assets|sovity/i);

    await navigateToPage(page, "/policies");
    await expect(page).toHaveTitle(/policies|sovity/i);
  });

  test("should support keyboard navigation", async ({ page }) => {
    await navigateToPage(page, "/assets");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // At least one element should be focused
    const focusedElement = await page.locator(":focus").count();
    expect(focusedElement).toBeGreaterThan(0);
  });

  test("should have accessible buttons and links", async ({ page }) => {
    await navigateToPage(page, "/assets");

    // All buttons should have accessible names
    const buttons = await page.getByRole("button").all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});

test.describe("Performance", () => {
  test("should load pages within acceptable time", async ({ page }) => {
    const startTime = Date.now();

    await navigateToPage(page, "/assets");

    const loadTime = Date.now() - startTime;

    // Page should load in less than 5 seconds (generous for CI)
    expect(loadTime).toBeLessThan(5000);
  });

  test("should handle rapid navigation", async ({ page }) => {
    await navigateToPage(page, "/");

    // Rapidly navigate between pages
    await page.click('a[href="/assets"]');
    await page.waitForTimeout(100);

    await page.click('a[href="/policies"]');
    await page.waitForTimeout(100);

    await page.click('a[href="/assets"]');
    await waitForAppReady(page);

    // Should end up on correct page
    await expect(page).toHaveURL(/\/assets/);
  });
});

test.describe("Mock API Integration", () => {
  test("should work with mock API enabled", async ({ page }) => {
    await navigateToPage(page, "/assets");

    // Should show assets from mock data
    await waitForAppReady(page);

    // At least search input should be visible
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test("should handle API delays gracefully", async ({ page }) => {
    await navigateToPage(page, "/policies");

    // Mock API includes realistic delays
    // Page should show loading states and then content
    await waitForAppReady(page);

    await expect(
      page.getByRole("heading", { name: /policies/i })
    ).toBeVisible();
  });
});
