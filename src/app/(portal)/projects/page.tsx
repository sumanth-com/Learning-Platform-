import { PortalChrome } from "@/components/portal/portal-chrome";
import { ProjectsGallery } from "@/components/portal/projects-gallery";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <>
      <PortalChrome
        title="Projects"
        subtitle="Ship real builds that reinforce every phase of your journey."
      />
      <ProjectsGallery />
    </>
  );
}
