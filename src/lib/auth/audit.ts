/**
 * Lightweight auth audit logger (server-only).
 * Swap for a durable store later without changing call sites.
 */
export type AuthAuditEvent =
  | "login_failed"
  | "login_success"
  | "logout"
  | "signup"
  | "signup_failed"
  | "signup_blocked"
  | "password_reset_requested"
  | "password_reset_completed"
  | "password_changed"
  | "verification_resent"
  | "email_sent"
  | "email_send_failed"
  | "rate_limited"
  | "seat_request_created"
  | "seat_request_failed"
  | "seat_approved"
  | "seat_approve_failed"
  | "seat_approve_email_failed"
  | "seat_invite_resent"
  | "seat_invite_resend_failed"
  | "seat_rejected"
  | "seat_contacted"
  | "seat_deleted"
  | "invite_account_activated"
  | "invite_account_failed"
  | "session_restore"
  | "middleware_redirect";

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
