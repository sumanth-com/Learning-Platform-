import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Timed skill tests and verifiable credentials employers can confirm by link or QR.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.certifications) },
};

export default function CredentialsMarketingPage() {
  return (
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
  );
}
