import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentPage } from "@/components/site/legal-document-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses, and protects your information when you use the AI learning platform.`,
  path: SITE_ROUTES.privacy,
  keywords: ["privacy policy", "data protection", SITE.name],
});

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      description={`How ${SITE.name} collects, uses, and protects your information when you use the platform.`}
    >
      <section>
        <h2>1. Information we collect</h2>
        <p>We may collect:</p>
        <ul>
          <li>Account details such as name, email, and auth data</li>
          <li>Learning activity, projects, and certification records</li>
          <li>Messages and inputs to AI Mentor features</li>
          <li>Technical data such as device, browser, and usage logs</li>
        </ul>
      </section>

      <section>
        <h2>2. How we use information</h2>
        <p>We use information to:</p>
        <ul>
          <li>Provide, personalize, and improve the platform</li>
          <li>Operate mentoring, practice, and certifications</li>
          <li>Send service, security, and support communications</li>
          <li>Prevent abuse and protect account integrity</li>
        </ul>
      </section>

      <section>
        <h2>3. AI features</h2>
        <p>
          Prompts and relevant learning context may be processed to generate
          mentor responses. Avoid submitting sensitive personal data you do not
          want processed for that purpose.
        </p>
      </section>

      <section>
        <h2>4. Sharing</h2>
        <p>
          We do not sell personal information. We may share data with providers
          who help operate the platform, when required by law, or with your
          direction (such as public certificate verification).
        </p>
      </section>

      <section>
        <h2>5. Data retention</h2>
        <p>
          We retain account and learning data while your account is active and as
          needed to provide the service, meet legal obligations, and resolve
          disputes.
        </p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>
          We use reasonable safeguards to protect information. No method of
          transmission or storage is completely secure.
        </p>
      </section>

      <section>
        <h2>7. Your choices</h2>
        <p>
          Update profile details in settings, request help with access or
          deletion, and opt out of non-essential communications where available.
        </p>
      </section>

      <section>
        <h2>8. Children’s privacy</h2>
        <p>
          {SITE.name} is intended for users who can form a binding contract in
          their jurisdiction. We do not knowingly collect personal information
          from children under 13.
        </p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          We may update this policy periodically. Material changes are reflected
          by the date above.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> or{" "}
          <Link href={SITE_ROUTES.contact}>Contact</Link>. See also{" "}
          <Link href={SITE_ROUTES.terms}>Terms of Service</Link>.
        </p>
      </section>
    </LegalDocumentPage>
  );
}
