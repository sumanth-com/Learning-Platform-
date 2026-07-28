import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const systemDesignRoadmapMeta = {
  overviewBody: `System design is how you turn a fuzzy product ask into a system that survives traffic, failure, and change.

This is not a glossary of buzzwords. It is the same sequence staff engineers use in interviews and design reviews: lock numbers → draw the request path → choose storage from access patterns → add scale levers only where measured → design failure modes before launch.

Use it as a checklist you can run in 35–45 minutes on a whiteboard — or as the spine of a real design doc.`,
  objectives: [
    "Run a requirements → capacity → API → data → scale sequence without skipping the hard questions",
    "Name consistency, latency, and cost trade-offs with numbers (QPS, storage, p99), not vibes",
    "Pick cache, queue, replica, and shard levers only after naming the bottleneck they fix",
    "Defend a design in a review: happy path, failure modes, rollout, and what you deliberately skipped",
  ],
  prerequisites: [
    "Comfortable with HTTP, JSON APIs, and basic SQL",
    "Know what a load balancer, database, and cache roughly do",
    "Have built at least one full-stack feature end-to-end",
  ],
  takeaways: [
    "Clarify scale and SLOs before drawing boxes — wrong numbers produce wrong architectures",
    "Start with a modular monolith; split services when ownership or scale forces it",
    "Cache and queues are amplifiers — they multiply a correct design and also multiply a bad one",
    "Every design needs: auth boundary, source of truth, timeout/retry story, and a rollback plan",
  ],
};

export const systemDesignRoadmapSections: HubSection[] = [
  sec(
    "clarify",
    "1. Clarify before you draw",
    `Most weak designs fail in the first five minutes — not on the whiteboard art.

Lock these before any box is drawn:

• Actors & flows — who does what? (user, admin, worker, webhook)
• Functional must-haves vs nice-to-haves — cut scope early
• Scale — DAU/MAU, read:write ratio, peak QPS, object size, retention
• Latency SLO — p50 vs p99; which calls are sync vs can be async
• Consistency — what must be strongly consistent (money, inventory) vs eventually OK (counts, feeds)
• Multi-region / compliance — data residency, PII, audit needs

Interview / review line that signals seniority:
"Assuming 10M DAU, 1:20 write:read, 2 KB payloads, p99 < 200ms on the read path — here is the first cut."

If the interviewer (or PM) will not give numbers, state your assumptions out loud and design to them.`,
    {
      checklist: [
        "Functional requirements listed and prioritized",
        "QPS + storage estimate written down",
        "Consistency needs called out per critical write",
        "Non-goals explicitly listed (what we will not build today)",
      ],
    }
  ),
  sec(
    "capacity",
    "2. Capacity math that actually matters",
    `You do not need perfect Fermi estimates. You need order-of-magnitude honesty.

Rough toolkit:
• QPS ≈ peak daily actions / 86_400 × peak factor (often 2–5×)
• Storage ≈ objects × size × replicas × retention × growth
• Bandwidth ≈ QPS × payload size

Translate estimates into component pressure:
• Single Postgres primary: often fine to low thousands of simple QPS with good indexes; not fine for unbounded fan-out
• Cache hit rate dominates read latency more than "add another service"
• Async work should be sized by queue lag SLO, not "we have workers"

Write the bottleneck hypothesis early: "At 10×, the DB writer saturates first" — then design against that claim.`,
    {
      bullets: [
        "State assumptions: DAU, actions/user/day, peak factor, object size",
        "Convert to peak QPS and yearly storage",
        "Name the first component that breaks at 10×",
      ],
    }
  ),
  sec(
    "api",
    "3. API & service boundaries",
    `Draw clients first (web, mobile, internal jobs), then the edge (CDN, API gateway, auth), then one application boundary.

Prefer a clear resource model over premature microservices:
• /users, /orders, /feeds as resources with explicit ownership
• Authn at the edge; authz in the service that owns the data
• Idempotency keys on any create/payment/webhook that can retry
• Versioning strategy (URL or header) before public clients ship

Sync vs async rule of thumb:
• User is waiting → sync path with tight timeouts
• User can leave → enqueue + show progress / notify later

Anti-pattern: six services for one CRUD domain with one team. That is distributed complexity without distributed ownership.`,
    {
      bullets: [
        "One auth boundary; least-privilege tokens",
        "Idempotent writes for anything retried by clients or brokers",
        "Timeouts on every outbound call — no infinite hangs",
      ],
    }
  ),
  sec(
    "data",
    "4. Data model from access patterns",
    `Choose storage from how you query — not from trend charts.

SQL (Postgres) when:
• Relationships, transactions, and ad-hoc reporting matter
• You need joins, constraints, and mature ops tooling

Document / wide-column / KV when:
• Access is key-centric, huge write throughput, or flexible schemas with known query paths

Design the hot path first:
• Primary key and clustering for the #1 query
• Indexes that match WHERE + ORDER BY (not "index every column")
• Soft deletes / append-only where audit matters
• Migration plan: expand → backfill → switch → contract

Consistency reminder:
• Single-row / single-partition transactions are cheap
• Cross-service dual writes without an outbox are how you get ghost data at 2am`,
    {
      checklist: [
        "Hottest 3 queries written as SQL/pseudo-query",
        "Primary key + indexes justified for those queries",
        "Migration / backfill story for the next schema change",
      ],
    }
  ),
  sec(
    "cache",
    "5. Caching — when it earns its keep",
    `Cache after correctness. Wrong cache is a silent product bug.

Patterns that show up in real systems:
• Cache-aside — miss → DB → set; write → DB → invalidate
• Read-through / write-through — library/proxy owns the policy
• CDN — immutable or versioned assets and public pages

Decide TTL from freshness SLO, not from "5 minutes feels right."
Decide key shape from cardinality (user:123:feed) and version (v2:…).

Stampede control when a hot key expires under load:
• singleflight / lock around recompute
• serve-stale-while-revalidate
• probabilistic early refresh

Never cache permissions or money without an explicit invalidation path tied to the write.`,
    {
      bullets: [
        "Name what is cached and why (latency, cost, protection)",
        "Document invalidation on every write path that mutates it",
        "Plan stampede behavior for the hottest keys",
      ],
    }
  ),
  sec(
    "async",
    "6. Queues, workers, and backpressure",
    `Queues exist to absorb spikes, decouple slow work, and retry safely.

Use a queue when:
• Work is slow (email, thumbnails, ML, ETL)
• Spikes would crush the DB if done inline
• You need at-least-once delivery with idempotent consumers

Design the consumer like a production service:
• Idempotency (dedupe key / upsert)
• Visibility timeout + dead-letter queue
• Lag alerts (oldest message age), not just "queue length looks fine"
• Poison-message handling

Backpressure: if the worker cannot keep up, shed load intentionally (reject, degrade, or delay) — do not silently drop user-critical work.`,
  ),
  sec(
    "scale",
    "7. Scale levers (in the order teams actually pull them)",
    `1. Fix the query / N+1 / lock — cheapest win
2. Vertical scale the primary until it is painful
3. Read replicas for read-heavy paths (accept replica lag)
4. Cache / CDN for hot reads
5. Async offload of non-critical work
6. Partition / shard when a single writer is the wall

Sharding without a shard key story is a future outage. Know:
• What the shard key is (user_id, tenant_id, …)
• How cross-shard queries are avoided or paid for
• How you rebalance when one shard melts

CDN + edge caching for static and cacheable GETs often buys more user-visible win than a new microservice.`,
  ),
  sec(
    "failure",
    "8. Failure modes seniors always ask about",
    `A design without failure modes is a happy-path sketch.

Walk these explicitly:
• Dependency down — timeouts, circuit breaker, cached fallback, read-only mode
• Partial deploy — old and new binaries must speak the same protocol for one release
• Duplicate messages — idempotent consumers
• Hot key / thundering herd — cache + coalescing
• Data inconsistency after dual-write — outbox / change-data-capture

Observability minimum for the critical path:
• RED metrics (rate, errors, duration) per endpoint
• Structured logs with request id
• Traces across edge → app → DB/cache

Rollback: feature flag or previous artifact + backward-compatible migrations.`,
    {
      checklist: [
        "Timeout + retry policy per dependency",
        "Degradation mode defined (what users still get)",
        "Alert that would wake someone if this path breaks",
      ],
    }
  ),
  sec(
    "board",
    "9. Whiteboard sequence (interview & design doc)",
    `Use this exact order — interviewers recognize it:

1. Requirements + assumptions (2–4 min)
2. High-level diagram: client → edge → app → data stores
3. API sketch for the core flows
4. Data model + hottest queries
5. Deep dive the bottleneck (cache / queue / shard)
6. Failure modes + scale plan
7. What you would build in week one vs month three

Talk trade-offs out loud:
"Strong consistency here costs cross-region latency; for feed fanout I would accept eventual consistency with a repair job."

Clarity beats cleverness. A clean modular design with known limits beats a buzzword zoo.`,
  ),
  sec(
    "antipatterns",
    "10. Anti-patterns to refuse",
    `• Microservices on day one with one team
• Caching without invalidation ownership
• Unbounded retries without jitter → retry storms
• Sharing a database across "services" and calling it isolation
• Optimizing average latency while p99 burns
• Skipping authz because "the UI hides the button"
• Dual-writing two stores without an outbox
• Designing for Google scale when you have 2k users

If a choice does not reduce change cost, incident risk, or latency you measured — cut it.`,
  ),
];
