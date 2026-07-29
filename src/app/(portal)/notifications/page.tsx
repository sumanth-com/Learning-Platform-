import { PortalChrome } from "@/components/portal/portal-chrome";
import { NotificationsWorkspace } from "@/components/notifications/notifications-workspace";
import { getPortalData } from "@/features/portal/lib/get-portal-data";

export const metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const { user } = await getPortalData();

  return (
    <>
      <PortalChrome
        title="Notifications"
        subtitle="Real updates from certifications and your learning activity."
        fillViewport
      />
      <NotificationsWorkspace user={user} />
    </>
  );
}
