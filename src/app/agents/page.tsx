import type { Metadata } from "next";
import Link from "next/link";
import { getAllAgents } from "@/data/agents";
import { Bot, ArrowRight, Sparkles, Shield, Zap, Star } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents Marketplace - Deploy Production-Ready AI Agents",
  description:
    "Browse and deploy 12+ production-ready AI agents. Each agent includes system prompts, tools, memory config, and deployment guides. Healthcare, Finance, Legal, and more.",
};

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Bot;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  expert: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AgentsPage() {
  const agents = getAllAgents();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <Bot className="h-4 w-4" />
            AI Agents
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Production-Ready{" "}
            <span className="gradient-text">AI Agents</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Deploy intelligent agents that think, use tools, and take action. Each agent comes with system prompts,
            tool definitions, memory configuration, and deployment guides.
          </p>
        </div>

        {/* Value props */}
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Sparkles, title: "Production-Grade Prompts", desc: "Battle-tested system prompts with safety guardrails and error handling" },
            { icon: Zap, title: "Tool Definitions Included", desc: "Pre-built tool schemas with example inputs/outputs ready to wire up" },
            { icon: Shield, title: "Deploy Anywhere", desc: "API, SDK, MCP, webhook, or embed — deploy however you need" },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <v.icon className="mb-3 h-6 w-6 text-brand-500" />
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Agent grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const Icon = getIcon(agent.avatar);
            return (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-700"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{(agent.popularity / 20).toFixed(1)}</span>
                  </div>
                </div>

                {/* Name & desc */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                  {agent.name}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {agent.description}
                </p>

                {/* Badges */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${DIFFICULTY_COLORS[agent.difficulty]}`}>
                    {agent.difficulty}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {agent.industry}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {agent.tools.length} tools
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                    ${agent.price.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all dark:text-brand-400">
                    View Agent <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-purple-600 to-brand-700 p-8 text-center sm:p-12">
          <h2 className="mb-3 text-3xl font-extrabold text-white">
            Need a Custom Agent?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-lg text-purple-100">
            We build custom AI agents tailored to your specific workflows and integrations.
          </p>
          <Link
            href="/enterprise"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-gray-100"
          >
            Contact Enterprise Sales <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
