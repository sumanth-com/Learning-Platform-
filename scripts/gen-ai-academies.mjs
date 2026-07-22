import fs from "fs";
import path from "path";

const root = process.cwd();

function section(slug, title, description, topics) {
  return { slug, title, description, topics };
}

function topic(
  slug,
  title,
  summary,
  estimatedMinutes,
  difficulty,
  keywords,
  challengeWeight,
  explanation,
  commonMistakes,
  bestPractices,
  interviewQuestions,
  cheatSheet
) {
  return {
    slug,
    title,
    summary,
    estimatedMinutes,
    difficulty,
    keywords,
    challengeWeight,
    explanation,
    a11yNotes: [],
    commonMistakes,
    bestPractices,
    interviewQuestions,
    cheatSheet,
  };
}

function renderCurriculum(typeName, constName, flattenName, sections) {
  return `export type ${typeName}Difficulty = "beginner" | "intermediate" | "advanced";

export type ${typeName}TopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ${typeName}Difficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ${typeName}SectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ${typeName}TopicDef[];
};

export const ${constName}: ${typeName}SectionDef[] = ${JSON.stringify(sections, null, 2)};

export function ${flattenName}(): ${typeName}TopicDef[] {
  return ${constName}.flatMap((section) => section.topics);
}
`;
}

const llmSections = [
  section("llm-foundations", "LLM Foundations", "What LLMs are and how they generate text.", [
    topic("what-is-an-llm", "What is an LLM?", "Large language models predict tokens to generate text from prompts.", 12, "beginner", ["llm", "tokens", "model"], 4,
      "A large language model (LLM) is a neural network trained to predict the next token in a sequence. Given a prompt, it samples likely continuations. Modern chat models are instruction-tuned so they follow user requests. Understanding tokens, context windows, and sampling helps you design reliable product features.",
      ["Treating the model as a database with guaranteed facts", "Ignoring token limits and truncating important context", "Assuming identical behavior across model versions"],
      ["Design for probabilistic outputs", "Measure quality with evals", "Keep prompts and model versions under version control"],
      ["What does an LLM predict?", "What is a token?", "Why are outputs non-deterministic?"],
      [{ tag: "token", desc: "Unit of text the model reads and writes" }, { tag: "context window", desc: "Max tokens the model can consider" }, { tag: "completion", desc: "Model-generated continuation" }]),
    topic("tokens-and-context", "Tokens and Context Windows", "Prompts and responses consume a limited context budget.", 12, "beginner", ["tokens", "context", "window"], 4,
      "Everything the model sees counts toward the context window: system instructions, history, retrieved docs, and the reply. Long chats can push older turns out of context. Token counting matters for cost and quality. Summarize or retrieve selectively instead of stuffing everything.",
      ["Pasting huge documents into every request", "Forgetting system prompts also use tokens", "No strategy when history grows"],
      ["Budget tokens intentionally", "Summarize long histories", "Retrieve only relevant chunks"],
      ["What counts toward context?", "What happens when context overflows?", "How do you manage long chats?"],
      [{ tag: "context budget", desc: "Tokens available for input and output" }, { tag: "truncation", desc: "Dropping content that exceeds limits" }, { tag: "history", desc: "Prior messages included in the prompt" }]),
    topic("prompts-vs-training", "Prompts vs Training", "Prompting steers a frozen model; training changes weights.", 10, "beginner", ["prompt", "finetune", "weights"], 3,
      "Prompting and retrieval change behavior without updating model weights. Fine-tuning and continued pretraining change weights and need data, compute, and evaluation. Most product features start with prompting, tools, and RAG before considering fine-tunes.",
      ["Fine-tuning for every small instruction change", "Expecting prompts to permanently teach new private facts", "No evals when changing either prompts or weights"],
      ["Prefer prompts and RAG first", "Fine-tune for style or domain patterns with data", "Evaluate before and after changes"],
      ["Prompting vs fine-tuning?", "When is RAG better than fine-tuning?", "What does training change?"],
      [{ tag: "prompting", desc: "Steer behavior with instructions and examples" }, { tag: "fine-tune", desc: "Update weights on task-specific data" }, { tag: "RAG", desc: "Retrieve external knowledge into the prompt" }]),
    topic("sampling-basics", "Sampling Basics", "Temperature and related settings control randomness.", 12, "beginner", ["temperature", "sampling", "top-p"], 4,
      "Sampling parameters influence how the model chooses the next token. Lower temperature makes outputs more deterministic; higher temperature increases variety. For structured extraction, prefer low temperature. For brainstorming, higher temperature can help. Always pair settings with evaluation.",
      ["High temperature for JSON extraction", "Changing many sampling knobs without measuring", "Assuming temperature equals creativity quality"],
      ["Use low temperature for deterministic tasks", "Document sampling settings per feature", "Evaluate output stability"],
      ["What does temperature do?", "When use low temperature?", "Why measure stability?"],
      [{ tag: "temperature", desc: "Controls randomness in token sampling" }, { tag: "top-p", desc: "Nucleus sampling probability mass" }, { tag: "deterministic", desc: "More repeatable outputs at low randomness" }]),
  ]),
  section("prompting", "Prompting Craft", "Instructions, roles, examples, and structured outputs.", [
    topic("system-and-user-roles", "System and User Roles", "Separate durable instructions from user messages.", 12, "beginner", ["system", "user", "roles"], 4,
      "System messages hold durable product rules. User messages carry the request. Assistant messages are prior model replies. Clear role separation makes prompts easier to maintain and safer to update. Do not put untrusted user text into system instructions without boundaries.",
      ["Stuffing everything into one user blob", "Letting users overwrite system policy", "No separation between product rules and task input"],
      ["Keep policies in system prompts", "Treat user content as untrusted", "Version system prompts like code"],
      ["What belongs in the system prompt?", "Why separate roles?", "How can users abuse prompts?"],
      [{ tag: "system", desc: "Durable instructions for the assistant" }, { tag: "user", desc: "End-user or application request" }, { tag: "assistant", desc: "Prior model responses in history" }]),
    topic("few-shot-examples", "Few-Shot Examples", "Examples teach format and judgment better than abstract rules alone.", 12, "intermediate", ["few-shot", "examples", "format"], 4,
      "Few-shot prompting shows input/output pairs the model should imitate. Good examples cover edge cases and the exact schema you want. Too many or conflicting examples confuse the model. Prefer short, high-signal demonstrations.",
      ["Contradictory examples", "Examples that do not match the target schema", "Huge example banks that waste context"],
      ["Show 1-3 strong examples", "Match the production output format", "Include one tricky edge case"],
      ["What is few-shot prompting?", "How many examples are enough?", "What makes a good example?"],
      [{ tag: "few-shot", desc: "Learning from in-prompt examples" }, { tag: "demo", desc: "Example input and ideal output" }, { tag: "schema", desc: "Expected structure of the answer" }]),
    topic("structured-output", "Structured Output", "Ask for JSON or schemas when downstream code must parse reliably.", 14, "intermediate", ["json", "schema", "structured"], 5,
      "Structured outputs reduce brittle free-text parsing. Specify the schema, require valid JSON, and validate on the server. Some APIs offer JSON modes or tool/function calling. Always validate; never trust model JSON blindly.",
      ["Parsing free text with fragile regex", "No schema validation after the model responds", "Asking for JSON without showing the shape"],
      ["Provide an explicit schema", "Validate with a parser", "Retry or repair on invalid JSON"],
      ["Why prefer structured outputs?", "What should you validate?", "How do you recover from invalid JSON?"],
      [{ tag: "JSON mode", desc: "API setting biased toward JSON replies" }, { tag: "schema", desc: "Fields and types you expect" }, { tag: "validate", desc: "Parse and check before use" }]),
    topic("prompt-injection", "Prompt Injection Basics", "Untrusted content can try to override your instructions.", 14, "intermediate", ["injection", "security", "untrusted"], 5,
      "Prompt injection happens when attacker-controlled text tries to change model behavior, exfiltrate secrets, or ignore policies. Separate trusted instructions from untrusted documents. Do not give the model tools that can act irreversibly without checks. Treat model output as untrusted too.",
      ["Putting secrets in the prompt", "Letting retrieved web text redefine system rules", "Executing tool calls without authorization checks"],
      ["Isolate untrusted content", "Least-privilege tools", "Validate actions server-side"],
      ["What is prompt injection?", "How do retrieved docs create risk?", "What should never sit in prompts?"],
      [{ tag: "injection", desc: "Malicious instructions inside content" }, { tag: "untrusted", desc: "Data you did not fully control" }, { tag: "tool risk", desc: "Dangerous actions the model might request" }]),
    topic("eval-driven-prompts", "Eval-Driven Prompting", "Improve prompts with a fixed evaluation set, not vibes alone.", 12, "intermediate", ["evals", "dataset", "quality"], 4,
      "Prompt iteration without evals is guesswork. Build a small golden set of inputs and expected traits. Score changes before shipping. Track regressions when models or prompts update. Evals turn prompting into engineering.",
      ["Changing prompts based on one anecdotal failure", "No golden set", "Shipping prompt edits without comparison"],
      ["Maintain a golden evaluation set", "Compare prompt versions quantitatively", "Include failure cases intentionally"],
      ["What is an eval set?", "Why not rely on vibes?", "When re-run evals?"],
      [{ tag: "golden set", desc: "Curated examples for scoring quality" }, { tag: "regression", desc: "Quality drop after a change" }, { tag: "score", desc: "Metric used to compare prompt versions" }]),
  ]),
  section("model-apis", "Model APIs", "Calling providers, messages, streaming, and errors.", [
    topic("chat-completions-api", "Chat Completions API", "Most apps send message arrays and receive assistant content.", 12, "beginner", ["api", "messages", "chat"], 4,
      "Chat APIs accept a list of role-tagged messages and return an assistant message. You configure model, temperature, and max tokens. Handle rate limits, timeouts, and partial failures. Keep API keys on the server.",
      ["Calling providers directly from the browser with secret keys", "No timeout or retry policy", "Ignoring finish reasons"],
      ["Proxy model calls through your backend", "Set timeouts and retries carefully", "Log request metadata without logging secrets"],
      ["What does a messages array contain?", "Where should API keys live?", "What errors should you handle?"],
      [{ tag: "messages", desc: "Role-tagged conversation turns" }, { tag: "model", desc: "Which LLM variant to call" }, { tag: "max_tokens", desc: "Cap on generated output length" }]),
    topic("streaming-responses", "Streaming Responses", "Streams return tokens incrementally for faster UX.", 12, "intermediate", ["stream", "sse", "ux"], 4,
      "Streaming sends partial tokens as they are generated so users see progress sooner. Your client must concatenate chunks and handle abort. Streaming complicates retries and moderation mid-flight. Offer cancel for long answers.",
      ["Buffering the whole stream before showing anything", "No abort/cancel", "Retrying streams without idempotency thinking"],
      ["Render tokens as they arrive", "Support cancel", "Finalize only when the stream completes"],
      ["Why stream?", "What must the client concatenate?", "What is harder with streaming?"],
      [{ tag: "SSE", desc: "Server-sent events often used for streams" }, { tag: "chunk", desc: "Partial token payload" }, { tag: "abort", desc: "Cancel an in-flight generation" }]),
    topic("embeddings-intro", "Embeddings Intro", "Embeddings map text to vectors for similarity search.", 12, "intermediate", ["embeddings", "vectors", "similarity"], 4,
      "Embedding models turn text into numeric vectors so similar meanings are close in vector space. They power semantic search and RAG. Embedding quality depends on the model and chunking strategy. Store vectors in a vector database or extension.",
      ["Using keyword search when semantic search is needed without measuring", "Huge chunks that mix many topics", "Comparing vectors from different embedding models"],
      ["Chunk by semantic units", "Keep embedding model consistent", "Evaluate retrieval hit rate"],
      ["What is an embedding?", "What are embeddings used for?", "Why does chunking matter?"],
      [{ tag: "vector", desc: "Numeric representation of text meaning" }, { tag: "similarity", desc: "Distance or score between vectors" }, { tag: "chunk", desc: "Segment of a document embedded together" }]),
    topic("cost-and-latency", "Cost and Latency", "Token usage and model choice drive spend and speed.", 12, "intermediate", ["cost", "latency", "tokens"], 4,
      "Larger models are often slower and costlier. Cache repeated prompts, shrink context, and route simple tasks to smaller models. Measure p95 latency and cost per successful task, not just per call.",
      ["Always using the largest model", "No caching of identical requests", "Optimizing cost without tracking quality"],
      ["Route by task difficulty", "Cache where safe", "Track cost and quality together"],
      ["What drives LLM cost?", "How can you reduce latency?", "Why route between models?"],
      [{ tag: "tokens in/out", desc: "Billed input and output units" }, { tag: "routing", desc: "Choosing model by task" }, { tag: "cache", desc: "Reuse prior results for identical asks" }]),
  ]),
  section("reliability", "Reliability and Safety", "Hallucinations, grounding, moderation, and guardrails.", [
    topic("hallucinations", "Hallucinations", "Models can produce fluent falsehoods with high confidence.", 12, "beginner", ["hallucination", "grounding", "facts"], 4,
      "Hallucinations are plausible but incorrect statements. Mitigate with grounding, tool use, citations, and refusal when unsure. Never present unchecked model text as authoritative for high-stakes domains without verification.",
      ["Trusting the model for exact legal or medical facts", "No citation or source requirement", "Punishing 'I do not know' answers"],
      ["Require sources when possible", "Allow abstaining", "Verify critical claims externally"],
      ["What is a hallucination?", "How do you reduce them?", "When should the model abstain?"],
      [{ tag: "hallucination", desc: "Fluent but incorrect generation" }, { tag: "grounding", desc: "Tying answers to retrieved evidence" }, { tag: "abstain", desc: "Refuse when uncertain" }]),
    topic("grounding-with-context", "Grounding with Context", "Provide relevant evidence and instruct the model to use it.", 12, "intermediate", ["grounding", "context", "cite"], 4,
      "Grounding means supplying documents or tool results and telling the model to answer from them. Ask for citations to chunk IDs. If evidence is missing, the model should say so. Grounding quality depends on retrieval quality.",
      ["Providing irrelevant context", "Allowing answers outside provided evidence silently", "No citation format"],
      ["Pass only relevant chunks", "Require citations", "Fail closed when evidence is absent"],
      ["What is grounding?", "Why cite chunk IDs?", "What if retrieval misses?"],
      [{ tag: "evidence", desc: "Documents or tool results in context" }, { tag: "citation", desc: "Pointer back to a source chunk" }, { tag: "fail closed", desc: "Do not invent when evidence is missing" }]),
    topic("moderation-and-policy", "Moderation and Policy", "Filter unsafe inputs and outputs according to product policy.", 12, "intermediate", ["moderation", "policy", "safety"], 4,
      "Moderation systems classify harmful content. Combine provider tools with your own policy layer. Decide what to block, warn, or allow. Log safety events for review. Policies should be explicit in system prompts and enforced in code.",
      ["Only relying on the model to police itself", "No logging of blocked events", "Unclear product policy"],
      ["Enforce policy in code paths", "Use moderation APIs where appropriate", "Review borderline cases"],
      ["Why not rely only on the model?", "What should you log?", "Where is policy enforced?"],
      [{ tag: "moderation", desc: "Classify unsafe content" }, { tag: "policy", desc: "Product rules for allowed behavior" }, { tag: "block", desc: "Refuse to process or show content" }]),
    topic("guardrails", "Guardrails", "Validate inputs and outputs before they affect users or systems.", 12, "intermediate", ["guardrails", "validate", "schema"], 4,
      "Guardrails include allowlists, schema checks, length limits, and tool permission checks. They sit around the model, not only inside the prompt. Defense in depth beats a single clever instruction.",
      ["Prompt-only safety with no validation", "Unlimited output length into UI", "Tools callable without authz"],
      ["Validate structured outputs", "Constrain tools by role", "Limit output size and destination"],
      ["What is a guardrail?", "Why validate outside the prompt?", "Give an example guardrail"],
      [{ tag: "allowlist", desc: "Only permit known-safe values" }, { tag: "schema check", desc: "Reject invalid structures" }, { tag: "authz", desc: "Authorization before tool side effects" }]),
  ]),
  section("rag-basics", "RAG Basics", "Retrieve evidence, then generate grounded answers.", [
    topic("what-is-rag", "What is RAG?", "Retrieval-Augmented Generation fetches relevant docs before answering.", 12, "beginner", ["rag", "retrieve", "generate"], 4,
      "RAG retrieves relevant chunks from a knowledge base and adds them to the prompt so the model can answer with fresher or private information. It reduces some hallucinations when retrieval is good. RAG systems need chunking, indexing, retrieval, and citation design.",
      ["Calling RAG a guarantee of correctness", "Retrieving nothing useful but still answering confidently", "No evaluation of retrieval quality"],
      ["Evaluate retrieval separately from generation", "Cite sources", "Keep the knowledge base fresh"],
      ["What problem does RAG solve?", "What are the main RAG stages?", "Why evaluate retrieval?"],
      [{ tag: "retrieve", desc: "Find relevant chunks" }, { tag: "augment", desc: "Insert chunks into the prompt" }, { tag: "generate", desc: "Produce the grounded answer" }]),
    topic("chunking-strategy", "Chunking Strategy", "How you split documents affects retrieval quality.", 12, "intermediate", ["chunking", "overlap", "docs"], 4,
      "Chunks should be coherent units with enough context to stand alone. Overlap can preserve boundary meaning. Too large chunks reduce precision; too small chunks lose context. Tune with retrieval metrics.",
      ["One chunk per entire PDF", "Tiny fragments without headings", "No metadata on chunks"],
      ["Chunk by sections with light overlap", "Store metadata like title and URL", "Measure recall@k"],
      ["What is chunk overlap for?", "What happens if chunks are too large?", "What metadata helps?"],
      [{ tag: "chunk size", desc: "Token or character length per segment" }, { tag: "overlap", desc: "Shared tokens between adjacent chunks" }, { tag: "metadata", desc: "Source fields stored with each chunk" }]),
    topic("retrieval-quality", "Retrieval Quality", "If retrieval fails, generation cannot be well grounded.", 12, "intermediate", ["retrieval", "recall", "precision"], 4,
      "Measure whether the right chunks appear in the top results. Hybrid search can combine keywords and vectors. Rerankers improve precision. Bad queries need rewriting. Generation evals alone hide retrieval bugs.",
      ["Only reading final answer quality", "No hybrid search when names/IDs matter", "Never inspecting retrieved chunks"],
      ["Log retrieved chunks in staging", "Track recall@k", "Add hybrid or rerank when needed"],
      ["Why inspect retrieved chunks?", "What is recall@k?", "When use hybrid search?"],
      [{ tag: "recall@k", desc: "Share of needed docs found in top k" }, { tag: "hybrid", desc: "Keyword plus vector retrieval" }, { tag: "rerank", desc: "Reorder candidates for precision" }]),
    topic("citations", "Citations", "Citations let users verify grounded answers.", 10, "beginner", ["citations", "sources", "ux"], 3,
      "Ask the model to cite chunk IDs or URLs used. Render citations in the UI. If a claim lacks a citation, treat it as unverified. Citations build trust and help debug wrong answers.",
      ["Fake citations invented by the model", "No UI for sources", "Allowing answers with empty citations in grounded mode"],
      ["Require citations for grounded answers", "Validate citation IDs exist", "Show sources in the product UI"],
      ["Why cite sources?", "How do fake citations appear?", "How should the UI present them?"],
      [{ tag: "chunk id", desc: "Identifier for a retrieved segment" }, { tag: "source UI", desc: "User-visible references" }, { tag: "unverified", desc: "Claim without valid citation" }]),
  ]),
  section("production-llm", "Production LLM Habits", "Versioning, observability, and graceful degradation.", [
    topic("prompt-versioning", "Prompt Versioning", "Treat prompts as versioned product code.", 10, "beginner", ["version", "prompt", "release"], 3,
      "Store prompts in git or a config service with IDs. Ship prompt changes through review. Tie production traces to prompt versions. Rollback prompts like any other release.",
      ["Editing prompts only in a dashboard with no history", "No link between traces and prompt IDs", "Hotfixing prompts without evals"],
      ["Version every prompt", "Review prompt PRs", "Annotate logs with prompt version"],
      ["Why version prompts?", "What should a prompt release include?", "How do you roll back?"],
      [{ tag: "prompt id", desc: "Stable identifier for a prompt version" }, { tag: "changelog", desc: "Record of prompt edits" }, { tag: "rollback", desc: "Restore previous prompt version" }]),
    topic("tracing-llm-calls", "Tracing LLM Calls", "Trace prompts, retrieval, tools, and outputs for debugging.", 12, "intermediate", ["trace", "observability", "logs"], 4,
      "LLM features fail in subtle ways. Traces should capture model, latency, token counts, retrieved chunks, and tool calls without leaking secrets. Sampling helps control volume. Use traces to diagnose regressions after prompt or model changes.",
      ["Logging raw secrets and PII carelessly", "No correlation IDs across retrieval and generation", "Only logging final text"],
      ["Redact sensitive fields", "Correlate multi-step traces", "Capture metadata needed to reproduce issues"],
      ["What belongs in an LLM trace?", "What must you redact?", "Why correlate steps?"],
      [{ tag: "trace", desc: "End-to-end record of an LLM request" }, { tag: "latency", desc: "Time to first token and total time" }, { tag: "redaction", desc: "Remove sensitive values from logs" }]),
    topic("fallbacks", "Fallbacks", "Degrade gracefully when models or tools fail.", 12, "intermediate", ["fallback", "timeout", "degrade"], 4,
      "Plan for provider outages, timeouts, and low-quality outputs. Fall back to smaller models, cached answers, or non-AI flows. Show honest UI states. Circuit breakers protect your backend.",
      ["Spinning forever on provider errors", "No non-AI alternative path", "Falling back silently to wrong answers"],
      ["Timeouts and circuit breakers", "Cached or template fallbacks", "Communicate degraded mode to users"],
      ["What is a useful fallback?", "Why use a circuit breaker?", "How should UX show degradation?"],
      [{ tag: "timeout", desc: "Max wait before aborting a call" }, { tag: "circuit breaker", desc: "Temporarily stop calling a failing dependency" }, { tag: "degraded mode", desc: "Reduced functionality when AI is unavailable" }]),
    topic("model-upgrades", "Model Upgrades", "New models can regress behavior even when average quality rises.", 12, "advanced", ["upgrade", "regression", "shadow"], 4,
      "When providers release new models, re-run evals and shadow traffic before switching. Pin model IDs in production. Watch safety and format regressions. Have a rollback pin ready.",
      ["Switching to latest automatically", "No shadow comparison", "Assuming higher benchmark scores mean no product regressions"],
      ["Pin model versions", "Shadow eval before cutover", "Keep rollback pins"],
      ["Why pin model IDs?", "What is shadow traffic?", "What regressions should you watch?"],
      [{ tag: "pin", desc: "Lock a specific model version" }, { tag: "shadow", desc: "Compare new model offline/online without user impact" }, { tag: "cutover", desc: "Switch production traffic to the new model" }]),
  ]),
];

const aiSections = [
  section("ai-product-basics", "AI Product Basics", "Where AI features fit in real products.", [
    topic("ai-feature-patterns", "AI Feature Patterns", "Common patterns include assist, generate, extract, and agentic tools.", 12, "beginner", ["patterns", "assist", "generate"], 4,
      "Product AI features often draft content, extract structured data, answer questions over docs, or call tools. Pick a pattern before choosing a model. Clear user jobs beat vague 'add AI' goals. Define success metrics up front.",
      ["Adding a chatbot with no user job", "No success metric", "Choosing tools before the workflow is clear"],
      ["Start from the user job", "Pick a narrow pattern", "Define eval metrics first"],
      ["Name four AI feature patterns", "Why start from the user job?", "What metric might you track?"],
      [{ tag: "assist", desc: "Help users draft or edit" }, { tag: "extract", desc: "Turn messy text into structure" }, { tag: "qa-over-docs", desc: "Answer with retrieved knowledge" }]),
    topic("human-in-the-loop", "Human in the Loop", "Keep humans reviewing high-impact AI outputs.", 12, "beginner", ["human", "review", "approval"], 4,
      "Human-in-the-loop designs show drafts for approval before side effects. Confidence and citations help reviewers. For low-risk tasks, lighter review is fine. Match review friction to blast radius.",
      ["Auto-sending AI emails without review", "Same review UX for tiny and huge risks", "No way to correct the model output"],
      ["Require approval for irreversible actions", "Make edits easy", "Scale review to risk"],
      ["When is human review required?", "What is blast radius?", "How do you reduce reviewer friction?"],
      [{ tag: "approval", desc: "Human confirm before side effects" }, { tag: "draft", desc: "AI output pending review" }, { tag: "blast radius", desc: "How much damage a wrong action can cause" }]),
    topic("ux-for-ai", "UX for AI", "Show uncertainty, sources, and easy regeneration.", 12, "beginner", ["ux", "streaming", "regenerate"], 3,
      "Good AI UX streams progress, allows regenerate, shows sources, and explains limits. Empty and error states matter. Avoid pretending the model is a person with private memory unless you designed that.",
      ["No regenerate control", "Hiding that content is AI-generated when policy requires disclosure", "Blocking the UI until a long generation finishes with no progress"],
      ["Stream tokens", "Offer regenerate and edit", "Disclose AI involvement when needed"],
      ["What controls help AI UX?", "Why show sources?", "Why stream?"],
      [{ tag: "regenerate", desc: "Request another completion" }, { tag: "disclosure", desc: "Tell users content is AI-assisted" }, { tag: "progress", desc: "Visible generation status" }]),
    topic("success-metrics", "Success Metrics", "Measure task success, not just model scores.", 12, "intermediate", ["metrics", "product", "quality"], 4,
      "Track acceptance rate, edit distance, task completion, latency, cost, and escalation to humans. Offline evals complement online metrics. Optimize the metric that matches the user job.",
      ["Only watching provider leaderboard scores", "No online feedback loop", "Optimizing clickbait engagement against user trust"],
      ["Define task-level success", "Combine offline and online metrics", "Watch cost per successful outcome"],
      ["What is a task-level metric?", "Offline vs online evals?", "Why track cost per success?"],
      [{ tag: "acceptance rate", desc: "How often users keep AI output" }, { tag: "edit distance", desc: "How much users change drafts" }, { tag: "escalation", desc: "Hand-off to human support" }]),
  ]),
  section("tool-use", "Tools and Function Calling", "Let models call functions under your control.", [
    topic("function-calling", "Function Calling", "Models can request structured tool calls your server executes.", 14, "intermediate", ["tools", "functions", "json"], 5,
      "Function calling lets the model choose a tool and arguments in a schema. Your server validates, authorizes, executes, and returns results. The model never gets direct production credentials. Keep tool surfaces small and explicit.",
      ["Letting the model hit arbitrary URLs", "No argument validation", "Exposing admin tools to all users"],
      ["Validate args with a schema", "Authorize every tool call", "Return concise tool results"],
      ["Who executes the tool?", "Why validate arguments?", "What should tools return?"],
      [{ tag: "tool call", desc: "Structured request to run a function" }, { tag: "arguments", desc: "JSON parameters for the tool" }, { tag: "tool result", desc: "Data returned to the model" }]),
    topic("tool-schemas", "Tool Schemas", "Clear JSON schemas improve tool selection and arguments.", 12, "intermediate", ["schema", "json", "parameters"], 4,
      "Describe tools with names, descriptions, and parameter schemas. Ambiguous descriptions cause wrong tool picks. Prefer enums and tight types. Version tool schemas as the product evolves.",
      ["Vague tool descriptions", "Optional everything with no constraints", "Breaking schemas without versioning"],
      ["Write precise tool descriptions", "Constrain parameters tightly", "Version breaking tool changes"],
      ["What makes a good tool description?", "Why use enums?", "How do you version tools?"],
      [{ tag: "name", desc: "Stable tool identifier" }, { tag: "parameters", desc: "JSON schema for arguments" }, { tag: "enum", desc: "Allowed fixed values" }]),
    topic("tool-authz", "Tool Authorization", "Check user permissions before executing side effects.", 12, "intermediate", ["authz", "permissions", "tools"], 5,
      "Even if the model asks to delete a record, your server must enforce authorization. Scope tools to the current user. Log tool invocations for audit. Never trust the model as an auth boundary.",
      ["Executing any tool the model requests", "Shared service account with admin rights for all users", "No audit log"],
      ["Authorize as the end user", "Least-privilege tool credentials", "Audit tool calls"],
      ["Why is the model not an auth boundary?", "How should credentials be scoped?", "What belongs in an audit log?"],
      [{ tag: "authz", desc: "Permission check before side effects" }, { tag: "least privilege", desc: "Minimal access for the tool" }, { tag: "audit", desc: "Record of who did what" }]),
    topic("agent-loops", "Agent Loops", "Agents iterate model-tool-model until a stop condition.", 14, "advanced", ["agent", "loop", "stop"], 5,
      "Agent loops let the model call tools repeatedly. Bound the max steps, total tokens, and wall time. Detect loops and stuck states. Prefer deterministic workflows when the path is known.",
      ["Unbounded loops", "No stop conditions", "Agents for simple single-tool tasks"],
      ["Cap steps and time", "Prefer explicit workflows when possible", "Watch for repeated failing tool calls"],
      ["What is an agent loop?", "What bounds should you set?", "When avoid agents?"],
      [{ tag: "max steps", desc: "Hard cap on tool iterations" }, { tag: "stop condition", desc: "Rule that ends the loop" }, { tag: "stuck state", desc: "Repeating failures without progress" }]),
  ]),
  section("rag-products", "RAG in Products", "Ship document Q&A and knowledge assistants safely.", [
    topic("knowledge-assistants", "Knowledge Assistants", "Product assistants answer from your docs with citations.", 12, "intermediate", ["assistant", "docs", "rag"], 4,
      "Knowledge assistants retrieve from approved corpora and answer with citations. Scope corpora per tenant. Refresh indexes when docs change. Provide escape hatches to human support.",
      ["Mixing tenant documents", "Stale indexes", "No citation UI"],
      ["Isolate tenant corpora", "Reindex on publish", "Show sources and escalate"],
      ["What corpus should an assistant use?", "Why tenant isolation?", "When escalate to humans?"],
      [{ tag: "corpus", desc: "Document collection available for retrieval" }, { tag: "tenant isolation", desc: "No cross-customer document leakage" }, { tag: "reindex", desc: "Refresh vectors after doc changes" }]),
    topic("query-rewriting", "Query Rewriting", "Rewrite user questions into better retrieval queries.", 12, "intermediate", ["rewrite", "query", "retrieval"], 4,
      "Users ask vaguely. A rewrite step can expand acronyms, add product context, or split multi-part questions. Rewrites should be evaluated against retrieval metrics. Keep rewrites transparent in traces.",
      ["Rewriting away the user's intent", "No eval of rewrite quality", "Always rewriting even when unnecessary"],
      ["Evaluate rewrite impact on recall", "Keep original query in traces", "Rewrite only when helpful"],
      ["Why rewrite queries?", "What risk does rewriting add?", "What should traces keep?"],
      [{ tag: "rewrite", desc: "Transform user text into a search query" }, { tag: "multi-query", desc: "Retrieve with several rewritten queries" }, { tag: "intent", desc: "What the user actually wants" }]),
    topic("freshness", "Knowledge Freshness", "Stale docs create confident wrong answers.", 10, "beginner", ["freshness", "index", "sync"], 3,
      "Connect publishing workflows to reindexing. Show document timestamps in citations when useful. For rapidly changing data, prefer tools/APIs over static RAG. Monitor complaints about outdated answers.",
      ["Manual reindex once a quarter only", "No timestamps on sources", "Embedding ticket queues that never drain"],
      ["Automate reindex on publish", "Prefer live tools for volatile data", "Surface source dates"],
      ["How do docs go stale?", "When prefer tools over RAG?", "What UX helps freshness?"],
      [{ tag: "reindex", desc: "Update stored vectors after changes" }, { tag: "source date", desc: "When the document was published" }, { tag: "live tool", desc: "Fetch current data via API" }]),
    topic("eval-rag-features", "Evaluating RAG Features", "Score retrieval and answer faithfulness separately.", 12, "advanced", ["eval", "faithfulness", "rag"], 4,
      "Faithfulness checks whether answers stick to evidence. Answer relevance checks user intent. Retrieval metrics find missing docs. Human review remains important for nuanced domains.",
      ["One overall thumbs-up only", "No faithfulness checks", "Ignoring retrieval failures"],
      ["Split retrieval vs generation evals", "Measure faithfulness", "Sample production traces for review"],
      ["What is faithfulness?", "Why split evals?", "How do humans fit in?"],
      [{ tag: "faithfulness", desc: "Answer supported by evidence" }, { tag: "relevance", desc: "Answer addresses the question" }, { tag: "human review", desc: "Spot-check real traces" }]),
  ]),
  section("integration", "Product Integration", "Wire AI into backends, queues, and clients.", [
    topic("server-side-orchestration", "Server-Side Orchestration", "Keep keys, tools, and policy on the server.", 12, "beginner", ["server", "proxy", "keys"], 4,
      "Browsers should call your backend, which calls the model provider. The server applies auth, rate limits, prompt templates, and tool execution. This protects secrets and centralizes policy.",
      ["Shipping provider keys to the client", "Duplicating prompts in every client app", "No server-side rate limiting"],
      ["Proxy all provider calls", "Centralize prompts and policy", "Rate limit per user"],
      ["Why proxy model calls?", "What runs on the server?", "What risk do client keys create?"],
      [{ tag: "proxy", desc: "Backend that calls the model provider" }, { tag: "rate limit", desc: "Cap requests per user or IP" }, { tag: "policy layer", desc: "Server enforcement of product rules" }]),
    topic("async-generation", "Async Generation", "Long jobs belong on queues with status APIs.", 12, "intermediate", ["queue", "async", "job"], 4,
      "Long generations or batch extractions should run asynchronously. Store job status, support cancel, and notify on completion. Synchronous HTTP requests time out and frustrate users.",
      ["Blocking HTTP for multi-minute jobs", "No job status endpoint", "Losing results on worker crash without persistence"],
      ["Enqueue long work", "Persist job state", "Support cancel and retry"],
      ["When use async generation?", "What should a job record store?", "Why support cancel?"],
      [{ tag: "job", desc: "Tracked async generation unit" }, { tag: "queue", desc: "Buffer of pending work" }, { tag: "status", desc: "queued|running|succeeded|failed" }]),
    topic("rate-limits-and-quotas", "Rate Limits and Quotas", "Protect providers and your bill from abuse.", 12, "intermediate", ["quota", "rate-limit", "abuse"], 4,
      "Apply per-user and per-tenant quotas. Back off on provider 429s. Differentiate free and paid tiers. Clear error messages beat silent failures. Track cost attribution per feature.",
      ["One global API key with no user quotas", "Retrying 429s aggressively without backoff", "No cost attribution"],
      ["Quota by user/tenant", "Exponential backoff on 429", "Attribute cost to features"],
      ["Why quota per user?", "How handle 429?", "What is cost attribution?"],
      [{ tag: "429", desc: "Provider rate limit response" }, { tag: "backoff", desc: "Wait longer between retries" }, { tag: "quota", desc: "Allowed usage over a window" }]),
    topic("prompt-templates", "Prompt Templates", "Templates keep product copy consistent and testable.", 10, "beginner", ["template", "variables", "prompts"], 3,
      "Store prompts as templates with typed variables. Escape user input. Unit-test rendered prompts. Templates make localization and experimentation easier.",
      ["String-concatenating untrusted input unsafely into instructions", "Copy-pasting prompt variants everywhere", "No tests for rendered prompts"],
      ["Use templates with explicit variables", "Escape/boundary user input", "Test rendered outputs"],
      ["What is a prompt template?", "Why escape user input?", "How do templates help experiments?"],
      [{ tag: "template", desc: "Prompt with placeholders" }, { tag: "variables", desc: "Typed inputs filled at runtime" }, { tag: "boundary", desc: "Delimiters around untrusted text" }]),
  ]),
  section("evaluation-ops", "Evaluation and Ops", "Ship AI changes with confidence.", [
    topic("offline-evals", "Offline Evals", "Score prompts and models on a fixed dataset before release.", 12, "intermediate", ["offline", "evals", "dataset"], 4,
      "Offline evals run against golden sets in CI. Include edge cases and safety cases. Automate scoring where possible and keep human review for subjective quality. Gate risky prompt changes on eval results.",
      ["No dataset", "Only happy-path examples", "Changing prompts without CI evals"],
      ["Grow a golden set continuously", "Run evals in CI", "Include safety cases"],
      ["What is an offline eval?", "What belongs in a golden set?", "How do evals gate releases?"],
      [{ tag: "golden set", desc: "Versioned evaluation examples" }, { tag: "scorer", desc: "Automatic or human grading function" }, { tag: "gate", desc: "Release blocked unless evals pass" }]),
    topic("online-feedback", "Online Feedback", "Collect thumbs, edits, and outcomes from real users.", 12, "intermediate", ["feedback", "thumbs", "online"], 4,
      "Online signals catch issues offline sets miss. Capture thumbs-down reasons, edits, and task success. Sample traces for review. Close the loop into dataset updates.",
      ["No feedback controls", "Collecting feedback but never reviewing it", "Optimizing only for positive thumbs"],
      ["Capture structured feedback", "Review negatives weekly", "Feed failures into golden sets"],
      ["What online signals help?", "How do you close the loop?", "Why review thumbs-down?"],
      [{ tag: "thumbs", desc: "Simple satisfaction signal" }, { tag: "edit signal", desc: "User corrections to AI output" }, { tag: "trace review", desc: "Human inspection of production calls" }]),
    topic("experimentation", "Experimentation", "A/B test prompts and models carefully.", 12, "advanced", ["experiment", "ab-test", "prompt"], 4,
      "Run controlled experiments on prompt or model variants. Watch quality, latency, and cost. Stop harmful experiments quickly. Keep assignment sticky per user when needed.",
      ["Shipping two prompts randomly with no metrics", "No kill switch", "Changing too many variables at once"],
      ["One primary metric", "Guardrail metrics for safety/latency/cost", "Easy rollback"],
      ["What should an AI experiment measure?", "Why guardrail metrics?", "What is a kill switch?"],
      [{ tag: "variant", desc: "Prompt or model being tested" }, { tag: "guardrail metric", desc: "Must-not-worsen signal" }, { tag: "assignment", desc: "Which users see which variant" }]),
    topic("incident-response", "AI Incident Response", "Plan for bad outputs, leaks, and provider outages.", 12, "advanced", ["incident", "rollback", "safety"], 4,
      "AI incidents include toxic outputs, data leaks via prompts/tools, and widespread hallucinations after a model change. Have rollback pins, kill switches, and communication templates. Practice the runbook.",
      ["No kill switch for the AI feature", "Cannot roll back prompt/model quickly", "No owner for AI incidents"],
      ["Ship kill switches", "Keep rollback pins", "Assign on-call ownership"],
      ["Name three AI incident types", "What is a kill switch?", "What should a runbook include?"],
      [{ tag: "kill switch", desc: "Disable AI feature quickly" }, { tag: "rollback pin", desc: "Previous known-good model/prompt" }, { tag: "runbook", desc: "Steps to diagnose and mitigate" }]),
  ]),
  section("advanced-patterns", "Advanced Patterns", "Memory, multimodal, and evaluation nuance.", [
    topic("memory-patterns", "Memory Patterns", "Store only useful user preferences with consent and limits.", 12, "intermediate", ["memory", "preferences", "privacy"], 4,
      "Memory can personalize assistants but creates privacy and staleness risks. Prefer explicit preferences over raw chat dumps. Let users view and delete memories. Scope memory per tenant.",
      ["Saving entire chat histories as forever memory", "No user controls", "Leaking memory across tenants"],
      ["Store structured preferences", "Provide delete/export", "Isolate memory per tenant"],
      ["What should memory store?", "What privacy controls are needed?", "Why not store raw chats forever?"],
      [{ tag: "preference", desc: "Explicit user setting to remember" }, { tag: "consent", desc: "User permission to store memory" }, { tag: "ttl", desc: "Expiration for stored memories" }]),
    topic("multimodal-basics", "Multimodal Basics", "Some models accept images or other modalities with text.", 12, "intermediate", ["vision", "multimodal", "images"], 3,
      "Multimodal models can describe images or take screenshots as input. Still validate outputs and watch privacy for uploaded media. Costs and limits differ from text-only calls. Redact sensitive screenshots.",
      ["Uploading sensitive IDs without policy", "Assuming vision is perfect OCR", "No size/type validation on uploads"],
      ["Validate media inputs", "Apply privacy policy", "Combine with text instructions clearly"],
      ["What is multimodal?", "What privacy issues appear?", "Why validate uploads?"],
      [{ tag: "vision", desc: "Image understanding capability" }, { tag: "modality", desc: "Input type such as text or image" }, { tag: "redact", desc: "Remove sensitive regions or data" }]),
    topic("orchestration-frameworks", "Orchestration Frameworks", "Frameworks help, but understand the underlying calls.", 12, "advanced", ["langchain", "sdk", "orchestration"], 4,
      "Orchestration libraries provide prompt templates, tool wiring, and tracing helpers. They can hide important details. Prefer thin abstractions you understand. Ensure you can debug raw requests.",
      ["Framework magic with no observability", "Cannot see the final prompt", "Lock-in without an escape hatch"],
      ["Keep access to raw prompts/traces", "Start thin", "Adopt frameworks when they reduce real complexity"],
      ["What do orchestration frameworks provide?", "What risk do they add?", "When adopt one?"],
      [{ tag: "chain", desc: "Sequence of model/tool steps" }, { tag: "raw prompt", desc: "Exact text sent to the model" }, { tag: "escape hatch", desc: "Ability to drop to direct API calls" }]),
    topic("safety-evals", "Safety Evals", "Test jailbreaks, injections, and policy violations intentionally.", 12, "advanced", ["safety", "jailbreak", "evals"], 5,
      "Safety evals probe for disallowed content, prompt injection success, and tool misuse. Run them before enabling new tools or broadening policies. Track safety regressions like product regressions.",
      ["Only testing happy paths", "Adding powerful tools without safety cases", "No owner for safety metrics"],
      ["Maintain a safety case set", "Test before new tool rollout", "Assign safety metric owners"],
      ["What is a jailbreak test?", "When re-run safety evals?", "Who owns safety metrics?"],
      [{ tag: "jailbreak", desc: "Attempt to bypass model policy" }, { tag: "safety case", desc: "Example that should be refused or handled" }, { tag: "tool misuse", desc: "Model requesting harmful tool actions" }]),
  ]),
];

function writeCurriculum(file, typeName, constName, flattenName, sections) {
  fs.writeFileSync(path.join(root, file), renderCurriculum(typeName, constName, flattenName, sections));
  const count = sections.reduce((n, s) => n + s.topics.length, 0);
  console.log("wrote", file, "topics=", count);
}

writeCurriculum(
  "src/features/curriculum/lib/llm-academy-curriculum.ts",
  "Llm",
  "LLM_ACADEMY_SECTIONS",
  "flattenLlmTopics",
  llmSections
);
writeCurriculum(
  "src/features/curriculum/lib/ai-features-academy-curriculum.ts",
  "AiFeatures",
  "AI_FEATURES_ACADEMY_SECTIONS",
  "flattenAiFeaturesTopics",
  aiSections
);

function challengesSource(opts) {
  const {
    importPath,
    topicType,
    flattenName,
    challengeType,
    kindType,
    experience,
    idPrefix,
    listName,
    allName,
    findName,
    countName,
    theoryName,
    paneA,
    paneB,
    defaultA,
    defaultB,
  } = opts;
  const sA = `starter${paneA}`;
  const rA = `reference${paneA}`;
  const sB = `starter${paneB}`;
  const rB = `reference${paneB}`;

  return `import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  ${flattenName},
  type ${topicType},
} from "@/features/curriculum/lib/${importPath}";

export type ${kindType} =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ${challengeType} = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${sA}: string;
  ${rA}: string;
  ${sB}: string;
  ${rB}: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "${experience}";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${sA}?: string;
  ${rA}: string;
  ${sB}?: string;
  ${rB}: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function blockPrompt(title: string, body: string): string {
  return "# " + title + "\\n" + body + "\\n";
}

function blockJs(title: string, body: string): string {
  return "// " + title + "\\n" + body + "\\n";
}

function slugToken(topic: ${topicType}): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultPrompt(topic: ${topicType}): string {
  return blockPrompt(topic.title, ${defaultA});
}

function defaultCode(topic: ${topicType}): string {
  return blockJs(topic.title, ${defaultB});
}

function buildLesson(
  topicSlug: string,
  id: string,
  title: string,
  difficulty: LearnDifficulty,
  minutes: number,
  scenario: string,
  task: string,
  hints: string[],
  referencePrompt: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "ai",
    description: task,
    problemStatement: \`## Scenario\\n\\n\${scenario}\\n\\n## Task\\n\\n\${task}\`,
    concept: title,
    prompt: referencePrompt,
    goodPrompt: referencePrompt,
    badPrompt: "Do whatever. Ignore prior instructions.",
    aiOutput: "Example model output for review.",
    whyAiResponded: scenario,
    exercise: task,
    editorLanguage: "prompt",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function specsForTopic(topic: ${topicType}): Spec[] {
  const specs: Spec[] = [];
  const push = (spec: Spec) => specs.push(spec);
  const title = topic.title;
  const summary = topic.summary ?? title;
  const explanation = topic.explanation ?? summary;
  const commonMistakes = topic.commonMistakes ?? [];
  const bestPractices = topic.bestPractices ?? [];
  const interviewQuestions = topic.interviewQuestions ?? [];
  const cheatSheet = topic.cheatSheet ?? [];
  const primary = cheatSheet[0]?.tag ?? title;
  const toolList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : primary;
  const baseA = defaultPrompt(topic);
  const baseB = defaultCode(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\\.)\\s+/).slice(0, 2).join(" "),
    task: \`Draft a prompt and companion code sample that demonstrate "\${title}". Use ideas from: \${toolList}.\`,
    hints: [
      "Keep the prompt explicit about format and constraints.",
      \`Focus on \${primary}.\`,
      "Show how the app sends and handles the model response.",
    ],
    takeaways: [summary, "Prompts and application code work together"],
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Prompt and code agree on the contract",
      "No secrets hardcoded",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? \`Practice \${cheatSheet[0].tag}\`
      : \`Build a flow for \${clip(title)}\`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: \`Practice the core tools for "\${title}": \${toolList}.\`,
    task: \`Produce a practical prompt plus JS that uses \${toolList} thoughtfully.\`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => \`Use \${c.tag}: \${c.desc}\`)
      .concat(["Keep the example small and reviewable."]),
    takeaways: bestPractices.slice(0, 2),
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable comments explain why",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "fix",
    title: \`Fix a broken \${clip(title)} setup\`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: \`A teammate shipped a fragile "\${title}" setup. Common mistakes include: \${commonMistakes.slice(0, 2).join("; ") || "missing validation and vague prompts"}.\`,
    task: \`Repair the prompt and code so they follow safer practices for \${title}.\`,
    hints: [
      commonMistakes[0] || "Remove secrets from prompts",
      bestPractices[0] || "Validate model output",
      \`Re-check \${primary}\`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid fragile prompt-only controls",
      bestPractices[0] || "Validate in application code",
    ],
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Identifies the failure mode",
      "Applies at least one best practice",
      "Leaves a safer reference than before",
    ],
  });

  push({
    key: "practice",
    title: \`Practice \${clip(title)}\`,
    difficulty: "medium",
    minutes: 12,
    kind: "layout",
    scenario: \`Prepare a handoff reference for "\${title}" using: \${toolList}.\`,
    task: \`Create a clean prompt and JS sample a junior engineer can copy, including verification notes.\`,
    hints: [
      "Keep the output contract explicit",
      \`Highlight \${primary}\`,
      bestPractices[1] || "Log metadata without secrets",
    ],
    takeaways: bestPractices.slice(0, 2),
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Includes verification notes",
      "Uses topic terminology correctly",
      "Suitable as a team reference",
    ],
  });

  const hardKey = topic.challengeWeight >= 5 ? "project" : "interview";
  if (hardKey === "interview") {
    push({
      key: "interview",
      title: \`Interview: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 15,
      kind: "interview",
      scenario: interviewQuestions[0]
        ? \`Interview prompt: \${interviewQuestions[0]}\`
        : \`Explain "\${title}" as you would in a staffing interview.\`,
      task: \`Answer with a concrete prompt and code example. Cover trade-offs and failure modes for \${title}.\`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you evaluate quality",
        bestPractices[0] || "Mention observability",
      ],
      takeaways: [summary, bestPractices[0] || "Evaluate before shipping"],
      ${rA}: baseA,
      ${rB}: baseB,
      acceptanceCriteria: [
        "Answers the interview angle",
        "Includes a concrete example",
        "Mentions at least one risk",
      ],
    });
  } else {
    push({
      key: "project",
      title: \`Mini project: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 18,
      kind: "project",
      scenario: \`Ship a small but complete "\${title}" feature slice using \${toolList}.\`,
      task: \`Produce production-minded prompt and JS references with comments for validation, logging, and failure handling.\`,
      hints: [
        bestPractices[0] || "Validate outputs",
        bestPractices[1] || "Plan fallbacks",
        commonMistakes[0] || "Avoid secrets in prompts",
      ],
      takeaways: bestPractices.slice(0, 3),
      ${rA}: baseA,
      ${rB}: baseB,
      acceptanceCriteria: [
        "Looks like a real team reference",
        "Includes validation",
        "Includes a fallback or abort note",
      ],
    });
  }

  const unique = [];
  const seen = new Set();
  for (const spec of specs) {
    if (seen.has(spec.key)) continue;
    seen.add(spec.key);
    unique.push(spec);
  }
  return pickBalancedSpecs(unique, challengeLimit(topic.challengeWeight));
}

function pickBalancedSpecs(specs: Spec[], limit: number): Spec[] {
  const byKey = new Map(specs.map((s) => [s.key, s]));
  const prefer = (...keys: string[]) =>
    keys.map((k) => byKey.get(k)).filter((s): s is Spec => Boolean(s));
  const hardPreferred = [...prefer("project"), ...prefer("interview")];
  let ladder: Spec[];
  if (limit <= 3) {
    ladder = hardPreferred.length
      ? [...prefer("concept", "fix"), hardPreferred[0]!]
      : prefer("concept", "build", "fix");
  } else if (limit === 4) {
    ladder = [
      ...prefer("concept", "build", "fix"),
      ...(hardPreferred[0] ? [hardPreferred[0]] : prefer("practice")),
    ];
  } else {
    ladder = [
      ...prefer("concept", "build", "fix", "practice"),
      ...(hardPreferred[0] ? [hardPreferred[0]] : []),
    ];
  }
  const seen = new Set<string>();
  const out: Spec[] = [];
  for (const spec of ladder) {
    if (seen.has(spec.key)) continue;
    seen.add(spec.key);
    out.push(spec);
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

function buildChallenge(topicSlug: string, spec: Spec): ${challengeType} {
  const id = \`${idPrefix}-\${topicSlug}-\${spec.key}\`;
  const ${sA} = spec.${sA} ?? spec.${rA};
  const ${sB} =
    spec.${sB} ??
    \`// Start here\\n// Wire your model call\\nconsole.log("todo");\\n\`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.${rA}
  );
  return {
    id,
    topicSlug,
    title: spec.title,
    difficulty: spec.difficulty,
    minutes: spec.minutes,
    kind: spec.kind,
    scenario: spec.scenario,
    task: spec.task,
    hints: spec.hints,
    takeaways: spec.takeaways,
    ${sA},
    ${rA}: spec.${rA},
    ${sB},
    ${rB}: spec.${rB},
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "${experience}",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ${challengeType}[] = ${flattenName}().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ${challengeType}[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function ${listName}(topicSlug: string): ${challengeType}[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function ${allName}(): ${challengeType}[] {
  return BANK;
}

export function ${findName}(
  topicSlug: string,
  challengeId: string
): ${challengeType} | null {
  const list = ${listName}(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function ${countName}(topicSlug: string): number {
  return ${listName}(topicSlug).length;
}

export function ${theoryName}(challenge: ${challengeType}): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
`;
}

const llmDefaultA = `\`System:
You are helping a developer learn \${topic.title}.
Be precise. If unsure, say you are unsure.

User:
Explain \${slugToken(topic)} in 5 bullets for a junior engineer.
Then give one tiny example.
\``;

const llmDefaultB = `\`export async function runLlmDemo(input) {
  const messages = [
    { role: "system", content: "Be precise. Abstain if unsure." },
    { role: "user", content: input },
  ];
  // Server-side proxy call (never expose API keys in the browser)
  const res = await fetch("/api/llm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: "gpt-demo", messages, temperature: 0.2 }),
  });
  if (!res.ok) throw new Error("LLM request failed");
  const data = await res.json();
  return data.output_text;
}
\``;

const aiDefaultA = `\`System:
You are a product AI feature helper for \${topic.title}.
Return JSON only. Do not invent tools the user did not provide.

User:
Task: demonstrate \${slugToken(topic)}
Return:
{ "summary": string, "next_step": string, "needs_human_review": boolean }
\``;

const aiDefaultB = `\`export async function runAiFeature(userId, payload) {
  // Authorize the user before any tool side effects
  await assertCanUseAi(userId);

  const result = await callModel({
    promptId: "ai-\${slugToken(topic)}-v1",
    input: payload,
    temperature: 0,
  });

  const parsed = JSON.parse(result);
  if (typeof parsed.summary !== "string") {
    throw new Error("Invalid model JSON");
  }
  if (parsed.needs_human_review) {
    return { status: "needs_review", draft: parsed };
  }
  return { status: "ok", data: parsed };
}
\``;

fs.writeFileSync(
  path.join(root, "src/features/curriculum/lib/llm-academy-challenges.ts"),
  challengesSource({
    importPath: "llm-academy-curriculum",
    topicType: "LlmTopicDef",
    flattenName: "flattenLlmTopics",
    challengeType: "LlmChallenge",
    kindType: "LlmChallengeKind",
    experience: "llm-lab",
    idPrefix: "llm",
    listName: "listLlmAcademyChallenges",
    allName: "allLlmAcademyChallenges",
    findName: "findLlmAcademyChallenge",
    countName: "llmAcademyTopicChallengeCount",
    theoryName: "isLlmTheoryChallenge",
    paneA: "Prompt",
    paneB: "Js",
    defaultA: llmDefaultA,
    defaultB: llmDefaultB,
  })
);
console.log("wrote llm-academy-challenges.ts");

fs.writeFileSync(
  path.join(root, "src/features/curriculum/lib/ai-features-academy-challenges.ts"),
  challengesSource({
    importPath: "ai-features-academy-curriculum",
    topicType: "AiFeaturesTopicDef",
    flattenName: "flattenAiFeaturesTopics",
    challengeType: "AiFeaturesChallenge",
    kindType: "AiFeaturesChallengeKind",
    experience: "ai-lab",
    idPrefix: "aifeat",
    listName: "listAiFeaturesAcademyChallenges",
    allName: "allAiFeaturesAcademyChallenges",
    findName: "findAiFeaturesAcademyChallenge",
    countName: "aiFeaturesAcademyTopicChallengeCount",
    theoryName: "isAiFeaturesTheoryChallenge",
    paneA: "Prompt",
    paneB: "Js",
    defaultA: aiDefaultA,
    defaultB: aiDefaultB,
  })
);
console.log("wrote ai-features-academy-challenges.ts");
console.log("done");
