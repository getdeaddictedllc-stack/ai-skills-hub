import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { grantEntitlements, revokeByPaymentIntent } from "@/lib/entitlements";

export const runtime = "nodejs";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Reject events whose signature timestamp is older than this (replay defense).
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

interface StripeEvent {
  type: string;
  data: {
    object: {
      id: string;
      customer_email?: string;
      metadata?: Record<string, string>;
      payment_status?: string;
      amount_total?: number;
      payment_intent?: string;
    };
  };
}

/**
 * Verify a Stripe webhook signature without the SDK. The `Stripe-Signature`
 * header looks like `t=<unix>,v1=<hex hmac>,v1=<hex hmac>...`. The signed
 * payload is `${t}.${rawBody}`, HMAC-SHA256 with the endpoint secret.
 */
function verifySignature(rawBody: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i), kv.slice(i + 1)];
    })
  );

  const timestamp = Number(parts["t"]);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");

  // The header can carry multiple v1 signatures during secret rotation.
  const signatures = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));

  return signatures.some((sig) => {
    const sigBuf = Buffer.from(sig, "hex");
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!verifySignature(body, signature, STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_email ?? session.metadata?.customer_email ?? "";
      const itemIds = (session.metadata?.item_ids ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      if (!email || itemIds.length === 0) {
        // Nothing to grant — log and acknowledge so Stripe stops retrying.
        console.warn("[Stripe Webhook] completed session missing email or items:", session.id);
        break;
      }

      // Activate access: this is the step the regression test guards.
      await grantEntitlements(email, itemIds, session.id, session.payment_intent ?? "");
      console.log("[Stripe Webhook] entitlements activated:", {
        sessionId: session.id,
        email,
        items: itemIds,
        amount: session.amount_total,
      });
      break;
    }

    case "charge.refunded":
    case "charge.dispute.created": {
      // The charge shares its PaymentIntent id with the completed session, which
      // is how we find what to revoke. Revoke is idempotent, so redelivery is safe.
      const charge = event.data.object;
      const paymentIntentId = charge.payment_intent ?? "";
      if (!paymentIntentId) {
        console.warn("[Stripe Webhook] refund/dispute missing payment_intent:", charge.id);
        break;
      }
      const removed = await revokeByPaymentIntent(paymentIntentId);
      console.log("[Stripe Webhook] entitlements revoked:", { type: event.type, paymentIntentId, removed });
      break;
    }

    case "checkout.session.expired": {
      console.log("[Stripe Webhook] Session expired:", event.data.object.id);
      break;
    }

    default:
      console.log("[Stripe Webhook] Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
