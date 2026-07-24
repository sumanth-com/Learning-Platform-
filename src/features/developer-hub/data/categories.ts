import type { HubCategoryId, HubCategoryMeta } from "../types";

export const HUB_CATEGORIES: HubCategoryMeta[] = [
  {
    id: "fundamentals",
    label: "Engineering Fundamentals",
    emoji: "🔥",
    description: "Architecture, patterns, algorithms, and code quality.",
  },
  {
    id: "frontend",
    label: "Frontend",
    emoji: "⚛",
    description: "HTML, CSS, JS/TS, React, Next.js, and accessibility.",
  },
  {
    id: "backend",
    label: "Backend",
    emoji: "⚙",
    description: "APIs, Node, Python, Java, and service design.",
  },
  {
    id: "database",
    label: "Databases",
    emoji: "🗄",
    description: "SQL, NoSQL, indexing, caching, and ORMs.",
  },
  {
    id: "devops",
    label: "DevOps",
    emoji: "☁",
    description: "Docker, CI/CD, cloud, monitoring, and delivery.",
  },
  {
    id: "ai",
    label: "AI Engineering",
    emoji: "🤖",
    description: "LLMs, agents, RAG, evaluation, and tooling.",
  },
  {
    id: "system-design",
    label: "System Design",
    emoji: "🏗",
    description: "Auth, payments, chat, SaaS, and scale.",
  },
  {
    id: "security",
    label: "Security",
    emoji: "🔐",
    description: "OWASP, auth threats, encryption, and hardening.",
  },
  {
    id: "career",
    label: "Career",
    emoji: "🚀",
    description: "Portfolio, interviews, open source, and growth.",
  },
  {
    id: "mobile",
    label: "Mobile",
    emoji: "📱",
    description: "Native and cross-platform mobile engineering.",
  },
  {
    id: "data",
    label: "Data",
    emoji: "📊",
    description: "Analytics, pipelines, and data modeling.",
  },
  {
    id: "open-source",
    label: "Open Source",
    emoji: "📂",
    description: "Contributing, maintainership, and community.",
  },
];

export const HUB_QUICK_FILTERS: { id: HubCategoryId | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "database", label: "Database" },
    { id: "devops", label: "DevOps" },
    { id: "ai", label: "AI" },
    { id: "system-design", label: "System Design" },
    { id: "security", label: "Security" },
    { id: "career", label: "Career" },
    { id: "mobile", label: "Mobile" },
    { id: "data", label: "Data" },
    { id: "open-source", label: "Open Source" },
  ];

export const HUB_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

export function categoryMeta(id: HubCategoryId): HubCategoryMeta {
  return (
    HUB_CATEGORIES.find((c) => c.id === id) ?? {
      id,
      label: id,
      emoji: "📘",
      description: "",
    }
  );
}
