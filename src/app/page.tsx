import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

/**
 * Root entry — middleware already redirects guests → /public and
 * signed-in users → /dashboard. This is a safe fallback only.
 */
export default function RootPage() {
  redirect(AUTH_ROUTES.public);
}
