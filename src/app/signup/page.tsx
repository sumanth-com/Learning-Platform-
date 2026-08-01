import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

/** Public signup removed — invite-only. */
export default function SignupRedirectPage() {
  redirect(AUTH_ROUTES.reserveSeat);
}
