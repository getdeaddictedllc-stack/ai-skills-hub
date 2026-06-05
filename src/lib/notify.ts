/**
 * Send an alert to the site owner. Always logs (so it lands in Vercel logs even
 * with no email provider), and emails via Resend when configured. Never throws —
 * a failed alert must not break the webhook acknowledgement to Stripe.
 */
export async function notifyOwner(subject: string, text: string): Promise<void> {
  console.log("[OWNER ALERT]", subject, "—", text.replace(/\n/g, " | "));

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.FROM_EMAIL ?? "noreply@aiskillhub.info";
  const to =
    process.env.OWNER_ALERT_EMAIL ??
    process.env.LEAD_NOTIFICATION_EMAIL ??
    from;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `AI Skills Hub <${from}>`,
        to: [to],
        subject,
        text,
      }),
    });
  } catch (err) {
    console.warn("[OWNER ALERT] Resend delivery failed", err);
  }
}
