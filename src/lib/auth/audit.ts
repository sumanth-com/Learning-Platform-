/**
 * Lightweight auth audit logger (server-only).
 * Swap for a durable store later without changing call sites.
 */
export type AuthAuditEvent =
  | "login_failed"
  | "login_success"
  | "signup"
  | "signup_failed"
  | "password_reset_requested"
  | "password_reset_completed"
  | "verification_resent"
  | "email_sent"
  | "email_send_failed"
  | "rate_limited";

export async function logAuthEvent(
  event: AuthAuditEvent,
  meta: Record<string, unknown> = {}
) {
  const payload = {
    event,
    at: new Date().toISOString(),
    ...meta,
  };

  // Avoid logging raw tokens / passwords — callers must scrub.
  if (process.env.NODE_ENV === "development") {
    console.info("[auth-audit]", payload);
  } else {
    console.info("[auth-audit]", JSON.stringify(payload));
  }
}
