import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        {icon ?? <SearchX className="h-8 w-8" />}
      </div>

      <h3 className="mb-1.5 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-500/25 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:hover:bg-brand-400 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
