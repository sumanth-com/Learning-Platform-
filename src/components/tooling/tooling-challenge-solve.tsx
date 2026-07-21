"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  Terminal,
} from "lucide-react";
import { TerminalSimulator } from "@/components/tooling/terminal-simulator";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { ToolingChallenge } from "@/features/curriculum/lib/developer-tooling-challenges";
import { listDeveloperToolingChallenges } from "@/features/curriculum/lib/developer-tooling-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<string, string> = {
  terminal: "Terminal Practice",
  git: "Git Practice",
  scenario: "Scenario Based",
  debug: "Debugging",
  recovery: "Recovery",
};

/** Strip markdown emphasis so asterisks never show in the UI. */
function cleanText(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__/g, "")
    .trim();
}

type ToolingChallengeSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: ToolingChallenge;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}

export function ToolingChallengeSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: ToolingChallengeSolveProps) {
  const hydrated = useStoreHydrated();
  const entityId = useMemo(
    () =>
      curriculumChallengeEntityId(moduleSlug, {
        weekId: challenge.weekId || 0,
        topicSlug: challenge.topicSlug,
        lesson: challenge.lesson,
      }),
    [challenge, moduleSlug]
  );
  const { isDone, toggle } = useEntityProgress(entityId);
  const [submitted, setSubmitted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  const siblings = listDeveloperToolingChallenges(topicSlug);
  const index = siblings.findIndex((c) => c.id === challenge.id);
  const next = index >= 0 ? siblings[index + 1] : undefined;
  const nextHref = next
    ? CURRICULUM_ROUTES.moduleChallenge(moduleSlug, topicSlug, next.id)
    : null;

  useTrackResumePosition(
    "roadmap",
    1,
    `${moduleTitle} · ${topicTitle}`,
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
      problemType: "terminal",
      scrollKey: `tooling-${entityId}`,
    }
  );

  const kindLabel = KIND_LABELS[challenge.kind] ?? challenge.kind;
  const scenario = cleanText(challenge.scenario);
  const task = cleanText(challenge.task);
  const hints = challenge.hints.map(cleanText);
  const reference = cleanText(challenge.referenceSolution);
  const takeaways = challenge.takeaways.map(cleanText);
  const title = cleanText(challenge.title);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0d0d0d]">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800 px-3 sm:px-4">
        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Challenges</span>
        </Link>
        <div className="min-w-0 flex-1 truncate text-sm">
          <span className="font-medium text-zinc-100">{title}</span>
          <span className="text-zinc-600"> · </span>
          <span className="capitalize text-zinc-500">{challenge.difficulty}</span>
          <span className="text-zinc-600"> · </span>
          <span className="text-zinc-500">{topicTitle}</span>
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

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="tooling-challenge-scroll min-h-0 space-y-6 overflow-y-auto border-r border-zinc-800 px-4 py-6 sm:px-6">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-500/80">
              <Terminal className="h-3.5 w-3.5" />
              Tooling Challenge
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="capitalize">{challenge.difficulty}</span>
              <span className="text-zinc-700">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {challenge.minutes} min
              </span>
              <span className="text-zinc-700">·</span>
              <span>{kindLabel}</span>
            </div>
          </div>

          <Section title="Scenario">
            <p className="whitespace-pre-wrap text-zinc-300">{scenario}</p>
          </Section>

          <Section title="Instructions">
            <p className="whitespace-pre-wrap text-zinc-200">{task}</p>
          </Section>

          <div className="flex flex-wrap items-center gap-2">
            {!submitted ? (
              <Button
                size="sm"
                disabled={!validated}
                className="bg-emerald-600 hover:bg-emerald-500"
                onClick={() => setSubmitted(true)}
              >
                Submit answer
              </Button>
            ) : (
              <span className="text-xs text-emerald-400">Answer submitted</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-zinc-400"
              onClick={() => setHintsOpen((v) => !v)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {hintsOpen ? "Hide hints" : "Show hints"}
            </Button>
            {!validated ? (
              <span className="text-xs text-zinc-600">
                Run the required commands in the terminal to unlock submit
              </span>
            ) : !submitted ? (
              <span className="text-xs text-emerald-400">Ready to submit</span>
            ) : null}
          </div>

          {hintsOpen ? (
            <Section title="Hints">
              <ul className="list-disc space-y-1.5 pl-5 text-zinc-400">
                {hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {submitted ? (
            <>
              <Section title="Reference solution">
                <pre className="whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 font-sans text-sm text-zinc-300">
                  {reference}
                </pre>
              </Section>
              <Section title="Key takeaways">
                <ul className="list-disc space-y-1.5 pl-5 text-zinc-300">
                  {takeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>
            </>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-zinc-800/80 pt-5">
            <Button
              size="sm"
              className={cn(
                "h-9 min-w-[9.5rem] gap-1.5 font-medium",
                isDone
                  ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              )}
              onClick={() => toggle(entityId)}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {isDone ? "Completed" : "Mark as complete"}
            </Button>
            {nextHref ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 min-w-[9.5rem] gap-1.5 border-zinc-700 bg-transparent font-medium text-zinc-200 hover:bg-zinc-900 hover:text-zinc-50"
              >
                <Link href={nextHref}>
                  Next challenge
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 min-w-[9.5rem] gap-1.5 border-zinc-700 bg-transparent font-medium text-zinc-300 hover:bg-zinc-900"
              >
                <Link href={backHref}>Back to challenges</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col bg-[#0a0a0b] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Interactive terminal
          </p>
          <TerminalSimulator
            className="min-h-0 flex-1"
            expectIncludes={challenge.validateIncludes}
            onPracticeSuccess={() => setValidated(true)}
            onCommand={(command) => {
              if (
                challenge.validateIncludes.every((frag) =>
                  command.toLowerCase().includes(frag.toLowerCase())
                )
              ) {
                setValidated(true);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
