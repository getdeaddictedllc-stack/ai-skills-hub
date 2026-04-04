import Fuse, { type IFuseOptions } from "fuse.js";
import { skills } from "@/data/skills";
import { workflows } from "@/data/workflows";
import { industries } from "@/lib/industries";
import type {
  Skill,
  Workflow,
  Industry,
  AIModel,
  IntegrationType,
  IOType,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Filter, sort & pagination types
// ---------------------------------------------------------------------------

export interface SkillFilters {
  industry?: string;
  category?: string;
  difficulty?: Skill["difficulty"][];
  models?: AIModel[];
  integrationTypes?: IntegrationType[];
  inputTypes?: IOType[];
  outputTypes?: IOType[];
  search?: string;
}

export interface WorkflowFilters {
  industry?: string;
  category?: string;
  complexity?: Workflow["complexity"][];
  search?: string;
}

export type SkillSortOption = "popularity" | "name" | "difficulty" | "newest";
export type WorkflowSortOption = "name" | "complexity" | "steps" | "time";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ---------------------------------------------------------------------------
// Fuse.js instances (lazy-initialised singletons)
// ---------------------------------------------------------------------------

const FUSE_DEFAULTS: IFuseOptions<unknown> = {
  threshold: 0.35,
  distance: 200,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

let _skillFuse: Fuse<Skill> | null = null;
let _workflowFuse: Fuse<Workflow> | null = null;
let _industryFuse: Fuse<Industry> | null = null;

function getSkillFuse(): Fuse<Skill> {
  if (!_skillFuse) {
    _skillFuse = new Fuse(skills, {
      ...FUSE_DEFAULTS,
      keys: [
        { name: "name", weight: 0.35 },
        { name: "description", weight: 0.2 },
        { name: "tags", weight: 0.15 },
        { name: "category", weight: 0.1 },
        { name: "industry", weight: 0.08 },
        { name: "useCases", weight: 0.07 },
        { name: "aiModels", weight: 0.05 },
      ],
    });
  }
  return _skillFuse;
}

function getWorkflowFuse(): Fuse<Workflow> {
  if (!_workflowFuse) {
    _workflowFuse = new Fuse(workflows, {
      ...FUSE_DEFAULTS,
      keys: [
        { name: "name", weight: 0.35 },
        { name: "description", weight: 0.25 },
        { name: "tags", weight: 0.15 },
        { name: "category", weight: 0.1 },
        { name: "industry", weight: 0.08 },
        { name: "steps.skillName", weight: 0.04 },
        { name: "steps.description", weight: 0.03 },
      ],
    });
  }
  return _workflowFuse;
}

function getIndustryFuse(): Fuse<Industry> {
  if (!_industryFuse) {
    _industryFuse = new Fuse(industries, {
      ...FUSE_DEFAULTS,
      keys: [
        { name: "name", weight: 0.4 },
        { name: "description", weight: 0.3 },
        { name: "categories", weight: 0.3 },
      ],
    });
  }
  return _industryFuse;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const DIFFICULTY_ORDER: Record<Skill["difficulty"], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

const COMPLEXITY_ORDER: Record<Workflow["complexity"], number> = {
  simple: 0,
  moderate: 1,
  complex: 2,
  enterprise: 3,
};

/** Parse an estimatedTime string like "15 minutes", "2 hours" into minutes. */
function parseTimeToMinutes(time: string): number {
  const lower = time.toLowerCase();
  const num = parseFloat(lower) || 0;
  if (lower.includes("hour")) return num * 60;
  if (lower.includes("day")) return num * 1440;
  if (lower.includes("week")) return num * 10080;
  return num; // assume minutes
}

function arraysOverlap<T>(a: T[], b: T[]): boolean {
  return a.some((item) => b.includes(item));
}

function computeIndustryCounts(industry: Industry): Industry {
  const skillCount = skills.filter((s) => s.industry === industry.id).length;
  const workflowCount = workflows.filter(
    (w) => w.industry === industry.id
  ).length;
  return { ...industry, skillCount, workflowCount };
}

// ---------------------------------------------------------------------------
// SEARCH
// ---------------------------------------------------------------------------

export function searchAll(query: string): {
  skills: Skill[];
  workflows: Workflow[];
  industries: Industry[];
} {
  if (!query.trim()) {
    return { skills: [], workflows: [], industries: [] };
  }
  return {
    skills: getSkillFuse()
      .search(query)
      .map((r) => r.item),
    workflows: getWorkflowFuse()
      .search(query)
      .map((r) => r.item),
    industries: getIndustryFuse()
      .search(query)
      .map((r) => r.item)
      .map(computeIndustryCounts),
  };
}

export function searchSkills(
  query: string,
  filters?: SkillFilters
): Skill[] {
  let results: Skill[];

  if (query.trim()) {
    results = getSkillFuse()
      .search(query)
      .map((r) => r.item);
  } else {
    results = [...skills];
  }

  if (filters) {
    results = applySkillFilters(results, filters);
  }

  return results;
}

export function searchWorkflows(
  query: string,
  filters?: WorkflowFilters
): Workflow[] {
  let results: Workflow[];

  if (query.trim()) {
    results = getWorkflowFuse()
      .search(query)
      .map((r) => r.item);
  } else {
    results = [...workflows];
  }

  if (filters) {
    results = applyWorkflowFilters(results, filters);
  }

  return results;
}

// ---------------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------------

export function getAllSkills(): Skill[] {
  return [...skills];
}

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

export function getSkillsByIndustry(industryId: string): Skill[] {
  return skills.filter((s) => s.industry === industryId);
}

export function getSkillsByCategory(
  industryId: string,
  category: string
): Skill[] {
  return skills.filter(
    (s) => s.industry === industryId && s.category === category
  );
}

export function getSkillsByDifficulty(
  difficulty: Skill["difficulty"]
): Skill[] {
  return skills.filter((s) => s.difficulty === difficulty);
}

export function getSkillsByModel(model: AIModel): Skill[] {
  return skills.filter((s) => s.aiModels.includes(model));
}

export function getPopularSkills(limit: number = 10): Skill[] {
  return [...skills].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getRelatedSkills(
  skillId: string,
  limit: number = 5
): Skill[] {
  const skill = getSkillById(skillId);
  if (!skill) return [];

  return skills
    .filter((s) => s.id !== skillId)
    .map((s) => {
      let score = 0;
      // Same industry is a strong signal
      if (s.industry === skill.industry) score += 3;
      // Same category is even stronger
      if (s.category === skill.category) score += 4;
      // Shared tags
      score += s.tags.filter((t) => skill.tags.includes(t)).length * 2;
      // Shared AI models
      score += s.aiModels.filter((m) => skill.aiModels.includes(m)).length;
      // Shared integration types
      score += s.integrationTypes.filter((i) =>
        skill.integrationTypes.includes(i)
      ).length;
      // Similar difficulty (close = better)
      const diffDelta = Math.abs(
        DIFFICULTY_ORDER[s.difficulty] - DIFFICULTY_ORDER[skill.difficulty]
      );
      score += Math.max(0, 2 - diffDelta);

      return { skill: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.skill);
}

export function filterSkills(filters: SkillFilters): Skill[] {
  let results = [...skills];

  // If a search term is provided, use Fuse first to narrow + rank
  if (filters.search?.trim()) {
    results = getSkillFuse()
      .search(filters.search)
      .map((r) => r.item);
  }

  return applySkillFilters(results, filters);
}

function applySkillFilters(items: Skill[], filters: SkillFilters): Skill[] {
  let results = items;

  if (filters.industry) {
    results = results.filter((s) => s.industry === filters.industry);
  }
  if (filters.category) {
    results = results.filter((s) => s.category === filters.category);
  }
  if (filters.difficulty?.length) {
    results = results.filter((s) => filters.difficulty!.includes(s.difficulty));
  }
  if (filters.models?.length) {
    results = results.filter((s) =>
      arraysOverlap(s.aiModels, filters.models!)
    );
  }
  if (filters.integrationTypes?.length) {
    results = results.filter((s) =>
      arraysOverlap(s.integrationTypes, filters.integrationTypes!)
    );
  }
  if (filters.inputTypes?.length) {
    results = results.filter((s) =>
      arraysOverlap(s.inputType, filters.inputTypes!)
    );
  }
  if (filters.outputTypes?.length) {
    results = results.filter((s) =>
      arraysOverlap(s.outputType, filters.outputTypes!)
    );
  }

  return results;
}

// ---------------------------------------------------------------------------
// WORKFLOWS
// ---------------------------------------------------------------------------

export function getAllWorkflows(): Workflow[] {
  return [...workflows];
}

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}

export function getWorkflowsByIndustry(industryId: string): Workflow[] {
  return workflows.filter((w) => w.industry === industryId);
}

export function getWorkflowsByComplexity(
  complexity: Workflow["complexity"]
): Workflow[] {
  return workflows.filter((w) => w.complexity === complexity);
}

export function getRelatedWorkflows(
  workflowId: string,
  limit: number = 5
): Workflow[] {
  const workflow = getWorkflowById(workflowId);
  if (!workflow) return [];

  return workflows
    .filter((w) => w.id !== workflowId)
    .map((w) => {
      let score = 0;
      if (w.industry === workflow.industry) score += 3;
      if (w.category === workflow.category) score += 4;
      score += w.tags.filter((t) => workflow.tags.includes(t)).length * 2;
      // Shared skills across steps
      const wSkillIds = new Set(w.steps.map((s) => s.skillId));
      const srcSkillIds = workflow.steps.map((s) => s.skillId);
      score += srcSkillIds.filter((id) => wSkillIds.has(id)).length * 2;
      // Similar complexity
      const compDelta = Math.abs(
        COMPLEXITY_ORDER[w.complexity] -
          COMPLEXITY_ORDER[workflow.complexity]
      );
      score += Math.max(0, 2 - compDelta);

      return { workflow: w, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.workflow);
}

export function filterWorkflows(filters: WorkflowFilters): Workflow[] {
  let results = [...workflows];

  if (filters.search?.trim()) {
    results = getWorkflowFuse()
      .search(filters.search)
      .map((r) => r.item);
  }

  return applyWorkflowFilters(results, filters);
}

function applyWorkflowFilters(
  items: Workflow[],
  filters: WorkflowFilters
): Workflow[] {
  let results = items;

  if (filters.industry) {
    results = results.filter((w) => w.industry === filters.industry);
  }
  if (filters.category) {
    results = results.filter((w) => w.category === filters.category);
  }
  if (filters.complexity?.length) {
    results = results.filter((w) =>
      filters.complexity!.includes(w.complexity)
    );
  }

  return results;
}

// ---------------------------------------------------------------------------
// INDUSTRIES
// ---------------------------------------------------------------------------

export function getAllIndustries(): Industry[] {
  return industries.map(computeIndustryCounts);
}

export function getIndustryById(id: string): Industry | undefined {
  const industry = industries.find((i) => i.id === id);
  if (!industry) return undefined;
  return computeIndustryCounts(industry);
}

export function getIndustryStats(industryId: string): {
  skillCount: number;
  workflowCount: number;
  categories: string[];
  topSkills: Skill[];
} {
  const industrySkills = getSkillsByIndustry(industryId);
  const industryWorkflows = getWorkflowsByIndustry(industryId);
  const industry = industries.find((i) => i.id === industryId);

  const categories = industry?.categories ??
    Array.from(new Set(industrySkills.map((s) => s.category)));

  const topSkills = [...industrySkills]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return {
    skillCount: industrySkills.length,
    workflowCount: industryWorkflows.length,
    categories,
    topSkills,
  };
}

// ---------------------------------------------------------------------------
// PAGINATION
// ---------------------------------------------------------------------------

export function paginateResults<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const clampedPage = Math.min(safePage, totalPages);
  const start = (clampedPage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    total,
    page: clampedPage,
    pageSize: safePageSize,
    totalPages,
    hasNext: clampedPage < totalPages,
    hasPrev: clampedPage > 1,
  };
}

// ---------------------------------------------------------------------------
// SORT
// ---------------------------------------------------------------------------

export function sortSkills(
  items: Skill[],
  sortBy: SkillSortOption
): Skill[] {
  const sorted = [...items];

  switch (sortBy) {
    case "popularity":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "difficulty":
      return sorted.sort(
        (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
      );
    case "newest":
      // Without a createdAt field, reverse the original array order
      // (assumes newer items are appended to the data source)
      return sorted.reverse();
    default:
      return sorted;
  }
}

export function sortWorkflows(
  items: Workflow[],
  sortBy: WorkflowSortOption
): Workflow[] {
  const sorted = [...items];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "complexity":
      return sorted.sort(
        (a, b) =>
          COMPLEXITY_ORDER[a.complexity] - COMPLEXITY_ORDER[b.complexity]
      );
    case "steps":
      return sorted.sort((a, b) => a.steps.length - b.steps.length);
    case "time":
      return sorted.sort(
        (a, b) =>
          parseTimeToMinutes(a.estimatedTime) -
          parseTimeToMinutes(b.estimatedTime)
      );
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// STATS
// ---------------------------------------------------------------------------

export function getGlobalStats(): {
  totalSkills: number;
  totalWorkflows: number;
  totalIndustries: number;
  totalCategories: number;
} {
  const categorySet = new Set<string>();
  skills.forEach((s) => categorySet.add(s.category));
  workflows.forEach((w) => categorySet.add(w.category));

  return {
    totalSkills: skills.length,
    totalWorkflows: workflows.length,
    totalIndustries: industries.length,
    totalCategories: categorySet.size,
  };
}
