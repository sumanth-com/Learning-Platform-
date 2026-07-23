/**
 * Generates src/curriculum/project-catalog/module-projects.ts
 * 20 roadmap modules × 9 projects (3 easy, 3 medium, 3 hard)
 */
import fs from "node:fs";
import path from "node:path";

const modules = [
  {
    n: 1,
    slug: "programming-fundamentals",
    title: "Programming Fundamentals",
    category: "CLI",
    projects: {
      easy: [
        ["console-calculator", "Console Calculator", "Build a CLI calculator that evaluates +, -, *, / with clear error messages for bad input."],
        ["number-guess-game", "Number Guessing Game", "Write a guessing game with attempts counter, high/low hints, and a replay loop."],
        ["temp-unit-converter", "Temperature Converter", "Convert between Celsius, Fahrenheit, and Kelvin from the command line."],
      ],
      medium: [
        ["student-gradebook", "Student Gradebook", "Store student scores, compute averages, letter grades, and print a ranked report."],
        ["word-frequency-cli", "Word Frequency Analyzer", "Read text input, count word frequencies, and print the top results sorted."],
        ["mini-banking-ledger", "Mini Banking Ledger", "Model deposits/withdrawals with a running balance and a printable transaction log."],
      ],
      hard: [
        ["expression-evaluator", "Expression Evaluator", "Parse and evaluate arithmetic expressions with parentheses using a stack-based approach."],
        ["contact-directory", "Contact Directory", "CRUD contacts with search/filter, validation, and file-backed persistence."],
        ["quiz-engine-cli", "Quiz Engine CLI", "Load questions, score answers, track streaks, and generate a summary report."],
      ],
    },
  },
  {
    n: 2,
    slug: "developer-tooling",
    title: "Developer Tooling",
    category: "CLI",
    projects: {
      easy: [
        ["git-cheat-sheet-site", "Git Cheat Sheet Site", "Create a tidy HTML/Markdown cheat sheet covering clone, commit, branch, and merge."],
        ["npm-script-starter", "npm Script Starter", "Set up a tiny project with lint, format, and start scripts that actually run."],
        ["env-checklist-cli", "Env Checklist CLI", "Validate required environment variables and print a pass/fail setup report."],
      ],
      medium: [
        ["commit-message-linter", "Commit Message Linter", "Validate conventional commit messages and reject unclear or empty subjects."],
        ["dotfiles-bootstrap", "Dotfiles Bootstrap", "Document and script a minimal editor + terminal setup for a new machine."],
        ["repo-health-report", "Repo Health Report", "Scan a repo for README, LICENSE, .gitignore, and node version files, then score it."],
      ],
      hard: [
        ["local-dev-workflow", "Local Dev Workflow Kit", "Build a reproducible workflow with scripts for install, typecheck, test, and clean."],
        ["multi-tool-alias-pack", "Multi-tool Alias Pack", "Create aliases/scripts that wrap git, package manager, and formatter commands safely."],
        ["project-scaffold-cli", "Project Scaffold CLI", "Generate a starter folder structure with config templates and README stubs."],
      ],
    },
  },
  {
    n: 3,
    slug: "html",
    title: "HTML",
    category: "Web App",
    projects: {
      easy: [
        ["personal-bio-page", "Personal Bio Page", "Build a semantic HTML bio page with header, sections, lists, and a contact form."],
        ["recipe-card-page", "Recipe Card Page", "Create a recipe page using headings, ingredients list, steps, and figure captions."],
        ["event-invite-page", "Event Invite Page", "Design an invite page with date/time, venue, agenda, and RSVP form fields."],
      ],
      medium: [
        ["multi-page-portfolio", "Multi-page Portfolio", "Ship Home, Projects, and Contact pages with shared navigation and footer."],
        ["accessible-faq-page", "Accessible FAQ Page", "Build an FAQ using details/summary with skip links and landmark regions."],
        ["product-landing-html", "Product Landing (HTML)", "Create a landing page with hero, features, pricing table, and signup form."],
      ],
      hard: [
        ["blog-article-layout", "Blog Article Layout", "Mark up a long-form article with TOC anchors, blockquotes, code samples, and metadata."],
        ["documentation-hub", "Documentation Hub", "Build a docs index with nested sections, breadcrumbs, and internal cross-links."],
        ["form-wizard-html", "Form Wizard (HTML)", "Create a multi-step form structure with fieldsets, validation attributes, and progress indicators."],
      ],
    },
  },
  {
    n: 4,
    slug: "css",
    title: "CSS",
    category: "Web App",
    projects: {
      easy: [
        ["profile-card-css", "Profile Card", "Style a profile card with avatar, typography hierarchy, and soft spacing."],
        ["button-state-kit", "Button State Kit", "Design primary/secondary buttons with hover, focus, and disabled states."],
        ["pricing-tiles", "Pricing Tiles", "Lay out three pricing tiles with consistent spacing and visual emphasis."],
      ],
      medium: [
        ["responsive-nav-bar", "Responsive Navbar", "Build a navbar that collapses cleanly on mobile using Flexbox and media queries."],
        ["magazine-grid", "Magazine Grid", "Create a magazine-style grid with featured and secondary story cards."],
        ["dark-theme-toggle-css", "Dark Theme Styles", "Implement light/dark theme tokens with CSS variables for a small page."],
      ],
      hard: [
        ["dashboard-shell-css", "Dashboard Shell", "Compose a responsive dashboard layout with sidebar, top bar, and content grid."],
        ["animation-micro-interactions", "Micro-interactions Pack", "Add purposeful transitions for cards, buttons, and accordion opens without clutter."],
        ["design-system-snippets", "Design System Snippets", "Document reusable CSS tokens and component classes for buttons, inputs, and alerts."],
      ],
    },
  },
  {
    n: 5,
    slug: "javascript",
    title: "JavaScript",
    category: "Web App",
    projects: {
      easy: [
        ["todo-list-vanilla", "Vanilla Todo List", "Add, complete, and delete todos with DOM updates and localStorage persistence."],
        ["tip-calculator-js", "Tip Calculator", "Compute tip and split totals from bill amount with live UI updates."],
        ["countdown-timer", "Countdown Timer", "Build a start/pause/reset timer with mm:ss display and completion alert."],
      ],
      medium: [
        ["quiz-app-js", "Quiz App", "Load questions, track score/timer, and show a results summary at the end."],
        ["expense-tracker-js", "Expense Tracker", "Capture expenses by category, filter the list, and compute running totals."],
        ["weather-fetch-ui", "Weather Fetch UI", "Call a public API, handle loading/error states, and render city weather cards."],
      ],
      hard: [
        ["kanban-board-js", "Kanban Board", "Implement drag-and-drop columns for Todo/Doing/Done with local persistence."],
        ["markdown-previewer", "Markdown Previewer", "Live-preview Markdown input with safe rendering and basic toolbar actions."],
        ["spa-router-mini", "Mini SPA Router", "Build hash-based routing between pages without a framework."],
      ],
    },
  },
  {
    n: 6,
    slug: "react",
    title: "React",
    category: "Web App",
    projects: {
      easy: [
        ["counter-hooks-lab", "Counter Hooks Lab", "Practice useState/useEffect with increment, decrement, and reset controls."],
        ["profile-card-react", "React Profile Card", "Render props-driven profile cards with conditional badges and loading state."],
        ["filterable-list", "Filterable List", "Filter and search a list of items with controlled inputs and empty states."],
      ],
      medium: [
        ["notes-app-react", "Notes App", "Create/edit/delete notes with categories and localStorage-backed state."],
        ["movie-watchlist", "Movie Watchlist", "Search a movie API, save favorites, and manage watched status."],
        ["form-validation-react", "Form Validation Flow", "Build a multi-field form with inline errors and submit success feedback."],
      ],
      hard: [
        ["task-board-react", "Task Board", "Build a multi-column board with drag reorder and optimistic UI updates."],
        ["context-theme-shop", "Context Theme Shop", "Use Context for theme + cart state across product and checkout pages."],
        ["infinite-scroll-feed", "Infinite Scroll Feed", "Paginate an API feed with intersection observer and retryable errors."],
      ],
    },
  },
  {
    n: 7,
    slug: "nextjs",
    title: "Next.js",
    category: "Web App",
    projects: {
      easy: [
        ["next-marketing-page", "Next Marketing Page", "Ship a marketing page with App Router layout, metadata, and Link navigation."],
        ["blog-list-ssr", "Blog List (SSR)", "Render a blog index from server data with dynamic post routes."],
        ["contact-api-route", "Contact API Route", "Accept form posts via a Route Handler and return structured JSON responses."],
      ],
      medium: [
        ["dashboard-next", "Next Dashboard", "Build a dashboard shell with nested layouts, loading UI, and route groups."],
        ["auth-gated-pages", "Auth-gated Pages", "Protect private routes with middleware patterns and a simple session stub."],
        ["image-optimized-gallery", "Image Gallery", "Create a gallery using next/image, blur placeholders, and responsive sizes."],
      ],
      hard: [
        ["fullstack-notes-next", "Full-stack Notes", "CRUD notes with server actions, validation, and optimistic client updates."],
        ["isr-content-hub", "ISR Content Hub", "Combine static generation and revalidation for a content hub with tags."],
        ["multi-tenant-starter", "Multi-tenant Starter", "Prototype tenant-aware routing and shared UI for two sample workspaces."],
      ],
    },
  },
  {
    n: 8,
    slug: "typescript",
    title: "TypeScript",
    category: "CLI",
    projects: {
      easy: [
        ["typed-utils-pack", "Typed Utils Pack", "Write typed helpers for clamp, groupBy, and safe JSON parse with tests."],
        ["strict-todo-types", "Strict Todo Types", "Model todos with unions/literals and eliminate any from a small app."],
        ["form-schema-types", "Form Schema Types", "Define form value/error types and map them to UI field components."],
      ],
      medium: [
        ["api-client-typed", "Typed API Client", "Build a fetch client with generics, Result types, and discriminated errors."],
        ["zod-validation-lab", "Zod Validation Lab", "Validate user input with Zod schemas and map issues to friendly messages."],
        ["event-bus-typed", "Typed Event Bus", "Implement a publish/subscribe bus with typed event maps."],
      ],
      hard: [
        ["ts-migration-kit", "TS Migration Kit", "Convert a JS module to TS with strict flags and incremental typing notes."],
        ["generic-data-table", "Generic Data Table", "Build a type-safe table utility with column defs and row accessors."],
        ["branded-ids-domain", "Branded IDs Domain", "Model domain entities with branded IDs and prevent ID mix-ups at compile time."],
      ],
    },
  },
  {
    n: 9,
    slug: "apis-and-services",
    title: "APIs & Services",
    category: "API",
    projects: {
      easy: [
        ["rest-notes-api", "REST Notes API", "Expose CRUD endpoints for notes with status codes and JSON error shapes."],
        ["healthcheck-service", "Healthcheck Service", "Return liveness/readiness payloads and simulate dependency checks."],
        ["pagination-demo-api", "Pagination Demo API", "Implement limit/offset pagination with total counts and next-page links."],
      ],
      medium: [
        ["bookstore-api", "Bookstore API", "Model books/authors with filtering, sorting, and input validation."],
        ["webhook-receiver", "Webhook Receiver", "Accept signed webhooks, verify payloads, and queue acknowledgment responses."],
        ["rate-limit-middleware", "Rate Limit Middleware", "Add per-IP rate limiting with clear 429 responses and retry headers."],
      ],
      hard: [
        ["service-gateway-lite", "Lite Service Gateway", "Route requests to mock downstream services with timeouts and fallbacks."],
        ["idempotent-orders-api", "Idempotent Orders API", "Create orders safely with idempotency keys and conflict handling."],
        ["openapi-spec-first", "OpenAPI Spec-first API", "Write an OpenAPI contract and implement endpoints that match it exactly."],
      ],
    },
  },
  {
    n: 10,
    slug: "auth-and-security",
    title: "Auth & Security",
    category: "API",
    projects: {
      easy: [
        ["password-hashing-lab", "Password Hashing Lab", "Hash and verify passwords securely; never store plaintext secrets."],
        ["session-cookie-demo", "Session Cookie Demo", "Implement login/logout with HTTP-only cookies and expiry handling."],
        ["role-guard-basics", "Role Guard Basics", "Protect routes for user vs admin roles with clear unauthorized responses."],
      ],
      medium: [
        ["jwt-auth-service", "JWT Auth Service", "Issue access tokens, protect resources, and handle expired token flows."],
        ["oauth-login-stub", "OAuth Login Stub", "Simulate OAuth callback exchange and map provider profiles to local users."],
        ["csrf-defense-lab", "CSRF Defense Lab", "Demonstrate CSRF risk and mitigate it with tokens on mutating requests."],
      ],
      hard: [
        ["rbac-policy-engine", "RBAC Policy Engine", "Define permissions by role/resource and enforce them across API actions."],
        ["secure-file-upload", "Secure File Upload", "Validate file type/size, sanitize names, and block dangerous uploads."],
        ["audit-log-trail", "Audit Log Trail", "Record auth events (login, fail, logout, privilege change) for review."],
      ],
    },
  },
  {
    n: 11,
    slug: "relational-databases",
    title: "Relational Databases",
    category: "CLI",
    projects: {
      easy: [
        ["sql-bookstore-schema", "SQL Bookstore Schema", "Design tables for books, authors, and inventory with primary/foreign keys."],
        ["crud-queries-lab", "CRUD Queries Lab", "Write INSERT/SELECT/UPDATE/DELETE queries for a small customer table."],
        ["join-practice-kit", "Join Practice Kit", "Solve join problems across users, orders, and order_items."],
      ],
      medium: [
        ["reporting-queries", "Reporting Queries", "Produce monthly sales aggregates with GROUP BY, HAVING, and date filters."],
        ["index-tuning-notes", "Index Tuning Notes", "Add indexes for hot queries and document before/after explain plans."],
        ["transaction-transfer", "Transaction Transfer", "Implement a money transfer that commits or rolls back atomically."],
      ],
      hard: [
        ["normalization-refactor", "Normalization Refactor", "Refactor a denormalized spreadsheet schema into 3NF with migration SQL."],
        ["window-functions-lab", "Window Functions Lab", "Rank customers and compute running totals using window functions."],
        ["sql-injection-defense", "SQL Injection Defense", "Show unsafe string concat vs parameterized queries with tests."],
      ],
    },
  },
  {
    n: 12,
    slug: "data-modeling",
    title: "Data Modeling",
    category: "CLI",
    projects: {
      easy: [
        ["er-diagram-campus", "Campus ER Diagram", "Model students, courses, and enrollments with clear cardinalities."],
        ["entity-checklist", "Entity Checklist", "Define entities/attributes for a library domain and justify keys."],
        ["lookup-tables-design", "Lookup Tables Design", "Introduce status/type lookup tables instead of magic strings."],
      ],
      medium: [
        ["saas-billing-model", "SaaS Billing Model", "Design plans, subscriptions, invoices, and payment attempts relationships."],
        ["soft-delete-strategy", "Soft Delete Strategy", "Model deleted_at patterns and query conventions for recoverable rows."],
        ["event-sourcing-lite", "Lite Event Model", "Capture domain events for order lifecycle without overengineering."],
      ],
      hard: [
        ["multi-tenant-schema", "Multi-tenant Schema", "Choose shared-schema tenancy with tenant_id constraints and isolation notes."],
        ["versioned-documents", "Versioned Documents", "Model document revisions with immutable history and current pointers."],
        ["analytics-star-schema", "Analytics Star Schema", "Design fact/dimension tables for product usage analytics."],
      ],
    },
  },
  {
    n: 13,
    slug: "deployment-essentials",
    title: "Deployment Essentials",
    category: "Docker Compose",
    projects: {
      easy: [
        ["dockerfile-node-app", "Dockerfile for Node App", "Containerize a small Node app with a production-ready Dockerfile."],
        ["env-config-deploy", "Env Config Deploy", "Separate local/prod env files and document required secrets safely."],
        ["static-site-deploy", "Static Site Deploy", "Deploy a static site to a hosting target with a clear release checklist."],
      ],
      medium: [
        ["compose-web-db", "Compose Web + DB", "Run app + database with Docker Compose networking and volumes."],
        ["healthcheck-rollout", "Healthcheck Rollout", "Add container healthchecks and graceful startup ordering."],
        ["nginx-reverse-proxy", "Nginx Reverse Proxy", "Front an app with Nginx for routing and basic gzip/static caching."],
      ],
      hard: [
        ["zero-downtime-notes", "Zero-downtime Notes", "Document and script a rolling restart strategy for a containerized app."],
        ["secret-management-lab", "Secret Management Lab", "Inject secrets at runtime without baking them into images."],
        ["observability-basics", "Observability Basics", "Add structured logs, basic metrics, and a deploy verification script."],
      ],
    },
  },
  {
    n: 14,
    slug: "ci-cd-fundamentals",
    title: "CI/CD Fundamentals",
    category: "CLI",
    projects: {
      easy: [
        ["github-actions-lint", "GitHub Actions Lint", "Create a workflow that installs deps and runs lint on every PR."],
        ["ci-test-pipeline", "CI Test Pipeline", "Run unit tests in CI and fail the build on regressions."],
        ["branch-protection-guide", "Branch Protection Guide", "Document required checks and protected main-branch rules."],
      ],
      medium: [
        ["build-and-artifact", "Build & Artifact", "Build the app in CI and upload an artifact for later deploy jobs."],
        ["preview-env-workflow", "Preview Env Workflow", "Sketch a PR preview deploy job with environment URLs in checks."],
        ["cache-ci-deps", "Cache CI Dependencies", "Speed up pipelines with dependency caching and verify cache hits."],
      ],
      hard: [
        ["cd-staging-prod", "CD Staging → Prod", "Promote builds from staging to production with manual approval gates."],
        ["matrix-test-strategy", "Matrix Test Strategy", "Test across Node versions/OS using a CI matrix strategy."],
        ["pipeline-security-scan", "Pipeline Security Scan", "Add dependency vulnerability scanning and fail on critical findings."],
      ],
    },
  },
  {
    n: 15,
    slug: "llm-fundamentals",
    title: "LLM Fundamentals",
    category: "CLI",
    projects: {
      easy: [
        ["prompt-lab-notebook", "Prompt Lab Notebook", "Compare zero-shot vs few-shot prompts for the same task and log outputs."],
        ["token-budget-calculator", "Token Budget Calculator", "Estimate prompt/response tokens and stay under a budget."],
        ["system-prompt-kit", "System Prompt Kit", "Write reusable system prompts for tutor, reviewer, and summarizer roles."],
      ],
      medium: [
        ["rag-chunking-demo", "RAG Chunking Demo", "Chunk documents, retrieve top passages, and ground an answer."],
        ["eval-rubric-runner", "Eval Rubric Runner", "Score model answers against a rubric for correctness and completeness."],
        ["hallucination-checklist", "Hallucination Checklist", "Build a checklist + sample prompts that force citation or refusal."],
      ],
      hard: [
        ["tool-use-planner", "Tool-use Planner", "Design a plan where the model chooses tools (search/calc) before answering."],
        ["prompt-injection-defense", "Prompt Injection Defense", "Demonstrate injection attacks and add guardrails/sanitization patterns."],
        ["cost-latency-tradeoff", "Cost/Latency Tradeoff Lab", "Benchmark model sizes for quality vs cost/latency on a fixed task set."],
      ],
    },
  },
  {
    n: 16,
    slug: "building-ai-features",
    title: "Building AI Features",
    category: "Web App",
    projects: {
      easy: [
        ["ai-summarize-widget", "AI Summarize Widget", "Add a UI that summarizes pasted text and shows loading/error states."],
        ["rewrite-tone-tool", "Rewrite Tone Tool", "Let users rewrite text in formal/casual tones with prompt templates."],
        ["faq-assistant-stub", "FAQ Assistant Stub", "Answer FAQs from a fixed knowledge list with fallback when unsure."],
      ],
      medium: [
        ["ai-code-explainer", "AI Code Explainer", "Explain selected code snippets with step-by-step teaching output."],
        ["content-moderation-gate", "Content Moderation Gate", "Filter unsafe user prompts before calling an LLM endpoint."],
        ["streaming-chat-ui", "Streaming Chat UI", "Stream assistant tokens into a chat UI with cancel support."],
      ],
      hard: [
        ["rag-support-bot", "RAG Support Bot", "Build a support bot that retrieves docs and answers with citations."],
        ["ai-feature-eval-harness", "AI Feature Eval Harness", "Create offline eval cases for an AI feature and track pass rates."],
        ["human-in-loop-review", "Human-in-the-loop Review", "Queue low-confidence AI outputs for human approval before publish."],
      ],
    },
  },
  {
    n: 17,
    slug: "capstone-planning",
    title: "Capstone Planning",
    category: "CLI",
    projects: {
      easy: [
        ["problem-statement-brief", "Problem Statement Brief", "Write a crisp problem, audience, and success metric for your capstone."],
        ["user-persona-pack", "User Persona Pack", "Define 2–3 personas with goals, pains, and must-have features."],
        ["mvp-scope-cut", "MVP Scope Cut", "Separate must-have vs later features and defend the MVP boundary."],
      ],
      medium: [
        ["architecture-one-pager", "Architecture One-pager", "Diagram components, data flow, and key integrations for the MVP."],
        ["milestone-roadmap", "Milestone Roadmap", "Plan weekly milestones with deliverables and demo checkpoints."],
        ["risk-register", "Risk Register", "List top risks, likelihood/impact, and mitigation owners."],
      ],
      hard: [
        ["prd-capstone", "Capstone PRD", "Produce a PRD covering goals, flows, non-goals, and acceptance criteria."],
        ["data-model-blueprint", "Data Model Blueprint", "Define core entities and API contracts needed for the first release."],
        ["launch-readiness-scorecard", "Launch Readiness Scorecard", "Create a go/no-go checklist across product, tech, and demo quality."],
      ],
    },
  },
  {
    n: 18,
    slug: "ship-the-product",
    title: "Ship the Product",
    category: "Web App",
    projects: {
      easy: [
        ["release-checklist", "Release Checklist", "Write a pre-ship checklist covering tests, env vars, and rollback notes."],
        ["changelog-writer", "Changelog Writer", "Generate a user-facing changelog from merged work for a release."],
        ["demo-script", "Demo Script", "Script a 5-minute product demo with happy path and fallback."],
      ],
      medium: [
        ["production-hardening", "Production Hardening", "Add error boundaries, logging, and basic rate limits before launch."],
        ["feedback-loop-setup", "Feedback Loop Setup", "Instrument a feedback form + issue triage labels for post-launch bugs."],
        ["seo-share-pass", "SEO & Share Pass", "Ship metadata, OG tags, and a shareable preview for the product."],
      ],
      hard: [
        ["launch-day-runbook", "Launch Day Runbook", "Document deploy steps, owners, monitoring, and incident contacts."],
        ["postmortem-template", "Postmortem Template", "Run a blameless postmortem on a simulated launch incident."],
        ["growth-experiment-plan", "Growth Experiment Plan", "Design one onboarding experiment with hypothesis and success metric."],
      ],
    },
  },
  {
    n: 19,
    slug: "technical-interviews",
    title: "Technical Interviews",
    category: "CLI",
    projects: {
      easy: [
        ["two-sum-patterns", "Two Sum Patterns", "Implement and explain hash-map vs brute-force solutions with complexity notes."],
        ["string-warmup-drills", "String Warmup Drills", "Solve reverse, anagram, and palindrome drills with clear talk tracks."],
        ["array-sliding-window", "Sliding Window Basics", "Practice max-sum subarray of size k and narrate the window movement."],
      ],
      medium: [
        ["linked-list-interview", "Linked List Interview Set", "Cover reverse list, cycle detect, and merge sorted lists with diagrams."],
        ["tree-traversal-kit", "Tree Traversal Kit", "Implement BFS/DFS variants and explain when to use each."],
        ["system-prompt-coding", "Timed Coding Practice", "Complete a timed medium problem with test cases and verbal plan."],
      ],
      hard: [
        ["graph-shortest-path", "Graph Shortest Path", "Solve BFS shortest path and discuss tradeoffs vs Dijkstra."],
        ["dp-interview-pack", "DP Interview Pack", "Solve climb stairs + coin change with recurrence explanations."],
        ["mock-interview-debrief", "Mock Interview Debrief", "Run a mock interview and write a debrief on communication + code quality."],
      ],
    },
  },
  {
    n: 20,
    slug: "system-design-behavioral",
    title: "System Design & Behavioral",
    category: "CLI",
    projects: {
      easy: [
        ["url-shortener-design", "URL Shortener Design", "Outline APIs, storage, and collision strategy for a URL shortener."],
        ["star-method-stories", "STAR Method Stories", "Write 3 behavioral stories using Situation-Task-Action-Result."],
        ["capacity-estimate-drill", "Capacity Estimate Drill", "Practice back-of-envelope estimates for QPS and storage."],
      ],
      medium: [
        ["news-feed-design", "News Feed Design", "Design fan-out options, ranking inputs, and cache boundaries."],
        ["conflict-story-lab", "Conflict Story Lab", "Craft a behavioral answer about disagreement and resolution at work."],
        ["rate-limiter-design", "Rate Limiter Design", "Compare token bucket vs sliding window for API rate limiting."],
      ],
      hard: [
        ["chat-system-design", "Chat System Design", "Design 1:1 messaging with delivery states, presence, and scaling notes."],
        ["leadership-principle-pack", "Leadership Principle Pack", "Map stories to ownership, bias-for-action, and customer obsession."],
        ["tradeoff-decision-memo", "Tradeoff Decision Memo", "Write a design decision memo weighing consistency, cost, and latency."],
      ],
    },
  },
];

function features(title, difficulty) {
  const base = [
    { id: "f1", title: "Core happy path works end to end" },
    { id: "f2", title: "Clear README with run instructions" },
    { id: "f3", title: "Handles invalid input gracefully" },
  ];
  if (difficulty === "medium") {
    base.push({ id: "f4", title: "Includes basic tests or manual test checklist" });
  }
  if (difficulty === "hard") {
    base.push({ id: "f4", title: "Includes tests or verification checklist" });
    base.push({ id: "f5", title: `Tradeoffs documented for ${title}` });
  }
  return base;
}

const outModules = modules.map((m) => {
  const difficulties = ["easy", "medium", "hard"];
  const projects = [];
  for (const d of difficulties) {
    for (const [key, title, description] of m.projects[d]) {
      const id = `m${String(m.n).padStart(2, "0")}-${key}`;
      projects.push({
        id,
        title,
        description,
        difficulty: d,
        category: m.category,
        features: features(title, d),
      });
    }
  }
  return {
    moduleNumber: m.n,
    slug: m.slug,
    title: m.title,
    projects,
  };
});

const file = `/* Auto-generated by scripts/gen-module-projects.mjs — do not edit by hand. */
import type { ProjectCategory, ProjectDifficulty } from "./types";

export type ModuleProjectDef = {
  id: string;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  features: { id: string; title: string }[];
};

export type RoadmapModuleProjects = {
  moduleNumber: number;
  slug: string;
  title: string;
  projects: ModuleProjectDef[];
};

export const ROADMAP_MODULE_PROJECTS: RoadmapModuleProjects[] = ${JSON.stringify(outModules, null, 2)};

export function getRoadmapModuleMeta(moduleNumber: number) {
  return ROADMAP_MODULE_PROJECTS.find((m) => m.moduleNumber === moduleNumber) ?? null;
}

export function listRoadmapModuleOptions() {
  return ROADMAP_MODULE_PROJECTS.map((m) => ({
    id: m.moduleNumber,
    label: \`Module \${m.moduleNumber}\`,
    title: m.title,
    slug: m.slug,
  }));
}
`;

const dest = path.join(
  process.cwd(),
  "src/curriculum/project-catalog/module-projects.ts"
);
fs.writeFileSync(dest, file);
console.log(`Wrote ${dest} (${outModules.length} modules, ${outModules.reduce((s, m) => s + m.projects.length, 0)} projects)`);
