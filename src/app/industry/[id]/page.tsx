import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllIndustries,
  getIndustryById,
  getIndustryStats,
  getSkillsByIndustry,
  getWorkflowsByIndustry,
} from "@/lib/data-service";
import { IndustryDetailClient } from "./IndustryDetailClient";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllIndustries().map((ind) => ({ id: ind.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const industry = getIndustryById(id);
  if (!industry) {
    return { title: "Industry Not Found | AI Skills Hub" };
  }
  return {
    title: `${industry.name} AI Skills & Workflows | AI Skills Hub`,
    description: industry.description,
    keywords: [
      industry.name,
      "AI skills",
      "AI workflows",
      ...industry.categories,
    ],
  };
}

// ---------------------------------------------------------------------------
// Server component
// ---------------------------------------------------------------------------

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const industry = getIndustryById(id);
  if (!industry) notFound();

  const stats = getIndustryStats(id);
  const skills = getSkillsByIndustry(id);
  const workflows = getWorkflowsByIndustry(id);

  return (
    <IndustryDetailClient
      industry={industry}
      stats={stats}
      skills={skills}
      workflows={workflows}
    />
  );
}
