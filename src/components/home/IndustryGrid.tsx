"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Industry } from "@/lib/types";

function getIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name];
  if (icon && typeof icon === "function") {
    return icon as LucideIcon;
  }
  return Icons.Boxes;
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

export function IndustryGrid({ industries }: { industries: Industry[] }) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {industries.map((industry) => {
        const Icon = getIcon(industry.icon);
        return (
          <motion.div key={industry.id} variants={item}>
            <Link
              href={`/industry/${industry.id}`}
              className="group glass-card flex flex-col rounded-2xl p-5 h-full"
            >
              {/* Icon + accent */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${industry.color}15` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: industry.color }}
                  />
                </div>
                <div
                  className="h-1 flex-1 rounded-full opacity-20"
                  style={{ backgroundColor: industry.color }}
                />
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {industry.name}
              </h3>

              {/* Description */}
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                {industry.description}
              </p>

              {/* Meta */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  {industry.categories.length} categories
                </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: industry.color }}
                >
                  Explore &rarr;
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
