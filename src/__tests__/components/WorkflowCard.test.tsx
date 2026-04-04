import React from "react";
import { render, screen } from "../test-utils";
import WorkflowCard from "@/components/WorkflowCard";
import { createMockWorkflow } from "../test-utils";

describe("WorkflowCard", () => {
  it("renders workflow name", () => {
    const workflow = createMockWorkflow({ name: "My Workflow" });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("My Workflow")).toBeInTheDocument();
  });

  it("renders workflow description", () => {
    const workflow = createMockWorkflow({ description: "A great workflow" });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("A great workflow")).toBeInTheDocument();
  });

  it("renders complexity badge", () => {
    const workflow = createMockWorkflow({ complexity: "complex" });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("complex")).toBeInTheDocument();
  });

  it("renders step preview (max 3 steps)", () => {
    const workflow = createMockWorkflow({
      steps: [
        { skillId: "s1", skillName: "Step A", order: 1, description: "first" },
        { skillId: "s2", skillName: "Step B", order: 2, description: "second" },
        { skillId: "s3", skillName: "Step C", order: 3, description: "third" },
        { skillId: "s4", skillName: "Step D", order: 4, description: "fourth" },
        { skillId: "s5", skillName: "Step E", order: 5, description: "fifth" },
      ],
    });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("Step A")).toBeInTheDocument();
    expect(screen.getByText("Step B")).toBeInTheDocument();
    expect(screen.getByText("Step C")).toBeInTheDocument();
    expect(screen.queryByText("Step D")).not.toBeInTheDocument();
    expect(screen.queryByText("Step E")).not.toBeInTheDocument();
  });

  it("shows remaining step count when more than 3 steps", () => {
    const workflow = createMockWorkflow({
      steps: [
        { skillId: "s1", skillName: "Step A", order: 1, description: "first" },
        { skillId: "s2", skillName: "Step B", order: 2, description: "second" },
        { skillId: "s3", skillName: "Step C", order: 3, description: "third" },
        { skillId: "s4", skillName: "Step D", order: 4, description: "fourth" },
        { skillId: "s5", skillName: "Step E", order: 5, description: "fifth" },
      ],
    });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("does not show remaining count when 3 or fewer steps", () => {
    const workflow = createMockWorkflow({
      steps: [
        { skillId: "s1", skillName: "Step A", order: 1, description: "first" },
        { skillId: "s2", skillName: "Step B", order: 2, description: "second" },
      ],
    });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("renders step count in footer", () => {
    const workflow = createMockWorkflow({
      steps: [
        { skillId: "s1", skillName: "Step A", order: 1, description: "first" },
        { skillId: "s2", skillName: "Step B", order: 2, description: "second" },
        { skillId: "s3", skillName: "Step C", order: 3, description: "third" },
      ],
    });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("3 steps")).toBeInTheDocument();
  });

  it("renders estimated time", () => {
    const workflow = createMockWorkflow({ estimatedTime: "30 min" });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("30 min")).toBeInTheDocument();
  });

  it("renders industry tag", () => {
    const workflow = createMockWorkflow({ industry: "finance" });
    render(<WorkflowCard workflow={workflow} />);
    expect(screen.getByText("finance")).toBeInTheDocument();
  });

  it("links to correct workflow detail page", () => {
    const workflow = createMockWorkflow({ id: "wf-abc" });
    render(<WorkflowCard workflow={workflow} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/workflow/wf-abc");
  });
});
