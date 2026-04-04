"use client";

import { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  key: string;
  label: string;
  type: "checkbox" | "select";
  options: FilterOption[];
}

interface FilterPanelProps {
  filters: FilterSection[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAll: () => void;
  className?: string;
}

function activeCount(activeFilters: Record<string, string[]>): number {
  return Object.values(activeFilters).reduce((sum, v) => sum + v.length, 0);
}

function SectionContent({
  section,
  activeFilters,
  onFilterChange,
}: {
  section: FilterSection;
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
}) {
  const selected = activeFilters[section.key] ?? [];

  if (section.type === "select") {
    return (
      <select
        value={selected[0] ?? ""}
        onChange={(e) =>
          onFilterChange(section.key, e.target.value ? [e.target.value] : [])
        }
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-400 dark:focus:ring-brand-400 transition-colors"
      >
        <option value="">All</option>
        {section.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
            {opt.count != null ? ` (${opt.count})` : ""}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-1.5">
      {section.options.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                const next = checked
                  ? selected.filter((v) => v !== opt.value)
                  : [...selected, opt.value];
                onFilterChange(section.key, next);
              }}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <span className="flex-1 text-gray-700 dark:text-gray-300">
              {opt.label}
            </span>
            {opt.count != null && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {opt.count}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

function CollapsibleSection({
  section,
  activeFilters,
  onFilterChange,
  defaultOpen = true,
}: {
  section: FilterSection;
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionActive = (activeFilters[section.key] ?? []).length;

  return (
    <div className="border-b border-gray-200/60 dark:border-gray-700/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-1 py-3 text-sm font-medium text-gray-900 dark:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          {section.label}
          {sectionActive > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white">
              {sectionActive}
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3">
              <SectionContent
                section={section}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterContent({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
}: Omit<FilterPanelProps, "className">) {
  const total = activeCount(activeFilters);

  return (
    <>
      {total > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {total} active filter{total !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
      {filters.map((section) => (
        <CollapsibleSection
          key={section.key}
          section={section}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
      ))}
    </>
  );
}

export default function FilterPanel({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const total = activeCount(activeFilters);

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {total > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white">
              {total}
            </span>
          )}
        </button>
      </div>

      {/* Mobile slide-out panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl dark:bg-gray-900 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onClearAll={onClearAll}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-60 shrink-0 rounded-xl border border-gray-200/50 bg-white/60 p-4 backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-900/60",
          className
        )}
      >
        <FilterContent
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onClearAll={onClearAll}
        />
      </aside>
    </>
  );
}
