"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useCurriculumWeek } from "@/hooks/use-curriculum";
import { getProjectProgressPercent } from "@/lib/progress-engine";
import { getProjectDetail } from "@/curriculum/project-content";
import { isInlineProject } from "@/curriculum/project-content/types";
import {
  findProjectListing,
  isPortfolioWeek,
  resolveProject,
  getProjectMeta,
} from "@/curriculum/project-catalog";
import { ProjectSplitView } from "@/components/projects/project-split-view";
import { LockedWeekMessage } from "@/components/shared/locked-week-message";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTrackResumePosition } from "@/hooks/use-resume-position";

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ weekId: string; projectId: string }>;
}) {
  const { weekId: weekIdStr, projectId } = use(params);
  const weekId = parseInt(weekIdStr, 10);
  const curriculumWeek = useCurriculumWeek(isPortfolioWeek(weekId) ? 1 : weekId);
  const progress = useProgressStore((s) => s.progress);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked("projects", weekId));
  const isDone = useProgressStore((s) => s.isDone);
  const setProjectComplete = useProgressStore((s) => s.setProjectComplete);

  const resolved = resolveProject(weekId, projectId);
  const project = resolved?.project;
  const listing = findProjectListing(projectId);
  const meta = project ? getProjectMeta(projectId, weekId) : null;

  const detail = useMemo(() => {
    if (!project) return null;
    return getProjectDetail(project);
  }, [project]);

  const portfolio = isPortfolioWeek(weekId);
  const locked = !portfolio && isLocked;
  const projectTitle = project?.title ?? listing?.title ?? "Project";

  useTrackResumePosition(
    "projects",
    weekId,
    projectTitle,
    portfolio ? "Portfolio" : `Week ${weekId}`,
    `/projects/${weekId}/${projectId}`,
    Boolean(project) && !locked
  );

  if (!project || !detail) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Link href="/projects">
          <Button className="mt-4" variant="secondary">
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <LockedWeekMessage module="projects" weekId={weekId} />
        <Link href="/projects" className="mt-6">
          <Button variant="secondary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const projectPct = portfolio
    ? isDone(`${project.id}-complete`)
      ? 100
      : 0
    : curriculumWeek
      ? getProjectProgressPercent(project.id, curriculumWeek, progress)
      : 0;
  const isComplete = isDone(`${project.id}-complete`);
  const inline = isInlineProject(detail);

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-zinc-950 lg:left-64">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {meta && (
            <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
              {DIFFICULTY_LABEL[meta.difficulty]}
            </Badge>
          )}
          {listing && (
            <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
              {listing.category}
            </Badge>
          )}
          {!portfolio && (
            <Badge variant="purple" className="text-[10px]">
              Week {weekId}
            </Badge>
          )}
          <h1 className="hidden max-w-[140px] truncate text-sm font-semibold text-zinc-50 sm:block lg:max-w-[220px]">
            {project.title}
          </h1>
          {isComplete && (
            <Badge variant="success" className="hidden text-[10px] sm:inline-flex">
              Done
            </Badge>
          )}
          <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
            {inline ? "In-app code" : "Repo + Video"}
          </Badge>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
          <Progress value={projectPct} className="h-1.5 flex-1" />
          <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-indigo-300">
            {projectPct}%
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
        <ProjectSplitView
          detail={detail}
          isComplete={isComplete}
          onProjectComplete={(done) => setProjectComplete(project.id, done)}
          flush
        />
      </div>
    </div>
  );
}
