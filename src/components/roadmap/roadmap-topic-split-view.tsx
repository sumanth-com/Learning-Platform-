"use client";



import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { FilterGroup, FilterSelect } from "@/components/shared/filter-pills";

import { ProjectDescription, ProjectIdePanel } from "@/components/projects/project-ide-panel";

import type { RoadmapSubtopicLesson, RoadmapTopicLessons } from "@/curriculum/java-roadmap/lesson-types";

import { cn } from "@/lib/utils";

import { BookOpen, CheckCircle2, Code2 } from "lucide-react";



interface RoadmapTopicSplitViewProps {

  lessons: RoadmapTopicLessons;

  topicTitle: string;

  sectionSlug: string;

  flush?: boolean;

}



type DifficultyFilter = "all" | "easy" | "medium" | "hard";



const DIFFICULTY_OPTIONS: { value: DifficultyFilter; label: string }[] = [

  { value: "all", label: "All Levels" },

  { value: "easy", label: "Easy" },

  { value: "medium", label: "Medium" },

  { value: "hard", label: "Hard" },

];



const DIFFICULTY_BADGE: Record<string, string> = {

  easy: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",

  medium: "bg-amber-500/15 text-amber-400 ring-amber-500/30",

  hard: "bg-rose-500/15 text-rose-400 ring-rose-500/30",

};



function DifficultyBadge({ level }: { level?: string }) {

  if (!level) return null;

  return (

    <span

      className={cn(

        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",

        DIFFICULTY_BADGE[level] ?? "bg-zinc-800 text-zinc-400"

      )}

    >

      {level}

    </span>

  );

}



function patternLabel(lesson: RoadmapSubtopicLesson) {

  const tag = lesson.difficulty ? `[${lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}] ` : "";

  return `${tag}${lesson.title}`;

}



function GuidePanel({ lesson }: { lesson: RoadmapSubtopicLesson }) {

  return (

    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0b]">

      <div className="border-b border-zinc-800 px-4 py-3">

        <div className="flex items-center gap-2 text-indigo-300">

          <BookOpen className="h-4 w-4" />

          <span className="text-sm font-semibold">Study Guide</span>

          <DifficultyBadge level={lesson.difficulty} />

        </div>

      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">

        <ul className="space-y-3">

          {(lesson.guidePoints ?? []).map((point) => (

            <li key={point} className="flex gap-2 text-sm text-zinc-300">

              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />

              <span>{point}</span>

            </li>

          ))}

        </ul>

        {(!lesson.guidePoints || lesson.guidePoints.length === 0) && (

          <p className="text-sm text-zinc-400">{lesson.explanation}</p>

        )}

      </div>

    </div>

  );

}



function EmptyLessonState({ topicTitle }: { topicTitle: string }) {

  return (

    <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center">

      <Code2 className="mb-3 h-10 w-10 text-zinc-600" />

      <p className="text-sm font-medium text-zinc-300">Select a topic to begin</p>

      <p className="mt-1 max-w-sm text-xs text-zinc-500">

        Choose topic → difficulty → problem. Easy, Medium & Hard code like LeetCode for {topicTitle}.

      </p>

    </div>

  );

}



export function RoadmapTopicSplitView({

  lessons,

  topicTitle,

  sectionSlug,

  flush = false,

}: RoadmapTopicSplitViewProps) {

  const router = useRouter();

  const searchParams = useSearchParams();



  const topicItems = useMemo(

    () => lessons.subtopics.filter((s) => s.category === "topics"),

    [lessons.subtopics]

  );



  const initialTopic = searchParams.get("topic") ?? "";

  const initialPattern = searchParams.get("pattern") ?? "";

  const initialDifficulty = (searchParams.get("difficulty") as DifficultyFilter) ?? "all";



  const [selectedTopicId, setSelectedTopicId] = useState(initialTopic);

  const [selectedPatternId, setSelectedPatternId] = useState(initialPattern);

  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(initialDifficulty);



  useEffect(() => {

    setSelectedTopicId(searchParams.get("topic") ?? "");

    setSelectedPatternId(searchParams.get("pattern") ?? "");

    setDifficultyFilter((searchParams.get("difficulty") as DifficultyFilter) ?? "all");

  }, [searchParams]);



  const allPatternItems = useMemo(() => {

    if (!selectedTopicId) return [];

    return lessons.subtopics.filter(

      (s) => s.category === "patterns" && s.parentTopic === selectedTopicId

    );

  }, [lessons.subtopics, selectedTopicId]);



  const patternItems = useMemo(() => {

    if (difficultyFilter === "all") return allPatternItems;

    return allPatternItems.filter((s) => s.difficulty === difficultyFilter);

  }, [allPatternItems, difficultyFilter]);



  const difficultyCounts = useMemo(() => {

    const c = { easy: 0, medium: 0, hard: 0 };

    for (const p of allPatternItems) {

      if (p.difficulty && p.difficulty in c) c[p.difficulty as keyof typeof c]++;

    }

    return c;

  }, [allPatternItems]);



  const syncUrl = useCallback(

    (topic: string, pattern: string, difficulty: DifficultyFilter) => {

      const params = new URLSearchParams();

      if (topic) params.set("topic", topic);

      if (pattern) params.set("pattern", pattern);

      if (difficulty !== "all") params.set("difficulty", difficulty);

      const qs = params.toString();

      const isWeek = sectionSlug.startsWith("week-");

      const base = isWeek ? `/roadmap/week/${sectionSlug.replace("week-", "")}` : `/roadmap/topic/${sectionSlug}`;

      router.replace(qs ? `${base}?${qs}` : base, { scroll: false });

    },

    [router, sectionSlug]

  );



  const handleTopicChange = (id: string) => {

    setSelectedTopicId(id);

    setSelectedPatternId("");

    syncUrl(id, "", difficultyFilter);

  };



  const handlePatternChange = (id: string) => {

    setSelectedPatternId(id);

    syncUrl(selectedTopicId, id, difficultyFilter);

  };



  const handleDifficultyChange = (d: string) => {

    const next = d as DifficultyFilter;

    setDifficultyFilter(next);

    setSelectedPatternId("");

    syncUrl(selectedTopicId, "", next);

  };



  const active: RoadmapSubtopicLesson | null = useMemo(() => {

    if (selectedPatternId) {

      return lessons.subtopics.find((s) => s.id === selectedPatternId) ?? null;

    }

    if (selectedTopicId) {

      return lessons.subtopics.find((s) => s.id === selectedTopicId && s.category === "topics") ?? null;

    }

    return null;

  }, [lessons.subtopics, selectedTopicId, selectedPatternId]);



  return (

    <div

      className={cn(

        "flex h-full min-h-0 flex-col overflow-hidden",

        !flush && "rounded-xl border border-zinc-800 bg-zinc-900/30"

      )}

    >

      <div className="shrink-0 border-b border-zinc-800/60 px-3 py-3 sm:px-4">

        <div className="grid gap-2.5 sm:grid-cols-3">

          <FilterGroup label="Topics" className="min-w-0">

            <FilterSelect

              label="Topics"

              placeholder="Select"

              value={selectedTopicId}

              onChange={(id) => handleTopicChange(String(id))}

              options={topicItems.map((s) => ({ value: s.id, label: s.title }))}

              className={cn(selectedTopicId && !selectedPatternId && "rounded-lg ring-1 ring-indigo-500/40")}

            />

          </FilterGroup>

          <FilterGroup label="Difficulty" className="min-w-0">

            <FilterSelect

              label="Difficulty"

              placeholder="All Levels"

              value={difficultyFilter}

              onChange={(id) => handleDifficultyChange(String(id))}

              options={DIFFICULTY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}

              className={cn(!selectedTopicId && "pointer-events-none opacity-50")}

            />

          </FilterGroup>

          <FilterGroup label="Problems" className="min-w-0">

            <FilterSelect

              label="Patterns"

              placeholder={

                selectedTopicId

                  ? `Select (${patternItems.length} ${difficultyFilter === "all" ? "total" : difficultyFilter})`

                  : "Select topic first"

              }

              value={selectedPatternId}

              onChange={(id) => handlePatternChange(String(id))}

              options={patternItems.map((s) => ({ value: s.id, label: patternLabel(s) }))}

              className={cn(

                selectedPatternId && "rounded-lg ring-1 ring-indigo-500/40",

                !selectedTopicId && "pointer-events-none opacity-50"

              )}

            />

          </FilterGroup>

        </div>

        {selectedTopicId && (

          <div className="mt-2 flex flex-wrap gap-2">

            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">

              Easy {difficultyCounts.easy}

            </span>

            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">

              Medium {difficultyCounts.medium}

            </span>

            <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">

              Hard {difficultyCounts.hard}

            </span>

          </div>

        )}

        <p className="mt-2 truncate text-xs text-zinc-500">

          {active ? (

            <>

              <DifficultyBadge level={active.difficulty} />

              {" "}

              <span className="font-medium text-indigo-300">{active.title}</span>

              {selectedTopicId && (

                <>

                  {" · "}

                  {patternItems.length} problems

                  {difficultyFilter !== "all" ? ` (${difficultyFilter})` : ""}

                </>

              )}

            </>

          ) : (

            <>

              {topicItems.length} topics — pick Easy / Medium / Hard problems like LeetCode

            </>

          )}

        </p>

      </div>



      {!active ? (

        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">

          <EmptyLessonState topicTitle={topicTitle} />

        </div>

      ) : (

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:h-full lg:overflow-hidden lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">

          <div className="min-h-0 overflow-y-auto overscroll-contain border-b border-zinc-800/60 lg:h-full lg:border-b-0 lg:border-r">

            <ProjectDescription

              overview={active.definition}

              explanation={active.explanation}

              className="lg:h-full"

              footer={

                <div className="flex items-center gap-2">

                  <DifficultyBadge level={active.difficulty} />

                  <p className="text-xs text-zinc-500">

                    Switch filters above — output clears until Run.

                  </p>

                </div>

              }

            />

          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:h-full">

            {active.kind === "code" && active.code && active.filename && active.sampleOutput ? (

              <ProjectIdePanel

                key={active.id}

                detail={{

                  mode: "inline",

                  overview: active.definition,

                  explanation: active.explanation,

                  code: active.code,

                  filename: active.filename,

                  sampleOutput: active.sampleOutput,

                  sampleInput: active.sampleInput,

                  runInstructions: active.runInstructions ?? `javac ${active.filename}\njava Main`,

                }}

                className="min-h-[280px] lg:min-h-0 lg:h-full"

              />

            ) : (

              <GuidePanel key={active.id} lesson={active} />

            )}

          </div>

        </div>

      )}

    </div>

  );

}

