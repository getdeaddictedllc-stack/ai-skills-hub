"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="pt-20 pb-8 text-center sm:pt-28 sm:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-600 ring-1 ring-brand-200/60 dark:bg-brand-950/50 dark:text-brand-400 dark:ring-brand-800/40 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          The comprehensive AI skills directory
        </span>
      </motion.div>

      <motion.h1
        className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl text-balance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        Discover AI Skills for{" "}
        <span className="gradient-text">Every Industry</span>
      </motion.h1>

      <motion.p
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400 text-balance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        Explore 500+ AI skills across 35+ industries. Find the right AI
        capabilities, workflows, and integrations to transform your business.
      </motion.p>
    </section>
  );
}
