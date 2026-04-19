import { NextRequest, NextResponse } from "next/server";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // Verify webhook signature using Stripe's raw approach
  // In production, use the stripe SDK: stripe.webhooks.constructEvent(body, signature, secret)
  // For now we process the event and log it
  let event: {
    type: string;
    data: {
      object: {
        id: string;
        customer_email?: string;
        metadata?: Record<string, string>;
        payment_status?: string;
        amount_total?: number;
      };
    };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("[Stripe Webhook] Payment successful:", {
        sessionId: session.id,
        email: session.customer_email,
        items: session.metadata?.item_ids,
        amount: session.amount_total,
      });
      // TODO: Save purchase record to database
      // TODO: Send confirmation email via Resend
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      console.log("[Stripe Webhook] Session expired:", session.id);
      break;
    }

    default:
      console.log("[Stripe Webhook] Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
