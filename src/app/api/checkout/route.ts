import { NextRequest, NextResponse } from "next/server";
import { priceCatalogItem } from "@/lib/checkout-pricing";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiskillhub.info";

interface CheckoutItem {
  id: string;
  type: "skill" | "workflow" | "bundle";
  name: string;
  price: number;
  industry: string;
  category: string;
}

export async function POST(req: NextRequest) {
  // Without the webhook secret a paid order can't be fulfilled, so don't take money yet.
  if (STRIPE_SECRET_KEY && !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Checkout opens shortly. Payments are being connected." },
      { status: 503 }
    );
  }
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { items, email, name } = body as {
    items: CheckoutItem[];
    email: string;
    name: string;
  };

  if (!items?.length || !email) {
    return NextResponse.json(
      { error: "Missing required fields: items, email" },
      { status: 400 }
    );
  }

  if (items.length > 50) {
    return NextResponse.json({ error: "Too many items in one checkout" }, { status: 400 });
  }
  // Price every item from the catalog. The request only says what to buy, never what it costs.
  const seen = new Set<string>();
  const priced = [];
  for (const item of items) {
    const p = priceCatalogItem(item);
    if (!p) {
      return NextResponse.json({ error: `Unknown item: ${String(item?.id ?? "")}` }, { status: 400 });
    }
    if (p.unitAmount < 50) {
      return NextResponse.json({ error: `${p.name} is not for sale` }, { status: 400 });
    }
    if (!seen.has(p.id)) {
      seen.add(p.id);
      priced.push(p);
    }
  }

  const lineItems = priced.map((p) => ({
    price_data: {
      currency: "usd",
      product_data: { name: p.name, description: p.description },
      unit_amount: p.unitAmount,
    },
    quantity: 1,
  }));

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      mode: "payment",
      "customer_email": email,
      "success_url": `${SITE_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      "cancel_url": `${SITE_URL}/cart`,
      "metadata[customer_name]": name,
      "metadata[customer_email]": email,
      "metadata[item_ids]": priced.map((i) => i.id).join(","),
      ...lineItems.reduce(
        (acc, item, idx) => ({
          ...acc,
          [`line_items[${idx}][price_data][currency]`]: item.price_data.currency,
          [`line_items[${idx}][price_data][product_data][name]`]: item.price_data.product_data.name,
          [`line_items[${idx}][price_data][product_data][description]`]: item.price_data.product_data.description,
          [`line_items[${idx}][price_data][unit_amount]`]: String(item.price_data.unit_amount),
          [`line_items[${idx}][quantity]`]: String(item.quantity),
        }),
        {} as Record<string, string>
      ),
    }).toString(),
  });

  const session = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: session.error?.message ?? "Failed to create checkout session" },
      { status: 400 }
    );
  }

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
