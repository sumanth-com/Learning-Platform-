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
  title: "Most Useful — AI Mentoring, Practice & Verifiable Proof",
  description:
    "Explore Suprabase’s most useful tools: AI mentoring, browser-based coding practice, portfolio projects, and verifiable certifications on one connected developer roadmap.",
  path: SITE_ROUTES.journey,
  keywords: [
    "developer roadmap",
    "coding practice",
    "real world projects",
    "AI mentor",
    "developer career platform",
  ],
});

export default function MostUsefulMarketingPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Most useful", path: SITE_ROUTES.journey },
          ]),
        ])}
      />
      <FeatureMarketingPage
        eyebrow="Most useful"
        title="Learn software engineering with AI mentoring, practice, and proof."
        description="Suprabase combines an AI coding mentor, in-browser practice, portfolio projects, and verifiable certifications—so progress compounds on one profile."
        cards={[
          {
            title: "AI Mentor",
            body: "Explain, debug, build, and review with context from your learning progress.",
          },
          {
            title: "Browser practice",
            body: "Write and run code without setup friction—focused challenges that build muscle memory.",
          },
          {
            title: "Projects & certs",
            body: "Ship portfolio work and earn credentials employers can verify by link or QR.",
          },
        ]}
      />
    </>
  );
}
