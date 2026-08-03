/** Canonical site facts shared by metadata, sitemap, robots and structured data. */

/** Production custom domain - single public origin for SEO, auth, and emails. */
export const PRODUCTION_SITE_URL = "https://suprabase.in";

function readConfiguredSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ];

  for (const candidate of candidates) {
    const raw = (candidate ?? "").trim().replace(/\/+$/, "");
    if (!raw) continue;
    // Ignore Vercel default/preview hosts so they never become canonical.
    const host = raw.replace(/^https?:\/\//i, "").split("/")[0] ?? "";
    if (/\.vercel\.app$/i.test(host)) {
      continue;
    }
    return raw;
  }
  return "";
}

/**
 * Resolves the public site origin from env.
 * Prefer NEXT_PUBLIC_SITE_URL; NEXT_PUBLIC_APP_URL remains a compatible alias.
 * Preview hosts are ignored so production always canonicalizes to suprabase.in.
 */
export function resolveSiteUrl() {
  const raw = readConfiguredSiteUrl();

  const fallback =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_SITE_URL
      : "http://localhost:3000";

  if (!raw) return fallback;

  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return fallback;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export const SITE = {
  name: "Suprabase",
  shortDescription:
    "Become the developer companies actually hire. Master Full Stack Development, AI Engineering, System Design, and DevOps through real projects, AI mentoring, and verifiable certifications.",
  longDescription:
    "Suprabase is where professional software engineers are built. Master Full Stack Development, AI Engineering, System Design, DevOps, databases, and modern software engineering through structured learning paths, hands-on coding, real-world projects, AI mentoring, and industry-recognized certifications employers can verify.",
  url: resolveSiteUrl(),
  supportEmail: "support.suprabase@gmail.com",
  locale: "en_US",
} as const;

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE.url;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
