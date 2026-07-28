"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { triggerConfetti } from "@/lib/confetti";
import { useProgressStore } from "@/store/use-progress-store";
import { cn } from "@/lib/utils";
import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";

export type InterviewPrepRef = { tag: string; desc: string };

export type InterviewPrepGuide = {
  briefing: string;
  prompts: string[];
  patterns: InterviewPrepRef[];
  dos: string[];
  donts: string[];
  talkTrack: string;
};

export type InterviewPrepChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  acceptanceCriteria: string[];
  modelAnswer: string;
  talkingPoints?: string;
  prep?: InterviewPrepGuide;
  lesson: LearnLesson;
  weekId: number;
};

type InterviewPrepSessionProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  variant: "coding" | "systems";
  challenge: InterviewPrepChallenge;
  siblings: { id: string }[];
  defaultSummary: string;
};

function cleanText(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^\/\/\s?/gm, "")
    .trim();
}

function difficultyLabel(d: LearnDifficulty): string {
  if (d === "easy") return "Easy";
  if (d === "medium") return "Medium";
  return "Hard";
}

function shortChallengeLabel(title: string, topicTitle: string): string {
  const t = cleanText(title);
  if (t.length > 64 || t.toLowerCase().startsWith(topicTitle.toLowerCase())) {
    if (/^practice\b/i.test(t)) return t;
    if (/^fix\b|^debug\b|^ship\b|^interview\b/i.test(t)) return t;
  }
  if (t.length > 72) return topicTitle;
  return t;
}

export function InterviewPrepSession({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  variant,
  challenge,
  siblings,
  defaultSummary,
}: InterviewPrepSessionProps) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const setComplete = useProgressStore((s) => s.setComplete);
  const [pending, startTransition] = useTransition();
  const [showAnswer, setShowAnswer] = useState(false);
  const [completing, setCompleting] = useState(false);

  const entityId = useMemo(
    () =>
      curriculumChallengeEntityId(moduleSlug, {
        weekId: challenge.weekId || 0,
        topicSlug: challenge.topicSlug,
        lesson: challenge.lesson,
      }),
    [challenge, moduleSlug]
  );
  const { isDone } = useEntityProgress(entityId);

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  const index = siblings.findIndex((c) => c.id === challenge.id);
  const next = index >= 0 ? siblings[index + 1] : undefined;
  const prev = index > 0 ? siblings[index - 1] : undefined;
  const nextHref = next
    ? CURRICULUM_ROUTES.moduleChallenge(moduleSlug, topicSlug, next.id)
    : null;
  const prevHref = prev
    ? CURRICULUM_ROUTES.moduleChallenge(moduleSlug, topicSlug, prev.id)
    : null;

  useTrackResumePosition(
    "roadmap",
    1,
    `${moduleTitle} | ${topicTitle}`,
    challenge.title,
    solveHref,
    hydrated,
    {
      topicSlug,
      topicTitle,
      lessonId: challenge.lesson.id,
      lessonTitle: challenge.title,
      entityId,
      difficulty: challenge.difficulty,
      problemType: "logic",
      scrollKey: `prep-${entityId}`,
    }
  );

  useEffect(() => {
    setShowAnswer(false);
    setCompleting(false);
  }, [challenge.id]);

  const handleMarkReady = () => {
    if (completing) return;
    setCompleting(true);
    const alreadyDone = isDone;
    if (!alreadyDone) {
      setComplete(entityId, true);
      triggerConfetti();
    }
    const destination = nextHref ?? backHref;
    window.setTimeout(
      () => {
        startTransition(() => {
          router.push(destination);
        });
      },
      alreadyDone ? 120 : 900
    );
  };

  const heading = shortChallengeLabel(challenge.title, topicTitle);
  const prep = challenge.prep;
  const explanation = cleanText(
    prep?.briefing || challenge.scenario || defaultSummary
  );
  const questions = (prep?.prompts ?? []).map(cleanText).filter(Boolean);
  const dos = (prep?.dos ?? challenge.takeaways ?? [])
    .map(cleanText)
    .filter(Boolean)
    .slice(0, 5);
  const donts = (prep?.donts ?? challenge.hints ?? [])
    .map(cleanText)
    .filter(Boolean)
    .slice(0, 5);
  const patterns = prep?.patterns ?? [];
  const modelAnswer = cleanText(prep?.talkTrack || challenge.modelAnswer);
  const kitLabel =
    variant === "coding"
      ? "Interview Preparation Kit"
      : "System Design Preparation Kit";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-zinc-950">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800 px-3 sm:px-4">
        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm text-zinc-400 transition hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to kit</span>
        </Link>
        <span className="hidden text-zinc-700 sm:inline">/</span>
        <p className="hidden min-w-0 truncate text-sm text-zinc-500 sm:block">
          {kitLabel}
          <span className="text-zinc-700"> · </span>
          {topicTitle}
        </p>
        <div className="ml-auto text-xs tabular-nums text-zinc-500">
          {index >= 0 ? `${index + 1} / ${siblings.length}` : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-5xl flex-col px-3 py-3 sm:px-5 sm:py-4">
          <div className="mb-3 shrink-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
                {difficultyLabel(challenge.difficulty)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="h-3.5 w-3.5" />
                {challenge.minutes} min
              </span>
              <span className="text-xs text-zinc-500">{topicTitle}</span>
              {isDone ? (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-600/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <Check className="h-3 w-3" />
                  Done
                </span>
              ) : null}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">
              {heading}
            </h1>
          </div>

          {/* Fit-on-screen coaching grid — no checkbox options */}
          <div className="grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-2">
            <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
              <div className="shrink-0 border-b border-zinc-800 px-4 py-2.5">
                <h2 className="text-sm font-semibold text-zinc-100">
                  What to know
                </h2>
              </div>
              <div className="interview-challenge-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
                <p className="text-sm leading-relaxed text-zinc-300">
                  {explanation}
                </p>

                {questions.length > 0 ? (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Practice prompts
                    </p>
                    <ul className="space-y-2">
                      {questions.slice(0, 4).map((q) => (
                        <li
                          key={q}
                          className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-200"
                        >
                          {q.endsWith("?") ? q : `${q}?`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">
                    {cleanText(challenge.task)}
                  </p>
                )}

                {patterns.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Focus for this drill
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {patterns.map((ref) => (
                        <span
                          key={ref.tag}
                          title={ref.desc}
                          className="rounded-md border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
                        >
                          {ref.tag}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {patterns.slice(0, 4).map((ref) => (
                        <li key={`${ref.tag}-d`} className="text-xs text-zinc-500">
                          <span className="font-medium text-zinc-400">
                            {ref.tag}:
                          </span>{" "}
                          {ref.desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2.5">
                <h2 className="text-sm font-semibold text-zinc-100">
                  How to answer
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAnswer((v) => !v)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  {showAnswer ? "Hide sample talk track" : "Show sample talk track"}
                </button>
              </div>
              <div className="interview-challenge-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
                {showAnswer ? (
                  <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 p-3">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Sample talk track
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                      {modelAnswer ||
                        "Clarify → state approach → code while narrating → dry-run → complexity."}
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-lg border border-emerald-600/25 bg-emerald-500/[0.06] p-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      Do
                    </p>
                    <ul className="space-y-2">
                      {dos.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-snug text-zinc-200"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-rose-500/25 bg-rose-500/[0.06] p-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                      Don&apos;t
                    </p>
                    <ul className="space-y-2">
                      {donts.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-snug text-zinc-200"
                        >
                          <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {challenge.acceptanceCriteria.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      You&apos;re ready when you can
                    </p>
                    <ul className="space-y-1.5">
                      {challenge.acceptanceCriteria.slice(0, 3).map((c) => (
                        <li
                          key={c}
                          className="text-sm leading-snug text-zinc-400"
                        >
                          · {cleanText(c)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-3 py-2.5 sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {prevHref ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-zinc-700"
                onClick={() => router.push(prevHref)}
                disabled={pending}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Prev
              </Button>
            ) : null}
            {nextHref ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-zinc-700"
                onClick={() => router.push(nextHref)}
                disabled={pending}
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : null}
          </div>
          <p className="hidden text-xs text-zinc-500 md:block">
            Read the pattern, practice answering out loud, then mark complete.
          </p>
          <Button
            type="button"
            size="sm"
            className={cn(
              "h-8 bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
            )}
            onClick={handleMarkReady}
            disabled={pending || completing}
          >
            {isDone ? "Continue" : "Mark as Complete"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
