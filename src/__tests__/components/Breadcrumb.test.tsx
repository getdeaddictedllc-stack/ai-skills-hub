import React from "react";
import { render, screen } from "../test-utils";
import Breadcrumb from "@/components/Breadcrumb";

describe("Breadcrumb", () => {
  it("renders home icon link", () => {
    render(<Breadcrumb items={[{ label: "Page" }]} />);
    const homeLink = screen.getByLabelText("Home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders home icon svg", () => {
    render(<Breadcrumb items={[{ label: "Page" }]} />);
    expect(screen.getByTestId("icon-Home")).toBeInTheDocument();
  });

  it("renders items with links when href is provided", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Industries", href: "/industries" },
          { label: "Healthcare" },
        ]}
      />
    );
    const link = screen.getByText("Industries");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/industries");
  });

  it("renders last item without a link", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Industries", href: "/industries" },
          { label: "Healthcare" },
        ]}
      />
    );
    const lastItem = screen.getByText("Healthcare");
    expect(lastItem.tagName).toBe("SPAN");
  });

  it("renders last item with font-semibold class", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Industries", href: "/industries" },
          { label: "Healthcare" },
        ]}
      />
    );
    const lastItem = screen.getByText("Healthcare");
    expect(lastItem.className).toContain("font-semibold");
  });

  it("renders chevron separators between items", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Industries", href: "/industries" },
          { label: "Healthcare" },
        ]}
      />
    );
    const chevrons = screen.getAllByTestId("icon-ChevronRight");
    expect(chevrons.length).toBe(2); // one for each item
  });

  it("has Breadcrumb aria-label on nav element", () => {
    render(<Breadcrumb items={[{ label: "Page" }]} />);
    const nav = screen.getByLabelText("Breadcrumb");
    expect(nav.tagName).toBe("NAV");
  });

  it("renders item as span when no href and not last", () => {
    render(
      <Breadcrumb
        items={[
          { label: "No Link" },
          { label: "Last" },
        ]}
      />
    );
    // "No Link" is not last but has no href, so should be a span
    // Actually looking at the code: isLast || !item.href => span
    // "No Link" at index 0 is not last but has no href => span
    const noLinkItem = screen.getByText("No Link");
    expect(noLinkItem.tagName).toBe("SPAN");
  });
});
