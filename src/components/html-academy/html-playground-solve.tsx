"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { HtmlChallenge } from "@/features/curriculum/lib/html-academy-challenges";
import { getHtmlAcademyTopic } from "@/features/curriculum/lib/html-academy";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  a11y: "Accessibility",
  seo: "SEO",
  semantic: "Semantic HTML",
  interview: "Interview",
  project: "Mini Project",
};

function cleanText(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

/** Build a full document for the sandboxed preview iframe. */
function buildPreviewDocument(html: string): string {
  const trimmed = html.trim();
  const baseStyle =
    "html,body{margin:0;padding:0;background:#fff;color:#111}" +
    "body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;padding:20px;line-height:1.5;font-size:16px}" +
    "h1,h2,h3{line-height:1.25;margin:0.6em 0 0.35em}" +
    "p,ul,ol{margin:0.5em 0}" +
    "img,video,iframe{max-width:100%;height:auto}" +
    "a{color:#0563c1}";

  if (/<!doctype\s+html/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
    if (/<\/head>/i.test(trimmed)) {
      return trimmed.replace(
        /<\/head>/i,
        `<style>${baseStyle}</style></head>`
      );
    }
    if (/<body[\s>]/i.test(trimmed)) {
      return trimmed.replace(
        /<body([^>]*)>/i,
        `<head><meta charset="UTF-8"/><style>${baseStyle}</style></head><body$1>`
      );
    }
    return trimmed;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>${baseStyle}</style>
</head>
<body>
${trimmed}
</body>
</html>`;
}

type HtmlPlaygroundSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: HtmlChallenge;
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

/** Preview iframe: remount + srcDoc on every Run (no blob URLs). */
function HtmlPreviewFrame({
  documentHtml,
  runId,
}: {
  documentHtml: string;
  runId: number;
}) {
  return (
    <iframe
      key={runId}
      title="HTML preview"
      srcDoc={documentHtml}
      sandbox="allow-scripts allow-forms"
      className="absolute inset-0 block h-full w-full border-0 bg-white"
    />
  );
}

export function HtmlPlaygroundSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: HtmlPlaygroundSolveProps) {
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
  const [code, setCode] = useState(challenge.starterHtml);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);
  const codeRef = useRef(code);
  codeRef.current = code;

  const topic = useMemo(
    () => getHtmlAcademyTopic(topicSlug),
    [topicSlug]
  );

  useEffect(() => {
    setCode(challenge.starterHtml);
    setPreviewDoc(null);
    setRunId(0);
    setHintsOpen(false);
    setShowingSolution(false);
  }, [challenge.id, challenge.starterHtml]);

  const runPreview = () => {
    const latest = codeRef.current;
    setPreviewDoc(buildPreviewDocument(latest));
    setRunId((id) => id + 1);
  };

  const resetEditor = () => {
    setCode(challenge.starterHtml);
    setPreviewDoc(null);
    setRunId(0);
    setShowingSolution(false);
  };

  /** Load solution into the editor only — preview updates on Run. */
  const showSolutionOnRight = () => {
    setCode(challenge.referenceSolution);
    setShowingSolution(true);
  };

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

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
      scrollKey: `html-${entityId}`,
    }
  );

  const title = cleanText(challenge.title);
  const task = cleanText(challenge.task);
  const hints = challenge.hints.map(cleanText);
  const kindLabel = KIND_LABELS[challenge.kind] ?? challenge.kind;
  const learnAbout = topic
    ? cleanText(topic.explanation)
    : "HTML is the structure language of the web. You mark up content so browsers, search engines, and assistive technology understand what each part means.";

  const hasPreview = previewDoc !== null;

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
        {/* Left: About + Instructions + Acceptance + Hints */}
        <div className="html-challenge-scroll min-h-0 space-y-5 overflow-y-auto border-r border-zinc-800 px-4 py-5 sm:px-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-400/90">
              HTML Academy · {kindLabel}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="capitalize">{challenge.difficulty}</span>
              <span className="text-zinc-700">·</span>
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
        </div>

        {/* Right: editor → toolbar → preview only after Run */}
        <div className="flex min-h-0 flex-col overflow-hidden bg-[#0a0a0b]">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              HTML · index.html
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs text-zinc-400"
              onClick={resetEditor}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setShowingSolution(false);
            }}
            spellCheck={false}
            className="min-h-0 w-full flex-1 resize-none overflow-auto border-0 bg-[#0d0d0d] p-3 font-mono text-[13px] leading-relaxed text-zinc-200 outline-none focus:ring-0"
            aria-label="HTML editor"
          />

          <div className="flex shrink-0 items-center gap-2 border-t border-zinc-800 bg-zinc-950 px-3 py-2.5">
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 bg-emerald-600 px-4 font-medium text-white hover:bg-emerald-500"
              onClick={runPreview}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Run
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900"
              onClick={showSolutionOnRight}
            >
              {showingSolution ? "Solution loaded" : "Show solution"}
            </Button>
          </div>

          {hasPreview && previewDoc ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-zinc-800">
              <div className="flex shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Output
                </span>
              </div>
              <div className="relative min-h-0 flex-1 bg-white">
                <HtmlPreviewFrame documentHtml={previewDoc} runId={runId} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
