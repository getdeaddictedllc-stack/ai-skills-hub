import {
  searchSkills,
  searchWorkflows,
  searchAll,
  filterSkills,
  filterWorkflows,
  sortSkills,
  sortWorkflows,
  paginateResults,
  getSkillById,
  getWorkflowById,
  getIndustryById,
  getAllSkills,
  getAllWorkflows,
  getAllIndustries,
  getSkillsByIndustry,
  getSkillsByCategory,
  getSkillsByDifficulty,
  getSkillsByModel,
  getPopularSkills,
  getWorkflowsByIndustry,
  getWorkflowsByComplexity,
  getRelatedSkills,
  getRelatedWorkflows,
  getGlobalStats,
  getIndustryStats,
} from "@/lib/data-service";
import { skills } from "@/data/skills";
import { workflows } from "@/data/workflows";
import { industries } from "@/lib/industries";
import type { Skill, Workflow } from "@/lib/types";
import { createMockSkill, createMockWorkflow } from "../test-utils";

// ---------------------------------------------------------------------------
// SEARCH
// ---------------------------------------------------------------------------

describe("searchAll", () => {
  it("returns empty arrays for blank query", () => {
    const result = searchAll("");
    expect(result.skills).toEqual([]);
    expect(result.workflows).toEqual([]);
    expect(result.industries).toEqual([]);
  });

  it("returns empty arrays for whitespace-only query", () => {
    const result = searchAll("   ");
    expect(result.skills).toEqual([]);
    expect(result.workflows).toEqual([]);
    expect(result.industries).toEqual([]);
  });

  it("returns results for a valid query", () => {
    const result = searchAll("healthcare");
    expect(result.skills.length).toBeGreaterThan(0);
    expect(result.industries.length).toBeGreaterThan(0);
  });

  it("industry results have computed skillCount and workflowCount", () => {
    const result = searchAll("healthcare");
    if (result.industries.length > 0) {
      const industry = result.industries[0];
      expect(typeof industry.skillCount).toBe("number");
      expect(typeof industry.workflowCount).toBe("number");
    }
  });
});

describe("searchSkills", () => {
  it("returns all skills when query is empty", () => {
    const result = searchSkills("");
    expect(result.length).toBe(skills.length);
  });

  it("returns filtered results with a query", () => {
    const result = searchSkills("medical");
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(skills.length);
  });

  it("applies additional filters when provided", () => {
    const result = searchSkills("", { industry: "healthcare" });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s) => expect(s.industry).toBe("healthcare"));
  });

  it("applies difficulty filter", () => {
    const result = searchSkills("", { difficulty: ["beginner"] });
    result.forEach((s) => expect(s.difficulty).toBe("beginner"));
  });
});

describe("searchWorkflows", () => {
  it("returns all workflows when query is empty", () => {
    const result = searchWorkflows("");
    expect(result.length).toBe(workflows.length);
  });

  it("returns filtered results with a query", () => {
    const result = searchWorkflows("patient");
    expect(result.length).toBeGreaterThan(0);
  });

  it("applies industry filter", () => {
    const result = searchWorkflows("", { industry: "healthcare" });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((w) => expect(w.industry).toBe("healthcare"));
  });
});

// ---------------------------------------------------------------------------
// FILTER
// ---------------------------------------------------------------------------

describe("filterSkills", () => {
  it("returns all skills with no filters", () => {
    const result = filterSkills({});
    expect(result.length).toBe(skills.length);
  });

  it("filters by industry", () => {
    const result = filterSkills({ industry: "healthcare" });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s) => expect(s.industry).toBe("healthcare"));
  });

  it("filters by category", () => {
    const result = filterSkills({ industry: "healthcare", category: "Diagnostics & Imaging" });
    result.forEach((s) => {
      expect(s.industry).toBe("healthcare");
      expect(s.category).toBe("Diagnostics & Imaging");
    });
  });

  it("filters by difficulty", () => {
    const result = filterSkills({ difficulty: ["advanced", "expert"] });
    result.forEach((s) => expect(["advanced", "expert"]).toContain(s.difficulty));
  });

  it("filters by AI models", () => {
    const result = filterSkills({ models: ["claude"] });
    result.forEach((s) => expect(s.aiModels).toContain("claude"));
  });

  it("filters by integration types", () => {
    const result = filterSkills({ integrationTypes: ["api"] });
    result.forEach((s) => expect(s.integrationTypes).toContain("api"));
  });

  it("filters by input types", () => {
    const result = filterSkills({ inputTypes: ["text"] });
    result.forEach((s) => expect(s.inputType).toContain("text"));
  });

  it("filters by output types", () => {
    const result = filterSkills({ outputTypes: ["text"] });
    result.forEach((s) => expect(s.outputType).toContain("text"));
  });

  it("filters by search term", () => {
    const result = filterSkills({ search: "medical" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(skills.length);
  });

  it("combines search with other filters", () => {
    const result = filterSkills({ search: "analysis", industry: "healthcare" });
    result.forEach((s) => expect(s.industry).toBe("healthcare"));
  });
});

describe("filterWorkflows", () => {
  it("returns all workflows with no filters", () => {
    const result = filterWorkflows({});
    expect(result.length).toBe(workflows.length);
  });

  it("filters by industry", () => {
    const result = filterWorkflows({ industry: "healthcare" });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((w) => expect(w.industry).toBe("healthcare"));
  });

  it("filters by complexity", () => {
    const result = filterWorkflows({ complexity: ["complex"] });
    result.forEach((w) => expect(w.complexity).toBe("complex"));
  });

  it("filters by category", () => {
    const healthcareWorkflows = filterWorkflows({ industry: "healthcare" });
    if (healthcareWorkflows.length > 0) {
      const category = healthcareWorkflows[0].category;
      const result = filterWorkflows({ category });
      result.forEach((w) => expect(w.category).toBe(category));
    }
  });

  it("filters by search term", () => {
    const result = filterWorkflows({ search: "patient" });
    expect(result.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// SORT
// ---------------------------------------------------------------------------

describe("sortSkills", () => {
  const mockSkills: Skill[] = [
    createMockSkill({ id: "a", name: "Zebra", difficulty: "expert", popularity: 10 }),
    createMockSkill({ id: "b", name: "Apple", difficulty: "beginner", popularity: 90 }),
    createMockSkill({ id: "c", name: "Mango", difficulty: "intermediate", popularity: 50 }),
  ];

  it("sorts by popularity descending", () => {
    const sorted = sortSkills(mockSkills, "popularity");
    expect(sorted[0].name).toBe("Apple");
    expect(sorted[1].name).toBe("Mango");
    expect(sorted[2].name).toBe("Zebra");
  });

  it("sorts by name alphabetically", () => {
    const sorted = sortSkills(mockSkills, "name");
    expect(sorted[0].name).toBe("Apple");
    expect(sorted[1].name).toBe("Mango");
    expect(sorted[2].name).toBe("Zebra");
  });

  it("sorts by difficulty ascending", () => {
    const sorted = sortSkills(mockSkills, "difficulty");
    expect(sorted[0].difficulty).toBe("beginner");
    expect(sorted[1].difficulty).toBe("intermediate");
    expect(sorted[2].difficulty).toBe("expert");
  });

  it("sorts by newest (reversed order)", () => {
    const sorted = sortSkills(mockSkills, "newest");
    expect(sorted[0].name).toBe("Mango");
    expect(sorted[2].name).toBe("Zebra");
  });

  it("does not mutate the original array", () => {
    const original = [...mockSkills];
    sortSkills(mockSkills, "name");
    expect(mockSkills).toEqual(original);
  });
});

describe("sortWorkflows", () => {
  const mockWorkflows: Workflow[] = [
    createMockWorkflow({
      id: "w1",
      name: "Zebra Flow",
      complexity: "enterprise",
      estimatedTime: "2 hours",
      steps: [
        { skillId: "s1", skillName: "A", order: 1, description: "a" },
        { skillId: "s2", skillName: "B", order: 2, description: "b" },
        { skillId: "s3", skillName: "C", order: 3, description: "c" },
        { skillId: "s4", skillName: "D", order: 4, description: "d" },
      ],
    }),
    createMockWorkflow({
      id: "w2",
      name: "Apple Flow",
      complexity: "simple",
      estimatedTime: "5 minutes",
      steps: [
        { skillId: "s1", skillName: "A", order: 1, description: "a" },
      ],
    }),
    createMockWorkflow({
      id: "w3",
      name: "Mango Flow",
      complexity: "moderate",
      estimatedTime: "30 minutes",
      steps: [
        { skillId: "s1", skillName: "A", order: 1, description: "a" },
        { skillId: "s2", skillName: "B", order: 2, description: "b" },
      ],
    }),
  ];

  it("sorts by name alphabetically", () => {
    const sorted = sortWorkflows(mockWorkflows, "name");
    expect(sorted[0].name).toBe("Apple Flow");
    expect(sorted[1].name).toBe("Mango Flow");
    expect(sorted[2].name).toBe("Zebra Flow");
  });

  it("sorts by complexity ascending", () => {
    const sorted = sortWorkflows(mockWorkflows, "complexity");
    expect(sorted[0].complexity).toBe("simple");
    expect(sorted[1].complexity).toBe("moderate");
    expect(sorted[2].complexity).toBe("enterprise");
  });

  it("sorts by steps count ascending", () => {
    const sorted = sortWorkflows(mockWorkflows, "steps");
    expect(sorted[0].steps.length).toBe(1);
    expect(sorted[1].steps.length).toBe(2);
    expect(sorted[2].steps.length).toBe(4);
  });

  it("sorts by time ascending", () => {
    const sorted = sortWorkflows(mockWorkflows, "time");
    expect(sorted[0].name).toBe("Apple Flow");
    expect(sorted[1].name).toBe("Mango Flow");
    expect(sorted[2].name).toBe("Zebra Flow");
  });

  it("does not mutate the original array", () => {
    const original = [...mockWorkflows];
    sortWorkflows(mockWorkflows, "name");
    expect(mockWorkflows).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// PAGINATION
// ---------------------------------------------------------------------------

describe("paginateResults", () => {
  it("returns correct first page", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = paginateResults(items, 1, 3);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(3);
    expect(result.totalPages).toBe(4);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  it("returns correct middle page", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = paginateResults(items, 2, 3);
    expect(result.items).toEqual([4, 5, 6]);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(true);
  });

  it("returns correct last page", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = paginateResults(items, 4, 3);
    expect(result.items).toEqual([10]);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  it("handles empty array", () => {
    const result = paginateResults([], 1, 10);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  it("handles single page", () => {
    const items = [1, 2, 3];
    const result = paginateResults(items, 1, 10);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  it("clamps page to max when out of range (too high)", () => {
    const items = [1, 2, 3];
    const result = paginateResults(items, 100, 2);
    expect(result.page).toBe(2);
    expect(result.items).toEqual([3]);
  });

  it("clamps page to 1 when negative or zero", () => {
    const items = [1, 2, 3];
    const result = paginateResults(items, 0, 2);
    expect(result.page).toBe(1);
    expect(result.items).toEqual([1, 2]);

    const result2 = paginateResults(items, -5, 2);
    expect(result2.page).toBe(1);
  });

  it("ensures pageSize is at least 1", () => {
    const items = [1, 2, 3];
    const result = paginateResults(items, 1, 0);
    expect(result.pageSize).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// GETTERS
// ---------------------------------------------------------------------------

describe("getSkillById", () => {
  it("returns a skill for a valid id", () => {
    const firstSkill = skills[0];
    const found = getSkillById(firstSkill.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(firstSkill.id);
  });

  it("returns undefined for an invalid id", () => {
    expect(getSkillById("nonexistent-skill-id")).toBeUndefined();
  });
});

describe("getWorkflowById", () => {
  it("returns a workflow for a valid id", () => {
    const firstWorkflow = workflows[0];
    const found = getWorkflowById(firstWorkflow.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(firstWorkflow.id);
  });

  it("returns undefined for an invalid id", () => {
    expect(getWorkflowById("nonexistent-workflow-id")).toBeUndefined();
  });
});

describe("getIndustryById", () => {
  it("returns an industry for a valid id", () => {
    const found = getIndustryById("healthcare");
    expect(found).toBeDefined();
    expect(found!.id).toBe("healthcare");
    expect(found!.name).toBe("Healthcare & Medical");
  });

  it("returns computed skill and workflow counts", () => {
    const found = getIndustryById("healthcare");
    expect(found).toBeDefined();
    expect(typeof found!.skillCount).toBe("number");
    expect(typeof found!.workflowCount).toBe("number");
  });

  it("returns undefined for an invalid id", () => {
    expect(getIndustryById("nonexistent-industry")).toBeUndefined();
  });
});

describe("getAllSkills", () => {
  it("returns a copy of all skills", () => {
    const all = getAllSkills();
    expect(all.length).toBe(skills.length);
    expect(all).not.toBe(skills);
  });
});

describe("getAllWorkflows", () => {
  it("returns a copy of all workflows", () => {
    const all = getAllWorkflows();
    expect(all.length).toBe(workflows.length);
    expect(all).not.toBe(workflows);
  });
});

describe("getAllIndustries", () => {
  it("returns all industries with computed counts", () => {
    const all = getAllIndustries();
    expect(all.length).toBe(industries.length);
    all.forEach((industry) => {
      expect(typeof industry.skillCount).toBe("number");
      expect(typeof industry.workflowCount).toBe("number");
    });
  });
});

describe("getSkillsByIndustry", () => {
  it("returns skills for a given industry", () => {
    const result = getSkillsByIndustry("healthcare");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s) => expect(s.industry).toBe("healthcare"));
  });

  it("returns empty array for non-existent industry", () => {
    expect(getSkillsByIndustry("fake-industry")).toEqual([]);
  });
});

describe("getSkillsByCategory", () => {
  it("returns skills matching industry and category", () => {
    const result = getSkillsByCategory("healthcare", "Diagnostics & Imaging");
    result.forEach((s) => {
      expect(s.industry).toBe("healthcare");
      expect(s.category).toBe("Diagnostics & Imaging");
    });
  });
});

describe("getSkillsByDifficulty", () => {
  it("returns skills matching difficulty", () => {
    const result = getSkillsByDifficulty("beginner");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s) => expect(s.difficulty).toBe("beginner"));
  });
});

describe("getSkillsByModel", () => {
  it("returns skills using the given model", () => {
    const result = getSkillsByModel("claude");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s) => expect(s.aiModels).toContain("claude"));
  });
});

describe("getPopularSkills", () => {
  it("returns skills sorted by popularity (default limit 10)", () => {
    const result = getPopularSkills();
    expect(result.length).toBeLessThanOrEqual(10);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].popularity).toBeGreaterThanOrEqual(result[i].popularity);
    }
  });

  it("respects custom limit", () => {
    const result = getPopularSkills(3);
    expect(result.length).toBe(3);
  });
});

describe("getWorkflowsByIndustry", () => {
  it("returns workflows for a given industry", () => {
    const result = getWorkflowsByIndustry("healthcare");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((w) => expect(w.industry).toBe("healthcare"));
  });
});

describe("getWorkflowsByComplexity", () => {
  it("returns workflows matching complexity", () => {
    const result = getWorkflowsByComplexity("complex");
    result.forEach((w) => expect(w.complexity).toBe("complex"));
  });
});

// ---------------------------------------------------------------------------
// RELATED
// ---------------------------------------------------------------------------

describe("getRelatedSkills", () => {
  it("returns related skills excluding the source skill", () => {
    const sourceId = skills[0].id;
    const related = getRelatedSkills(sourceId, 5);
    expect(related.length).toBeLessThanOrEqual(5);
    related.forEach((s) => expect(s.id).not.toBe(sourceId));
  });

  it("returns empty array for non-existent skill", () => {
    expect(getRelatedSkills("nonexistent")).toEqual([]);
  });

  it("respects limit parameter", () => {
    const related = getRelatedSkills(skills[0].id, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });
});

describe("getRelatedWorkflows", () => {
  it("returns related workflows excluding the source workflow", () => {
    const sourceId = workflows[0].id;
    const related = getRelatedWorkflows(sourceId, 5);
    expect(related.length).toBeLessThanOrEqual(5);
    related.forEach((w) => expect(w.id).not.toBe(sourceId));
  });

  it("returns empty array for non-existent workflow", () => {
    expect(getRelatedWorkflows("nonexistent")).toEqual([]);
  });

  it("respects limit parameter", () => {
    const related = getRelatedWorkflows(workflows[0].id, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// STATS
// ---------------------------------------------------------------------------

describe("getGlobalStats", () => {
  it("returns correct totals", () => {
    const stats = getGlobalStats();
    expect(stats.totalSkills).toBe(skills.length);
    expect(stats.totalWorkflows).toBe(workflows.length);
    expect(stats.totalIndustries).toBe(industries.length);
    expect(stats.totalCategories).toBeGreaterThan(0);
  });
});

describe("getIndustryStats", () => {
  it("returns stats for a valid industry", () => {
    const stats = getIndustryStats("healthcare");
    expect(stats.skillCount).toBeGreaterThan(0);
    expect(stats.workflowCount).toBeGreaterThan(0);
    expect(stats.categories.length).toBeGreaterThan(0);
    expect(stats.topSkills.length).toBeLessThanOrEqual(5);
  });

  it("top skills are sorted by popularity", () => {
    const stats = getIndustryStats("healthcare");
    for (let i = 1; i < stats.topSkills.length; i++) {
      expect(stats.topSkills[i - 1].popularity).toBeGreaterThanOrEqual(
        stats.topSkills[i].popularity
      );
    }
  });

  it("returns zeros for non-existent industry", () => {
    const stats = getIndustryStats("fake-industry");
    expect(stats.skillCount).toBe(0);
    expect(stats.workflowCount).toBe(0);
  });
});
