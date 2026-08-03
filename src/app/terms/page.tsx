import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentPage } from "@/components/site/legal-document-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_ROUTES } from "@/lib/site-routes";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${SITE.name}. Rules for accounts, invite-only access, certifications, and acceptable use of the platform.`,
  path: SITE_ROUTES.terms,
  keywords: ["terms of service", "terms of use", SITE.name],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        id="json-ld-terms"
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Terms of Service", path: SITE_ROUTES.terms },
          ]),
        ])}
      />
      <LegalDocumentPage
      title="Terms of Service"
      description={`These Terms govern your access to and use of ${SITE.name}. By creating an account or using the platform, you agree to them.`}
    >
      <section>
        <h2>1. Acceptance of terms</h2>
        <p>
          By accessing or using {SITE.name}, you agree to these Terms and our{" "}
          <Link href={SITE_ROUTES.privacy}>Privacy Policy</Link>. If you do not
          agree, do not use the service.
        </p>
      </section>

      <section>
        <h2>2. The service</h2>
        <p>
          {SITE.name} provides learning paths, in-browser practice, AI mentoring,
          projects, and certifications for software engineers. Features may
          change as we improve the product.
        </p>
      </section>

      <section>
        <h2>3. Accounts</h2>
        <p>
          You are responsible for your credentials and activity under your
          account. Keep your information accurate and up to date.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Misuse mentoring, certifications, or assessments</li>
          <li>Disrupt, reverse engineer, or abuse the platform</li>
          <li>Share access in ways that violate these terms</li>
          <li>Use the service for unlawful purposes</li>
        </ul>
      </section>

      <section>
        <h2>5. Certifications and content</h2>
        <p>
          Learning content and certifications are for education and professional
          development. Verification helps employers confirm credentials. We do
          not guarantee employment outcomes.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          {SITE.name}, branding, curriculum, and software are owned by us or our
          licensors. You retain ownership of content you submit and grant us a
          limited license to operate the service.
        </p>
      </section>

      <section>
        <h2>7. Disclaimers</h2>
        <p>
          The service is provided “as is” without warranties of any kind, to the
          fullest extent permitted by law.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {SITE.name} is not liable for
          indirect, incidental, special, consequential, or punitive damages
          arising from your use of the service.
        </p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          We may update these terms. Continued use after changes take effect
          constitutes acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions:{" "}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> or
          visit <Link href={SITE_ROUTES.contact}>Contact</Link>.
        </p>
      </section>
    </LegalDocumentPage>
    </>
  );
}
