"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  experienceLabel,
  type ChallengeExperienceKind,
} from "@/features/curriculum/lib/challenge-experience";

const EXPERIENCE_COPY: Record<
  Exclude<ChallengeExperienceKind, "thinking" | "code-workspace">,
  { title: string; body: string; features: string[] }
> = {
  tooling: {
    title: "Tooling Lab",
    body: "Interactive terminal, Git, and editor simulations for this module.",
    features: [
      "Terminal simulation",
      "Git simulation",
      "VS Code-style exercises",
      "Folder structure challenges",
    ],
  },
  "html-live": {
    title: "HTML Live Preview",
    body: "Write HTML and see it render instantly.",
    features: ["Code editor", "Live preview", "HTML rendering"],
  },
  "css-live": {
    title: "CSS Live Preview",
    body: "Style with CSS and preview changes live.",
    features: ["Code editor", "Live preview"],
  },
  "javascript-console": {
    title: "JavaScript Console",
    body: "Run JavaScript with console output — no fake Java workspace.",
    features: ["Code editor", "Console", "Program output"],
  },
  "react-preview": {
    title: "React Preview",
    body: "Build components and preview the UI.",
    features: ["Code editor", "Component preview"],
  },
  "api-playground": {
    title: "API Playground",
    body: "Explore requests and responses for backend learning.",
    features: ["Request builder", "Response inspector"],
  },
  "sql-editor": {
    title: "SQL Editor",
    body: "Write queries against sample schemas.",
    features: ["SQL editor", "Result tables"],
  },
};

type ModuleExperiencePlaceholderProps = {
  moduleSlug: string;
  topicSlug: string;
  moduleTitle: string;
  challengeTitle: string;
  experience: Exclude<ChallengeExperienceKind, "thinking" | "code-workspace">;
};

export function ModuleExperiencePlaceholder({
  moduleSlug,
  topicSlug,
  moduleTitle,
  challengeTitle,
  experience,
}: ModuleExperiencePlaceholderProps) {
  const copy = EXPERIENCE_COPY[experience];
  const backHref = CURRICULUM_ROUTES.moduleHub(moduleSlug, topicSlug);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0d0d0d]">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800 px-3 sm:px-4">
        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Challenges
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm text-zinc-200">
          {challengeTitle}
        </p>
      </header>
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <div className="max-w-lg space-y-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500/80">
            {moduleTitle} · {experienceLabel(experience)}
          </p>
          <h1 className="text-2xl font-semibold text-zinc-50">{copy.title}</h1>
          <p className="text-sm text-zinc-400">{copy.body}</p>
          <ul className="mx-auto max-w-xs space-y-1.5 text-left text-sm text-zinc-500">
            {copy.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="pt-2 text-xs text-zinc-600">
            This learning experience is next — Programming Fundamentals already
            uses Thinking Challenges. Coding modules keep a real workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
