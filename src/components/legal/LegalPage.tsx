import type { ReactNode } from "react";

export const LEGAL_CONTACT = "p40493438@gmail.com";
export const LEGAL_UPDATED = "October 29, 2026";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated {LEGAL_UPDATED}</p>
      <div className="mt-10 space-y-8 text-base leading-7 text-gray-700 dark:text-gray-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_a]:font-medium [&_a]:text-brand-500 [&_a]:underline">
        {children}
      </div>
    </main>
  );
}
