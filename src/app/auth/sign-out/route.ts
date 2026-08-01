import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { AUTH_MESSAGES, AUTH_ROUTES } from "@/features/auth/constants";
import { logAuthEvent } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/** Clears the Supabase session and attaches cleared cookies to the response. */
export async function POST(request: NextRequest) {
  const cookieJar: CookieToSet[] = [];
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieJar.push({ name, value, options });
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.signOut();
  await logAuthEvent("logout", { userId: user?.id ?? null, mode: "route_handler" });
  revalidatePath("/", "layout");

  const response = NextResponse.json({
    success: true,
    redirectTo: AUTH_ROUTES.login,
    message: AUTH_MESSAGES.logoutSuccess,
  });

  cookieJar.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
