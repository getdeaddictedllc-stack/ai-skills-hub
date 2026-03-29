"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Workflow } from "@/lib/types";
import Badge from "./Badge";

interface WorkflowCardProps {
  workflow: Workflow;
  className?: string;
}

export default function WorkflowCard({ workflow, className }: WorkflowCardProps) {
  const previewSteps = workflow.steps.slice(0, 3);
  const remainingCount = workflow.steps.length - previewSteps.length;

  return (
    <Link href={`/workflow/${workflow.id}`} className={cn("block", className)}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {workflow.name}
          </h3>
          <Badge label={workflow.complexity} variant="complexity" size="sm" />
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
          {workflow.description}
        </p>

        {/* Mini step preview */}
        <div className="mb-4 flex items-center gap-1.5">
          {previewSteps.map((step, i) => (
            <div key={step.order} className="flex items-center gap-1.5">
              {i > 0 && <div className="h-px w-3 bg-gray-300" />}
              <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                  {step.order}
                </span>
                <span className="max-w-[80px] truncate text-xs font-medium text-blue-700">
                  {step.skillName}
                </span>
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <>
              <div className="h-px w-3 bg-gray-300" />
              <span className="text-xs text-gray-400">+{remainingCount} more</span>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {workflow.industry}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <GitBranch className="h-3.5 w-3.5" />
              <span>{workflow.steps.length} steps</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{workflow.estimatedTime}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
