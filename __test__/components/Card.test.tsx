/**
 * Card Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";

import Card, { CardBody, CardFooter, CardHeader } from "@/components/Card";

describe("Card", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies hoverable styles when hoverable is true", () => {
    const { container } = render(
      <Card hoverable>
        <div>Content</div>
      </Card>
    );
    expect(container.firstChild).toHaveClass(
      "hover:shadow-md",
      "transition-shadow",
      "cursor-pointer"
    );
  });

  it("calls onClick when clicked and hoverable", () => {
    const handleClick = jest.fn();
    const { container } = render(
      <Card hoverable onClick={handleClick}>
        <div>Content</div>
      </Card>
    );

    fireEvent.click(container.firstChild as Element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("CardHeader", () => {
  it("renders children correctly", () => {
    render(
      <CardHeader>
        <h2>Header</h2>
      </CardHeader>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardHeader className="custom-header">
        <h2>Header</h2>
      </CardHeader>
    );
    expect(container.firstChild).toHaveClass("custom-header");
  });
});

describe("CardBody", () => {
  it("renders children correctly", () => {
    render(
      <CardBody>
        <p>Body content</p>
      </CardBody>
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardBody className="custom-body">
        <p>Body content</p>
      </CardBody>
    );
    expect(container.firstChild).toHaveClass("custom-body");
  });
});

describe("CardFooter", () => {
  it("renders children correctly", () => {
    render(
      <CardFooter>
        <button>Footer button</button>
      </CardFooter>
    );
    expect(screen.getByText("Footer button")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardFooter className="custom-footer">
        <button>Footer button</button>
      </CardFooter>
    );
    expect(container.firstChild).toHaveClass("custom-footer");
  });
});
