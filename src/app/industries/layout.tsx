import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse AI Skills by Industry - 35+ Industries Covered",
  description:
    "Explore AI skills and workflows organized by industry. Healthcare, Finance, Legal, Marketing, and 30+ more industries with tailored AI capabilities.",
  openGraph: {
    title: "Explore Industries | AI Skills Hub",
    description:
      "AI skills and workflows tailored to 35+ industries. Find the right AI capabilities for your sector.",
  },
};

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
