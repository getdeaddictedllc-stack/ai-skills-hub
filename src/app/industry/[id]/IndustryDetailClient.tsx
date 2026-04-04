"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, Home, Sparkles, GitBranch, Tag } from "lucide-react";
import SkillCard from "@/components/SkillCard";
import WorkflowCard from "@/components/WorkflowCard";
import type { Industry, Skill, Workflow } from "@/lib/types";

function getIcon(iconName: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[iconName];
  if (icon && typeof icon === "function") {
    return icon as LucideIcon;
  }
  return Icons.Layers;
}

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

interface IndustryDetailClientProps {
  industry: Industry;
  stats: {
    skillCount: number;
    workflowCount: number;
    categories: string[];
    topSkills: Skill[];
  };
  skills: Skill[];
  workflows: Workflow[];
}

export function IndustryDetailClient({
  industry,
  stats,
  skills,
  workflows,
}: IndustryDetailClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const Icon = getIcon(industry.icon);

  const filteredSkills = useMemo(() => {
    if (!activeCategory) return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  const filteredWorkflows = useMemo(() => {
    if (!activeCategory) return workflows;
    return workflows.filter((w) => w.category === activeCategory);
  }, [workflows, activeCategory]);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: industry.color }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 pt-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/industries"
            className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            Industries
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-900 dark:text-white">
            {industry.name}
          </span>
        </motion.nav>

        {/* Hero */}
        <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-center"
          >
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:h-20 sm:w-20"
              style={{ backgroundColor: `${industry.color}15` }}
            >
              <Icon
                className="h-8 w-8 sm:h-10 sm:w-10"
                style={{ color: industry.color }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                {industry.name}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-gray-500 dark:text-gray-400 sm:text-lg">
                {industry.description}
              </p>
            </div>
          </motion.div>

          {/* Color accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 h-1 w-full origin-left rounded-full"
            style={{ backgroundColor: industry.color }}
          />
        </section>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center gap-6 sm:gap-10"
        >
          {[
            { icon: Sparkles, label: "Skills", value: stats.skillCount },
            { icon: GitBranch, label: "Workflows", value: stats.workflowCount },
            {
              icon: Tag,
              label: "Categories",
              value: stats.categories.length,
            },
          ].map(({ icon: StatIcon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${industry.color}15` }}
              >
                <StatIcon
                  className="h-4 w-4"
                  style={{ color: industry.color }}
                />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Category pills */}
        {stats.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === null
                  ? "border-transparent text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600"
              }`}
              style={
                activeCategory === null
                  ? { backgroundColor: industry.color }
                  : undefined
              }
            >
              All
            </button>
            {stats.categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "border-transparent text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600"
                }`}
                style={
                  activeCategory === cat
                    ? { backgroundColor: industry.color }
                    : undefined
                }
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Skills section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-6 flex items-center gap-3"
          >
            <Sparkles
              className="h-5 w-5"
              style={{ color: industry.color }}
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skills
            </h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {filteredSkills.length}
            </span>
          </motion.div>

          {filteredSkills.length > 0 ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
              key={`skills-${activeCategory}`}
            >
              {filteredSkills.map((skill) => (
                <motion.div key={skill.id} variants={item}>
                  <SkillCard skill={skill} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No skills found in this category.
              </p>
            </div>
          )}
        </section>

        {/* Workflows section */}
        <section className="pb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 flex items-center gap-3"
          >
            <GitBranch
              className="h-5 w-5"
              style={{ color: industry.color }}
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Workflows
            </h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {filteredWorkflows.length}
            </span>
          </motion.div>

          {filteredWorkflows.length > 0 ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
              key={`workflows-${activeCategory}`}
            >
              {filteredWorkflows.map((workflow) => (
                <motion.div key={workflow.id} variants={item}>
                  <WorkflowCard workflow={workflow} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No workflows found in this category.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
