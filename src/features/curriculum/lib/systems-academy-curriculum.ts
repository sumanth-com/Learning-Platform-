export type SystemsDifficulty = "beginner" | "intermediate" | "advanced";

export type SystemsTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: SystemsDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type SystemsSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: SystemsTopicDef[];
};

export const SYSTEMS_ACADEMY_SECTIONS: SystemsSectionDef[] = [
  {
    "slug": "system-design-basics",
    "title": "System Design Basics",
    "description": "Structure design interviews with requirements, APIs, and trade-offs.",
    "topics": [
      {
        "slug": "design-interview-overview",
        "title": "Design Interview Overview",
        "summary": "System design interviews evaluate scoping, architecture judgment, and communication.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "system-design",
          "scoping",
          "trade-offs"
        ],
        "challengeWeight": 4,
        "explanation": "A design interview is an open-ended collaboration. You clarify goals, propose an architecture, deepen critical paths, and discuss trade-offs. There is rarely one right diagram. Strong candidates drive the conversation with structure.",
        "a11yNotes": [],
        "commonMistakes": [
          "Drawing boxes with no requirements",
          "Jumping to microservices immediately",
          "Ignoring bottlenecks"
        ],
        "bestPractices": [
          "Start with requirements",
          "Propose a simple core design",
          "Deepen the riskiest parts"
        ],
        "interviewQuestions": [
          "What are interviewers evaluating?",
          "Why start simple?",
          "What does deepen mean?"
        ],
        "cheatSheet": [
          {
            "tag": "requirements",
            "desc": "Functional and non-functional goals"
          },
          {
            "tag": "core design",
            "desc": "Simple architecture that could work"
          },
          {
            "tag": "deep dive",
            "desc": "Detailed discussion of a risky area"
          }
        ]
      },
      {
        "slug": "functional-vs-nonfunctional",
        "title": "Functional vs Non-Functional",
        "summary": "Separate what the system does from how well it must do it.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "functional",
          "latency",
          "availability"
        ],
        "challengeWeight": 4,
        "explanation": "Functional requirements are features. Non-functional requirements include latency, availability, consistency, and cost. Ask for rough scale: QPS, storage, and read/write mix. These numbers drive design choices.",
        "a11yNotes": [],
        "commonMistakes": [
          "No scale assumptions",
          "Treating every system as needing global consistency",
          "Ignoring cost"
        ],
        "bestPractices": [
          "List functional goals",
          "Ask for NFRs and scale",
          "Use numbers to justify choices"
        ],
        "interviewQuestions": [
          "Give examples of NFRs",
          "Why ask for QPS?",
          "How do numbers change design?"
        ],
        "cheatSheet": [
          {
            "tag": "QPS",
            "desc": "Queries per second estimate"
          },
          {
            "tag": "availability",
            "desc": "Uptime target for the service"
          },
          {
            "tag": "latency",
            "desc": "Response time goals"
          }
        ]
      },
      {
        "slug": "api-and-data-model",
        "title": "API and Data Model",
        "summary": "Define interfaces and core entities before diving into infrastructure.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "api",
          "entities",
          "schema"
        ],
        "challengeWeight": 4,
        "explanation": "Sketch key endpoints or events and the main entities. This anchors the design and reveals access patterns. Keep the first model simple. Note which queries must be fast.",
        "a11yNotes": [],
        "commonMistakes": [
          "Infrastructure first with no API",
          "Over-normalized models too early",
          "No idea which queries matter"
        ],
        "bestPractices": [
          "Draft core APIs",
          "List entities and access patterns",
          "Mark hot queries"
        ],
        "interviewQuestions": [
          "Why define APIs early?",
          "What is an access pattern?",
          "What is a hot query?"
        ],
        "cheatSheet": [
          {
            "tag": "endpoint",
            "desc": "API operation clients call"
          },
          {
            "tag": "entity",
            "desc": "Core noun stored by the system"
          },
          {
            "tag": "access pattern",
            "desc": "How data is read and written"
          }
        ]
      },
      {
        "slug": "high-level-design",
        "title": "High-Level Design",
        "summary": "Propose clients, services, storage, and major data flows.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "architecture",
          "services",
          "storage"
        ],
        "challengeWeight": 5,
        "explanation": "A high-level design names major components and how requests flow. Start with a modular monolith or few services unless scale demands more. Show read/write paths. Call out caches, queues, and external dependencies.",
        "a11yNotes": [],
        "commonMistakes": [
          "Premature microservices",
          "Missing the write path",
          "No failure discussion"
        ],
        "bestPractices": [
          "Draw the request path",
          "Start simple",
          "Name critical dependencies"
        ],
        "interviewQuestions": [
          "What belongs in an HLD?",
          "When split services?",
          "Why show read and write paths?"
        ],
        "cheatSheet": [
          {
            "tag": "HLD",
            "desc": "High-level design diagram"
          },
          {
            "tag": "read path",
            "desc": "How queries are served"
          },
          {
            "tag": "write path",
            "desc": "How updates are persisted"
          }
        ]
      }
    ]
  },
  {
    "slug": "building-blocks",
    "title": "Building Blocks",
    "description": "Caches, queues, databases, and load balancing trade-offs.",
    "topics": [
      {
        "slug": "caching",
        "title": "Caching",
        "summary": "Caches reduce load and latency but introduce invalidation complexity.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "cache",
          "ttl",
          "invalidation"
        ],
        "challengeWeight": 4,
        "explanation": "Use caches for read-heavy hot data. Choose TTL, write-through, or invalidate-on-write based on freshness needs. Discuss stampede risks. Measure hit rate goals.",
        "a11yNotes": [],
        "commonMistakes": [
          "Caching without an invalidation story",
          "Caching user-specific sensitive data carelessly",
          "Assuming cache always hits"
        ],
        "bestPractices": [
          "State what is cached",
          "Explain invalidation",
          "Mention failure if cache is down"
        ],
        "interviewQuestions": [
          "When add a cache?",
          "What is invalidation?",
          "What is a stampede?"
        ],
        "cheatSheet": [
          {
            "tag": "TTL",
            "desc": "Time-to-live before expiry"
          },
          {
            "tag": "hit rate",
            "desc": "Share of reads served by cache"
          },
          {
            "tag": "invalidation",
            "desc": "Removing stale cached entries"
          }
        ]
      },
      {
        "slug": "queues-async",
        "title": "Queues and Async",
        "summary": "Queues absorb spikes and decouple producers from consumers.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "queue",
          "async",
          "backpressure"
        ],
        "challengeWeight": 4,
        "explanation": "Asynchronous processing helps uploads, notifications, and fan-out work. Discuss at-least-once delivery, idempotency, and dead-letter queues. Not everything should be async if the user needs an immediate answer.",
        "a11yNotes": [],
        "commonMistakes": [
          "Making user-critical reads async without a status model",
          "No idempotency",
          "Infinite retries without backoff"
        ],
        "bestPractices": [
          "Use queues for spike absorption",
          "Design idempotent consumers",
          "Plan dead letters"
        ],
        "interviewQuestions": [
          "When use a queue?",
          "What is idempotency?",
          "What is a dead-letter queue?"
        ],
        "cheatSheet": [
          {
            "tag": "at-least-once",
            "desc": "Messages may be delivered more than once"
          },
          {
            "tag": "idempotent",
            "desc": "Safe to process duplicates"
          },
          {
            "tag": "DLQ",
            "desc": "Dead-letter queue for failed messages"
          }
        ]
      },
      {
        "slug": "sql-vs-nosql",
        "title": "SQL vs NoSQL",
        "summary": "Choose storage based on access patterns and consistency needs.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "sql",
          "nosql",
          "consistency"
        ],
        "challengeWeight": 4,
        "explanation": "Relational databases fit relational data and strong transactions. NoSQL options can help specific access patterns and scale, with different consistency trade-offs. In interviews, justify from queries and consistency, not hype.",
        "a11yNotes": [],
        "commonMistakes": [
          "Defaulting to NoSQL for resume points",
          "Ignoring transactions when they matter",
          "No backup/migration thought"
        ],
        "bestPractices": [
          "Start from access patterns",
          "Prefer boring defaults",
          "Call out consistency needs"
        ],
        "interviewQuestions": [
          "When prefer SQL?",
          "When consider NoSQL?",
          "What consistency questions matter?"
        ],
        "cheatSheet": [
          {
            "tag": "transaction",
            "desc": "Atomic multi-row update needs"
          },
          {
            "tag": "access pattern",
            "desc": "Primary query shapes"
          },
          {
            "tag": "consistency",
            "desc": "How up-to-date reads must be"
          }
        ]
      },
      {
        "slug": "load-balancing",
        "title": "Load Balancing",
        "summary": "Balancers distribute traffic and enable rolling deploys.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "load-balancer",
          "health",
          "tls"
        ],
        "challengeWeight": 3,
        "explanation": "Load balancers spread requests across instances and often terminate TLS. Discuss health checks and sticky sessions sparingly. They are foundational for horizontal scale.",
        "a11yNotes": [],
        "commonMistakes": [
          "Sticky sessions as a default without need",
          "No health checks",
          "Single instance pretending to be highly available"
        ],
        "bestPractices": [
          "Put a balancer in front of app tiers",
          "Use health checks",
          "Avoid unnecessary session affinity"
        ],
        "interviewQuestions": [
          "What does a load balancer do?",
          "Why health checks?",
          "When are sticky sessions needed?"
        ],
        "cheatSheet": [
          {
            "tag": "health check",
            "desc": "Probe that removes bad instances"
          },
          {
            "tag": "horizontal scale",
            "desc": "Add more instances"
          },
          {
            "tag": "TLS terminate",
            "desc": "Decrypt HTTPS at the edge/balancer"
          }
        ]
      }
    ]
  },
  {
    "slug": "reliability-scale",
    "title": "Reliability and Scale",
    "description": "Talk through failure, consistency, and growth.",
    "topics": [
      {
        "slug": "single-points-of-failure",
        "title": "Single Points of Failure",
        "summary": "Identify components whose outage takes down the system.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "spof",
          "redundancy",
          "failover"
        ],
        "challengeWeight": 4,
        "explanation": "Call out SPOFs and how you would add redundancy: multiple app instances, replica databases, multi-AZ thinking at a high level. Discuss failover behavior. Perfect HA is expensive; match it to requirements.",
        "a11yNotes": [],
        "commonMistakes": [
          "Ignoring the database as a SPOF",
          "Promising five nines with one region casually",
          "No failover story"
        ],
        "bestPractices": [
          "Name SPOFs explicitly",
          "Add redundancy where required",
          "Describe failover briefly"
        ],
        "interviewQuestions": [
          "What is a SPOF?",
          "How do you mitigate one?",
          "Why match HA to requirements?"
        ],
        "cheatSheet": [
          {
            "tag": "SPOF",
            "desc": "Single point of failure"
          },
          {
            "tag": "redundancy",
            "desc": "Extra capacity to survive loss"
          },
          {
            "tag": "failover",
            "desc": "Switch to a healthy replica/path"
          }
        ]
      },
      {
        "slug": "consistency-availability",
        "title": "Consistency and Availability",
        "summary": "CAP-style trade-offs appear when networks partition.",
        "estimatedMinutes": 14,
        "difficulty": "advanced",
        "keywords": [
          "consistency",
          "availability",
          "partition"
        ],
        "challengeWeight": 5,
        "explanation": "Under partition, systems often trade stricter consistency for availability or vice versa. Explain user-visible effects: stale reads vs errors. Pick a stance for the product scenario. Avoid buzzwords without examples.",
        "a11yNotes": [],
        "commonMistakes": [
          "Saying we will be CAP theorem compliant as a design",
          "No user-visible explanation",
          "Forcing strong consistency everywhere"
        ],
        "bestPractices": [
          "Explain the user impact",
          "Choose per use case",
          "Use examples like feeds vs payments"
        ],
        "interviewQuestions": [
          "What happens during a partition?",
          "Stale read vs error?",
          "When is strong consistency worth it?"
        ],
        "cheatSheet": [
          {
            "tag": "stale read",
            "desc": "Seeing older data temporarily"
          },
          {
            "tag": "strong consistency",
            "desc": "Reads reflect the latest write"
          },
          {
            "tag": "partition",
            "desc": "Network split between nodes"
          }
        ]
      },
      {
        "slug": "rate-limiting",
        "title": "Rate Limiting",
        "summary": "Protect systems from abuse and noisy neighbors.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "rate-limit",
          "throttle",
          "quota"
        ],
        "challengeWeight": 4,
        "explanation": "Rate limits protect availability and cost. Discuss token buckets or fixed windows at a high level, where limits are enforced, and what clients see (429). Include fair use across tenants.",
        "a11yNotes": [],
        "commonMistakes": [
          "No abuse story for public APIs",
          "Limits only in the client",
          "Unclear error behavior"
        ],
        "bestPractices": [
          "Enforce limits server-side",
          "Return clear 429s",
          "Set per-user and global limits"
        ],
        "interviewQuestions": [
          "Why rate limit?",
          "Where enforce?",
          "What does the client observe?"
        ],
        "cheatSheet": [
          {
            "tag": "429",
            "desc": "Too Many Requests response"
          },
          {
            "tag": "token bucket",
            "desc": "Common limiting algorithm"
          },
          {
            "tag": "noisy neighbor",
            "desc": "One client hurting others"
          }
        ]
      },
      {
        "slug": "observability-design",
        "title": "Observability in Design",
        "summary": "Metrics, logs, and traces prove the system is healthy.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "metrics",
          "logs",
          "traces"
        ],
        "challengeWeight": 4,
        "explanation": "Design interviews should mention how you detect pain: latency metrics, error rates, and traces across services. Logs need redaction. Alerts should map to user symptoms. Observability is part of the architecture.",
        "a11yNotes": [],
        "commonMistakes": [
          "No monitoring in the design",
          "Alerting only on CPU",
          "Logging secrets"
        ],
        "bestPractices": [
          "Define golden signals",
          "Plan redaction",
          "Alert on user-facing symptoms"
        ],
        "interviewQuestions": [
          "What golden signals matter?",
          "Why traces?",
          "What should you not log?"
        ],
        "cheatSheet": [
          {
            "tag": "golden signals",
            "desc": "Latency, traffic, errors, saturation"
          },
          {
            "tag": "trace",
            "desc": "Request path across services"
          },
          {
            "tag": "alert",
            "desc": "Notification on symptom thresholds"
          }
        ]
      }
    ]
  },
  {
    "slug": "behavioral",
    "title": "Behavioral Interviews",
    "description": "Tell clear stories with STAR and ownership.",
    "topics": [
      {
        "slug": "star-method",
        "title": "STAR Method",
        "summary": "Structure stories as Situation, Task, Action, Result.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "star",
          "behavioral",
          "stories"
        ],
        "challengeWeight": 4,
        "explanation": "STAR keeps behavioral answers concrete. Focus most time on your actions and measurable results. Prepare stories for conflict, failure, leadership, and ambiguity. Practice out loud with timing.",
        "a11yNotes": [],
        "commonMistakes": [
          "Rambling without a result",
          "We did everything with no personal actions",
          "Stories with no stakes"
        ],
        "bestPractices": [
          "Use STAR",
          "Emphasize your actions",
          "End with a result and learning"
        ],
        "interviewQuestions": [
          "What does STAR stand for?",
          "Where should most time go?",
          "Which stories should you prepare?"
        ],
        "cheatSheet": [
          {
            "tag": "Situation",
            "desc": "Context and stakes"
          },
          {
            "tag": "Action",
            "desc": "What you personally did"
          },
          {
            "tag": "Result",
            "desc": "Outcome and evidence"
          }
        ]
      },
      {
        "slug": "ownership-stories",
        "title": "Ownership Stories",
        "summary": "Show end-to-end responsibility and judgment.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "ownership",
          "leadership",
          "impact"
        ],
        "challengeWeight": 4,
        "explanation": "Ownership stories highlight when you drove an outcome across ambiguity. Mention decisions, trade-offs, and follow-through. Quantify impact when possible. Avoid taking credit for others' work.",
        "a11yNotes": [],
        "commonMistakes": [
          "Vague we language",
          "No decision points",
          "Inflated claims"
        ],
        "bestPractices": [
          "Use I for your actions",
          "Show decisions and trade-offs",
          "Quantify outcomes honestly"
        ],
        "interviewQuestions": [
          "What makes an ownership story strong?",
          "Why say I carefully?",
          "How do you quantify impact?"
        ],
        "cheatSheet": [
          {
            "tag": "decision",
            "desc": "Choice you made under uncertainty"
          },
          {
            "tag": "follow-through",
            "desc": "Seeing work to completion"
          },
          {
            "tag": "impact",
            "desc": "Measured outcome of your work"
          }
        ]
      },
      {
        "slug": "conflict-and-feedback",
        "title": "Conflict and Feedback",
        "summary": "Describe disagreement professionally with learning.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "conflict",
          "feedback",
          "collaboration"
        ],
        "challengeWeight": 4,
        "explanation": "Conflict stories should show listening, data, and respectful disagreement. Avoid villain narratives. Explain how you reached a resolution and what changed afterward. Interviewers probe maturity here.",
        "a11yNotes": [],
        "commonMistakes": [
          "Blaming teammates",
          "No resolution",
          "Pretending conflict never happens"
        ],
        "bestPractices": [
          "State perspectives fairly",
          "Show how you used data/listening",
          "End with resolution and learning"
        ],
        "interviewQuestions": [
          "How do you frame conflict?",
          "What should you avoid?",
          "Why include learning?"
        ],
        "cheatSheet": [
          {
            "tag": "perspective",
            "desc": "Other person's goals and concerns"
          },
          {
            "tag": "resolution",
            "desc": "How the team moved forward"
          },
          {
            "tag": "learning",
            "desc": "What you changed afterward"
          }
        ]
      },
      {
        "slug": "failure-stories",
        "title": "Failure Stories",
        "summary": "Own a real failure, focusing on response and prevention.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "failure",
          "postmortem",
          "growth"
        ],
        "challengeWeight": 4,
        "explanation": "Strong failure stories are specific and blameless toward others while owning your part. Cover detection, mitigation, and prevention. Shallow fake failures hurt credibility. Pick a real one with stakes.",
        "a11yNotes": [],
        "commonMistakes": [
          "Fake tiny failures",
          "No prevention steps",
          "Hiding your responsibility"
        ],
        "bestPractices": [
          "Pick a real failure",
          "Own your part",
          "Describe prevention changes"
        ],
        "interviewQuestions": [
          "What makes a failure story credible?",
          "What is prevention?",
          "Why avoid fake failures?"
        ],
        "cheatSheet": [
          {
            "tag": "mitigation",
            "desc": "Immediate steps to reduce damage"
          },
          {
            "tag": "prevention",
            "desc": "Changes that stop repeats"
          },
          {
            "tag": "ownership",
            "desc": "Clear acceptance of your role"
          }
        ]
      },
      {
        "slug": "why-this-company",
        "title": "Why This Company",
        "summary": "Connect your goals to the company's problems and products.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "motivation",
          "company",
          "fit"
        ],
        "challengeWeight": 3,
        "explanation": "Why-us answers should be specific: product, users, technical challenges, or mission. Tie your experience to how you will help. Avoid generic prestige-only answers. Research enough to be concrete.",
        "a11yNotes": [],
        "commonMistakes": [
          "Generic I love innovation answers",
          "Only talking about compensation",
          "No link to your experience"
        ],
        "bestPractices": [
          "Mention specific products or challenges",
          "Link your skills to their needs",
          "Be honest about growth goals"
        ],
        "interviewQuestions": [
          "What makes a why-us answer strong?",
          "What should you research?",
          "How do you link your background?"
        ],
        "cheatSheet": [
          {
            "tag": "specifics",
            "desc": "Concrete product or problem details"
          },
          {
            "tag": "fit",
            "desc": "Overlap between your skills and their needs"
          },
          {
            "tag": "growth",
            "desc": "What you want to learn there"
          }
        ]
      }
    ]
  },
  {
    "slug": "integration",
    "title": "Putting It Together",
    "description": "Combine design depth with behavioral clarity.",
    "topics": [
      {
        "slug": "deep-dives",
        "title": "Deep Dives",
        "summary": "Pick one risky area and go deep with trade-offs.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "deep-dive",
          "bottleneck",
          "trade-offs"
        ],
        "challengeWeight": 5,
        "explanation": "After the high-level design, propose a deep dive: the hottest read path, the write consistency model, or the notification pipeline. Compare alternatives. Mentions of metrics and failure modes show maturity.",
        "a11yNotes": [],
        "commonMistakes": [
          "Staying shallow the whole time",
          "Deep diving an unimportant box",
          "No alternatives considered"
        ],
        "bestPractices": [
          "Choose a high-risk area",
          "Compare 2-3 options",
          "Include failure and metrics"
        ],
        "interviewQuestions": [
          "How do you choose a deep dive?",
          "What should it include?",
          "Why compare options?"
        ],
        "cheatSheet": [
          {
            "tag": "bottleneck",
            "desc": "Likely limiting component"
          },
          {
            "tag": "alternative",
            "desc": "Other design option considered"
          },
          {
            "tag": "failure mode",
            "desc": "How that component can break"
          }
        ]
      },
      {
        "slug": "back-of-envelope",
        "title": "Back-of-Envelope Estimates",
        "summary": "Rough capacity math justifies sharding, caching, and cost.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "estimation",
          "capacity",
          "qps"
        ],
        "challengeWeight": 4,
        "explanation": "Estimate QPS, storage, and bandwidth with round numbers. Show your assumptions. The goal is judgment, not perfect arithmetic. Use estimates to decide whether a single DB is plausible.",
        "a11yNotes": [],
        "commonMistakes": [
          "Fake precision",
          "No assumptions stated",
          "Estimates that never affect the design"
        ],
        "bestPractices": [
          "State assumptions",
          "Use round numbers",
          "Let estimates drive choices"
        ],
        "interviewQuestions": [
          "Why do envelope math?",
          "What quantities matter?",
          "How precise should you be?"
        ],
        "cheatSheet": [
          {
            "tag": "assumption",
            "desc": "Rounded input you make explicit"
          },
          {
            "tag": "capacity",
            "desc": "Load the system must handle"
          },
          {
            "tag": "justification",
            "desc": "Design choice backed by estimates"
          }
        ]
      },
      {
        "slug": "wrap-up-questions",
        "title": "Wrap-Up Questions",
        "summary": "Ask thoughtful questions that show product and engineering curiosity.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "questions",
          "curiosity",
          "close"
        ],
        "challengeWeight": 3,
        "explanation": "Prepare questions about team workflows, on-call, design review culture, and current technical challenges. Avoid only asking about perks. Good questions leave a strong final impression.",
        "a11yNotes": [],
        "commonMistakes": [
          "No questions at all",
          "Only salary timing questions in the first chat",
          "Generic questions you could ask any company"
        ],
        "bestPractices": [
          "Prepare 3 specific questions",
          "Ask about engineering culture",
          "Tie a question to something discussed"
        ],
        "interviewQuestions": [
          "What questions work well?",
          "What should you avoid?",
          "Why ask about on-call/design review?"
        ],
        "cheatSheet": [
          {
            "tag": "on-call",
            "desc": "How production ownership works"
          },
          {
            "tag": "design review",
            "desc": "How the team critiques architecture"
          },
          {
            "tag": "challenge",
            "desc": "Current hard problem the team faces"
          }
        ]
      },
      {
        "slug": "signal-balance",
        "title": "Signal Balance",
        "summary": "Balance correctness, communication, and collaboration signals.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "signal",
          "collaboration",
          "hire"
        ],
        "challengeWeight": 4,
        "explanation": "Interview loops look for multiple signals: technical depth, clarity, humility, and teamwork. One brilliant silent round rarely wins. Practice recovering politely and incorporating feedback live.",
        "a11yNotes": [],
        "commonMistakes": [
          "Optimizing only for puzzles",
          "Arguing with interviewers",
          "Ignoring collaboration cues"
        ],
        "bestPractices": [
          "Treat interviews as collaboration",
          "Incorporate feedback",
          "Show humility with confidence"
        ],
        "interviewQuestions": [
          "What signals do loops look for?",
          "How do you show collaboration?",
          "What hurts otherwise strong candidates?"
        ],
        "cheatSheet": [
          {
            "tag": "signal",
            "desc": "Evidence of a hiring attribute"
          },
          {
            "tag": "collaboration",
            "desc": "Working with the interviewer"
          },
          {
            "tag": "humility",
            "desc": "Confidence without arrogance"
          }
        ]
      }
    ]
  }
];

export function flattenSystemsTopics(): SystemsTopicDef[] {
  return SYSTEMS_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
