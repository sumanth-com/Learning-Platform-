import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const redisCachingPatternsMeta = {
  overviewBody: `Redis is an in-memory data structure server — not a magic performance layer you sprinkle on a slow query and forget. Used wrong, it adds consistency bugs, outage blast radius, and operational cost with none of the speed you expected.

This guide covers cache-aside done correctly, TTL design, stampede prevention, why pub/sub is the wrong hammer for most "real-time" dreams, key naming that survives multi-tenant growth, and explicit criteria for when not to cache at all.`,
  objectives: [
    "Implement cache-aside with clear invalidation ownership on every write path",
    "Set TTLs from freshness SLOs and use stampede controls on hot keys",
    "Design keys with tenant/version namespaces and bounded cardinality",
    "Recognize pub/sub limits and choose streams/lists when durability matters",
  ],
  prerequisites: [
    "Built a feature backed by Postgres or similar",
    "Basic Redis commands (GET, SET, DEL, EXPIRE)",
    "Understanding of race conditions and eventual consistency",
  ],
  takeaways: [
    "Cache-aside: app reads cache → on miss load DB → set; writes go to DB then invalidate cache",
    "TTL alone is not invalidation — pair with explicit DEL on mutation",
    "Hot key expiry without coalescing causes stampede — singleflight or probabilistic early refresh",
    "Do not cache auth, strongly consistent inventory, or data you cannot afford to be wrong for 1 second",
  ],
};

export const redisCachingPatternsSections: HubSection[] = [
  sec(
    "cache-aside",
    "1. Cache-aside — the default pattern done right",
    `Flow:
Read: GET key → hit return; miss → query DB → SET key EX ttl → return
Write: UPDATE DB → DEL key (or version bump) → return

App owns consistency — Redis does not auto-sync with Postgres.

Invalidation rules:
• One writer service owns invalidation for a key namespace
• Document which mutations invalidate which keys (matrix in code comments or doc)
• Prefer DEL over SET on write — avoids writing stale shape

Read-through / write-through — cache layer or library handles policy; same rules, less app code.

Write-behind (write-back) — write cache first, async flush to DB. High risk; only for analytics counters with loss tolerance, not money.

Negative caching: cache "user not found" briefly to protect DB from enumeration — short TTL (30–60s), careful with GDPR deletes.`,
    {
      checklist: [
        "Every write path lists cache keys invalidated",
        "Miss path sets TTL on populate",
        "No cache update without DB commit success",
      ],
    }
  ),
  sec(
    "ttl",
    "2. TTL design — freshness vs load",
    `TTL is not "5 minutes because." Derive from SLO:
• Product catalog: 5–15 min stale OK → longer TTL + event invalidation on admin edit
• User session permissions: 0 cache or seconds + invalidation on role change
• Rate limit counters: EX = window size (60s for per-minute limit)

Patterns:
• Fixed TTL — simple; stale until expiry after write if invalidation missed
• TTL + explicit invalidation — best for hybrid freshness
• Jitter on TTL — expireAt = now + base + random(0, jitter) — prevents synchronized expiry

No TTL keys — memory leak and immortal stale data. Always EX or EXPIRE.

Monitor: evicted_keys, used_memory, hit rate (hits / (hits+misses) via application metrics).`,
    {
      bullets: [
        "TTL documented per key class with freshness requirement",
        "Jitter on hot keys with identical TTL",
        "Alert on memory near maxmemory",
      ],
    }
  ),
  sec(
    "stampede",
    "3. Cache stampede — hot key expiry under load",
    `Scenario: popular key expires; 500 concurrent requests miss → 500 identical DB queries.

Mitigations:

Singleflight / request coalescing — first miss acquires lock (SET lock:key NX EX 5); others wait or retry GET; one rebuilds.

Probabilistic early expiration — refresh in background before expiry if random() < chance based on age.

Stale-while-revalidate — return stale value immediately; async refresh (requires storing stale copy or soft TTL).

Never: unbounded "retry GET in loop" without backoff — hammers Redis.

Lock pitfalls: lock holder crashes → short lock TTL; use token in lock value to safe-release.

For extremely hot keys (homepage feed): prewarm on deploy; never cold-expire all at once — stagger.`,
    {
      checklist: [
        "Hot keys identified (top N by QPS)",
        "Coalescing or lock on rebuild path",
        "Load test expiry moment for hero keys",
      ],
    }
  ),
  sec(
    "key-design",
    "4. Key design — namespaced, bounded, debuggable",
    `Convention: {env}:{service}:{entity}:{id}:{facet}
prod:api:user:123:profile
prod:api:tenant:acme:products:v2

Rules:
• Include tenant_id in multi-tenant systems — never cross-tenant keys
• Version prefix (v2:) for schema changes — migrate without big bang DEL *
• Avoid unbounded key cardinality — user:123:session:* with millions of sessions needs TTL on every session key
• Hash large field groups: HSET user:123 profile name "..." email "..." — atomic partial updates

Anti-patterns:
• Keys from raw SQL string — use structured ids
• Giant JSON blobs >1MB — split or don't cache
• Same key for different serialization formats

SCAN for admin/debug — never KEYS * in production.`,
    {
      bullets: [
        "Key naming doc with examples per entity",
        "Tenant and version in every production key",
        "Max value size enforced in app",
      ],
    }
  ),
  sec(
    "pubsub-misuse",
    "5. Pub/sub — what it is not",
    `Redis Pub/Sub:
• Fire-and-forget — no persistence; offline subscribers miss messages
• At-most-once delivery — no ack/retry
• Good for: live notifications, cache invalidation broadcast, ephemeral fan-out

Bad uses (common mistakes):
• Job queue — use Redis Streams, BullMQ, or SQS
• Event sourcing — no history by default
• Guaranteed delivery to worker — subscriber crash = lost message

Invalidation broadcast pattern:
Publisher DEL local cache; PUBLISH invalidate channel with key pattern; subscribers DEL local/in-memory copy — works for multi-instance app cache layers.

For durable work: Streams with consumer groups (XREADGROUP) or external broker.

Real-time to browsers: pub/sub → WebSocket server → clients; not Redis alone.`,
    {
      checklist: [
        "Pub/sub only for ephemeral fan-out",
        "Durable jobs on Streams or external queue",
        "Document message loss acceptance",
      ],
    }
  ),
  sec(
    "when-not",
    "6. When NOT to cache",
    `Skip Redis when:

Strong consistency required — account balance, inventory reservation, idempotency keys mid-transaction. Read from primary with proper indexes.

Data cheaper to compute than cache ops — small table full scan <1ms; caching adds network hop + invalidation bugs.

Highly personalized + low reuse — cache hit rate near zero; memory waste.

Auth tokens / permissions without tight invalidation — stale permission is a security incident.

You don't have invalidation story — "we'll TTL it" on user-editable data = bug reports.

Team lacks Redis ops — no persistence policy, no failover plan, no monitoring. Postgres with good indexes may be enough to 10k QPS for your scale.

Decision doc: expected hit rate, bytes per key, QPS saved, invalidation complexity, failure mode if Redis down.`,
    {
      bullets: [
        "Hit rate estimate before adding cache layer",
        "Fallback when Redis unavailable (degrade to DB)",
        "Security-sensitive data excluded",
      ],
    }
  ),
  sec(
    "operations",
    "7. Operations — persistence, failover, memory",
    `Deployment modes:
• Cache only — no AOF/RDB needed; cold restart = cache miss storm (prewarm)
• Session store — need persistence (AOF) or accept logout on failover

maxmemory-policy:
• allkeys-lru for pure cache
• volatile-lru when mixed TTL keys
• noeviction — OOM errors instead of silent evict (dangerous for sessions)

High availability: Redis Sentinel or managed (ElastiCache, Upstash). Client must handle failover reconnect.

Connection pooling: limit connections per app instance — Redis single-threaded but connection churn hurts.

Secrets: TLS in transit; AUTH password; VPC private endpoint.`,
  ),
  sec(
    "checklist",
    "8. Production cache checklist",
    `Before shipping cache layer:

Design
• Pattern: cache-aside with invalidation matrix
• TTL per key class with SLO justification
• Stampede plan for top 10 keys

Safety
• Redis down → app degrades gracefully (circuit breaker to DB)
• No cross-tenant keys; no auth without short TTL + revoke path

Observability
• Hit/miss/latency metrics per namespace
• Memory and eviction alerts

Testing
• Integration test: write → invalidate → read fresh
• Load test expiry window for hero key

Cache is a distributed system — treat it with the same rigor as your database.`,
    {
      checklist: [
        "Invalidation integration test in CI",
        "Graceful degradation path tested",
        "Runbook for flush namespace / full restart",
      ],
    }
  ),
];
