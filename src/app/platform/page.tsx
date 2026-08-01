import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_ROUTES } from "@/lib/site-routes";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
  softwareApplicationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Platform — Connected Learning Paths, Practice & Certifications",
  description:
    "One connected system for developer roadmaps, coding practice, AI mentoring, portfolio projects, and programming certifications—so progress compounds on one profile.",
  path: SITE_ROUTES.platform,
  keywords: [
    "programming learning platform",
    "developer roadmap",
    "coding platform",
    "developer skills",
    "full stack learning platform",
  ],
});

export default function PlatformMarketingPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          softwareApplicationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Platform", path: SITE_ROUTES.platform },
          ]),
        ])}
      />
      <FeatureMarketingPage
        eyebrow="Platform"
        title="A connected system for shipping engineers."
        description="Paths, practice, mentoring, projects, and certifications stay on one profile—so progress compounds instead of fragmenting across tools."
        cards={[
          {
            title: "Structured paths",
            body: "Move from fundamentals to production patterns without losing the thread of what you already mastered.",
          },
          {
            title: "Hands-on practice",
            body: "Code in the browser, ship portfolio work, and get feedback that matches real engineering constraints.",
          },
          {
            title: "One profile",
            body: "Learning, projects, and credentials live together—so employers see coherent signal, not scattered certificates.",
          },
        ]}
      />
    </>
  );
}
