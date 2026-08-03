import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { LandingCore } from "@/components/landing/landing-core";
import { LandingCta } from "@/components/landing/landing-cta";
import { FAQ_ITEMS } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import type { LandingStat } from "@/components/landing/landing-stats";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";
import { ROADMAP_MODULE_COUNT } from "@/lib/roadmap-modules";
import { buildPageMetadata } from "@/lib/seo";
import {
  courseSchema,
  faqPageSchema,
  graphSchema,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/seo-schema";
import styles from "@/components/landing/landing.module.css";

/** Below-fold sections — code-split so hero paints first. */
const LandingMentorShowcase = dynamic(
  () =>
    import("@/components/landing/landing-mentor-showcase").then((m) => ({
      default: m.LandingMentorShowcase,
    })),
  { ssr: true }
);
const LandingCertifications = dynamic(
  () =>
    import("@/components/landing/landing-certifications").then((m) => ({
      default: m.LandingCertifications,
    })),
  { ssr: true }
);
const LandingManifesto = dynamic(
  () =>
    import("@/components/landing/landing-manifesto").then((m) => ({
      default: m.LandingManifesto,
    })),
  { ssr: true }
);
const LandingJourney = dynamic(
  () =>
    import("@/components/landing/landing-journey").then((m) => ({
      default: m.LandingJourney,
    })),
  { ssr: true }
);
const LandingTechnologies = dynamic(
  () =>
    import("@/components/landing/landing-technologies").then((m) => ({
      default: m.LandingTechnologies,
    })),
  { ssr: true }
);
const LandingFaq = dynamic(
  () =>
    import("@/components/landing/landing-faq").then((m) => ({
      default: m.LandingFaq,
    })),
  { ssr: true }
);

/** Lightweight labels for schema — avoids pulling coding-challenge catalog. */
const CERT_TEACHES = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "SQL",
  "Docker",
  "Full Stack Development",
  "AI Engineering",
  "System Design",
  "Software Engineering",
  "DevOps",
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Full Stack Development & AI Engineering Learning Platform",
  description: SITE.shortDescription,
  path: SITE_ROUTES.home,
  keywords: [
    "AI learning platform",
    "full stack learning platform",
    "AI developer course",
    "software engineering learning platform",
    "developer roadmap",
    "learn full stack development",
    "learn AI development",
    "developer certification",
    "interview preparation",
    "real world projects",
  ],
});

function buildStructuredData(weeks: number) {
  return graphSchema([
    organizationSchema(),
    websiteSchema(),
    softwareApplicationSchema(),
    courseSchema({
      name: "Full Stack Development and AI Engineering Path",
      description: SITE.longDescription,
      url: SITE_ROUTES.home,
      workload: `P${weeks}W`,
      teaches: [...CERT_TEACHES],
    }),
    {
      ...faqPageSchema(FAQ_ITEMS),
      "@id": `${SITE.url}/#faq`,
    },
  ]);
}

/** Official marketing landing page at the root domain. */
export default function HomePage() {
  const weeks = ROADMAP_MODULE_COUNT;

  const stats: LandingStat[] = [
    {
      value: weeks,
      suffix: "+",
      label: "Learning Modules",
      detail: "Production-focused roadmap",
    },
    {
      value: 50,
      suffix: "+",
      label: "Projects & Challenges",
      detail: "Portfolio-ready work",
    },
    {
      display: "AI Mentor",
      label: "Available 24/7",
      detail: "Context-aware assistance",
    },
    {
      display: "Verifiable",
      label: "Certifications",
      detail: "Employer-friendly credentials",
    },
  ];

  return (
    <div className={styles.page}>
      <JsonLd id="json-ld-home" data={buildStructuredData(weeks)} />

      <div aria-hidden className={styles.backdrop}>
        <div className={`${styles.aurora} ${styles.auroraOne}`} />
        <div className={`${styles.aurora} ${styles.auroraTwo}`} />
        <div className={`${styles.aurora} ${styles.auroraThree}`} />
        <div className={styles.mesh} />
        <div className={styles.vignette} />
        <div className={styles.noise} />
      </div>

      <LandingHeader />

      <main className="relative z-10">
        <LandingHero />
        <LandingMentorShowcase />
        <LandingCore />
        <LandingCertifications />
        <LandingManifesto stats={stats} />
        <LandingJourney />
        <LandingTechnologies />
        <LandingFaq />
      </main>

      <div className="relative z-10">
        <LandingCta />
        <LandingFooter />
      </div>
    </div>
  );
}
