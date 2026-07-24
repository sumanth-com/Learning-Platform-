import type { HubResource } from "../types";

function s(id: string, title: string, body: string) {
  return { id, title, body };
}

export const HUB_CATALOG: HubResource[] = [
  {
    id: "r1",
    slug: "build-ai-agents-from-scratch",
    title: "Build AI Agents from Scratch",
    description:
      "Design tool-using agents with planning loops, memory, and safe execution — without drowning in framework magic.",
    category: "ai",
    type: "interactive",
    difficulty: "advanced",
    readingMinutes: 28,
    author: "SupraBase",
    tags: ["agents", "tools", "langchain", "mcp"],
    featured: true,
    trending: true,
    updatedAt: "2026-07-12",
    views: 18420,
    bookmarks: 2104,
    rating: 4.9,
    coverGradient: "from-violet-600 via-indigo-500 to-sky-400",
    emoji: "🚀",
    relatedSlugs: ["rag-explained", "prompt-engineering-playbook"],
    sections: [
      s(
        "why",
        "Why agents matter",
        "An agent is a loop: observe → reason → act → observe. Production agents need clear goals, bounded tools, and failure handling — not just a clever prompt."
      ),
      s(
        "loop",
        "The core agent loop",
        "1. Parse user intent\n2. Choose a tool or respond\n3. Execute with timeouts\n4. Feed results back into context\n5. Stop when the goal is met or budget is exhausted"
      ),
      s(
        "tools",
        "Tool design",
        "Expose few, high-leverage tools with strict JSON schemas. Prefer idempotent actions. Log every call. Never give unrestricted shell or payment access without human approval."
      ),
      s(
        "memory",
        "Memory patterns",
        "Short-term: conversation window.\nLong-term: vector store + summaries.\nEpisodic: task logs for audits.\nKeep PII out of long-term memory by default."
      ),
      s(
        "ship",
        "Shipping checklist",
        "- Max steps & token budgets\n- Retry + circuit breakers\n- Human-in-the-loop gates\n- Evaluation set for regressions\n- Observability (traces + tool metrics)"
      ),
    ],
  },
  {
    id: "r2",
    slug: "system-design-roadmap",
    title: "System Design Roadmap",
    description:
      "A practical path from requirements to diagrams — APIs, storage, caching, queues, and trade-offs interviewers actually probe.",
    category: "system-design",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 35,
    author: "SupraBase",
    tags: ["scalability", "apis", "caching", "interviews"],
    featured: true,
    pinned: true,
    updatedAt: "2026-07-08",
    views: 42100,
    bookmarks: 5602,
    rating: 4.8,
    coverGradient: "from-slate-700 via-zinc-600 to-amber-400",
    emoji: "🏗",
    relatedSlugs: ["authentication-architecture", "api-security-guide"],
    sections: [
      s(
        "clarify",
        "Clarify before you draw",
        "Lock functional requirements, scale (QPS, data size), latency SLOs, and consistency needs. Ask about read/write ratio and multi-region early."
      ),
      s(
        "api",
        "API & boundaries",
        "Define clients, auth, and service boundaries. Prefer clear resource models over premature microservices."
      ),
      s(
        "data",
        "Data model",
        "Choose SQL vs NoSQL from access patterns. Design primary keys and indexes for your hottest queries. Plan migrations."
      ),
      s(
        "scale",
        "Scale levers",
        "Caching, async jobs, sharding, read replicas, CDNs, and backpressure. Name the bottleneck you are solving."
      ),
    ],
  },
  {
    id: "r3",
    slug: "authentication-architecture",
    title: "Authentication Architecture",
    description:
      "Sessions, JWTs, OAuth, refresh rotation, and when each model fits a SaaS product.",
    category: "system-design",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 22,
    author: "SupraBase",
    tags: ["auth", "jwt", "oauth", "sessions"],
    featured: true,
    trending: true,
    updatedAt: "2026-07-15",
    views: 29880,
    bookmarks: 3411,
    rating: 4.9,
    coverGradient: "from-emerald-600 via-teal-500 to-cyan-400",
    emoji: "⚡",
    relatedSlugs: ["api-security-guide", "system-design-roadmap"],
    sections: [
      s(
        "models",
        "Auth models",
        "Cookie sessions excel for first-party web apps. JWTs help APIs and mobile but need careful rotation and revocation strategy. OAuth/OIDC for social and enterprise SSO."
      ),
      s(
        "refresh",
        "Refresh tokens",
        "Store refresh tokens hashed server-side. Rotate on use. Detect reuse as theft. Keep access tokens short-lived."
      ),
      s(
        "threats",
        "Threats to design for",
        "CSRF (cookies), XSS (token theft), open redirects, weak redirect URI validation, and device binding for high-value accounts."
      ),
    ],
  },
  {
    id: "r4",
    slug: "rag-explained",
    title: "RAG Explained",
    description:
      "Retrieval-augmented generation end-to-end: chunking, embeddings, hybrid search, citations, and evaluation.",
    category: "ai",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 24,
    author: "SupraBase",
    tags: ["rag", "embeddings", "vector-db", "evaluation"],
    featured: true,
    trending: true,
    updatedAt: "2026-07-10",
    views: 35600,
    bookmarks: 4020,
    rating: 4.8,
    coverGradient: "from-fuchsia-600 via-purple-500 to-indigo-400",
    emoji: "🧠",
    relatedSlugs: ["build-ai-agents-from-scratch", "prompt-engineering-playbook"],
    sections: [
      s(
        "pipeline",
        "The RAG pipeline",
        "Ingest → chunk → embed → index → retrieve → rerank → generate with citations. Measure each stage separately."
      ),
      s(
        "chunking",
        "Chunking strategy",
        "Prefer semantic chunks with overlap. Keep metadata (source, title, updated_at). Avoid giant blobs that drown the prompt."
      ),
      s(
        "eval",
        "Evaluation",
        "Track retrieval precision, answer faithfulness, and groundedness. Build a golden set from real user questions."
      ),
    ],
  },
  {
    id: "r5",
    slug: "build-saas-from-scratch",
    title: "Build SaaS from Scratch",
    description:
      "Multi-tenant foundations: auth, billing, roles, environments, and a shippable MVP checklist.",
    category: "system-design",
    type: "interactive",
    difficulty: "advanced",
    readingMinutes: 40,
    author: "SupraBase",
    tags: ["saas", "billing", "multi-tenant", "mvp"],
    featured: true,
    updatedAt: "2026-06-30",
    views: 22110,
    bookmarks: 2890,
    rating: 4.7,
    coverGradient: "from-orange-500 via-rose-500 to-pink-400",
    emoji: "📦",
    relatedSlugs: ["authentication-architecture", "docker-complete-guide"],
    sections: [
      s(
        "tenant",
        "Tenancy models",
        "Shared DB with tenant_id is the default. Schema-per-tenant for stronger isolation. Cell architecture for large scale."
      ),
      s(
        "billing",
        "Billing basics",
        "Stripe Customer + Subscription + webhook idempotency. Gate features by plan. Never trust client-side plan checks alone."
      ),
      s(
        "mvp",
        "MVP checklist",
        "Auth, one core workflow, billing or waitlist, observability, and a kill-switch for bad deploys."
      ),
    ],
  },
  {
    id: "r6",
    slug: "api-security-guide",
    title: "API Security Guide",
    description:
      "Rate limits, authn/z, input validation, OWASP API Top 10, and practical hardening patterns.",
    category: "security",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 20,
    author: "SupraBase",
    tags: ["owasp", "rate-limiting", "validation", "api"],
    featured: true,
    updatedAt: "2026-07-01",
    views: 17340,
    bookmarks: 1988,
    rating: 4.8,
    coverGradient: "from-red-600 via-rose-500 to-orange-400",
    emoji: "🔒",
    relatedSlugs: ["authentication-architecture", "jwt-deep-dive"],
    sections: [
      s(
        "surface",
        "Shrink the attack surface",
        "Least privilege tokens, deny-by-default CORS, strict content types, and no verbose errors in production."
      ),
      s(
        "limits",
        "Rate limiting",
        "Per-IP and per-user buckets. Separate expensive endpoints. Return Retry-After. Log abuse patterns."
      ),
      s(
        "validate",
        "Validate everything",
        "Schema validation at the edge. Parameterized queries. Escape outputs. Treat file uploads as hostile."
      ),
    ],
  },
  {
    id: "r7",
    slug: "aws-deployment-guide",
    title: "AWS Deployment Guide",
    description:
      "Ship a Next.js + API stack with VPC basics, load balancers, RDS, and safe release habits.",
    category: "devops",
    type: "article",
    difficulty: "advanced",
    readingMinutes: 32,
    author: "SupraBase",
    tags: ["aws", "deploy", "rds", "alb"],
    featured: true,
    updatedAt: "2026-06-22",
    views: 14220,
    bookmarks: 1560,
    rating: 4.6,
    coverGradient: "from-amber-500 via-orange-500 to-yellow-300",
    emoji: "☁",
    relatedSlugs: ["docker-complete-guide", "github-actions-ci"],
    sections: [
      s(
        "layout",
        "Reference layout",
        "Public ALB → app targets in private subnets → RDS/Redis private. Secrets in Secrets Manager. Logs to CloudWatch."
      ),
      s(
        "release",
        "Safe releases",
        "Blue/green or rolling. Health checks that mean something. Instant rollback path. Migrations before/after carefully ordered."
      ),
    ],
  },
  {
    id: "r8",
    slug: "docker-complete-guide",
    title: "Docker Complete Guide",
    description:
      "Images, multi-stage builds, Compose, networking, and production container hygiene.",
    category: "devops",
    type: "article",
    difficulty: "beginner",
    readingMinutes: 26,
    author: "SupraBase",
    tags: ["docker", "compose", "containers"],
    featured: true,
    trending: true,
    updatedAt: "2026-07-05",
    views: 38900,
    bookmarks: 4720,
    rating: 4.9,
    coverGradient: "from-sky-600 via-blue-500 to-cyan-300",
    emoji: "🐳",
    relatedSlugs: ["github-actions-ci", "aws-deployment-guide"],
    githubUrl: "https://github.com/docker/awesome-compose",
    sections: [
      s(
        "image",
        "Good Dockerfiles",
        "Multi-stage builds, non-root user, pinned base tags, .dockerignore, and small attack surface."
      ),
      s(
        "compose",
        "Local stacks",
        "Compose for app + DB + redis. Named volumes for data. Healthchecks so depends_on is meaningful."
      ),
      s(
        "prod",
        "Production notes",
        "Read-only root FS where possible, resource limits, secrets not in ENV files committed to git."
      ),
    ],
  },
  {
    id: "r9",
    slug: "nextjs-app-router-playbook",
    title: "Next.js App Router Playbook",
    description:
      "Server Components, caching, streaming, and patterns that keep apps fast and maintainable.",
    category: "frontend",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 30,
    author: "SupraBase",
    tags: ["nextjs", "rsc", "caching", "react"],
    featured: false,
    trending: true,
    updatedAt: "2026-07-14",
    views: 26750,
    bookmarks: 3120,
    rating: 4.8,
    coverGradient: "from-zinc-800 via-neutral-700 to-sky-400",
    emoji: "⚛",
    relatedSlugs: ["typescript-for-product-engineers", "react-performance"],
    sections: [
      s(
        "rsc",
        "Server Components first",
        "Fetch on the server by default. Push interactivity to small client islands. Avoid shipping secret logic to the browser."
      ),
      s(
        "cache",
        "Caching mental model",
        "Understand request memoization, data cache, and full route cache. Invalidate deliberately."
      ),
    ],
  },
  {
    id: "r10",
    slug: "postgres-indexing-deep-dive",
    title: "PostgreSQL Indexing Deep Dive",
    description:
      "B-tree, partial indexes, EXPLAIN, and fixing the slow queries that haunt production.",
    category: "database",
    type: "article",
    difficulty: "advanced",
    readingMinutes: 27,
    author: "SupraBase",
    tags: ["postgres", "indexes", "explain", "performance"],
    featured: false,
    trending: true,
    updatedAt: "2026-07-03",
    views: 19880,
    bookmarks: 2440,
    rating: 4.9,
    coverGradient: "from-blue-700 via-indigo-600 to-sky-400",
    emoji: "🗄",
    relatedSlugs: ["prisma-and-drizzle", "redis-caching-patterns"],
    sections: [
      s(
        "explain",
        "Read EXPLAIN",
        "Look for Seq Scan on large tables, bad row estimates, and nested loops that explode. Measure before guessing."
      ),
      s(
        "indexes",
        "Index types that pay off",
        "Composite indexes matching WHERE + ORDER BY. Partial indexes for hot subsets. Avoid over-indexing writes."
      ),
    ],
  },
  {
    id: "r11",
    slug: "prompt-engineering-playbook",
    title: "Prompt Engineering Playbook",
    description:
      "Reliable prompts for products: roles, schemas, few-shot, evals, and guardrails.",
    category: "ai",
    type: "article",
    difficulty: "beginner",
    readingMinutes: 18,
    author: "SupraBase",
    tags: ["prompts", "llm", "evals"],
    featured: false,
    updatedAt: "2026-07-11",
    views: 31200,
    bookmarks: 3900,
    rating: 4.7,
    coverGradient: "from-indigo-500 via-blue-500 to-teal-300",
    emoji: "✨",
    relatedSlugs: ["rag-explained", "build-ai-agents-from-scratch"],
    sections: [
      s(
        "structure",
        "Structure that works",
        "Goal → constraints → format → examples → refusal policy. Prefer JSON schemas for tool calls."
      ),
      s(
        "eval",
        "Ship with evals",
        "Offline eval sets beat vibes. Track regressions when you change models or prompts."
      ),
    ],
  },
  {
    id: "r12",
    slug: "clean-architecture-essentials",
    title: "Clean Architecture Essentials",
    description:
      "Boundaries, dependency rules, and pragmatic layering for real product teams.",
    category: "fundamentals",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 21,
    author: "SupraBase",
    tags: ["architecture", "ddd", "modularity"],
    featured: false,
    updatedAt: "2026-06-18",
    views: 15660,
    bookmarks: 1880,
    rating: 4.6,
    coverGradient: "from-stone-700 via-neutral-600 to-emerald-400",
    emoji: "🔥",
    relatedSlugs: ["design-patterns-catalog", "system-design-roadmap"],
    sections: [
      s(
        "rules",
        "Dependency rule",
        "Domain should not depend on frameworks. Adapters translate IO. Keep use-cases explicit."
      ),
      s(
        "pragmatic",
        "Stay pragmatic",
        "Start modular monolith. Extract services when team and scale demand it — not for fashion."
      ),
    ],
  },
  {
    id: "r13",
    slug: "jwt-deep-dive",
    title: "JWT Deep Dive",
    description:
      "Claims, signing, common pitfalls, and safer patterns for access tokens.",
    category: "security",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 16,
    author: "SupraBase",
    tags: ["jwt", "auth", "security"],
    featured: false,
    updatedAt: "2026-06-28",
    views: 13440,
    bookmarks: 1510,
    rating: 4.7,
    coverGradient: "from-rose-600 via-red-500 to-amber-400",
    emoji: "🔐",
    relatedSlugs: ["authentication-architecture", "api-security-guide"],
    sections: [
      s(
        "claims",
        "Claims that matter",
        "sub, exp, iat, aud, iss. Keep payloads small. Never store secrets in JWT."
      ),
      s(
        "pitfalls",
        "Pitfalls",
        "alg=none attacks, long-lived tokens without revocation, putting PII in claims, and trusting unsigned payloads."
      ),
    ],
  },
  {
    id: "r14",
    slug: "github-actions-ci",
    title: "GitHub Actions CI/CD",
    description:
      "Fast pipelines: cache, matrix builds, preview deploys, and secure secrets.",
    category: "devops",
    type: "article",
    difficulty: "beginner",
    readingMinutes: 19,
    author: "SupraBase",
    tags: ["ci", "github-actions", "cd"],
    featured: false,
    updatedAt: "2026-07-02",
    views: 20110,
    bookmarks: 2330,
    rating: 4.8,
    coverGradient: "from-neutral-800 via-zinc-700 to-green-400",
    emoji: "🛠",
    relatedSlugs: ["docker-complete-guide", "aws-deployment-guide"],
    sections: [
      s(
        "pipeline",
        "A solid default pipeline",
        "lint → typecheck → test → build → deploy. Fail fast. Cache dependencies. Pin action versions."
      ),
      s(
        "security",
        "Secrets & OIDC",
        "Prefer OIDC to cloud over long-lived keys. Least privilege. Never echo secrets in logs."
      ),
    ],
  },
  {
    id: "r15",
    slug: "typescript-for-product-engineers",
    title: "TypeScript for Product Engineers",
    description:
      "Types that speed you up: narrowing, discriminated unions, and API boundaries.",
    category: "frontend",
    type: "article",
    difficulty: "beginner",
    readingMinutes: 17,
    author: "SupraBase",
    tags: ["typescript", "types", "dx"],
    featured: false,
    updatedAt: "2026-07-09",
    views: 24440,
    bookmarks: 2780,
    rating: 4.8,
    coverGradient: "from-blue-600 via-sky-500 to-indigo-300",
    emoji: "📘",
    relatedSlugs: ["nextjs-app-router-playbook", "react-performance"],
    sections: [
      s(
        "unions",
        "Discriminated unions",
        "Model UI and API states as unions with a kind field. Exhaustive switches catch bugs at compile time."
      ),
      s(
        "boundaries",
        "Validate at boundaries",
        "Parse external input (Zod). Trust internal typed code. Don't sprinkle `any` to silence reality."
      ),
    ],
  },
  {
    id: "r16",
    slug: "react-performance",
    title: "React Performance Patterns",
    description:
      "Profiling, memoization myths, lists, and rendering that feels instant.",
    category: "frontend",
    type: "article",
    difficulty: "advanced",
    readingMinutes: 23,
    author: "SupraBase",
    tags: ["react", "performance", "profiling"],
    featured: false,
    updatedAt: "2026-06-25",
    views: 16770,
    bookmarks: 1920,
    rating: 4.7,
    coverGradient: "from-cyan-600 via-sky-500 to-blue-400",
    emoji: "⚡",
    relatedSlugs: ["nextjs-app-router-playbook", "typescript-for-product-engineers"],
    sections: [
      s(
        "measure",
        "Measure first",
        "React Profiler + browser performance tools. Fix the expensive commit, not imaginary re-renders."
      ),
      s(
        "lists",
        "Lists & virtualization",
        "Virtualize long lists. Stable keys. Avoid anonymous inline objects in hot paths when proven costly."
      ),
    ],
  },
  {
    id: "r17",
    slug: "redis-caching-patterns",
    title: "Redis Caching Patterns",
    description:
      "Cache-aside, TTLs, stampede control, and when not to cache.",
    category: "database",
    type: "article",
    difficulty: "intermediate",
    readingMinutes: 15,
    author: "SupraBase",
    tags: ["redis", "caching", "latency"],
    featured: false,
    updatedAt: "2026-06-20",
    views: 12880,
    bookmarks: 1490,
    rating: 4.6,
    coverGradient: "from-red-500 via-rose-500 to-orange-300",
    emoji: "⚡",
    relatedSlugs: ["postgres-indexing-deep-dive", "system-design-roadmap"],
    sections: [
      s(
        "aside",
        "Cache-aside",
        "Read miss → DB → set cache. Write → update DB → invalidate/update key. Choose TTL from freshness needs."
      ),
      s(
        "stampede",
        "Stampede control",
        "Singleflight locks, probabilistic early expiration, and serving stale while revalidating."
      ),
    ],
  },
  {
    id: "r18",
    slug: "prisma-and-drizzle",
    title: "Prisma & Drizzle Compared",
    description:
      "DX, migrations, performance, and choosing an ORM for Next.js apps.",
    category: "database",
    type: "docs",
    difficulty: "beginner",
    readingMinutes: 14,
    author: "SupraBase",
    tags: ["prisma", "drizzle", "orm", "sql"],
    featured: false,
    updatedAt: "2026-07-06",
    views: 11200,
    bookmarks: 1320,
    rating: 4.5,
    coverGradient: "from-teal-600 via-emerald-500 to-lime-300",
    emoji: "📦",
    relatedSlugs: ["postgres-indexing-deep-dive", "nextjs-app-router-playbook"],
    sections: [
      s(
        "choose",
        "How to choose",
        "Prisma: excellent DX and migrations. Drizzle: SQL-first, lightweight, great TypeScript inference. Both can ship production apps."
      ),
      s(
        "perf",
        "Performance notes",
        "N+1 is your problem either way. Select only needed columns. Batch where possible. Index for real queries."
      ),
    ],
  },
  {
    id: "r19",
    slug: "design-patterns-catalog",
    title: "Design Patterns Catalog",
    description:
      "Factory, strategy, adapter, observer — with product-engineering examples.",
    category: "fundamentals",
    type: "article",
    difficulty: "beginner",
    readingMinutes: 25,
    author: "SupraBase",
    tags: ["patterns", "oop", "architecture"],
    featured: false,
    updatedAt: "2026-06-12",
    views: 18990,
    bookmarks: 2210,
    rating: 4.6,
    coverGradient: "from-purple-700 via-violet-600 to-fuchsia-400",
    emoji: "🧩",
    relatedSlugs: ["clean-architecture-essentials"],
    sections: [
      s(
        "useful",
        "Patterns that pay rent",
        "Strategy for interchangeable algorithms, Adapter for third-party APIs, Factory for complex object setup, Observer for domain events."
      ),
      s(
        "avoid",
        "Avoid cargo cult",
        "Don't invent layers for a 200-line script. Patterns exist to reduce change cost — measure that."
      ),
    ],
  },
  {
    id: "r20",
    slug: "portfolio-and-interview-system",
    title: "Portfolio & Interview System",
    description:
      "Ship a portfolio that proves skill, and a practice system for technical + behavioral rounds.",
    category: "career",
    type: "article",
    difficulty: "beginner",
    readingMinutes: 20,
    author: "SupraBase",
    tags: ["portfolio", "interviews", "career"],
    featured: false,
    trending: true,
    updatedAt: "2026-07-13",
    views: 27650,
    bookmarks: 3550,
    rating: 4.8,
    coverGradient: "from-fuchsia-500 via-pink-500 to-rose-300",
    emoji: "🚀",
    relatedSlugs: ["system-design-roadmap", "build-saas-from-scratch"],
    sections: [
      s(
        "portfolio",
        "Portfolio that converts",
        "3–5 projects with problem → approach → trade-offs → demo. Link live URLs and source. Show ownership."
      ),
      s(
        "practice",
        "Interview reps",
        "Weekly system design + coding + storytelling. Record yourself. Iterate on clarity more than cleverness."
      ),
    ],
  },
];

export function getHubResource(slug: string): HubResource | undefined {
  return HUB_CATALOG.find((r) => r.slug === slug);
}

export function getFeaturedResources(): HubResource[] {
  return HUB_CATALOG.filter((r) => r.featured).sort(
    (a, b) => b.views - a.views
  );
}

export function getTrendingResources(): HubResource[] {
  return HUB_CATALOG.filter((r) => r.trending).sort(
    (a, b) => b.views - a.views
  );
}

export function getRecentlyUpdated(): HubResource[] {
  return [...HUB_CATALOG].sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );
}

export function getResourcesByCategory(category: string): HubResource[] {
  return HUB_CATALOG.filter((r) => r.category === category);
}
