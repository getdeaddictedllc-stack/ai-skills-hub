import { getSkillById, getWorkflowById, getSkillsByIndustry, getWorkflowsByIndustry, getAllIndustries } from "@/lib/data-service";
import { getSkillPrice, getWorkflowPrice, BUNDLE_DISCOUNT } from "@/lib/pricing";

export interface PricedItem {
  id: string;
  type: "skill" | "workflow" | "bundle";
  name: string;
  description: string;
  /** Amount in US cents, always computed on the server from the catalog. */
  unitAmount: number;
}

const toCents = (usd: number) => Math.round(usd * 100);

export function bundlePriceUsd(industryId: string): number {
  const skills = getSkillsByIndustry(industryId);
  const workflows = getWorkflowsByIndustry(industryId);
  const original =
    Math.round((skills.reduce((s, k) => s + getSkillPrice(k), 0) + workflows.reduce((s, w) => s + getWorkflowPrice(w), 0)) * 100) / 100;
  return Math.round(original * (1 - BUNDLE_DISCOUNT) * 100) / 100;
}

/**
 * Look up the real price of a cart item. The browser only tells us *what* it wants to buy;
 * the price, name and description always come from the catalog, never from the request.
 * Returns null for anything that isn't a sellable catalog item.
 */
export function priceCatalogItem(item: { id?: unknown; type?: unknown }): PricedItem | null {
  const id = typeof item.id === "string" ? item.id : "";
  if (item.type === "skill") {
    const s = getSkillById(id);
    return s ? { id, type: "skill", name: s.name, description: `Skill - ${s.category}`, unitAmount: toCents(getSkillPrice(s)) } : null;
  }
  if (item.type === "workflow") {
    const w = getWorkflowById(id);
    return w ? { id, type: "workflow", name: w.name, description: "Workflow", unitAmount: toCents(getWorkflowPrice(w)) } : null;
  }
  if (item.type === "bundle" && id.startsWith("bundle-")) {
    const industry = getAllIndustries().find((i) => i.id === id.slice("bundle-".length));
    return industry
      ? { id, type: "bundle", name: `${industry.name} Bundle`, description: "Industry bundle: every skill and workflow", unitAmount: toCents(bundlePriceUsd(industry.id)) }
      : null;
  }
  return null;
}
