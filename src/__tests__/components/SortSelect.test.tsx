import React from "react";
import { render, screen, fireEvent } from "../test-utils";
import SortSelect from "@/components/SortSelect";

const mockOptions = [
  { value: "popularity", label: "Most Popular" },
  { value: "name", label: "Name (A-Z)" },
  { value: "difficulty", label: "Difficulty" },
];

describe("SortSelect", () => {
  it("renders all options", () => {
    render(
      <SortSelect value="popularity" onChange={jest.fn()} options={mockOptions} />
    );
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
    expect(screen.getByText("Name (A-Z)")).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
  });

  it("has the correct value selected", () => {
    render(
      <SortSelect value="name" onChange={jest.fn()} options={mockOptions} />
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("name");
  });

  it("calls onChange with new value when selection changes", () => {
    const onChange = jest.fn();
    render(
      <SortSelect value="popularity" onChange={onChange} options={mockOptions} />
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "difficulty" } });
    expect(onChange).toHaveBeenCalledWith("difficulty");
  });

  it("renders sort icon", () => {
    render(
      <SortSelect value="popularity" onChange={jest.fn()} options={mockOptions} />
    );
    expect(screen.getByTestId("icon-ArrowUpDown")).toBeInTheDocument();
  });

  it("renders correct number of option elements", () => {
    render(
      <SortSelect value="popularity" onChange={jest.fn()} options={mockOptions} />
    );
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(3);
  });

  it("each option has the correct value attribute", () => {
    render(
      <SortSelect value="popularity" onChange={jest.fn()} options={mockOptions} />
    );
    const options = screen.getAllByRole("option") as HTMLOptionElement[];
    expect(options[0].value).toBe("popularity");
    expect(options[1].value).toBe("name");
    expect(options[2].value).toBe("difficulty");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SortSelect
        value="popularity"
        onChange={jest.fn()}
        options={mockOptions}
        className="custom-sort"
      />
    );
    expect(container.firstChild).toHaveClass("custom-sort");
  });
});
