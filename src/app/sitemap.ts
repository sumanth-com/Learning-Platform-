import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Only publicly reachable marketing and auth entry points belong in the index. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/public"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/signup"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/login"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
