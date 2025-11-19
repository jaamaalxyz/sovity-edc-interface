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
      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /assets/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /policies/i })
      ).toBeInTheDocument();
    });

    it("should highlight active page", () => {
      mockPathname.mockReturnValue("/assets");

      renderWithQueryClient(<Navigation />);

      const assetsLink = screen.getByRole("link", { name: /assets/i });
      expect(assetsLink).toHaveClass("text-primary-700");

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).not.toHaveClass("text-primary-700");
    });

    it("should highlight policies page when active", () => {
      mockPathname.mockReturnValue("/policies");

      renderWithQueryClient(<Navigation />);

      const policiesLink = screen.getByRole("link", { name: /policies/i });
      expect(policiesLink).toHaveClass("text-primary-700");
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

    it("should have correct href for home page", () => {
      renderWithQueryClient(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Navigation State", () => {
    it("should maintain correct active state on home page", () => {
      mockPathname.mockReturnValue("/");

      renderWithQueryClient(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });

      expect(homeLink).toHaveClass("text-primary-700");
      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
    });

    it("should maintain correct active state on assets page", () => {
      mockPathname.mockReturnValue("/assets");

      renderWithQueryClient(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });

      expect(homeLink).not.toHaveClass("text-primary-700");
      expect(assetsLink).toHaveClass("text-primary-700");
      expect(policiesLink).not.toHaveClass("text-primary-700");
    });

    it("should maintain correct active state on policies page", () => {
      mockPathname.mockReturnValue("/policies");

      renderWithQueryClient(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });

      expect(homeLink).not.toHaveClass("text-primary-700");
      expect(assetsLink).not.toHaveClass("text-primary-700");
      expect(policiesLink).toHaveClass("text-primary-700");
    });
  });

  describe("Navigation Accessibility", () => {
    it("should have accessible navigation landmark", () => {
      renderWithQueryClient(<Navigation />);

      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
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
  });

  describe("Navigation Icons", () => {
    it("should display icons for each navigation item", () => {
      renderWithQueryClient(<Navigation />);

      // Navigation items should have icons (excluding the brand link)
      const homeLink = screen.getByRole("link", { name: /home/i });
      const assetsLink = screen.getByRole("link", { name: /assets/i });
      const policiesLink = screen.getByRole("link", { name: /policies/i });

      // Check that each navigation item has an svg icon
      const homeSvg = homeLink.querySelector("svg");
      const assetsSvg = assetsLink.querySelector("svg");
      const policiesSvg = policiesLink.querySelector("svg");

      expect(homeSvg).not.toBeNull();
      expect(assetsSvg).not.toBeNull();
      expect(policiesSvg).not.toBeNull();
    });
  });
});
