import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import { isAdminRole } from "@/features/admin/types";

export async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      role: null as UserRole | null,
      ok: false as const,
      error: "Sign in required.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const role =
    (profile as { role?: UserRole } | null)?.role ?? ("student" as UserRole);

  if (!isAdminRole(role)) {
    return {
      supabase,
      user,
      role,
      profile,
      ok: false as const,
      error: "Admin access required.",
    };
  }

  return {
    supabase,
    user,
    role,
    profile,
    ok: true as const,
  };
}
