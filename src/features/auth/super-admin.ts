/** Sole Super Admin — never assignable from the UI. */
export const SUPER_ADMIN_EMAIL = "sumanth.reddy@ifranchise.in" as const;

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}
