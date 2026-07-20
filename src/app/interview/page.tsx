import { PortalPage } from "@/components/portal/portal-page";
import { InterviewGallery } from "@/components/portal/interview-gallery";

export const metadata = {
  title: "Interview Prep",
};

export default function InterviewPage() {
  return (
    <PortalPage
      title="Interview Prep"
      subtitle="Structured question banks and packs for technical interviews."
    >
      <InterviewGallery />
    </PortalPage>
  );
}
