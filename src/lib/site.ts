/** Canonical site facts shared by metadata, sitemap, robots and structured data. */

function resolveSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim().replace(/\/+$/, "");
  const fallback =
    process.env.NODE_ENV === "production"
      ? "https://suprabase.vercel.app"
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
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
