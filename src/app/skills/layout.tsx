import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Skills Marketplace - Browse 420+ Production-Ready AI Skills",
  description:
    "Search and download production-ready AI skill files with system prompts, model configs, and integration code. 420+ skills across 35 industries.",
  openGraph: {
    title: "AI Skills Marketplace | AI Skills Hub",
    description:
      "Browse 420+ production-ready AI skills with system prompts, model configurations, and integration code examples.",
  },
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
