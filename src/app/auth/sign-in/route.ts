import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import { resolvePostLoginPath } from "@/features/auth/lib/post-login-path";
import { AUTH_RATE_LIMITS, checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuthEvent } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

function mapAuthError(message: string | undefined): string {
  const msg = (message ?? "").toLowerCase();
  if (msg.includes("email not confirmed")) return AUTH_MESSAGES.emailNotVerified;
  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return AUTH_MESSAGES.invalidCredentials;
  }
  if (msg.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  return message?.trim() || "Something went wrong. Please try again.";
}

/**
 * Production sign-in endpoint.
 *
 * Sets Supabase auth cookies on THIS response via Set-Cookie.
 * The browser then hard-navigates to the portal; proxy/middleware
 * receives the same cookie format the SSR clients expect.
 *
 * This avoids Server Action + redirect cookie loss on Vercel and
 * avoids relying solely on document.cookie from the browser client.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const next =
    typeof (body as { next?: unknown }).next === "string"
      ? ((body as { next: string }).next as string)
      : null;

  const limit = checkRateLimit(`login:${email}`, AUTH_RATE_LIMITS.login);
  if (!limit.allowed) {
    await logAuthEvent("rate_limited", { action: "login", email });
    return NextResponse.json(
      {
        success: false,
        error: `Too many sign-in attempts. Try again in ${limit.retryAfterSec}s.`,
      },
      { status: 429 }
    );
  }

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error || !data.user || !data.session) {
    await logAuthEvent("login_failed", {
      email,
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      { success: false, error: mapAuthError(error?.message) },
      { status: 401 }
    );
  }

  if (cookieJar.length === 0) {
    await logAuthEvent("login_failed", {
      email,
      reason: "no_cookies_written",
    });
    return NextResponse.json(
      {
        success: false,
        error: "Session could not be stored. Please try again.",
      },
      { status: 500 }
    );
  }

  let role: string | undefined;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();
  role = (profile as { role?: string } | null)?.role;

  const redirectTo = resolvePostLoginPath(role, next);

  await logAuthEvent("login_success", {
    email,
    userId: data.user.id,
    role: role ?? null,
    redirectTo,
    mode: "route_handler",
    cookieCount: cookieJar.length,
  });

  revalidatePath("/", "layout");

  const response = NextResponse.json({
    success: true,
    redirectTo,
    message: AUTH_MESSAGES.loginSuccess,
  });

  cookieJar.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  console.info(
    "[auth-sign-in]",
    JSON.stringify({
      ok: true,
      redirectTo,
      cookieCount: cookieJar.length,
      cookieNames: cookieJar.map((c) => c.name),
    })
  );

  return response;
}
