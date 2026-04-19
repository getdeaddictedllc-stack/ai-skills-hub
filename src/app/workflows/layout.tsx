import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Workflows - Multi-Step AI Pipelines & Automation Templates",
  description:
    "Discover 177+ AI workflow templates with orchestration code, data flow diagrams, and deployment guides. End-to-end AI pipelines for every industry.",
  openGraph: {
    title: "AI Workflows | AI Skills Hub",
    description:
      "177+ multi-step AI workflow templates with Python orchestration code and deployment guides.",
  },
};

export default function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
