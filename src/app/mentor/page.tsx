import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_ROUTES } from "@/lib/site-routes";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
  webApplicationSchema,
} from "@/lib/seo-schema";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Mentor — Context-Aware Software Engineering Help",
  description:
    "Ask Supra for explain, debug, build, and review help grounded in your learning progress. An AI mentor for full stack, React, Next.js, databases, and interviews.",
  path: SITE_ROUTES.mentor,
  keywords: [
    "AI mentor",
    "AI learning platform",
    "learn AI development",
    "coding practice",
    "software engineer training",
  ],
});

export default function MentorMarketingPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          webApplicationSchema(),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "AI Mentor", path: SITE_ROUTES.mentor },
          ]),
        ])}
      />
      <FeatureMarketingPage
        eyebrow="AI Mentor"
        title="Your AI software engineering mentor."
        description="Instant help with debugging, architecture, React, Next.js, databases, AI, DevOps, interviews, and production engineering—powered by your progress."
        cards={[
          {
            title: "Explain",
            body: "Break down hard concepts with clear examples tied to what you are learning right now.",
          },
          {
            title: "Debug",
            body: "Hunt race conditions, type errors, hydration bugs, and slow endpoints with focused guidance.",
          },
          {
            title: "Build & Review",
            body: "Plan structures, ship safer APIs, and review code for production risks before you merge.",
          },
        ]}
      />
    </>
  );
}
