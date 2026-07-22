"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  Lock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import {
  formatModuleDuration,
  moduleDifficulty,
} from "@/features/curriculum/lib/module-hub";
import {
  buildTopicCards,
  type TopicCardModel,
} from "@/features/curriculum/lib/topic-cards";
import {
  resolveTopicChallenges,
  getTopicChallengeLimit,
  curriculumChallengeEntityId,
} from "@/features/curriculum/lib/topic-challenges";
import { isProgrammingFundamentalsModule } from "@/features/curriculum/lib/programming-fundamentals";
import { isDeveloperToolingModule } from "@/features/curriculum/lib/developer-tooling";
import { findDeveloperToolingChallenge } from "@/features/curriculum/lib/developer-tooling-challenges";
import { isHtmlAcademyModule } from "@/features/curriculum/lib/html-academy";
import { findHtmlAcademyChallenge } from "@/features/curriculum/lib/html-academy-challenges";
import { isCssAcademyModule } from "@/features/curriculum/lib/css-academy";
import { findCssAcademyChallenge } from "@/features/curriculum/lib/css-academy-challenges";
import { isJsAcademyModule } from "@/features/curriculum/lib/js-academy";
import { findJsAcademyChallenge } from "@/features/curriculum/lib/js-academy-challenges";
import { isReactAcademyModule } from "@/features/curriculum/lib/react-academy";
import { findReactAcademyChallenge } from "@/features/curriculum/lib/react-academy-challenges";
import { isNextjsAcademyModule } from "@/features/curriculum/lib/nextjs-academy";
import { findNextjsAcademyChallenge } from "@/features/curriculum/lib/nextjs-academy-challenges";
import { isTypescriptAcademyModule } from "@/features/curriculum/lib/typescript-academy";
import { findTypescriptAcademyChallenge } from "@/features/curriculum/lib/typescript-academy-challenges";
import { isApisAcademyModule } from "@/features/curriculum/lib/apis-academy";
import { findApisAcademyChallenge } from "@/features/curriculum/lib/apis-academy-challenges";
import { isAuthAcademyModule } from "@/features/curriculum/lib/auth-academy";
import { findAuthAcademyChallenge } from "@/features/curriculum/lib/auth-academy-challenges";
import { isSqlAcademyModule } from "@/features/curriculum/lib/sql-academy";
import { findSqlAcademyChallenge } from "@/features/curriculum/lib/sql-academy-challenges";
import { isModelingAcademyModule } from "@/features/curriculum/lib/modeling-academy";
import { findModelingAcademyChallenge } from "@/features/curriculum/lib/modeling-academy-challenges";
import { isDeploymentAcademyModule } from "@/features/curriculum/lib/deployment-academy";
import { findDeploymentAcademyChallenge } from "@/features/curriculum/lib/deployment-academy-challenges";
import { isCicdAcademyModule } from "@/features/curriculum/lib/cicd-academy";
import { findCicdAcademyChallenge } from "@/features/curriculum/lib/cicd-academy-challenges";
import { isLlmAcademyModule } from "@/features/curriculum/lib/llm-academy";
import { findLlmAcademyChallenge } from "@/features/curriculum/lib/llm-academy-challenges";
import { isAiFeaturesAcademyModule } from "@/features/curriculum/lib/ai-features-academy";
import { findAiFeaturesAcademyChallenge } from "@/features/curriculum/lib/ai-features-academy-challenges";
import { isCapstoneAcademyModule } from "@/features/curriculum/lib/capstone-academy";
import { findCapstoneAcademyChallenge } from "@/features/curriculum/lib/capstone-academy-challenges";
import { isShipAcademyModule } from "@/features/curriculum/lib/ship-academy";
import { findShipAcademyChallenge } from "@/features/curriculum/lib/ship-academy-challenges";
import { isInterviewAcademyModule } from "@/features/curriculum/lib/interview-academy";
import { findInterviewAcademyChallenge } from "@/features/curriculum/lib/interview-academy-challenges";
import { isSystemsAcademyModule } from "@/features/curriculum/lib/systems-academy";
import { findSystemsAcademyChallenge } from "@/features/curriculum/lib/systems-academy-challenges";
import { prefetchModuleTopic, useModuleHub } from "@/features/curriculum/hooks/use-module-hub";
import { DIFFICULTY_LABELS, problemTypeLabel } from "@/learning-engine/labels";
import type { LearnDifficulty } from "@/learning-engine/types";
import { categoryLabel } from "@/components/learning-engine/lesson-renderer";
import { THINKING_KIND_LABELS } from "@/features/curriculum/lib/thinking-challenge";
import { useProgressStore } from "@/store/use-progress-store";

const TOOLING_KIND_LABELS: Record<string, string> = {
  terminal: "Terminal Practice",
  git: "Git Practice",
  scenario: "Scenario Based",
  debug: "Debugging",
  recovery: "Recovery",
};

const HTML_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  a11y: "Accessibility",
  seo: "SEO",
  semantic: "Semantic HTML",
  interview: "Interview",
  project: "Mini Project",
};

const CSS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Layout",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const JS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const REACT_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const NEXTJS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const TS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const APIS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const AUTH_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const SQL_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const MODELING_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const DEPLOY_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const CICD_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const LLM_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const AI_FEATURES_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const CAPSTONE_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const SHIP_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const INTERVIEW_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

const SYSTEMS_KIND_LABELS: Record<string, string> = {
  build: "Build",
  fix: "Bug Fix",
  layout: "Practice",
  responsive: "Responsive",
  interview: "Interview",
  project: "Mini Project",
};

function isChallengeHubModule(moduleSlug: string) {
  return (
    isProgrammingFundamentalsModule(moduleSlug) ||
    isDeveloperToolingModule(moduleSlug) ||
    isHtmlAcademyModule(moduleSlug) ||
    isCssAcademyModule(moduleSlug) ||
    isJsAcademyModule(moduleSlug) ||
    isReactAcademyModule(moduleSlug) ||
    isNextjsAcademyModule(moduleSlug) ||
    isTypescriptAcademyModule(moduleSlug) ||
    isApisAcademyModule(moduleSlug) ||
    isAuthAcademyModule(moduleSlug) ||
    isSqlAcademyModule(moduleSlug) ||
    isModelingAcademyModule(moduleSlug) ||
    isDeploymentAcademyModule(moduleSlug) ||
    isCicdAcademyModule(moduleSlug) ||
    isLlmAcademyModule(moduleSlug) ||
    isAiFeaturesAcademyModule(moduleSlug) ||
    isCapstoneAcademyModule(moduleSlug) ||
    isShipAcademyModule(moduleSlug) ||
    isInterviewAcademyModule(moduleSlug) ||
    isSystemsAcademyModule(moduleSlug)
  );
}
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useTrackResumePosition } from "@/hooks/use-resume-position";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

type ModuleChallengeItem = {
  id: string;
  weekId: number;
  topicSlug: string;
  curriculumTopicSlug: string;
  curriculumTopicTitle: string;
  topicIndex: number;
  lessonIndex: number;
  lesson: ReturnType<typeof resolveTopicChallenges>[number]["lesson"];
  entityId: string;
  thinking?: ReturnType<typeof resolveTopicChallenges>[number]["thinking"];
  toolingKind?: string;
  toolingScenario?: string;
  htmlKind?: string;
  htmlScenario?: string;
  cssKind?: string;
  cssScenario?: string;
  jsKind?: string;
  jsScenario?: string;
  reactKind?: string;
  reactScenario?: string;
  nextjsKind?: string;
  nextjsScenario?: string;
  tsKind?: string;
  tsScenario?: string;
  apisKind?: string;
  apisScenario?: string;
  authKind?: string;
  authScenario?: string;
  sqlKind?: string;
  sqlScenario?: string;
  modelingKind?: string;
  modelingScenario?: string;
  deployKind?: string;
  deployScenario?: string;
  cicdKind?: string;
  cicdScenario?: string;
  llmKind?: string;
  llmScenario?: string;
  aiFeaturesKind?: string;
  aiFeaturesScenario?: string;
  capstoneKind?: string;
  capstoneScenario?: string;
  shipKind?: string;
  shipScenario?: string;
  interviewKind?: string;
  interviewScenario?: string;
  systemsKind?: string;
  systemsScenario?: string;
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-zinc-800/80 pb-4 last:border-0">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900 accent-emerald-500"
      />
      {label}
    </label>
  );
}

const DIFFICULTY_COLORS: Record<LearnDifficulty, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

export function ModuleTopicExplorer() {
  const params = useParams<{ slug: string }>();
  const moduleSlug = params.slug;
  const hub = useModuleHub(moduleSlug);
  const payload = hub.data;
  const { detail } = payload ?? { detail: null };

  if (!payload || !detail) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-6 pb-10">
        <div className="h-4 w-48 rounded bg-zinc-800" />
        <div className="h-24 rounded-xl bg-zinc-900/50" />
        <div className="h-10 rounded bg-zinc-900/50" />
        <div className="h-64 rounded-xl bg-zinc-900/40" />
      </div>
    );
  }

  return <ModuleTopicExplorerInner payload={payload} />;
}

function ModuleTopicExplorerInner({
  payload,
}: {
  payload: ModuleHubPayload;
}) {
  const { detail } = payload;
  const moduleSlug = detail.module.slug;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const hydrated = useStoreHydrated();

  const cards = useMemo(
    () => buildTopicCards(detail.lessons, moduleSlug),
    [detail.lessons, moduleSlug]
  );

  const validTopicSlugs = useMemo(
    () => new Set(cards.map((c) => c.slug)),
    [cards]
  );

  const [activeTopic, setActiveTopic] = useState("all");
  const [page, setPage] = useState(0);
  const [showSolved, setShowSolved] = useState(true);
  const [showUnsolved, setShowUnsolved] = useState(true);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [diffEasy, setDiffEasy] = useState(true);
  const [diffMedium, setDiffMedium] = useState(true);
  const [diffHard, setDiffHard] = useState(true);

  useEffect(() => {
    const topic = searchParams.get("topic");
    const hubModule = isChallengeHubModule(moduleSlug);

    if (hubModule) {
      const fallback = cards[0]?.slug;
      const next =
        topic && validTopicSlugs.has(topic) ? topic : (fallback ?? "all");
      setActiveTopic(next);
      if (!topic && fallback) {
        router.replace(CURRICULUM_ROUTES.moduleHub(moduleSlug, fallback), {
          scroll: false,
        });
      }
      return;
    }

    const next = topic && validTopicSlugs.has(topic) ? topic : "all";
    setActiveTopic(next);
  }, [searchParams, validTopicSlugs, moduleSlug, cards, router]);

  useEffect(() => {
    for (const card of cards.slice(0, 5)) {
      if (card.status !== "locked") {
        prefetchModuleTopic(queryClient, moduleSlug, card.slug);
      }
    }
  }, [cards, moduleSlug, queryClient]);

  const syncTopicUrl = useCallback(
    (slug: string) => {
      router.replace(CURRICULUM_ROUTES.moduleHub(moduleSlug, slug === "all" ? null : slug), {
        scroll: false,
      });
    },
    [moduleSlug, router]
  );

  const isDoneFn = useProgressStore((s) => s.isDone);
  const isBookmarkedFn = useProgressStore((s) => s.isBookmarked);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);

  const allChallenges = useMemo<ModuleChallengeItem[]>(() => {
    const items: ModuleChallengeItem[] = [];
    cards.forEach((card, topicIndex) => {
      if (card.status === "locked") return;
      const challenges = resolveTopicChallenges(
        moduleSlug,
        card.slug,
        card.title,
        getTopicChallengeLimit(moduleSlug, card.slug)
      );
      challenges.forEach((challenge, lessonIndex) => {
        const tooling = isDeveloperToolingModule(moduleSlug)
          ? findDeveloperToolingChallenge(card.slug, challenge.id)
          : null;
        const html = isHtmlAcademyModule(moduleSlug)
          ? findHtmlAcademyChallenge(card.slug, challenge.id)
          : null;
        const css = isCssAcademyModule(moduleSlug)
          ? findCssAcademyChallenge(card.slug, challenge.id)
          : null;
        const js = isJsAcademyModule(moduleSlug)
          ? findJsAcademyChallenge(card.slug, challenge.id)
          : null;
        const react = isReactAcademyModule(moduleSlug)
          ? findReactAcademyChallenge(card.slug, challenge.id)
          : null;
        const nextjs = isNextjsAcademyModule(moduleSlug)
          ? findNextjsAcademyChallenge(card.slug, challenge.id)
          : null;
        const ts = isTypescriptAcademyModule(moduleSlug)
          ? findTypescriptAcademyChallenge(card.slug, challenge.id)
          : null;
        const apis = isApisAcademyModule(moduleSlug)
          ? findApisAcademyChallenge(card.slug, challenge.id)
          : null;
        const auth = isAuthAcademyModule(moduleSlug)
          ? findAuthAcademyChallenge(card.slug, challenge.id)
          : null;
        const sql = isSqlAcademyModule(moduleSlug)
          ? findSqlAcademyChallenge(card.slug, challenge.id)
          : null;
        const modeling = isModelingAcademyModule(moduleSlug)
          ? findModelingAcademyChallenge(card.slug, challenge.id)
          : null;
        const deploy = isDeploymentAcademyModule(moduleSlug)
          ? findDeploymentAcademyChallenge(card.slug, challenge.id)
          : null;
        const cicd = isCicdAcademyModule(moduleSlug)
          ? findCicdAcademyChallenge(card.slug, challenge.id)
          : null;
        const llm = isLlmAcademyModule(moduleSlug)
          ? findLlmAcademyChallenge(card.slug, challenge.id)
          : null;
        const aiFeatures = isAiFeaturesAcademyModule(moduleSlug)
          ? findAiFeaturesAcademyChallenge(card.slug, challenge.id)
          : null;
        const capstone = isCapstoneAcademyModule(moduleSlug)
          ? findCapstoneAcademyChallenge(card.slug, challenge.id)
          : null;
        const ship = isShipAcademyModule(moduleSlug)
          ? findShipAcademyChallenge(card.slug, challenge.id)
          : null;
        const interview = isInterviewAcademyModule(moduleSlug)
          ? findInterviewAcademyChallenge(card.slug, challenge.id)
          : null;
        const systems = isSystemsAcademyModule(moduleSlug)
          ? findSystemsAcademyChallenge(card.slug, challenge.id)
          : null;
        items.push({
          id: challenge.id,
          weekId: challenge.weekId,
          topicSlug: challenge.topicSlug,
          curriculumTopicSlug: card.slug,
          curriculumTopicTitle: card.title,
          topicIndex,
          lessonIndex,
          lesson: challenge.lesson,
          thinking: challenge.thinking,
          toolingKind: tooling?.kind,
          toolingScenario: tooling?.scenario,
          htmlKind: html?.kind,
          htmlScenario: html?.scenario,
          cssKind: css?.kind,
          cssScenario: css?.scenario,
          jsKind: js?.kind,
          jsScenario: js?.scenario,
          reactKind: react?.kind,
          reactScenario: react?.scenario,
          nextjsKind: nextjs?.kind,
          nextjsScenario: nextjs?.scenario,
          tsKind: ts?.kind,
          tsScenario: ts?.scenario,
          apisKind: apis?.kind,
          apisScenario: apis?.scenario,
          authKind: auth?.kind,
          authScenario: auth?.scenario,
          sqlKind: sql?.kind,
          sqlScenario: sql?.scenario,
          modelingKind: modeling?.kind,
          modelingScenario: modeling?.scenario,
          deployKind: deploy?.kind,
          deployScenario: deploy?.scenario,
          cicdKind: cicd?.kind,
          cicdScenario: cicd?.scenario,
          llmKind: llm?.kind,
          llmScenario: llm?.scenario,
          aiFeaturesKind: aiFeatures?.kind,
          aiFeaturesScenario: aiFeatures?.scenario,
          capstoneKind: capstone?.kind,
          capstoneScenario: capstone?.scenario,
          shipKind: ship?.kind,
          shipScenario: ship?.scenario,
          interviewKind: interview?.kind,
          interviewScenario: interview?.scenario,
          systemsKind: systems?.kind,
          systemsScenario: systems?.scenario,
          entityId: curriculumChallengeEntityId(moduleSlug, {
            weekId: challenge.weekId || 0,
            topicSlug: challenge.topicSlug,
            lesson: challenge.lesson,
          }),
        });
      });
    });
    return items;
  }, [cards, moduleSlug]);

  const challengeProgress = useMemo(() => {
    const total = allChallenges.length;
    if (!hydrated || total === 0) {
      return { completed: 0, total, percent: detail.progressPercent };
    }
    const completed = allChallenges.filter((c) => isDoneFn(c.entityId)).length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [allChallenges, detail.progressPercent, hydrated, isDoneFn]);

  const filteredAndSorted = useMemo(() => {
    const byDifficultyRank: Record<LearnDifficulty, number> = {
      easy: 0,
      medium: 1,
      hard: 2,
    };

    return allChallenges
      .filter((c) => {
        if (activeTopic !== "all" && c.curriculumTopicSlug !== activeTopic) {
          return false;
        }
        const done = hydrated && isDoneFn(c.entityId);
        if (done && !showSolved) return false;
        if (!done && !showUnsolved) return false;
        if (bookmarkedOnly && !isBookmarkedFn(c.entityId)) return false;
        const d = c.lesson.difficulty;
        if (d === "easy" && !diffEasy) return false;
        if (d === "medium" && !diffMedium) return false;
        if (d === "hard" && !diffHard) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.topicIndex !== b.topicIndex) return a.topicIndex - b.topicIndex;
        const da = byDifficultyRank[a.lesson.difficulty];
        const db = byDifficultyRank[b.lesson.difficulty];
        if (da !== db) return da - db;
        return a.lessonIndex - b.lessonIndex;
      });
  }, [
    activeTopic,
    allChallenges,
    bookmarkedOnly,
    diffEasy,
    diffHard,
    diffMedium,
    hydrated,
    isBookmarkedFn,
    isDoneFn,
    showSolved,
    showUnsolved,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const pageItems = filteredAndSorted.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const selectTopic = (slug: string, card?: TopicCardModel) => {
    if (card?.status === "locked") return;
    setActiveTopic(slug);
    setPage(0);
    syncTopicUrl(slug);
  };

  const activeCard =
    activeTopic === "all"
      ? null
      : cards.find((c) => c.slug === activeTopic);

  const activeTopicTitle =
    activeTopic === "all"
      ? "All topics"
      : (activeCard?.title ?? activeTopic);

  const hubHref = CURRICULUM_ROUTES.moduleHub(
    moduleSlug,
    activeTopic === "all" ? null : activeTopic
  );

  useTrackResumePosition(
    "roadmap",
    Math.max(1, detail.module.sort_order),
    detail.module.title,
    activeTopicTitle,
    hubHref,
    hydrated,
    activeTopic !== "all" && activeCard
      ? { topicSlug: activeTopic, topicTitle: activeTopicTitle }
      : { topicTitle: detail.module.title }
  );

  const displayProgress = hydrated
    ? challengeProgress
    : { completed: 0, total: challengeProgress.total, percent: 0 };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      <div className="shrink-0 space-y-4 border-b border-zinc-800/80 bg-zinc-950 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 ring-1 ring-violet-500/25">
                Module
              </span>
              <DifficultyBadge difficulty={moduleDifficulty(detail.lessons)} />
              {!isChallengeHubModule(moduleSlug) ? (
                <span className="text-[11px] text-zinc-500">
                  {formatModuleDuration(detail)}
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                {detail.module.title}
              </h1>
              <p
                className="text-xs tabular-nums text-zinc-500 sm:text-sm"
                suppressHydrationWarning
              >
                {hydrated
                  ? `Challenges: ${displayProgress.completed}/${displayProgress.total} · Topics: ${detail.completedCount}/${detail.totalCount}`
                  : "\u00a0"}
              </p>
            </div>
            {detail.module.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                {detail.module.description}
              </p>
            ) : null}
          </div>

          <div className="flex w-full shrink-0 items-center gap-3 sm:w-52 sm:pt-8">
            <Progress value={displayProgress.percent} className="h-2 flex-1" />
            <span
              className="min-w-[2.5rem] text-right text-sm font-semibold tabular-nums text-emerald-400"
              suppressHydrationWarning
            >
              {hydrated ? `${displayProgress.percent}%` : "\u00a0"}
            </span>
          </div>
        </div>

        <div className="topic-pills-scroll -mx-1 flex items-center gap-2 overflow-x-auto px-1 pt-1 pb-2.5">
          {!isChallengeHubModule(moduleSlug) ? (
            <button
              type="button"
              onClick={() => selectTopic("all")}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                activeTopic === "all"
                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35"
                  : "bg-zinc-900/80 text-zinc-400 ring-1 ring-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              All Topics
            </button>
          ) : null}
          {cards.map((card) => {
            const locked = card.status === "locked";
            const active = activeTopic === card.slug;
            return (
              <button
                key={card.slug}
                type="button"
                disabled={locked}
                onClick={() => selectTopic(card.slug, card)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35"
                    : locked
                      ? "cursor-not-allowed bg-zinc-950 text-zinc-600 ring-1 ring-zinc-900"
                      : "bg-zinc-900/80 text-zinc-400 ring-1 ring-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                {locked ? <Lock className="h-3 w-3" /> : null}
                {card.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden pt-4 lg:flex-row">
        <div className="module-list-scroll min-h-0 min-w-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pb-8 pr-1">
          {pageItems.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-sm text-zinc-500">
              {activeCard?.status === "locked"
                ? "Complete the previous topic to unlock practice here."
                : "No challenges match your filters."}
            </div>
          ) : (
            pageItems.map((item, i) => {
              const { lesson, curriculumTopicTitle, entityId } = item;
              const done = hydrated && isDoneFn(entityId);
              const bookmarked = isBookmarkedFn(entityId);
              const isFirst = page === 0 && i === 0;
              const challengeNumber = String(page * PAGE_SIZE + i + 1).padStart(
                3,
                "0"
              );
              const estimatedMinutes =
                lesson.estimatedMinutes ??
                (lesson.difficulty === "easy"
                  ? 8
                  : lesson.difficulty === "medium"
                    ? 15
                    : 25);
              const xpPoints =
                estimatedMinutes *
                (lesson.difficulty === "easy"
                  ? 2
                  : lesson.difficulty === "medium"
                    ? 3
                    : 4);
              const successRate =
                lesson.difficulty === "easy"
                  ? 82
                  : lesson.difficulty === "medium"
                    ? 67
                    : 41;

              return (
                <article
                  key={entityId}
                  className="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(entityId)}
                          className={cn(
                            "mt-0.5 shrink-0 rounded-full border border-zinc-800 p-1 transition-colors",
                            bookmarked
                              ? "border-amber-400/60 bg-amber-500/10"
                              : "hover:border-amber-500/60"
                          )}
                          aria-label={
                            bookmarked
                              ? "Remove bookmark"
                              : "Bookmark challenge"
                          }
                        >
                          {bookmarked ? (
                            <Bookmark className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ) : (
                            <Star className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                            <span className="rounded bg-zinc-800/70 px-1.5 py-0.5 text-[10px] text-zinc-300">
                              #{challengeNumber}
                            </span>
                            {activeTopic === "all" ? (
                              <span>{curriculumTopicTitle}</span>
                            ) : null}
                          </div>
                          <h2 className="mt-1 text-base font-semibold text-zinc-100">
                            {lesson.title}
                          </h2>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                            <span
                              className={cn(
                                "font-semibold",
                                DIFFICULTY_COLORS[lesson.difficulty]
                              )}
                            >
                              {DIFFICULTY_LABELS[lesson.difficulty]}
                            </span>
                            <span>|</span>
                            <span>
                              {item.thinking
                                ? THINKING_KIND_LABELS[item.thinking.kind]
                                : item.toolingKind
                                  ? (TOOLING_KIND_LABELS[item.toolingKind] ??
                                    item.toolingKind)
                                  : item.htmlKind
                                    ? (HTML_KIND_LABELS[item.htmlKind] ??
                                      item.htmlKind)
                                    : item.cssKind
                                      ? (CSS_KIND_LABELS[item.cssKind] ??
                                        item.cssKind)
                                      : item.jsKind
                                        ? (JS_KIND_LABELS[item.jsKind] ??
                                          item.jsKind)
                                        : item.reactKind
                                          ? (REACT_KIND_LABELS[item.reactKind] ??
                                            item.reactKind)
                                          : item.nextjsKind
                                            ? (NEXTJS_KIND_LABELS[
                                                item.nextjsKind
                                              ] ?? item.nextjsKind)
                                            : item.tsKind
                                              ? (TS_KIND_LABELS[item.tsKind] ??
                                                item.tsKind)
                                              : item.apisKind
                                                ? (APIS_KIND_LABELS[
                                                    item.apisKind
                                                  ] ?? item.apisKind)
                                                : item.authKind
                                                  ? (AUTH_KIND_LABELS[
                                                      item.authKind
                                                    ] ?? item.authKind)
                                                  : item.sqlKind
                                                    ? (SQL_KIND_LABELS[
                                                        item.sqlKind
                                                      ] ?? item.sqlKind)
                                                    : item.modelingKind
                                                      ? (MODELING_KIND_LABELS[
                                                          item.modelingKind
                                                        ] ?? item.modelingKind)
                                                      : item.deployKind
                                                        ? (DEPLOY_KIND_LABELS[
                                                            item.deployKind
                                                          ] ?? item.deployKind)
                                                        : item.cicdKind
                                                          ? (CICD_KIND_LABELS[
                                                              item.cicdKind
                                                            ] ?? item.cicdKind)
                                                          : item.llmKind
                                                            ? (LLM_KIND_LABELS[
                                                                item.llmKind
                                                              ] ?? item.llmKind)
                                                            : item.aiFeaturesKind
                                                              ? (AI_FEATURES_KIND_LABELS[
                                                                  item.aiFeaturesKind
                                                                ] ??
                                                                item.aiFeaturesKind)
                                                              : item.capstoneKind
                                                                ? (CAPSTONE_KIND_LABELS[
                                                                    item.capstoneKind
                                                                  ] ??
                                                                  item.capstoneKind)
                                                                : item.shipKind
                                                                  ? (SHIP_KIND_LABELS[
                                                                      item.shipKind
                                                                    ] ??
                                                                    item.shipKind)
                                                                  : item.interviewKind
                                                                    ? (INTERVIEW_KIND_LABELS[
                                                                        item.interviewKind
                                                                      ] ??
                                                                      item.interviewKind)
                                                                    : item.systemsKind
                                                                      ? (SYSTEMS_KIND_LABELS[
                                                                          item.systemsKind
                                                                        ] ??
                                                                        item.systemsKind)
                                                                      : problemTypeLabel(
                                                                          lesson.problemType
                                                                        )}
                            </span>
                            <span>|</span>
                            <span>Est. {estimatedMinutes} min</span>
                            <span>|</span>
                            <span>{xpPoints} XP</span>
                            <span>|</span>
                            <span className="tabular-nums text-emerald-400">
                              {successRate}% success
                            </span>
                            {done ? (
                              <>
                                <span>|</span>
                                <span className="text-emerald-400">Solved</span>
                              </>
                            ) : null}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                            {item.thinking?.scenario ??
                              item.toolingScenario ??
                              item.htmlScenario ??
                              item.cssScenario ??
                              item.jsScenario ??
                              item.reactScenario ??
                              item.nextjsScenario ??
                              item.tsScenario ??
                              item.apisScenario ??
                              item.authScenario ??
                              item.sqlScenario ??
                              item.modelingScenario ??
                              item.deployScenario ??
                              item.cicdScenario ??
                              item.llmScenario ??
                              item.aiFeaturesScenario ??
                              item.capstoneScenario ??
                              item.shipScenario ??
                              item.interviewScenario ??
                              item.systemsScenario ??
                              lesson.description ??
                              `Practice ${categoryLabel(lesson.category)} concepts.`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "h-9 min-w-[8.5rem] shrink-0 font-semibold",
                        isFirst && !done
                          ? "bg-emerald-600 hover:bg-emerald-500"
                          : done
                            ? "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                            : "border border-emerald-600/60 bg-transparent text-emerald-400 hover:bg-emerald-500/10"
                      )}
                      variant={isFirst && !done ? "default" : "outline"}
                    >
                      <Link
                        href={CURRICULUM_ROUTES.moduleChallenge(
                          moduleSlug,
                          item.curriculumTopicSlug,
                          item.id
                        )}
                      >
                        {done ? "Solved" : "Solve Challenge"}
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 border-zinc-800"
              >
                Previous
              </Button>
              <span className="text-xs tabular-nums text-zinc-500">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 border-zinc-800"
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>

        <aside className="hidden w-64 shrink-0 space-y-4 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 lg:block">
          <FilterSection title="Status">
            <FilterCheckbox
              label="Solved"
              checked={showSolved}
              onChange={setShowSolved}
            />
            <FilterCheckbox
              label="Unsolved"
              checked={showUnsolved}
              onChange={setShowUnsolved}
            />
            <FilterCheckbox
              label="Bookmarked only"
              checked={bookmarkedOnly}
              onChange={setBookmarkedOnly}
            />
          </FilterSection>
          <FilterSection title="Difficulty">
            <FilterCheckbox
              label="Easy"
              checked={diffEasy}
              onChange={setDiffEasy}
            />
            <FilterCheckbox
              label="Medium"
              checked={diffMedium}
              onChange={setDiffMedium}
            />
            <FilterCheckbox
              label="Hard"
              checked={diffHard}
              onChange={setDiffHard}
            />
          </FilterSection>
        </aside>
      </div>
    </div>
  );
}
