export const NAV_LINKS = [
  { href: "#tour", label: "Product" },
  { href: "#paths", label: "Paths" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const STATS = [
  { value: "6+", label: "Structured learning phases" },
  { value: "AI", label: "Context-aware mentor" },
  { value: "Real", label: "Production-style projects" },
  { value: "Verified", label: "Skill credentials" },
] as const;

export const TECH_LOGOS = [
  { src: "/hub-brands/react.svg", alt: "React" },
  { src: "/hub-brands/nextjs.svg", alt: "Next.js" },
  { src: "/hub-brands/typescript.svg", alt: "TypeScript" },
  { src: "/hub-brands/nodejs.svg", alt: "Node.js" },
  { src: "/hub-brands/postgres.svg", alt: "PostgreSQL" },
  { src: "/hub-brands/docker.svg", alt: "Docker" },
  { src: "/hub-brands/github.svg", alt: "GitHub" },
  { src: "/hub-brands/openai.svg", alt: "OpenAI" },
] as const;

export type TourTabId =
  | "dashboard"
  | "roadmap"
  | "mentor"
  | "projects"
  | "hub"
  | "certs"
  | "profile";

export const TOUR_TABS: {
  id: TourTabId;
  label: string;
  caption: string;
  durationMs: number;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    caption: "See progress, next steps, and learning momentum in one glance.",
    durationMs: 24000,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    caption: "Unlock lessons as you grow — clear phases, clear next moves.",
    durationMs: 26000,
  },
  {
    id: "mentor",
    label: "AI Mentor",
    caption: "Ask coding questions and get streaming guidance with real code.",
    durationMs: 28000,
  },
  {
    id: "projects",
    label: "Projects",
    caption: "Ship with requirements, a preview, and a real submission flow.",
    durationMs: 26000,
  },
  {
    id: "hub",
    label: "Dev Forge",
    caption: "Architecture guides, bookmarks, and export-ready references.",
    durationMs: 24000,
  },
  {
    id: "certs",
    label: "Certifications",
    caption: "Assess, pass, download a verified credential, and share it.",
    durationMs: 28000,
  },
  {
    id: "profile",
    label: "Profile",
    caption: "A living portfolio of skills, projects, and credentials.",
    durationMs: 22000,
  },
];

export const PATH_STAGES = [
  { title: "Foundations", detail: "HTML, CSS, JS fluency", xp: 120 },
  { title: "Frontend", detail: "React + TypeScript apps", xp: 240 },
  { title: "Backend", detail: "APIs, auth, databases", xp: 320 },
  { title: "AI Systems", detail: "Agents, evals, tooling", xp: 410 },
  { title: "Ship Ready", detail: "Projects + credentials", xp: 520 },
] as const;

export const JOURNEY_STEPS = [
  { title: "Join SupraBase", detail: "Create your account and set a goal." },
  { title: "Choose a path", detail: "Pick Full Stack, AI, or a focused track." },
  { title: "Learn", detail: "Guided lessons with clear weekly milestones." },
  { title: "Practice", detail: "Assignments that reinforce what you just learned." },
  { title: "Build projects", detail: "Ship production-style work with reviews." },
  { title: "Get certified", detail: "Prove skills with verified assessments." },
  { title: "Portfolio", detail: "Show projects, certificates, and readiness." },
  { title: "Job ready", detail: "Interview prep and a shareable profile." },
] as const;

export const OUTCOMES = [
  {
    title: "Portfolio",
    detail: "A profile that showcases shipped work, not just completed videos.",
  },
  {
    title: "Projects",
    detail: "End-to-end builds with requirements, code, and submission history.",
  },
  {
    title: "Certificates",
    detail: "Verified credentials with unique IDs anyone can scan.",
  },
  {
    title: "Skills map",
    detail: "Phase-by-phase mastery you can explain in interviews.",
  },
  {
    title: "GitHub-ready habits",
    detail: "Practice that mirrors real developer workflows.",
  },
  {
    title: "Career readiness",
    detail: "Interview prep and artifacts hiring managers understand.",
  },
] as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Start learning with core paths, projects, and mentor access.",
    featured: false,
    cta: "Start free",
    href: "/signup",
    disabled: false,
    badge: null as string | null,
    features: [
      "Guided learning paths",
      "AI Mentor (standard mode)",
      "Projects & assignments",
      "Dev Forge guides",
      "Basic certifications",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    period: "/ month",
    description: "Deeper mentor modes, advanced certs, and priority learning tools.",
    featured: true,
    cta: "Coming soon",
    href: "#",
    disabled: true,
    badge: "Most popular",
    features: [
      "Everything in Free",
      "Advanced mentor modes",
      "Priority project reviews",
      "Full certification catalog",
      "Portfolio polish tools",
    ],
  },
  {
    id: "teams",
    name: "Teams",
    price: "₹2,499",
    period: "/ seat / mo",
    description: "Cohorts, admin visibility, and shared learning for campuses.",
    featured: false,
    cta: "Coming soon",
    href: "#",
    disabled: true,
    badge: "Preview",
    features: [
      "Everything in Pro",
      "Cohort dashboards",
      "Admin seating & roles",
      "Shared Dev Forge libraries",
      "Progress exports",
    ],
  },
] as const;

export const PRICING_COMPARISON = [
  { feature: "Learning paths", free: true, pro: true, teams: true },
  { feature: "AI Mentor", free: "Standard", pro: "Advanced", teams: "Advanced" },
  { feature: "Projects", free: true, pro: true, teams: true },
  { feature: "Certifications", free: "Core", pro: "Full catalog", teams: "Full catalog" },
  { feature: "Cohort admin", free: false, pro: false, teams: true },
  { feature: "Progress exports", free: false, pro: true, teams: true },
] as const;

export const FAQS = [
  {
    q: "Is SupraBase free to start?",
    a: "Yes. The Free plan includes guided paths, projects, Dev Forge guides, core certifications, and standard AI Mentor access. Pro and Teams are shown as preview pricing and are not checkout-ready yet.",
  },
  {
    q: "Do I need prior coding experience?",
    a: "No. Paths start from foundations and unlock progressively. If you already know the basics, you can move faster through early phases.",
  },
  {
    q: "How is this different from watching YouTube or a course site?",
    a: "SupraBase combines structured roadmaps, practice assignments, production-style projects, an AI mentor, and verified credentials — so you leave with proof of skill, not just watch history.",
  },
  {
    q: "What does the AI Mentor actually help with?",
    a: "Debugging, explaining concepts, reviewing code, and guiding builds. Responses stream live, and you can switch modes like Explain, Debug, Build, and Review.",
  },
  {
    q: "Are certifications real and verifiable?",
    a: "Yes. Passing an assessment issues a unique credential ID. Anyone can verify it online, and you can download a PDF or share to LinkedIn.",
  },
  {
    q: "Can I use SupraBase on mobile?",
    a: "You can browse on mobile, but the best experience for coding labs, projects, and certifications is on a laptop or desktop.",
  },
  {
    q: "Will my progress be saved?",
    a: "Yes. Progress, projects, certificates, and profile artifacts stay with your account across sessions.",
  },
] as const;
