import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProfileRow } from "@/types/database";

type Client = SupabaseClient<Database>;

/**
 * Ensures a public.profiles row exists for the authenticated user.
 * Required because many tables FK to profiles(id) (= auth.uid()).
 */
export async function ensureProfile(
  supabase: Client,
  user: User
): Promise<ProfileRow> {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing as ProfileRow;

  const fullName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    (typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : null) ||
    "";

  const payload = {
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    role: "student" as const,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload as never, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw Object.assign(new Error(formatDbError(error, "Failed to create profile.")), {
      cause: error,
    });
  }

  return data as ProfileRow;
}

export function formatDbError(error: unknown, fallback: string): string {
  if (!error) return fallback;

  if (typeof error === "string" && error.trim()) return error;

  if (error instanceof Error && error.message.trim()) {
    return decorateDbMessage(error.message, (error as { code?: string }).code);
  }

  if (typeof error === "object") {
    const e = error as {
      message?: string;
      code?: string;
      details?: string;
      hint?: string;
    };
    const message = e.message?.trim();
    if (message) {
      const parts = [decorateDbMessage(message, e.code)];
      if (e.details?.trim()) parts.push(e.details.trim());
      if (e.hint?.trim()) parts.push(`Hint: ${e.hint.trim()}`);
      if (e.code?.trim()) parts.push(`(${e.code})`);
      return parts.join(" ");
    }
  }

  try {
    return `${fallback}: ${JSON.stringify(error)}`;
  } catch {
    return fallback;
  }
}

function decorateDbMessage(message: string, code?: string): string {
  const lower = message.toLowerCase();
  if (
    code === "23503" ||
    lower.includes("foreign key") ||
    lower.includes("violates foreign key")
  ) {
    return `Supabase insert failed (foreign key): ${message}`;
  }
  if (
    code === "42501" ||
    lower.includes("row-level security") ||
    lower.includes("permission denied")
  ) {
    return `RLS policy denied: ${message}`;
  }
  if (code === "42P01" || lower.includes("does not exist")) {
    return `Database object missing: ${message}`;
  }
  if (code === "23502" || lower.includes("null value")) {
    return `Required column missing: ${message}`;
  }
  return message;
}
