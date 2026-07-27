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
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-zinc-100">{children}</div>
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
  const storageKey = `thinking-answer:${entityId}`;
  const submittedKey = `thinking-submitted:${entityId}`;

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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-background/95 px-3 backdrop-blur-sm sm:px-4">
        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Challenges</span>
        </Link>
        <div className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold text-zinc-50">{thinking.title}</span>
          <span className="text-zinc-500"> · </span>
          <span className="capitalize text-zinc-300">
            {thinking.difficulty}
          </span>
          <span className="text-zinc-500"> · </span>
          <span className="text-zinc-300">
            {THINKING_KIND_LABELS[thinking.kind]}
          </span>
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

      <div className="thinking-challenge-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Thinking Challenge
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              {thinking.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-300">
              <span className="capitalize">{thinking.difficulty}</span>
              <span className="text-zinc-500">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {thinking.estimatedMinutes} min
              </span>
              <span className="text-zinc-500">·</span>
              <span>{THINKING_KIND_LABELS[thinking.kind]}</span>
            </div>
          </div>

          <Section title="Scenario">
            <p className="whitespace-pre-wrap">{thinking.scenario}</p>
          </Section>

          <Section title="Task">
            <p className="whitespace-pre-wrap text-zinc-100">{thinking.task}</p>
          </Section>

          <Section title="Your answer">
            {thinking.kind === "multiple-choice" && thinking.options ? (
              <div className="space-y-2">
                {thinking.options.map((opt) => {
                  const selected = selectedOption === opt.id;
                  const showResult = selectedOption !== null;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedOption(opt.id);
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition",
                        selected
                          ? "border-emerald-500/50 bg-emerald-500/10 text-zinc-50"
                          : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-600",
                        showResult &&
                          opt.correct &&
                          "border-emerald-500/60 bg-emerald-500/15",
                        showResult &&
                          selected &&
                          !opt.correct &&
                          "border-rose-500/50 bg-rose-500/10"
                      )}
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-600 text-[10px]">
                        {selected ? "●" : ""}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
                {selectedOption !== null ? (
                  <p
                    className={cn(
                      "text-xs",
                      mcqCorrect ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    {mcqCorrect
                      ? "Correct — compare with the reference below."
                      : "Not quite — review the reference solution."}
                  </p>
                ) : null}
              </div>
            ) : thinking.kind === "arrange-steps" && orderedSteps.length ? (
              <ul className="space-y-2">
                {orderedSteps.map((step, i) => (
                  <li
                    key={`${step}-${i}`}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50"
                  >
                    <span className="w-5 tabular-nums text-zinc-500">
                      {i + 1}.
                    </span>
                    <span className="min-w-0 flex-1">{step}</span>
                    {!submitted ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label="Move up"
                          className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                          disabled={i === 0}
                          onClick={() => moveStep(i, -1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
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
                  "min-h-[160px] border-zinc-700 bg-zinc-900 text-[15px] leading-relaxed text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-emerald-500/40",
                  submitted && "cursor-default border-emerald-700/30 bg-zinc-900"
                )}
              />
            )}
          </Section>

          <div className="flex flex-wrap items-center gap-2">
            {thinking.kind !== "multiple-choice" && !submitted ? (
              <Button
                size="sm"
                disabled={!canSubmit}
                className="bg-emerald-600 hover:bg-emerald-500"
                onClick={onSubmit}
              >
                Submit answer
              </Button>
            ) : thinking.kind !== "multiple-choice" ? (
              <span className="text-xs font-semibold text-emerald-600">Answer submitted</span>
            ) : (
              <span className="text-xs font-medium text-zinc-300">
                Select an option to see instant feedback.
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 font-medium text-zinc-300 hover:text-zinc-50"
              onClick={() => setHintsOpen((v) => !v)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {hintsOpen ? "Hide hints" : "Show hints"}
            </Button>
          </div>

          {hintsOpen ? (
            <Section title="Hints">
              <ul className="list-disc space-y-1 pl-5 font-medium text-zinc-200">
                {thinking.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {submitted ? (
            <>
              <Section title="Reference solution">
                <pre className="whitespace-pre-wrap rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-sans text-sm leading-relaxed text-zinc-100">
                  {thinking.referenceSolution}
                </pre>
              </Section>
              <Section title="Key takeaways">
                <ul className="list-disc space-y-1.5 pl-5 font-medium text-zinc-100">
                  {thinking.takeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>
            </>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-6">
            <Button
              variant={isDone ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "gap-1.5",
                !isDone &&
                  "border-emerald-600/50 text-emerald-400 hover:bg-emerald-500/10"
              )}
              onClick={() => toggle(entityId)}
            >
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              {isDone ? "Completed" : "Mark complete"}
            </Button>
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300"
              >
                Next challenge
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href={backHref}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Back to topic
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
