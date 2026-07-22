export type CapstoneDifficulty = "beginner" | "intermediate" | "advanced";

export type CapstoneTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: CapstoneDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type CapstoneSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: CapstoneTopicDef[];
};

export const CAPSTONE_ACADEMY_SECTIONS: CapstoneSectionDef[] = [
  {
    "slug": "problem-and-users",
    "title": "Problem and Users",
    "description": "Define the problem, users, and success before writing code.",
    "topics": [
      {
        "slug": "capstone-overview",
        "title": "Capstone Overview",
        "summary": "A capstone proves you can scope, build, and ship a real product end to end.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "capstone",
          "portfolio",
          "scope"
        ],
        "challengeWeight": 4,
        "explanation": "A capstone is a portfolio project with intentional scope, architecture, and delivery. It should show product judgment, not only coding tricks. Plan what you will build, what you will cut, and how you will demo it. Treat planning as part of the deliverable.",
        "a11yNotes": [],
        "commonMistakes": [
          "Starting to code with no written scope",
          "Choosing a project too large to finish",
          "No demo story for reviewers"
        ],
        "bestPractices": [
          "Write a one-page brief first",
          "Define a finishable MVP",
          "Plan the demo early"
        ],
        "interviewQuestions": [
          "What makes a strong capstone?",
          "Why plan before coding?",
          "What should a demo prove?"
        ],
        "cheatSheet": [
          {
            "tag": "MVP",
            "desc": "Minimum viable product you can finish"
          },
          {
            "tag": "brief",
            "desc": "One-page project summary"
          },
          {
            "tag": "demo",
            "desc": "Story you will show reviewers"
          }
        ]
      },
      {
        "slug": "problem-statement",
        "title": "Problem Statement",
        "summary": "State the user pain and why your product should exist.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "problem",
          "pain",
          "why"
        ],
        "challengeWeight": 4,
        "explanation": "A problem statement explains who hurts, what fails today, and what better looks like. Avoid solution-first wording. Good statements help you reject unrelated features later. Keep it short enough to remember under pressure.",
        "a11yNotes": [],
        "commonMistakes": [
          "Describing features instead of pain",
          "Problem statements that fit any app",
          "No evidence the problem is real"
        ],
        "bestPractices": [
          "Write who / pain / today / better",
          "Validate with a real example",
          "Revisit the statement when scope creeps"
        ],
        "interviewQuestions": [
          "What belongs in a problem statement?",
          "Why avoid solution-first wording?",
          "How do you validate the problem?"
        ],
        "cheatSheet": [
          {
            "tag": "who",
            "desc": "Primary user or persona"
          },
          {
            "tag": "pain",
            "desc": "Concrete frustration today"
          },
          {
            "tag": "outcome",
            "desc": "Better state after your product"
          }
        ]
      },
      {
        "slug": "user-personas",
        "title": "User Personas",
        "summary": "Personas focus decisions on a primary user, not everyone.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "persona",
          "user",
          "jobs"
        ],
        "challengeWeight": 3,
        "explanation": "A persona captures goals, constraints, and context for a primary user. Capstones usually need one primary persona and maybe one secondary. Jobs-to-be-done language keeps features tied to outcomes. Do not invent five personas you cannot serve.",
        "a11yNotes": [],
        "commonMistakes": [
          "Too many personas",
          "Personas with no jobs or constraints",
          "Designing for yourself only without naming it"
        ],
        "bestPractices": [
          "Pick one primary persona",
          "List jobs and constraints",
          "Use the persona to reject features"
        ],
        "interviewQuestions": [
          "Why one primary persona?",
          "What is a job-to-be-done?",
          "How do personas reduce scope?"
        ],
        "cheatSheet": [
          {
            "tag": "primary persona",
            "desc": "Main user you optimize for"
          },
          {
            "tag": "job",
            "desc": "Outcome the user hires the product for"
          },
          {
            "tag": "constraint",
            "desc": "Time, skill, or device limits"
          }
        ]
      },
      {
        "slug": "success-metrics",
        "title": "Success Metrics",
        "summary": "Define how you will know the capstone worked.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "metrics",
          "success",
          "kpi"
        ],
        "challengeWeight": 4,
        "explanation": "Success metrics can be qualitative for a portfolio project: completed happy path, demo clarity, or time-to-first-value. Pick a few measurable signals. Metrics keep polish focused on what matters for the story you tell.",
        "a11yNotes": [],
        "commonMistakes": [
          "No definition of done",
          "Vanity metrics with no user value",
          "Metrics that require production scale you do not have"
        ],
        "bestPractices": [
          "Choose 2-3 realistic success signals",
          "Tie metrics to the demo",
          "Use metrics to prioritize polish"
        ],
        "interviewQuestions": [
          "What is a realistic capstone metric?",
          "Why avoid vanity metrics?",
          "How do metrics guide polish?"
        ],
        "cheatSheet": [
          {
            "tag": "definition of done",
            "desc": "Clear finish criteria"
          },
          {
            "tag": "happy path",
            "desc": "Core successful user journey"
          },
          {
            "tag": "time-to-value",
            "desc": "How fast a user gets benefit"
          }
        ]
      }
    ]
  },
  {
    "slug": "scope-and-mvp",
    "title": "Scope and MVP",
    "description": "Cut ruthlessly so you can finish and demo.",
    "topics": [
      {
        "slug": "mvp-definition",
        "title": "MVP Definition",
        "summary": "An MVP is the smallest product that proves the core value.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "mvp",
          "scope",
          "cut"
        ],
        "challengeWeight": 4,
        "explanation": "MVP is not a half-broken app. It is a complete thin slice of value. Write must-have versus nice-to-have lists. Schedule cuts before you run out of time. A finished MVP beats an unfinished epic.",
        "a11yNotes": [],
        "commonMistakes": [
          "MVP that still includes every idea",
          "Cutting quality instead of scope",
          "No written must-have list"
        ],
        "bestPractices": [
          "List must-haves explicitly",
          "Cut features before quality",
          "Ship a thin complete slice"
        ],
        "interviewQuestions": [
          "What is an MVP?",
          "Must-have vs nice-to-have?",
          "Why cut features before quality?"
        ],
        "cheatSheet": [
          {
            "tag": "must-have",
            "desc": "Required for the demo story"
          },
          {
            "tag": "nice-to-have",
            "desc": "Deferred if time is short"
          },
          {
            "tag": "thin slice",
            "desc": "End-to-end value with minimal breadth"
          }
        ]
      },
      {
        "slug": "non-goals",
        "title": "Non-Goals",
        "summary": "Non-goals protect focus by naming what you will not build.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "non-goals",
          "focus",
          "scope"
        ],
        "challengeWeight": 3,
        "explanation": "Non-goals are explicit exclusions: no mobile app, no multi-tenant billing, no realtime collaboration. They make trade-offs visible to mentors and teammates. Update non-goals when priorities change.",
        "a11yNotes": [],
        "commonMistakes": [
          "Implicit exclusions nobody wrote down",
          "Non-goals that are actually required",
          "Never revisiting non-goals"
        ],
        "bestPractices": [
          "Write 3-5 non-goals",
          "Share them in the brief",
          "Revisit weekly"
        ],
        "interviewQuestions": [
          "Why write non-goals?",
          "Give an example non-goal",
          "When update them?"
        ],
        "cheatSheet": [
          {
            "tag": "non-goal",
            "desc": "Explicitly out of scope item"
          },
          {
            "tag": "trade-off",
            "desc": "Conscious choice to exclude work"
          },
          {
            "tag": "brief",
            "desc": "Document that holds scope decisions"
          }
        ]
      },
      {
        "slug": "user-stories",
        "title": "User Stories",
        "summary": "Stories describe value from the user perspective.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "stories",
          "acceptance",
          "backlog"
        ],
        "challengeWeight": 4,
        "explanation": "User stories follow a simple shape: as a persona, I want capability, so that outcome. Add acceptance criteria so done is testable. Keep stories small enough to finish in a day or two for a capstone.",
        "a11yNotes": [],
        "commonMistakes": [
          "Stories that are actually epics",
          "No acceptance criteria",
          "Technical tasks disguised as user value"
        ],
        "bestPractices": [
          "Write persona-oriented stories",
          "Add acceptance criteria",
          "Split epics into thin stories"
        ],
        "interviewQuestions": [
          "What is a user story?",
          "Why acceptance criteria?",
          "How small should a story be?"
        ],
        "cheatSheet": [
          {
            "tag": "story",
            "desc": "User-valued unit of work"
          },
          {
            "tag": "acceptance",
            "desc": "Checks that prove the story is done"
          },
          {
            "tag": "epic",
            "desc": "Large theme that must be split"
          }
        ]
      },
      {
        "slug": "prioritization",
        "title": "Prioritization",
        "summary": "Order work by risk and demo value, not by fun.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "priority",
          "risk",
          "demo"
        ],
        "challengeWeight": 4,
        "explanation": "Prioritize the riskiest unknowns and the demo-critical path first. Fun side quests come last. A simple MoSCoW or risk/value matrix is enough for a capstone. Re-prioritize when you learn something new.",
        "a11yNotes": [],
        "commonMistakes": [
          "Building polish screens before core auth works",
          "Ignoring technical risks until late",
          "Priority lists that never change"
        ],
        "bestPractices": [
          "Do riskiest and demo-critical work first",
          "Use a simple priority method",
          "Revisit priorities after spikes"
        ],
        "interviewQuestions": [
          "What should you build first?",
          "What is risk-first prioritization?",
          "When re-prioritize?"
        ],
        "cheatSheet": [
          {
            "tag": "risk-first",
            "desc": "Tackle unknowns early"
          },
          {
            "tag": "MoSCoW",
            "desc": "Must/Should/Could/Won't prioritization"
          },
          {
            "tag": "critical path",
            "desc": "Work required for the demo story"
          }
        ]
      }
    ]
  },
  {
    "slug": "architecture",
    "title": "Architecture",
    "description": "Sketch systems that match the MVP, not imaginary scale.",
    "topics": [
      {
        "slug": "architecture-sketch",
        "title": "Architecture Sketch",
        "summary": "Draw the major components and how data flows.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "architecture",
          "components",
          "diagram"
        ],
        "challengeWeight": 5,
        "explanation": "An architecture sketch names clients, APIs, databases, auth, and external services. Keep it proportional to the MVP. Diagrams clarify ownership and integration points. Update the sketch when reality diverges.",
        "a11yNotes": [],
        "commonMistakes": [
          "Enterprise diagrams for a weekend MVP",
          "No diagram at all",
          "Hiding critical external dependencies"
        ],
        "bestPractices": [
          "Sketch boxes and arrows for the MVP",
          "Name auth and data stores",
          "Keep the diagram current"
        ],
        "interviewQuestions": [
          "What belongs on an MVP architecture sketch?",
          "Why diagram external services?",
          "When update the sketch?"
        ],
        "cheatSheet": [
          {
            "tag": "component",
            "desc": "Deployable or logical part of the system"
          },
          {
            "tag": "data flow",
            "desc": "How information moves between parts"
          },
          {
            "tag": "dependency",
            "desc": "External service you rely on"
          }
        ]
      },
      {
        "slug": "tech-choices",
        "title": "Tech Choices",
        "summary": "Choose tools you can ship with, and write why.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "stack",
          "trade-offs",
          "adr"
        ],
        "challengeWeight": 4,
        "explanation": "Tech choices should optimize for learning goals, speed, and reliability of the demo. Record alternatives considered and why you rejected them. Prefer boring technology for the critical path.",
        "a11yNotes": [],
        "commonMistakes": [
          "Choosing novel tech on the critical path with no buffer",
          "No written rationale",
          "Changing stacks mid-project casually"
        ],
        "bestPractices": [
          "Prefer familiar tools for the demo path",
          "Write short decision notes",
          "Isolate experiments from the critical path"
        ],
        "interviewQuestions": [
          "How do you choose a stack for a capstone?",
          "Why write decision notes?",
          "What is boring technology?"
        ],
        "cheatSheet": [
          {
            "tag": "ADR",
            "desc": "Architecture Decision Record"
          },
          {
            "tag": "critical path",
            "desc": "Path required to ship the demo"
          },
          {
            "tag": "trade-off",
            "desc": "Pros and cons of a choice"
          }
        ]
      },
      {
        "slug": "data-model-plan",
        "title": "Data Model Plan",
        "summary": "List core entities and relationships before coding blindly.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "data",
          "entities",
          "schema"
        ],
        "challengeWeight": 4,
        "explanation": "A simple entity list prevents thrash. Name primary objects, keys, and relationships. Align the model with user stories. You can refine later, but start with a coherent sketch.",
        "a11yNotes": [],
        "commonMistakes": [
          "Inventing tables ad hoc in every PR",
          "Over-normalizing an MVP",
          "No link between entities and stories"
        ],
        "bestPractices": [
          "List entities and relationships",
          "Map entities to stories",
          "Keep the first schema simple"
        ],
        "interviewQuestions": [
          "What is an entity list?",
          "Why map entities to stories?",
          "When is over-normalization harmful?"
        ],
        "cheatSheet": [
          {
            "tag": "entity",
            "desc": "Core noun in your domain"
          },
          {
            "tag": "relationship",
            "desc": "How entities connect"
          },
          {
            "tag": "schema sketch",
            "desc": "Early data model draft"
          }
        ]
      },
      {
        "slug": "api-surface",
        "title": "API Surface",
        "summary": "Define the endpoints or server actions your UI needs.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "api",
          "endpoints",
          "contract"
        ],
        "challengeWeight": 4,
        "explanation": "An API surface lists routes or server actions, inputs, and outputs for the MVP. Contracts help frontend and backend stay aligned even if you are solo. Keep it thin and story-driven.",
        "a11yNotes": [],
        "commonMistakes": [
          "Building random endpoints with no UI consumer",
          "No request/response shape",
          "Changing contracts silently every day"
        ],
        "bestPractices": [
          "List story-driven endpoints",
          "Document request/response shapes",
          "Version or note breaking changes"
        ],
        "interviewQuestions": [
          "What is an API surface?",
          "Why document contracts solo?",
          "How do stories drive endpoints?"
        ],
        "cheatSheet": [
          {
            "tag": "endpoint",
            "desc": "HTTP route or server action"
          },
          {
            "tag": "contract",
            "desc": "Agreed request/response shape"
          },
          {
            "tag": "payload",
            "desc": "Data sent or returned"
          }
        ]
      },
      {
        "slug": "auth-plan",
        "title": "Auth Plan",
        "summary": "Decide how users sign in and what is protected.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "auth",
          "roles",
          "session"
        ],
        "challengeWeight": 4,
        "explanation": "Even simple products need an auth plan: who can access what, how sessions work, and what is public. Capstones often use a hosted auth provider. Document protected routes and roles explicitly.",
        "a11yNotes": [],
        "commonMistakes": [
          "Leaving admin routes unprotected",
          "No plan for logged-out states",
          "Building custom crypto auth unnecessarily"
        ],
        "bestPractices": [
          "List public vs protected routes",
          "Prefer a trusted auth provider for MVP",
          "Test unauthorized access"
        ],
        "interviewQuestions": [
          "What belongs in an auth plan?",
          "Public vs protected?",
          "Why prefer a provider for MVP?"
        ],
        "cheatSheet": [
          {
            "tag": "session",
            "desc": "Signed-in user state"
          },
          {
            "tag": "protected route",
            "desc": "Requires authentication"
          },
          {
            "tag": "role",
            "desc": "Permission grouping"
          }
        ]
      }
    ]
  },
  {
    "slug": "delivery-planning",
    "title": "Delivery Planning",
    "description": "Milestones, risks, spikes, and estimation.",
    "topics": [
      {
        "slug": "milestones",
        "title": "Milestones",
        "summary": "Break the project into weekly outcomes you can demo.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "milestones",
          "timeline",
          "plan"
        ],
        "challengeWeight": 4,
        "explanation": "Milestones are outcome checkpoints, not busywork. Example: auth works, core CRUD works, deploy works, demo rehearsed. Each milestone should produce visible progress. Slippage should trigger scope cuts.",
        "a11yNotes": [],
        "commonMistakes": [
          "Task lists with no outcomes",
          "One giant milestone at the end",
          "Ignoring slips until panic week"
        ],
        "bestPractices": [
          "Define weekly demoable outcomes",
          "Cut scope when slips happen",
          "Keep a visible timeline"
        ],
        "interviewQuestions": [
          "What is a good milestone?",
          "What do you do when a milestone slips?",
          "Why weekly outcomes?"
        ],
        "cheatSheet": [
          {
            "tag": "milestone",
            "desc": "Checkpoint with a demoable outcome"
          },
          {
            "tag": "timeline",
            "desc": "Sequence of milestones"
          },
          {
            "tag": "slip",
            "desc": "Missed checkpoint needing response"
          }
        ]
      },
      {
        "slug": "risk-register",
        "title": "Risk Register",
        "summary": "Name top risks and mitigation plans early.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "risk",
          "mitigation",
          "spike"
        ],
        "challengeWeight": 4,
        "explanation": "A risk register lists what could sink the project: unfamiliar APIs, data model confusion, deploy issues. Pair each risk with a mitigation or spike. Review risks weekly.",
        "a11yNotes": [],
        "commonMistakes": [
          "Pretending there are no risks",
          "Risks with no mitigation",
          "Discovering deploy risk on the last day"
        ],
        "bestPractices": [
          "Write top 5 risks",
          "Schedule spikes for unknowns",
          "Review risks every week"
        ],
        "interviewQuestions": [
          "What is a risk register?",
          "What is a spike?",
          "Name common capstone risks"
        ],
        "cheatSheet": [
          {
            "tag": "risk",
            "desc": "Uncertain event that can hurt delivery"
          },
          {
            "tag": "mitigation",
            "desc": "Action that reduces risk impact"
          },
          {
            "tag": "spike",
            "desc": "Time-boxed research task"
          }
        ]
      },
      {
        "slug": "technical-spikes",
        "title": "Technical Spikes",
        "summary": "Time-box research to answer unknowns before committing.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "spike",
          "research",
          "timebox"
        ],
        "challengeWeight": 3,
        "explanation": "Spikes are short investigations with a clear question and time limit. Output is a decision, not polished code. Use spikes for auth providers, hosting, or tricky integrations. Stop when the question is answered.",
        "a11yNotes": [],
        "commonMistakes": [
          "Open-ended research with no deadline",
          "Turning spikes into production features accidentally",
          "No written decision after a spike"
        ],
        "bestPractices": [
          "Write the question and timebox",
          "End with a decision note",
          "Keep spike code disposable"
        ],
        "interviewQuestions": [
          "What is a spike?",
          "What should a spike produce?",
          "Why time-box?"
        ],
        "cheatSheet": [
          {
            "tag": "timebox",
            "desc": "Fixed maximum duration"
          },
          {
            "tag": "decision",
            "desc": "Choice made from spike learning"
          },
          {
            "tag": "disposable",
            "desc": "Code not required to ship"
          }
        ]
      },
      {
        "slug": "estimation-basics",
        "title": "Estimation Basics",
        "summary": "Estimate in ranges and plan buffers for unknowns.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "estimate",
          "buffer",
          "planning"
        ],
        "challengeWeight": 4,
        "explanation": "Capstone estimates are rough. Use ranges, add buffer for unknowns, and track actuals lightly. Prefer splitting work over precise hour fantasy. Estimation exists to force prioritization.",
        "a11yNotes": [],
        "commonMistakes": [
          "Single-point hour estimates treated as promises",
          "No buffer",
          "Never comparing actuals to estimates"
        ],
        "bestPractices": [
          "Estimate in ranges",
          "Add buffer for unknowns",
          "Split large items"
        ],
        "interviewQuestions": [
          "Why use ranges?",
          "What is buffer for?",
          "How does estimation help prioritization?"
        ],
        "cheatSheet": [
          {
            "tag": "range",
            "desc": "Low-high effort estimate"
          },
          {
            "tag": "buffer",
            "desc": "Reserved time for uncertainty"
          },
          {
            "tag": "actuals",
            "desc": "Time really spent"
          }
        ]
      },
      {
        "slug": "acceptance-criteria",
        "title": "Acceptance Criteria",
        "summary": "Criteria make done objective for each story.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "acceptance",
          "qa",
          "done"
        ],
        "challengeWeight": 3,
        "explanation": "Acceptance criteria are checks a reviewer can verify. Write them before building when possible. They feed your test plan and demo script. Vague criteria create endless polish debates.",
        "a11yNotes": [],
        "commonMistakes": [
          "Done means feels right",
          "Criteria written after coding only",
          "Unobservable criteria"
        ],
        "bestPractices": [
          "Write testable criteria",
          "Use them in QA",
          "Keep criteria visible with the story"
        ],
        "interviewQuestions": [
          "What makes criteria testable?",
          "When write them?",
          "How do they help demos?"
        ],
        "cheatSheet": [
          {
            "tag": "criterion",
            "desc": "Single verifiable check"
          },
          {
            "tag": "QA",
            "desc": "Verification against criteria"
          },
          {
            "tag": "done",
            "desc": "Story meets its criteria"
          }
        ]
      }
    ]
  },
  {
    "slug": "collaboration-docs",
    "title": "Planning Docs",
    "description": "Briefs, ADRs, and README scaffolds reviewers expect.",
    "topics": [
      {
        "slug": "project-brief",
        "title": "Project Brief",
        "summary": "A brief is the one-pager mentors read first.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "brief",
          "readme",
          "summary"
        ],
        "challengeWeight": 4,
        "explanation": "A project brief includes problem, users, MVP, non-goals, stack, and timeline. Keep it scannable. Update it when major decisions change. Your README can start from the brief.",
        "a11yNotes": [],
        "commonMistakes": [
          "README with only setup commands",
          "Briefs longer than anyone will read",
          "Outdated briefs that contradict the app"
        ],
        "bestPractices": [
          "Keep a one-page brief",
          "Link it from the README",
          "Update on major changes"
        ],
        "interviewQuestions": [
          "What sections belong in a brief?",
          "How long should it be?",
          "How does it relate to the README?"
        ],
        "cheatSheet": [
          {
            "tag": "brief",
            "desc": "One-page project overview"
          },
          {
            "tag": "scannable",
            "desc": "Easy to skim for key facts"
          },
          {
            "tag": "README",
            "desc": "Repo entry document"
          }
        ]
      },
      {
        "slug": "architecture-decision-records",
        "title": "Architecture Decision Records",
        "summary": "ADRs capture important decisions and context.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "adr",
          "decision",
          "context"
        ],
        "challengeWeight": 4,
        "explanation": "An ADR records context, decision, and consequences. Use them for auth, hosting, and database choices. Short ADRs beat forgotten Slack messages. They help future you explain the portfolio.",
        "a11yNotes": [],
        "commonMistakes": [
          "Decisions only in chat history",
          "ADRs that rewrite history without dates",
          "Writing ADRs for trivial choices"
        ],
        "bestPractices": [
          "Write ADRs for significant choices",
          "Include alternatives considered",
          "Keep them short"
        ],
        "interviewQuestions": [
          "What is an ADR?",
          "When write one?",
          "What sections does it need?"
        ],
        "cheatSheet": [
          {
            "tag": "context",
            "desc": "Situation forcing a decision"
          },
          {
            "tag": "decision",
            "desc": "Choice you made"
          },
          {
            "tag": "consequences",
            "desc": "Follow-on effects of the choice"
          }
        ]
      },
      {
        "slug": "demo-script-outline",
        "title": "Demo Script Outline",
        "summary": "Plan the story you will show before polish week.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "demo",
          "script",
          "story"
        ],
        "challengeWeight": 4,
        "explanation": "A demo script lists setup, narrative beats, and backup plans if something fails. Rehearse with the script. Designing the demo early prevents building un-demoable features. Keep it under a few minutes for most reviews.",
        "a11yNotes": [],
        "commonMistakes": [
          "Improvising demos live with no script",
          "Demo depends on flaky seed data",
          "No backup path if a step fails"
        ],
        "bestPractices": [
          "Write beats and timing",
          "Prepare seed data",
          "Have a backup clip or screenshots"
        ],
        "interviewQuestions": [
          "What belongs in a demo script?",
          "Why rehearse?",
          "What is a backup plan?"
        ],
        "cheatSheet": [
          {
            "tag": "beat",
            "desc": "Narrative step in the demo"
          },
          {
            "tag": "seed data",
            "desc": "Prepared data for a reliable demo"
          },
          {
            "tag": "backup",
            "desc": "Fallback if live demo fails"
          }
        ]
      },
      {
        "slug": "definition-of-ready",
        "title": "Definition of Ready",
        "summary": "Ready means a story is clear enough to build.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "ready",
          "backlog",
          "clarity"
        ],
        "challengeWeight": 3,
        "explanation": "Definition of ready checks that a story has persona value, acceptance criteria, and known dependencies before you start. It reduces mid-build confusion. Keep the checklist short for a solo capstone.",
        "a11yNotes": [],
        "commonMistakes": [
          "Starting stories with unclear outcomes",
          "Over-process for a solo project",
          "No dependency check"
        ],
        "bestPractices": [
          "Use a short ready checklist",
          "Clarify criteria before coding",
          "Identify dependencies first"
        ],
        "interviewQuestions": [
          "What is definition of ready?",
          "Why does it help solos?",
          "Name three ready checks"
        ],
        "cheatSheet": [
          {
            "tag": "ready",
            "desc": "Clear enough to start building"
          },
          {
            "tag": "dependency",
            "desc": "Work or decision blocking progress"
          },
          {
            "tag": "checklist",
            "desc": "Short readiness gates"
          }
        ]
      }
    ]
  }
];

export function flattenCapstoneTopics(): CapstoneTopicDef[] {
  return CAPSTONE_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
