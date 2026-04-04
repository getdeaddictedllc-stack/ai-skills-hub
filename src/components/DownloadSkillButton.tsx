"use client";

import { Download } from "lucide-react";
import type { Skill } from "@/lib/types";
import { generateSkillFileContent } from "@/lib/skill-file-generator";

interface DownloadSkillButtonProps {
  skill: Skill;
}

export default function DownloadSkillButton({ skill }: DownloadSkillButtonProps) {
  const handleDownload = () => {
    const content = generateSkillFileContent(skill);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
    >
      <Download className="h-4 w-4" />
      Download Skill File
    </button>
  );
}
