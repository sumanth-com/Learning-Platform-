import { PortalPage } from "@/components/portal/portal-page";
import { ProjectsGallery } from "@/components/portal/projects-gallery";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PortalPage
      title="Projects"
      subtitle="Ship real builds that reinforce every phase of your journey."
    >
      <ProjectsGallery />
    </PortalPage>
  );
}
