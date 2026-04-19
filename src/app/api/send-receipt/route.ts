import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@aiskillhub.info";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiskillhub.info";

interface ReceiptItem {
  name: string;
  type: string;
  price: number;
}

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured. Set RESEND_API_KEY." },
      { status: 500 }
    );
  }

  const { email, name, items, total } = (await req.json()) as {
    email: string;
    name: string;
    items: ReceiptItem[];
    total: number;
  };

  if (!email || !items?.length) {
    return NextResponse.json({ error: "Missing email or items" }, { status: 400 });
  }

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-transform:capitalize;">${item.type}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:right;">$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
      <div style="text-align:center;padding:32px 0;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;font-size:24px;margin:0;">AI Skills Hub</h1>
        <p style="color:#e0e7ff;margin:4px 0 0;">Purchase Confirmation</p>
      </div>

      <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:16px;margin:0 0 16px;">Hi ${name || "there"},</p>
        <p style="color:#6b7280;margin:0 0 24px;">Thank you for your purchase! Your AI skill files are ready to download.</p>

        <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Item</th>
              <th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Type</th>
              <th style="padding:8px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#6b7280;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:700;">Total</td>
              <td style="padding:12px;font-weight:700;text-align:right;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align:center;margin:32px 0;">
          <a href="${SITE_URL}/dashboard" style="display:inline-block;padding:12px 32px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
            Go to Dashboard & Download
          </a>
        </div>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
          You have lifetime access to your purchased files. You can re-download them anytime from your dashboard.
        </p>
      </div>

      <div style="text-align:center;padding:16px;color:#9ca3af;font-size:11px;">
        <p style="margin:0;">AI Skills Hub &mdash; <a href="${SITE_URL}" style="color:#6366f1;">aiskillhub.info</a></p>
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `AI Skills Hub <${FROM_EMAIL}>`,
      to: [email],
      subject: `Purchase Confirmation - AI Skills Hub`,
      html,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("[Resend] Failed to send receipt:", result);
    return NextResponse.json(
      { error: result.message ?? "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id: result.id });
}
