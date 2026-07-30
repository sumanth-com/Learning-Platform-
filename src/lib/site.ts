/** Canonical site facts shared by metadata, sitemap, robots and structured data. */
export const SITE = {
  name: "Suprabase",
  shortDescription:
    "Learn Full Stack and AI development through a structured 12-week path, in-browser practice, real projects and verifiable certifications.",
  longDescription:
    "Suprabase is a learning platform for Full Stack and AI developers. It combines a sequenced curriculum, coding challenges that run in the browser, portfolio projects, an AI mentor that understands the module you are on, and skill certifications with public verification links.",
  url: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  ),
  supportEmail: "support.suprabase@gmail.com",
  locale: "en_US",
} as const;

export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
