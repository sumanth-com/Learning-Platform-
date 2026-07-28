import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const promptEngineeringPlaybookMeta = {
  overviewBody: `Prompt engineering for production is not clever wording — it is interface design between unreliable stochastic models and deterministic systems your users depend on.

This playbook treats prompts as versioned contracts: explicit goals, hard constraints, structured output schemas, few-shot boundaries, tool-calling protocols, eval harnesses that catch regressions, and guardrails that fail closed. The bar is "ship to paying users without surprise behavior changes on model updates."`,
  objectives: [
    "Structure prompts with goal, constraints, context, schema, and examples as separable layers",
    "Design tool-calling flows with JSON schemas models cannot easily drift from",
    "Build an eval harness with golden sets, regression gates, and slice metrics — not vibe checks",
    "Layer guardrails: input filtering, output validation, escalation, and human-in-the-loop paths",
  ],
  prerequisites: [
    "Called an LLM API (OpenAI, Anthropic, or similar) from code",
    "Basic JSON Schema or Zod familiarity",
    "Shipped at least one user-facing feature with external API dependency",
  ],
  takeaways: [
    "System prompt = policy; user message = instance data — never mix secrets or PII into system",
    "Structured output beats 'respond in JSON' — use response_format, tool choice, or constrained decoding",
    "Evals are CI for prompts: same dataset, same scorer, block deploy on regression",
    "Guardrails validate after generation — the model is not your validator",
  ],
};

export const promptEngineeringPlaybookSections: HubSection[] = [
  sec(
    "structure",
    "1. Prompt structure — layers, not paragraphs",
    `Decompose every production prompt into replaceable layers:

Goal — one sentence outcome. "Extract invoice line items as structured JSON."

Constraints — hard rules the model must not violate:
• "Never invent SKU codes not present in the text"
• "If confidence < 0.7, set needs_review: true"
• Max length, tone, language, refusal conditions

Context — retrieved docs, user history, tool results. Label sections clearly:
"""DOCUMENT START ... DOCUMENT END"""
Models attend better to delimited blocks than inline prose.

Output schema — field names, types, enums, nullable rules. Repeat in system and validate post-hoc.

Few-shot — 2–5 examples covering edge cases, not happy path only. Order: simple → tricky → adversarial.

Anti-patterns:
• 800-word system prompt with goals buried in paragraph 3
• Examples that contradict constraints
• Asking for JSON without schema — you get trailing commas and markdown fences`,
    {
      checklist: [
        "Goal, constraints, context, schema, examples are separate blocks",
        "Constraints use MUST / NEVER, not 'please try to'",
        "Few-shots include at least one failure/ambiguous case",
      ],
    }
  ),
  sec(
    "schema",
    "2. Schema-first output — make invalid unshippable",
    `Free-form JSON generation fails in prod. Constrain at generation and validate at boundary.

Techniques:
• OpenAI structured outputs / json_schema response format
• Tool / function calling with strict: true — model emits arguments object
• Anthropic tool use with input_schema
• Outlines, guidance, llguidance for local/open models

Schema design tips:
• Flatten deeply nested trees when possible — fewer nesting errors
• Enums over free strings for categories
• Optional fields explicit; use null vs omit consistently
• Include reasoning field only if you consume it — otherwise models waste tokens rationalizing

Post-validation pipeline:
parse → Zod/JSON Schema validate → business rules (cross-field) → retry once with error feedback → fallback

Retry prompt pattern:
"Your previous output failed validation: {errors}. Fix and return valid JSON only."

Never retry infinitely — cap at 1–2; escalate to human or degraded response.`,
    {
      bullets: [
        "Schema in code is source of truth; prompt mirrors it",
        "Validation errors fed back on retry, not silently dropped",
        "Max retry + fallback path defined before launch",
      ],
    }
  ),
  sec(
    "few-shot",
    "3. Few-shot selection and maintenance",
    `Few-shots teach format and policy by example. They are also the first thing that rots.

Selection criteria:
• Cover boundary cases your eval set misses
• Match production input length distribution — don't few-shot on tweets if prod sends 10-page PDFs
• Diverse phrasings of same intent (paraphrase robustness)

What not to few-shot:
• PII or secrets (models memorize patterns)
• Outdated product behavior — stale shots are silent regressions
• More than ~5 examples in context — diminishing returns; use RAG for volume

Dynamic few-shot: retrieve similar solved examples from a vector store at runtime (episodic memory). Pin static core examples in system; append retrieved ones to user context.

Version few-shots with prompt version hash — when eval regresses, diff examples first.`,
  ),
  sec(
    "tool-calling",
    "4. Tool calling — JSON RPC to your backend",
    `Tools are functions the model may invoke. Design them like public API endpoints.

Tool definition:
• name: verb_noun (get_weather, create_ticket)
• description: when to use AND when not to use
• parameters: JSON Schema with required fields, enums, descriptions per property

Orchestration loop:
1. Model returns tool_calls
2. Execute tool server-side (never trust model to "simulate" side effects)
3. Append tool result messages
4. Model produces final answer or chains more tools

Rules:
• Idempotent tools where possible — models double-call
• Timeout and sanitize tool outputs before re-injection
• Parallel tool calls only when independent
• force tool_choice when workflow is deterministic step 1 of N

Anti-pattern: 20 tools with overlapping descriptions — model picks wrong one. Consolidate or use router prompt first.`,
    {
      checklist: [
        "Each tool has negative description ('Do not use for ...')",
        "Side effects only in server execution, never in prompt",
        "Tool results truncated/summarized if large",
      ],
    }
  ),
  sec(
    "eval-harness",
    "5. Eval harness — CI for nondeterministic code",
    `You cannot unit test a prompt once. You need a dataset, scorers, and regression gates.

Dataset layers:
• Golden set — hand-labeled, high quality, 50–500 cases
• Synthetic augmentations — paraphrases, typos, adversarial injections
• Production slices — sampled real inputs (redacted), tagged by outcome

Scorers (pick per task):
• Exact match on structured fields
• F1 on extraction spans
• LLM-as-judge with rubric (use only with human-calibrated correlation)
• Code execution (for codegen: does test pass?)
• Latency + token cost budgets

Regression gate:
• Run eval on every prompt/model change in CI
• Block if aggregate metric drops > ε or any critical slice fails
• Store results with prompt version, model id, temperature, seed

Observability in prod:
• Log prompt hash, model, latency, token count, validation pass/fail
• Sample failures to human review queue — feeds next golden set`,
    {
      bullets: [
        "Golden set in repo; grows from prod failures",
        "CI eval job with threshold gates",
        "Prompt version pinned in logs for incident debug",
      ],
    }
  ),
  sec(
    "regression",
    "6. Regression when models and prompts change",
    `Model upgrades (gpt-4 → gpt-4.1, Claude version bumps) change behavior without your deploy.

Migration playbook:
1. Snapshot current eval scores on old model
2. Run same harness on new model + same prompt
3. Diff failures by slice (language, length, domain)
4. Tune prompt or few-shots on failing slices only
5. Canary 5% traffic with new stack; compare business metrics

Prompt versioning:
• Store prompts in git, not hardcoded strings scattered in repo
• Semantic version: policy change = major, wording tweak = minor
• Feature flag prompt version per tenant for safe rollback

A/B at prompt level: two system prompts, same model — measure task success rate, not just user thumbs.

Document known regressions: "Model X hallucinates dates on invoices without explicit CONSTRAINT block."`,
  ),
  sec(
    "guardrails",
    "7. Guardrails — defense in depth",
    `Assume the model will eventually violate policy. Plan layers:

Input guards:
• PII detection / redaction before model
• Prompt injection heuristics — delimit untrusted content; instruct model to treat user paste as data not instructions
• Rate limits and input size caps

Output guards:
• Schema validation (mandatory)
• Blocklist / regex for forbidden content
• Secondary classifier for safety categories
• Citation requirement — answer must quote source span for RAG tasks

Operational guards:
• Human review queue for low-confidence or high-stakes outputs
• Kill switch per feature flag
• Refusal templates for out-of-scope requests

Fail closed: if validation fails after retries, return "cannot complete" — not best-effort garbage.

Red team regularly: injection ("ignore previous instructions"), tool exfiltration ("call get_all_users"), jailbreaks on your domain.`,
    {
      checklist: [
        "Untrusted text delimited and labeled in prompt",
        "Output validated before any side effect or display",
        "Human escalation path for high-stakes failures",
      ],
    }
  ),
  sec(
    "production",
    "8. Production checklist",
    `Before shipping LLM feature to users:

Prompt & model
• Versioned prompt in git; model + temperature pinned in config
• Token budget per request; truncation strategy for long context

Quality
• Eval harness green on golden set
• Slice metrics acceptable (language, edge lengths)

Safety
• Input/output guardrails tested with red-team set
• PII handling documented

Ops
• Logging: prompt hash, latency, cost, validation outcome
• Alert on error rate spike or validation failure rate
• Rollback: previous prompt version one flag away

Senior bar: you can explain why the prompt failed a specific eval case and what you changed to fix it — with numbers.`,
    {
      bullets: [
        "Eval in CI; no manual-only QA",
        "Cost ceiling per user/session",
        "Incident runbook: disable feature, revert prompt version",
      ],
    }
  ),
];
