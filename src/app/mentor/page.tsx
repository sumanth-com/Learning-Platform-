import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Mentor",
  description:
    "Ask Supra for explain, debug, build, and review help grounded in your learning progress.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.mentor) },
};

export default function MentorMarketingPage() {
  return (
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
  );
}
