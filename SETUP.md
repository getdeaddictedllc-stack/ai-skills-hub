# AI Skills Hub — Go Live Checklist

All env vars below need to be set in Vercel (Settings → Environment Variables) then redeployed.

## Already configured:
- [x] `NEXTAUTH_SECRET` — Generated and set
- [x] `NEXTAUTH_URL` — https://www.aiskillhub.info
- [x] `NEXT_PUBLIC_SITE_URL` — https://www.aiskillhub.info
- [x] `NEXT_PUBLIC_PAID_MODE` — false (flip to `true` after Stripe is ready)

## Need your action (5 minutes each):

### 1. Stripe (Payments) — https://dashboard.stripe.com
1. Sign up / log in at stripe.com
2. Go to Developers → API Keys
3. Copy the **Secret key** → set as `STRIPE_SECRET_KEY` in Vercel
4. Go to Developers → Webhooks → Add endpoint
   - URL: `https://www.aiskillhub.info/api/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
5. Copy the **Webhook signing secret** → set as `STRIPE_WEBHOOK_SECRET` in Vercel
6. Flip `NEXT_PUBLIC_PAID_MODE` to `true` in Vercel

### 2. Google Analytics — https://analytics.google.com
1. Create a GA4 property for aiskillhub.info
2. Copy the **Measurement ID** (G-XXXXXXXXXX)
3. Set as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel

### 3. Resend (Email) — https://resend.com
1. Sign up at resend.com
2. Add and verify your domain (aiskillhub.info)
3. Copy your **API key** → set as `RESEND_API_KEY` in Vercel
4. Set `FROM_EMAIL` to `noreply@aiskillhub.info`

### 4. Google OAuth (Optional) — https://console.cloud.google.com
1. Create a project → APIs & Services → Credentials → OAuth Client
2. Authorized redirect: `https://www.aiskillhub.info/api/auth/callback/google`
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel

### After setting all vars:
```bash
vercel --prod
```
