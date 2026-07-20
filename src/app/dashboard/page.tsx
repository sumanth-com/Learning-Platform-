import { DashboardHome } from "@/components/portal/dashboard-home";
import { PortalPage } from "@/components/portal/portal-page";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <PortalPage>
      {(data) => (
        <DashboardHome
          displayName={data.user.name}
          continueState={data.continueState}
          journey={data.journey}
        />
      )}
    </PortalPage>
  );
}
