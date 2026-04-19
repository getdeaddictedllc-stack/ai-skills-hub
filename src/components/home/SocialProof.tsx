"use client";

import { motion } from "framer-motion";
import { Star, Quote, Users, Download, Building2 } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "VP Engineering, MediTech AI",
    industry: "Healthcare",
    quote:
      "The healthcare skill files saved our team weeks of prompt engineering. The system prompts are production-grade and the integration guides are thorough.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "AI Consultant, DataMinds LLC",
    industry: "Finance",
    quote:
      "I use AI Skills Hub for every client engagement. The workflow orchestration templates are worth 10x the price. My clients think I'm a genius.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Senior Developer, RetailFlow",
    industry: "Retail",
    quote:
      "Downloaded the retail bundle and had AI-powered product recommendations running in our staging environment within a day. Incredible value.",
    rating: 5,
  },
];

const STATS = [
  { icon: Users, value: "2,400+", label: "Developers" },
  { icon: Download, value: "12,000+", label: "Downloads" },
  { icon: Building2, value: "35", label: "Industries" },
  { icon: Star, value: "4.9/5", label: "Rating" },
];

export function SocialProof() {
  return (
    <section className="py-16">
      {/* Trust stats */}
      <motion.div
        className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <stat.icon className="mx-auto mb-2 h-6 w-6 text-brand-500" />
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Trusted by AI Teams Worldwide
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          See what developers and teams are saying
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={t.name}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Quote className="mb-3 h-6 w-6 text-brand-400" />
            <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {t.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
