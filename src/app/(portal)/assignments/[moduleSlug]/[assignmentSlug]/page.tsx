"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { resolveAssignmentRoute } from "@/curriculum/assignment-catalog";
import { AssignmentLabWorkspace } from "@/components/assignments/journey/assignment-lab-workspace";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/store/use-progress-store";
import { useTrackResumePosition } from "@/hooks/use-resume-position";

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; assignmentSlug: string }>;
}) {
  const { moduleSlug, assignmentSlug } = use(params);
  const router = useRouter();
  const setAssignmentComplete = useProgressStore((s) => s.setAssignmentComplete);
  const setAssignmentSubmission = useProgressStore(
    (s) => s.setAssignmentSubmission
  );

  const resolved = useMemo(
    () => resolveAssignmentRoute(moduleSlug, assignmentSlug),
    [moduleSlug, assignmentSlug]
  );

  const listing = resolved?.listing;
  const canonicalHref = resolved?.href;

  useEffect(() => {
    if (!canonicalHref) return;
    const current = `/assignments/${moduleSlug}/${assignmentSlug}`;
    if (current !== canonicalHref) router.replace(canonicalHref);
  }, [canonicalHref, moduleSlug, assignmentSlug, router]);

  const completeKey = listing ? `${listing.id}-complete` : "";
  const isComplete = useProgressStore((s) =>
    completeKey ? Boolean(s.progress.completed[completeKey]) : false
  );
  const meta = useProgressStore((s) =>
    listing ? s.progress.assignmentMeta?.[listing.id] : undefined
  );

  useTrackResumePosition(
    "projects",
    listing?.moduleNumber ?? 0,
    listing?.title ?? "Assignment",
    listing?.displayModuleTitle ?? "Assignments",
    canonicalHref ?? `/assignments/${moduleSlug}/${assignmentSlug}`,
    Boolean(listing)
  );

  const breadcrumbs = useMemo(() => {
    if (!listing) return [];
    const galleryHref = `/assignments?module=${listing.moduleSlug}`;
    return [
      {
        label: `Module ${listing.moduleNumber}`,
        href: galleryHref,
      },
      {
        label: listing.displayModuleTitle,
        href: galleryHref,
      },
      { label: listing.title },
    ];
  }, [listing]);

  if (!listing || !resolved) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <PortalChrome title="Assignments" fillViewport />
        <h2 className="text-xl font-semibold text-foreground">
          Assignment not found
        </h2>
        <Link href="/assignments">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PortalChrome breadcrumbs={breadcrumbs} fillViewport />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AssignmentLabWorkspace
          listing={listing}
          isComplete={isComplete}
          meta={meta}
          onToggleComplete={(done) => setAssignmentComplete(listing.id, done)}
          onSaveSubmission={(updates) =>
            setAssignmentSubmission(listing.id, updates)
          }
        />
      </div>
    </div>
  );
}
