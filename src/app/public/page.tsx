import type { Metadata } from "next";
import { getTotalWeeks } from "@/curriculum/registry";
import { LandingCore } from "@/components/landing/landing-core";
import { LandingCta } from "@/components/landing/landing-cta";
import { FAQ_ITEMS, LandingFaq } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingJourney } from "@/components/landing/landing-journey";
import { LandingManifesto } from "@/components/landing/landing-manifesto";
import { LandingMentorShowcase } from "@/components/landing/landing-mentor-showcase";
import { LandingStats, type LandingStat } from "@/components/landing/landing-stats";
import { HUB_CATALOG } from "@/features/developer-hub/data/catalog";
import { CERTIFICATIONS, CERT_CATEGORIES } from "@/features/certifications/data/catalog";
import { SITE, absoluteUrl } from "@/lib/site";
import styles from "@/components/landing/landing.module.css";

const TITLE = "Learn Full Stack & AI Development";

export const metadata: Metadata = {
  title: TITLE,
  description: SITE.shortDescription,
  alternates: { canonical: absoluteUrl("/public") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/public"),
    title: `${TITLE} · ${SITE.name}`,
    description: SITE.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · ${SITE.name}`,
    description: SITE.shortDescription,
  },
};

/**
 * Structured data is emitted from the same copy the page renders so answer
 * engines and crawlers never see a different set of claims.
 */
function buildStructuredData(weeks: number, tracks: number) {
  const organization = {
    "@type": "EducationalOrganization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    url: SITE.url,
    description: SITE.longDescription,
    logo: absoluteUrl("/icons/icon-512.png"),
    email: SITE.supportEmail,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: SITE.url,
        name: SITE.name,
        description: SITE.shortDescription,
        publisher: { "@id": absoluteUrl("/#organization") },
        inLanguage: "en",
      },
      {
        "@type": "Course",
        name: "Full Stack and AI Developer Path",
        description: `A ${weeks}-week structured path covering web fundamentals, frontend, backend, databases and AI engineering, with in-browser coding challenges, portfolio projects and ${tracks} certification tracks.`,
        provider: { "@id": absoluteUrl("/#organization") },
        url: absoluteUrl("/public"),
        educationalLevel: "Beginner to Intermediate",
        teaches: CERT_CATEGORIES.map((category) => category.label),
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: `P${weeks}W`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl("/public#faq"),
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export default function PublicPage() {
  const weeks = getTotalWeeks();
  const tracks = CERT_CATEGORIES.length;

  const stats: LandingStat[] = [
    {
      value: weeks,
      label: "Weeks of curriculum",
      detail: "Sequenced so each week builds on the last",
    },
    {
      value: tracks,
      label: "Skill tracks",
      detail: "From JavaScript to system design and AI engineering",
    },
    {
      value: CERTIFICATIONS.length,
      label: "Certification tests",
      detail: "Basic and intermediate levels per track",
    },
    {
      value: HUB_CATALOG.length,
      suffix: "+",
      label: "Dev Forge resources",
      detail: "Curated references beside every module",
    },
  ];

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(weeks, tracks)),
        }}
      />

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
        <LandingManifesto />
        <LandingStats stats={stats} />
        <LandingJourney />
        <LandingFaq />
        <LandingCta />
      </main>

      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
