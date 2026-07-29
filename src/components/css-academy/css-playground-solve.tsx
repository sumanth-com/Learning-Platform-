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
import { MonacoHtmlReference } from "@/components/html-academy/workspace/monaco-html-reference";
import { MonacoCssReference } from "@/components/css-academy/workspace/monaco-css-reference";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  listCssAcademyChallenges,
  type CssChallenge,
} from "@/features/curriculum/lib/css-academy-challenges";
import { getCssAcademyTopic } from "@/features/curriculum/lib/css-academy";
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

type CssPlaygroundSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: CssChallenge;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-1.5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
        {title}
      </h2>
      <div className="text-[15px] leading-relaxed text-zinc-100">{children}</div>
    </section>
  );
}

export function CssPlaygroundSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: CssPlaygroundSolveProps) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const setComplete = useProgressStore((s) => s.setComplete);
  const [pending, startTransition] = useTransition();
  const [hintsOpen, setHintsOpen] = useState(false);
  const [refsOpen, setRefsOpen] = useState(false);
  const [codeTab, setCodeTab] = useState<"html" | "css">("css");
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

  const topic = useMemo(() => getCssAcademyTopic(topicSlug), [topicSlug]);
  const learnAbout = cleanText(
    challenge.scenario ||
      topic?.summary ||
      "CSS is the presentation language of the web. HTML provides structure; CSS controls how it looks."
  );

  const htmlCode = challenge.referenceHtml || challenge.starterHtml;
  const cssCode = challenge.referenceCss || challenge.starterCss;
  const cssRefs = topic?.cheatSheet ?? [];

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  const siblings = useMemo(
    () => listCssAcademyChallenges(topicSlug),
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
      problemType: "logic",
      scrollKey: `css-${entityId}`,
    }
  );

  useEffect(() => {
    setHintsOpen(false);
    setRefsOpen(false);
    setCopied(false);
    setCompleting(false);
    setCodeTab("css");
  }, [challenge.id]);

  const activeCode = codeTab === "html" ? htmlCode : cssCode;

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-background/95 px-4 backdrop-blur-sm sm:px-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 border-zinc-700 bg-zinc-900/40 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50"
        >
          <Link href={backHref}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to challenges</span>
          </Link>
        </Button>
        <div className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold text-zinc-50">{title}</span>
          <span className="hidden text-zinc-500 sm:inline"> · </span>
          <span className="hidden capitalize text-zinc-300 sm:inline">
            {challenge.difficulty}
          </span>
          <span className="hidden text-zinc-500 sm:inline"> · </span>
          <span className="hidden text-zinc-300 sm:inline">{topicTitle}</span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="css-challenge-scroll min-h-0 space-y-4 overflow-y-auto border-r border-zinc-800/80 px-4 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Question
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-300">
              <span className="capitalize text-primary">
                {challenge.difficulty}
              </span>
              <span className="text-zinc-500">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {challenge.minutes} min
              </span>
            </div>
          </div>

          <Section title="About">
            <p className="whitespace-pre-wrap font-medium">{learnAbout}</p>
          </Section>

          <Section title="Instructions">
            <p className="whitespace-pre-wrap font-medium">{task}</p>
          </Section>

          <Section title="Acceptance criteria">
            <ul className="space-y-1.5 font-medium text-zinc-100">
              {challenge.acceptanceCriteria.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Section>

          {challenge.takeaways.length > 0 ? (
            <Section title="Key takeaways">
              <ul className="space-y-1.5 font-medium text-zinc-100">
                {challenge.takeaways.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{cleanText(t)}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-2 h-9 gap-1.5 border-zinc-700 bg-zinc-900/30 font-medium text-zinc-200 hover:bg-zinc-800"
              onClick={() => setHintsOpen((v) => !v)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {hintsOpen ? "Hide hints" : "Show hints"}
            </Button>
            {hintsOpen ? (
              <Section title="Hints">
                <ul className="space-y-1.5 font-medium text-zinc-100">
                  {hints.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </div>

          {cssRefs.length > 0 ? (
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-2 h-9 gap-1.5 border-zinc-700 bg-zinc-900/30 font-medium text-zinc-200 hover:bg-zinc-800"
                onClick={() => setRefsOpen((v) => !v)}
              >
                <BookOpen className="h-3.5 w-3.5" />
                {refsOpen ? "Hide CSS reference" : "Show CSS reference"}
              </Button>
              {refsOpen ? (
                <Section title="CSS reference">
                  <ul className="space-y-3">
                    {cssRefs.map((ref) => (
                      <li key={ref.tag} className="text-sm leading-relaxed">
                        <code className="text-[13px] font-semibold text-emerald-700">
                          {ref.tag}
                        </code>
                        <p className="mt-1 font-medium text-zinc-200">{ref.desc}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden bg-zinc-950">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
            <div className="flex items-center gap-1 rounded-md bg-zinc-900 p-0.5">
              <button
                type="button"
                onClick={() => setCodeTab("html")}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition",
                  codeTab === "html"
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                HTML
              </button>
              <button
                type="button"
                onClick={() => setCodeTab("css")}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition",
                  codeTab === "css"
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                CSS
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
            {codeTab === "html" ? (
              <MonacoHtmlReference value={htmlCode} />
            ) : (
              <MonacoCssReference value={cssCode} />
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
