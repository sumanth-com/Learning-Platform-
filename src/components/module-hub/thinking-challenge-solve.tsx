"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { TopicChallenge } from "@/features/curriculum/lib/topic-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { listProgrammingFundamentalsChallenges } from "@/features/curriculum/lib/programming-fundamentals-challenges";
import {
  THINKING_KIND_LABELS,
  type ThinkingChallengeData,
} from "@/features/curriculum/lib/thinking-challenge";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { getActiveWorkspaceUserId } from "@/lib/client-workspace";
import { cn } from "@/lib/utils";

type ThinkingChallengeSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: TopicChallenge;
  thinking: ThinkingChallengeData;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-1", className)}>
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
        {title}
      </h2>
      <div className="text-sm leading-snug text-zinc-100">{children}</div>
    </section>
  );
}

export function ThinkingChallengeSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
  thinking,
}: ThinkingChallengeSolveProps) {
  const hydrated = useStoreHydrated();
  const lesson = challenge.lesson;
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
  const userScope = getActiveWorkspaceUserId() ?? "anon";
  const storageKey = `thinking-answer:${userScope}:${entityId}`;
  const submittedKey = `thinking-submitted:${userScope}:${entityId}`;

  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [orderedSteps, setOrderedSteps] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  const siblings = useMemo(
    () => listProgrammingFundamentalsChallenges(topicSlug),
    [topicSlug]
  );
  const index = siblings.findIndex((c) => c.id === challenge.id);
  const next = index >= 0 ? siblings[index + 1] : undefined;
  const nextHref = next
    ? CURRICULUM_ROUTES.moduleChallenge(moduleSlug, topicSlug, next.id)
    : null;

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
      scrollKey: `thinking-${entityId}`,
    }
  );

  useEffect(() => {
    if (!hydrated) return;
    try {
      const saved = localStorage.getItem(storageKey);
      const wasSubmitted = localStorage.getItem(submittedKey) === "1";
      if (saved) {
        const parsed = JSON.parse(saved) as {
          answer?: string;
          selectedOption?: string | null;
          orderedSteps?: string[];
        };
        if (parsed.answer) setAnswer(parsed.answer);
        if (thinking.kind !== "multiple-choice" && parsed.selectedOption !== undefined) {
          setSelectedOption(parsed.selectedOption);
        }
        if (parsed.orderedSteps?.length) {
          setOrderedSteps(parsed.orderedSteps);
        }
      }
      if (thinking.kind === "multiple-choice") {
        // MCQs always start unselected so the learner must actively choose.
        setSelectedOption(null);
        setSubmitted(false);
      } else if (wasSubmitted) {
        setSubmitted(true);
      }
    } catch {
      /* ignore */
    }
  }, [hydrated, storageKey, submittedKey, thinking.kind]);

  useEffect(() => {
    if (thinking.kind !== "arrange-steps" || !thinking.arrangeSteps?.length) {
      return;
    }
    setOrderedSteps((prev) =>
      prev.length === thinking.arrangeSteps!.length
        ? prev
        : shuffle(thinking.arrangeSteps!)
    );
  }, [thinking.arrangeSteps, thinking.kind, challenge.id]);

  const persist = (next: {
    answer?: string;
    selectedOption?: string | null;
    orderedSteps?: string[];
  }) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          answer: next.answer ?? answer,
          selectedOption:
            next.selectedOption !== undefined
              ? next.selectedOption
              : selectedOption,
          orderedSteps: next.orderedSteps ?? orderedSteps,
        })
      );
    } catch {
      /* ignore */
    }
  };

  const canSubmit =
    thinking.kind === "multiple-choice"
      ? Boolean(selectedOption)
      : thinking.kind === "arrange-steps"
        ? orderedSteps.length > 0
        : answer.trim().length >= 8;

  const onSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    try {
      localStorage.setItem(submittedKey, "1");
    } catch {
      /* ignore */
    }
  };

  const moveStep = (from: number, direction: -1 | 1) => {
    const to = from + direction;
    if (to < 0 || to >= orderedSteps.length) return;
    const nextSteps = [...orderedSteps];
    const tmp = nextSteps[from]!;
    nextSteps[from] = nextSteps[to]!;
    nextSteps[to] = tmp;
    setOrderedSteps(nextSteps);
    persist({ orderedSteps: nextSteps });
  };

  const mcqCorrect =
    thinking.kind === "multiple-choice" &&
    thinking.options?.find((o) => o.id === selectedOption)?.correct === true;

  const showExtras =
    thinking.kind === "multiple-choice"
      ? selectedOption !== null
      : submitted;

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-background/95 px-4 backdrop-blur-sm sm:px-6">
        <Button asChild variant="outline" size="sm" className="h-8 shrink-0 gap-1.5 border-zinc-700 bg-zinc-900/40 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50">
          <Link href={backHref}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to challenges</span>
          </Link>
        </Button>
        <div className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold text-zinc-50">{thinking.title}</span>
          <span className="hidden text-zinc-500 sm:inline"> · </span>
          <span className="hidden capitalize text-zinc-300 sm:inline">
            {thinking.difficulty}
          </span>
          <span className="hidden text-zinc-500 sm:inline"> · </span>
          <span className="hidden text-zinc-300 sm:inline">
            {THINKING_KIND_LABELS[thinking.kind]}
          </span>
        </div>
        <span className="hidden items-center gap-1 text-xs text-zinc-400 sm:inline-flex">
          <Clock className="h-3 w-3" />
          {thinking.estimatedMinutes} min
        </span>
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

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Question panel */}
        <aside className="flex min-h-0 shrink-0 flex-col gap-4 overflow-y-auto border-b border-zinc-800/80 px-4 py-4 sm:px-6 lg:w-[42%] lg:border-b-0 lg:border-r lg:py-5 xl:w-[38%]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Question
            </p>
            <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
              {thinking.title}
            </h1>
          </div>

          <Section title="Scenario">
            <p className="whitespace-pre-wrap leading-relaxed">
              {thinking.scenario}
            </p>
          </Section>

          <Section title="Task">
            <p className="whitespace-pre-wrap font-medium leading-relaxed text-zinc-50">
              {thinking.task}
            </p>
          </Section>

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-zinc-800/60 pt-3">
            {thinking.kind !== "multiple-choice" && !submitted ? (
              <Button
                size="sm"
                disabled={!canSubmit}
                className="h-9 bg-emerald-600 hover:bg-emerald-500"
                onClick={onSubmit}
              >
                Submit answer
              </Button>
            ) : thinking.kind !== "multiple-choice" && submitted ? (
              <span className="inline-flex h-9 items-center rounded-md border border-emerald-600/40 bg-emerald-500/10 px-3 text-xs font-semibold text-primary">
                Answer submitted
              </span>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-zinc-700 bg-zinc-900/30 font-medium text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50"
              onClick={() => setHintsOpen((v) => !v)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {hintsOpen ? "Hide hints" : "Show hints"}
            </Button>
            {nextHref ? (
              <Button
                asChild
                size="sm"
                className="ml-auto h-9 gap-1.5 bg-emerald-600 px-4 font-semibold hover:bg-emerald-500"
              >
                <Link href={nextHref}>
                  Next challenge
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="ml-auto h-9 gap-1.5 border-zinc-700 bg-zinc-900/30 font-medium text-zinc-200 hover:bg-zinc-800"
              >
                <Link href={backHref}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to topic
                </Link>
              </Button>
            )}
          </div>

          {hintsOpen ? (
            <Section title="Hints">
              <ul className="list-disc space-y-1 pl-5 text-sm font-medium text-zinc-200">
                {thinking.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </Section>
          ) : null}
        </aside>

        {/* Answer / exam panel */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 px-4 py-2.5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              {thinking.kind === "multiple-choice"
                ? "Select one answer"
                : thinking.kind === "arrange-steps"
                  ? "Arrange the steps"
                  : "Your answer"}
            </p>
            {thinking.kind === "multiple-choice" && selectedOption === null ? (
              <span className="inline-flex h-8 items-center rounded-md border border-zinc-700/80 bg-zinc-900/40 px-3 text-xs font-medium text-zinc-400">
                Pick an option
              </span>
            ) : null}
            {thinking.kind === "multiple-choice" && selectedOption !== null ? (
              <span
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold",
                  mcqCorrect
                    ? "border-emerald-500/50 bg-emerald-500/15 text-primary"
                    : "border-amber-500/45 bg-amber-500/10 text-amber-600"
                )}
              >
                {mcqCorrect ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
                {mcqCorrect ? "Correct" : "Not quite"}
              </span>
            ) : null}
          </div>

          <div className="thinking-challenge-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
            {thinking.kind === "multiple-choice" && thinking.options ? (
              <div className="mx-auto grid w-full max-w-5xl gap-2.5">
                {thinking.options.map((opt, i) => {
                  const selected = selectedOption === opt.id;
                  const showResult = selectedOption !== null;
                  const letter = optionLetters[i] ?? String(i + 1);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] leading-snug transition",
                        selected
                          ? "border-emerald-500/50 bg-emerald-500/10 text-zinc-50"
                          : "border-zinc-700/80 bg-zinc-900/40 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900/70",
                        showResult &&
                          opt.correct &&
                          "border-emerald-500/70 bg-emerald-500/15",
                        showResult &&
                          selected &&
                          !opt.correct &&
                          "border-rose-500/55 bg-rose-500/10"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                          selected || (showResult && opt.correct)
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                            : "border-zinc-600 bg-zinc-900 text-zinc-300",
                          showResult &&
                            selected &&
                            !opt.correct &&
                            "border-rose-500/50 bg-rose-500/15 text-rose-300"
                        )}
                      >
                        {letter}
                      </span>
                      <span className="min-w-0 flex-1">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : thinking.kind === "arrange-steps" && orderedSteps.length ? (
              <ul className="mx-auto grid w-full max-w-5xl gap-2">
                {orderedSteps.map((step, i) => (
                  <li
                    key={`${step}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-700/80 bg-zinc-900/40 px-4 py-3 text-[15px] text-zinc-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-xs font-bold text-zinc-300">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">{step}</span>
                    {!submitted ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label="Move up"
                          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                          disabled={i === 0}
                          onClick={() => moveStep(i, -1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                          disabled={i === orderedSteps.length - 1}
                          onClick={() => moveStep(i, 1)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mx-auto w-full max-w-5xl">
                <Textarea
                  value={answer}
                  readOnly={submitted}
                  onChange={(e) => {
                    if (submitted) return;
                    setAnswer(e.target.value);
                    persist({ answer: e.target.value });
                  }}
                  placeholder="Write your reasoning here…"
                  className={cn(
                    "min-h-[220px] border-zinc-700 bg-zinc-900 text-[15px] leading-relaxed text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-emerald-500/40",
                    submitted &&
                      "cursor-default border-emerald-700/30 bg-zinc-900"
                  )}
                />
              </div>
            )}

            {showExtras ? (
              <div className="mx-auto mt-5 grid w-full max-w-5xl gap-4 lg:grid-cols-2">
                <Section title="Explanation">
                  <pre className="whitespace-pre-wrap rounded-xl border border-zinc-700/80 bg-zinc-900/50 p-3.5 font-sans text-sm leading-relaxed text-zinc-100">
                    {thinking.referenceSolution}
                  </pre>
                </Section>
                <Section title="Key takeaways">
                  <ul className="list-disc space-y-1.5 rounded-xl border border-zinc-700/80 bg-zinc-900/50 p-3.5 pl-8 text-sm font-medium text-zinc-100">
                    {thinking.takeaways.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Section>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
