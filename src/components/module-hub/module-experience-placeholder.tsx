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
  "nextjs-preview": {
    title: "Next.js Preview",
    body: "Learn App Router pages, layouts, and Next.js conventions.",
    features: ["Code editor", "App Router reference"],
  },
  "typescript-console": {
    title: "TypeScript Console",
    body: "Practice typed JavaScript with clear TypeScript references.",
    features: ["Code editor", "Type annotations", "TS reference"],
  },
  "api-playground": {
    title: "API Playground",
    body: "Explore requests and responses for backend learning.",
    features: ["Request builder", "Response inspector"],
  },
  "auth-lab": {
    title: "Auth Lab",
    body: "Learn sessions, tokens, and secure defaults with HTTP and JS references.",
    features: ["HTTP reference", "Auth patterns", "Secure defaults"],
  },
  "sql-editor": {
    title: "SQL Editor",
    body: "Write queries against sample schemas.",
    features: ["SQL editor", "Result tables"],
  },
  "modeling-lab": {
    title: "Data Modeling Lab",
    body: "Design schemas and relationships with schema notes and SQL DDL.",
    features: ["Schema reference", "SQL DDL", "ER patterns"],
  },
  "deploy-lab": {
    title: "Deploy Lab",
    body: "Practice Dockerfiles, shell release steps, and safer deploy habits.",
    features: ["Dockerfile reference", "Shell commands", "Release checklists"],
  },
  "cicd-lab": {
    title: "CI/CD Lab",
    body: "Build pipeline YAML and shell checks for automated delivery.",
    features: ["Workflow YAML", "Shell checks", "Pipeline gates"],
  },
  "llm-lab": {
    title: "LLM Lab",
    body: "Practice prompts and server-side model calls for LLM fundamentals.",
    features: ["Prompt reference", "JS API calls", "Sampling and grounding"],
  },
  "ai-lab": {
    title: "AI Features Lab",
    body: "Design product AI flows with prompts, tools, and validation.",
    features: ["Prompt templates", "Tool-ready JS", "Human-in-the-loop patterns"],
  },
  "capstone-lab": {
    title: "Capstone Lab",
    body: "Plan scope, architecture, and delivery with markdown briefs and decision JSON.",
    features: ["Project briefs", "ADR JSON", "Delivery checklists"],
  },
  "ship-lab": {
    title: "Ship Lab",
    body: "Polish, launch, and present with checklists and release shell commands.",
    features: ["Launch checklists", "Ship scripts", "Demo readiness"],
  },
  "interview-lab": {
    title: "Interview Lab",
    body: "Practice coding patterns with a talk track for communication under pressure.",
    features: ["JS pattern sketches", "Talk tracks", "Edge-case checklists"],
  },
  "systems-lab": {
    title: "Systems & Behavioral Lab",
    body: "Design writeups, capacity sketches, and STAR-ready behavioral stories.",
    features: ["Design notes", "Architecture JSON", "Behavioral structure"],
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
