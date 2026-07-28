import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const prismaAndDrizzleMeta = {
  overviewBody: `Prisma and Drizzle are both TypeScript-first SQL layers — not interchangeable aesthetics. Prisma optimizes for schema-first DX and rapid product iteration; Drizzle optimizes for SQL transparency, bundle size, and edge runtimes. Production pain on both shows up as N+1 queries, migration drift, and reaching for raw SQL when the ORM cannot express the access pattern.

This guide compares real trade-offs, migration workflows, N+1 detection and fixes, raw SQL escape hatches, and a decision frame for Next.js apps specifically.`,
  objectives: [
    "Choose Prisma vs Drizzle based on team SQL comfort, runtime, and query complexity",
    "Run migrations safely in CI and production with rollback awareness",
    "Detect and eliminate N+1 with include/select discipline and query logging",
    "Use raw SQL, $queryRaw, or sql`` when ORM-generated plans are wrong",
  ],
  prerequisites: [
    "SQL SELECT/JOIN/WHERE comfort",
    "Used an ORM or query builder in a Node project",
    "Deployed schema changes to Postgres at least once",
  ],
  takeaways: [
    "Prisma: best schema.prisma workflow and studio; watch N+1 and cold start on serverless",
    "Drizzle: SQL-shaped API, lighter bundle, explicit joins — more typing, less magic",
    "Migrations are code review items — destructive changes need expand/contract",
    "Both need raw SQL for complex reports, CTEs, and planner-sensitive queries",
  ],
};

export const prismaAndDrizzleSections: HubSection[] = [
  sec(
    "dx-comparison",
    "1. DX comparison — where each wins",
    `Prisma strengths:
• schema.prisma as declarative source; migrate dev generates SQL
• Prisma Studio for quick data inspection
• Relation API: include, connect, nested writes — fast CRUD product work
• Mature ecosystem docs and hiring pool

Prisma friction:
• Generated client size and cold start (mitigate: driver adapters, edge split)
• "Magic" queries — hard to predict SQL without log
• Complex SQL (CTEs, lateral joins) awkward in query API

Drizzle strengths:
• Schema in TS; queries look like SQL — easier for SQL-comfortable teams
• Thin layer; works on edge (Cloudflare D1, Neon HTTP)
• sql\`\` template for composable fragments
• No code generation step (optional)

Drizzle friction:
• More boilerplate for relations
• Smaller ecosystem; you write more join explicitness
• Migration tooling improving but less turnkey than Prisma for some teams

Hybrid reality: Prisma for app CRUD + raw SQL view/materialized view for analytics is common.`,
    {
      bullets: [
        "Team SQL skill influences choice more than benchmark posts",
        "Edge/serverless tilt toward Drizzle or Prisma driver adapters",
        "Prototype speed often favors Prisma",
      ],
    }
  ),
  sec(
    "migrations",
    "2. Migrations — safe schema evolution",
    `Prisma flow:
schema.prisma change → prisma migrate dev → SQL in migrations/ → prisma migrate deploy in CI/prod

Drizzle flow:
drizzle-kit generate → review SQL → drizzle-kit migrate

Rules for both:
• Never edit applied migration files — new migration fixes forward
• Destructive change: expand → backfill → switch reads → contract (drop old column)
• CREATE INDEX CONCURRENTLY in raw SQL migration for large Postgres tables
• CI runs migrate against ephemeral DB before merge

Zero-downtime:
• Add nullable column → deploy code reading both → backfill → NOT NULL → remove old
• Renames are add+copy+switch, not ALTER RENAME in one step on hot tables

Seed vs migration: seeds for dev fixtures; migrations for schema only.

Drift detection: prisma migrate diff / drizzle-kit check in CI.`,
    {
      checklist: [
        "Migration SQL reviewed by second engineer",
        "Destructive changes use expand/contract",
        "migrate deploy in deploy pipeline, not manual",
      ],
    }
  ),
  sec(
    "n-plus-one",
    "3. N+1 — detection and fixes",
    `N+1: loop loads N entities, each triggers separate query for relation.

Prisma detection:
• LOG_LEVEL=query or prisma.$on('query') in dev
• Use Prisma query log + count queries per request middleware

Prisma fixes:
• include: { posts: true } — JOIN or IN query (watch over-fetch)
• select only needed fields
• findMany with where in ids instead of loop findUnique
• relationLoadStrategy: 'join' (preview) for some cases

Drizzle detection:
• Log sql queries; count per handler

Drizzle fixes:
• Explicit .leftJoin() in one query
• db.query.users.findMany({ with: { posts: true } }) relational API
• Batch loader (DataLoader) for graph APIs

GraphQL especial risk — one resolver per field × N parents.

Test: assert query count in integration test (e.g., max 3 queries for GET /feed).`,
    {
      bullets: [
        "Query logging enabled in dev/staging",
        "Integration test caps queries per endpoint",
        "include/with audited for payload size",
      ],
    }
  ),
  sec(
    "raw-sql",
    "4. Raw SQL escape hatches",
    `When ORM plan is wrong (bad join order, missing partial index use):

Prisma:
• $queryRaw\`SELECT ... WHERE id = \${id}\` — tagged template parameterization
• $queryRawUnsafe — avoid; SQL injection risk
• Typed results via manual types or prisma.$queryRaw<Type[]>
• Views in schema as unsupported preview or introspect

Drizzle:
• db.execute(sql\`...\`)
• sql.join for IN lists safely
• db.select().from(users).where(...) still composable with raw fragments

Use raw for:
• Reporting aggregates, window functions, CTEs
• COPY, pg_advisory_lock, NOTIFY
• EXPLAIN ANALYZE in admin tools

Keep raw in repository module — not scattered in route handlers.

Test raw SQL against migration-applied test DB — schema drift breaks silently.`,
    {
      checklist: [
        "Raw SQL only in repository/adapter layer",
        "Parameterized queries — never string concat user input",
        "Integration tests cover raw query paths",
      ],
    }
  ),
  sec(
    "nextjs",
    "5. Choosing for Next.js specifically",
    `Server Components fetch on server — ORM runs per request unless cached.

Prisma + Next:
• Singleton PrismaClient in dev (globalThis hack) — avoid connection explosion in HMR
• Serverless: connection pooler (PgBouncer, Neon pooler) + driver adapter
• unstable_cache wraps Prisma calls when not using fetch cache

Drizzle + Next:
• Lighter cold start — popular on Vercel edge middleware/routes with Neon HTTP driver
• Direct sql in Server Component — straightforward

Edge runtime constraints:
• No native TCP in some edge — HTTP-based DB drivers required
• Prisma Data Proxy / Accelerate or Drizzle + @neondatabase/serverless

Server Actions: both work; keep transactions in service layer; short-lived connections.

Do not import ORM client in Client Components — ever.`,
    {
      bullets: [
        "Connection pooling configured for serverless",
        "ORM client server-only boundary enforced",
        "Cache layer chosen for hot read paths",
      ],
    }
  ),
  sec(
    "transactions",
    "6. Transactions and consistency",
    `Prisma: prisma.$transaction([...]) or interactive async (tx) => {}

Drizzle: db.transaction(async (tx) => { ... })

Rules:
• Keep transactions short — no external HTTP inside
• Serializable isolation only when needed — default Read Committed in Postgres
• Idempotency key table in same transaction as business write

Optimistic concurrency: version column increment in WHERE clause — check rows affected.

Outbox pattern: insert event in same transaction as domain write; worker publishes.

Both ORMs: migration for constraints (UNIQUE, FK) — don't rely on app-only checks.`,
  ),
  sec(
    "testing",
    "7. Testing with ORMs",
    `Integration tests against real Postgres (Testcontainers, docker-compose):
• migrate deploy before test suite
• truncate or transaction rollback per test — pick one strategy

Prisma: seed script; factory libraries (faker)

Drizzle: same; schema push in dev test db

Avoid mocking ORM in integration tests — test the adapter.

Contract: migration files are the schema contract — preview environments must apply them.`,
    {
      checklist: [
        "CI Postgres with migrate deploy",
        "Critical paths have integration tests hitting ORM",
        "Seed data for local dev documented",
      ],
    }
  ),
  sec(
    "decision",
    "8. Decision framework",
    `Choose Prisma if:
• Team prefers schema.prisma + Studio + fast CRUD
• Mostly standard relations; moderate SQL complexity
• Not heavily edge-first

Choose Drizzle if:
• Team strong in SQL; wants explicit queries
• Edge/serverless bundle size matters
• Complex SQL composition in TypeScript

Either way:
• Repository pattern at module boundary — swap later without route rewrites
• Query budget tests on hot endpoints
• Raw SQL lane for analytics

You can migrate Prisma → Drizzle incrementally via repository ports — not a weekend rewrite.

Senior answer: "We use X because our hot path is Y queries, team maintains Z, and we escape to SQL for reports via repository raw methods."`,
    {
      bullets: [
        "Decision recorded in ADR with trade-offs",
        "Repository boundary for future ORM swap",
        "Query logging and caps on hot routes",
      ],
    }
  ),
];
