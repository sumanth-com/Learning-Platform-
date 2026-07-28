import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const postgresIndexingDeepDiveMeta = {
  overviewBody: `Indexes are not "make queries fast" buttons. They are write-amplifying, storage-consuming, planner-hinting structures whose wrong shape is worse than no index at all.

This guide goes past "add an index on the foreign key." You will read EXPLAIN plans like a performance review, choose between B-tree, GIN, GiST, and BRIN from access patterns, design composite/partial/covering indexes that match real WHERE clauses, and know when to drop an index that costs more than it saves.`,
  objectives: [
    "Pick index type and column order from query patterns, not convention",
    "Read EXPLAIN (ANALYZE, BUFFERS) output and distinguish seq scan vs index scan vs bitmap heap scan",
    "Design partial and covering indexes that eliminate heap fetches for hot paths",
    "Quantify write amplification and bloat so index count is a deliberate budget",
  ],
  prerequisites: [
    "Write SQL with JOINs, WHERE, ORDER BY, and aggregates",
    "Run queries in psql or a GUI client",
    "Basic understanding of Postgres tables, rows, and vacuum",
  ],
  takeaways: [
    "B-tree is default; GIN for arrays/JSONB/full-text; BRIN for append-only time series; GiST for geometry/ranges",
    "Composite index column order must match equality filters first, then range, then ORDER BY",
    "EXPLAIN ANALYZE is the source of truth — pg_stat_user_indexes confirms production usage",
    "Every index is a tax on INSERT/UPDATE/DELETE — budget indexes like you budget memory",
  ],
};

export const postgresIndexingDeepDiveSections: HubSection[] = [
  sec(
    "index-types",
    "1. Index types — match structure to access pattern",
    `B-tree (default) — equality and range on scalar types, ORDER BY on indexed column, LIKE 'prefix%' (not '%suffix').

Hash — equality only; rarely needed since Postgres 10+ B-tree handles = well. Skip unless you know why.

GIN — inverted index for containment queries:
• JSONB @>, ?, ?&, ?|
• arrays @>, &&
• full-text search @@
Trade-off: slower builds, larger size, slower writes than B-tree.

GiST — lossy/decomposable data: geometry, ranges, nearest-neighbor (KNN).

BRIN — block-range summaries for physically correlated columns (created_at on append-only logs). Tiny index, seq scan of relevant blocks — wins on billion-row tables with natural insertion order.

SP-GiST — non-balanced partitions (quadtrees, text prefixes).

Rule: start B-tree. Switch when EXPLAIN shows seq scan on a pattern B-tree cannot support (JSONB containment, full-text, geo).`,
    {
      bullets: [
        "Document top 5 query patterns before creating any index",
        "GIN only where @> or full-text appears in hot path",
        "BRIN candidate: time-series appended in order, queries filter by time range",
      ],
    }
  ),
  sec(
    "composite",
    "2. Composite, partial, and covering indexes",
    `Composite (multi-column) B-tree — left-prefix rule applies. Index (a, b, c) serves:
• WHERE a = ?
• WHERE a = ? AND b = ?
• WHERE a = ? AND b = ? ORDER BY c
It does NOT serve WHERE b = ? alone efficiently.

Column order recipe:
1. Equality columns (=, IN) — most selective first among equals
2. Range column (<, >, BETWEEN) — one range column, then stop for optimal use
3. ORDER BY columns if you want index-only sort

Partial index — indexes a subset: CREATE INDEX ... WHERE deleted_at IS NULL.
Wins when: queries always filter the same predicate, subset is small, writes on excluded rows skip index maintenance.

Covering / INCLUDE — Postgres 11+ INCLUDE (col) stores extra columns in leaf pages for index-only scans. Cannot be used in search conditions — payload only.

Expression index — on lower(email), (data->>'status'). Matches queries that use the same expression exactly.

Unique indexes — enforce constraints and serve lookups. Prefer UNIQUE over duplicate B-tree + app-level check.`,
    {
      checklist: [
        "Composite order matches WHERE + ORDER BY of target query",
        "Partial index predicate matches query filter exactly",
        "INCLUDE columns are SELECT list only, not filter columns",
      ],
    }
  ),
  sec(
    "explain",
    "3. Reading EXPLAIN (ANALYZE, BUFFERS)",
    `Always run EXPLAIN (ANALYZE, BUFFERS) on production-shaped data volumes — estimates lie on empty tables.

Key nodes:
• Seq Scan — reads whole table. OK for small tables or when most rows match.
• Index Scan — traverse index, fetch heap rows. Good for selective queries.
• Index Only Scan — answers from index leaves (needs recent VACUUM for visibility map).
• Bitmap Index Scan + Bitmap Heap Scan — combines multiple indexes or moderate selectivity; sorts heap fetches.

Red flags:
• Rows Removed by Filter high on Index Scan — index not selective enough or wrong column order
• Actual rows >> Estimated rows — stale stats; run ANALYZE
• Buffers: shared hit vs read — cold cache vs disk IO
• Sort + high cost — missing index for ORDER BY; sort spills to disk (Disk: in Sort node)

Latency math: if Index Scan returns 50k rows, you likely need a tighter index or query rewrite — index is not free per row fetched.

Tools: pg_stat_statements for query frequency × total time; auto_explain for slow queries in prod.`,
    {
      bullets: [
        "Run EXPLAIN ANALYZE on staging with realistic row counts",
        "Compare estimated vs actual rows — re-ANALYZE if off by 10×",
        "Check Index Only Scan possibility with INCLUDE + VACUUM",
      ],
    }
  ),
  sec(
    "planner",
    "4. Planner behavior and statistics",
    `The planner picks seq scan vs index based on cost estimates, not your intentions.

Statistics live in pg_statistic; ANALYZE samples rows. Low default_statistics_target on skewed columns → bad plans.

Common planner surprises:
• OR across columns — may bitmap multiple indexes or seq scan. Consider UNION of two indexed queries.
• NULL-heavy columns — partial indexes often beat full index with IS NULL filters.
• JOIN order — missing index on inner join key → nested loop with seq scan on inner.

Force hints: Postgres has no hint syntax like Oracle. Fix stats, indexes, or rewrite query. pg_hint_plan exists but is a last resort.

Correlation: physical row order vs index order affects BRIN and cluster. CLUSTER or pg_repack for extreme hot-spot tables.

work_mem: sorts and hash joins spill when exceeded — shows as external sort in EXPLAIN, not as "missing index."`,
  ),
  sec(
    "bloat",
    "5. Bloat, vacuum, and index health",
    `MVCC leaves dead tuples; UPDATE creates new row versions. Indexes point to all versions until VACUUM reclaims space.

Index bloat — index pages contain dead entries; index size grows while live row count stable. Symptom: queries slow, index-only scans degrade, autovacuum cannot keep up.

Detection:
• pg_stat_user_indexes — idx_scan vs idx_tup_read; zero scans for months → candidate to drop
• pgstattuple / pg_stat_all_tables — bloat estimates
• Index size vs table size ratio anomalies

Remediation:
• Tune autovacuum per table (scale factor on high-churn tables)
• REINDEX CONCURRENTLY during low traffic
• pg_repack for online rebuild
• Reduce HOT update failures — fillfactor, narrower rows, avoid indexing every updated column

Fillfactor — leave page space for HOT updates when indexed columns don't change. Default 100 on indexes; table fillfactor 90 on update-heavy tables.`,
    {
      checklist: [
        "Autovacuum not starved on high-churn tables",
        "Unused indexes identified via pg_stat_user_indexes",
        "REINDEX plan for indexes >2× expected size",
      ],
    }
  ),
  sec(
    "write-amplification",
    "6. Write amplification — the hidden index tax",
    `Every INSERT updates every index on the table. Every UPDATE that touches indexed columns updates those indexes. DELETE marks index entries dead.

Cost model:
• 5 indexes on a 500-byte row → 5× index write IO per insert
• High-frequency ingest (events, logs) with many secondary indexes → WAL pressure, replication lag

Mitigation:
• Index budget: justify each index with pg_stat_statements + idx_scan
• Defer non-critical indexes during bulk load (DROP → load → CREATE CONCURRENTLY)
• Partition append-only tables — indexes per partition, drop old partitions instead of DELETE
• Use partial indexes to exclude rows that never appear in queries

Replication angle: index maintenance generates WAL; read replicas replay it — write-heavy indexing hurts replica catch-up.

Measure: compare INSERT throughput with indexes vs without on staging.`,
    {
      bullets: [
        "Count indexes per table; flag >5 without justification",
        "Bulk load playbook: drop secondary indexes first",
        "Monitor replica lag during index CREATE on large tables",
      ],
    }
  ),
  sec(
    "when-not",
    "7. When NOT to index",
    `Skip or drop indexes when:

Low selectivity — boolean status on balanced table; planner correctly chooses seq scan. Partial index on rare value only.

Tiny tables — seq scan cheaper than index round-trip (< few thousand rows, narrow).

Write-dominated tables — events ingest where reads are rare batch analytics; BRIN or no index + columnar export.

Duplicate/overlapping indexes — (a,b) and (a) where every query uses both columns; keep composite, drop redundant.

Columns updated every write — index on last_seen_at that changes every request.

Covering analytics in OLTP — heavy reporting belongs on replica, materialized view, or warehouse — not 12 indexes on orders.

Redundant PK — primary key already indexed; don't add second index on id.

Review cadence: quarterly, join pg_stat_user_indexes with pg_stat_statements; drop idx_scan = 0 over 30 days unless constraint-backed.`,
    {
      checklist: [
        "No duplicate left-prefix indexes",
        "No index on high-churn low-selectivity column without partial predicate",
        "Analytics queries routed off primary or use MV, not ad-hoc index sprawl",
      ],
    }
  ),
  sec(
    "workflow",
    "8. Index design workflow for a new query",
    `1. Capture exact SQL from app (parameterized), including ORDER BY and LIMIT
2. EXPLAIN ANALYZE on production-scale data
3. If seq scan + high cost: design index matching equality → range → order
4. CREATE INDEX CONCURRENTLY — never block writes in prod
5. Re-EXPLAIN; confirm index used and rows estimate sane
6. Ship; monitor idx_scan and query latency for 2 weeks
7. Document in schema migration comment: which query it serves

Rollback: DROP INDEX CONCURRENTLY if idx_scan stays zero or write latency regresses measurably.

This beats "index all foreign keys" because half your FK columns never appear in JOIN predicates on the hot path.`,
    {
      bullets: [
        "One index per documented query pattern — name indexes descriptively",
        "CONCURRENTLY for all prod index DDL",
        "Post-ship verification via pg_stat_user_indexes",
      ],
    }
  ),
];
