import React from "react";
import { render, screen, fireEvent } from "../test-utils";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("returns null when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when totalPages is 0", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page number buttons", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders all pages when totalPages <= 7", () => {
    render(
      <Pagination currentPage={3} totalPages={7} onPageChange={mockOnPageChange} />
    );
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("renders previous and next buttons", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const prevBtn = screen.getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const nextBtn = screen.getByLabelText("Next page");
    expect(nextBtn).toBeDisabled();
  });

  it("enables both buttons on middle page", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("calls onPageChange with previous page when prev is clicked", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with next page when next is clicked", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with page number when a page button is clicked", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    fireEvent.click(screen.getByText("3"));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("renders ellipsis for large page ranges", () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it("marks current page with aria-current", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const currentBtn = screen.getByText("3");
    expect(currentBtn).toHaveAttribute("aria-current", "page");
  });

  it("other pages do not have aria-current", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const otherBtn = screen.getByText("2");
    expect(otherBtn).not.toHaveAttribute("aria-current");
  });
});
