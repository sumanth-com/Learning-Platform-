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
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonacoHtmlReference } from "@/components/html-academy/workspace/monaco-html-reference";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  isHtmlTheoryChallenge,
  listHtmlAcademyChallenges,
  type HtmlChallenge,
} from "@/features/curriculum/lib/html-academy-challenges";
import { getHtmlAcademyTopic } from "@/features/curriculum/lib/html-academy";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { triggerConfetti } from "@/lib/confetti";
import { useProgressStore } from "@/store/use-progress-store";
import { cn } from "@/lib/utils";

const HTML_TAG_BLURBS: Record<string, string> = {
  "!doctype html": "Tells the browser this is an HTML5 document.",
  doctype: "Tells the browser this is an HTML5 document.",
  html: "Root element of the page. Use lang for language.",
  head: "Metadata for the document — title, charset, links.",
  meta: "Document metadata such as charset or viewport.",
  title: "Document title shown in the browser tab.",
  body: "Visible page content shown to the user.",
  main: "Primary content of the document or application.",
  header: "Introductory content or navigation for a section.",
  footer: "Footer content for a section or page.",
  nav: "Section with navigation links.",
  section: "Thematic grouping of related content.",
  article: "Self-contained composition, like a post or card.",
  h1: "Top-level heading for the main topic of the page.",
  h2: "Second-level heading under the page topic.",
  h3: "Third-level heading for subsections.",
  p: "A paragraph of text content.",
  a: "Hyperlink to another page or resource.",
  img: "Embeds an image. Always include meaningful alt text.",
  ul: "Unordered (bulleted) list.",
  ol: "Ordered (numbered) list.",
  li: "A single item in a list.",
  form: "Container for interactive controls that submit data.",
  label: "Caption for a form control — improves accessibility.",
  input: "Form field for user input.",
  button: "Clickable control that triggers an action.",
  div: "Generic container with no semantic meaning.",
  span: "Inline generic container with no semantic meaning.",
};

const FALLBACK_HTML_REFS: Array<{ tag: string; desc: string }> = [
  { tag: "<!DOCTYPE html>", desc: HTML_TAG_BLURBS["!doctype html"]! },
  { tag: "<html>", desc: HTML_TAG_BLURBS.html! },
  { tag: "<head>", desc: HTML_TAG_BLURBS.head! },
  { tag: "<body>", desc: HTML_TAG_BLURBS.body! },
  { tag: "<main>", desc: HTML_TAG_BLURBS.main! },
  { tag: "<h1>", desc: HTML_TAG_BLURBS.h1! },
  { tag: "<p>", desc: HTML_TAG_BLURBS.p! },
];

function normalizeTagKey(tag: string): string {
  return tag
    .replace(/[<>/]/g, "")
    .replace(/^!/, "!")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function displayTag(tag: string): string {
  const trimmed = tag.trim();
  if (trimmed.startsWith("<") || trimmed.toUpperCase().includes("DOCTYPE")) {
    return trimmed.startsWith("<") ? trimmed : `<${trimmed}>`;
  }
  return `<${trimmed}>`;
}

function extractTagsFromHtml(html: string): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  if (/<!doctype\s+html/i.test(html)) {
    found.push("<!DOCTYPE html>");
    seen.add("!doctype html");
  }
  const re = /<\/?([a-zA-Z][\w-]*)\b/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const name = match[1]!.toLowerCase();
    if (seen.has(name)) continue;
    seen.add(name);
    found.push(`<${name}>`);
  }
  return found;
}

function buildHtmlRefs(
  code: string,
  cheatSheet: Array<{ tag: string; desc: string }> | undefined
): Array<{ tag: string; desc: string }> {
  const byKey = new Map<string, { tag: string; desc: string }>();

  for (const item of cheatSheet ?? []) {
    const key = normalizeTagKey(item.tag);
    if (!key) continue;
    byKey.set(key, { tag: displayTag(item.tag), desc: item.desc });
  }

  for (const tag of extractTagsFromHtml(code)) {
    const key = normalizeTagKey(tag);
    if (byKey.has(key)) continue;
    const desc =
      HTML_TAG_BLURBS[key] ??
      HTML_TAG_BLURBS[key.replace(/^!/, "")] ??
      `Learn more about the ${displayTag(tag)} element on MDN.`;
    byKey.set(key, { tag: displayTag(tag), desc });
  }

  const ordered = extractTagsFromHtml(code);
  const result: Array<{ tag: string; desc: string }> = [];
  const used = new Set<string>();

  for (const tag of ordered) {
    const key = normalizeTagKey(tag);
    const item = byKey.get(key);
    if (!item || used.has(key)) continue;
    used.add(key);
    result.push(item);
  }

  for (const [key, item] of byKey) {
    if (used.has(key)) continue;
    used.add(key);
    result.push(item);
  }

  return result.length > 0 ? result.slice(0, 10) : FALLBACK_HTML_REFS;
}

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

function ChallengeGuide({
  challenge,
  learnAbout,
  htmlRefs,
  hintsOpen,
  onToggleHints,
  refsOpen,
  onToggleRefs,
}: {
  challenge: HtmlChallenge;
  learnAbout: string;
  htmlRefs: Array<{ tag: string; desc: string }>;
  hintsOpen: boolean;
  onToggleHints: () => void;
  refsOpen: boolean;
  onToggleRefs: () => void;
}) {
  const title = cleanText(challenge.title);
  const task = cleanText(challenge.task);
  const hints = challenge.hints.map(cleanText);

  return (
    <div className="html-challenge-scroll min-h-0 space-y-5 overflow-y-auto border-r border-zinc-800 px-4 py-5 sm:px-5">
      <div className="space-y-2">
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
          onClick={onToggleHints}
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

      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-2 gap-1.5 px-0 text-zinc-400 hover:bg-transparent hover:text-zinc-200"
          onClick={onToggleRefs}
        >
          <BookOpen className="h-3.5 w-3.5" />
          {refsOpen ? "Hide HTML reference" : "Show HTML reference"}
        </Button>
        {refsOpen ? (
          <Section title="HTML reference">
            <ul className="space-y-3">
              {htmlRefs.map((ref) => (
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
    </div>
  );
}

/** Theory lessons: read-only code reference + mark complete. */
function HtmlTheoryReferencePanel({
  code,
  isDone,
  completing,
  onCopy,
  copied,
  onMarkComplete,
}: {
  code: string;
  isDone: boolean;
  completing: boolean;
  onCopy: () => void;
  copied: boolean;
  onMarkComplete: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden bg-[#0a0a0b]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Code reference
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
          onClick={onCopy}
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
        <MonacoHtmlReference value={code} />
      </div>

      <div className="flex shrink-0 justify-center border-t border-zinc-800 bg-zinc-950 px-4 py-4">
        <Button
          type="button"
          size="sm"
          disabled={completing}
          className={cn(
            "h-10 min-w-[12rem] gap-2 px-6 text-sm font-semibold transition",
            isDone
              ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
              : "bg-emerald-600 text-white hover:bg-emerald-500"
          )}
          onClick={onMarkComplete}
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
  );
}

/** Practical lessons: editable playground (kept for later exercises). */
function HtmlInteractivePlayground({
  challenge,
}: {
  challenge: HtmlChallenge;
}) {
  const [code, setCode] = useState(challenge.starterHtml);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [showingSolution, setShowingSolution] = useState(false);

  useEffect(() => {
    setCode(challenge.starterHtml);
    setPreviewDoc(null);
    setRunId(0);
    setShowingSolution(false);
  }, [challenge.id, challenge.starterHtml]);

  const runPreview = () => {
    setPreviewDoc(buildPreviewDocument(code));
    setRunId((id) => id + 1);
  };

  const resetEditor = () => {
    setCode(challenge.starterHtml);
    setPreviewDoc(null);
    setRunId(0);
    setShowingSolution(false);
  };

  const hasPreview = previewDoc !== null;

  return (
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
          onClick={() => {
            setCode(challenge.referenceSolution);
            setShowingSolution(true);
          }}
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
  );
}

export function HtmlPlaygroundSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: HtmlPlaygroundSolveProps) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const setComplete = useProgressStore((s) => s.setComplete);
  const [pending, startTransition] = useTransition();
  const [hintsOpen, setHintsOpen] = useState(false);
  const [refsOpen, setRefsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completing, setCompleting] = useState(false);

  const theory = isHtmlTheoryChallenge(challenge);

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

  const topic = useMemo(() => getHtmlAcademyTopic(topicSlug), [topicSlug]);
  const learnAbout = cleanText(
    challenge.scenario ||
      topic?.summary ||
      "HTML is the structure language of the web. You mark up content so browsers, search engines, and assistive technology understand what each part means."
  );

  const referenceCode = challenge.referenceSolution || challenge.starterHtml;

  const htmlRefs = useMemo(
    () => buildHtmlRefs(referenceCode, topic?.cheatSheet),
    [referenceCode, topic]
  );

  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

  const siblings = useMemo(
    () => listHtmlAcademyChallenges(topicSlug),
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
      scrollKey: `html-${entityId}`,
    }
  );

  useEffect(() => {
    setHintsOpen(false);
    setRefsOpen(false);
    setCopied(false);
    setCompleting(false);
  }, [challenge.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceCode);
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
          <span className="font-medium text-zinc-100">
            {cleanText(challenge.title)}
          </span>
          <span className="text-zinc-600"> · </span>
          <span className="capitalize text-zinc-500">{challenge.difficulty}</span>
          <span className="text-zinc-600"> · </span>
          <span className="text-zinc-500">{topicTitle}</span>
        </div>
        {!theory ? (
          <Button
            variant={isDone ? "secondary" : "default"}
            size="sm"
            className={cn(
              "h-8 shrink-0 gap-1.5 text-xs",
              !isDone && "bg-emerald-600 hover:bg-emerald-500"
            )}
            onClick={() => setComplete(entityId, !isDone)}
          >
            {isDone ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
            {isDone ? "Solved" : "Mark as complete"}
          </Button>
        ) : null}
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <ChallengeGuide
          challenge={challenge}
          learnAbout={learnAbout}
          htmlRefs={htmlRefs}
          hintsOpen={hintsOpen}
          onToggleHints={() => setHintsOpen((v) => !v)}
          refsOpen={refsOpen}
          onToggleRefs={() => setRefsOpen((v) => !v)}
        />

        {theory ? (
          <HtmlTheoryReferencePanel
            code={referenceCode}
            isDone={isDone}
            completing={completing || pending}
            onCopy={handleCopy}
            copied={copied}
            onMarkComplete={handleMarkComplete}
          />
        ) : (
          <HtmlInteractivePlayground challenge={challenge} />
        )}
      </div>
    </div>
  );
}
