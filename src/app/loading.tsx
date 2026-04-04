export default function Loading() {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-500" />
        </div>

        {/* Skeleton cards */}
        <div className="w-full max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-gray-200/50 bg-white/60 p-5 dark:border-gray-700/50 dark:bg-gray-900/60"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="h-5 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="mb-4 space-y-2">
                  <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="mt-auto" />
                <div className="mb-3">
                  <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
