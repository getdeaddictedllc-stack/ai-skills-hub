import type { Skill, Workflow } from "@/lib/types";

// ---------------------------------------------------------------------------
// Feature flag: set to true to enable real pricing, false for 100% free
// ---------------------------------------------------------------------------
export const PAID_MODE = process.env.NEXT_PUBLIC_PAID_MODE === "true";

// ---------------------------------------------------------------------------
// Pricing tiers (used when PAID_MODE = true)
// ---------------------------------------------------------------------------

const SKILL_PRICES: Record<Skill["difficulty"], number> = {
  beginner: 4.99,
  intermediate: 9.99,
  advanced: 14.99,
  expert: 19.99,
};

const WORKFLOW_PRICES: Record<Workflow["complexity"], number> = {
  simple: 9.99,
  moderate: 19.99,
  complex: 29.99,
  enterprise: 49.99,
};

// ---------------------------------------------------------------------------
// Price getters (safe for client-side use — no data imports)
// ---------------------------------------------------------------------------

export function getSkillPrice(skill: Skill): number {
  if (!PAID_MODE) return 0;
  return SKILL_PRICES[skill.difficulty] ?? 9.99;
}

export function getSkillOriginalPrice(skill: Skill): number {
  return SKILL_PRICES[skill.difficulty] ?? 9.99;
}

export function getWorkflowPrice(workflow: Workflow): number {
  if (!PAID_MODE) return 0;
  return WORKFLOW_PRICES[workflow.complexity] ?? 19.99;
}

export function getWorkflowOriginalPrice(workflow: Workflow): number {
  return WORKFLOW_PRICES[workflow.complexity] ?? 19.99;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getPriceTier(difficulty: Skill["difficulty"]): string {
  if (!PAID_MODE) return "Free";
  return formatPrice(SKILL_PRICES[difficulty]);
}

export function getWorkflowPriceTier(complexity: Workflow["complexity"]): string {
  if (!PAID_MODE) return "Free";
  return formatPrice(WORKFLOW_PRICES[complexity]);
}

export const BUNDLE_DISCOUNT = PAID_MODE ? 0.4 : 1.0; // 40% off in paid mode, 100% off in free mode
