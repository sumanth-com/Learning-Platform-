import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Service-role Supabase client for admin auth operations (generateLink, etc.).
 * Never import this into client components.
 *
 * Uses the `ws` package so admin calls work on Node 20 (no native WebSocket).
 */
export function createAdminClient(): SupabaseClient {
  const { url } = getSupabaseEnv();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRole) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Required for branded auth emails."
    );
  }

  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      // Node 20 lacks global WebSocket; auth admin APIs still need a client.
      transport: ws as unknown as typeof WebSocket,
    },
  });
}
