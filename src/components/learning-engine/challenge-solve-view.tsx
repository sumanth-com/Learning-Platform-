"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLearningWeek } from "@/learning-engine/loader";
import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import { lessonEntityId } from "@/learning-engine/types";
import { groupByProblemType, lessonsByDifficulty } from "@/learning-engine/labels";
import { ProblemDocument } from "./problem-document";
import { HackerrankEditor } from "./hackerrank-editor";
import { lessonHasWorkspace } from "./editor-workspace";
import { cn } from "@/lib/utils";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { usePersistScroll } from "@/hooks/use-persist-scroll";

const SIDE_TABS = [
  { id: "problem" as const, label: "Problem" },
  { id: "hints" as const, label: "Hints" },
];

interface ChallengeSolveViewProps {
  weekId: number;
}

export function ChallengeSolveView({ weekId }: ChallengeSolveViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const week = getLearningWeek(weekId);

  const [topicSlug, setTopicSlug] = useState(searchParams.get("topic") ?? "");
  const [lessonId, setLessonId] = useState(searchParams.get("lesson") ?? "");
  const [difficulty, setDifficulty] = useState<LearnDifficulty>(
    (searchParams.get("difficulty") as LearnDifficulty) ?? "easy"
  );
  const [problemType, setProblemType] = useState(searchParams.get("type") ?? "");
  const [sideTab, setSideTab] = useState<"problem" | "hints">("problem");
  const [splitPct, setSplitPct] = useState(42);
  const splitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTopicSlug(searchParams.get("topic") ?? "");
    setLessonId(searchParams.get("lesson") ?? "");
    const d = searchParams.get("difficulty") as LearnDifficulty;
    if (d === "easy" || d === "medium" || d === "hard") setDifficulty(d);
    setProblemType(searchParams.get("type") ?? "");
  }, [searchParams]);

  const topicBundle = useMemo(() => {
    if (!week || !topicSlug) return null;
    return week.topics.find((t) => t.topic.slug === topicSlug) ?? null;
  }, [week, topicSlug]);

  const activeLesson: LearnLesson | null = useMemo(() => {
    if (!lessonId || !topicBundle) return null;
    return topicBundle.lessons.find((l) => l.id === lessonId) ?? null;
  }, [topicBundle, lessonId]);

  const syncUrl = useCallback(
    (topic: string, lesson: string, diff: LearnDifficulty, type: string) => {
      const params = new URLSearchParams();
      if (topic) params.set("topic", topic);
      if (lesson) params.set("lesson", lesson);
      params.set("difficulty", diff);
      if (type) params.set("type", type);
      router.replace(`/roadmap/week/${weekId}/learn?${params.toString()}`, { scroll: false });
    },
    [router, weekId]
  );

  useEffect(() => {
    if (!week || topicSlug) return;
    const first = week.topics[0];
    if (first) {
      setTopicSlug(first.topic.slug);
      syncUrl(first.topic.slug, "", "easy", "");
    }
  }, [week, topicSlug, syncUrl]);

  useEffect(() => {
    if (!topicBundle) return;
    const diffLessons = lessonsByDifficulty(topicBundle.lessons, difficulty);
    if (!diffLessons.length) return;
    const grouped = groupByProblemType(diffLessons);
    const types = Array.from(grouped.keys());
    const type = problemType && grouped.has(problemType) ? problemType : types[0] ?? "logic";
    const list = grouped.get(type) ?? diffLessons;
    const current = list.find((l) => l.id === lessonId);
    if (!current && list[0]) {
      setLessonId(list[0].id);
      setProblemType(type);
      syncUrl(topicSlug, list[0].id, difficulty, type);
    }
  }, [topicBundle, difficulty, problemType, lessonId, topicSlug, syncUrl]);

  const scrollKey = useMemo(
    () => (activeLesson ? `challenge-${weekId}-${topicSlug}-${activeLesson.id}` : ""),
    [weekId, topicSlug, activeLesson]
  );
  const problemScrollRef = usePersistScroll(scrollKey, Boolean(activeLesson));

  const resumeHref = useMemo(() => {
    if (!topicSlug || !activeLesson) return "";
    const params = new URLSearchParams();
    params.set("topic", topicSlug);
    params.set("lesson", activeLesson.id);
    params.set("difficulty", difficulty);
    if (problemType) params.set("type", problemType);
    return `/roadmap/week/${weekId}/learn?${params.toString()}`;
  }, [weekId, topicSlug, activeLesson, difficulty, problemType]);

  useTrackResumePosition(
    "practice",
    weekId,
    topicBundle ? `Week ${weekId} · ${topicBundle.topic.title}` : `Week ${weekId}`,
    activeLesson
      ? `${activeLesson.title} · ${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`
      : undefined,
    resumeHref,
    Boolean(topicBundle && activeLesson),
    activeLesson && topicBundle
      ? {
          topicSlug,
          topicTitle: topicBundle.topic.title,
          lessonId: activeLesson.id,
          lessonTitle: activeLesson.title,
          entityId: lessonEntityId({ weekId, topicSlug, id: activeLesson.id }),
          difficulty,
          problemType: activeLesson.problemType,
          scrollKey,
        }
      : undefined
  );

  if (!week) {
    return <p className="p-8 text-center text-zinc-500">Week content not found.</p>;
  }

  if (!topicBundle || !activeLesson) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-zinc-500">Select a challenge from the week hub to start solving.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0d0d0d]">
      <div ref={splitRef} className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left: vertical tabs + problem pane */}
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
            <ProblemDocument lesson={activeLesson} tab={sideTab} />
          </div>
        </div>

        {/* Split handle */}
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

        {/* Right: code editor */}
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {lessonHasWorkspace(activeLesson) ? (
            <HackerrankEditor key={activeLesson.id} lesson={activeLesson} />
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

interface LearningEngineViewProps {
  weekId: number;
  weekTitle: string;
  flush?: boolean;
}

/** HackerRank-style split solve UI (problem left, editor right). */
export function LearningEngineView({ weekId }: LearningEngineViewProps) {
  return <ChallengeSolveView weekId={weekId} />;
}
