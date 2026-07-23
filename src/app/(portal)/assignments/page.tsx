import { Suspense } from "react";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { AssignmentsGallery } from "@/components/assignments/journey/assignments-gallery";

export const metadata = {
  title: "Assignments",
};

export default function AssignmentsPage() {
  return (
    <>
      <PortalChrome
        title="Assignments"
        subtitle="Ship module-aligned deliverables that prove real engineering skill."
      />
      <Suspense
        fallback={
          <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
            Loading assignments…
          </div>
        }
      >
        <AssignmentsGallery />
      </Suspense>
    </>
  );
}
