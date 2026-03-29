"use client";

import { motion } from "framer-motion";
import { Building2, Cpu, GitBranch } from "lucide-react";

const stats = [
  { label: "Industries", value: "35+", icon: Building2 },
  { label: "Skills", value: "500+", icon: Cpu },
  { label: "Workflows", value: "100+", icon: GitBranch },
];

export function StatsBar() {
  return (
    <motion.div
      className="mx-auto mb-12 flex max-w-2xl flex-wrap items-center justify-center gap-6 sm:gap-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-950/50 dark:text-brand-400">
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
