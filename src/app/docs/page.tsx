import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Key, Zap, BookOpen, ArrowRight, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation - AI Skills Hub Developer API",
  description: "REST API documentation for AI Skills Hub. Access 420+ AI skills and 177+ workflows programmatically. Search, filter, and integrate AI capabilities into your applications.",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/skills",
    description: "List and search all AI skills with filtering and pagination",
    params: [
      { name: "q", type: "string", desc: "Search query (fuzzy matches name, description, tags)" },
      { name: "industry", type: "string", desc: "Filter by industry ID (e.g., healthcare, finance)" },
      { name: "difficulty", type: "string", desc: "Filter by difficulty: beginner, intermediate, advanced, expert" },
      { name: "sort", type: "string", desc: "Sort by: popularity (default), name, difficulty, newest" },
      { name: "page", type: "number", desc: "Page number (default: 1)" },
      { name: "limit", type: "number", desc: "Results per page (default: 20, max: 100)" },
    ],
    example: `curl "https://aiskillhub.info/api/v1/skills?industry=healthcare&difficulty=advanced&limit=5"`,
    response: `{
  "data": [
    {
      "id": "healthcare-medical-image-analysis",
      "name": "Medical Image Analysis",
      "description": "Automatically analyze X-rays, MRIs...",
      "industry": "healthcare",
      "difficulty": "advanced",
      "popularity": 94,
      "tags": ["radiology", "imaging", "diagnostics"]
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "pageSize": 5,
    "totalPages": 3,
    "hasNext": true
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/skills/:id",
    description: "Get a single skill with full details, file preview, and related skills",
    params: [{ name: "id", type: "string", desc: "Skill ID (e.g., healthcare-medical-image-analysis)" }],
    example: `curl "https://aiskillhub.info/api/v1/skills/healthcare-medical-image-analysis"`,
    response: `{
  "data": {
    "id": "healthcare-medical-image-analysis",
    "name": "Medical Image Analysis",
    "filePreview": "---\\nname: Medical Image Analysis\\n...",
    "related": [
      { "id": "healthcare-patient-triage-assistant", "name": "Patient Triage Assistant" }
    ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/workflows",
    description: "List and filter all AI workflows",
    params: [
      { name: "q", type: "string", desc: "Search query" },
      { name: "industry", type: "string", desc: "Filter by industry ID" },
      { name: "complexity", type: "string", desc: "Filter: simple, moderate, complex, enterprise" },
      { name: "sort", type: "string", desc: "Sort by: name, complexity, steps, time" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Results per page" },
    ],
    example: `curl "https://aiskillhub.info/api/v1/workflows?industry=finance&complexity=complex"`,
    response: `{
  "data": [...],
  "meta": { "total": 8, "page": 1, ... }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/industries",
    description: "List all industries with skill/workflow counts and top skills",
    params: [],
    example: `curl "https://aiskillhub.info/api/v1/industries"`,
    response: `{
  "data": [
    {
      "id": "healthcare",
      "name": "Healthcare & Medical",
      "skillCount": 15,
      "workflowCount": 8,
      "topSkills": [...]
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/search",
    description: "Universal search across skills, workflows, and industries",
    params: [{ name: "q", type: "string", desc: "Search query (required)" }],
    example: `curl "https://aiskillhub.info/api/v1/search?q=fraud%20detection"`,
    response: `{
  "data": {
    "skills": [...],
    "workflows": [...],
    "industries": [...]
  },
  "meta": { "query": "fraud detection", "totalSkills": 5 }
}`,
  },
];

export default function DocsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <Terminal className="h-4 w-4" />
            Developer API
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            API Documentation
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Access 420+ AI skills and 177+ workflows programmatically. Build AI-powered features into your applications.
          </p>
        </div>

        {/* Quick start */}
        <section className="mb-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Zap className="h-5 w-5 text-amber-500" />
            Quick Start
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The API is free to use with generous rate limits. No API key required for read-only access.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
            <code>{`# Search for healthcare AI skills
curl "https://aiskillhub.info/api/v1/skills?q=medical+imaging&industry=healthcare"

# Get a specific skill with file preview
curl "https://aiskillhub.info/api/v1/skills/healthcare-medical-image-analysis"

# Universal search
curl "https://aiskillhub.info/api/v1/search?q=fraud+detection"`}</code>
          </pre>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Code2 className="h-5 w-5 text-brand-500" />
            Base URL
          </h2>
          <code className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            https://aiskillhub.info/api/v1
          </code>
        </section>

        {/* Rate limits */}
        <section className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/40 dark:bg-amber-950/20">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <Key className="h-4 w-4" />
            Rate Limits
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Free tier: 100 requests/minute. Responses include <code className="text-xs">X-RateLimit-Limit</code> and <code className="text-xs">X-RateLimit-Remaining</code> headers.
            Need higher limits? <Link href="/enterprise" className="underline font-semibold">Contact us for enterprise access.</Link>
          </p>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <BookOpen className="h-6 w-6 text-brand-500" />
            Endpoints
          </h2>

          <div className="space-y-10">
            {ENDPOINTS.map((ep) => (
              <div
                key={ep.path}
                className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                      {ep.path}
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {ep.description}
                  </p>
                </div>

                {ep.params.length > 0 && (
                  <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Parameters</h4>
                    <div className="space-y-2">
                      {ep.params.map((p) => (
                        <div key={p.name} className="flex items-start gap-3 text-sm">
                          <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {p.name}
                          </code>
                          <span className="shrink-0 text-xs text-gray-400">{p.type}</span>
                          <span className="text-gray-600 dark:text-gray-400">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="px-6 py-4">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Example</h4>
                  <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs text-gray-100">
                    <code>{ep.example}</code>
                  </pre>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Response</h4>
                  <pre className="overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs text-gray-100">
                    <code>{ep.response}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center sm:p-12">
          <h2 className="mb-3 text-2xl font-extrabold text-white">
            Need More From the API?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-brand-100">
            Enterprise API access includes higher rate limits, webhook notifications, and priority support.
          </p>
          <Link
            href="/enterprise"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-gray-100"
          >
            Enterprise Plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
