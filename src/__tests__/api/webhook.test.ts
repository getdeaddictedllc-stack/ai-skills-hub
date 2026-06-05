/**
 * @jest-environment node
 *
 * Regression guard for the Stripe webhook -> entitlement-activation flow.
 * If the webhook stops granting entitlements on checkout.session.completed,
 * the "grants entitlements" test fails.
 */
import { createHmac } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const SECRET = "whsec_test_secret_for_signing";

function sign(body: string, secret = SECRET, timestamp = Math.floor(Date.now() / 1000)): string {
  const sig = createHmac("sha256", secret).update(`${timestamp}.${body}`, "utf8").digest("hex");
  return `t=${timestamp},v1=${sig}`;
}

function completedEvent(opts: {
  sessionId: string;
  email: string;
  itemIds: string[];
}): string {
  return JSON.stringify({
    type: "checkout.session.completed",
    data: {
      object: {
        id: opts.sessionId,
        customer_email: opts.email,
        amount_total: 9900,
        metadata: { item_ids: opts.itemIds.join(",") },
      },
    },
  });
}

function post(body: string, signature?: string | null) {
  const headers: Record<string, string> = {};
  if (signature) headers["stripe-signature"] = signature;
  return new Request("http://localhost/api/webhook", { method: "POST", body, headers });
}

let tmp: string;

beforeAll(() => {
  tmp = mkdtempSync(path.join(tmpdir(), "ent-"));
  process.env.ENTITLEMENTS_FILE = path.join(tmp, "entitlements.jsonl");
  process.env.STRIPE_WEBHOOK_SECRET = SECRET;
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
});

afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

// Dynamic import so the route module captures the env we set above.
async function loadRoute() {
  return import("@/app/api/webhook/route");
}
async function loadEntitlements() {
  return import("@/lib/entitlements");
}

test("grants entitlements on a signed checkout.session.completed", async () => {
  const { POST } = await loadRoute();
  const { hasEntitlement } = await loadEntitlements();

  const body = completedEvent({
    sessionId: "cs_grant_1",
    email: "Buyer@Example.com",
    itemIds: ["healthcare-patient-triage-assistant", "marketing-seo-content-writer"],
  });

  const res = await POST(post(body, sign(body)) as never);
  expect(res.status).toBe(200);
  await expect(res.json()).resolves.toEqual({ received: true });

  // The core guarantee: access is actually granted (case-insensitive email).
  await expect(hasEntitlement("buyer@example.com", "healthcare-patient-triage-assistant")).resolves.toBe(true);
  await expect(hasEntitlement("buyer@example.com", "marketing-seo-content-writer")).resolves.toBe(true);
  await expect(hasEntitlement("buyer@example.com", "something-not-purchased")).resolves.toBe(false);
});

test("rejects an invalid signature and grants nothing", async () => {
  const { POST } = await loadRoute();
  const { hasEntitlement } = await loadEntitlements();

  const body = completedEvent({
    sessionId: "cs_bad_sig",
    email: "evil@example.com",
    itemIds: ["healthcare-patient-triage-assistant"],
  });

  const res = await POST(post(body, "t=9999999999,v1=deadbeef") as never);
  expect(res.status).toBe(400);
  await expect(hasEntitlement("evil@example.com", "healthcare-patient-triage-assistant")).resolves.toBe(false);
});

test("is idempotent across at-least-once redelivery of the same session", async () => {
  const { POST } = await loadRoute();
  const { getEntitlements } = await loadEntitlements();

  const body = completedEvent({
    sessionId: "cs_replay",
    email: "replay@example.com",
    itemIds: ["data-science-feature-pipeline"],
  });

  await POST(post(body, sign(body)) as never);
  await POST(post(body, sign(body)) as never); // Stripe redelivers

  const owned = await getEntitlements("replay@example.com");
  expect(owned.filter((id) => id === "data-science-feature-pipeline")).toHaveLength(1);
});

test("returns 500 when the webhook secret is not configured", async () => {
  const saved = process.env.STRIPE_WEBHOOK_SECRET;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  jest.resetModules();
  const { POST } = await loadRoute();

  const res = await POST(post("{}", "t=1,v1=x") as never);
  expect(res.status).toBe(500);

  process.env.STRIPE_WEBHOOK_SECRET = saved;
  jest.resetModules();
});
