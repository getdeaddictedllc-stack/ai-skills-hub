import type { Metadata } from "next";
import { LegalPage, LEGAL_CONTACT } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Skills Hub",
  description: "What AI Skills Hub and its apps collect when you sign in, how it is used, and how to have it deleted.",
  alternates: { canonical: "https://aiskillhub.info/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <p>
          This policy covers aiskillhub.info and the apps we run on its subdomains (for example
          study.aiskillhub.info), as well as getdeaddicted.com. It explains what we collect when you
          sign in and what we do with it.
        </p>
      </section>

      <section>
        <h2>What we collect when you sign in with Google</h2>
        <p>If you choose &ldquo;Sign in with Google&rdquo;, Google shares three things with us:</p>
        <ul>
          <li>your name</li>
          <li>your email address</li>
          <li>your profile picture</li>
        </ul>
        <p className="mt-3">
          We use these only to create your account, sign you in, and show you who you are signed in as.
          We do not ask Google for access to your contacts, files, calendar or any other data.
        </p>
      </section>

      <section>
        <h2>Other information</h2>
        <ul>
          <li>If you sign up with an email and password instead, we store your email and a one-way hash of your password, never the password itself.</li>
          <li>Whatever you create or upload inside an app is stored so the app can show it back to you.</li>
          <li>We set a sign-in cookie so you stay logged in. We don&rsquo;t use advertising cookies.</li>
          <li>Payments are handled by Stripe. We never see or store your full card number.</li>
        </ul>
      </section>

      <section>
        <h2>What we never do</h2>
        <ul>
          <li>We do not sell your personal data.</li>
          <li>We do not share it with advertisers or data brokers.</li>
          <li>We do not use your Google data for anything other than signing you in.</li>
        </ul>
      </section>

      <section>
        <h2>Who else handles your data</h2>
        <p>
          Only the services needed to run the apps: our hosting providers, Google (for sign-in) and
          Stripe (for payments). Each handles data under its own privacy terms.
        </p>
      </section>

      <section>
        <h2>Deleting your data</h2>
        <p>
          Email <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a> from the address on your account
          and we will delete your account and its data within 30 days. You can also remove our access at
          any time from your Google account&rsquo;s security settings.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          If this policy changes, we will update the date at the top of this page. Questions go to{" "}
          <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
