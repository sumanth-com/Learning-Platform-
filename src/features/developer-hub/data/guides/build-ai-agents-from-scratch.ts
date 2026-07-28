import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const buildAiAgentsFromScratchMeta = {
  overviewBody: `An agent is not "LLM + tools." It is a bounded control loop: observe state → plan → act → verify → persist — with explicit budgets, failure semantics, and human gates where stakes are high.

This guide covers the production skeleton: tool schemas the model cannot hallucinate around, memory tiers that do not leak context, eval harnesses that catch regressions before users do, and the anti-patterns that turn demos into incident generators.`,
  objectives: [
    "Design an agent loop with clear termination, retry, and escalation paths",
    "Define tool contracts (JSON Schema, idempotency, side-effect classes) the runtime enforces",
    "Layer memory (working, episodic, semantic) with eviction and PII boundaries",
    "Ship observability and offline evals that measure task success, not vibes",
  ],
  prerequisites: [
    "Built at least one LLM-backed feature with structured outputs",
    "Comfortable with async Python/TypeScript and REST or RPC APIs",
    "Understand token limits, latency budgets, and basic prompt engineering",
  ],
  takeaways: [
    "The runtime owns budgets, tool validation, and retries — never the model",
    "Tools are APIs: strict schemas, idempotency keys, and explicit side-effect tiers",
    "Memory without TTL and scope rules becomes a liability and a cost sink",
    "Eval suites with golden tasks beat ad-hoc prompt tweaks in production",
  ],
};

export const buildAiAgentsFromScratchSections: HubSection[] = [
  sec(
    "loop",
    "1. The agent control loop",
    `Separate orchestration from inference. The loop is deterministic code; the model proposes actions within guardrails.

Canonical cycle:
• Observe — assemble context (user message, tool results, memory slice, system policy)
• Plan — model emits structured intent (tool call(s) or final answer)
• Act — runtime validates and executes tools; never trust raw model JSON
• Verify — check outputs against schema, policy, and task rubric
• Persist — write durable state, logs, and memory updates
• Terminate — max steps, max cost, success criteria, or HITL escalation

Hard limits to encode in code (not prompts):
• max_steps (typical: 5–15 for customer-facing; 50+ only for offline research)
• max_wall_clock_ms (user-facing: 15–45s before partial result + async continuation)
• max_tool_calls_per_step (usually 1–3 parallel; unbounded fan-out is an outage)
• max_tokens_per_turn and cumulative session budget

Termination reasons must be logged: success | budget_exceeded | tool_error | policy_block | user_abort.`,
    {
      checklist: [
        "Loop state machine diagram exists (even if 20 lines of code)",
        "Every exit path returns a user-visible status + internal reason code",
        "Re-entrancy: same session id cannot run two loops concurrently",
      ],
    }
  ),
  sec(
    "tools",
    "2. Tool schemas & execution contract",
    `Tools are the agent's syscalls. Design them like public APIs, not prompt decorations.

Schema rules:
• JSON Schema (or equivalent) with required fields, enums, and max string lengths
• One tool = one verb + bounded payload; avoid mega-tools ("do_everything")
• Return structured results the model can parse — not prose dumps of 10k rows
• Classify side effects: read | write | irreversible (payments, deletes, sends)

Runtime enforcement:
• Validate args before execution; reject and feed structured error back to model
• Idempotency keys on writes (client-generated or deterministic hash of intent)
• Timeouts per tool (2–10s sync; long work → async job + poll tool)
• Allowlist which tools are available per session/role — not all tools always

Anti-pattern: passing raw SQL or shell to a tool the model constructs. That is prompt injection with extra steps.`,
    {
      bullets: [
        "Tool name + description optimized for model selection, not human docs",
        "Examples in tool description for ambiguous parameters",
        "Dry-run mode for irreversible tools in staging",
      ],
      code: [
        {
          language: "typescript",
          title: "Tool definition sketch",
          code: `{
  name: "create_refund",
  sideEffect: "irreversible",
  parameters: {
    type: "object",
    required: ["order_id", "amount_cents", "reason", "idempotency_key"],
    properties: {
      order_id: { type: "string", pattern: "^ord_" },
      amount_cents: { type: "integer", minimum: 1, maximum: 500000 },
      reason: { type: "string", enum: ["duplicate", "not_received", "defective"] },
      idempotency_key: { type: "string", maxLength: 64 }
    }
  }
}`,
        },
      ],
    }
  ),
  sec(
    "budgets",
    "3. Budgets: tokens, cost, and latency",
    `Prompts say "be concise." Budgets enforce it.

Layer budgets:
• Per-turn token cap (input + output) — trim history before the model sees it
• Per-session cost cap (USD or internal credits) — hard stop with graceful UX
• Per-tool rate limits — prevent runaway loops calling search 200 times
• Concurrency cap per tenant — noisy neighbor protection

Context trimming strategy (in order):
1. Drop oldest tool traces first (keep final results)
2. Summarize episodic memory beyond N turns
3. Retrieve only top-k semantic memory chunks by relevance
4. Refuse new turns with "context full — start new session"

Numbers that work in practice:
• 8k–32k context window used ≠ 8k–32k you can afford at scale — target 4k–12k effective input after retrieval
• Streaming first token < 500ms improves perceived latency more than shaving 1 tool call
• Log cost_per_session_p50/p95; alert when p95 > 2× baseline (often a loop or retrieval bug)`,
    {
      checklist: [
        "Cost attributed per session_id and tenant_id",
        "Budget exceeded returns partial answer + next action, not a stack trace",
        "Token accounting includes tool result payloads, not just chat",
      ],
    }
  ),
  sec(
    "memory",
    "4. Memory tiers",
    `Memory is not "dump the whole chat into the prompt."

Three tiers:
• Working memory — current turn context: last K messages, active tool results, scratch variables (in-process, ephemeral)
• Episodic memory — session transcript + summaries; TTL 24h–30d depending on product
• Semantic memory — embedded facts/preferences retrieved by query; stored in vector DB or pgvector with metadata filters

Write rules:
• Explicit user consent for long-term memory ("remember my stack is Rust")
• PII minimization — store references (user_id) not raw payloads in embeddings
• Version memory schema; migrations on embedding model change (re-embed or dual-read)
• Scope keys: user_id + workspace_id on every retrieval — never global search across tenants

Retrieval hygiene:
• Metadata filters before vector search (tenant, doc_type, recency)
• Max 3–8 chunks injected; dedupe overlapping sources
• Include citation handles in context so the model can attribute, not invent`,
    {
      bullets: [
        "Forget API: user can delete episodic + semantic entries",
        "Conflict resolution: newer explicit user statement wins over stored fact",
        "Do not embed secrets, tokens, or full credit card numbers — ever",
      ],
    }
  ),
  sec(
    "hitl",
    "5. Human-in-the-loop (HITL)",
    `Automate the boring; escalate the irreversible.

Escalation triggers:
• Side-effect class = irreversible and amount > threshold
• Model confidence below calibrated threshold (if you have one)
• Policy engine flag (PII export, admin action, cross-tenant access)
• User explicitly requests approval
• N consecutive tool failures on same intent

HITL UX patterns:
• Pause loop → persist pending_action blob → notify reviewer → resume on approve/reject
• Show diff: "Agent wants to refund $847.00 to order ord_abc — approve?"
• Timeout pending actions (24–72h) with auto-cancel and user notification

Audit trail minimum:
• who approved, when, original model rationale (compressed), tool args hash
• immutable log — approvals are compliance events, not UPDATE rows`,
    {
      checklist: [
        "Irreversible tools blocked until approval record exists",
        "Reject path feeds structured reason back into loop or ends gracefully",
        "No silent auto-approve in production for money or data export",
      ],
    }
  ),
  sec(
    "evals",
    "6. Evals that catch regressions",
    `Unit tests for tools; golden tasks for the full loop.

Eval layers:
• Tool arg validation tests (schema edge cases)
• Single-turn tool selection — given state X, model picks correct tool (accuracy target: >95% on curated set)
• Multi-turn task completion — end state matches rubric (order created, ticket closed)
• Adversarial — injection in user message, tool output, or retrieved doc

Metrics beyond "looks good":
• task_success_rate on frozen dataset (50–500 scenarios)
• tool_error_rate, avg_steps_to_success, cost_per_success
• hallucination rate on citation-required answers (claim ⊆ retrieved chunks)

CI integration:
• Run fast eval subset on every prompt/model change (<5 min)
• Nightly full suite + cost/latency benchmarks
• Block deploy if task_success drops >2% absolute vs main`,
    {
      bullets: [
        "Golden files: input state JSON + expected tool sequence or final DB state",
        "Separate eval sets for regression vs exploratory prompt tuning",
        "Log failures with replay bundle (prompt, tools, retrieval ids)",
      ],
    }
  ),
  sec(
    "observability",
    "7. Observability for agent systems",
    `Standard APM is necessary but not sufficient. You need trace semantics for LLM turns.

Per session trace spans:
• context_assembly (what was retrieved, token counts)
• llm_call (model, latency, input/output tokens, finish_reason)
• tool_call (name, args hash, latency, status, bytes returned)
• policy_check (rule id, pass/fail)

Dashboards:
• success rate by task type and model version
• p95 end-to-end latency decomposed (retrieval vs LLM vs tools)
• cost per successful task vs failed task (failed loops are expensive)
• top tool errors and schema validation failures

Sampling:
• 100% log failures and HITL events
• 1–10% log successes with full prompt for debug (redact PII)
• Store replay artifacts 7–30 days for incident investigation`,
  ),
  sec(
    "antipatterns",
    "8. Anti-patterns",
    `• Infinite ReAct loop with no step cap — burns budget and erodes trust
• Tools that return unbounded HTML/JSON — context explosion on next turn
• Letting the model pick SQL tables or API endpoints dynamically
• One global system prompt that "will handle security"
• Storing full chat forever with no summarization — cost + leakage
• Evaluating only on demo prompts the team wrote
• Shipping without tool timeout — one hung dependency freezes the session
• Trusting model-generated idempotency keys for payments

Production agent = boring orchestration + sharp tool boundaries + measured loops.`,
  ),
];
