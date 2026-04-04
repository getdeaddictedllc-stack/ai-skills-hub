"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Building2, Sparkles, GitBranch, LayoutGrid } from "lucide-react";
import IndustryCard from "@/components/IndustryCard";
import { getAllIndustries, getGlobalStats } from "@/lib/data-service";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function IndustriesPage() {
  const [search, setSearch] = useState("");

  const allIndustries = useMemo(() => getAllIndustries(), []);
  const stats = useMemo(() => getGlobalStats(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allIndustries;
    const q = search.toLowerCase();
    return allIndustries.filter(
      (ind) =>
        ind.name.toLowerCase().includes(q) ||
        ind.description.toLowerCase().includes(q) ||
        ind.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [search, allIndustries]);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-16 pb-10 text-center sm:pt-24 sm:pb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="gradient-text">Explore Industries</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400"
          >
            Discover AI skills and workflows tailored to your industry. Browse
            through {stats.totalIndustries}+ industries to find the right
            capabilities for your business.
          </motion.p>
        </section>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mb-10 flex max-w-xl items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { icon: Building2, label: "Industries", value: stats.totalIndustries },
            { icon: Sparkles, label: "Skills", value: stats.totalSkills },
            { icon: GitBranch, label: "Workflows", value: stats.totalWorkflows },
            { icon: LayoutGrid, label: "Categories", value: stats.totalCategories },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                <Icon className="h-4 w-4" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {value}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mx-auto mb-10 max-w-xl"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search industries by name, description, or category..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Results count */}
        {search.trim() && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            {filtered.length} {filtered.length === 1 ? "industry" : "industries"} found
          </motion.p>
        )}

        {/* Industry grid */}
        <section className="pb-24">
          {filtered.length > 0 ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={container}
              initial="hidden"
              animate="show"
              key={search}
            >
              {filtered.map((industry) => (
                <motion.div key={industry.id} variants={item}>
                  <IndustryCard industry={industry} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                <Search className="h-7 w-7 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No industries found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search term or clearing the filter to see all
                industries.
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
