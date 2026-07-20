import { PortalPage } from "@/components/portal/portal-page";
import { CommunityGallery } from "@/components/portal/community-gallery";

export const metadata = {
  title: "Community",
};

export default function CommunicationPage() {
  return (
    <PortalPage
      title="Community"
      subtitle="Communication skills practice that compounds with your engineering path."
    >
      <CommunityGallery />
    </PortalPage>
  );
}
