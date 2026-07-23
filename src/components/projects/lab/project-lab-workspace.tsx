"use client";

import { useMemo, useState } from "react";
import { ProjectTeachPanel } from "@/components/projects/lab/project-teach-panel";
import { ProjectCodeLab } from "@/components/projects/lab/project-code-lab";
import { buildProjectLabLesson } from "@/curriculum/project-lab/teaching-lesson";
import {
  defaultLanguageForTrack,
  defaultTrackForProject,
} from "@/curriculum/project-lab/tracks";
import type {
  LabLanguage,
  LabTrack,
  ProjectLabContext,
} from "@/curriculum/project-lab/types";
import { cn } from "@/lib/utils";

type ProjectLabWorkspaceProps = {
  ctx: ProjectLabContext;
  isComplete: boolean;
  onProjectComplete: (done: boolean) => void;
  flush?: boolean;
};

export function ProjectLabWorkspace({
  ctx,
  isComplete,
  onProjectComplete,
  flush = false,
}: ProjectLabWorkspaceProps) {
  const [track, setTrack] = useState<LabTrack>(() => defaultTrackForProject(ctx));
  const [language, setLanguage] = useState<LabLanguage>(
    () => defaultLanguageForTrack(defaultTrackForProject(ctx), ctx) as LabLanguage
  );

  const lesson = useMemo(
    () => buildProjectLabLesson(ctx, track, language),
    [ctx, track, language]
  );

  const handleTrackChange = (next: LabTrack) => {
    setTrack(next);
    setLanguage(defaultLanguageForTrack(next, ctx) as LabLanguage);
  };

  return (
    <div
      data-project-lab
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground",
        !flush && "rounded-xl border border-border"
      )}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="min-h-0 overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <ProjectTeachPanel lesson={lesson} className="h-full" />
        </div>

        <div className="min-h-0 overflow-hidden">
          <ProjectCodeLab
            lesson={lesson}
            track={track}
            language={language}
            onTrackChange={handleTrackChange}
            onLanguageChange={setLanguage}
            isComplete={isComplete}
            onProjectComplete={onProjectComplete}
            className="h-full min-h-[320px] lg:min-h-0"
          />
        </div>
      </div>
    </div>
  );
}
