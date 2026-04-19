"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import type { Skill } from "@/lib/types";

interface SkillPreviewProps {
  skill: Skill;
  previewContent: string;
}

export default function SkillPreview({ skill, previewContent }: SkillPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  const lines = previewContent.split("\n");
  const previewLines = lines.slice(0, Math.ceil(lines.length * 0.3));
  const displayContent = expanded ? previewLines.join("\n") : previewLines.slice(0, 15).join("\n");

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <Eye className="h-5 w-5" />
          Skill File Preview
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {expanded ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Show Less
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Show More
            </>
          )}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-950 shadow-sm dark:border-gray-700">
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
          <span className="text-xs font-medium text-gray-400">
            {skill.id}.md
          </span>
          <span className="rounded bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-400">
            Preview
          </span>
        </div>
        <pre className="max-h-96 overflow-auto p-4 text-sm leading-relaxed text-gray-300">
          <code>{displayContent}</code>
        </pre>

        {/* Fade overlay */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-gray-950 to-transparent" />
          <div className="flex items-center justify-center gap-2 border-t border-gray-800 px-4 py-3">
            <Lock className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">
              Purchase to access the full skill file with system prompt, integration code, and more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
