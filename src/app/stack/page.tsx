import type { Metadata } from "next";
import { FeatureMarketingPage } from "@/components/site/feature-marketing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_ROUTES } from "@/lib/site-routes";
import { buildPageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  courseSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/seo-schema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Tech Stack — React, Next.js, TypeScript & AI Engineering Paths",
  description:
    "Technologies and learning paths across JavaScript, React, Next.js, TypeScript, Python, databases, AI tooling, and modern full stack development.",
  path: SITE_ROUTES.stack,
  keywords: [
    "JavaScript course",
    "React course",
    "Next.js course",
    "TypeScript course",
    "frontend development",
    "backend development",
    "system design learning",
  ],
});

export default function StackMarketingPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema(),
          courseSchema({
            name: "Full Stack & AI Engineering Stack Paths",
            description: SITE.shortDescription,
            url: SITE_ROUTES.stack,
            teaches: [
              "JavaScript",
              "React",
              "Next.js",
              "TypeScript",
              "Frontend Development",
              "Backend Development",
              "System Design",
            ],
          }),
          breadcrumbSchema([
            { name: "Home", path: SITE_ROUTES.home },
            { name: "Stack", path: SITE_ROUTES.stack },
          ]),
        ])}
      />
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
            body: "Prompting, tooling, and application patterns that sit beside production software—not as a separate toy track.",
          },
          {
            title: "Modern tooling",
            body: "TypeScript, databases, auth, and DevOps concepts woven into projects so the stack stays coherent.",
          },
        ]}
      />
    </>
  );
}
