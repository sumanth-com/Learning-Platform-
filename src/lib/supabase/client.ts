import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Browser Supabase client (Client Components).
 * Uses cookies (not localStorage) so Next.js proxy can read the session.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey, {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      // Secure cookies on HTTPS (production / preview). HTTP localhost stays non-secure.
      secure:
        typeof window !== "undefined"
          ? window.location.protocol === "https:"
          : process.env.NODE_ENV === "production",
    },
  });
}
