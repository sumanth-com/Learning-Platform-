import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_ROUTES } from "@/lib/site-routes";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Developer Certifications — Verifiable Programming Credentials",
  description:
    "Timed skill tests and verifiable developer certifications employers can confirm by link or QR. Proof of frontend, backend, and full stack skills—not just course completion.",
  path: SITE_ROUTES.certifications,
  keywords: [
    "developer certification",
    "programming certification",
    "coding platform",
    "software engineer training",
    "developer portfolio projects",
  ],
});

export default function CredentialsMarketingPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Certifications", path: SITE_ROUTES.certifications },
          ]),
        ])}
      />
      <FeatureMarketingPage
        eyebrow="Certifications"
        title="Credentials employers can actually verify."
        description="Earn a certificate only after clearing a timed skill test. Each credential has a unique ID and a public verification page—no account required to check."
        cards={[
          {
            title: "Skill-first tests",
            body: "Timed assessments designed to measure what you can do—not how long you watched videos.",
          },
          {
            title: "Public verification",
            body: "Share a link or QR. Anyone can confirm the credential without signing into Suprabase.",
          },
          {
            title: "Portfolio signal",
            body: "Pair certificates with projects and learning history so your profile reads as production-ready.",
          },
        ]}
      />
    </>
  );
}
