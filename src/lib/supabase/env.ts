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

export function getAppUrl() {
  const raw = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim().replace(/\/+$/, "");
  const fallback =
    process.env.NODE_ENV === "production"
      ? "https://suprabase.vercel.app"
      : "http://localhost:3000";
  if (!raw) return fallback;
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
}
