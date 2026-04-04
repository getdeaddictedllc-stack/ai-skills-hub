import React from "react";
import { render, screen } from "../test-utils";
import IndustryCard from "@/components/IndustryCard";
import { createMockIndustry } from "../test-utils";

describe("IndustryCard", () => {
  it("renders industry name", () => {
    const industry = createMockIndustry({ name: "Healthcare & Medical" });
    render(<IndustryCard industry={industry} />);
    expect(screen.getByText("Healthcare & Medical")).toBeInTheDocument();
  });

  it("renders industry description", () => {
    const industry = createMockIndustry({
      description: "AI skills for diagnostics and patient care",
    });
    render(<IndustryCard industry={industry} />);
    expect(
      screen.getByText("AI skills for diagnostics and patient care")
    ).toBeInTheDocument();
  });

  it("renders skill count stat", () => {
    const industry = createMockIndustry({ skillCount: 12 });
    render(<IndustryCard industry={industry} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("skills")).toBeInTheDocument();
  });

  it("renders workflow count stat", () => {
    const industry = createMockIndustry({ workflowCount: 4 });
    render(<IndustryCard industry={industry} />);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("workflows")).toBeInTheDocument();
  });

  it("renders categories count stat", () => {
    const industry = createMockIndustry({
      categories: ["automation", "development", "analytics"],
    });
    render(<IndustryCard industry={industry} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("categories")).toBeInTheDocument();
  });

  it("links to correct industry detail page", () => {
    const industry = createMockIndustry({ id: "healthcare" });
    render(<IndustryCard industry={industry} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/industry/healthcare");
  });

  it("renders color accent bar with industry color", () => {
    const industry = createMockIndustry({ color: "#ef4444" });
    const { container } = render(<IndustryCard industry={industry} />);
    const colorBar = container.querySelector(".h-1\\.5");
    expect(colorBar).toHaveStyle({ backgroundColor: "#ef4444" });
  });
});
