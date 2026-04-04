"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { WorkflowStep } from "@/lib/types";

// Gradient progression colors for step circles
const STEP_COLORS = [
  "from-brand-400 to-brand-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-purple-400 to-purple-600",
  "from-fuchsia-400 to-fuchsia-600",
  "from-pink-400 to-pink-600",
  "from-rose-400 to-rose-600",
  "from-orange-400 to-orange-600",
  "from-amber-400 to-amber-600",
  "from-emerald-400 to-emerald-600",
];

const STEP_BG_COLORS = [
  "border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-950/30",
  "border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/30",
  "border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/30",
  "border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-950/30",
  "border-fuchsia-200 dark:border-fuchsia-800/50 bg-fuchsia-50/50 dark:bg-fuchsia-950/30",
  "border-pink-200 dark:border-pink-800/50 bg-pink-50/50 dark:bg-pink-950/30",
  "border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-950/30",
  "border-orange-200 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-950/30",
  "border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/30",
  "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/30",
];

interface StepFlowProps {
  steps: WorkflowStep[];
}

export function StepFlow({ steps }: StepFlowProps) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-300 via-purple-300 to-pink-300 dark:from-brand-700 dark:via-purple-700 dark:to-pink-700 sm:left-8" />

      <div className="space-y-0">
        {sorted.map((step, idx) => {
          const colorIdx = idx % STEP_COLORS.length;
          const isLast = idx === sorted.length - 1;

          return (
            <div key={step.order}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex gap-4 sm:gap-6"
              >
                {/* Step circle */}
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg sm:h-16 sm:w-16 ${STEP_COLORS[colorIdx]}`}
                  >
                    <span className="text-lg font-bold text-white sm:text-xl">
                      {step.order}
                    </span>
                  </div>
                </div>

                {/* Step content card */}
                <div
                  className={`mb-2 flex-1 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:p-5 ${STEP_BG_COLORS[colorIdx]}`}
                >
                  <Link
                    href={`/skill/${step.skillId}`}
                    className="mb-1.5 inline-block text-base font-semibold text-gray-900 transition-colors hover:text-brand-600 sm:text-lg dark:text-white dark:hover:text-brand-400"
                  >
                    {step.skillName}
                    <span className="ml-1.5 text-xs font-normal text-brand-500 dark:text-brand-400">
                      View skill &rarr;
                    </span>
                  </Link>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {/* Arrow connector between steps */}
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 + 0.2 }}
                  className="relative z-10 flex h-8 items-center pl-[18px] sm:pl-[26px]"
                >
                  <ArrowDown className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
