"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles, ArrowRight, ArrowLeft, RotateCcw, CheckCircle,
  Building2, Target, Gauge, Wrench, Brain,
} from "lucide-react";
import { getAllIndustries, searchSkills, getPopularSkills, getAllWorkflows } from "@/lib/data-service";
import SkillCard from "@/components/SkillCard";
import WorkflowCard from "@/components/WorkflowCard";
import type { Skill, Workflow } from "@/lib/types";

type Step = "industry" | "goal" | "level" | "integration" | "results";

const GOALS = [
  { id: "automate", label: "Automate Repetitive Tasks", icon: Wrench, keywords: "automation process" },
  { id: "analyze", label: "Analyze Data & Get Insights", icon: Brain, keywords: "analysis analytics insights" },
  { id: "generate", label: "Generate Content & Documents", icon: Sparkles, keywords: "generation content creation" },
  { id: "detect", label: "Detect Anomalies & Risks", icon: Target, keywords: "detection monitoring risk" },
  { id: "optimize", label: "Optimize Operations & Costs", icon: Gauge, keywords: "optimization efficiency" },
];

const LEVELS = [
  { id: "beginner", label: "Just Getting Started", desc: "I'm new to AI implementation" },
  { id: "intermediate", label: "Some Experience", desc: "I've built basic AI features" },
  { id: "advanced", label: "Experienced", desc: "I've deployed AI systems in production" },
  { id: "expert", label: "Expert", desc: "I architect enterprise AI systems" },
];

const INTEGRATIONS = [
  { id: "api", label: "REST API" },
  { id: "sdk", label: "SDK / Library" },
  { id: "webhook", label: "Webhooks" },
  { id: "mcp", label: "MCP (Model Context Protocol)" },
  { id: "function-calling", label: "Function Calling" },
  { id: "standalone", label: "Standalone / No Integration" },
];

export default function RecommendPage() {
  const [step, setStep] = useState<Step>("industry");
  const [industry, setIndustry] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [integrations, setIntegrations] = useState<string[]>([]);

  const allIndustries = useMemo(() => getAllIndustries(), []);
  const allWorkflows = useMemo(() => getAllWorkflows(), []);

  const steps: Step[] = ["industry", "goal", "level", "integration", "results"];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  const recommendedSkills: Skill[] = useMemo(() => {
    if (step !== "results") return [];
    const goalObj = GOALS.find((g) => g.id === goal);
    const query = goalObj?.keywords ?? "";
    let results = searchSkills(query, {
      industry: industry || undefined,
      difficulty: level ? [level as Skill["difficulty"]] : undefined,
      integrationTypes: integrations.length
        ? (integrations as Skill["integrationTypes"][number][])
        : undefined,
    });
    if (results.length < 6) {
      const popular = getPopularSkills(20).filter(
        (s) => !results.some((r) => r.id === s.id) && (!industry || s.industry === industry)
      );
      results = [...results, ...popular].slice(0, 12);
    }
    return results.slice(0, 12);
  }, [step, industry, goal, level, integrations]);

  const recommendedWorkflows: Workflow[] = useMemo(() => {
    if (step !== "results") return [];
    return allWorkflows
      .filter((w) => !industry || w.industry === industry)
      .slice(0, 6);
  }, [step, industry, allWorkflows]);

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const reset = () => {
    setStep("industry");
    setIndustry("");
    setGoal("");
    setLevel("");
    setIntegrations([]);
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {step !== "results" && (
          <>
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Sparkles className="h-4 w-4" />
                AI Skill Finder
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Get Personalized Recommendations
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Answer {steps.length - 1} quick questions to find the perfect AI skills for your needs
              </p>
            </div>

            {/* Progress bar */}
            <div className="mx-auto mb-10 max-w-md">
              <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                <span>Step {currentIndex + 1} of {steps.length - 1}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-brand-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {step === "industry" && (
            <motion.div key="industry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
                <Building2 className="mr-2 inline h-5 w-5" />
                What industry are you in?
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {allIndustries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => { setIndustry(ind.id); goNext(); }}
                    className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                      industry === ind.id
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                        : "border-gray-200 bg-white hover:border-brand-300 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{ind.name}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{ind.skillCount} skills</p>
                  </button>
                ))}
              </div>
              <button onClick={goNext} className="mx-auto mt-6 flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">
                Skip — show me everything <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === "goal" && (
            <motion.div key="goal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
                <Target className="mr-2 inline h-5 w-5" />
                What do you want to achieve?
              </h2>
              <div className="mx-auto max-w-lg space-y-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { setGoal(g.id); goNext(); }}
                    className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  >
                    <g.icon className="h-6 w-6 shrink-0 text-brand-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{g.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "level" && (
            <motion.div key="level" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
                <Gauge className="mr-2 inline h-5 w-5" />
                What's your experience level?
              </h2>
              <div className="mx-auto max-w-lg space-y-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLevel(l.id); goNext(); }}
                    className="flex w-full flex-col rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{l.label}</span>
                    <span className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{l.desc}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "integration" && (
            <motion.div key="integration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
                <Wrench className="mr-2 inline h-5 w-5" />
                How will you integrate? (select any)
              </h2>
              <div className="mx-auto max-w-lg space-y-3">
                {INTEGRATIONS.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setIntegrations((prev) =>
                      prev.includes(i.id) ? prev.filter((x) => x !== i.id) : [...prev, i.id]
                    )}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      integrations.includes(i.id)
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                        : "border-gray-200 bg-white hover:border-brand-300 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {integrations.includes(i.id) ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-brand-500" />
                    ) : (
                      <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">{i.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Get Recommendations <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                    Your Recommended AI Skills
                  </h1>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {recommendedSkills.length} skills and {recommendedWorkflows.length} workflows matched your criteria
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start Over
                </button>
              </div>

              {recommendedSkills.length > 0 && (
                <section className="mb-12">
                  <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Skills</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendedSkills.map((skill) => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </section>
              )}

              {recommendedWorkflows.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Workflows</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendedWorkflows.map((wf) => (
                      <WorkflowCard key={wf.id} workflow={wf} />
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center dark:border-brand-800 dark:bg-brand-950/30">
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  Want the full picture?
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Browse all 420+ skills and 177+ workflows across 35 industries.
                </p>
                <Link
                  href="/skills"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Browse All Skills <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
