import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

/**
 * Crawl policy: index marketing + invite entry + public credential verify.
 * Block student portal, admin, APIs, and sensitive auth flows.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/profile",
          "/profile/",
          "/settings",
          "/settings/",
          "/notifications",
          "/notes",
          "/ai-mentor",
          "/projects",
          "/assignments",
          "/practice",
          "/certifications",
          "/certifications/",
          "/roadmap",
          "/roadmap/",
          "/module/",
          "/challenge/",
          "/learn/",
          "/lesson/",
          "/interview",
          "/resources",
          "/community",
          "/journey",
          "/help",
          "/live",
          "/ai-skills",
          "/communication",
          "/reset-password",
          "/verify-email",
          "/forgot-password",
          "/auth/",
          "/login",
          "/signup",
          "/forbidden",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/auth/",
          "/login",
          "/profile",
          "/settings",
        ],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/auth/",
          "/login",
          "/profile",
          "/settings",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
