import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { SITE_ROUTES } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "Technologies and paths across Full Stack, AI Engineering, databases, and modern tooling.",
  alternates: { canonical: absoluteUrl(SITE_ROUTES.stack) },
};

export default function StackMarketingPage() {
  return (
    <FeatureMarketingPage
      eyebrow="Stack"
      title="Technologies that map to real engineering work."
      description="Follow paths across React, Next.js, TypeScript, databases, AI tooling, and more. What is live ships into the platform; what is coming is marked clearly."
      cards={[
        {
          title: "Full Stack",
          body: "Front end through APIs, data, and deployment—with patterns you will recognize on real teams.",
        },
        {
          title: "AI Engineering",
          body: "RAG, tooling, and production AI workflows alongside the apps that use them.",
        },
        {
          title: "Systems & ops",
          body: "Databases, DevOps habits, and system design thinking that keep software reliable.",
        },
      ]}
    />
  );
}
