import { PortalChrome } from "@/components/portal/portal-chrome";
import { NotificationsWorkspace } from "@/components/notifications/notifications-workspace";

export const metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return (
    <>
      <PortalChrome
        title="Notifications"
        subtitle="Real updates from certifications and your learning activity."
      />
      <NotificationsWorkspace />
    </>
  );
}
