import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Most useful features for learning software engineering",
  description:
    "Explore Suprabase’s most useful tools: AI mentoring, browser-based coding practice, portfolio projects, and verifiable certifications on one connected roadmap.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.journey) },
};

export default function MostUsefulMarketingPage() {
  return (
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
          body: "Write and run code where you learn—fast feedback without setup friction.",
        },
        {
          title: "Projects & certs",
          body: "Ship work you can show, then prove skill with verifiable credentials.",
        },
      ]}
    />
  );
}
