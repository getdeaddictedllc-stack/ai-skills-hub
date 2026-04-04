"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Workflow as WorkflowIcon,
} from "lucide-react";
import WorkflowCard from "@/components/WorkflowCard";
import {
  getAllWorkflows,
  getAllIndustries,
  filterWorkflows,
  sortWorkflows,
  paginateResults,
} from "@/lib/data-service";
import type { WorkflowFilters, WorkflowSortOption } from "@/lib/data-service";
import type { Workflow } from "@/lib/types";

const COMPLEXITY_OPTIONS: Workflow["complexity"][] = [
  "simple",
  "moderate",
  "complex",
  "enterprise",
];

const SORT_OPTIONS: { value: WorkflowSortOption; label: string }[] = [
  { value: "name", label: "Name A-Z" },
  { value: "complexity", label: "Complexity" },
  { value: "steps", label: "Steps Count" },
  { value: "time", label: "Estimated Time" },
];

const PAGE_SIZE = 12;

export default function WorkflowsPage() {
  const allWorkflows = useMemo(() => getAllWorkflows(), []);
  const industries = useMemo(() => getAllIndustries(), []);

  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState<
    Workflow["complexity"][]
  >([]);
  const [sortBy, setSortBy] = useState<WorkflowSortOption>("name");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: WorkflowFilters = useMemo(
    () => ({
      industry: selectedIndustry || undefined,
      complexity: selectedComplexity.length ? selectedComplexity : undefined,
      search: search || undefined,
    }),
    [search, selectedIndustry, selectedComplexity]
  );

  const results = useMemo(() => {
    const filtered = filterWorkflows(filters);
    return sortWorkflows(filtered, sortBy);
  }, [filters, sortBy]);

  const paginated = useMemo(
    () => paginateResults(results, page, PAGE_SIZE),
    [results, page]
  );

  const toggleComplexity = (c: Workflow["complexity"]) => {
    setSelectedComplexity((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedIndustry("");
    setSelectedComplexity([]);
    setPage(1);
  };

  const hasActiveFilters =
    !!search || !!selectedIndustry || selectedComplexity.length > 0;

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-8 pt-16 text-center sm:pt-20"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40">
            <WorkflowIcon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="gradient-text">AI Workflows</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            End-to-end AI pipelines combining multiple skills into powerful
            automated workflows.{" "}
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {allWorkflows.length} workflows
            </span>{" "}
            across every industry.
          </p>
        </motion.section>

        {/* Search & Controls */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-brand-500"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as WorkflowSortOption)}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </motion.section>

        {/* Filters + Results */}
        <div className="flex flex-col gap-6 pb-20 lg:flex-row">
          {/* Filter panel */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`w-full shrink-0 lg:w-64 ${
              filtersOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="glass-card rounded-xl p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Industry */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Industry
                </label>
                <div className="relative">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => {
                      setSelectedIndustry(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Complexity */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Complexity
                </label>
                <div className="space-y-2">
                  {COMPLEXITY_OPTIONS.map((c) => (
                    <label
                      key={c}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedComplexity.includes(c)}
                        onChange={() => toggleComplexity(c)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <span className="capitalize">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Results count + active filter pills */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </span>

              {/* Active filter pills */}
              <AnimatePresence>
                {selectedIndustry && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setSelectedIndustry("");
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-200 dark:bg-brand-900/40 dark:text-brand-300"
                  >
                    {industries.find((i) => i.id === selectedIndustry)?.name}
                    <X className="h-3 w-3" />
                  </motion.button>
                )}
                {selectedComplexity.map((c) => (
                  <motion.button
                    key={c}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => toggleComplexity(c)}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium capitalize text-brand-700 transition-colors hover:bg-brand-200 dark:bg-brand-900/40 dark:text-brand-300"
                  >
                    {c}
                    <X className="h-3 w-3" />
                  </motion.button>
                ))}
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-200 dark:bg-brand-900/40 dark:text-brand-300"
                  >
                    &quot;{search}&quot;
                    <X className="h-3 w-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Workflow grid */}
            {paginated.items.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {paginated.items.map((workflow, i) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <WorkflowCard workflow={workflow} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 dark:border-gray-700"
              >
                <WorkflowIcon className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="mb-1 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No workflows found
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  Clear filters
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {paginated.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-2"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!paginated.hasPrev}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: paginated.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, and pages near current
                      return (
                        p === 1 ||
                        p === paginated.totalPages ||
                        Math.abs(p - paginated.page) <= 1
                      );
                    })
                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                        acc.push("...");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-sm text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                            paginated.page === item
                              ? "bg-brand-600 text-white shadow-sm"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(paginated.totalPages, p + 1))
                  }
                  disabled={!paginated.hasNext}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
