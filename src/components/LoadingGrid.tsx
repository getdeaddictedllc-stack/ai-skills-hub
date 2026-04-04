import { cn } from "@/lib/utils";

interface LoadingGridProps {
  count?: number;
  variant?: "skill" | "workflow" | "industry";
  className?: string;
}

function SkillSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200/50 bg-white/60 p-5 dark:border-gray-700/50 dark:bg-gray-900/60">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="h-5 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      {/* Description */}
      <div className="mb-4 space-y-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-auto" />
      {/* Industry tag */}
      <div className="mb-3">
        <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

function WorkflowSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200/50 bg-white/60 p-5 dark:border-gray-700/50 dark:bg-gray-900/60">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      {/* Description */}
      <div className="mb-4 space-y-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3.5 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-auto" />
      {/* Steps */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  );
}

function IndustrySkeleton() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200/50 bg-white/60 p-6 text-center dark:border-gray-700/50 dark:bg-gray-900/60">
      <div className="mb-4 h-14 w-14 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
      <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mb-3 space-y-1.5 w-full">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-4/5 mx-auto animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-4 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

const skeletonMap = {
  skill: SkillSkeleton,
  workflow: WorkflowSkeleton,
  industry: IndustrySkeleton,
};

const gridClasses = {
  skill: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  workflow: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  industry: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
};

export default function LoadingGrid({
  count = 6,
  variant = "skill",
  className,
}: LoadingGridProps) {
  const Skeleton = skeletonMap[variant];

  return (
    <div className={cn(gridClasses[variant], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
