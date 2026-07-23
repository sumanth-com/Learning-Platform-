import { Suspense } from "react";
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
      <Suspense
        fallback={
          <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
            Loading projects…
          </div>
        }
      >
        <ProjectsGallery />
      </Suspense>
    </>
  );
}
