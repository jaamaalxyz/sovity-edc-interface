/**
 * Pagination Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("does not render when totalPages is 1", () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          totalItems={10}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("does not render when totalPages is less than 1", () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          totalItems={0}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders when totalPages is greater than 1", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      const previousButtons = screen.getAllByText("Previous");
      expect(previousButtons.length).toBeGreaterThan(0);
    });

    it("renders mobile view with Previous and Next buttons", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      const previousButtons = screen.getAllByText("Previous");
      const nextButtons = screen.getAllByText("Next");
      expect(previousButtons.length).toBeGreaterThan(0);
      expect(nextButtons.length).toBeGreaterThan(0);
    });

    it("displays item range information", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(screen.getByText(/Showing/)).toBeInTheDocument();
      expect(screen.getByText(/11/)).toBeInTheDocument(); // startItem
      expect(screen.getByText(/20/)).toBeInTheDocument(); // endItem
      expect(screen.getByText(/50/)).toBeInTheDocument(); // totalItems
    });

    it("calculates correct item range for first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 1 to 10 of 50 results"
          );
        })
      ).toBeInTheDocument();
    });

    it("calculates correct item range for last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 41 to 50 of 50 results"
          );
        })
      ).toBeInTheDocument();
    });

    it("handles partial last page correctly", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={3}
          totalItems={25}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      // Only 5 items on last page
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 21 to 25 of 25 results"
          );
        })
      ).toBeInTheDocument();
    });
  });

  describe("page buttons", () => {
    it("renders all page number buttons when no pageRange provided", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      // Get all buttons with aria-label containing "Go to page"
      const pageButtons = screen.getAllByLabelText(/Go to page \d+/);
      expect(pageButtons).toHaveLength(5);
    });

    it("renders page buttons from pageRange when provided", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          totalItems={100}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[1, -1, 4, 5, 6, -1, 10]}
        />
      );

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 6")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
    });

    it("renders ellipsis for pageRange with -1 values", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          totalItems={100}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[1, -1, 4, 5, 6, -1, 10]}
        />
      );

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis).toHaveLength(2);
    });

    it("highlights current page button", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByLabelText("Go to page 3");
      expect(currentPageButton).toHaveClass("bg-primary-600");
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });

    it("does not highlight non-current page buttons", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const page1Button = screen.getByLabelText("Go to page 1");
      expect(page1Button).not.toHaveClass("bg-primary-600");
      expect(page1Button).not.toHaveAttribute("aria-current");
    });

    it("calls onPageChange when page button is clicked", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const page4Button = screen.getByLabelText("Go to page 4");
      fireEvent.click(page4Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("calls onPageChange when page button from pageRange is clicked", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          totalItems={100}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[1, -1, 4, 5, 6, -1, 10]}
        />
      );

      const page6Button = screen.getByLabelText("Go to page 6");
      fireEvent.click(page6Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(6);
    });
  });

  describe("previous button", () => {
    it("is disabled on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      expect(previousButton).toBeDisabled();
      expect(previousButton).toHaveClass("cursor-not-allowed");
      expect(previousButton).toHaveClass("opacity-50");
    });

    it("is enabled when not on first page", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      expect(previousButton).not.toBeDisabled();
    });

    it("calls onPageChange with previous page when clicked", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      fireEvent.click(previousButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it("has screen reader text", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      const srText = previousButton.querySelector(".sr-only");
      expect(srText).toHaveTextContent("Previous");
    });

    it("renders chevron icon", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      const icon = previousButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("next button", () => {
    it("is disabled on last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByLabelText("Go to next page");
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass("cursor-not-allowed");
      expect(nextButton).toHaveClass("opacity-50");
    });

    it("is enabled when not on last page", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByLabelText("Go to next page");
      expect(nextButton).not.toBeDisabled();
    });

    it("calls onPageChange with next page when clicked", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByLabelText("Go to next page");
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("has screen reader text", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByLabelText("Go to next page");
      const srText = nextButton.querySelector(".sr-only");
      expect(srText).toHaveTextContent("Next");
    });

    it("renders chevron icon", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByLabelText("Go to next page");
      const icon = nextButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("mobile view", () => {
    it("renders Previous button", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButtons = screen.getAllByText("Previous");
      expect(previousButtons.length).toBeGreaterThan(0);
    });

    it("renders Next button", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButtons = screen.getAllByText("Next");
      expect(nextButtons.length).toBeGreaterThan(0);
    });

    it("disables Previous button on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getAllByText("Previous")[0].closest("button");
      expect(previousButton).toBeDisabled();
    });

    it("disables Next button on last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getAllByText("Next")[0].closest("button");
      expect(nextButton).toBeDisabled();
    });

    it("calls onPageChange when mobile Previous button is clicked", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getAllByText("Previous")[0].closest("button");
      if (previousButton) {
        fireEvent.click(previousButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(2);
      }
    });

    it("calls onPageChange when mobile Next button is clicked", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getAllByText("Next")[0].closest("button");
      if (nextButton) {
        fireEvent.click(nextButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(4);
      }
    });
  });

  describe("accessibility", () => {
    it("has pagination navigation with aria-label", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nav = screen.getByLabelText("Pagination");
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe("NAV");
    });

    it("marks current page with aria-current", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByLabelText("Go to page 3");
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });

    it("does not mark non-current pages with aria-current", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const page1Button = screen.getByLabelText("Go to page 1");
      expect(page1Button).not.toHaveAttribute("aria-current");
    });

    it("has descriptive aria-labels for all buttons", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
    });

    it("hides ellipsis from screen readers", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          totalItems={100}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[1, -1, 4, 5, 6, -1, 10]}
        />
      );

      const ellipsisElements = screen.getAllByText("...");
      ellipsisElements.forEach((el) => {
        expect(el).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("hides decorative icons from screen readers", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      const previousIcon = previousButton.querySelector("svg");
      expect(previousIcon).toHaveAttribute("aria-hidden", "true");

      const nextButton = screen.getByLabelText("Go to next page");
      const nextIcon = nextButton.querySelector("svg");
      expect(nextIcon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("styling", () => {
    it("applies correct styling to container", () => {
      const { container } = render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("border-t");
      expect(mainDiv).toHaveClass("border-gray-200");
      expect(mainDiv).toHaveClass("bg-white");
    });

    it("applies active styling to current page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByLabelText("Go to page 3");
      expect(currentPageButton).toHaveClass("bg-primary-600");
      expect(currentPageButton).toHaveClass("text-white");
    });

    it("applies inactive styling to non-current pages", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const page1Button = screen.getByLabelText("Go to page 1");
      expect(page1Button).toHaveClass("text-gray-900");
      expect(page1Button).toHaveClass("hover:bg-gray-50");
    });

    it("applies disabled styling to previous button when on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByLabelText("Go to previous page");
      expect(previousButton).toHaveClass("cursor-not-allowed");
      expect(previousButton).toHaveClass("opacity-50");
    });

    it("applies disabled styling to next button when on last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByLabelText("Go to next page");
      expect(nextButton).toHaveClass("cursor-not-allowed");
      expect(nextButton).toHaveClass("opacity-50");
    });
  });

  describe("edge cases", () => {
    it("handles single item correctly", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          totalItems={11}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      // First page: 1-10
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 1 to 10 of 11 results"
          );
        })
      ).toBeInTheDocument();
    });

    it("handles large page numbers", () => {
      render(
        <Pagination
          currentPage={50}
          totalPages={100}
          totalItems={1000}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[1, -1, 49, 50, 51, -1, 100]}
        />
      );

      expect(screen.getByLabelText("Go to page 50")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 100")).toBeInTheDocument();
    });

    it("handles different page sizes correctly", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={4}
          totalItems={100}
          pageSize={25}
          onPageChange={mockOnPageChange}
        />
      );

      // Page 2 with pageSize 25: items 26-50
      expect(screen.getByText("26")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("handles pageRange with multiple ellipsis", () => {
      render(
        <Pagination
          currentPage={50}
          totalPages={100}
          totalItems={1000}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[1, -1, 49, 50, 51, -1, 100]}
        />
      );

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis).toHaveLength(2);
    });

    it("handles empty pageRange array", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
          pageRange={[]}
        />
      );

      // Should not render any page buttons, only prev/next
      const pageButtons = screen.queryAllByLabelText(/Go to page \d+/);
      expect(pageButtons).toHaveLength(0);
    });

    it("does not call onPageChange when clicking current page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByLabelText("Go to page 3");
      fireEvent.click(currentPageButton);

      // Should still call it, but with the same page
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe("integration", () => {
    it("navigates through pages sequentially", () => {
      const { rerender } = render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      // Click next
      const nextButton = screen.getByLabelText("Go to next page");
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);

      // Update to page 2
      rerender(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      // Verify page 2 is current
      const page2Button = screen.getByLabelText("Go to page 2");
      expect(page2Button).toHaveAttribute("aria-current", "page");
    });

    it("jumps to specific page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      const page4Button = screen.getByLabelText("Go to page 4");
      fireEvent.click(page4Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("displays correct information for all pages", () => {
      const { rerender } = render(
        <Pagination
          currentPage={1}
          totalPages={3}
          totalItems={25}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );

      // Page 1
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 1 to 10 of 25 results"
          );
        })
      ).toBeInTheDocument();

      // Move to page 2
      rerender(
        <Pagination
          currentPage={2}
          totalPages={3}
          totalItems={25}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 11 to 20 of 25 results"
          );
        })
      ).toBeInTheDocument();

      // Move to page 3 (partial page)
      rerender(
        <Pagination
          currentPage={3}
          totalPages={3}
          totalItems={25}
          pageSize={10}
          onPageChange={mockOnPageChange}
        />
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "P" &&
            element?.textContent === "Showing 21 to 25 of 25 results"
          );
        })
      ).toBeInTheDocument();
    });
  });
});
