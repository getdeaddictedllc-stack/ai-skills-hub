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
  paymentIntent?: string;
}): string {
  return JSON.stringify({
    type: "checkout.session.completed",
    data: {
      object: {
        id: opts.sessionId,
        customer_email: opts.email,
        amount_total: 9900,
        payment_intent: opts.paymentIntent,
        metadata: { item_ids: opts.itemIds.join(",") },
      },
    },
  });
}

function refundEvent(opts: { chargeId: string; paymentIntent: string; type?: string }): string {
  return JSON.stringify({
    type: opts.type ?? "charge.refunded",
    data: {
      object: {
        id: opts.chargeId,
        payment_intent: opts.paymentIntent,
        amount_refunded: 9900,
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

test("a forged refund event cannot revoke an existing entitlement", async () => {
  const { POST } = await loadRoute();
  const { hasEntitlement } = await loadEntitlements();

  // Grant legitimately first.
  const grant = completedEvent({
    sessionId: "cs_forge_refund",
    email: "owner@example.com",
    itemIds: ["data-science-feature-pipeline"],
    paymentIntent: "pi_forge_1",
  });
  await POST(post(grant, sign(grant)) as never);
  await expect(hasEntitlement("owner@example.com", "data-science-feature-pipeline")).resolves.toBe(true);

  // Forged refund (bad signature) must be rejected and revoke nothing.
  const refund = refundEvent({ chargeId: "ch_forge", paymentIntent: "pi_forge_1" });
  const res = await POST(post(refund, "t=9999999999,v1=deadbeef") as never);
  expect(res.status).toBe(400);
  await expect(hasEntitlement("owner@example.com", "data-science-feature-pipeline")).resolves.toBe(true);
});

test("a signed refund revokes entitlements and redelivery is idempotent", async () => {
  const { POST } = await loadRoute();
  const { hasEntitlement } = await loadEntitlements();

  const grant = completedEvent({
    sessionId: "cs_real_refund",
    email: "refundme@example.com",
    itemIds: ["marketing-seo-content-writer", "marketing-ad-copy-generator"],
    paymentIntent: "pi_refund_1",
  });
  await POST(post(grant, sign(grant)) as never);
  await expect(hasEntitlement("refundme@example.com", "marketing-seo-content-writer")).resolves.toBe(true);

  const refund = refundEvent({ chargeId: "ch_real", paymentIntent: "pi_refund_1" });
  const first = await POST(post(refund, sign(refund)) as never);
  expect(first.status).toBe(200);
  await expect(hasEntitlement("refundme@example.com", "marketing-seo-content-writer")).resolves.toBe(false);
  await expect(hasEntitlement("refundme@example.com", "marketing-ad-copy-generator")).resolves.toBe(false);

  // Redelivery of the same refund is a safe no-op.
  const second = await POST(post(refund, sign(refund)) as never);
  expect(second.status).toBe(200);
  await expect(hasEntitlement("refundme@example.com", "marketing-seo-content-writer")).resolves.toBe(false);
});

function alertSubjects(fetchMock: jest.Mock): string[] {
  return fetchMock.mock.calls
    .filter(([url]) => String(url).includes("api.resend.com"))
    .map(([, opts]) => JSON.parse((opts as { body: string }).body).subject as string);
}

test("alerts the owner on the first real payment so a dead webhook is caught", async () => {
  const { POST } = await loadRoute();

  const savedFile = process.env.ENTITLEMENTS_FILE;
  const savedFetch = global.fetch;
  const fresh = mkdtempSync(path.join(tmpdir(), "ent-first-"));
  process.env.ENTITLEMENTS_FILE = path.join(fresh, "e.jsonl"); // empty store => "first"
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.OWNER_ALERT_EMAIL = "owner@aiskillhub.info";
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  global.fetch = fetchMock as never;

  try {
    const body = completedEvent({
      sessionId: "cs_alert_1",
      email: "firstbuyer@example.com",
      itemIds: ["data-science-feature-pipeline"],
      paymentIntent: "pi_alert_1",
    });
    const res = await POST(post(body, sign(body)) as never);
    expect(res.status).toBe(200);

    const subjects = alertSubjects(fetchMock);
    expect(subjects.some((s) => /FIRST real payment/.test(s))).toBe(true);
  } finally {
    global.fetch = savedFetch;
    delete process.env.RESEND_API_KEY;
    delete process.env.OWNER_ALERT_EMAIL;
    process.env.ENTITLEMENTS_FILE = savedFile;
    rmSync(fresh, { recursive: true, force: true });
  }
});

test("alerts the owner when a test-mode event reaches production", async () => {
  const { POST } = await loadRoute();

  const savedEnv = process.env.VERCEL_ENV;
  const savedFetch = global.fetch;
  process.env.VERCEL_ENV = "production";
  process.env.RESEND_API_KEY = "re_test_key";
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  global.fetch = fetchMock as never;

  try {
    const body = JSON.stringify({
      type: "checkout.session.completed",
      livemode: false, // misconfig: test-mode event on a production deploy
      data: {
        object: {
          id: "cs_misconfig",
          customer_email: "buyer@example.com",
          amount_total: 9900,
          payment_intent: "pi_misconfig",
          metadata: { item_ids: "data-science-feature-pipeline" },
        },
      },
    });
    const res = await POST(post(body, sign(body)) as never);
    expect(res.status).toBe(200);

    const subjects = alertSubjects(fetchMock);
    expect(subjects.some((s) => /MISCONFIG/.test(s))).toBe(true);
  } finally {
    global.fetch = savedFetch;
    process.env.VERCEL_ENV = savedEnv;
    delete process.env.RESEND_API_KEY;
  }
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
