"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Skill } from "@/lib/types";
import { getSkillPrice, getSkillOriginalPrice, PAID_MODE } from "@/lib/pricing";
import Badge from "./Badge";
import AddToCartButton from "./AddToCartButton";

interface SkillCardProps {
  skill: Skill;
  className?: string;
}

export default function SkillCard({ skill, className }: SkillCardProps) {
  const displayedModels = skill.aiModels.slice(0, 3);
  const price = getSkillPrice(skill);
  const originalPrice = getSkillOriginalPrice(skill);

  return (
    <Link href={`/skill/${skill.id}`} className={cn("block", className)}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-brand-400">
            {skill.name}
          </h3>
          <Badge label={skill.difficulty} variant="difficulty" size="sm" />
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2 dark:text-gray-400">
          {skill.description}
        </p>

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Industry tag */}
        <div className="mb-3">
          <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize dark:bg-gray-800 dark:text-gray-400">
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
          <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0 ml-2 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{skill.estimatedTime}</span>
          </div>
        </div>

        {/* Price & Add to cart */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex items-baseline gap-2">
            {!PAID_MODE ? (
              <>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">Free</span>
                <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
            )}
          </div>
          <AddToCartButton
            item={{
              id: skill.id,
              type: "skill",
              name: skill.name,
              price,
              industry: skill.industry,
              category: skill.category,
              difficulty: skill.difficulty,
            }}
            size="sm"
            showPrice={false}
          />
        </div>
      </motion.div>
    </Link>
  );
}
