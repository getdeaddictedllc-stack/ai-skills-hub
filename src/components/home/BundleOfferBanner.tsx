"use client";

import { motion } from "framer-motion";
import { ArrowRight, Package, Sparkles } from "lucide-react";
import { trackEvent } from "@/components/GoogleAnalytics";

const PAYMENT_LINK_URL = process.env.NEXT_PUBLIC_PAYMENT_LINK_URL;
const BUNDLE_PRICE = process.env.NEXT_PUBLIC_BUNDLE_PRICE ?? "99";
const BUNDLE_REGULAR_PRICE = process.env.NEXT_PUBLIC_BUNDLE_REGULAR_PRICE ?? "299";

export function BundleOfferBanner() {
  if (!PAYMENT_LINK_URL) return null;

  const handleClick = () => {
    trackEvent("bundle_cta_click", "bundle", "hero_banner", Number(BUNDLE_PRICE));
  };

  return (
    <motion.section
      className="pb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm dark:border-amber-800/40 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                <Sparkles className="h-3 w-3" /> Launch special
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Complete AI Skills Bundle &mdash;{" "}
                <span className="text-amber-600 dark:text-amber-400">${BUNDLE_PRICE}</span>
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Every skill, every workflow, every industry.{" "}
                <span className="line-through opacity-70">${BUNDLE_REGULAR_PRICE}</span> regular price. Lifetime access. Instant download.
              </p>
            </div>
          </div>
          <a
            href={PAYMENT_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Get the bundle
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
