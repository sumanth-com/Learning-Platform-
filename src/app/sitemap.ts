import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/site-routes";

export const dynamic = "force-static";

function loc(path: string) {
  const origin = resolveSiteUrl();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Public marketing, legal, and invite entry points only. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: SITE_ROUTES.home, changeFrequency: "weekly", priority: 1 },
    { path: SITE_ROUTES.platform, changeFrequency: "monthly", priority: 0.9 },
    { path: SITE_ROUTES.mentor, changeFrequency: "monthly", priority: 0.9 },
    {
      path: SITE_ROUTES.certifications,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { path: SITE_ROUTES.stack, changeFrequency: "monthly", priority: 0.8 },
    { path: SITE_ROUTES.journey, changeFrequency: "monthly", priority: 0.8 },
    { path: SITE_ROUTES.faq, changeFrequency: "monthly", priority: 0.7 },
    { path: SITE_ROUTES.about, changeFrequency: "monthly", priority: 0.7 },
    { path: SITE_ROUTES.contact, changeFrequency: "monthly", priority: 0.6 },
    { path: SITE_ROUTES.manual, changeFrequency: "monthly", priority: 0.5 },
    {
      path: SITE_ROUTES.reserveSeat,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    { path: SITE_ROUTES.terms, changeFrequency: "yearly", priority: 0.3 },
    { path: SITE_ROUTES.privacy, changeFrequency: "yearly", priority: 0.3 },
  ];

  return entries.map((entry) => ({
    url: loc(entry.path),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
