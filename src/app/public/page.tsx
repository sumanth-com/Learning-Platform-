import { permanentRedirect } from "next/navigation";
import { SITE_ROUTES } from "@/lib/site-routes";

/** Legacy marketing URL — permanently moved to the root landing page. */
export default function LegacyPublicLandingPage() {
  permanentRedirect(SITE_ROUTES.home);
}
