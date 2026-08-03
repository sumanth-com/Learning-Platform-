import { resolveSiteUrl } from "@/lib/site";

/**
 * Validates and exposes public Supabase environment variables.
 * Throws early in development if misconfigured.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase credentials."
    );
  }

  return { url, anonKey } as const;
}

/** Public app origin — same source of truth as SITE.url / SEO. */
export function getAppUrl() {
  return resolveSiteUrl();
}
