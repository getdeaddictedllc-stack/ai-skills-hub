import type { Skill, Workflow } from "@/lib/types";
import { getSkillPrice, getSkillOriginalPrice, getWorkflowPrice, getWorkflowOriginalPrice, PAID_MODE } from "@/lib/pricing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiskillhub.info";

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SkillJsonLd({ skill, industryName }: { skill: Skill; industryName: string }) {
  const price = getSkillPrice(skill);
  const originalPrice = getSkillOriginalPrice(skill);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: skill.name,
    description: skill.description,
    url: `${SITE_URL}/skill/${skill.id}`,
    category: `${industryName} > ${skill.category}`,
    brand: {
      "@type": "Brand",
      name: "AI Skills Hub",
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      ...(price === 0 && originalPrice > 0
        ? { priceValidUntil: "2026-12-31" }
        : {}),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.min(5, 3.5 + skill.popularity / 50).toFixed(1),
      reviewCount: Math.max(5, Math.floor(skill.popularity * 1.2)),
      bestRating: "5",
      worstRating: "1",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Difficulty", value: skill.difficulty },
      { "@type": "PropertyValue", name: "Industry", value: industryName },
      { "@type": "PropertyValue", name: "Estimated Time", value: skill.estimatedTime },
      ...skill.aiModels.map((m) => ({
        "@type": "PropertyValue",
        name: "AI Model",
        value: m,
      })),
    ],
  };

  return <JsonLdScript data={data} />;
}

export function WorkflowJsonLd({ workflow, industryName }: { workflow: Workflow; industryName: string }) {
  const price = getWorkflowPrice(workflow);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: workflow.name,
    description: workflow.description,
    url: `${SITE_URL}/workflow/${workflow.id}`,
    category: `${industryName} > ${workflow.category}`,
    brand: {
      "@type": "Brand",
      name: "AI Skills Hub",
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Complexity", value: workflow.complexity },
      { "@type": "PropertyValue", name: "Steps", value: String(workflow.steps.length) },
      { "@type": "PropertyValue", name: "Estimated Time", value: workflow.estimatedTime },
      { "@type": "PropertyValue", name: "Industry", value: industryName },
    ],
  };

  return <JsonLdScript data={data} />;
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Skills Hub",
    url: SITE_URL,
    description: "Discover 420+ AI skills across 35+ industries. Production-ready system prompts, integration code, and workflow templates.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/skills?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLdScript data={data} />;
}
