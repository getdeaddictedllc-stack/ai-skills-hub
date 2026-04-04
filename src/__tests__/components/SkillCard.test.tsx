import React from "react";
import { render, screen } from "../test-utils";
import SkillCard from "@/components/SkillCard";
import { createMockSkill } from "../test-utils";

describe("SkillCard", () => {
  it("renders skill name", () => {
    const skill = createMockSkill({ name: "My Awesome Skill" });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("My Awesome Skill")).toBeInTheDocument();
  });

  it("renders skill description", () => {
    const skill = createMockSkill({ description: "Detailed description here" });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("Detailed description here")).toBeInTheDocument();
  });

  it("renders difficulty badge", () => {
    const skill = createMockSkill({ difficulty: "advanced" });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("advanced")).toBeInTheDocument();
  });

  it("renders AI model badges (max 3)", () => {
    const skill = createMockSkill({
      aiModels: ["claude", "gpt-4", "gemini", "llama"],
    });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("claude")).toBeInTheDocument();
    expect(screen.getByText("gpt-4")).toBeInTheDocument();
    expect(screen.getByText("gemini")).toBeInTheDocument();
    expect(screen.queryByText("llama")).not.toBeInTheDocument();
  });

  it("renders all models when 3 or fewer", () => {
    const skill = createMockSkill({ aiModels: ["claude", "gpt-4"] });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("claude")).toBeInTheDocument();
    expect(screen.getByText("gpt-4")).toBeInTheDocument();
  });

  it("renders estimated time", () => {
    const skill = createMockSkill({ estimatedTime: "10 min" });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("10 min")).toBeInTheDocument();
  });

  it("renders industry tag", () => {
    const skill = createMockSkill({ industry: "healthcare" });
    render(<SkillCard skill={skill} />);
    expect(screen.getByText("healthcare")).toBeInTheDocument();
  });

  it("links to correct skill detail page", () => {
    const skill = createMockSkill({ id: "my-skill-123" });
    render(<SkillCard skill={skill} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/skill/my-skill-123");
  });

  it("applies custom className", () => {
    const skill = createMockSkill();
    const { container } = render(
      <SkillCard skill={skill} className="extra-class" />
    );
    const link = container.querySelector("a");
    expect(link?.className).toContain("extra-class");
  });
});
