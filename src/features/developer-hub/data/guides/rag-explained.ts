import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const ragExplainedMeta = {
  overviewBody: `RAG is not "embed documents and pray." It is a retrieval pipeline with measurable quality: ingest → chunk → index → retrieve → rerank → generate with citations — each stage has failure modes you can test offline.

This guide covers production RAG mechanics: chunking with metadata that filters before vectors, hybrid retrieval, rerankers, citation contracts, faithfulness/groundedness metrics, and the failures that look like "the model is dumb" but are actually bad retrieval.`,
  objectives: [
    "Map the full RAG pipeline and name the bottleneck at each stage",
    "Design chunking + metadata strategy aligned to query patterns",
    "Implement hybrid retrieval and reranking with latency/cost budgets",
    "Measure faithfulness and groundedness; debug retrieval vs generation failures",
  ],
  prerequisites: [
    "Basic embeddings and cosine similarity intuition",
    "Built or consumed a vector search API (pgvector, Pinecone, etc.)",
    "Comfortable evaluating ML features with held-out datasets",
  ],
  takeaways: [
    "Most RAG failures are retrieval or chunking — fix those before swapping models",
    "Metadata filters before vector search beat bigger embedding models",
    "Citations are a product contract: enforce claim ⊆ sources in eval and UX",
    "Hybrid + rerank is the default production stack, not pure vector top-k",
  ],
};

export const ragExplainedSections: HubSection[] = [
  sec(
    "pipeline",
    "1. Pipeline stages",
    `Treat RAG as a data pipeline with SLIs, not a single API call.

Stages:
1. Ingest — parse PDF/HTML/Markdown/code; normalize; extract title, headings, timestamps
2. Chunk — split with structure awareness; attach metadata
3. Embed — batch embed chunks; store vector + sparse terms if hybrid
4. Index — vector DB + optional BM25 inverted index; tenant isolation
5. Retrieve — filter → hybrid search → top 20–100 candidates
6. Rerank — cross-encoder or LLM reranker → top 3–8
7. Generate — prompt with chunks + citation handles; refuse if insufficient context
8. Log — query, chunk ids, scores, answer, user feedback

Latency budget (typical interactive):
• Retrieve: 50–150ms
• Rerank: 100–400ms (biggest knob)
• LLM generation: 1–5s streaming
• Total p95 target: <8s for internal tools, <3s if no rerank

Async path for large corpora: precompute summaries per doc; retrieve summaries first, drill into chunks.`,
    {
      checklist: [
        "Each stage has timeout and fallback (e.g., skip rerank under load)",
        "End-to-end trace id links query → chunk ids → answer",
        "Reindex job idempotent on doc version hash",
      ],
    }
  ),
  sec(
    "chunking",
    "2. Chunking & metadata",
    `Chunks are your unit of recall. Wrong size or missing metadata = silent misses.

Chunking rules:
• Respect structure: headings, slides, functions, tables (tables often need row-group chunks)
• Target 256–512 tokens for prose; 128–256 for dense technical; overlap 10–20% for boundary facts
• Never split mid-sentence; code split on function/class boundaries
• Store parent_doc_id, section_path, page, updated_at, acl_scope

Metadata for pre-filter (before vector search):
• tenant_id / workspace_id (mandatory)
• doc_type, product_area, language, effective_date
• access_level — vector search must not return chunks user cannot read

Versioning:
• content_hash on chunk; re-embed only when hash changes
• Keep doc_version in metadata; stale chunks deleted on re-ingest

Anti-pattern: fixed 1000-char splits on PDFs — destroys tables and numbered procedures.`,
    {
      bullets: [
        "Heading breadcrumb in chunk text improves embedding quality",
        "One chunk = one coherent fact cluster when possible",
        "Test recall: can you retrieve a fact known to live in doc X?",
      ],
    }
  ),
  sec(
    "hybrid",
    "3. Hybrid retrieval",
    `Pure vector search misses exact tokens (SKUs, error codes, function names). Hybrid fixes that.

Components:
• Dense — embedding similarity (semantic)
• Sparse — BM25/keyword on title + body + metadata boosts
• Fusion — RRF (Reciprocal Rank Fusion) or weighted score normalization

Tuning starting points:
• Retrieve 50–100 candidates combined; fuse from top 100 each leg
• Boost title ×2, headings ×1.5 in sparse index
• Recency decay for time-sensitive docs: score × exp(-age_days / τ)

Query side:
• HyDE (hypothetical doc embedding) helps short queries — cost + latency trade-off
• Query expansion via LLM — offline eval only until proven
• Spell-normalize error codes and IDs before sparse leg

When hybrid hurts: tiny homogeneous corpus (<500 chunks) — vector alone may suffice.`,
    {
      code: [
        {
          language: "sql",
          title: "pgvector + metadata filter pattern",
          code: `SELECT id, content, metadata
FROM doc_chunks
WHERE tenant_id = $1
  AND acl_scope && $2::text[]
ORDER BY embedding <=> $3
LIMIT 50;`,
        },
      ],
    }
  ),
  sec(
    "rerank",
    "4. Rerank layer",
    `Bi-encoder retrieval is fast but shallow; cross-encoder rerank is slow but precise.

Options:
• Cross-encoder (ms-marco style) — best quality/cost for <100 pairs
• LLM reranker ("rate relevance 0–10") — flexible, expensive, watch variance
• No rerank — only if corpus <2k chunks and eval passes

Budget rule:
• Send reranker top 30–50, keep 4–8 for context window
• Truncate chunk text to 512 tokens for rerank input

Failure mode: reranker latency spikes → bypass rerank with feature flag and alert; degraded quality beats outage.`,
    {
      checklist: [
        "Rerank MRR@8 measured on golden queries",
        "Fallback path tested when rerank service down",
        "Deduplicate chunks from same section before LLM context",
      ],
    }
  ),
  sec(
    "citations",
    "5. Citations as a contract",
    `Users trust answers with sources; compliance requires them. Citations are enforced structure, not markdown decoration.

Implementation:
• Pass chunks with stable ids: [doc:abc#chunk:7]
• Require model output schema: { answer, citations: [{ chunk_id, quote_span }] }
• Post-validate: every factual sentence maps to ≥1 citation id present in context
• UI: hover cites → show source snippet + link to doc

Refusal path:
• If top rerank score < threshold → "I don't have enough information in your docs"
• Better than confident hallucination on weak retrieval

Grounding prompt line that works:
"Answer ONLY using provided sources. If insufficient, say so. Cite chunk ids inline."`,
    {
      bullets: [
        "Snippet in UI matches embedded chunk text (detect index drift)",
        "Highlight quote_span when model provides character offsets",
        "Log citation ids for click-through feedback loop",
      ],
    }
  ),
  sec(
    "evals",
    "6. Eval metrics: faithfulness & groundedness",
    `Measure retrieval and generation separately — combined "quality" hides the fix.

Retrieval metrics (offline golden set of query → relevant chunk ids):
• Recall@k, MRR, nDCG@10
• Target: Recall@50 > 0.9 before blaming the LLM

Generation metrics:
• Faithfulness — claims supported by retrieved context (LLM-as-judge or NLI model)
• Groundedness — answer uses only context, no external knowledge leak
• Citation precision/recall — cited chunks actually support the claim
• Answer correctness — vs human rubric on held-out Q&A

Regression harness:
• 100–500 question set from real user queries (PII scrubbed)
• CI gate: faithfulness ≥ baseline − 2%
• Slice by doc_type and query length — short queries often fail retrieval

Human eval cadence: weekly review of 20 random production failures tagged retrieval | rerank | generation.`,
    {
      checklist: [
        "Golden set versioned in git",
        "Failure taxonomy on every bad answer",
        "A/B tracks metric, not just thumbs up/down",
      ],
    }
  ),
  sec(
    "failures",
    "7. Failure modes & debugging",
    `Symptom → likely stage:

• Wrong but confident answer — retrieval miss or no refusal threshold; chunk too big/small
• "I don't know" too often — aggressive threshold, ACL over-filter, stale index
• Correct topic, wrong detail — boundary chunk split; need overlap or parent retrieval
• Ignores newest policy — missing recency boost; index not updated after publish
• Leaks cross-tenant data — ACL bug in filter, not model malice
• Slow — rerank or huge context; check p95 per stage in trace

Debug playbook:
1. Log retrieved chunk ids + scores for failing query
2. Re-run retrieval offline with same filters
3. If gold chunk absent → chunking/metadata/hybrid
4. If gold chunk present but low rank → embedding model or rerank
5. If gold in context but wrong answer → prompt or model; check faithfulness eval`,
  ),
  sec(
    "antipatterns",
    "8. Anti-patterns",
    `• Embed whole PDF as one vector
• No tenant filter on vector query
• top_k=3 without rerank on 100k+ chunks
• Measuring only answer helpfulness, not retrieval recall
• Re-embed entire corpus on every typo fix
• Stuffing 20 chunks into context "for safety" — confuses model, blows cost
• User-uploaded docs without virus scan and size caps
• Trusting generated citations without id validation

RAG quality is indexing engineering with an LLM on top.`,
  ),
];
