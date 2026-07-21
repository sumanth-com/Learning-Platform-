import { PortalChrome } from "@/components/portal/portal-chrome";
import { InterviewGallery } from "@/components/portal/interview-gallery";

export const metadata = {
  title: "Interview Prep",
};

export default function InterviewPage() {
  return (
    <>
      <PortalChrome
        title="Interview Prep"
        subtitle="Structured question banks and packs for technical interviews."
      />
      <InterviewGallery />
    </>
  );
}
