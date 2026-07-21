"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { ProblemDocument } from "@/components/learning-engine/problem-document";
import { HackerrankEditor } from "@/components/learning-engine/hackerrank-editor";
import { lessonHasWorkspace } from "@/components/learning-engine/editor-workspace";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { TopicChallenge } from "@/features/curriculum/lib/topic-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { isProgrammingFundamentalsModule } from "@/features/curriculum/lib/programming-fundamentals";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { cn } from "@/lib/utils";
import { usePersistScroll } from "@/hooks/use-persist-scroll";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

const SIDE_TABS = [
  { id: "problem" as const, label: "Problem" },
  { id: "hints" as const, label: "Hints" },
];

type ModuleChallengeSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: TopicChallenge;
};

export function ModuleChallengeSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: ModuleChallengeSolveProps) {
  const hydrated = useStoreHydrated();
  const lesson = challenge.lesson;
  const [sideTab, setSideTab] = useState<"problem" | "hints">("problem");
  const [splitPct, setSplitPct] = useState(42);
  const splitRef = useRef<HTMLDivElement>(null);

  const entityId = useMemo(
    () =>
      curriculumChallengeEntityId(moduleSlug, {
        weekId: challenge.weekId || 0,
        topicSlug: challenge.topicSlug,
        lesson,
      }),
    [challenge.topicSlug, challenge.weekId, lesson, moduleSlug]
  );

  const { isDone, toggle } = useEntityProgress(entityId);
  const scrollKey = `module-challenge-${moduleSlug}-${topicSlug}-${lesson.id}`;
  const problemScrollRef = usePersistScroll(scrollKey, true);
  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  useTrackResumePosition(
    "roadmap",
    Math.max(1, challenge.weekId || 1),
    `${moduleTitle} · ${topicTitle}`,
    lesson.title,
    solveHref,
    hydrated,
    {
      topicSlug,
      topicTitle,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      entityId,
      difficulty: lesson.difficulty,
      problemType: lesson.problemType,
      scrollKey,
    }
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0d0d0d]">
      <header className="flex shrink-0 items-center gap-3 border-b border-zinc-800 px-3 py-2 sm:px-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Challenges
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-wider text-zinc-600">
            {moduleTitle} / {topicTitle}
          </p>
          <p className="truncate text-sm font-medium text-zinc-200">
            {lesson.title}
          </p>
          {isProgrammingFundamentalsModule(moduleSlug) ? (
            <p className="mt-0.5 truncate text-[10px] text-zinc-500">
              Developer mindset · {lesson.difficulty} · fresher practice
            </p>
          ) : null}
        </div>
        <Button
          variant={isDone ? "secondary" : "default"}
          size="sm"
          className={cn(
            "h-8 shrink-0 gap-1.5 text-xs",
            !isDone && "bg-emerald-600 hover:bg-emerald-500"
          )}
          onClick={() => toggle(entityId)}
        >
          {isDone ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Circle className="h-3.5 w-3.5" />
          )}
          {isDone ? "Solved" : "Mark as complete"}
        </Button>
      </header>

      <div ref={splitRef} className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className="flex min-h-0 shrink-0 overflow-hidden border-r border-zinc-800"
          style={{ width: `${splitPct}%` }}
        >
          <nav className="flex w-10 shrink-0 flex-col border-r border-zinc-800 bg-[#0a0a0a]">
            {SIDE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSideTab(tab.id)}
                className={cn(
                  "flex min-h-[88px] flex-1 items-center justify-center border-b border-zinc-800/80 px-1 py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors [writing-mode:vertical-rl] rotate-180",
                  sideTab === tab.id
                    ? "bg-[#1a1a1a] text-emerald-400"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div
            ref={problemScrollRef}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[#1a1a1a]"
          >
            <ProblemDocument lesson={lesson} tab={sideTab} />
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          className="group relative w-1 shrink-0 cursor-col-resize bg-zinc-800 hover:bg-emerald-600/40"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startPct = splitPct;
            const width = splitRef.current?.clientWidth ?? window.innerWidth;
            const onMove = (ev: MouseEvent) => {
              const delta = ((ev.clientX - startX) / width) * 100;
              setSplitPct(Math.min(65, Math.max(25, startPct + delta)));
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {lessonHasWorkspace(lesson) ? (
            <HackerrankEditor key={lesson.id} lesson={lesson} />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#0a0a0b] text-sm text-zinc-500">
              No code editor for this challenge type.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
