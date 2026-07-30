import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/public", "/signup", "/login", "/verify/"],
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/profile",
          "/settings",
          "/notifications",
          "/notes",
          "/ai-mentor",
          "/projects",
          "/assignments",
          "/practice",
          "/certifications",
          "/roadmap",
          "/module/",
          "/challenge/",
          "/reset-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
