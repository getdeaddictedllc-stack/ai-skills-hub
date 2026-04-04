"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface EmbedCodeBlockProps {
  type: "skill" | "workflow";
  id: string;
  name: string;
  description: string;
  difficulty?: string;
  complexity?: string;
  industry: string;
  category: string;
  estimatedTime: string;
  steps?: number;
}

export default function EmbedCodeBlock({
  type,
  id,
  name,
  description,
  difficulty,
  complexity,
  industry,
  category,
  estimatedTime,
  steps,
}: EmbedCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const badgeLabel = type === "skill" ? difficulty : complexity;
  const badgeColor =
    type === "skill"
      ? difficulty === "beginner"
        ? "#22c55e"
        : difficulty === "intermediate"
        ? "#eab308"
        : difficulty === "advanced"
        ? "#f97316"
        : "#ef4444"
      : complexity === "simple"
      ? "#22c55e"
      : complexity === "moderate"
      ? "#3b82f6"
      : complexity === "complex"
      ? "#f97316"
      : "#8b5cf6";

  const siteUrl = "https://aiskillhub.info";
  const pageUrl = `${siteUrl}/${type}/${id}`;

  const embedCode = `<!-- AI Skills Hub - ${name} -->
<div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;max-width:400px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
    <span style="background:${badgeColor};color:#fff;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;text-transform:capitalize;">${badgeLabel}</span>
    <span style="background:#f3f4f6;padding:2px 10px;border-radius:6px;font-size:12px;color:#4b5563;">${industry}</span>
  </div>
  <a href="${pageUrl}" target="_blank" rel="noopener" style="text-decoration:none;">
    <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111827;">${name}</h3>
  </a>
  <p style="margin:0 0 12px;font-size:14px;color:#6b7280;line-height:1.5;">${description.slice(0, 150)}${description.length > 150 ? "..." : ""}</p>
  <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#9ca3af;">
    <span>${category}</span>
    <span>${steps ? `${steps} steps · ` : ""}${estimatedTime}</span>
  </div>
  <a href="${pageUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;padding:6px 16px;background:#4f46e5;color:#fff;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none;">View on AI Skills Hub &rarr;</a>
</div>`;

  const iframeCode = `<!-- AI Skills Hub - Embed via iframe -->
<iframe
  src="${pageUrl}"
  width="100%"
  height="800"
  style="border:none;border-radius:12px;"
  title="${name} - AI Skills Hub"
></iframe>`;

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* HTML Card Embed */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            HTML Card Embed
          </span>
          <button
            onClick={() => handleCopy(embedCode)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-950/60"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Code
              </>
            )}
          </button>
        </div>
        <pre className="max-h-48 overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-300 dark:bg-gray-950">
          <code>{embedCode}</code>
        </pre>
      </div>

      {/* iframe Embed */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            iframe Embed (Full Page)
          </span>
          <button
            onClick={() => handleCopy(iframeCode)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
        <pre className="max-h-32 overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-300 dark:bg-gray-950">
          <code>{iframeCode}</code>
        </pre>
      </div>
    </div>
  );
}
