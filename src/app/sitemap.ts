import type { MetadataRoute } from "next";
import { getAllSkills, getAllWorkflows, getAllIndustries } from "@/lib/data-service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiskillhub.info";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/skills`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/workflows`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/industries`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const skillPages: MetadataRoute.Sitemap = getAllSkills().map((skill) => ({
    url: `${SITE_URL}/skill/${skill.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const workflowPages: MetadataRoute.Sitemap = getAllWorkflows().map((wf) => ({
    url: `${SITE_URL}/workflow/${wf.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const industryPages: MetadataRoute.Sitemap = getAllIndustries().map((ind) => ({
    url: `${SITE_URL}/industry/${ind.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...skillPages, ...workflowPages, ...industryPages];
}
