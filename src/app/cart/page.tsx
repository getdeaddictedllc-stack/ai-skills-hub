"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, clearCart, subtotal, savings, itemCount } =
    useCart();

  const skillCount = items.filter((i) => i.type === "skill").length;
  const workflowCount = items.filter((i) => i.type === "workflow").length;
  const bundleCount = items.filter((i) => i.type === "bundle").length;

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <ShoppingCart className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Your cart is empty
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Browse our AI skills and workflows to find the perfect tools for your
          needs.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            <Sparkles className="h-4 w-4" />
            Browse Skills
          </Link>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Zap className="h-4 w-4" />
            Browse Workflows
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Package className="h-4 w-4" />
            Industry Bundles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
              {skillCount > 0 && ` · ${skillCount} skill${skillCount !== 1 ? "s" : ""}`}
              {workflowCount > 0 && ` · ${workflowCount} workflow${workflowCount !== 1 ? "s" : ""}`}
              {bundleCount > 0 && ` · ${bundleCount} bundle${bundleCount !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear all
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    {/* Type badge */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${
                        item.type === "skill"
                          ? "bg-blue-500"
                          : item.type === "workflow"
                          ? "bg-purple-500"
                          : "bg-amber-500"
                      }`}
                    >
                      {item.type === "skill" ? (
                        <Sparkles className="h-5 w-5" />
                      ) : item.type === "workflow" ? (
                        <Zap className="h-5 w-5" />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={
                          item.type === "bundle"
                            ? `/industry/${item.industry}`
                            : `/${item.type}/${item.id}`
                        }
                        className="font-semibold text-gray-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{item.type}</span>
                        <span>·</span>
                        <span className="capitalize">{item.industry}</span>
                        {item.difficulty && (
                          <>
                            <span>·</span>
                            <span className="capitalize">{item.difficulty}</span>
                          </>
                        )}
                        {item.complexity && (
                          <>
                            <span>·</span>
                            <span className="capitalize">{item.complexity}</span>
                          </>
                        )}
                        {item.skillCount !== undefined && (
                          <>
                            <span>·</span>
                            <span>
                              {item.skillCount} skills, {item.workflowCount} workflows
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6">
              <Link
                href="/skills"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      Bundle savings
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -${savings.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
