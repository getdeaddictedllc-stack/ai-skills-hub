import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2, Users, Shield, Headphones, Zap, Check, ArrowRight,
  Lock, BarChart3, Globe, Server, Key,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise - AI Skills Hub for Teams & Organizations",
  description:
    "Enterprise AI skill licenses for teams. Centralized management, SSO, custom skill development, priority support, and volume pricing.",
};

const PLANS = [
  {
    name: "Team",
    price: "$99",
    period: "/month",
    seats: "Up to 5 seats",
    highlight: false,
    features: [
      "Access to all 420+ skills",
      "Access to all 177+ workflows",
      "5 team member seats",
      "Shared team dashboard",
      "API access (1,000 req/min)",
      "Email support",
      "Monthly usage reports",
    ],
  },
  {
    name: "Business",
    price: "$249",
    period: "/month",
    seats: "Up to 25 seats",
    highlight: true,
    features: [
      "Everything in Team, plus:",
      "25 team member seats",
      "SSO / SAML integration",
      "Custom skill requests (2/month)",
      "API access (10,000 req/min)",
      "Priority support (4h SLA)",
      "Advanced analytics dashboard",
      "Custom branding on exports",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    seats: "Unlimited seats",
    highlight: false,
    features: [
      "Everything in Business, plus:",
      "Unlimited team seats",
      "Dedicated account manager",
      "Custom skill development",
      "On-premise deployment option",
      "API access (unlimited)",
      "24/7 priority support (1h SLA)",
      "Security audit & compliance docs",
      "Custom integrations",
      "Training & onboarding",
    ],
  },
];

const FEATURES = [
  { icon: Users, title: "Team Management", desc: "Centralized billing, seat management, and role-based access control for your entire organization." },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 Type II compliant. SSO/SAML, audit logs, data encryption at rest and in transit." },
  { icon: Server, title: "API Access", desc: "Programmatic access to all skills and workflows. Build AI capabilities directly into your products." },
  { icon: Headphones, title: "Priority Support", desc: "Dedicated support with guaranteed SLAs. Business: 4h response. Enterprise: 1h response." },
  { icon: Key, title: "Custom Skills", desc: "Request custom AI skills tailored to your specific industry workflows and compliance requirements." },
  { icon: BarChart3, title: "Analytics", desc: "Track skill usage, team adoption, and ROI across your organization with detailed dashboards." },
];

const LOGOS = [
  "Fortune 500 Healthcare Co",
  "Top 10 FinTech",
  "Global Consulting Firm",
  "Leading EdTech Platform",
  "Enterprise SaaS Leader",
  "Government Agency",
];

export default function EnterprisePage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
            <Building2 className="h-4 w-4" />
            Enterprise
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            AI Skills for{" "}
            <span className="gradient-text">Your Entire Organization</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Equip every team with production-ready AI capabilities. Centralized management,
            enterprise security, and dedicated support.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:enterprise@aiskillhub.info"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              View API Docs
            </Link>
          </div>
        </div>

        {/* Trust logos */}
        <div className="mb-16">
          <p className="mb-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Trusted by teams at leading organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-8 shadow-sm ${
                plan.highlight
                  ? "border-brand-500 bg-white ring-2 ring-brand-500/20 dark:bg-gray-900"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              {plan.highlight && (
                <span className="mb-4 self-start rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.seats}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
              </div>

              <ul className="my-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:enterprise@aiskillhub.info"
                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="mb-20">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Enterprise-Grade Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <f.icon className="mb-3 h-8 w-8 text-brand-500" />
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security section */}
        <div className="mb-20 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Lock className="h-4 w-4" />
                Security First
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Enterprise Security & Compliance
              </h2>
              <ul className="space-y-3">
                {[
                  "SOC 2 Type II certified",
                  "GDPR and CCPA compliant",
                  "Data encrypted at rest (AES-256) and in transit (TLS 1.3)",
                  "SSO / SAML 2.0 integration",
                  "Complete audit trail for all API access",
                  "99.9% uptime SLA",
                  "Custom data residency options",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
              <Shield className="h-20 w-20 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center sm:p-12">
          <h2 className="mb-3 text-3xl font-extrabold text-white">
            Ready to Scale AI Across Your Organization?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-brand-100">
            Join leading organizations using AI Skills Hub to accelerate AI adoption.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:enterprise@aiskillhub.info"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-sm hover:bg-gray-100"
            >
              <Globe className="h-5 w-5" />
              Schedule a Demo
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              Explore API Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
