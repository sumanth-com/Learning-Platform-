import { FeatureHub } from "@/components/portal/feature-hub";
import { PORTAL_ROUTES } from "@/features/portal/types";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <FeatureHub
      title="Settings"
      description="Manage preferences, notification defaults, and learning experience options."
      bullets={[
        "Profile and account details",
        "Study reminders and streak preferences",
        "Theme and accessibility options",
      ]}
      primaryHref={PORTAL_ROUTES.profile}
      primaryLabel="View profile"
    />
  );
}
