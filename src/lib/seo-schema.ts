import { SITE, absoluteUrl } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

/** Dual-typed Organization + EducationalOrganization for rich results. */
export function organizationSchema() {
  return {
    "@type": ["Organization", "EducationalOrganization"],
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    url: SITE.url,
    description: SITE.longDescription,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icons/icon-512.png"),
    },
    image: absoluteUrl("/opengraph-image"),
    email: SITE.supportEmail,
    sameAs: [] as string[],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE.url,
    name: SITE.name,
    description: SITE.shortDescription,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
  };
}

export function softwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": absoluteUrl("/#app"),
    name: SITE.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: SITE.url,
    description: SITE.longDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Invite-only access after approval",
    },
    provider: { "@id": absoluteUrl("/#organization") },
  };
}

export function webApplicationSchema() {
  return {
    "@type": "WebApplication",
    name: SITE.name,
    url: absoluteUrl(SITE_ROUTES.home),
    applicationCategory: "EducationalApplication",
    browserRequirements: "Requires a modern browser with JavaScript enabled",
    description: SITE.shortDescription,
    provider: { "@id": absoluteUrl("/#organization") },
  };
}

export function personSchema(input: {
  name: string;
  url?: string;
  jobTitle?: string;
  description?: string;
}) {
  return {
    "@type": "Person",
    name: input.name,
    ...(input.url ? { url: absoluteUrl(input.url) } : {}),
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function courseSchema(input: {
  name: string;
  description: string;
  url: string;
  teaches?: string[];
  workload?: string;
}) {
  return {
    "@type": "Course",
    name: input.name,
    description: input.description,
    provider: { "@id": absoluteUrl("/#organization") },
    url: absoluteUrl(input.url),
    educationalLevel: "Beginner to Intermediate",
    teaches: input.teaches ?? [
      "Full Stack Development",
      "AI Engineering",
      "System Design",
      "DevOps",
    ],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: input.workload ?? "PT10H",
    },
  };
}

export function educationalCredentialSchema(input: {
  name: string;
  description: string;
  credentialId: string;
  recipientName: string;
  dateIssued: string;
  url: string;
}) {
  return {
    "@type": "EducationalOccupationalCredential",
    name: input.name,
    description: input.description,
    credentialCategory: "Certificate",
    identifier: input.credentialId,
    dateCreated: input.dateIssued,
    url: absoluteUrl(input.url),
    recognizedBy: { "@id": absoluteUrl("/#organization") },
    about: {
      "@type": "Person",
      name: input.recipientName,
    },
  };
}

export function graphSchema(nodes: JsonLd[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
