import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/features/auth/constants";

/**
 * Root entry — authenticated users go to the dashboard,
 * everyone else lands on the public marketing page.
 */
export default async function RootPage() {
  let isAuthenticated = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAuthenticated = Boolean(user);
  } catch {
    // Misconfigured env or unreachable Supabase — fall through to public.
  }

  redirect(isAuthenticated ? AUTH_ROUTES.dashboard : AUTH_ROUTES.public);
}
