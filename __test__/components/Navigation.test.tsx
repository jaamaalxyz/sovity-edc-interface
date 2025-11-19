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

  it("highlights active route", () => {
    (usePathname as jest.Mock).mockReturnValue("/assets");
    render(<Navigation />);

    const assetsLink = screen.getByText("Assets").closest("a");
    expect(assetsLink).toHaveClass("bg-primary-50", "text-primary-700");
  });

  it("applies inactive styles to non-active routes", () => {
    (usePathname as jest.Mock).mockReturnValue("/assets");
    render(<Navigation />);

    const policiesLink = screen.getByText("Policies").closest("a");
    const contractsLink = screen.getByText("Contracts").closest("a");

    expect(policiesLink).toHaveClass("text-gray-600");
    expect(contractsLink).toHaveClass("text-gray-600");
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

  it("renders icons for each navigation item", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    const { container } = render(<Navigation />);

    // Should have 3 navigation icons
    const icons = container.querySelectorAll(".flex.items-center.gap-2 svg");
    expect(icons.length).toBe(3);
  });

  it("renders logo", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<Navigation />);

    const logo = screen.getByText("S");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("text-white");
  });
});
