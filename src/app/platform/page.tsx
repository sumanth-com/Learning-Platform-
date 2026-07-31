import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "One connected system for learning paths, practice, mentoring, projects, and certifications.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.platform) },
};

export default function PlatformMarketingPage() {
  return (
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
  );
}
