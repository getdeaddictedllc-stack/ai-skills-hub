import type { Metadata } from "next";
import { LegalPage, LEGAL_CONTACT } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | AI Skills Hub",
  description: "The rules for using AI Skills Hub and its apps.",
  alternates: { canonical: "https://aiskillhub.info/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <section>
        <p>
          These terms apply when you use aiskillhub.info, the apps on its subdomains, or
          getdeaddicted.com. By creating an account or using an app, you agree to them.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <ul>
          <li>You can sign up with Google or with an email and password.</li>
          <li>Keep your sign-in details to yourself. You are responsible for what happens under your account.</li>
          <li>You can ask us to close your account at any time by emailing <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>.</li>
        </ul>
      </section>

      <section>
        <h2>Using the apps</h2>
        <ul>
          <li>Don&rsquo;t use the apps for anything illegal, to harm others, or to try to break or overload them.</li>
          <li>Don&rsquo;t upload content you don&rsquo;t have the right to use.</li>
          <li>We may suspend accounts that break these rules.</li>
        </ul>
      </section>

      <section>
        <h2>AI output</h2>
        <p>
          Many of our apps use AI. Its output can be wrong or incomplete. Check anything important
          yourself. Nothing in the apps is financial, legal, medical or tax advice.
        </p>
      </section>

      <section>
        <h2>Paid plans</h2>
        <p>
          Prices are shown in US dollars before you pay, and payments are processed by Stripe.
          Subscriptions renew until you cancel. If something you paid for didn&rsquo;t work, email us and
          we will make it right.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          What you create in the apps stays yours. You let us store and process it only so the app can
          work for you. See the <a href="/privacy">Privacy Policy</a> for how we handle personal data.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          The apps are provided as they are. We work to keep them running and correct, but we can&rsquo;t
          promise they will always be available or error-free, and we are not liable for indirect losses
          from using them.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          We may update these terms; the date at the top shows the latest version. Questions go to{" "}
          <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
