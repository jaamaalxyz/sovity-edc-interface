/**
 * Integration Tests for Navigation
 * Tests navigation flows between pages
 */

import { screen } from "@testing-library/react";

import Navigation from "@/components/Navigation";
import { renderWithQueryClient } from "@/lib/test-utils";

// Mock next/navigation
const mockPathname = jest.fn(() => "/");

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

describe("Navigation Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Navigation Component", () => {
    it("should render all navigation links", () => {
      renderWithQueryClient(<Navigation />);

      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /assets/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /policies/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /contracts/i })
      ).toBeInTheDocument();
    });

    it("should highlight active page - Assets", () => {
      mockPathname.mockReturnValue("/assets");

      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).toHaveClass("text-primary-700");
      expect(assetsLink).toHaveAttribute("aria-current", "page");

      const policiesLink = screen.getByRole("link", { name: /policies/i });
      expect(policiesLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveAttribute("aria-current");
    });

    it("should highlight active page - Policies", () => {
      mockPathname.mockReturnValue("/policies");

      renderWithQueryClient(<Navigation />);

      const policiesLink = screen.getByRole("link", { name: /policies/i });
      expect(policiesLink).toHaveClass("text-primary-700");
      expect(policiesLink).toHaveAttribute("aria-current", "page");

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).not.toHaveClass("text-primary-700");
    });

    it("should highlight active page - Contracts", () => {
      mockPathname.mockReturnValue("/contracts");

      renderWithQueryClient(<Navigation />);

      const contractsLink = screen.getByRole("link", { name: /contracts/i });
      expect(contractsLink).toHaveClass("text-primary-700");
      expect(contractsLink).toHaveAttribute("aria-current", "page");

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).not.toHaveClass("text-primary-700");
    });

    it("should have correct href for assets page", () => {
      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).toHaveAttribute("href", "/assets");
    });

    it("should have correct href for policies page", () => {
      renderWithQueryClient(<Navigation />);

      const policiesLink = screen.getByRole("link", { name: /policies/i });
      expect(policiesLink).toHaveAttribute("href", "/policies");
    });

    it("should have correct href for contracts page", () => {
      renderWithQueryClient(<Navigation />);

      const contractsLink = screen.getByRole("link", { name: /contracts/i });
      expect(contractsLink).toHaveAttribute("href", "/contracts");
    });

    it("should have correct href for brand logo", () => {
      renderWithQueryClient(<Navigation />);

      const brandLink = screen.getByRole("link", { name: /sovity edc/i });
      expect(brandLink).toHaveAttribute("href", "/");
    });
  });

  describe("Navigation State", () => {
    it("should maintain correct active state on home page", () => {
      mockPathname.mockReturnValue("/");

      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      // No navigation item should be active on home page
      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
      expect(contractsLink).not.toHaveClass("text-primary-700");

      expect(assetsLink).not.toHaveAttribute("aria-current");
      expect(policiesLink).not.toHaveAttribute("aria-current");
      expect(contractsLink).not.toHaveAttribute("aria-current");
    });

    it("should maintain correct active state on assets page", () => {
      mockPathname.mockReturnValue("/assets");

      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      expect(assetsLink).toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
      expect(contractsLink).not.toHaveClass("text-primary-700");

      expect(assetsLink).toHaveAttribute("aria-current", "page");
      expect(policiesLink).not.toHaveAttribute("aria-current");
      expect(contractsLink).not.toHaveAttribute("aria-current");
    });

    it("should maintain correct active state on policies page", () => {
      mockPathname.mockReturnValue("/policies");

      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).toHaveClass("text-primary-700");
      expect(contractsLink).not.toHaveClass("text-primary-700");

      expect(assetsLink).not.toHaveAttribute("aria-current");
      expect(policiesLink).toHaveAttribute("aria-current", "page");
      expect(contractsLink).not.toHaveAttribute("aria-current");
    });

    it("should maintain correct active state on contracts page", () => {
      mockPathname.mockReturnValue("/contracts");

      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
      expect(contractsLink).toHaveClass("text-primary-700");

      expect(assetsLink).not.toHaveAttribute("aria-current");
      expect(policiesLink).not.toHaveAttribute("aria-current");
      expect(contractsLink).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Navigation State Changes", () => {
    it("should update active state when navigating between pages", () => {
      // Start on assets page
      mockPathname.mockReturnValue("/assets");
      const { rerender } = renderWithQueryClient(<Navigation />);

      let assetsLink = screen.getByRole("link", { name: /assets/i });
      let policiesLink = screen.getByRole("link", { name: /policies/i });

      expect(assetsLink).toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");

      // Navigate to policies page
      mockPathname.mockReturnValue("/policies");
      rerender(<Navigation />);

      assetsLink = screen.getByRole("link", { name: /assets/i });
      policiesLink = screen.getByRole("link", { name: /policies/i });

      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).toHaveClass("text-primary-700");
    });

    it("should clear active state when navigating to home", () => {
      // Start on assets page
      mockPathname.mockReturnValue("/assets");
      const { rerender } = renderWithQueryClient(<Navigation />);

      let assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).toHaveClass("text-primary-700");

      // Navigate to home
      mockPathname.mockReturnValue("/");
      rerender(<Navigation />);

      assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
      expect(contractsLink).not.toHaveClass("text-primary-700");
    });
  });

  describe("Navigation Accessibility", () => {
    it("should have accessible navigation landmark", () => {
      renderWithQueryClient(<Navigation />);

      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it("should mark current page with aria-current", () => {
      mockPathname.mockReturnValue("/assets");
      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).toHaveAttribute("aria-current", "page");
    });

    it("should not mark inactive pages with aria-current", () => {
      mockPathname.mockReturnValue("/assets");
      renderWithQueryClient(<Navigation />);

      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      expect(policiesLink).not.toHaveAttribute("aria-current");
      expect(contractsLink).not.toHaveAttribute("aria-current");
    });
  });

  describe("Navigation Brand", () => {
    it("should display brand name", () => {
      renderWithQueryClient(<Navigation />);

      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
    });

    it("should display brand icon", () => {
      renderWithQueryClient(<Navigation />);

      const brandIcon = screen.getByText("S");
      expect(brandIcon).toBeInTheDocument();
      expect(brandIcon).toHaveClass("text-white");
    });

    it("should link brand to home page", () => {
      renderWithQueryClient(<Navigation />);

      const brandLink = screen.getByRole("link", { name: /sovity edc/i });
      expect(brandLink).toHaveAttribute("href", "/");
    });
  });

  describe("Navigation Icons", () => {
    it("should display icons for each navigation item", () => {
      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      // Check that each navigation item has an svg icon
      const assetsSvg = assetsLink.querySelector("svg");
      const policiesSvg = policiesLink.querySelector("svg");
      const contractsSvg = contractsLink.querySelector("svg");

      expect(assetsSvg).not.toBeNull();
      expect(policiesSvg).not.toBeNull();
      expect(contractsSvg).not.toBeNull();
    });

    it("should hide icons from screen readers", () => {
      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const assetsSvg = assetsLink.querySelector("svg");

      expect(assetsSvg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Navigation Layout", () => {
    it("should render navigation bar with correct structure", () => {
      const { container } = renderWithQueryClient(<Navigation />);

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("border-b", "border-gray-200");

      const navContainer = container.querySelector(".container");
      expect(navContainer).toBeInTheDocument();
    });

    it("should display all navigation items in correct order", () => {
      renderWithQueryClient(<Navigation />);

      const links = screen.getAllByRole("link");
      // First link is the brand
      expect(links[0]).toHaveTextContent("Sovity EDC");
      // Then navigation items
      expect(links[1]).toHaveTextContent("Assets");
      expect(links[2]).toHaveTextContent("Policies");
      expect(links[3]).toHaveTextContent("Contracts");
    });
  });

  describe("Edge Cases", () => {
    it("should handle unknown pathname gracefully", () => {
      mockPathname.mockReturnValue("/unknown-page");
      expect(() => renderWithQueryClient(<Navigation />)).not.toThrow();

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });
      const contractsLink = screen.getByRole("link", { name: /contracts/i });

      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
      expect(contractsLink).not.toHaveClass("text-primary-700");
    });

    it("should handle null pathname", () => {
      mockPathname.mockReturnValue(null);
      expect(() => renderWithQueryClient(<Navigation />)).not.toThrow();
    });

    it("should handle empty pathname", () => {
      mockPathname.mockReturnValue("");
      expect(() => renderWithQueryClient(<Navigation />)).not.toThrow();
    });

    it("should maintain consistent structure across route changes", () => {
      mockPathname.mockReturnValue("/assets");
      const { rerender } = renderWithQueryClient(<Navigation />);

      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
      expect(screen.getAllByRole("link")).toHaveLength(4);

      mockPathname.mockReturnValue("/policies");
      rerender(<Navigation />);

      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
      expect(screen.getAllByRole("link")).toHaveLength(4);

      mockPathname.mockReturnValue("/contracts");
      rerender(<Navigation />);

      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
      expect(screen.getAllByRole("link")).toHaveLength(4);
    });
  });
});
