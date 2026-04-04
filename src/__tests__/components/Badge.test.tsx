import React from "react";
import { render, screen } from "../test-utils";
import Badge from "@/components/Badge";

describe("Badge", () => {
  // ---- Variants ----

  describe("difficulty variant", () => {
    it("renders beginner with green classes", () => {
      const { container } = render(
        <Badge label="beginner" variant="difficulty" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveTextContent("beginner");
      expect(badge.className).toContain("bg-green-100");
      expect(badge.className).toContain("text-green-800");
    });

    it("renders intermediate with yellow classes", () => {
      const { container } = render(
        <Badge label="intermediate" variant="difficulty" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-yellow-100");
    });

    it("renders advanced with orange classes", () => {
      const { container } = render(
        <Badge label="advanced" variant="difficulty" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-orange-100");
    });

    it("renders expert with red classes", () => {
      const { container } = render(
        <Badge label="expert" variant="difficulty" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-red-100");
    });

    it("falls back to gray for unknown difficulty", () => {
      const { container } = render(
        <Badge label="unknown" variant="difficulty" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-gray-100");
    });
  });

  describe("complexity variant", () => {
    it("renders simple with green classes", () => {
      const { container } = render(
        <Badge label="simple" variant="complexity" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-green-100");
    });

    it("renders moderate with blue classes", () => {
      const { container } = render(
        <Badge label="moderate" variant="complexity" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-blue-100");
    });

    it("renders complex with orange classes", () => {
      const { container } = render(
        <Badge label="complex" variant="complexity" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-orange-100");
    });

    it("renders enterprise with purple classes", () => {
      const { container } = render(
        <Badge label="enterprise" variant="complexity" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-purple-100");
    });
  });

  describe("model variant", () => {
    it("renders claude with amber classes", () => {
      const { container } = render(
        <Badge label="claude" variant="model" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveTextContent("claude");
      expect(badge.className).toContain("bg-amber-100");
    });

    it("renders gpt-4 with emerald classes", () => {
      const { container } = render(
        <Badge label="gpt-4" variant="model" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-emerald-100");
    });
  });

  describe("integration variant", () => {
    it("renders api with sky classes", () => {
      const { container } = render(
        <Badge label="api" variant="integration" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-sky-100");
    });

    it("renders webhook with lime classes", () => {
      const { container } = render(
        <Badge label="webhook" variant="integration" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-lime-100");
    });
  });

  describe("default variant", () => {
    it("renders with gray classes", () => {
      const { container } = render(<Badge label="anything" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-gray-100");
      expect(badge.className).toContain("text-gray-700");
    });

    it("renders with gray classes when variant is explicitly default", () => {
      const { container } = render(
        <Badge label="anything" variant="default" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("bg-gray-100");
    });
  });

  // ---- Sizes ----

  describe("sizes", () => {
    it("renders sm size by default", () => {
      const { container } = render(<Badge label="test" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("text-xs");
      expect(badge.className).toContain("px-2");
    });

    it("renders md size", () => {
      const { container } = render(<Badge label="test" size="md" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("text-sm");
      expect(badge.className).toContain("px-3");
    });
  });

  // ---- Common styles ----

  it("always has capitalize and rounded-full classes", () => {
    const { container } = render(<Badge label="test" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("capitalize");
    expect(badge.className).toContain("rounded-full");
  });

  it("displays the label text", () => {
    render(<Badge label="hello world" />);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Badge label="test" className="my-custom-class" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("my-custom-class");
  });
});
