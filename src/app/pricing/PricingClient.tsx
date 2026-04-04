"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Sparkles, Zap, Check, ArrowRight, TrendingUp, Shield, Headphones,
} from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import AddToCartButton from "@/components/AddToCartButton";
import type { IndustryBundle } from "./page";

const SKILL_TIERS = [
  { level: "Beginner", price: "$4.99", color: "text-green-600", desc: "Get started with foundational AI skills" },
  { level: "Intermediate", price: "$9.99", color: "text-yellow-600", desc: "Build on core knowledge with practical skills" },
  { level: "Advanced", price: "$14.99", color: "text-orange-600", desc: "Master complex AI implementations" },
  { level: "Expert", price: "$19.99", color: "text-red-600", desc: "Enterprise-grade AI system expertise" },
];

const WORKFLOW_TIERS = [
  { level: "Simple", price: "$9.99", color: "text-green-600", desc: "Straightforward 2-3 step automations" },
  { level: "Moderate", price: "$19.99", color: "text-blue-600", desc: "Multi-step pipelines with validation" },
  { level: "Complex", price: "$29.99", color: "text-orange-600", desc: "Advanced orchestration with error handling" },
  { level: "Enterprise", price: "$49.99", color: "text-purple-600", desc: "Production-ready enterprise workflows" },
];

export function PricingClient({ bundles }: { bundles: IndustryBundle[] }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Purchase individual AI skills and workflows, or save up to 40% with industry bundles. One-time purchase, lifetime access.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Shield, title: "Lifetime Access", desc: "Buy once, use forever. No subscriptions or recurring fees." },
            { icon: TrendingUp, title: "Free Updates", desc: "All future updates to purchased skills included at no extra cost." },
            { icon: Headphones, title: "Priority Support", desc: "Get help with implementation and customization." },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <feature.icon className="mx-auto mb-3 h-8 w-8 text-brand-500" />
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Individual Skills</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price based on difficulty level</p>
              </div>
            </div>
            <div className="space-y-4">
              {SKILL_TIERS.map((tier) => (
                <div key={tier.level} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                  <div>
                    <p className={`font-semibold ${tier.color}`}>{tier.level}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tier.desc}</p>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{tier.price}</span>
                </div>
              ))}
            </div>
            <Link href="/skills" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-300 dark:hover:bg-brand-950/50 transition-colors">
              Browse Skills <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 space-y-2">
              {["Complete system prompt", "Model configuration & tuning", "Integration code examples", "Error handling & retry logic", "Security & compliance guide", "Monitoring metrics template"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Check className="h-4 w-4 shrink-0 text-green-500" />{f}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Individual Workflows</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price based on complexity level</p>
              </div>
            </div>
            <div className="space-y-4">
              {WORKFLOW_TIERS.map((tier) => (
                <div key={tier.level} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                  <div>
                    <p className={`font-semibold ${tier.color}`}>{tier.level}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tier.desc}</p>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{tier.price}</span>
                </div>
              ))}
            </div>
            <Link href="/workflows" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-950/50 transition-colors">
              Browse Workflows <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 space-y-2">
              {["Step-by-step system prompts", "Python orchestration code", "Data flow diagrams", "Error handling strategy", "Deployment & monitoring guide", "Security & compliance checklist"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Check className="h-4 w-4 shrink-0 text-green-500" />{f}</div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Package className="h-4 w-4" /> Save 40% with Industry Bundles
            </div>
            <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">Industry Bundles</h2>
            <p className="text-gray-600 dark:text-gray-400">Get every skill and workflow in an industry at a massive discount.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle, idx) => (
              <motion.div key={bundle.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{bundle.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{bundle.skillCount} skills · {bundle.workflowCount} workflows</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">-40%</span>
                </div>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatPrice(bundle.bundlePrice)}</span>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(bundle.originalPrice)}</span>
                </div>
                <div className="mt-auto">
                  <AddToCartButton
                    item={{ id: `bundle-${bundle.id}`, type: "bundle", name: `${bundle.name} Bundle`, price: bundle.bundlePrice, originalPrice: bundle.originalPrice, industry: bundle.id, category: "Industry Bundle", skillCount: bundle.skillCount, workflowCount: bundle.workflowCount }}
                    size="md" showPrice={false} className="w-full justify-center"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="mx-auto max-w-3xl space-y-6">
            {[
              { q: "What do I get when I purchase a skill?", a: "You receive a comprehensive skill file (.md) with YAML frontmatter, a production-ready system prompt, model configuration, integration code examples, error handling patterns, security guidelines, and monitoring templates." },
              { q: "What's included in a workflow purchase?", a: "Workflow files include step-by-step system prompts, a complete Python orchestration template, data flow diagrams, error handling strategies, deployment guides, and monitoring dashboards." },
              { q: "What's in an industry bundle?", a: "An industry bundle includes every skill and workflow in that industry at a 40% discount. It's the most cost-effective way to get comprehensive AI coverage for your sector." },
              { q: "Is this a subscription?", a: "No. All purchases are one-time payments with lifetime access. You also get free updates to any skills or workflows you've purchased." },
              { q: "Can I get a refund?", a: "Yes, we offer a 30-day money-back guarantee. If a skill or workflow doesn't meet your expectations, contact us for a full refund." },
              { q: "Can I use these commercially?", a: "Yes. All purchased skills and workflows are licensed for commercial use in your projects, products, and client work." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
