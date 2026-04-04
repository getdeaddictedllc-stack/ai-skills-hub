import React from "react";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import SearchInput from "@/components/SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders with default placeholder", () => {
    render(<SearchInput value="" onChange={jest.fn()} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <SearchInput value="" onChange={jest.fn()} placeholder="Find skills..." />
    );
    expect(screen.getByPlaceholderText("Find skills...")).toBeInTheDocument();
  });

  it("displays the value in the input", () => {
    render(<SearchInput value="hello" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    expect(input.value).toBe("hello");
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchInput value="" onChange={jest.fn()} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("shows clear button when value is non-empty", () => {
    render(<SearchInput value="test" onChange={jest.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("calls onChange with empty string when clear is clicked", () => {
    const onChange = jest.fn();
    render(<SearchInput value="test" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("calls onChange after debounce when typing", () => {
    const onChange = jest.fn();
    render(<SearchInput value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "new value" } });

    // Should not be called immediately
    expect(onChange).not.toHaveBeenCalled();

    // Advance timers past the debounce (300ms)
    jest.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledWith("new value");
  });

  it("updates local value immediately on input change", () => {
    render(<SearchInput value="" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "typed" } });
    expect(input.value).toBe("typed");
  });

  it("renders search icon", () => {
    render(<SearchInput value="" onChange={jest.fn()} />);
    expect(screen.getByTestId("icon-Search")).toBeInTheDocument();
  });
});
