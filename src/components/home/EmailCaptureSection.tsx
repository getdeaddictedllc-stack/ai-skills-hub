"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { trackEvent } from "@/components/GoogleAnalytics";

type Status = "idle" | "submitting" | "success" | "error";

export function EmailCaptureSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage_email_capture" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Something went wrong. Try again.");
        return;
      }
      trackEvent("lead_capture", "email", "homepage");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    }
  }

  return (
    <motion.section
      className="py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-10">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40">
            <Mail className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Get new skills in your inbox
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              One email per week with the latest AI skills, workflows, and launch
              discounts. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {status === "success" ? (
          <div className="space-y-3">
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
            >
              <CheckCircle2 className="h-5 w-5" />
              You&apos;re on the list. Keep an eye on your inbox.
            </div>
            <a
              href="/skills"
              onClick={() => trackEvent("post_signup_browse", "lead", "homepage")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Start browsing production-ready skills
              <span aria-hidden>→</span>
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              autoComplete="email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              disabled={status === "submitting"}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Joining
                </>
              ) : (
                "Join the list"
              )}
            </button>
          </form>
        )}

        {status === "error" && errorMsg && (
          <p
            role="alert"
            className="mt-3 text-sm text-red-600 dark:text-red-400"
          >
            {errorMsg}
          </p>
        )}
      </div>
    </motion.section>
  );
}
