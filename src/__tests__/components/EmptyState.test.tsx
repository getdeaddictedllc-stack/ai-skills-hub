import React from "react";
import { render, screen, fireEvent } from "../test-utils";
import EmptyState from "@/components/EmptyState";

describe("EmptyState", () => {
  it("renders default title", () => {
    render(<EmptyState />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders default description", () => {
    render(<EmptyState />);
    expect(
      screen.getByText(
        "Try adjusting your search or filters to find what you're looking for."
      )
    ).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders custom description", () => {
    render(<EmptyState description="Try a different search." />);
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
  });

  it("renders default SearchX icon when no custom icon", () => {
    render(<EmptyState />);
    expect(screen.getByTestId("icon-SearchX")).toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    render(<EmptyState icon={<span data-testid="custom-icon">X</span>} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-SearchX")).not.toBeInTheDocument();
  });

  it("does not render action button by default", () => {
    render(<EmptyState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders action button when action is provided", () => {
    const onClick = jest.fn();
    render(<EmptyState action={{ label: "Reset filters", onClick }} />);
    const button = screen.getByRole("button", { name: "Reset filters" });
    expect(button).toBeInTheDocument();
  });

  it("calls action onClick when button is clicked", () => {
    const onClick = jest.fn();
    render(<EmptyState action={{ label: "Reset", onClick }} />);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyState className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
