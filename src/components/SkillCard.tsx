"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Skill } from "@/lib/types";
import Badge from "./Badge";

interface SkillCardProps {
  skill: Skill;
  className?: string;
}

export default function SkillCard({ skill, className }: SkillCardProps) {
  const displayedModels = skill.aiModels.slice(0, 3);

  return (
    <Link href={`/skill/${skill.id}`} className={cn("block", className)}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {skill.name}
          </h3>
          <Badge label={skill.difficulty} variant="difficulty" size="sm" />
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
          {skill.description}
        </p>

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Industry tag */}
        <div className="mb-3">
          <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {skill.industry}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* AI Model badges */}
          <div className="flex flex-wrap gap-1">
            {displayedModels.map((model) => (
              <Badge key={model} label={model} variant="model" size="sm" />
            ))}
          </div>

          {/* Estimated time */}
          <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0 ml-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{skill.estimatedTime}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
