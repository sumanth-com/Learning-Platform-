import { PortalChrome } from "@/components/portal/portal-chrome";
import { HelpWorkspace } from "@/components/help/help-workspace";
import { getPortalData } from "@/features/portal/lib/get-portal-data";
import { getBrand } from "@/lib/email/env";

export const metadata = {
  title: "Help",
};

export default async function HelpPage() {
  const { user } = await getPortalData();
  const brand = getBrand();

  return (
    <>
      <PortalChrome
        title="Help"
        subtitle="Guides, answers, and shortcuts to get the most from SupraBase."
      />
      <HelpWorkspace
        userName={user.name}
        supportEmail={brand.supportEmail}
      />
    </>
  );
}
