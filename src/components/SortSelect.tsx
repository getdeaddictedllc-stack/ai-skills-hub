"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  className?: string;
}

export default function SortSelect({
  value,
  onChange,
  options,
  className,
}: SortSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-gray-200/50 bg-white/60 pl-9 pr-8 text-sm text-gray-700 outline-none backdrop-blur-lg transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700/50 dark:bg-gray-900/60 dark:text-gray-300 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <svg
          className="h-4 w-4 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
