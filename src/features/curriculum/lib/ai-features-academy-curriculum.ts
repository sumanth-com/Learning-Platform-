export type AiFeaturesDifficulty = "beginner" | "intermediate" | "advanced";

export type AiFeaturesTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: AiFeaturesDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type AiFeaturesSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: AiFeaturesTopicDef[];
};

export const AI_FEATURES_ACADEMY_SECTIONS: AiFeaturesSectionDef[] = [
  {
    "slug": "ai-product-basics",
    "title": "AI Product Basics",
    "description": "Where AI features fit in real products.",
    "topics": [
      {
        "slug": "ai-feature-patterns",
        "title": "AI Feature Patterns",
        "summary": "Common patterns include assist, generate, extract, and agentic tools.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "patterns",
          "assist",
          "generate"
        ],
        "challengeWeight": 4,
        "explanation": "Product AI features often draft content, extract structured data, answer questions over docs, or call tools. Pick a pattern before choosing a model. Clear user jobs beat vague 'add AI' goals. Define success metrics up front.",
        "a11yNotes": [],
        "commonMistakes": [
          "Adding a chatbot with no user job",
          "No success metric",
          "Choosing tools before the workflow is clear"
        ],
        "bestPractices": [
          "Start from the user job",
          "Pick a narrow pattern",
          "Define eval metrics first"
        ],
        "interviewQuestions": [
          "Name four AI feature patterns",
          "Why start from the user job?",
          "What metric might you track?"
        ],
        "cheatSheet": [
          {
            "tag": "assist",
            "desc": "Help users draft or edit"
          },
          {
            "tag": "extract",
            "desc": "Turn messy text into structure"
          },
          {
            "tag": "qa-over-docs",
            "desc": "Answer with retrieved knowledge"
          }
        ]
      },
      {
        "slug": "human-in-the-loop",
        "title": "Human in the Loop",
        "summary": "Keep humans reviewing high-impact AI outputs.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "human",
          "review",
          "approval"
        ],
        "challengeWeight": 4,
        "explanation": "Human-in-the-loop designs show drafts for approval before side effects. Confidence and citations help reviewers. For low-risk tasks, lighter review is fine. Match review friction to blast radius.",
        "a11yNotes": [],
        "commonMistakes": [
          "Auto-sending AI emails without review",
          "Same review UX for tiny and huge risks",
          "No way to correct the model output"
        ],
        "bestPractices": [
          "Require approval for irreversible actions",
          "Make edits easy",
          "Scale review to risk"
        ],
        "interviewQuestions": [
          "When is human review required?",
          "What is blast radius?",
          "How do you reduce reviewer friction?"
        ],
        "cheatSheet": [
          {
            "tag": "approval",
            "desc": "Human confirm before side effects"
          },
          {
            "tag": "draft",
            "desc": "AI output pending review"
          },
          {
            "tag": "blast radius",
            "desc": "How much damage a wrong action can cause"
          }
        ]
      },
      {
        "slug": "ux-for-ai",
        "title": "UX for AI",
        "summary": "Show uncertainty, sources, and easy regeneration.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "ux",
          "streaming",
          "regenerate"
        ],
        "challengeWeight": 3,
        "explanation": "Good AI UX streams progress, allows regenerate, shows sources, and explains limits. Empty and error states matter. Avoid pretending the model is a person with private memory unless you designed that.",
        "a11yNotes": [],
        "commonMistakes": [
          "No regenerate control",
          "Hiding that content is AI-generated when policy requires disclosure",
          "Blocking the UI until a long generation finishes with no progress"
        ],
        "bestPractices": [
          "Stream tokens",
          "Offer regenerate and edit",
          "Disclose AI involvement when needed"
        ],
        "interviewQuestions": [
          "What controls help AI UX?",
          "Why show sources?",
          "Why stream?"
        ],
        "cheatSheet": [
          {
            "tag": "regenerate",
            "desc": "Request another completion"
          },
          {
            "tag": "disclosure",
            "desc": "Tell users content is AI-assisted"
          },
          {
            "tag": "progress",
            "desc": "Visible generation status"
          }
        ]
      },
      {
        "slug": "success-metrics",
        "title": "Success Metrics",
        "summary": "Measure task success, not just model scores.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "metrics",
          "product",
          "quality"
        ],
        "challengeWeight": 4,
        "explanation": "Track acceptance rate, edit distance, task completion, latency, cost, and escalation to humans. Offline evals complement online metrics. Optimize the metric that matches the user job.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only watching provider leaderboard scores",
          "No online feedback loop",
          "Optimizing clickbait engagement against user trust"
        ],
        "bestPractices": [
          "Define task-level success",
          "Combine offline and online metrics",
          "Watch cost per successful outcome"
        ],
        "interviewQuestions": [
          "What is a task-level metric?",
          "Offline vs online evals?",
          "Why track cost per success?"
        ],
        "cheatSheet": [
          {
            "tag": "acceptance rate",
            "desc": "How often users keep AI output"
          },
          {
            "tag": "edit distance",
            "desc": "How much users change drafts"
          },
          {
            "tag": "escalation",
            "desc": "Hand-off to human support"
          }
        ]
      }
    ]
  },
  {
    "slug": "tool-use",
    "title": "Tools and Function Calling",
    "description": "Let models call functions under your control.",
    "topics": [
      {
        "slug": "function-calling",
        "title": "Function Calling",
        "summary": "Models can request structured tool calls your server executes.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "tools",
          "functions",
          "json"
        ],
        "challengeWeight": 5,
        "explanation": "Function calling lets the model choose a tool and arguments in a schema. Your server validates, authorizes, executes, and returns results. The model never gets direct production credentials. Keep tool surfaces small and explicit.",
        "a11yNotes": [],
        "commonMistakes": [
          "Letting the model hit arbitrary URLs",
          "No argument validation",
          "Exposing admin tools to all users"
        ],
        "bestPractices": [
          "Validate args with a schema",
          "Authorize every tool call",
          "Return concise tool results"
        ],
        "interviewQuestions": [
          "Who executes the tool?",
          "Why validate arguments?",
          "What should tools return?"
        ],
        "cheatSheet": [
          {
            "tag": "tool call",
            "desc": "Structured request to run a function"
          },
          {
            "tag": "arguments",
            "desc": "JSON parameters for the tool"
          },
          {
            "tag": "tool result",
            "desc": "Data returned to the model"
          }
        ]
      },
      {
        "slug": "tool-schemas",
        "title": "Tool Schemas",
        "summary": "Clear JSON schemas improve tool selection and arguments.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "schema",
          "json",
          "parameters"
        ],
        "challengeWeight": 4,
        "explanation": "Describe tools with names, descriptions, and parameter schemas. Ambiguous descriptions cause wrong tool picks. Prefer enums and tight types. Version tool schemas as the product evolves.",
        "a11yNotes": [],
        "commonMistakes": [
          "Vague tool descriptions",
          "Optional everything with no constraints",
          "Breaking schemas without versioning"
        ],
        "bestPractices": [
          "Write precise tool descriptions",
          "Constrain parameters tightly",
          "Version breaking tool changes"
        ],
        "interviewQuestions": [
          "What makes a good tool description?",
          "Why use enums?",
          "How do you version tools?"
        ],
        "cheatSheet": [
          {
            "tag": "name",
            "desc": "Stable tool identifier"
          },
          {
            "tag": "parameters",
            "desc": "JSON schema for arguments"
          },
          {
            "tag": "enum",
            "desc": "Allowed fixed values"
          }
        ]
      },
      {
        "slug": "tool-authz",
        "title": "Tool Authorization",
        "summary": "Check user permissions before executing side effects.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "authz",
          "permissions",
          "tools"
        ],
        "challengeWeight": 5,
        "explanation": "Even if the model asks to delete a record, your server must enforce authorization. Scope tools to the current user. Log tool invocations for audit. Never trust the model as an auth boundary.",
        "a11yNotes": [],
        "commonMistakes": [
          "Executing any tool the model requests",
          "Shared service account with admin rights for all users",
          "No audit log"
        ],
        "bestPractices": [
          "Authorize as the end user",
          "Least-privilege tool credentials",
          "Audit tool calls"
        ],
        "interviewQuestions": [
          "Why is the model not an auth boundary?",
          "How should credentials be scoped?",
          "What belongs in an audit log?"
        ],
        "cheatSheet": [
          {
            "tag": "authz",
            "desc": "Permission check before side effects"
          },
          {
            "tag": "least privilege",
            "desc": "Minimal access for the tool"
          },
          {
            "tag": "audit",
            "desc": "Record of who did what"
          }
        ]
      },
      {
        "slug": "agent-loops",
        "title": "Agent Loops",
        "summary": "Agents iterate model-tool-model until a stop condition.",
        "estimatedMinutes": 14,
        "difficulty": "advanced",
        "keywords": [
          "agent",
          "loop",
          "stop"
        ],
        "challengeWeight": 5,
        "explanation": "Agent loops let the model call tools repeatedly. Bound the max steps, total tokens, and wall time. Detect loops and stuck states. Prefer deterministic workflows when the path is known.",
        "a11yNotes": [],
        "commonMistakes": [
          "Unbounded loops",
          "No stop conditions",
          "Agents for simple single-tool tasks"
        ],
        "bestPractices": [
          "Cap steps and time",
          "Prefer explicit workflows when possible",
          "Watch for repeated failing tool calls"
        ],
        "interviewQuestions": [
          "What is an agent loop?",
          "What bounds should you set?",
          "When avoid agents?"
        ],
        "cheatSheet": [
          {
            "tag": "max steps",
            "desc": "Hard cap on tool iterations"
          },
          {
            "tag": "stop condition",
            "desc": "Rule that ends the loop"
          },
          {
            "tag": "stuck state",
            "desc": "Repeating failures without progress"
          }
        ]
      }
    ]
  },
  {
    "slug": "rag-products",
    "title": "RAG in Products",
    "description": "Ship document Q&A and knowledge assistants safely.",
    "topics": [
      {
        "slug": "knowledge-assistants",
        "title": "Knowledge Assistants",
        "summary": "Product assistants answer from your docs with citations.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "assistant",
          "docs",
          "rag"
        ],
        "challengeWeight": 4,
        "explanation": "Knowledge assistants retrieve from approved corpora and answer with citations. Scope corpora per tenant. Refresh indexes when docs change. Provide escape hatches to human support.",
        "a11yNotes": [],
        "commonMistakes": [
          "Mixing tenant documents",
          "Stale indexes",
          "No citation UI"
        ],
        "bestPractices": [
          "Isolate tenant corpora",
          "Reindex on publish",
          "Show sources and escalate"
        ],
        "interviewQuestions": [
          "What corpus should an assistant use?",
          "Why tenant isolation?",
          "When escalate to humans?"
        ],
        "cheatSheet": [
          {
            "tag": "corpus",
            "desc": "Document collection available for retrieval"
          },
          {
            "tag": "tenant isolation",
            "desc": "No cross-customer document leakage"
          },
          {
            "tag": "reindex",
            "desc": "Refresh vectors after doc changes"
          }
        ]
      },
      {
        "slug": "query-rewriting",
        "title": "Query Rewriting",
        "summary": "Rewrite user questions into better retrieval queries.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "rewrite",
          "query",
          "retrieval"
        ],
        "challengeWeight": 4,
        "explanation": "Users ask vaguely. A rewrite step can expand acronyms, add product context, or split multi-part questions. Rewrites should be evaluated against retrieval metrics. Keep rewrites transparent in traces.",
        "a11yNotes": [],
        "commonMistakes": [
          "Rewriting away the user's intent",
          "No eval of rewrite quality",
          "Always rewriting even when unnecessary"
        ],
        "bestPractices": [
          "Evaluate rewrite impact on recall",
          "Keep original query in traces",
          "Rewrite only when helpful"
        ],
        "interviewQuestions": [
          "Why rewrite queries?",
          "What risk does rewriting add?",
          "What should traces keep?"
        ],
        "cheatSheet": [
          {
            "tag": "rewrite",
            "desc": "Transform user text into a search query"
          },
          {
            "tag": "multi-query",
            "desc": "Retrieve with several rewritten queries"
          },
          {
            "tag": "intent",
            "desc": "What the user actually wants"
          }
        ]
      },
      {
        "slug": "freshness",
        "title": "Knowledge Freshness",
        "summary": "Stale docs create confident wrong answers.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "freshness",
          "index",
          "sync"
        ],
        "challengeWeight": 3,
        "explanation": "Connect publishing workflows to reindexing. Show document timestamps in citations when useful. For rapidly changing data, prefer tools/APIs over static RAG. Monitor complaints about outdated answers.",
        "a11yNotes": [],
        "commonMistakes": [
          "Manual reindex once a quarter only",
          "No timestamps on sources",
          "Embedding ticket queues that never drain"
        ],
        "bestPractices": [
          "Automate reindex on publish",
          "Prefer live tools for volatile data",
          "Surface source dates"
        ],
        "interviewQuestions": [
          "How do docs go stale?",
          "When prefer tools over RAG?",
          "What UX helps freshness?"
        ],
        "cheatSheet": [
          {
            "tag": "reindex",
            "desc": "Update stored vectors after changes"
          },
          {
            "tag": "source date",
            "desc": "When the document was published"
          },
          {
            "tag": "live tool",
            "desc": "Fetch current data via API"
          }
        ]
      },
      {
        "slug": "eval-rag-features",
        "title": "Evaluating RAG Features",
        "summary": "Score retrieval and answer faithfulness separately.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "eval",
          "faithfulness",
          "rag"
        ],
        "challengeWeight": 4,
        "explanation": "Faithfulness checks whether answers stick to evidence. Answer relevance checks user intent. Retrieval metrics find missing docs. Human review remains important for nuanced domains.",
        "a11yNotes": [],
        "commonMistakes": [
          "One overall thumbs-up only",
          "No faithfulness checks",
          "Ignoring retrieval failures"
        ],
        "bestPractices": [
          "Split retrieval vs generation evals",
          "Measure faithfulness",
          "Sample production traces for review"
        ],
        "interviewQuestions": [
          "What is faithfulness?",
          "Why split evals?",
          "How do humans fit in?"
        ],
        "cheatSheet": [
          {
            "tag": "faithfulness",
            "desc": "Answer supported by evidence"
          },
          {
            "tag": "relevance",
            "desc": "Answer addresses the question"
          },
          {
            "tag": "human review",
            "desc": "Spot-check real traces"
          }
        ]
      }
    ]
  },
  {
    "slug": "integration",
    "title": "Product Integration",
    "description": "Wire AI into backends, queues, and clients.",
    "topics": [
      {
        "slug": "server-side-orchestration",
        "title": "Server-Side Orchestration",
        "summary": "Keep keys, tools, and policy on the server.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "server",
          "proxy",
          "keys"
        ],
        "challengeWeight": 4,
        "explanation": "Browsers should call your backend, which calls the model provider. The server applies auth, rate limits, prompt templates, and tool execution. This protects secrets and centralizes policy.",
        "a11yNotes": [],
        "commonMistakes": [
          "Shipping provider keys to the client",
          "Duplicating prompts in every client app",
          "No server-side rate limiting"
        ],
        "bestPractices": [
          "Proxy all provider calls",
          "Centralize prompts and policy",
          "Rate limit per user"
        ],
        "interviewQuestions": [
          "Why proxy model calls?",
          "What runs on the server?",
          "What risk do client keys create?"
        ],
        "cheatSheet": [
          {
            "tag": "proxy",
            "desc": "Backend that calls the model provider"
          },
          {
            "tag": "rate limit",
            "desc": "Cap requests per user or IP"
          },
          {
            "tag": "policy layer",
            "desc": "Server enforcement of product rules"
          }
        ]
      },
      {
        "slug": "async-generation",
        "title": "Async Generation",
        "summary": "Long jobs belong on queues with status APIs.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "queue",
          "async",
          "job"
        ],
        "challengeWeight": 4,
        "explanation": "Long generations or batch extractions should run asynchronously. Store job status, support cancel, and notify on completion. Synchronous HTTP requests time out and frustrate users.",
        "a11yNotes": [],
        "commonMistakes": [
          "Blocking HTTP for multi-minute jobs",
          "No job status endpoint",
          "Losing results on worker crash without persistence"
        ],
        "bestPractices": [
          "Enqueue long work",
          "Persist job state",
          "Support cancel and retry"
        ],
        "interviewQuestions": [
          "When use async generation?",
          "What should a job record store?",
          "Why support cancel?"
        ],
        "cheatSheet": [
          {
            "tag": "job",
            "desc": "Tracked async generation unit"
          },
          {
            "tag": "queue",
            "desc": "Buffer of pending work"
          },
          {
            "tag": "status",
            "desc": "queued|running|succeeded|failed"
          }
        ]
      },
      {
        "slug": "rate-limits-and-quotas",
        "title": "Rate Limits and Quotas",
        "summary": "Protect providers and your bill from abuse.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "quota",
          "rate-limit",
          "abuse"
        ],
        "challengeWeight": 4,
        "explanation": "Apply per-user and per-tenant quotas. Back off on provider 429s. Differentiate free and paid tiers. Clear error messages beat silent failures. Track cost attribution per feature.",
        "a11yNotes": [],
        "commonMistakes": [
          "One global API key with no user quotas",
          "Retrying 429s aggressively without backoff",
          "No cost attribution"
        ],
        "bestPractices": [
          "Quota by user/tenant",
          "Exponential backoff on 429",
          "Attribute cost to features"
        ],
        "interviewQuestions": [
          "Why quota per user?",
          "How handle 429?",
          "What is cost attribution?"
        ],
        "cheatSheet": [
          {
            "tag": "429",
            "desc": "Provider rate limit response"
          },
          {
            "tag": "backoff",
            "desc": "Wait longer between retries"
          },
          {
            "tag": "quota",
            "desc": "Allowed usage over a window"
          }
        ]
      },
      {
        "slug": "prompt-templates",
        "title": "Prompt Templates",
        "summary": "Templates keep product copy consistent and testable.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "template",
          "variables",
          "prompts"
        ],
        "challengeWeight": 3,
        "explanation": "Store prompts as templates with typed variables. Escape user input. Unit-test rendered prompts. Templates make localization and experimentation easier.",
        "a11yNotes": [],
        "commonMistakes": [
          "String-concatenating untrusted input unsafely into instructions",
          "Copy-pasting prompt variants everywhere",
          "No tests for rendered prompts"
        ],
        "bestPractices": [
          "Use templates with explicit variables",
          "Escape/boundary user input",
          "Test rendered outputs"
        ],
        "interviewQuestions": [
          "What is a prompt template?",
          "Why escape user input?",
          "How do templates help experiments?"
        ],
        "cheatSheet": [
          {
            "tag": "template",
            "desc": "Prompt with placeholders"
          },
          {
            "tag": "variables",
            "desc": "Typed inputs filled at runtime"
          },
          {
            "tag": "boundary",
            "desc": "Delimiters around untrusted text"
          }
        ]
      }
    ]
  },
  {
    "slug": "evaluation-ops",
    "title": "Evaluation and Ops",
    "description": "Ship AI changes with confidence.",
    "topics": [
      {
        "slug": "offline-evals",
        "title": "Offline Evals",
        "summary": "Score prompts and models on a fixed dataset before release.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "offline",
          "evals",
          "dataset"
        ],
        "challengeWeight": 4,
        "explanation": "Offline evals run against golden sets in CI. Include edge cases and safety cases. Automate scoring where possible and keep human review for subjective quality. Gate risky prompt changes on eval results.",
        "a11yNotes": [],
        "commonMistakes": [
          "No dataset",
          "Only happy-path examples",
          "Changing prompts without CI evals"
        ],
        "bestPractices": [
          "Grow a golden set continuously",
          "Run evals in CI",
          "Include safety cases"
        ],
        "interviewQuestions": [
          "What is an offline eval?",
          "What belongs in a golden set?",
          "How do evals gate releases?"
        ],
        "cheatSheet": [
          {
            "tag": "golden set",
            "desc": "Versioned evaluation examples"
          },
          {
            "tag": "scorer",
            "desc": "Automatic or human grading function"
          },
          {
            "tag": "gate",
            "desc": "Release blocked unless evals pass"
          }
        ]
      },
      {
        "slug": "online-feedback",
        "title": "Online Feedback",
        "summary": "Collect thumbs, edits, and outcomes from real users.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "feedback",
          "thumbs",
          "online"
        ],
        "challengeWeight": 4,
        "explanation": "Online signals catch issues offline sets miss. Capture thumbs-down reasons, edits, and task success. Sample traces for review. Close the loop into dataset updates.",
        "a11yNotes": [],
        "commonMistakes": [
          "No feedback controls",
          "Collecting feedback but never reviewing it",
          "Optimizing only for positive thumbs"
        ],
        "bestPractices": [
          "Capture structured feedback",
          "Review negatives weekly",
          "Feed failures into golden sets"
        ],
        "interviewQuestions": [
          "What online signals help?",
          "How do you close the loop?",
          "Why review thumbs-down?"
        ],
        "cheatSheet": [
          {
            "tag": "thumbs",
            "desc": "Simple satisfaction signal"
          },
          {
            "tag": "edit signal",
            "desc": "User corrections to AI output"
          },
          {
            "tag": "trace review",
            "desc": "Human inspection of production calls"
          }
        ]
      },
      {
        "slug": "experimentation",
        "title": "Experimentation",
        "summary": "A/B test prompts and models carefully.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "experiment",
          "ab-test",
          "prompt"
        ],
        "challengeWeight": 4,
        "explanation": "Run controlled experiments on prompt or model variants. Watch quality, latency, and cost. Stop harmful experiments quickly. Keep assignment sticky per user when needed.",
        "a11yNotes": [],
        "commonMistakes": [
          "Shipping two prompts randomly with no metrics",
          "No kill switch",
          "Changing too many variables at once"
        ],
        "bestPractices": [
          "One primary metric",
          "Guardrail metrics for safety/latency/cost",
          "Easy rollback"
        ],
        "interviewQuestions": [
          "What should an AI experiment measure?",
          "Why guardrail metrics?",
          "What is a kill switch?"
        ],
        "cheatSheet": [
          {
            "tag": "variant",
            "desc": "Prompt or model being tested"
          },
          {
            "tag": "guardrail metric",
            "desc": "Must-not-worsen signal"
          },
          {
            "tag": "assignment",
            "desc": "Which users see which variant"
          }
        ]
      },
      {
        "slug": "incident-response",
        "title": "AI Incident Response",
        "summary": "Plan for bad outputs, leaks, and provider outages.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "incident",
          "rollback",
          "safety"
        ],
        "challengeWeight": 4,
        "explanation": "AI incidents include toxic outputs, data leaks via prompts/tools, and widespread hallucinations after a model change. Have rollback pins, kill switches, and communication templates. Practice the runbook.",
        "a11yNotes": [],
        "commonMistakes": [
          "No kill switch for the AI feature",
          "Cannot roll back prompt/model quickly",
          "No owner for AI incidents"
        ],
        "bestPractices": [
          "Ship kill switches",
          "Keep rollback pins",
          "Assign on-call ownership"
        ],
        "interviewQuestions": [
          "Name three AI incident types",
          "What is a kill switch?",
          "What should a runbook include?"
        ],
        "cheatSheet": [
          {
            "tag": "kill switch",
            "desc": "Disable AI feature quickly"
          },
          {
            "tag": "rollback pin",
            "desc": "Previous known-good model/prompt"
          },
          {
            "tag": "runbook",
            "desc": "Steps to diagnose and mitigate"
          }
        ]
      }
    ]
  },
  {
    "slug": "advanced-patterns",
    "title": "Advanced Patterns",
    "description": "Memory, multimodal, and evaluation nuance.",
    "topics": [
      {
        "slug": "memory-patterns",
        "title": "Memory Patterns",
        "summary": "Store only useful user preferences with consent and limits.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "memory",
          "preferences",
          "privacy"
        ],
        "challengeWeight": 4,
        "explanation": "Memory can personalize assistants but creates privacy and staleness risks. Prefer explicit preferences over raw chat dumps. Let users view and delete memories. Scope memory per tenant.",
        "a11yNotes": [],
        "commonMistakes": [
          "Saving entire chat histories as forever memory",
          "No user controls",
          "Leaking memory across tenants"
        ],
        "bestPractices": [
          "Store structured preferences",
          "Provide delete/export",
          "Isolate memory per tenant"
        ],
        "interviewQuestions": [
          "What should memory store?",
          "What privacy controls are needed?",
          "Why not store raw chats forever?"
        ],
        "cheatSheet": [
          {
            "tag": "preference",
            "desc": "Explicit user setting to remember"
          },
          {
            "tag": "consent",
            "desc": "User permission to store memory"
          },
          {
            "tag": "ttl",
            "desc": "Expiration for stored memories"
          }
        ]
      },
      {
        "slug": "multimodal-basics",
        "title": "Multimodal Basics",
        "summary": "Some models accept images or other modalities with text.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "vision",
          "multimodal",
          "images"
        ],
        "challengeWeight": 3,
        "explanation": "Multimodal models can describe images or take screenshots as input. Still validate outputs and watch privacy for uploaded media. Costs and limits differ from text-only calls. Redact sensitive screenshots.",
        "a11yNotes": [],
        "commonMistakes": [
          "Uploading sensitive IDs without policy",
          "Assuming vision is perfect OCR",
          "No size/type validation on uploads"
        ],
        "bestPractices": [
          "Validate media inputs",
          "Apply privacy policy",
          "Combine with text instructions clearly"
        ],
        "interviewQuestions": [
          "What is multimodal?",
          "What privacy issues appear?",
          "Why validate uploads?"
        ],
        "cheatSheet": [
          {
            "tag": "vision",
            "desc": "Image understanding capability"
          },
          {
            "tag": "modality",
            "desc": "Input type such as text or image"
          },
          {
            "tag": "redact",
            "desc": "Remove sensitive regions or data"
          }
        ]
      },
      {
        "slug": "orchestration-frameworks",
        "title": "Orchestration Frameworks",
        "summary": "Frameworks help, but understand the underlying calls.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "langchain",
          "sdk",
          "orchestration"
        ],
        "challengeWeight": 4,
        "explanation": "Orchestration libraries provide prompt templates, tool wiring, and tracing helpers. They can hide important details. Prefer thin abstractions you understand. Ensure you can debug raw requests.",
        "a11yNotes": [],
        "commonMistakes": [
          "Framework magic with no observability",
          "Cannot see the final prompt",
          "Lock-in without an escape hatch"
        ],
        "bestPractices": [
          "Keep access to raw prompts/traces",
          "Start thin",
          "Adopt frameworks when they reduce real complexity"
        ],
        "interviewQuestions": [
          "What do orchestration frameworks provide?",
          "What risk do they add?",
          "When adopt one?"
        ],
        "cheatSheet": [
          {
            "tag": "chain",
            "desc": "Sequence of model/tool steps"
          },
          {
            "tag": "raw prompt",
            "desc": "Exact text sent to the model"
          },
          {
            "tag": "escape hatch",
            "desc": "Ability to drop to direct API calls"
          }
        ]
      },
      {
        "slug": "safety-evals",
        "title": "Safety Evals",
        "summary": "Test jailbreaks, injections, and policy violations intentionally.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "safety",
          "jailbreak",
          "evals"
        ],
        "challengeWeight": 5,
        "explanation": "Safety evals probe for disallowed content, prompt injection success, and tool misuse. Run them before enabling new tools or broadening policies. Track safety regressions like product regressions.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only testing happy paths",
          "Adding powerful tools without safety cases",
          "No owner for safety metrics"
        ],
        "bestPractices": [
          "Maintain a safety case set",
          "Test before new tool rollout",
          "Assign safety metric owners"
        ],
        "interviewQuestions": [
          "What is a jailbreak test?",
          "When re-run safety evals?",
          "Who owns safety metrics?"
        ],
        "cheatSheet": [
          {
            "tag": "jailbreak",
            "desc": "Attempt to bypass model policy"
          },
          {
            "tag": "safety case",
            "desc": "Example that should be refused or handled"
          },
          {
            "tag": "tool misuse",
            "desc": "Model requesting harmful tool actions"
          }
        ]
      }
    ]
  }
];

export function flattenAiFeaturesTopics(): AiFeaturesTopicDef[] {
  return AI_FEATURES_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
