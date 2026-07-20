"use client";

import { GitHubIcon, YouTubeIcon } from "@/components/shared/brand-icons";
import type { ProjectDetail } from "@/curriculum/project-content/types";
import { isInlineProject } from "@/curriculum/project-content/types";
import { ProjectDescription, ProjectIdePanel } from "@/components/projects/project-ide-panel";
import { ProjectExternalPanel } from "@/components/projects/project-external-panel";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ProjectSplitViewProps {
  detail: ProjectDetail;
  isComplete: boolean;
  onProjectComplete: (done: boolean) => void;
  flush?: boolean;
}

export function ProjectSplitView({
  detail,
  isComplete,
  onProjectComplete,
  flush = false,
}: ProjectSplitViewProps) {
  const inline = isInlineProject(detail);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden",
        !flush && "rounded-xl border border-zinc-800 bg-zinc-900/30"
      )}
    >
      <div className="flex shrink-0 items-center justify-end gap-3 border-b border-zinc-800/60 px-3 py-2 sm:px-4">
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox checked={isComplete} onCheckedChange={(c) => onProjectComplete(!!c)} />
          <span className="text-xs font-medium text-zinc-300 sm:text-sm">Mark project complete</span>
        </label>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:h-full lg:overflow-hidden lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="min-h-0 overflow-y-auto overscroll-contain border-b border-zinc-800/60 lg:h-full lg:border-b-0 lg:border-r">
          <ProjectDescription
            overview={detail.overview}
            explanation={detail.explanation}
            className="lg:h-full"
            footer={
              inline ? (
                <>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-100">Run locally</h3>
                  <pre className="rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2">
                    <code className="font-mono text-[11px] text-zinc-400">{detail.runInstructions}</code>
                  </pre>
                </>
              ) : (
                <>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-100">Resources</h3>
                  <div className="space-y-2 text-xs text-zinc-500">
                    <p className="flex items-center gap-2">
                      <GitHubIcon className="h-4 w-4 text-white" />
                      GitHub reference on the right
                    </p>
                    <p className="flex items-center gap-2">
                      <YouTubeIcon className="h-4 w-4" />
                      YouTube tutorial on the right
                    </p>
                  </div>
                </>
              )
            }
          />
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain lg:h-full">
          {inline ? (
            <ProjectIdePanel detail={detail} className="min-h-[280px] lg:min-h-0 lg:h-full" />
          ) : (
            <ProjectExternalPanel detail={detail} className="min-h-[280px] lg:min-h-0 lg:h-full" />
          )}
        </div>
      </div>
    </div>
  );
}
