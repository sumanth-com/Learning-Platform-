"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useCurriculumWeek, useWeekProgress } from "@/hooks/use-curriculum";
import { AISkillWeekContent, getAiSkillStats } from "@/components/shared/ai-skill-week-content";
import { AiSkillStatsBar } from "@/components/shared/ai-skill-stats-bar";
import {
  getProfessionalAiSkill,
  isProfessionalAiWeek,
} from "@/curriculum/ai-skills-professional";
import { LockedWeekMessage } from "@/components/shared/locked-week-message";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTrackResumePosition } from "@/hooks/use-resume-position";

export default function AISkillWeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const weekId = parseInt(id, 10);
  const isProfessional = isProfessionalAiWeek(weekId);
  const curriculumWeek = useCurriculumWeek(isProfessional ? 1 : weekId);
  const weekProgress = useWeekProgress(isProfessional ? 1 : weekId);
  const isModuleLocked = useProgressStore((s) => s.isModuleWeekLocked("ai-skills", weekId));
  const isLocked = isModuleLocked;
  const isDone = useProgressStore((s) => s.isDone);
  const progress = useProgressStore((s) => s.progress);
  const toggleComplete = useProgressStore((s) => s.toggleComplete);

  const skill = isProfessional ? getProfessionalAiSkill() : curriculumWeek?.aiSkill;

  const professionalPct = useMemo(() => {
    if (!isProfessional || !skill) return 0;
    const stats = getAiSkillStats(skill, (id) => Boolean(progress.completed[id]));
    return stats.overallPct;
  }, [isProfessional, skill, progress]);

  const displayTitle = skill?.title.replace(/^AI Skill of the Week — /, "") ?? "AI Skills";

  useTrackResumePosition(
    "ai-skills",
    weekId,
    displayTitle,
    isProfessional ? "Professional track" : `Week ${weekId}`,
    `/ai-skills/${weekId}`,
    Boolean(skill) && !isLocked
  );

  if (!skill || (!isProfessional && !curriculumWeek)) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">Module not found</h2>
        <Link href="/ai-skills">
          <Button className="mt-4" variant="secondary">
            Back to AI Skills
          </Button>
        </Link>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <LockedWeekMessage module="ai-skills" weekId={weekId} />
        <Link href="/ai-skills" className="mt-6">
          <Button variant="secondary">Back to AI Skills</Button>
        </Link>
      </div>
    );
  }

  const aiPct = isProfessional ? professionalPct : (weekProgress?.ai.percentage ?? 0);
  const stats = useMemo(
    () => getAiSkillStats(skill, (id) => Boolean(progress.completed[id])),
    [skill, progress]
  );

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-zinc-950 lg:left-64">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Link href="/ai-skills">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Badge variant="purple" className="text-[10px]">
            {isProfessional ? "Professional" : `Week ${weekId}`}
          </Badge>
          <h1 className="hidden max-w-[140px] truncate text-sm font-semibold text-zinc-50 sm:block lg:max-w-[200px]">
            {displayTitle}
          </h1>
          {aiPct === 100 && (
            <Badge variant="success" className="hidden text-[10px] sm:inline-flex">
              Done
            </Badge>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
          <Progress value={aiPct} className="h-1.5 flex-1" />
          <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-indigo-300">
            {aiPct}%
          </span>
        </div>

        <AiSkillStatsBar stats={stats} inline />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
        <div className="min-h-0 flex-1">
          <AISkillWeekContent
            skill={skill}
            locked={false}
            isDone={isDone}
            onToggle={toggleComplete}
          />
        </div>
      </div>
    </div>
  );
}
