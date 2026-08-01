import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import { resolvePostLoginPath } from "@/features/auth/lib/post-login-path";
import { AUTH_RATE_LIMITS, checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuthEvent } from "@/lib/auth/audit";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

function mapAuthError(message: string | undefined): string {
  const msg = (message ?? "").toLowerCase();
  if (msg.includes("email not confirmed")) return AUTH_MESSAGES.emailNotVerified;
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid_credentials")
  ) {
    return AUTH_MESSAGES.invalidCredentials;
  }
  if (msg.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  return message?.trim() || "Something went wrong. Please try again.";
}

function readPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    return {
      ok: false as const,
      error:
        "Server is missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them in Vercel and Redeploy.",
    };
  }
  return { ok: true as const, url, anonKey };
}

/**
 * Production sign-in endpoint.
 * Writes Supabase session cookies onto this response, then the client
 * hard-navigates to the role-based portal path.
 */
export async function POST(request: NextRequest) {
  try {
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

    const env = readPublicSupabaseEnv();
    if (!env.ok) {
      console.error("[auth-sign-in]", env.error);
      return NextResponse.json(
        { success: false, error: env.error },
        { status: 500 }
      );
    }

    const cookieJar: CookieToSet[] = [];
    const supabase = createServerClient<Database>(env.url, env.anonKey, {
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

    const response = NextResponse.json({
      success: true,
      redirectTo,
      message: AUTH_MESSAGES.loginSuccess,
    });

    cookieJar.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected sign-in error.";
    console.error("[auth-sign-in] unhandled", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
