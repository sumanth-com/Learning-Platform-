export type LlmDifficulty = "beginner" | "intermediate" | "advanced";

export type LlmTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: LlmDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type LlmSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: LlmTopicDef[];
};

export const LLM_ACADEMY_SECTIONS: LlmSectionDef[] = [
  {
    "slug": "llm-foundations",
    "title": "LLM Foundations",
    "description": "What LLMs are and how they generate text.",
    "topics": [
      {
        "slug": "what-is-an-llm",
        "title": "What is an LLM?",
        "summary": "Large language models predict tokens to generate text from prompts.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "llm",
          "tokens",
          "model"
        ],
        "challengeWeight": 4,
        "explanation": "A large language model (LLM) is a neural network trained to predict the next token in a sequence. Given a prompt, it samples likely continuations. Modern chat models are instruction-tuned so they follow user requests. Understanding tokens, context windows, and sampling helps you design reliable product features.",
        "a11yNotes": [],
        "commonMistakes": [
          "Treating the model as a database with guaranteed facts",
          "Ignoring token limits and truncating important context",
          "Assuming identical behavior across model versions"
        ],
        "bestPractices": [
          "Design for probabilistic outputs",
          "Measure quality with evals",
          "Keep prompts and model versions under version control"
        ],
        "interviewQuestions": [
          "What does an LLM predict?",
          "What is a token?",
          "Why are outputs non-deterministic?"
        ],
        "cheatSheet": [
          {
            "tag": "token",
            "desc": "Unit of text the model reads and writes"
          },
          {
            "tag": "context window",
            "desc": "Max tokens the model can consider"
          },
          {
            "tag": "completion",
            "desc": "Model-generated continuation"
          }
        ]
      },
      {
        "slug": "tokens-and-context",
        "title": "Tokens and Context Windows",
        "summary": "Prompts and responses consume a limited context budget.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "tokens",
          "context",
          "window"
        ],
        "challengeWeight": 4,
        "explanation": "Everything the model sees counts toward the context window: system instructions, history, retrieved docs, and the reply. Long chats can push older turns out of context. Token counting matters for cost and quality. Summarize or retrieve selectively instead of stuffing everything.",
        "a11yNotes": [],
        "commonMistakes": [
          "Pasting huge documents into every request",
          "Forgetting system prompts also use tokens",
          "No strategy when history grows"
        ],
        "bestPractices": [
          "Budget tokens intentionally",
          "Summarize long histories",
          "Retrieve only relevant chunks"
        ],
        "interviewQuestions": [
          "What counts toward context?",
          "What happens when context overflows?",
          "How do you manage long chats?"
        ],
        "cheatSheet": [
          {
            "tag": "context budget",
            "desc": "Tokens available for input and output"
          },
          {
            "tag": "truncation",
            "desc": "Dropping content that exceeds limits"
          },
          {
            "tag": "history",
            "desc": "Prior messages included in the prompt"
          }
        ]
      },
      {
        "slug": "prompts-vs-training",
        "title": "Prompts vs Training",
        "summary": "Prompting steers a frozen model; training changes weights.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "prompt",
          "finetune",
          "weights"
        ],
        "challengeWeight": 3,
        "explanation": "Prompting and retrieval change behavior without updating model weights. Fine-tuning and continued pretraining change weights and need data, compute, and evaluation. Most product features start with prompting, tools, and RAG before considering fine-tunes.",
        "a11yNotes": [],
        "commonMistakes": [
          "Fine-tuning for every small instruction change",
          "Expecting prompts to permanently teach new private facts",
          "No evals when changing either prompts or weights"
        ],
        "bestPractices": [
          "Prefer prompts and RAG first",
          "Fine-tune for style or domain patterns with data",
          "Evaluate before and after changes"
        ],
        "interviewQuestions": [
          "Prompting vs fine-tuning?",
          "When is RAG better than fine-tuning?",
          "What does training change?"
        ],
        "cheatSheet": [
          {
            "tag": "prompting",
            "desc": "Steer behavior with instructions and examples"
          },
          {
            "tag": "fine-tune",
            "desc": "Update weights on task-specific data"
          },
          {
            "tag": "RAG",
            "desc": "Retrieve external knowledge into the prompt"
          }
        ]
      },
      {
        "slug": "sampling-basics",
        "title": "Sampling Basics",
        "summary": "Temperature and related settings control randomness.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "temperature",
          "sampling",
          "top-p"
        ],
        "challengeWeight": 4,
        "explanation": "Sampling parameters influence how the model chooses the next token. Lower temperature makes outputs more deterministic; higher temperature increases variety. For structured extraction, prefer low temperature. For brainstorming, higher temperature can help. Always pair settings with evaluation.",
        "a11yNotes": [],
        "commonMistakes": [
          "High temperature for JSON extraction",
          "Changing many sampling knobs without measuring",
          "Assuming temperature equals creativity quality"
        ],
        "bestPractices": [
          "Use low temperature for deterministic tasks",
          "Document sampling settings per feature",
          "Evaluate output stability"
        ],
        "interviewQuestions": [
          "What does temperature do?",
          "When use low temperature?",
          "Why measure stability?"
        ],
        "cheatSheet": [
          {
            "tag": "temperature",
            "desc": "Controls randomness in token sampling"
          },
          {
            "tag": "top-p",
            "desc": "Nucleus sampling probability mass"
          },
          {
            "tag": "deterministic",
            "desc": "More repeatable outputs at low randomness"
          }
        ]
      }
    ]
  },
  {
    "slug": "prompting",
    "title": "Prompting Craft",
    "description": "Instructions, roles, examples, and structured outputs.",
    "topics": [
      {
        "slug": "system-and-user-roles",
        "title": "System and User Roles",
        "summary": "Separate durable instructions from user messages.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "system",
          "user",
          "roles"
        ],
        "challengeWeight": 4,
        "explanation": "System messages hold durable product rules. User messages carry the request. Assistant messages are prior model replies. Clear role separation makes prompts easier to maintain and safer to update. Do not put untrusted user text into system instructions without boundaries.",
        "a11yNotes": [],
        "commonMistakes": [
          "Stuffing everything into one user blob",
          "Letting users overwrite system policy",
          "No separation between product rules and task input"
        ],
        "bestPractices": [
          "Keep policies in system prompts",
          "Treat user content as untrusted",
          "Version system prompts like code"
        ],
        "interviewQuestions": [
          "What belongs in the system prompt?",
          "Why separate roles?",
          "How can users abuse prompts?"
        ],
        "cheatSheet": [
          {
            "tag": "system",
            "desc": "Durable instructions for the assistant"
          },
          {
            "tag": "user",
            "desc": "End-user or application request"
          },
          {
            "tag": "assistant",
            "desc": "Prior model responses in history"
          }
        ]
      },
      {
        "slug": "few-shot-examples",
        "title": "Few-Shot Examples",
        "summary": "Examples teach format and judgment better than abstract rules alone.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "few-shot",
          "examples",
          "format"
        ],
        "challengeWeight": 4,
        "explanation": "Few-shot prompting shows input/output pairs the model should imitate. Good examples cover edge cases and the exact schema you want. Too many or conflicting examples confuse the model. Prefer short, high-signal demonstrations.",
        "a11yNotes": [],
        "commonMistakes": [
          "Contradictory examples",
          "Examples that do not match the target schema",
          "Huge example banks that waste context"
        ],
        "bestPractices": [
          "Show 1-3 strong examples",
          "Match the production output format",
          "Include one tricky edge case"
        ],
        "interviewQuestions": [
          "What is few-shot prompting?",
          "How many examples are enough?",
          "What makes a good example?"
        ],
        "cheatSheet": [
          {
            "tag": "few-shot",
            "desc": "Learning from in-prompt examples"
          },
          {
            "tag": "demo",
            "desc": "Example input and ideal output"
          },
          {
            "tag": "schema",
            "desc": "Expected structure of the answer"
          }
        ]
      },
      {
        "slug": "structured-output",
        "title": "Structured Output",
        "summary": "Ask for JSON or schemas when downstream code must parse reliably.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "json",
          "schema",
          "structured"
        ],
        "challengeWeight": 5,
        "explanation": "Structured outputs reduce brittle free-text parsing. Specify the schema, require valid JSON, and validate on the server. Some APIs offer JSON modes or tool/function calling. Always validate; never trust model JSON blindly.",
        "a11yNotes": [],
        "commonMistakes": [
          "Parsing free text with fragile regex",
          "No schema validation after the model responds",
          "Asking for JSON without showing the shape"
        ],
        "bestPractices": [
          "Provide an explicit schema",
          "Validate with a parser",
          "Retry or repair on invalid JSON"
        ],
        "interviewQuestions": [
          "Why prefer structured outputs?",
          "What should you validate?",
          "How do you recover from invalid JSON?"
        ],
        "cheatSheet": [
          {
            "tag": "JSON mode",
            "desc": "API setting biased toward JSON replies"
          },
          {
            "tag": "schema",
            "desc": "Fields and types you expect"
          },
          {
            "tag": "validate",
            "desc": "Parse and check before use"
          }
        ]
      },
      {
        "slug": "prompt-injection",
        "title": "Prompt Injection Basics",
        "summary": "Untrusted content can try to override your instructions.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "injection",
          "security",
          "untrusted"
        ],
        "challengeWeight": 5,
        "explanation": "Prompt injection happens when attacker-controlled text tries to change model behavior, exfiltrate secrets, or ignore policies. Separate trusted instructions from untrusted documents. Do not give the model tools that can act irreversibly without checks. Treat model output as untrusted too.",
        "a11yNotes": [],
        "commonMistakes": [
          "Putting secrets in the prompt",
          "Letting retrieved web text redefine system rules",
          "Executing tool calls without authorization checks"
        ],
        "bestPractices": [
          "Isolate untrusted content",
          "Least-privilege tools",
          "Validate actions server-side"
        ],
        "interviewQuestions": [
          "What is prompt injection?",
          "How do retrieved docs create risk?",
          "What should never sit in prompts?"
        ],
        "cheatSheet": [
          {
            "tag": "injection",
            "desc": "Malicious instructions inside content"
          },
          {
            "tag": "untrusted",
            "desc": "Data you did not fully control"
          },
          {
            "tag": "tool risk",
            "desc": "Dangerous actions the model might request"
          }
        ]
      },
      {
        "slug": "eval-driven-prompts",
        "title": "Eval-Driven Prompting",
        "summary": "Improve prompts with a fixed evaluation set, not vibes alone.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "evals",
          "dataset",
          "quality"
        ],
        "challengeWeight": 4,
        "explanation": "Prompt iteration without evals is guesswork. Build a small golden set of inputs and expected traits. Score changes before shipping. Track regressions when models or prompts update. Evals turn prompting into engineering.",
        "a11yNotes": [],
        "commonMistakes": [
          "Changing prompts based on one anecdotal failure",
          "No golden set",
          "Shipping prompt edits without comparison"
        ],
        "bestPractices": [
          "Maintain a golden evaluation set",
          "Compare prompt versions quantitatively",
          "Include failure cases intentionally"
        ],
        "interviewQuestions": [
          "What is an eval set?",
          "Why not rely on vibes?",
          "When re-run evals?"
        ],
        "cheatSheet": [
          {
            "tag": "golden set",
            "desc": "Curated examples for scoring quality"
          },
          {
            "tag": "regression",
            "desc": "Quality drop after a change"
          },
          {
            "tag": "score",
            "desc": "Metric used to compare prompt versions"
          }
        ]
      }
    ]
  },
  {
    "slug": "model-apis",
    "title": "Model APIs",
    "description": "Calling providers, messages, streaming, and errors.",
    "topics": [
      {
        "slug": "chat-completions-api",
        "title": "Chat Completions API",
        "summary": "Most apps send message arrays and receive assistant content.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "api",
          "messages",
          "chat"
        ],
        "challengeWeight": 4,
        "explanation": "Chat APIs accept a list of role-tagged messages and return an assistant message. You configure model, temperature, and max tokens. Handle rate limits, timeouts, and partial failures. Keep API keys on the server.",
        "a11yNotes": [],
        "commonMistakes": [
          "Calling providers directly from the browser with secret keys",
          "No timeout or retry policy",
          "Ignoring finish reasons"
        ],
        "bestPractices": [
          "Proxy model calls through your backend",
          "Set timeouts and retries carefully",
          "Log request metadata without logging secrets"
        ],
        "interviewQuestions": [
          "What does a messages array contain?",
          "Where should API keys live?",
          "What errors should you handle?"
        ],
        "cheatSheet": [
          {
            "tag": "messages",
            "desc": "Role-tagged conversation turns"
          },
          {
            "tag": "model",
            "desc": "Which LLM variant to call"
          },
          {
            "tag": "max_tokens",
            "desc": "Cap on generated output length"
          }
        ]
      },
      {
        "slug": "streaming-responses",
        "title": "Streaming Responses",
        "summary": "Streams return tokens incrementally for faster UX.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "stream",
          "sse",
          "ux"
        ],
        "challengeWeight": 4,
        "explanation": "Streaming sends partial tokens as they are generated so users see progress sooner. Your client must concatenate chunks and handle abort. Streaming complicates retries and moderation mid-flight. Offer cancel for long answers.",
        "a11yNotes": [],
        "commonMistakes": [
          "Buffering the whole stream before showing anything",
          "No abort/cancel",
          "Retrying streams without idempotency thinking"
        ],
        "bestPractices": [
          "Render tokens as they arrive",
          "Support cancel",
          "Finalize only when the stream completes"
        ],
        "interviewQuestions": [
          "Why stream?",
          "What must the client concatenate?",
          "What is harder with streaming?"
        ],
        "cheatSheet": [
          {
            "tag": "SSE",
            "desc": "Server-sent events often used for streams"
          },
          {
            "tag": "chunk",
            "desc": "Partial token payload"
          },
          {
            "tag": "abort",
            "desc": "Cancel an in-flight generation"
          }
        ]
      },
      {
        "slug": "embeddings-intro",
        "title": "Embeddings Intro",
        "summary": "Embeddings map text to vectors for similarity search.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "embeddings",
          "vectors",
          "similarity"
        ],
        "challengeWeight": 4,
        "explanation": "Embedding models turn text into numeric vectors so similar meanings are close in vector space. They power semantic search and RAG. Embedding quality depends on the model and chunking strategy. Store vectors in a vector database or extension.",
        "a11yNotes": [],
        "commonMistakes": [
          "Using keyword search when semantic search is needed without measuring",
          "Huge chunks that mix many topics",
          "Comparing vectors from different embedding models"
        ],
        "bestPractices": [
          "Chunk by semantic units",
          "Keep embedding model consistent",
          "Evaluate retrieval hit rate"
        ],
        "interviewQuestions": [
          "What is an embedding?",
          "What are embeddings used for?",
          "Why does chunking matter?"
        ],
        "cheatSheet": [
          {
            "tag": "vector",
            "desc": "Numeric representation of text meaning"
          },
          {
            "tag": "similarity",
            "desc": "Distance or score between vectors"
          },
          {
            "tag": "chunk",
            "desc": "Segment of a document embedded together"
          }
        ]
      },
      {
        "slug": "cost-and-latency",
        "title": "Cost and Latency",
        "summary": "Token usage and model choice drive spend and speed.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "cost",
          "latency",
          "tokens"
        ],
        "challengeWeight": 4,
        "explanation": "Larger models are often slower and costlier. Cache repeated prompts, shrink context, and route simple tasks to smaller models. Measure p95 latency and cost per successful task, not just per call.",
        "a11yNotes": [],
        "commonMistakes": [
          "Always using the largest model",
          "No caching of identical requests",
          "Optimizing cost without tracking quality"
        ],
        "bestPractices": [
          "Route by task difficulty",
          "Cache where safe",
          "Track cost and quality together"
        ],
        "interviewQuestions": [
          "What drives LLM cost?",
          "How can you reduce latency?",
          "Why route between models?"
        ],
        "cheatSheet": [
          {
            "tag": "tokens in/out",
            "desc": "Billed input and output units"
          },
          {
            "tag": "routing",
            "desc": "Choosing model by task"
          },
          {
            "tag": "cache",
            "desc": "Reuse prior results for identical asks"
          }
        ]
      }
    ]
  },
  {
    "slug": "reliability",
    "title": "Reliability and Safety",
    "description": "Hallucinations, grounding, moderation, and guardrails.",
    "topics": [
      {
        "slug": "hallucinations",
        "title": "Hallucinations",
        "summary": "Models can produce fluent falsehoods with high confidence.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "hallucination",
          "grounding",
          "facts"
        ],
        "challengeWeight": 4,
        "explanation": "Hallucinations are plausible but incorrect statements. Mitigate with grounding, tool use, citations, and refusal when unsure. Never present unchecked model text as authoritative for high-stakes domains without verification.",
        "a11yNotes": [],
        "commonMistakes": [
          "Trusting the model for exact legal or medical facts",
          "No citation or source requirement",
          "Punishing 'I do not know' answers"
        ],
        "bestPractices": [
          "Require sources when possible",
          "Allow abstaining",
          "Verify critical claims externally"
        ],
        "interviewQuestions": [
          "What is a hallucination?",
          "How do you reduce them?",
          "When should the model abstain?"
        ],
        "cheatSheet": [
          {
            "tag": "hallucination",
            "desc": "Fluent but incorrect generation"
          },
          {
            "tag": "grounding",
            "desc": "Tying answers to retrieved evidence"
          },
          {
            "tag": "abstain",
            "desc": "Refuse when uncertain"
          }
        ]
      },
      {
        "slug": "grounding-with-context",
        "title": "Grounding with Context",
        "summary": "Provide relevant evidence and instruct the model to use it.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "grounding",
          "context",
          "cite"
        ],
        "challengeWeight": 4,
        "explanation": "Grounding means supplying documents or tool results and telling the model to answer from them. Ask for citations to chunk IDs. If evidence is missing, the model should say so. Grounding quality depends on retrieval quality.",
        "a11yNotes": [],
        "commonMistakes": [
          "Providing irrelevant context",
          "Allowing answers outside provided evidence silently",
          "No citation format"
        ],
        "bestPractices": [
          "Pass only relevant chunks",
          "Require citations",
          "Fail closed when evidence is absent"
        ],
        "interviewQuestions": [
          "What is grounding?",
          "Why cite chunk IDs?",
          "What if retrieval misses?"
        ],
        "cheatSheet": [
          {
            "tag": "evidence",
            "desc": "Documents or tool results in context"
          },
          {
            "tag": "citation",
            "desc": "Pointer back to a source chunk"
          },
          {
            "tag": "fail closed",
            "desc": "Do not invent when evidence is missing"
          }
        ]
      },
      {
        "slug": "moderation-and-policy",
        "title": "Moderation and Policy",
        "summary": "Filter unsafe inputs and outputs according to product policy.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "moderation",
          "policy",
          "safety"
        ],
        "challengeWeight": 4,
        "explanation": "Moderation systems classify harmful content. Combine provider tools with your own policy layer. Decide what to block, warn, or allow. Log safety events for review. Policies should be explicit in system prompts and enforced in code.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only relying on the model to police itself",
          "No logging of blocked events",
          "Unclear product policy"
        ],
        "bestPractices": [
          "Enforce policy in code paths",
          "Use moderation APIs where appropriate",
          "Review borderline cases"
        ],
        "interviewQuestions": [
          "Why not rely only on the model?",
          "What should you log?",
          "Where is policy enforced?"
        ],
        "cheatSheet": [
          {
            "tag": "moderation",
            "desc": "Classify unsafe content"
          },
          {
            "tag": "policy",
            "desc": "Product rules for allowed behavior"
          },
          {
            "tag": "block",
            "desc": "Refuse to process or show content"
          }
        ]
      },
      {
        "slug": "guardrails",
        "title": "Guardrails",
        "summary": "Validate inputs and outputs before they affect users or systems.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "guardrails",
          "validate",
          "schema"
        ],
        "challengeWeight": 4,
        "explanation": "Guardrails include allowlists, schema checks, length limits, and tool permission checks. They sit around the model, not only inside the prompt. Defense in depth beats a single clever instruction.",
        "a11yNotes": [],
        "commonMistakes": [
          "Prompt-only safety with no validation",
          "Unlimited output length into UI",
          "Tools callable without authz"
        ],
        "bestPractices": [
          "Validate structured outputs",
          "Constrain tools by role",
          "Limit output size and destination"
        ],
        "interviewQuestions": [
          "What is a guardrail?",
          "Why validate outside the prompt?",
          "Give an example guardrail"
        ],
        "cheatSheet": [
          {
            "tag": "allowlist",
            "desc": "Only permit known-safe values"
          },
          {
            "tag": "schema check",
            "desc": "Reject invalid structures"
          },
          {
            "tag": "authz",
            "desc": "Authorization before tool side effects"
          }
        ]
      }
    ]
  },
  {
    "slug": "rag-basics",
    "title": "RAG Basics",
    "description": "Retrieve evidence, then generate grounded answers.",
    "topics": [
      {
        "slug": "what-is-rag",
        "title": "What is RAG?",
        "summary": "Retrieval-Augmented Generation fetches relevant docs before answering.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "rag",
          "retrieve",
          "generate"
        ],
        "challengeWeight": 4,
        "explanation": "RAG retrieves relevant chunks from a knowledge base and adds them to the prompt so the model can answer with fresher or private information. It reduces some hallucinations when retrieval is good. RAG systems need chunking, indexing, retrieval, and citation design.",
        "a11yNotes": [],
        "commonMistakes": [
          "Calling RAG a guarantee of correctness",
          "Retrieving nothing useful but still answering confidently",
          "No evaluation of retrieval quality"
        ],
        "bestPractices": [
          "Evaluate retrieval separately from generation",
          "Cite sources",
          "Keep the knowledge base fresh"
        ],
        "interviewQuestions": [
          "What problem does RAG solve?",
          "What are the main RAG stages?",
          "Why evaluate retrieval?"
        ],
        "cheatSheet": [
          {
            "tag": "retrieve",
            "desc": "Find relevant chunks"
          },
          {
            "tag": "augment",
            "desc": "Insert chunks into the prompt"
          },
          {
            "tag": "generate",
            "desc": "Produce the grounded answer"
          }
        ]
      },
      {
        "slug": "chunking-strategy",
        "title": "Chunking Strategy",
        "summary": "How you split documents affects retrieval quality.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "chunking",
          "overlap",
          "docs"
        ],
        "challengeWeight": 4,
        "explanation": "Chunks should be coherent units with enough context to stand alone. Overlap can preserve boundary meaning. Too large chunks reduce precision; too small chunks lose context. Tune with retrieval metrics.",
        "a11yNotes": [],
        "commonMistakes": [
          "One chunk per entire PDF",
          "Tiny fragments without headings",
          "No metadata on chunks"
        ],
        "bestPractices": [
          "Chunk by sections with light overlap",
          "Store metadata like title and URL",
          "Measure recall@k"
        ],
        "interviewQuestions": [
          "What is chunk overlap for?",
          "What happens if chunks are too large?",
          "What metadata helps?"
        ],
        "cheatSheet": [
          {
            "tag": "chunk size",
            "desc": "Token or character length per segment"
          },
          {
            "tag": "overlap",
            "desc": "Shared tokens between adjacent chunks"
          },
          {
            "tag": "metadata",
            "desc": "Source fields stored with each chunk"
          }
        ]
      },
      {
        "slug": "retrieval-quality",
        "title": "Retrieval Quality",
        "summary": "If retrieval fails, generation cannot be well grounded.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "retrieval",
          "recall",
          "precision"
        ],
        "challengeWeight": 4,
        "explanation": "Measure whether the right chunks appear in the top results. Hybrid search can combine keywords and vectors. Rerankers improve precision. Bad queries need rewriting. Generation evals alone hide retrieval bugs.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only reading final answer quality",
          "No hybrid search when names/IDs matter",
          "Never inspecting retrieved chunks"
        ],
        "bestPractices": [
          "Log retrieved chunks in staging",
          "Track recall@k",
          "Add hybrid or rerank when needed"
        ],
        "interviewQuestions": [
          "Why inspect retrieved chunks?",
          "What is recall@k?",
          "When use hybrid search?"
        ],
        "cheatSheet": [
          {
            "tag": "recall@k",
            "desc": "Share of needed docs found in top k"
          },
          {
            "tag": "hybrid",
            "desc": "Keyword plus vector retrieval"
          },
          {
            "tag": "rerank",
            "desc": "Reorder candidates for precision"
          }
        ]
      },
      {
        "slug": "citations",
        "title": "Citations",
        "summary": "Citations let users verify grounded answers.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "citations",
          "sources",
          "ux"
        ],
        "challengeWeight": 3,
        "explanation": "Ask the model to cite chunk IDs or URLs used. Render citations in the UI. If a claim lacks a citation, treat it as unverified. Citations build trust and help debug wrong answers.",
        "a11yNotes": [],
        "commonMistakes": [
          "Fake citations invented by the model",
          "No UI for sources",
          "Allowing answers with empty citations in grounded mode"
        ],
        "bestPractices": [
          "Require citations for grounded answers",
          "Validate citation IDs exist",
          "Show sources in the product UI"
        ],
        "interviewQuestions": [
          "Why cite sources?",
          "How do fake citations appear?",
          "How should the UI present them?"
        ],
        "cheatSheet": [
          {
            "tag": "chunk id",
            "desc": "Identifier for a retrieved segment"
          },
          {
            "tag": "source UI",
            "desc": "User-visible references"
          },
          {
            "tag": "unverified",
            "desc": "Claim without valid citation"
          }
        ]
      }
    ]
  },
  {
    "slug": "production-llm",
    "title": "Production LLM Habits",
    "description": "Versioning, observability, and graceful degradation.",
    "topics": [
      {
        "slug": "prompt-versioning",
        "title": "Prompt Versioning",
        "summary": "Treat prompts as versioned product code.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "version",
          "prompt",
          "release"
        ],
        "challengeWeight": 3,
        "explanation": "Store prompts in git or a config service with IDs. Ship prompt changes through review. Tie production traces to prompt versions. Rollback prompts like any other release.",
        "a11yNotes": [],
        "commonMistakes": [
          "Editing prompts only in a dashboard with no history",
          "No link between traces and prompt IDs",
          "Hotfixing prompts without evals"
        ],
        "bestPractices": [
          "Version every prompt",
          "Review prompt PRs",
          "Annotate logs with prompt version"
        ],
        "interviewQuestions": [
          "Why version prompts?",
          "What should a prompt release include?",
          "How do you roll back?"
        ],
        "cheatSheet": [
          {
            "tag": "prompt id",
            "desc": "Stable identifier for a prompt version"
          },
          {
            "tag": "changelog",
            "desc": "Record of prompt edits"
          },
          {
            "tag": "rollback",
            "desc": "Restore previous prompt version"
          }
        ]
      },
      {
        "slug": "tracing-llm-calls",
        "title": "Tracing LLM Calls",
        "summary": "Trace prompts, retrieval, tools, and outputs for debugging.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "trace",
          "observability",
          "logs"
        ],
        "challengeWeight": 4,
        "explanation": "LLM features fail in subtle ways. Traces should capture model, latency, token counts, retrieved chunks, and tool calls without leaking secrets. Sampling helps control volume. Use traces to diagnose regressions after prompt or model changes.",
        "a11yNotes": [],
        "commonMistakes": [
          "Logging raw secrets and PII carelessly",
          "No correlation IDs across retrieval and generation",
          "Only logging final text"
        ],
        "bestPractices": [
          "Redact sensitive fields",
          "Correlate multi-step traces",
          "Capture metadata needed to reproduce issues"
        ],
        "interviewQuestions": [
          "What belongs in an LLM trace?",
          "What must you redact?",
          "Why correlate steps?"
        ],
        "cheatSheet": [
          {
            "tag": "trace",
            "desc": "End-to-end record of an LLM request"
          },
          {
            "tag": "latency",
            "desc": "Time to first token and total time"
          },
          {
            "tag": "redaction",
            "desc": "Remove sensitive values from logs"
          }
        ]
      },
      {
        "slug": "fallbacks",
        "title": "Fallbacks",
        "summary": "Degrade gracefully when models or tools fail.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "fallback",
          "timeout",
          "degrade"
        ],
        "challengeWeight": 4,
        "explanation": "Plan for provider outages, timeouts, and low-quality outputs. Fall back to smaller models, cached answers, or non-AI flows. Show honest UI states. Circuit breakers protect your backend.",
        "a11yNotes": [],
        "commonMistakes": [
          "Spinning forever on provider errors",
          "No non-AI alternative path",
          "Falling back silently to wrong answers"
        ],
        "bestPractices": [
          "Timeouts and circuit breakers",
          "Cached or template fallbacks",
          "Communicate degraded mode to users"
        ],
        "interviewQuestions": [
          "What is a useful fallback?",
          "Why use a circuit breaker?",
          "How should UX show degradation?"
        ],
        "cheatSheet": [
          {
            "tag": "timeout",
            "desc": "Max wait before aborting a call"
          },
          {
            "tag": "circuit breaker",
            "desc": "Temporarily stop calling a failing dependency"
          },
          {
            "tag": "degraded mode",
            "desc": "Reduced functionality when AI is unavailable"
          }
        ]
      },
      {
        "slug": "model-upgrades",
        "title": "Model Upgrades",
        "summary": "New models can regress behavior even when average quality rises.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "upgrade",
          "regression",
          "shadow"
        ],
        "challengeWeight": 4,
        "explanation": "When providers release new models, re-run evals and shadow traffic before switching. Pin model IDs in production. Watch safety and format regressions. Have a rollback pin ready.",
        "a11yNotes": [],
        "commonMistakes": [
          "Switching to latest automatically",
          "No shadow comparison",
          "Assuming higher benchmark scores mean no product regressions"
        ],
        "bestPractices": [
          "Pin model versions",
          "Shadow eval before cutover",
          "Keep rollback pins"
        ],
        "interviewQuestions": [
          "Why pin model IDs?",
          "What is shadow traffic?",
          "What regressions should you watch?"
        ],
        "cheatSheet": [
          {
            "tag": "pin",
            "desc": "Lock a specific model version"
          },
          {
            "tag": "shadow",
            "desc": "Compare new model offline/online without user impact"
          },
          {
            "tag": "cutover",
            "desc": "Switch production traffic to the new model"
          }
        ]
      }
    ]
  }
];

export function flattenLlmTopics(): LlmTopicDef[] {
  return LLM_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
