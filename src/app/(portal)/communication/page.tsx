import { PortalChrome } from "@/components/portal/portal-chrome";
import { CommunityGallery } from "@/components/portal/community-gallery";

export const metadata = {
  title: "Community",
};

export default function CommunicationPage() {
  return (
    <>
      <PortalChrome
        title="Community"
        subtitle="Communication skills practice that compounds with your engineering path."
      />
      <CommunityGallery />
    </>
  );
}
