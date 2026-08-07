"use client";

import { useMemo, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { ProblemDocument } from "@/components/learning-engine/problem-document";
import { lessonHasWorkspace } from "@/components/learning-engine/editor-workspace";
import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import type { ModuleChallengeSolveProps } from "@/components/module-hub/module-challenge-solve-types";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  getModuleChallengeExperience,
  type ChallengeExperienceKind,
} from "@/features/curriculum/lib/challenge-experience";
import type { TopicChallenge } from "@/features/curriculum/lib/topic-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/challenge-entity-id";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { cn } from "@/lib/utils";
import { usePersistScroll } from "@/hooks/use-persist-scroll";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

export type { ModuleChallengeSolveProps };

function PlaygroundFallback() {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center bg-background text-sm text-muted-foreground">
      Opening challenge…
    </div>
  );
}

function lazyPlayground(
  loader: () => Promise<Record<string, ComponentType<any>>>,
  exportName: string
) {
  return dynamic(
    () =>
      loader().then((mod) => {
        const Comp = mod[exportName];
        if (!Comp) throw new Error(`Missing export ${exportName}`);
        return { default: Comp };
      }),
    { ssr: false, loading: () => <PlaygroundFallback /> }
  );
}

function lazyExperience(loader: () => Promise<{ default: ComponentType<ModuleChallengeSolveProps> }>) {
  return dynamic(loader, { ssr: false, loading: () => <PlaygroundFallback /> });
}

const HackerrankEditor = lazyPlayground(
  () => import("@/components/learning-engine/hackerrank-editor"),
  "HackerrankEditor"
);
const ThinkingChallengeSolve = lazyPlayground(
  () => import("@/components/module-hub/thinking-challenge-solve"),
  "ThinkingChallengeSolve"
);

const ToolingRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/tooling")
);
const HtmlLiveRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/html-live")
);
const CssLiveRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/css-live")
);
const JavascriptConsoleRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/javascript-console")
);
const ReactPreviewRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/react-preview")
);
const NextjsPreviewRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/nextjs-preview")
);
const TypescriptConsoleRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/typescript-console")
);
const ApiPlaygroundRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/api-playground")
);
const AuthLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/auth-lab")
);
const SqlEditorRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/sql-editor")
);
const ModelingLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/modeling-lab")
);
const DeployLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/deploy-lab")
);
const CicdLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/cicd-lab")
);
const LlmLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/llm-lab")
);
const AiLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/ai-lab")
);
const CapstoneLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/capstone-lab")
);
const ShipLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/ship-lab")
);
const InterviewLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/interview-lab")
);
const SystemsLabRoute = lazyExperience(
  () => import("@/components/module-hub/experience-routes/systems-lab")
);

const EXPERIENCE_ROUTES: Partial<
  Record<ChallengeExperienceKind, ComponentType<ModuleChallengeSolveProps>>
> = {
  tooling: ToolingRoute,
  "html-live": HtmlLiveRoute,
  "css-live": CssLiveRoute,
  "javascript-console": JavascriptConsoleRoute,
  "react-preview": ReactPreviewRoute,
  "nextjs-preview": NextjsPreviewRoute,
  "typescript-console": TypescriptConsoleRoute,
  "api-playground": ApiPlaygroundRoute,
  "auth-lab": AuthLabRoute,
  "sql-editor": SqlEditorRoute,
  "modeling-lab": ModelingLabRoute,
  "deploy-lab": DeployLabRoute,
  "cicd-lab": CicdLabRoute,
  "llm-lab": LlmLabRoute,
  "ai-lab": AiLabRoute,
  "capstone-lab": CapstoneLabRoute,
  "ship-lab": ShipLabRoute,
  "interview-lab": InterviewLabRoute,
  "systems-lab": SystemsLabRoute,
};

const SIDE_TABS = [
  { id: "problem" as const, label: "Problem" },
  { id: "hints" as const, label: "Hints" },
];

function resolveExperience(
  moduleSlug: string,
  challenge: TopicChallenge
): ChallengeExperienceKind {
  if (challenge.thinking || challenge.experience === "thinking") {
    return "thinking";
  }
  return challenge.experience ?? getModuleChallengeExperience(moduleSlug);
}

/** Coding / SQL / API modules that already have a workspace config. */
function CodeWorkspaceSolve({
  moduleSlug,
  topicSlug,
  topicTitle,
  moduleTitle,
  challenge,
}: ModuleChallengeSolveProps) {
  const hydrated = useStoreHydrated();
  const lesson = challenge.lesson;
  const [sideTab, setSideTab] = useState<"problem" | "hints">("problem");
  const [splitPct, setSplitPct] = useState(42);
  const splitRef = useRef<HTMLDivElement>(null);

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
  const scrollKey = `module-challenge-${moduleSlug}-${topicSlug}-${lesson.id}`;
  const problemScrollRef = usePersistScroll(scrollKey, true);
  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);
  const solveHref = CURRICULUM_ROUTES.moduleChallenge(
    moduleSlug,
    topicSlug,
    challenge.id
  );

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
      scrollKey,
    }
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-background/95 px-3 backdrop-blur-sm sm:px-4">
        <Link
          href={backHref}
          prefetch={false}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Challenges</span>
        </Link>
        <div className="min-w-0 flex-1 truncate text-sm">
          <span className="font-medium text-zinc-100">{lesson.title}</span>
          <span className="text-zinc-600"> · </span>
          <span className="capitalize text-zinc-500">{lesson.difficulty}</span>
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

      <div ref={splitRef} className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className="flex min-h-0 shrink-0 overflow-hidden border-r border-zinc-800"
          style={{ width: `${splitPct}%` }}
        >
          <nav className="flex w-10 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
            {SIDE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSideTab(tab.id)}
                className={cn(
                  "flex min-h-[88px] flex-1 items-center justify-center border-b border-zinc-800/80 px-1 py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors duration-100 [writing-mode:vertical-rl] rotate-180",
                  sideTab === tab.id
                    ? "bg-zinc-900 text-emerald-500"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div
            ref={problemScrollRef}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-zinc-950"
          >
            <ProblemDocument lesson={lesson} tab={sideTab} />
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          className="group relative w-1 shrink-0 cursor-col-resize bg-zinc-800 hover:bg-emerald-600/40"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startPct = splitPct;
            const onMove = (ev: MouseEvent) => {
              const root = splitRef.current;
              if (!root) return;
              const delta = ((ev.clientX - startX) / root.clientWidth) * 100;
              setSplitPct(Math.min(65, Math.max(28, startPct + delta)));
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        />

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {lessonHasWorkspace(lesson) ? (
            <HackerrankEditor lesson={lesson} />
          ) : (
            <div className="flex h-full items-center justify-center bg-background text-sm text-zinc-500">
              No code editor for this challenge type.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Routes each challenge to the learning experience for its module.
 * Academy banks load on demand so the first paint stays under interaction budget.
 */
export function ModuleChallengeSolve(props: ModuleChallengeSolveProps) {
  const experience = resolveExperience(props.moduleSlug, props.challenge);

  if (experience === "thinking" && props.challenge.thinking) {
    return (
      <ThinkingChallengeSolve
        {...props}
        thinking={props.challenge.thinking}
      />
    );
  }

  const ExperienceRoute = EXPERIENCE_ROUTES[experience];
  if (ExperienceRoute) {
    return <ExperienceRoute {...props} />;
  }

  if (lessonHasWorkspace(props.challenge.lesson)) {
    return <CodeWorkspaceSolve {...props} />;
  }

  if (experience !== "thinking" && experience !== "code-workspace") {
    return (
      <ModuleExperiencePlaceholder
        moduleSlug={props.moduleSlug}
        topicSlug={props.topicSlug}
        moduleTitle={props.moduleTitle}
        challengeTitle={props.challenge.lesson.title}
        experience={experience}
      />
    );
  }

  return <CodeWorkspaceSolve {...props} />;
}
