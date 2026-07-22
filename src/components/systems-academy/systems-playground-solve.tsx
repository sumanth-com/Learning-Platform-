"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonacoMarkdownReference } from "@/components/systems-academy/workspace/monaco-markdown-reference";
import { MonacoJsonReference } from "@/components/systems-academy/workspace/monaco-json-reference";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  listSystemsAcademyChallenges,
  type SystemsChallenge,
} from "@/features/curriculum/lib/systems-academy-challenges";
import { getSystemsAcademyTopic } from "@/features/curriculum/lib/systems-academy";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { triggerConfetti } from "@/lib/confetti";
import { useProgressStore } from "@/store/use-progress-store";
import { cn } from "@/lib/utils";

function cleanText(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

type SystemsPlaygroundSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: SystemsChallenge;
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

export function SystemsPlaygroundSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: SystemsPlaygroundSolveProps) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const setComplete = useProgressStore((s) => s.setComplete);
  const [pending, startTransition] = useTransition();
  const [hintsOpen, setHintsOpen] = useState(false);
  const [refsOpen, setRefsOpen] = useState(false);
  const [codeTab, setCodeTab] = useState<"markdown" | "json">("markdown");
  const [copied, setCopied] = useState(false);
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

  const topic = useMemo(() => getSystemsAcademyTopic(topicSlug), [topicSlug]);
  const learnAbout = cleanText(
    challenge.scenario ||
      topic?.summary ||
      "Design interviews and storytelling for behavioral rounds."
  );

  const markdownCode = challenge.referenceMarkdown || challenge.starterMarkdown;
  const jsonCode = challenge.referenceJson || challenge.starterJson;
  const systemsRefs = topic?.cheatSheet ?? [];

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  const siblings = useMemo(
    () => listSystemsAcademyChallenges(topicSlug),
    [topicSlug]
  );
  const index = siblings.findIndex((c) => c.id === challenge.id);
  const next = index >= 0 ? siblings[index + 1] : undefined;
  const nextHref = next
    ? CURRICULUM_ROUTES.moduleChallenge(moduleSlug, topicSlug, next.id)
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
      scrollKey: `systems-${entityId}`,
    }
  );

  useEffect(() => {
    setHintsOpen(false);
    setRefsOpen(false);
    setCopied(false);
    setCompleting(false);
    setCodeTab("markdown");
  }, [challenge.id]);

  const activeCode = codeTab === "markdown" ? markdownCode : jsonCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const handleMarkComplete = () => {
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

  const title = cleanText(challenge.title);
  const task = cleanText(challenge.task);
  const hints = challenge.hints.map(cleanText);

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
        <div className="min-w-0 flex-1 text-sm leading-snug">
          <span className="font-medium text-zinc-100">{title}</span>
          <span className="text-zinc-600"> | </span>
          <span className="capitalize text-zinc-500">{challenge.difficulty}</span>
          <span className="text-zinc-600"> | </span>
          <span className="text-zinc-500">{topicTitle}</span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="systems-challenge-scroll min-h-0 space-y-5 overflow-y-auto border-r border-zinc-800 px-4 py-5 sm:px-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="capitalize">{challenge.difficulty}</span>
              <span className="text-zinc-700">|</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {challenge.minutes} min
              </span>
            </div>
          </div>

          <Section title="About">
            <p className="whitespace-pre-wrap text-zinc-300">{learnAbout}</p>
          </Section>

          <Section title="Instructions">
            <p className="whitespace-pre-wrap text-zinc-200">{task}</p>
          </Section>

          <Section title="Acceptance criteria">
            <ul className="space-y-1.5 text-zinc-400">
              {challenge.acceptanceCriteria.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Section>

          {challenge.takeaways.length > 0 ? (
            <Section title="Key takeaways">
              <ul className="space-y-1.5 text-zinc-400">
                {challenge.takeaways.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                    <span>{cleanText(t)}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-2 gap-1.5 px-0 text-zinc-400 hover:bg-transparent hover:text-zinc-200"
              onClick={() => setHintsOpen((v) => !v)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {hintsOpen ? "Hide hints" : "Show hints"}
            </Button>
            {hintsOpen ? (
              <Section title="Hints">
                <ul className="space-y-1.5 text-zinc-400">
                  {hints.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </div>

          {systemsRefs.length > 0 ? (
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mb-2 gap-1.5 px-0 text-zinc-400 hover:bg-transparent hover:text-zinc-200"
                onClick={() => setRefsOpen((v) => !v)}
              >
                <BookOpen className="h-3.5 w-3.5" />
                {refsOpen ? "Hide systems reference" : "Show systems reference"}
              </Button>
              {refsOpen ? (
                <Section title="Systems reference">
                  <ul className="space-y-3">
                    {systemsRefs.map((ref) => (
                      <li key={ref.tag} className="text-sm leading-relaxed">
                        <code className="text-[13px] font-medium text-sky-300/90">
                          {ref.tag}
                        </code>
                        <p className="mt-1 text-zinc-400">{ref.desc}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden bg-[#0a0a0b]">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
            <div className="flex items-center gap-1 rounded-md bg-zinc-950 p-0.5">
              <button
                type="button"
                onClick={() => setCodeTab("markdown")}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition",
                  codeTab === "markdown"
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => setCodeTab("json")}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition",
                  codeTab === "json"
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                JSON
              </button>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-visible">
            {codeTab === "markdown" ? (
              <MonacoMarkdownReference value={markdownCode} />
            ) : (
              <MonacoJsonReference value={jsonCode} />
            )}
          </div>

          <div className="flex shrink-0 justify-center border-t border-zinc-800 bg-zinc-950 px-4 py-4">
            <Button
              type="button"
              size="sm"
              disabled={completing || pending}
              className={cn(
                "h-10 min-w-[12rem] gap-2 px-6 text-sm font-semibold transition",
                isDone
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              )}
              onClick={handleMarkComplete}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {isDone ? "Completed" : "Mark as Complete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
