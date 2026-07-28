import { redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { SettingsWorkspace } from "@/components/settings/settings-workspace";
import { getCurrentUser } from "@/features/auth/actions/auth-actions";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getCurrentUser();
  if (!session) redirect(AUTH_ROUTES.login);

  const { user, profile } = session;

  return (
    <>
      <PortalChrome
        title="Settings"
        subtitle="Appearance, password, and notification preferences."
      />
      <SettingsWorkspace
        email={user.email || profile?.email || ""}
        fullName={profile?.full_name ?? undefined}
      />
    </>
  );
}
