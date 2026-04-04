"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-red-500/5 blur-3xl dark:bg-red-500/10" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40">
          <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>

        {/* Glass card */}
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Something Went Wrong
          </h1>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            An unexpected error occurred. You can try again or return to the
            home page.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
