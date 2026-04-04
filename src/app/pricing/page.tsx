import type { Metadata } from "next";
import { getAllIndustries, getSkillsByIndustry, getWorkflowsByIndustry } from "@/lib/data-service";
import { getSkillPrice, getWorkflowPrice, BUNDLE_DISCOUNT } from "@/lib/pricing";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing | AI Skills Hub",
  description: "Simple, transparent pricing for AI skills and workflows. Purchase individually or save 40% with industry bundles.",
};

export interface IndustryBundle {
  id: string;
  name: string;
  originalPrice: number;
  bundlePrice: number;
  skillCount: number;
  workflowCount: number;
}

export default function PricingPage() {
  const industries = getAllIndustries();

  const bundles: IndustryBundle[] = industries
    .map((ind) => {
      const skills = getSkillsByIndustry(ind.id);
      const workflows = getWorkflowsByIndustry(ind.id);
      const skillsTotal = skills.reduce((sum, s) => sum + getSkillPrice(s), 0);
      const workflowsTotal = workflows.reduce((sum, w) => sum + getWorkflowPrice(w), 0);
      const originalPrice = Math.round((skillsTotal + workflowsTotal) * 100) / 100;
      const bundlePrice = Math.round(originalPrice * (1 - BUNDLE_DISCOUNT) * 100) / 100;

      return {
        id: ind.id,
        name: ind.name,
        originalPrice,
        bundlePrice,
        skillCount: skills.length,
        workflowCount: workflows.length,
      };
    })
    .filter((b) => b.skillCount > 0)
    .sort((a, b) => b.skillCount - a.skillCount);

  return <PricingClient bundles={bundles} />;
}
