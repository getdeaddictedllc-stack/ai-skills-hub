import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Industries", href: "/industries" },
    { label: "Skills", href: "/skills" },
    { label: "Workflows", href: "/workflows" },
  ],
  Resources: [
    { label: "Getting Started", href: "/" },
    { label: "API Reference", href: "/" },
    { label: "Documentation", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                AI Skills Hub
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Discover the right AI skills and workflows for every industry.
              Your comprehensive guide to AI capabilities.
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-500">
              <Sparkles className="h-3 w-3" />
              Built with AI
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-200/60 dark:border-gray-800/60 py-6 sm:flex-row">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} AI Skills Hub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Exploring AI across 35+ industries
          </p>
        </div>
      </div>
    </footer>
  );
}
