import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/data/blog-posts";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Skills Blog - Guides, Tutorials & Industry Insights",
  description:
    "Expert guides on implementing AI across industries. Practical tutorials, best practices, and ROI analysis for AI-powered systems.",
  openGraph: {
    title: "AI Skills Blog | AI Skills Hub",
    description: "Expert guides on implementing AI across 35+ industries.",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
            <BookOpen className="h-4 w-4" />
            AI Skills Blog
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Guides, Tutorials &{" "}
            <span className="gradient-text">Industry Insights</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Practical guides for implementing AI in production. Written by engineers, for engineers.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-12 block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              Featured
            </span>
            <h2 className="mb-3 text-2xl font-extrabold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2">
              {featured.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {featured.readingTime}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium dark:bg-gray-800">
                {featured.category}
              </span>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <span className="mb-3 self-start rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {post.category}
              </span>
              <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 line-clamp-2">
                {post.title}
              </h3>
              <p className="mb-4 flex-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center sm:p-12">
          <h2 className="mb-3 text-2xl font-extrabold text-white">
            Get AI Implementation Guides in Your Inbox
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-brand-100">
            Weekly guides on implementing AI across industries. Practical, no fluff, written by engineers.
          </p>
          <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 rounded-lg border-0 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-gray-100"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
