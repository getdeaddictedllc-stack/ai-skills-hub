"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import SkillCard from "@/components/SkillCard";
import Badge from "@/components/Badge";
import {
  searchSkills,
  sortSkills,
  paginateResults,
  getAllIndustries,
  getGlobalStats,
} from "@/lib/data-service";
import type { SkillFilters, SkillSortOption } from "@/lib/data-service";
import type { AIModel, IntegrationType, Skill } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 12;

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "expert"] as const;

const AI_MODELS: AIModel[] = [
  "claude",
  "gpt-4",
  "gpt-4o",
  "gemini",
  "llama",
  "mistral",
  "cohere",
  "palm",
  "dalle",
  "stable-diffusion",
  "whisper",
  "midjourney",
];

const INTEGRATION_TYPES: IntegrationType[] = [
  "api",
  "webhook",
  "sdk",
  "plugin",
  "standalone",
  "mcp",
  "function-calling",
];

const SORT_OPTIONS: { value: SkillSortOption; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "name", label: "Name A-Z" },
  { value: "difficulty", label: "Difficulty" },
  { value: "newest", label: "Newest" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toggleInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SkillsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Read initial state from URL ---
  const initialQuery = searchParams.get("q") ?? "";
  const initialIndustry = searchParams.get("industry") ?? "";
  const initialDifficulty = (searchParams.get("difficulty")?.split(",").filter(Boolean) ?? []) as Skill["difficulty"][];
  const initialModels = (searchParams.get("models")?.split(",").filter(Boolean) ?? []) as AIModel[];
  const initialIntegrations = (searchParams.get("integrations")?.split(",").filter(Boolean) ?? []) as IntegrationType[];
  const initialSort = (searchParams.get("sort") as SkillSortOption) || "popularity";
  const initialPage = Number(searchParams.get("page")) || 1;

  // --- State ---
  const [query, setQuery] = useState(initialQuery);
  const [industry, setIndustry] = useState(initialIndustry);
  const [difficulty, setDifficulty] = useState<Skill["difficulty"][]>(initialDifficulty);
  const [models, setModels] = useState<AIModel[]>(initialModels);
  const [integrations, setIntegrations] = useState<IntegrationType[]>(initialIntegrations);
  const [sortBy, setSortBy] = useState<SkillSortOption>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const industries = useMemo(() => getAllIndustries(), []);
  const stats = useMemo(() => getGlobalStats(), []);

  // --- Build filters object ---
  const filters: SkillFilters = useMemo(
    () => ({
      industry: industry || undefined,
      difficulty: difficulty.length ? difficulty : undefined,
      models: models.length ? models : undefined,
      integrationTypes: integrations.length ? integrations : undefined,
    }),
    [industry, difficulty, models, integrations]
  );

  // --- Compute results ---
  const allFiltered = useMemo(() => {
    const results = searchSkills(query, filters);
    return sortSkills(results, sortBy);
  }, [query, filters, sortBy]);

  const paginated = useMemo(
    () => paginateResults(allFiltered, page, PAGE_SIZE),
    [allFiltered, page]
  );

  // --- Sync state to URL ---
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (industry) params.set("industry", industry);
    if (difficulty.length) params.set("difficulty", difficulty.join(","));
    if (models.length) params.set("models", models.join(","));
    if (integrations.length) params.set("integrations", integrations.join(","));
    if (sortBy !== "popularity") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/skills${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [query, industry, difficulty, models, integrations, sortBy, page, router]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, industry, difficulty, models, integrations, sortBy]);

  // --- Active filter pills ---
  const activeFilters: { label: string; onRemove: () => void }[] = useMemo(() => {
    const pills: { label: string; onRemove: () => void }[] = [];
    if (industry) {
      const ind = industries.find((i) => i.id === industry);
      pills.push({
        label: `Industry: ${ind?.name ?? industry}`,
        onRemove: () => setIndustry(""),
      });
    }
    difficulty.forEach((d) =>
      pills.push({
        label: `Difficulty: ${d}`,
        onRemove: () => setDifficulty((prev) => prev.filter((x) => x !== d)),
      })
    );
    models.forEach((m) =>
      pills.push({
        label: `Model: ${m}`,
        onRemove: () => setModels((prev) => prev.filter((x) => x !== m)),
      })
    );
    integrations.forEach((t) =>
      pills.push({
        label: `Integration: ${t}`,
        onRemove: () => setIntegrations((prev) => prev.filter((x) => x !== t)),
      })
    );
    return pills;
  }, [industry, difficulty, models, integrations, industries]);

  const clearAllFilters = () => {
    setQuery("");
    setIndustry("");
    setDifficulty([]);
    setModels([]);
    setIntegrations([]);
    setSortBy("popularity");
  };

  const hasFilters = activeFilters.length > 0 || query.length > 0;

  // --- Filter sidebar content (shared between desktop & mobile) ---
  const filterContent = (
    <div className="space-y-6">
      {/* Industry */}
      <FilterSection title="Industry">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name} ({ind.skillCount})
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title="Difficulty">
        <div className="space-y-2">
          {DIFFICULTIES.map((d) => (
            <label
              key={d}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={difficulty.includes(d)}
                onChange={() => setDifficulty((prev) => toggleInArray(prev, d))}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600"
              />
              <span className="capitalize">{d}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* AI Models */}
      <FilterSection title="AI Models">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {AI_MODELS.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={models.includes(m)}
                onChange={() => setModels((prev) => toggleInArray(prev, m))}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600"
              />
              <span className="capitalize">{m}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Integration Types */}
      <FilterSection title="Integration Types">
        <div className="space-y-2">
          {INTEGRATION_TYPES.map((t) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={integrations.includes(t)}
                onChange={() =>
                  setIntegrations((prev) => toggleInArray(prev, t))
                }
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600"
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {hasFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-20 pb-8 text-center sm:pt-28 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-600 ring-1 ring-brand-200/60 dark:bg-brand-950/50 dark:text-brand-400 dark:ring-brand-800/40 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {stats.totalSkills} skills across {stats.totalIndustries} industries
            </span>
          </motion.div>

          <motion.h1
            className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover{" "}
            <span className="gradient-text">AI Skills</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Search, filter, and explore AI capabilities tailored to your industry
            and use case.
          </motion.p>
        </section>

        {/* Search bar */}
        <motion.div
          className="mx-auto mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills by name, tag, or description..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-10 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Sort + mobile filter toggle + result count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {allFiltered.length}
            </span>{" "}
            {allFiltered.length === 1 ? "result" : "results"} found
          </p>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SkillSortOption)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 lg:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter pills */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              className="mb-6 flex flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {activeFilters.map((pill) => (
                <motion.button
                  key={pill.label}
                  onClick={pill.onRemove}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200/60 transition-colors hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:ring-brand-800/40 dark:hover:bg-brand-900/40"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  {pill.label}
                  <X className="h-3 w-3" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content: sidebar + grid */}
        <div className="flex gap-8 pb-20">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
              {filterContent}
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {paginated.items.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                >
                  {paginated.items.map((skill) => (
                    <motion.div
                      key={skill.id}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.35 }}
                    >
                      <SkillCard skill={skill} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {paginated.totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-1">
                    <button
                      disabled={!paginated.hasPrev}
                      onClick={() => setPage((p) => p - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {generatePageNumbers(paginated.page, paginated.totalPages).map(
                      (p, idx) =>
                        p === "..." ? (
                          <span
                            key={`dots-${idx}`}
                            className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p as number)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                              p === paginated.page
                                ? "bg-brand-500 text-white shadow-sm"
                                : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                            }`}
                          >
                            {p}
                          </button>
                        )
                    )}

                    <button
                      disabled={!paginated.hasNext}
                      onClick={() => setPage((p) => p + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              /* Empty state */
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No skills found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters to find what you are
                  looking for.
                </p>
                {hasFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter slide-out */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-80 max-w-full overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-900 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {title}
      </h4>
      {children}
    </div>
  );
}

function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}
