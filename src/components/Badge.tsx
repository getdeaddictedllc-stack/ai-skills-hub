"use client";

import { cn } from "@/lib/utils";
import type { Difficulty, Complexity, AIModel, IntegrationType } from "@/lib/types";

type BadgeVariant = "difficulty" | "complexity" | "model" | "integration" | "default";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const difficultyColors: Record<Difficulty, string> = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-orange-100 text-orange-800 border-orange-200",
  expert: "bg-red-100 text-red-800 border-red-200",
};

const complexityColors: Record<Complexity, string> = {
  simple: "bg-green-100 text-green-800 border-green-200",
  moderate: "bg-blue-100 text-blue-800 border-blue-200",
  complex: "bg-orange-100 text-orange-800 border-orange-200",
  enterprise: "bg-purple-100 text-purple-800 border-purple-200",
};

const modelColors: Record<AIModel, string> = {
  claude: "bg-amber-100 text-amber-800 border-amber-200",
  "gpt-4": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "gpt-4o": "bg-teal-100 text-teal-800 border-teal-200",
  gemini: "bg-blue-100 text-blue-800 border-blue-200",
  llama: "bg-indigo-100 text-indigo-800 border-indigo-200",
  mistral: "bg-orange-100 text-orange-800 border-orange-200",
  cohere: "bg-pink-100 text-pink-800 border-pink-200",
  palm: "bg-cyan-100 text-cyan-800 border-cyan-200",
  dalle: "bg-violet-100 text-violet-800 border-violet-200",
  "stable-diffusion": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  whisper: "bg-slate-100 text-slate-800 border-slate-200",
  midjourney: "bg-rose-100 text-rose-800 border-rose-200",
};

const integrationColors: Record<IntegrationType, string> = {
  api: "bg-sky-100 text-sky-800 border-sky-200",
  webhook: "bg-lime-100 text-lime-800 border-lime-200",
  sdk: "bg-violet-100 text-violet-800 border-violet-200",
  plugin: "bg-amber-100 text-amber-800 border-amber-200",
  standalone: "bg-gray-100 text-gray-800 border-gray-200",
  mcp: "bg-indigo-100 text-indigo-800 border-indigo-200",
  "function-calling": "bg-teal-100 text-teal-800 border-teal-200",
};

function getVariantColor(variant: BadgeVariant, label: string): string {
  if (variant === "difficulty") {
    return difficultyColors[label as Difficulty] ?? "bg-gray-100 text-gray-700 border-gray-200";
  }
  if (variant === "complexity") {
    return complexityColors[label as Complexity] ?? "bg-gray-100 text-gray-700 border-gray-200";
  }
  if (variant === "model") {
    return modelColors[label as AIModel] ?? "bg-gray-100 text-gray-700 border-gray-200";
  }
  if (variant === "integration") {
    return integrationColors[label as IntegrationType] ?? "bg-gray-100 text-gray-700 border-gray-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function Badge({
  label,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium capitalize",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        getVariantColor(variant, label),
        className
      )}
    >
      {label}
    </span>
  );
}
