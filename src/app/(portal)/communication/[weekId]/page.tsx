"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { getCommunicationWeek, getCommunicationWeekProgress } from "@/curriculum/communication-skills";
import { getCommunicationDetail } from "@/curriculum/communication-skills/content";
import { getAiSkillStats } from "@/components/shared/ai-skill-week-content";
import { AiSkillStatsBar } from "@/components/shared/ai-skill-stats-bar";
import { AiLearnSplitView } from "@/components/shared/ai-learn-split-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LockedWeekMessage } from "@/components/shared/locked-week-message";
import { useTrackResumePosition } from "@/hooks/use-resume-position";

export default function CommunicationWeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId: weekIdParam } = use(params);
  const weekId = parseInt(weekIdParam, 10);
  const week = getCommunicationWeek(weekId);
  const progress = useProgressStore((s) => s.progress);
  const isLocked = useProgressStore((s) => s.isModuleWeekLocked("communication", weekId));
  const isDone = useProgressStore((s) => s.isDone);
  const toggleComplete = useProgressStore((s) => s.toggleComplete);

  const skill = week?.skill;
  const progressPct = useMemo(() => {
    if (!skill) return 0;
    return getCommunicationWeekProgress(skill, (id) => Boolean(progress.completed[id]));
  }, [skill, progress]);
  const stats = useMemo(() => {
    if (!skill) return null;
    return getAiSkillStats(skill, (id) => Boolean(progress.completed[id]));
  }, [skill, progress]);

  useTrackResumePosition(
    "communication",
    weekId,
    week?.title ?? "Communication",
    `Week ${weekId}`,
    `/communication/${weekId}`,
    Boolean(week && skill) && !isLocked
  );

  const sections = useMemo(
    () =>
      skill
        ? [
            { label: "What to Learn", kind: "topic" as const, items: skill.learningTopics },
            { label: "Practice", kind: "practice" as const, items: skill.exercises },
          ]
        : [],
    [skill]
  );

  if (!week || !skill) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">Week not found</h2>
        <Link href="/communication">
          <Button className="mt-4" variant="secondary">
            Back to Communication Skills
          </Button>
        </Link>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="mx-auto max-w-lg py-20">
        <LockedWeekMessage module="communication" weekId={weekId} />
        <div className="mt-6 text-center">
          <Link href="/communication">
            <Button variant="secondary">Back to Communication</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-zinc-950 lg:left-64">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Link href="/communication">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Badge variant="success" className="text-[10px]">
            Week {weekId}
          </Badge>
          <h1 className="hidden max-w-[160px] truncate text-sm font-semibold text-zinc-50 sm:block lg:max-w-[240px]">
            {week.title}
          </h1>
          {progressPct === 100 && (
            <Badge variant="success" className="hidden text-[10px] sm:inline-flex">
              Done
            </Badge>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
          <Progress
            value={progressPct}
            className="h-1.5 flex-1"
            indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-400"
          />
          <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-emerald-400">
            {progressPct}%
          </span>
        </div>

        {stats && <AiSkillStatsBar stats={stats} inline />}
      </header>

      <div className="shrink-0 border-b border-zinc-800/60 bg-zinc-900/30 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-xs leading-relaxed text-zinc-500">
          <span className="font-medium text-zinc-400">Focus this week:</span> {week.focus}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
        <div className="min-h-0 flex-1">
          <AiLearnSplitView
            sections={sections}
            locked={false}
            isDone={isDone}
            onToggle={toggleComplete}
            getDetail={(id, title, kind) => getCommunicationDetail(id, title, kind)}
            sidebarTitle="Topics"
          />
        </div>
      </div>
    </div>
  );
}
