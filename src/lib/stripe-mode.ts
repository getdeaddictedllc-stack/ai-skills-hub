export type StripeKeyMode = "live" | "test" | "unset";

/** Classify the configured Stripe secret key by prefix (no secret is exposed). */
export function getStripeKeyMode(): StripeKeyMode {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (key.startsWith("sk_live_")) return "live";
  if (key.startsWith("sk_test_")) return "test";
  return "unset";
}

/** True only on a Vercel production deployment. */
export function isProductionRuntime(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/**
 * Returns a human-readable warning when production is NOT wired to live Stripe
 * (test-mode key, or no key), otherwise null. Used to catch a misconfig before
 * it silently swallows real payments.
 */
export function prodStripeMisconfig(): string | null {
  if (!isProductionRuntime()) return null;
  const mode = getStripeKeyMode();
  if (mode === "live") return null;
  return mode === "test"
    ? "Production is using a TEST-mode Stripe key (sk_test_…). Real payments will not be processed."
    : "Production has no STRIPE_SECRET_KEY configured.";
}
