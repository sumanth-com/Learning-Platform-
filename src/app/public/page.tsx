import type { Metadata } from "next";
import { getTotalWeeks } from "@/curriculum/registry";
import { LandingCertifications } from "@/components/landing/landing-certifications";
import { LandingCore } from "@/components/landing/landing-core";
import { LandingCta } from "@/components/landing/landing-cta";
import { FAQ_ITEMS, LandingFaq } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingJourney } from "@/components/landing/landing-journey";
import { LandingManifesto } from "@/components/landing/landing-manifesto";
import { LandingMentorShowcase } from "@/components/landing/landing-mentor-showcase";
import type { LandingStat } from "@/components/landing/landing-stats";
import { LandingTechnologies } from "@/components/landing/landing-technologies";
import { CERT_CATEGORIES } from "@/features/certifications/data/catalog";
import { SITE, absoluteUrl } from "@/lib/site";
import styles from "@/components/landing/landing.module.css";

const TITLE = "Full Stack Development & AI Engineering";

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
function buildStructuredData(weeks: number) {
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
        name: "Full Stack Development and AI Engineering Path",
        description: SITE.longDescription,
        provider: { "@id": absoluteUrl("/#organization") },
        url: absoluteUrl("/public"),
        educationalLevel: "Beginner to Intermediate",
        teaches: [
          ...CERT_CATEGORIES.map((category) => category.label),
          "Full Stack Development",
          "AI Engineering",
          "System Design",
          "Software Engineering",
          "DevOps",
        ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(weeks)),
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
