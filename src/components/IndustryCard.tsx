"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Industry } from "@/lib/types";

interface IndustryCardProps {
  industry: Industry;
  className?: string;
}

function getIcon(iconName: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[iconName];
  if (icon && typeof icon === "function") {
    return icon as LucideIcon;
  }
  return Icons.Layers;
}

export default function IndustryCard({ industry, className }: IndustryCardProps) {
  const Icon = getIcon(industry.icon);

  return (
    <Link href={`/industry/${industry.id}`} className={cn("block", className)}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
      >
        {/* Color accent bar */}
        <div className="h-1.5" style={{ backgroundColor: industry.color }} />

        <div className="flex flex-col p-5">
          {/* Icon + Name */}
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${industry.color}20` }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: industry.color }}
              />
            </div>
            <h3 className="text-base font-semibold text-gray-900 group-hover:transition-colors" style={{ ["--hover-color" as string]: industry.color }}>
              <span className="group-hover:text-blue-600 transition-colors">
                {industry.name}
              </span>
            </h3>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
            {industry.description}
          </p>

          {/* Spacer */}
          <div className="mt-auto" />

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-700">{industry.skillCount}</span>
              <span>skills</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-700">{industry.workflowCount}</span>
              <span>workflows</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-700">{industry.categories.length}</span>
              <span>categories</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
