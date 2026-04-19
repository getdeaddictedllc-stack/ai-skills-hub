"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function CTASection() {
  return (
    <motion.section
      className="py-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center shadow-xl sm:p-12">
        <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
          Ready to Supercharge Your AI Projects?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-brand-100">
          Get production-ready AI skills with system prompts, integration code,
          and deployment guides. Start building in minutes, not weeks.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-gray-100"
          >
            <Sparkles className="h-4 w-4" />
            Browse Skills
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Zap className="h-4 w-4" />
            Explore Workflows
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
