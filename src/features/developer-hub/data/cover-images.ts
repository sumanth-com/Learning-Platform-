import type { HubCategoryId, HubResource } from "../types";

export type HubCoverTone = {
  surface: string;
  glowA: string;
  glowB: string;
  icon: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
};

/** Brand / topic glyph used on the cover (react-icons Simple Icons + a few custom). */
export type HubBrandIconId =
  | "docker"
  | "aws"
  | "nextjs"
  | "postgres"
  | "redis"
  | "react"
  | "typescript"
  | "github"
  | "prisma"
  | "openai"
  | "auth0"
  | "owasp"
  | "kubernetes"
  | "vercel"
  | "stripe"
  | "figma"
  | "jwt"
  | "architecture"
  | "patterns"
  | "career"
  | "rag"
  | "prompts"
  | "clean-arch"
  | "drizzle"
  | "nodejs";

export type HubCoverStyle = {
  brand: HubBrandIconId;
  /** Short banner title — always rendered on one line */
  label: string;
  eyebrow: string;
  tone: HubCoverTone;
};

const TONES = {
  slate: {
    surface:
      "bg-[radial-gradient(120%_90%_at_10%_0%,#f7f8f6_0%,#e6ebe7_42%,#cfd8d3_100%)]",
    glowA: "bg-slate-500/25",
    glowB: "bg-emerald-600/12",
    icon: "text-slate-900",
    ink: "text-slate-950",
    muted: "text-slate-700/70",
    accent: "bg-slate-900",
    line: "text-slate-900/10",
  },
  sage: {
    surface:
      "bg-[radial-gradient(120%_90%_at_0%_10%,#f5faf5_0%,#dfece2_45%,#c5d9cb_100%)]",
    glowA: "bg-emerald-500/25",
    glowB: "bg-teal-600/12",
    icon: "text-emerald-900",
    ink: "text-emerald-950",
    muted: "text-emerald-900/65",
    accent: "bg-emerald-800",
    line: "text-emerald-950/10",
  },
  sand: {
    surface:
      "bg-[radial-gradient(120%_90%_at_100%_0%,#fbf7f0_0%,#efe4d4_48%,#dfcbb3_100%)]",
    glowA: "bg-amber-500/22",
    glowB: "bg-orange-500/12",
    icon: "text-stone-900",
    ink: "text-stone-950",
    muted: "text-stone-800/65",
    accent: "bg-stone-900",
    line: "text-stone-900/10",
  },
  sky: {
    surface:
      "bg-[radial-gradient(120%_90%_at_0%_0%,#f4f9fc_0%,#dceaf4_48%,#bfd6e8_100%)]",
    glowA: "bg-sky-500/25",
    glowB: "bg-cyan-500/12",
    icon: "text-sky-950",
    ink: "text-sky-950",
    muted: "text-sky-900/65",
    accent: "bg-sky-900",
    line: "text-sky-950/10",
  },
  rose: {
    surface:
      "bg-[radial-gradient(120%_90%_at_90%_0%,#fbf5f4_0%,#f0e0dd_48%,#e0c6c2_100%)]",
    glowA: "bg-rose-400/25",
    glowB: "bg-red-500/10",
    icon: "text-rose-950",
    ink: "text-rose-950",
    muted: "text-rose-900/65",
    accent: "bg-rose-900",
    line: "text-rose-950/10",
  },
  indigo: {
    surface:
      "bg-[radial-gradient(120%_90%_at_10%_0%,#f5f6fb_0%,#e3e6f3_48%,#c9cfe6_100%)]",
    glowA: "bg-indigo-400/22",
    glowB: "bg-slate-500/12",
    icon: "text-indigo-950",
    ink: "text-indigo-950",
    muted: "text-indigo-900/65",
    accent: "bg-indigo-900",
    line: "text-indigo-950/10",
  },
  teal: {
    surface:
      "bg-[radial-gradient(120%_90%_at_0%_20%,#f2f9f7_0%,#d8ebe6_48%,#b9d8d0_100%)]",
    glowA: "bg-teal-500/22",
    glowB: "bg-cyan-600/10",
    icon: "text-teal-950",
    ink: "text-teal-950",
    muted: "text-teal-900/65",
    accent: "bg-teal-900",
    line: "text-teal-950/10",
  },
  copper: {
    surface:
      "bg-[radial-gradient(120%_90%_at_100%_10%,#fbf6f1_0%,#f0e0d0_48%,#dfc4a8_100%)]",
    glowA: "bg-orange-400/22",
    glowB: "bg-amber-600/10",
    icon: "text-orange-950",
    ink: "text-orange-950",
    muted: "text-orange-900/65",
    accent: "bg-orange-950",
    line: "text-orange-950/10",
  },
  docker: {
    surface:
      "bg-[radial-gradient(120%_90%_at_0%_0%,#f0f9ff_0%,#d9eefc_48%,#b6dff5_100%)]",
    glowA: "bg-[#2496ED]/28",
    glowB: "bg-sky-600/12",
    icon: "text-[#2496ED]",
    ink: "text-sky-950",
    muted: "text-sky-900/65",
    accent: "bg-[#2496ED]",
    line: "text-sky-950/10",
  },
} as const satisfies Record<string, HubCoverTone>;

const BY_SLUG: Record<string, HubCoverStyle> = {
  "build-ai-agents-from-scratch": {
    brand: "openai",
    label: "AI Agents",
    eyebrow: "From scratch",
    tone: TONES.indigo,
  },
  "system-design-roadmap": {
    brand: "architecture",
    label: "System Design",
    eyebrow: "Interview ready",
    tone: TONES.slate,
  },
  "authentication-architecture": {
    brand: "auth0",
    label: "Auth",
    eyebrow: "Sessions · JWT · OIDC",
    tone: TONES.sage,
  },
  "rag-explained": {
    brand: "rag",
    label: "RAG",
    eyebrow: "Retrieve · Rank · Generate",
    tone: TONES.indigo,
  },
  "build-saas-from-scratch": {
    brand: "stripe",
    label: "SaaS",
    eyebrow: "Multi-tenant MVP",
    tone: TONES.copper,
  },
  "api-security-guide": {
    brand: "owasp",
    label: "API Security",
    eyebrow: "OWASP hardened",
    tone: TONES.rose,
  },
  "aws-deployment-guide": {
    brand: "aws",
    label: "AWS",
    eyebrow: "VPC · ALB · RDS",
    tone: TONES.sand,
  },
  "docker-complete-guide": {
    brand: "docker",
    label: "Docker",
    eyebrow: "Build · Compose · Prod",
    tone: TONES.docker,
  },
  "nextjs-app-router-playbook": {
    brand: "nextjs",
    label: "Next.js",
    eyebrow: "App Router",
    tone: TONES.slate,
  },
  "postgres-indexing-deep-dive": {
    brand: "postgres",
    label: "Postgres",
    eyebrow: "Indexes · EXPLAIN",
    tone: TONES.sky,
  },
  "prompt-engineering-playbook": {
    brand: "prompts",
    label: "Prompts",
    eyebrow: "Product-grade LLM",
    tone: TONES.indigo,
  },
  "clean-architecture-essentials": {
    brand: "clean-arch",
    label: "Clean Arch",
    eyebrow: "Boundaries that ship",
    tone: TONES.sand,
  },
  "jwt-deep-dive": {
    brand: "jwt",
    label: "JWT",
    eyebrow: "Claims · Rotation",
    tone: TONES.rose,
  },
  "github-actions-ci": {
    brand: "github",
    label: "CI/CD",
    eyebrow: "GitHub Actions",
    tone: TONES.slate,
  },
  "typescript-for-product-engineers": {
    brand: "typescript",
    label: "TypeScript",
    eyebrow: "Product engineers",
    tone: TONES.sky,
  },
  "react-performance": {
    brand: "react",
    label: "React",
    eyebrow: "Measure · Fix · Ship",
    tone: TONES.teal,
  },
  "redis-caching-patterns": {
    brand: "redis",
    label: "Redis",
    eyebrow: "Cache patterns",
    tone: TONES.rose,
  },
  "prisma-and-drizzle": {
    brand: "prisma",
    label: "Prisma",
    eyebrow: "Prisma · Drizzle",
    tone: TONES.teal,
  },
  "design-patterns-catalog": {
    brand: "patterns",
    label: "Patterns",
    eyebrow: "That pay rent",
    tone: TONES.indigo,
  },
  "portfolio-and-interview-system": {
    brand: "career",
    label: "Career",
    eyebrow: "Portfolio · Interviews",
    tone: TONES.copper,
  },
};

const BY_CATEGORY: Record<HubCategoryId, HubCoverStyle> = {
  fundamentals: {
    brand: "clean-arch",
    label: "Fundamentals",
    eyebrow: "Engineering core",
    tone: TONES.sand,
  },
  frontend: {
    brand: "react",
    label: "Frontend",
    eyebrow: "UI systems",
    tone: TONES.sky,
  },
  backend: {
    brand: "nodejs",
    label: "Backend",
    eyebrow: "APIs & services",
    tone: TONES.slate,
  },
  database: {
    brand: "postgres",
    label: "Database",
    eyebrow: "Data layer",
    tone: TONES.teal,
  },
  devops: {
    brand: "docker",
    label: "DevOps",
    eyebrow: "Ship & operate",
    tone: TONES.sand,
  },
  ai: {
    brand: "openai",
    label: "AI Eng",
    eyebrow: "LLM systems",
    tone: TONES.indigo,
  },
  "system-design": {
    brand: "architecture",
    label: "Systems",
    eyebrow: "Scale & trade-offs",
    tone: TONES.slate,
  },
  security: {
    brand: "owasp",
    label: "Security",
    eyebrow: "Hardening",
    tone: TONES.rose,
  },
  career: {
    brand: "career",
    label: "Career",
    eyebrow: "Level up",
    tone: TONES.copper,
  },
  mobile: {
    brand: "react",
    label: "Mobile",
    eyebrow: "App platforms",
    tone: TONES.sky,
  },
  data: {
    brand: "postgres",
    label: "Data",
    eyebrow: "Pipelines",
    tone: TONES.teal,
  },
  "open-source": {
    brand: "github",
    label: "OSS",
    eyebrow: "Contribute",
    tone: TONES.slate,
  },
};

// Fix backend brand - add nodejs to type
export function getHubCoverStyle(
  resource: Pick<HubResource, "slug" | "category">
): HubCoverStyle {
  return BY_SLUG[resource.slug] ?? BY_CATEGORY[resource.category];
}

/** @deprecated Photo covers removed */
export function getHubCoverImage(
  resource: Pick<HubResource, "slug" | "category">
) {
  void resource;
  return "";
}
