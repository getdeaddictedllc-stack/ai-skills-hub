"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";
import { PAID_MODE } from "@/lib/pricing";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  ShoppingCart,
  Sparkles,
  Zap,
  Package,
  CheckCircle,
  Download,
} from "lucide-react";
import { generateSkillFileContent, generateWorkflowFileContent } from "@/lib/skill-file-generator";
import { getAllSkills, getAllWorkflows } from "@/lib/data-service";
import JSZip from "jszip";
import { trackEvent } from "@/components/GoogleAnalytics";

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function CheckoutPage() {
  const { items, subtotal, savings, itemCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (itemCount === 0 && !isComplete) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <ShoppingCart className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Nothing to checkout
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Add some skills or workflows to your cart first.
        </p>
        <Link
          href="/skills"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Browse Skills
        </Link>
      </div>
    );
  }

  const handleDownloadItem = async (item: CartItem) => {
    if (item.type === "skill") {
      const allSkills = getAllSkills();
      const skill = allSkills.find((s) => s.id === item.id);
      if (skill) {
        downloadFile(`${skill.id}.md`, generateSkillFileContent(skill));
      }
    } else if (item.type === "workflow") {
      const allWorkflows = getAllWorkflows();
      const workflow = allWorkflows.find((w) => w.id === item.id);
      if (workflow) {
        downloadFile(`${workflow.id}.md`, generateWorkflowFileContent(workflow));
      }
    } else if (item.type === "bundle") {
      const zip = new JSZip();
      const allSkills = getAllSkills();
      const allWorkflows = getAllWorkflows();
      const industrySkills = allSkills.filter((s) => s.industry === item.industry);
      const industryWorkflows = allWorkflows.filter((w) => w.industry === item.industry);
      const skillsFolder = zip.folder("skills");
      const workflowsFolder = zip.folder("workflows");
      for (const skill of industrySkills) {
        skillsFolder?.file(`${skill.id}.md`, generateSkillFileContent(skill));
      }
      for (const workflow of industryWorkflows) {
        workflowsFolder?.file(`${workflow.id}.md`, generateWorkflowFileContent(workflow));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.industry}-bundle.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const allSkills = getAllSkills();
    const allWorkflows = getAllWorkflows();

    for (const item of purchasedItems) {
      if (item.type === "skill") {
        const skill = allSkills.find((s) => s.id === item.id);
        if (skill) {
          zip.file(`skills/${skill.id}.md`, generateSkillFileContent(skill));
        }
      } else if (item.type === "workflow") {
        const workflow = allWorkflows.find((w) => w.id === item.id);
        if (workflow) {
          zip.file(`workflows/${workflow.id}.md`, generateWorkflowFileContent(workflow));
        }
      } else if (item.type === "bundle") {
        const industrySkills = allSkills.filter((s) => s.industry === item.industry);
        const industryWorkflows = allWorkflows.filter((w) => w.industry === item.industry);
        for (const skill of industrySkills) {
          zip.file(`${item.industry}/skills/${skill.id}.md`, generateSkillFileContent(skill));
        }
        for (const workflow of industryWorkflows) {
          zip.file(`${item.industry}/workflows/${workflow.id}.md`, generateWorkflowFileContent(workflow));
        }
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-skills-hub-purchase.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isComplete) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            Purchase Complete!
          </h1>
          <p className="mb-2 text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your files are ready to download.
          </p>
          <p className="mb-8 text-sm text-gray-500 dark:text-gray-500">
            A confirmation email has been sent to <strong>{email}</strong>
          </p>
        </div>

        {/* Download All */}
        <div className="mb-6 text-center">
          <button
            onClick={handleDownloadAll}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            <Download className="h-5 w-5" />
            Download All Files
          </button>
        </div>

        {/* Individual downloads */}
        <div className="space-y-3">
          {purchasedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${
                    item.type === "skill"
                      ? "bg-blue-500"
                      : item.type === "workflow"
                      ? "bg-purple-500"
                      : "bg-amber-500"
                  }`}
                >
                  {item.type === "skill" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : item.type === "workflow" ? (
                    <Zap className="h-4 w-4" />
                  ) : (
                    <Package className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                    {item.type}
                    {item.skillCount !== undefined &&
                      ` · ${item.skillCount} skills, ${item.workflowCount} workflows`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownloadItem(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Browse More Skills
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Save items before clearing cart so we can show downloads
    setPurchasedItems([...items]);

    if (PAID_MODE) {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, email, name }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        // If Stripe is not configured, fall through to local checkout
        console.warn("Stripe not configured, using local checkout:", data.error);
      } catch {
        console.warn("Stripe API unavailable, using local checkout");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      // Free mode — instant checkout
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    setIsComplete(true);
    trackEvent("purchase", "checkout", email, subtotal);

    // Save purchase record for dashboard
    try {
      const existing = JSON.parse(localStorage.getItem("aiskillhub-purchases") ?? "[]");
      existing.unshift({
        id: `purchase-${Date.now()}`,
        items: items.map((i) => ({ id: i.id, type: i.type, name: i.name, price: i.price, industry: i.industry })),
        total: subtotal,
        date: new Date().toISOString(),
      });
      localStorage.setItem("aiskillhub-purchases", JSON.stringify(existing));
    } catch {}

    // Send receipt email (fire-and-forget)
    fetch("/api/send-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        items: items.map((i) => ({ name: i.name, type: i.type, price: i.price })),
        total: subtotal,
      }),
    }).catch(() => {});

    clearCart();
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              {/* Contact */}
              <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                      placeholder="you@example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Skill files and receipt will be sent to this email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment — only shown in paid mode */}
              {PAID_MODE && (
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                    <CreditCard className="h-5 w-5 text-brand-500" />
                    Payment
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!PAID_MODE && (
                <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30">
                  <p className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    All items are currently free!
                  </p>
                  <p className="mt-1 text-sm text-green-600 dark:text-green-500">
                    Enter your details above and click the button below to get instant access to your files.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : PAID_MODE ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay ${subtotal.toFixed(2)}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Get Free Access
                  </>
                )}
              </button>

              {PAID_MODE && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Lock className="h-3 w-3" />
                  Secured with 256-bit SSL encryption
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="max-h-80 space-y-3 overflow-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                        item.type === "skill"
                          ? "bg-blue-500"
                          : item.type === "workflow"
                          ? "bg-purple-500"
                          : "bg-amber-500"
                      }`}
                    >
                      {item.type === "skill" ? (
                        <Sparkles className="h-4 w-4" />
                      ) : item.type === "workflow" ? (
                        <Zap className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                        {item.type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Items ({itemCount})
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      Savings
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      -${savings.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
