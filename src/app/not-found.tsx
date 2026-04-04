import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 text-center">
        {/* 404 number */}
        <div className="mb-6">
          <span className="text-8xl font-extrabold tracking-tighter gradient-text sm:text-9xl">
            404
          </span>
        </div>

        {/* Glass card */}
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            The page you are looking for does not exist or has been moved.
            Try searching for what you need or head back home.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Search className="h-4 w-4" />
              Search Skills
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
