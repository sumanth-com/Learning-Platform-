import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";

/** Only publicly reachable marketing and auth entry points belong in the index. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketing = [
    SITE_ROUTES.home,
    SITE_ROUTES.mentor,
    SITE_ROUTES.platform,
    SITE_ROUTES.certifications,
    SITE_ROUTES.stack,
    SITE_ROUTES.faq,
    SITE_ROUTES.journey,
    SITE_ROUTES.about,
    SITE_ROUTES.manual,
    SITE_ROUTES.contact,
    SITE_ROUTES.terms,
    SITE_ROUTES.privacy,
  ];

  return [
    ...marketing.map((path, index) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: (index === 0 ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: index === 0 ? 1 : path === SITE_ROUTES.terms || path === SITE_ROUTES.privacy ? 0.3 : 0.6,
    })),
    {
      url: absoluteUrl("/signup"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/login"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];
}
