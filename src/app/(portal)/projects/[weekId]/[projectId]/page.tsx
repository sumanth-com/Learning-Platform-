"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { resolveProjectRoute } from "@/curriculum/project-catalog";
import { ProjectLabWorkspace } from "@/components/projects/lab/project-lab-workspace";
import type { ProjectLabContext } from "@/curriculum/project-lab/types";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { Button } from "@/components/ui/button";
import { useTrackResumePosition } from "@/hooks/use-resume-position";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ weekId: string; projectId: string }>;
}) {
  const { weekId: moduleKey, projectId: projectKey } = use(params);
  const router = useRouter();
  const setProjectComplete = useProgressStore((s) => s.setProjectComplete);

  const resolved = useMemo(
    () => resolveProjectRoute(moduleKey, projectKey),
    [moduleKey, projectKey]
  );

  const project = resolved?.project;
  const listing = resolved?.listing;
  const canonicalHref = resolved?.href;

  useEffect(() => {
    if (!canonicalHref) return;
    const current = `/projects/${moduleKey}/${projectKey}`;
    if (current !== canonicalHref) {
      router.replace(canonicalHref);
    }
  }, [canonicalHref, moduleKey, projectKey, router]);

  const completeKey = project ? `${project.id}-complete` : "";
  const isComplete = useProgressStore((s) =>
    completeKey ? Boolean(s.progress.completed[completeKey]) : false
  );

  const labCtx: ProjectLabContext | null = useMemo(() => {
    if (!project || !listing) return null;
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      moduleNumber: listing.moduleNumber,
      moduleTitle: listing.moduleTitle,
      moduleSlug: listing.moduleSlug,
      difficulty: listing.difficulty,
      category: listing.category,
      features: project.features ?? [],
    };
  }, [project, listing]);

  const projectTitle = project?.title ?? listing?.title ?? "Project";
  const moduleLabel = listing
    ? `Module ${listing.moduleNumber}`
    : "Module";
  const galleryModuleHref = listing
    ? `/projects?module=${listing.moduleSlug}`
    : "/projects";

  useTrackResumePosition(
    "projects",
    listing?.moduleNumber ?? 0,
    projectTitle,
    listing?.moduleTitle ?? moduleLabel,
    canonicalHref ?? `/projects/${moduleKey}/${projectKey}`,
    Boolean(project)
  );

  const breadcrumbs = useMemo(
    () => [
      {
        label: moduleLabel,
        href: galleryModuleHref,
      },
      {
        label: listing?.moduleTitle ?? "Module",
        href: galleryModuleHref,
      },
      { label: projectTitle },
    ],
    [moduleLabel, listing?.moduleTitle, galleryModuleHref, projectTitle]
  );

  if (!project || !labCtx || !listing) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <PortalChrome title="Projects" fillViewport />
        <h2 className="text-xl font-semibold text-foreground">Project not found</h2>
        <Link href="/projects">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden pl-3 pr-3 sm:pl-4 sm:pr-4">
      <PortalChrome breadcrumbs={breadcrumbs} fillViewport />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden py-3 sm:py-4">
        <ProjectLabWorkspace
          ctx={labCtx}
          isComplete={isComplete}
          onProjectComplete={(done) => setProjectComplete(project.id, done)}
          flush
        />
      </div>
    </div>
  );
}
