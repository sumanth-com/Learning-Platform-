import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Most useful",
  description:
    "The parts of Suprabase developers use most — mentoring, practice, projects, and certifications.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.journey) },
};

export default function MostUsefulMarketingPage() {
  return (
    <FeatureMarketingPage
      eyebrow="Most useful"
      title="The features developers lean on most."
      description="AI Mentor, browser practice, projects, and certifications—designed to stay useful every week, not just on day one."
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
