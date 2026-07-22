"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { ProblemDocument } from "@/components/learning-engine/problem-document";
import { HackerrankEditor } from "@/components/learning-engine/hackerrank-editor";
import { lessonHasWorkspace } from "@/components/learning-engine/editor-workspace";
import { ThinkingChallengeSolve } from "@/components/module-hub/thinking-challenge-solve";
import { ToolingChallengeSolve } from "@/components/tooling/tooling-challenge-solve";
import { HtmlPlaygroundSolve } from "@/components/html-academy/html-playground-solve";
import { CssPlaygroundSolve } from "@/components/css-academy/css-playground-solve";
import { JsPlaygroundSolve } from "@/components/js-academy/js-playground-solve";
import { ReactPlaygroundSolve } from "@/components/react-academy/react-playground-solve";
import { NextjsPlaygroundSolve } from "@/components/nextjs-academy/nextjs-playground-solve";
import { TypescriptPlaygroundSolve } from "@/components/typescript-academy/typescript-playground-solve";
import { ApiPlaygroundSolve } from "@/components/apis-academy/api-playground-solve";
import { AuthPlaygroundSolve } from "@/components/auth-academy/auth-playground-solve";
import { SqlPlaygroundSolve } from "@/components/sql-academy/sql-playground-solve";
import { ModelingPlaygroundSolve } from "@/components/modeling-academy/modeling-playground-solve";
import { DeploymentPlaygroundSolve } from "@/components/deployment-academy/deployment-playground-solve";
import { CicdPlaygroundSolve } from "@/components/cicd-academy/cicd-playground-solve";
import { LlmPlaygroundSolve } from "@/components/llm-academy/llm-playground-solve";
import { AiFeaturesPlaygroundSolve } from "@/components/ai-features-academy/ai-features-playground-solve";
import { CapstonePlaygroundSolve } from "@/components/capstone-academy/capstone-playground-solve";
import { ShipPlaygroundSolve } from "@/components/ship-academy/ship-playground-solve";
import { InterviewPlaygroundSolve } from "@/components/interview-academy/interview-playground-solve";
import { SystemsPlaygroundSolve } from "@/components/systems-academy/systems-playground-solve";
import { ModuleExperiencePlaceholder } from "@/components/module-hub/module-experience-placeholder";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  getModuleChallengeExperience,
  type ChallengeExperienceKind,
} from "@/features/curriculum/lib/challenge-experience";
import { findDeveloperToolingChallenge } from "@/features/curriculum/lib/developer-tooling-challenges";
import { findHtmlAcademyChallenge } from "@/features/curriculum/lib/html-academy-challenges";
import { findCssAcademyChallenge } from "@/features/curriculum/lib/css-academy-challenges";
import { findJsAcademyChallenge } from "@/features/curriculum/lib/js-academy-challenges";
import { findReactAcademyChallenge } from "@/features/curriculum/lib/react-academy-challenges";
import { findNextjsAcademyChallenge } from "@/features/curriculum/lib/nextjs-academy-challenges";
import { findTypescriptAcademyChallenge } from "@/features/curriculum/lib/typescript-academy-challenges";
import { findApisAcademyChallenge } from "@/features/curriculum/lib/apis-academy-challenges";
import { findAuthAcademyChallenge } from "@/features/curriculum/lib/auth-academy-challenges";
import { findSqlAcademyChallenge } from "@/features/curriculum/lib/sql-academy-challenges";
import { findModelingAcademyChallenge } from "@/features/curriculum/lib/modeling-academy-challenges";
import { findDeploymentAcademyChallenge } from "@/features/curriculum/lib/deployment-academy-challenges";
import { findCicdAcademyChallenge } from "@/features/curriculum/lib/cicd-academy-challenges";
import { findLlmAcademyChallenge } from "@/features/curriculum/lib/llm-academy-challenges";
import { findAiFeaturesAcademyChallenge } from "@/features/curriculum/lib/ai-features-academy-challenges";
import { findCapstoneAcademyChallenge } from "@/features/curriculum/lib/capstone-academy-challenges";
import { findShipAcademyChallenge } from "@/features/curriculum/lib/ship-academy-challenges";
import { findInterviewAcademyChallenge } from "@/features/curriculum/lib/interview-academy-challenges";
import { findSystemsAcademyChallenge } from "@/features/curriculum/lib/systems-academy-challenges";
import type { TopicChallenge } from "@/features/curriculum/lib/topic-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useEntityProgress } from "@/hooks/use-curriculum";
import { cn } from "@/lib/utils";
import { usePersistScroll } from "@/hooks/use-persist-scroll";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

const SIDE_TABS = [
  { id: "problem" as const, label: "Problem" },
  { id: "hints" as const, label: "Hints" },
];

type ModuleChallengeSolveProps = {
  moduleSlug: string;
  topicSlug: string;
  topicTitle: string;
  moduleTitle: string;
  challenge: TopicChallenge;
};

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
          <nav className="flex w-10 shrink-0 flex-col border-r border-zinc-800 bg-[#0a0a0a]">
            {SIDE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSideTab(tab.id)}
                className={cn(
                  "flex min-h-[88px] flex-1 items-center justify-center border-b border-zinc-800/80 px-1 py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors [writing-mode:vertical-rl] rotate-180",
                  sideTab === tab.id
                    ? "bg-[#1a1a1a] text-emerald-400"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div
            ref={problemScrollRef}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[#1a1a1a]"
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
            const width = splitRef.current?.clientWidth ?? window.innerWidth;
            const onMove = (ev: MouseEvent) => {
              const delta = ((ev.clientX - startX) / width) * 100;
              setSplitPct(Math.min(65, Math.max(25, startPct + delta)));
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {lessonHasWorkspace(lesson) ? (
            <HackerrankEditor key={lesson.id} lesson={lesson} />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#0a0a0b] text-sm text-zinc-500">
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
 * Programming Fundamentals → Thinking Challenge (never a code editor).
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

  if (experience === "tooling") {
    const tooling = findDeveloperToolingChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (tooling) {
      return <ToolingChallengeSolve {...props} challenge={tooling} />;
    }
  }

  if (experience === "html-live") {
    const html = findHtmlAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (html) {
      return <HtmlPlaygroundSolve {...props} challenge={html} />;
    }
  }

  if (experience === "css-live") {
    const css = findCssAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (css) {
      return <CssPlaygroundSolve {...props} challenge={css} />;
    }
  }

  if (experience === "javascript-console") {
    const js = findJsAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (js) {
      return <JsPlaygroundSolve {...props} challenge={js} />;
    }
  }

  if (experience === "react-preview") {
    const react = findReactAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (react) {
      return <ReactPlaygroundSolve {...props} challenge={react} />;
    }
  }

  if (experience === "nextjs-preview") {
    const nextjs = findNextjsAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (nextjs) {
      return <NextjsPlaygroundSolve {...props} challenge={nextjs} />;
    }
  }

  if (experience === "typescript-console") {
    const ts = findTypescriptAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (ts) {
      return <TypescriptPlaygroundSolve {...props} challenge={ts} />;
    }
  }

  if (experience === "api-playground") {
    const apis = findApisAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (apis) {
      return <ApiPlaygroundSolve {...props} challenge={apis} />;
    }
  }

  if (experience === "auth-lab") {
    const auth = findAuthAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (auth) {
      return <AuthPlaygroundSolve {...props} challenge={auth} />;
    }
  }

  if (experience === "sql-editor") {
    const sql = findSqlAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (sql) {
      return <SqlPlaygroundSolve {...props} challenge={sql} />;
    }
  }

  if (experience === "modeling-lab") {
    const modeling = findModelingAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (modeling) {
      return <ModelingPlaygroundSolve {...props} challenge={modeling} />;
    }
  }

  if (experience === "deploy-lab") {
    const deploy = findDeploymentAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (deploy) {
      return <DeploymentPlaygroundSolve {...props} challenge={deploy} />;
    }
  }

  if (experience === "cicd-lab") {
    const cicd = findCicdAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (cicd) {
      return <CicdPlaygroundSolve {...props} challenge={cicd} />;
    }
  }

  if (experience === "llm-lab") {
    const llm = findLlmAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (llm) {
      return <LlmPlaygroundSolve {...props} challenge={llm} />;
    }
  }

  if (experience === "ai-lab") {
    const ai = findAiFeaturesAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (ai) {
      return <AiFeaturesPlaygroundSolve {...props} challenge={ai} />;
    }
  }

  if (experience === "capstone-lab") {
    const capstone = findCapstoneAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (capstone) {
      return <CapstonePlaygroundSolve {...props} challenge={capstone} />;
    }
  }

  if (experience === "ship-lab") {
    const ship = findShipAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (ship) {
      return <ShipPlaygroundSolve {...props} challenge={ship} />;
    }
  }

  if (experience === "interview-lab") {
    const interview = findInterviewAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (interview) {
      return <InterviewPlaygroundSolve {...props} challenge={interview} />;
    }
  }

  if (experience === "systems-lab") {
    const systems = findSystemsAcademyChallenge(
      props.topicSlug,
      props.challenge.id
    );
    if (systems) {
      return <SystemsPlaygroundSolve {...props} challenge={systems} />;
    }
  }

  if (lessonHasWorkspace(props.challenge.lesson)) {
    return <CodeWorkspaceSolve {...props} />;
  }

  if (
    experience !== "thinking" &&
    experience !== "code-workspace"
  ) {
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
