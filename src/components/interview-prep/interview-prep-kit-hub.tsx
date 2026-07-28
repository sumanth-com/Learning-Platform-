"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Lock,
  Play,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import {
  getInterviewAcademySections,
  isInterviewAcademyModule,
} from "@/features/curriculum/lib/interview-academy";
import { listInterviewAcademyChallenges } from "@/features/curriculum/lib/interview-academy-challenges";
import {
  getSystemsAcademySections,
  isSystemsAcademyModule,
} from "@/features/curriculum/lib/systems-academy";
import { listSystemsAcademyChallenges } from "@/features/curriculum/lib/systems-academy-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useProgressStore } from "@/store/use-progress-store";
import { cn } from "@/lib/utils";
import type { LearnDifficulty } from "@/learning-engine/types";

type KitChallenge = {
  id: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  entityId: string;
};

type KitTopic = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  challenges: KitChallenge[];
};

type KitSection = {
  slug: string;
  title: string;
  description: string;
  topics: KitTopic[];
};

function difficultyLabel(d: LearnDifficulty): string {
  if (d === "easy" || d === "beginner") return "Easy";
  if (d === "medium" || d === "intermediate") return "Medium";
  return "Hard";
}

function difficultyTone(d: LearnDifficulty): string {
  if (d === "easy" || d === "beginner") return "text-emerald-600";
  if (d === "medium" || d === "intermediate") return "text-amber-600";
  return "text-rose-600";
}

function buildSections(moduleSlug: string): KitSection[] {
  if (isInterviewAcademyModule(moduleSlug)) {
    return getInterviewAcademySections().map((section) => ({
      slug: section.slug,
      title: section.title,
      description: section.description,
      topics: section.topics.map((topic) => ({
        slug: topic.slug,
        title: topic.title,
        summary: topic.summary,
        estimatedMinutes: topic.estimatedMinutes,
        challenges: listInterviewAcademyChallenges(topic.slug).map((c) => ({
          id: c.id,
          title: c.title,
          difficulty: c.difficulty,
          minutes: c.minutes,
          entityId: curriculumChallengeEntityId(moduleSlug, {
            weekId: c.weekId || 0,
            topicSlug: c.topicSlug,
            lesson: c.lesson,
          }),
        })),
      })),
    }));
  }

  return getSystemsAcademySections().map((section) => ({
    slug: section.slug,
    title: section.title,
    description: section.description,
    topics: section.topics.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      estimatedMinutes: topic.estimatedMinutes,
      challenges: listSystemsAcademyChallenges(topic.slug).map((c) => ({
        id: c.id,
        title: c.title,
        difficulty: c.difficulty,
        minutes: c.minutes,
        entityId: curriculumChallengeEntityId(moduleSlug, {
          weekId: c.weekId || 0,
          topicSlug: c.topicSlug,
          lesson: c.lesson,
        }),
      })),
    })),
  }));
}

type InterviewPrepKitHubProps = {
  payload: ModuleHubPayload;
};

export function InterviewPrepKitHub({ payload }: InterviewPrepKitHubProps) {
  const { detail } = payload;
  const moduleSlug = detail.module.slug;
  const hydrated = useStoreHydrated();
  const isDoneFn = useProgressStore((s) => s.isDone);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const sections = useMemo(() => buildSections(moduleSlug), [moduleSlug]);

  const allChallenges = useMemo(
    () => sections.flatMap((s) => s.topics.flatMap((t) => t.challenges)),
    [sections]
  );

  const completedCount = hydrated
    ? allChallenges.filter((c) => isDoneFn(c.entityId)).length
    : 0;
  const totalCount = allChallenges.length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const kitTitle = isInterviewAcademyModule(moduleSlug)
    ? "Interview Preparation Kit"
    : "System Design Preparation Kit";
  const kitBlurb = isInterviewAcademyModule(moduleSlug)
    ? "Master the patterns companies actually ask — clarify, approach, code aloud, and verify under time pressure."
    : "Practice system design and behavioral storytelling the way real interview loops run — structure first, then depth.";

  // Open first incomplete section by default once hydrated
  const defaultSection = useMemo(() => {
    for (const section of sections) {
      const done = section.topics.every((t) =>
        t.challenges.every((c) => (hydrated ? isDoneFn(c.entityId) : false))
      );
      if (!done) return section.slug;
    }
    return sections[0]?.slug ?? null;
  }, [sections, hydrated, isDoneFn]);

  const activeSectionSlug = openSection ?? defaultSection;

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col overflow-hidden">
      <div className="shrink-0 border-b border-zinc-800 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          {kitTitle}
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              {detail.module.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {kitBlurb}
            </p>
          </div>
          <div className="w-full shrink-0 sm:w-56">
            <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-500">
              <span suppressHydrationWarning>
                {hydrated
                  ? `${completedCount} / ${totalCount} completed`
                  : "\u00a0"}
              </span>
              <span className="font-semibold tabular-nums text-emerald-500" suppressHydrationWarning>
                {hydrated ? `${percent}%` : "\u00a0"}
              </span>
            </div>
            <Progress
              value={percent}
              className="h-2 bg-zinc-800"
              indicatorClassName="bg-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="interview-challenge-scroll min-h-0 flex-1 overflow-y-auto py-5">
        <p className="mb-3 text-xs font-medium text-zinc-500">
          Choose a pattern track. Practice aloud — no code editor.
        </p>

        <div className="space-y-3">
          {sections.map((section, sectionIndex) => {
            const sectionChallenges = section.topics.flatMap((t) => t.challenges);
            const sectionDone = hydrated
              ? sectionChallenges.filter((c) => isDoneFn(c.entityId)).length
              : 0;
            const sectionTotal = sectionChallenges.length;
            const sectionPct =
              sectionTotal > 0
                ? Math.round((sectionDone / sectionTotal) * 100)
                : 0;
            const isOpen = activeSectionSlug === section.slug;
            const allComplete =
              hydrated && sectionTotal > 0 && sectionDone === sectionTotal;

            return (
              <section
                key={section.slug}
                className={cn(
                  "overflow-hidden rounded-xl border bg-zinc-900/40",
                  isOpen ? "border-emerald-600/40" : "border-zinc-800"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(isOpen ? null : section.slug)
                  }
                  className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      allComplete
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-800 text-zinc-300"
                    )}
                  >
                    {allComplete ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      sectionIndex + 1
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="text-base font-semibold text-zinc-50">
                        {section.title}
                      </h2>
                      <span className="text-xs tabular-nums text-zinc-500">
                        {sectionDone}/{sectionTotal} · {sectionPct}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {section.description}
                    </p>
                    <div className="mt-2.5 h-1 max-w-xs overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${sectionPct}%` }}
                      />
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="mt-2 h-5 w-5 shrink-0 text-zinc-500" />
                  ) : (
                    <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-zinc-500" />
                  )}
                </button>

                {isOpen ? (
                  <div className="border-t border-zinc-800 bg-zinc-950/40">
                    {section.topics.map((topic) => {
                      const topicDone = hydrated
                        ? topic.challenges.filter((c) => isDoneFn(c.entityId))
                            .length
                        : 0;
                      const topicTotal = topic.challenges.length;
                      const topicComplete =
                        hydrated &&
                        topicTotal > 0 &&
                        topicDone === topicTotal;
                      const nextChallenge =
                        topic.challenges.find(
                          (c) => !(hydrated && isDoneFn(c.entityId))
                        ) ?? topic.challenges[0];
                      const topicExpanded = openTopic === topic.slug;

                      return (
                        <div
                          key={topic.slug}
                          className="border-b border-zinc-800/80 last:border-b-0"
                        >
                          <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenTopic(
                                  topicExpanded ? null : topic.slug
                                )
                              }
                              className="flex min-w-0 flex-1 items-start gap-3 text-left"
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                                  topicComplete
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-zinc-600"
                                )}
                              >
                                {topicComplete ? (
                                  <Check className="h-3 w-3" strokeWidth={3} />
                                ) : null}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-zinc-100">
                                  {topic.title}
                                </span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500">
                                  {topic.summary}
                                </span>
                                <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    ~{topic.estimatedMinutes} min
                                  </span>
                                  <span>
                                    {topicDone}/{topicTotal} practiced
                                  </span>
                                </span>
                              </span>
                            </button>

                            {nextChallenge ? (
                              <Link
                                href={CURRICULUM_ROUTES.moduleChallenge(
                                  moduleSlug,
                                  topic.slug,
                                  nextChallenge.id
                                )}
                                className={cn(
                                  "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition",
                                  topicComplete
                                    ? "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                                )}
                              >
                                {topicComplete ? (
                                  "Review"
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 fill-current" />
                                    Practice
                                  </>
                                )}
                              </Link>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-zinc-600">
                                <Lock className="h-3 w-3" />
                                Soon
                              </span>
                            )}
                          </div>

                          {topicExpanded ? (
                            <ul className="border-t border-zinc-800/60 bg-zinc-950/60 px-4 py-2 sm:px-5">
                              {topic.challenges.map((challenge, i) => {
                                const done =
                                  hydrated && isDoneFn(challenge.entityId);
                                return (
                                  <li key={challenge.id}>
                                    <Link
                                      href={CURRICULUM_ROUTES.moduleChallenge(
                                        moduleSlug,
                                        topic.slug,
                                        challenge.id
                                      )}
                                      className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm transition hover:bg-zinc-900"
                                    >
                                      <span className="w-5 tabular-nums text-xs text-zinc-600">
                                        {i + 1}
                                      </span>
                                      <span
                                        className={cn(
                                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                          done
                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                            : "border-zinc-600"
                                        )}
                                      >
                                        {done ? (
                                          <Check
                                            className="h-2.5 w-2.5"
                                            strokeWidth={3}
                                          />
                                        ) : null}
                                      </span>
                                      <span
                                        className={cn(
                                          "min-w-0 flex-1 truncate",
                                          done
                                            ? "text-zinc-400"
                                            : "text-zinc-200"
                                        )}
                                      >
                                        {challenge.title}
                                      </span>
                                      <span
                                        className={cn(
                                          "shrink-0 text-[11px] font-medium",
                                          difficultyTone(challenge.difficulty)
                                        )}
                                      >
                                        {difficultyLabel(challenge.difficulty)}
                                      </span>
                                      <span className="hidden w-12 shrink-0 text-right text-[11px] text-zinc-500 sm:inline">
                                        {challenge.minutes}m
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function isInterviewPrepKitModule(moduleSlug: string) {
  return (
    isInterviewAcademyModule(moduleSlug) || isSystemsAcademyModule(moduleSlug)
  );
}
