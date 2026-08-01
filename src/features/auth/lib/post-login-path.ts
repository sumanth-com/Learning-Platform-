import { AUTH_ROUTES } from "@/features/auth/constants";
import { safeInternalPath } from "@/lib/auth/safe-path";

/**
 * Role-aware post-login destination.
 * Shared by client login and server helpers — keep free of server-only imports.
 */
export function resolvePostLoginPath(
  role: string | undefined | null,
  nextPath: string | null | undefined
): string {
  const next = safeInternalPath(nextPath ?? null);
  if (role === "super_admin") {
    if (next?.startsWith("/admin")) return next;
    return AUTH_ROUTES.admin;
  }
  if (next) return next;
  return AUTH_ROUTES.dashboard;
}
