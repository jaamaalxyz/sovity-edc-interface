/**
 * Navigation Component Tests
 */

import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import Navigation from "@/components/Navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders navigation bar", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);
      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
    });

    it("renders all navigation items", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      expect(screen.getByText("Assets")).toBeInTheDocument();
      expect(screen.getByText("Policies")).toBeInTheDocument();
      expect(screen.getByText("Contracts")).toBeInTheDocument();
    });

    it("renders correct links", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      expect(screen.getByText("Assets").closest("a")).toHaveAttribute(
        "href",
        "/assets"
      );
      expect(screen.getByText("Policies").closest("a")).toHaveAttribute(
        "href",
        "/policies"
      );
      expect(screen.getByText("Contracts").closest("a")).toHaveAttribute(
        "href",
        "/contracts"
      );
    });

    it("renders logo", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const logo = screen.getByText("S");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass("text-white");
    });

    it("renders logo link to home", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const logoLink = screen.getByText("Sovity EDC").closest("a");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("renders logo with correct styling", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const logoContainer = screen.getByText("S").parentElement;
      expect(logoContainer).toHaveClass(
        "flex",
        "size-8",
        "items-center",
        "justify-center",
        "rounded-lg",
        "bg-primary-600"
      );
    });
  });

  describe("active route highlighting", () => {
    it("highlights active route - Assets", () => {
      (usePathname as jest.Mock).mockReturnValue("/assets");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      expect(assetsLink).toHaveClass("bg-primary-50", "text-primary-700");
      expect(assetsLink).toHaveAttribute("aria-current", "page");
    });

    it("highlights active route - Policies", () => {
      (usePathname as jest.Mock).mockReturnValue("/policies");
      render(<Navigation />);

      const policiesLink = screen.getByText("Policies").closest("a");
      expect(policiesLink).toHaveClass("bg-primary-50", "text-primary-700");
      expect(policiesLink).toHaveAttribute("aria-current", "page");
    });

    it("highlights active route - Contracts", () => {
      (usePathname as jest.Mock).mockReturnValue("/contracts");
      render(<Navigation />);

      const contractsLink = screen.getByText("Contracts").closest("a");
      expect(contractsLink).toHaveClass("bg-primary-50", "text-primary-700");
      expect(contractsLink).toHaveAttribute("aria-current", "page");
    });

    it("applies inactive styles to non-active routes", () => {
      (usePathname as jest.Mock).mockReturnValue("/assets");
      render(<Navigation />);

      const policiesLink = screen.getByText("Policies").closest("a");
      const contractsLink = screen.getByText("Contracts").closest("a");

      expect(policiesLink).toHaveClass("text-gray-600", "hover:bg-gray-100");
      expect(policiesLink).not.toHaveAttribute("aria-current");
      expect(contractsLink).toHaveClass("text-gray-600", "hover:bg-gray-100");
      expect(contractsLink).not.toHaveAttribute("aria-current");
    });

    it("does not set aria-current for inactive links", () => {
      (usePathname as jest.Mock).mockReturnValue("/assets");
      render(<Navigation />);

      const policiesLink = screen.getByText("Policies").closest("a");
      expect(policiesLink).not.toHaveAttribute("aria-current");
    });

    it("handles unknown pathname gracefully", () => {
      (usePathname as jest.Mock).mockReturnValue("/unknown");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      const policiesLink = screen.getByText("Policies").closest("a");
      const contractsLink = screen.getByText("Contracts").closest("a");

      expect(assetsLink).not.toHaveClass("bg-primary-50");
      expect(policiesLink).not.toHaveClass("bg-primary-50");
      expect(contractsLink).not.toHaveClass("bg-primary-50");
    });
  });

  describe("icons", () => {
    it("renders icons for each navigation item", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      // Should have 3 navigation icons
      const icons = container.querySelectorAll(
        'div[role="navigation"] svg[aria-hidden="true"]'
      );
      expect(icons.length).toBe(3);
    });

    it("hides icons from screen readers", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      const icons = container.querySelectorAll(
        'div[role="navigation"] svg'
      );
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("renders icon with size-5 class", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      const icons = container.querySelectorAll(
        'div[role="navigation"] svg'
      );
      icons.forEach((icon) => {
        expect(icon).toHaveClass("size-5");
      });
    });
  });

  describe("accessibility", () => {
    it("has navigation landmark with aria-label", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const nav = screen.getByLabelText("Main navigation");
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe("NAV");
    });

    it("marks active page with aria-current", () => {
      (usePathname as jest.Mock).mockReturnValue("/assets");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      expect(assetsLink).toHaveAttribute("aria-current", "page");
    });

    it("has role=navigation for nav items container", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      const navItemsContainer = container.querySelector(
        'div[role="navigation"]'
      );
      expect(navItemsContainer).toBeInTheDocument();
    });

    it("hides logo icon from screen readers", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const logoContainer = screen.getByText("S").parentElement;
      expect(logoContainer).toHaveAttribute("aria-hidden", "true");
    });

    it("provides text content for all navigation items", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      expect(screen.getByText("Assets")).toBeInTheDocument();
      expect(screen.getByText("Policies")).toBeInTheDocument();
      expect(screen.getByText("Contracts")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies border and shadow to navigation bar", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass(
        "border-b",
        "border-gray-200",
        "bg-white",
        "shadow-sm"
      );
    });

    it("applies container styling", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      const containerDiv = container.querySelector(".container");
      expect(containerDiv).toHaveClass("mx-auto", "px-4");
    });

    it("applies correct height to navigation bar", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      const { container } = render(<Navigation />);

      const navContent = container.querySelector(".h-16");
      expect(navContent).toBeInTheDocument();
    });

    it("applies transition-colors to navigation links", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      expect(assetsLink).toHaveClass("transition-colors");
    });

    it("applies rounded-lg to navigation links", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      expect(assetsLink).toHaveClass("rounded-lg");
    });

    it("applies gap between icon and text", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      expect(assetsLink).toHaveClass("gap-2");
    });

    it("applies logo link styling", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const logoLink = screen.getByText("Sovity EDC").closest("a");
      expect(logoLink).toHaveClass("flex", "items-center", "gap-2");
    });

    it("applies brand name text styling", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const brandName = screen.getByText("Sovity EDC");
      expect(brandName).toHaveClass(
        "text-xl",
        "font-semibold",
        "text-gray-900"
      );
    });
  });

  describe("integration", () => {
    it("renders complete navigation structure", () => {
      (usePathname as jest.Mock).mockReturnValue("/assets");
      const { container } = render(<Navigation />);

      // Navigation bar
      expect(
        screen.getByLabelText("Main navigation")
      ).toBeInTheDocument();

      // Logo
      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText("Sovity EDC")).toBeInTheDocument();

      // Navigation items
      expect(screen.getByText("Assets")).toBeInTheDocument();
      expect(screen.getByText("Policies")).toBeInTheDocument();
      expect(screen.getByText("Contracts")).toBeInTheDocument();

      // Icons
      const icons = container.querySelectorAll(
        'div[role="navigation"] svg'
      );
      expect(icons.length).toBe(3);
    });

    it("maintains consistent structure across different routes", () => {
      const routes = ["/", "/assets", "/policies", "/contracts"];

      routes.forEach((route) => {
        (usePathname as jest.Mock).mockReturnValue(route);
        const { container, unmount } = render(<Navigation />);

        expect(screen.getByText("Sovity EDC")).toBeInTheDocument();
        expect(screen.getByText("Assets")).toBeInTheDocument();
        expect(screen.getByText("Policies")).toBeInTheDocument();
        expect(screen.getByText("Contracts")).toBeInTheDocument();

        const icons = container.querySelectorAll(
          'div[role="navigation"] svg'
        );
        expect(icons.length).toBe(3);

        unmount();
      });
    });

    it("updates active state when pathname changes", () => {
      (usePathname as jest.Mock).mockReturnValue("/assets");
      const { rerender } = render(<Navigation />);

      let assetsLink = screen.getByText("Assets").closest("a");
      expect(assetsLink).toHaveAttribute("aria-current", "page");

      // Change pathname to /policies
      (usePathname as jest.Mock).mockReturnValue("/policies");
      rerender(<Navigation />);

      assetsLink = screen.getByText("Assets").closest("a");
      const policiesLink = screen.getByText("Policies").closest("a");

      expect(assetsLink).not.toHaveAttribute("aria-current");
      expect(policiesLink).toHaveAttribute("aria-current", "page");
    });
  });

  describe("edge cases", () => {
    it("handles empty pathname", () => {
      (usePathname as jest.Mock).mockReturnValue("");
      expect(() => render(<Navigation />)).not.toThrow();
    });

    it("handles null-like pathname", () => {
      (usePathname as jest.Mock).mockReturnValue(null);
      expect(() => render(<Navigation />)).not.toThrow();
    });

    it("renders all items even when on home page", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      expect(screen.getByText("Assets")).toBeInTheDocument();
      expect(screen.getByText("Policies")).toBeInTheDocument();
      expect(screen.getByText("Contracts")).toBeInTheDocument();
    });

    it("does not mark any item as active on home page", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const assetsLink = screen.getByText("Assets").closest("a");
      const policiesLink = screen.getByText("Policies").closest("a");
      const contractsLink = screen.getByText("Contracts").closest("a");

      expect(assetsLink).not.toHaveAttribute("aria-current");
      expect(policiesLink).not.toHaveAttribute("aria-current");
      expect(contractsLink).not.toHaveAttribute("aria-current");
    });
  });
});
