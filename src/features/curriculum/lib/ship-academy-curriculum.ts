export type ShipDifficulty = "beginner" | "intermediate" | "advanced";

export type ShipTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ShipDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ShipSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ShipTopicDef[];
};

export const SHIP_ACADEMY_SECTIONS: ShipSectionDef[] = [
  {
    "slug": "polish",
    "title": "Polish",
    "description": "Hardening quality before you call it done.",
    "topics": [
      {
        "slug": "ship-overview",
        "title": "Ship Overview",
        "summary": "Shipping means polish, launch readiness, and a clear presentation.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "ship",
          "launch",
          "polish"
        ],
        "challengeWeight": 4,
        "explanation": "Shipping a capstone is more than merging main. You polish UX, fix blockers, prepare docs, deploy stably, and rehearse the story. A shipped project is demoable by someone else with your README. Treat launch as a checklist, not a vibe.",
        "a11yNotes": [],
        "commonMistakes": [
          "Calling it shipped with a broken happy path",
          "No README setup",
          "Never rehearsing the demo"
        ],
        "bestPractices": [
          "Use a launch checklist",
          "Make setup reproducible",
          "Rehearse the demo"
        ],
        "interviewQuestions": [
          "What does shipped mean for a capstone?",
          "Why checklists help?",
          "What must a README enable?"
        ],
        "cheatSheet": [
          {
            "tag": "launch checklist",
            "desc": "Ordered ship-readiness tasks"
          },
          {
            "tag": "reproducible",
            "desc": "Others can run it from docs"
          },
          {
            "tag": "rehearsal",
            "desc": "Practice demo before review"
          }
        ]
      },
      {
        "slug": "bug-triage",
        "title": "Bug Triage",
        "summary": "Rank bugs by user impact and demo risk.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "bugs",
          "triage",
          "severity"
        ],
        "challengeWeight": 4,
        "explanation": "Triage separates blockers, major issues, and polish nits. Fix demo blockers first. Write short reproduction steps. Known issues lists are honest and useful in READMEs.",
        "a11yNotes": [],
        "commonMistakes": [
          "Fixing random nits while blockers remain",
          "No severity labels",
          "Bugs without reproduction steps"
        ],
        "bestPractices": [
          "Label blocker/major/nit",
          "Fix demo blockers first",
          "Document known issues"
        ],
        "interviewQuestions": [
          "What is a blocker?",
          "How do you triage?",
          "Why document known issues?"
        ],
        "cheatSheet": [
          {
            "tag": "blocker",
            "desc": "Prevents core demo or usage"
          },
          {
            "tag": "repro",
            "desc": "Steps to reproduce a bug"
          },
          {
            "tag": "known issue",
            "desc": "Documented unresolved defect"
          }
        ]
      },
      {
        "slug": "ux-polish-pass",
        "title": "UX Polish Pass",
        "summary": "Do one focused pass on clarity, empty states, and errors.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "ux",
          "empty-states",
          "errors"
        ],
        "challengeWeight": 4,
        "explanation": "A polish pass improves labels, empty states, loading, and error messages on the happy path. Do not redesign everything. Consistency beats novelty in the final week.",
        "a11yNotes": [],
        "commonMistakes": [
          "Redesigning the whole UI late",
          "No empty states",
          "Technical error dumps shown to users"
        ],
        "bestPractices": [
          "Polish the happy path first",
          "Add empty and error states",
          "Keep copy clear and consistent"
        ],
        "interviewQuestions": [
          "What belongs in a polish pass?",
          "Why happy path first?",
          "What makes a good empty state?"
        ],
        "cheatSheet": [
          {
            "tag": "empty state",
            "desc": "UI when there is no data yet"
          },
          {
            "tag": "loading state",
            "desc": "UI while work is in progress"
          },
          {
            "tag": "error copy",
            "desc": "Human-readable failure message"
          }
        ]
      },
      {
        "slug": "accessibility-smoke",
        "title": "Accessibility Smoke",
        "summary": "Quick checks catch basic a11y failures before launch.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "a11y",
          "keyboard",
          "labels"
        ],
        "challengeWeight": 3,
        "explanation": "Smoke a11y: keyboard through the happy path, check labels, contrast on key screens, and focus visibility. You will not perfect WCAG in a day, but you can avoid obvious traps. Note remaining issues honestly.",
        "a11yNotes": [],
        "commonMistakes": [
          "Mouse-only testing",
          "Icon buttons with no accessible name",
          "Ignoring focus outlines"
        ],
        "bestPractices": [
          "Keyboard-test the happy path",
          "Label interactive controls",
          "Keep visible focus styles"
        ],
        "interviewQuestions": [
          "Name three a11y smoke checks",
          "Why keyboard test?",
          "What is an accessible name?"
        ],
        "cheatSheet": [
          {
            "tag": "keyboard",
            "desc": "Navigate without a mouse"
          },
          {
            "tag": "accessible name",
            "desc": "Text assistive tech uses for a control"
          },
          {
            "tag": "focus",
            "desc": "Indicator of the active element"
          }
        ]
      },
      {
        "slug": "performance-basics",
        "title": "Performance Basics",
        "summary": "Fix only the slowdowns users will feel in the demo.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "performance",
          "lazy",
          "bundle"
        ],
        "challengeWeight": 4,
        "explanation": "Measure the demo path. Lazy-load heavy routes, compress images, and avoid obvious N+1 calls. Premature micro-optimizations waste ship week. Aim for snappy first interaction on the story path.",
        "a11yNotes": [],
        "commonMistakes": [
          "Optimizing unused pages",
          "Huge images on the landing screen",
          "No measurement before optimizing"
        ],
        "bestPractices": [
          "Measure the demo path",
          "Fix user-visible slowness",
          "Defer non-critical work"
        ],
        "interviewQuestions": [
          "What should you optimize first?",
          "Why measure?",
          "Name a common ship-week win"
        ],
        "cheatSheet": [
          {
            "tag": "LCP",
            "desc": "Largest contentful paint style concern"
          },
          {
            "tag": "lazy load",
            "desc": "Load code/data when needed"
          },
          {
            "tag": "demo path",
            "desc": "Screens shown in the presentation"
          }
        ]
      }
    ]
  },
  {
    "slug": "docs-and-story",
    "title": "Docs and Story",
    "description": "README, changelog, and portfolio narrative.",
    "topics": [
      {
        "slug": "readme-for-humans",
        "title": "README for Humans",
        "summary": "A good README gets a stranger running and understanding the app.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "readme",
          "setup",
          "docs"
        ],
        "challengeWeight": 4,
        "explanation": "Include overview, features, stack, setup, env vars, scripts, and demo notes. Add screenshots if helpful. Keep commands copy-pasteable. Link architecture notes and known issues.",
        "a11yNotes": [],
        "commonMistakes": [
          "README with only a title",
          "Secret keys committed as examples",
          "Setup steps that do not work"
        ],
        "bestPractices": [
          "Write reproducible setup",
          "Document env vars safely",
          "Include demo and known issues"
        ],
        "interviewQuestions": [
          "What sections belong in a README?",
          "How do you document env vars?",
          "Why include known issues?"
        ],
        "cheatSheet": [
          {
            "tag": "setup",
            "desc": "Steps to run locally"
          },
          {
            "tag": "env example",
            "desc": "Safe template for required variables"
          },
          {
            "tag": "scripts",
            "desc": "npm/pnpm commands to run"
          }
        ]
      },
      {
        "slug": "changelog-and-tags",
        "title": "Changelog and Tags",
        "summary": "Version tags and changelogs mark what you shipped.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "changelog",
          "semver",
          "tags"
        ],
        "challengeWeight": 3,
        "explanation": "Tag a release when you ship. Write a short changelog of user-facing changes. Tags help mentors check out a known-good revision. Keep versions simple for a capstone.",
        "a11yNotes": [],
        "commonMistakes": [
          "No tag on the presented version",
          "Changelog of unrelated commits",
          "Moving tags after the fact silently"
        ],
        "bestPractices": [
          "Tag the demo revision",
          "Summarize user-facing changes",
          "Keep the presented tag stable"
        ],
        "interviewQuestions": [
          "Why tag a release?",
          "What belongs in a changelog?",
          "What is a known-good revision?"
        ],
        "cheatSheet": [
          {
            "tag": "tag",
            "desc": "Named git pointer to a release"
          },
          {
            "tag": "changelog",
            "desc": "Human summary of changes"
          },
          {
            "tag": "semver",
            "desc": "Version numbering scheme"
          }
        ]
      },
      {
        "slug": "portfolio-writeup",
        "title": "Portfolio Writeup",
        "summary": "Explain problem, role, architecture, and results for your portfolio.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "portfolio",
          "writeup",
          "story"
        ],
        "challengeWeight": 4,
        "explanation": "A portfolio writeup covers problem, your role, stack, architecture highlights, challenges, and outcomes. Screenshots and a live link help. Be honest about trade-offs. Recruiters skim, so lead with impact.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only dumping the repo link",
          "No mention of trade-offs",
          "Writing a novel nobody finishes"
        ],
        "bestPractices": [
          "Lead with problem and outcome",
          "Show architecture highlights",
          "Include screenshots and links"
        ],
        "interviewQuestions": [
          "What sections belong in a writeup?",
          "Why mention trade-offs?",
          "How long should it be?"
        ],
        "cheatSheet": [
          {
            "tag": "impact",
            "desc": "Outcome or learning highlighted first"
          },
          {
            "tag": "role",
            "desc": "What you personally owned"
          },
          {
            "tag": "live link",
            "desc": "Deployed demo URL"
          }
        ]
      },
      {
        "slug": "presentation-deck",
        "title": "Presentation Deck",
        "summary": "A short deck supports your live demo without replacing it.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "presentation",
          "slides",
          "talk"
        ],
        "challengeWeight": 3,
        "explanation": "Slides should cover problem, demo agenda, architecture, and learnings. Keep text sparse. The product is the star. Timebox each section and practice transitions.",
        "a11yNotes": [],
        "commonMistakes": [
          "Reading dense slides aloud",
          "No agenda",
          "Demo with zero narrative framing"
        ],
        "bestPractices": [
          "Keep slides sparse",
          "Agenda then demo then architecture",
          "Practice transitions"
        ],
        "interviewQuestions": [
          "What slides do you need?",
          "Why sparse text?",
          "How do slides support the demo?"
        ],
        "cheatSheet": [
          {
            "tag": "agenda",
            "desc": "Ordered talk sections"
          },
          {
            "tag": "sparse slides",
            "desc": "Minimal text, strong visuals"
          },
          {
            "tag": "transition",
            "desc": "Move between talk and demo cleanly"
          }
        ]
      }
    ]
  },
  {
    "slug": "launch-ops",
    "title": "Launch Ops",
    "description": "Deploy, monitor, and prepare for failure.",
    "topics": [
      {
        "slug": "launch-checklist",
        "title": "Launch Checklist",
        "summary": "A checklist prevents missed env, DNS, and smoke steps.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "checklist",
          "launch",
          "smoke"
        ],
        "challengeWeight": 4,
        "explanation": "Launch checklists cover env vars, migrations, smoke tests, analytics, and rollback owner. Check items in order. Keep the list short enough to actually use on launch day.",
        "a11yNotes": [],
        "commonMistakes": [
          "Improvising production launch",
          "No smoke test after deploy",
          "Nobody owns rollback"
        ],
        "bestPractices": [
          "Write an ordered checklist",
          "Smoke test after deploy",
          "Name a rollback owner"
        ],
        "interviewQuestions": [
          "What belongs on a launch checklist?",
          "Why order matters?",
          "Who owns rollback?"
        ],
        "cheatSheet": [
          {
            "tag": "smoke",
            "desc": "Quick post-deploy verification"
          },
          {
            "tag": "owner",
            "desc": "Person accountable for a step"
          },
          {
            "tag": "env vars",
            "desc": "Runtime configuration for launch"
          }
        ]
      },
      {
        "slug": "production-smoke",
        "title": "Production Smoke",
        "summary": "Verify the happy path on the real deployment.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "smoke",
          "prod",
          "verify"
        ],
        "challengeWeight": 3,
        "explanation": "After deploy, run the demo path on production with fresh eyes. Check auth, core create/read flows, and critical links. Record results. Fix blockers before presenting.",
        "a11yNotes": [],
        "commonMistakes": [
          "Assuming staging equals production",
          "No written smoke results",
          "Demoing without a production check"
        ],
        "bestPractices": [
          "Run the demo path in production",
          "Record pass/fail",
          "Fix blockers before the talk"
        ],
        "interviewQuestions": [
          "What is production smoke?",
          "Why not trust staging alone?",
          "What do you record?"
        ],
        "cheatSheet": [
          {
            "tag": "prod",
            "desc": "Live deployed environment"
          },
          {
            "tag": "happy path",
            "desc": "Core successful journey"
          },
          {
            "tag": "pass/fail",
            "desc": "Smoke result status"
          }
        ]
      },
      {
        "slug": "monitoring-basics",
        "title": "Monitoring Basics",
        "summary": "Know when the deployed app is unhealthy.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "monitoring",
          "logs",
          "alerts"
        ],
        "challengeWeight": 4,
        "explanation": "Even a capstone benefits from basic logs, error tracking, and an uptime check if possible. Know where to look when the demo fails. Do not build a full observability platform in ship week.",
        "a11yNotes": [],
        "commonMistakes": [
          "No idea where logs live",
          "Alert spam with no action",
          "Ignoring errors until the presentation"
        ],
        "bestPractices": [
          "Enable basic error tracking",
          "Know how to fetch recent logs",
          "Watch errors before the demo"
        ],
        "interviewQuestions": [
          "What minimal monitoring helps a capstone?",
          "Where do you look during an incident?",
          "Why before the demo?"
        ],
        "cheatSheet": [
          {
            "tag": "error tracking",
            "desc": "Capture exceptions from production"
          },
          {
            "tag": "uptime",
            "desc": "Check that the site responds"
          },
          {
            "tag": "logs",
            "desc": "Runtime records for debugging"
          }
        ]
      },
      {
        "slug": "rollback-plan",
        "title": "Rollback Plan",
        "summary": "Know how to restore the last good release quickly.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "rollback",
          "release",
          "incident"
        ],
        "challengeWeight": 4,
        "explanation": "A rollback plan names the previous good tag, how to redeploy it, and what DB changes are unsafe to reverse. Practice once if you can. Presenting from a known-good tag beats debugging live.",
        "a11yNotes": [],
        "commonMistakes": [
          "No previous tag",
          "Irreversible migration with no forward fix",
          "Never tested rollback"
        ],
        "bestPractices": [
          "Keep a previous good tag",
          "Document rollback commands",
          "Avoid risky migrations near demo day"
        ],
        "interviewQuestions": [
          "What does a rollback plan include?",
          "Why keep previous tags?",
          "What makes migrations risky?"
        ],
        "cheatSheet": [
          {
            "tag": "previous tag",
            "desc": "Last known good release"
          },
          {
            "tag": "redeploy",
            "desc": "Ship the previous artifact again"
          },
          {
            "tag": "forward fix",
            "desc": "Ship a fix instead of rolling back"
          }
        ]
      },
      {
        "slug": "incident-lite",
        "title": "Incident Lite",
        "summary": "A tiny runbook for demo-day failures.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "incident",
          "runbook",
          "demo"
        ],
        "challengeWeight": 3,
        "explanation": "Demo-day incidents happen: expired env, cold starts, seed data missing. A lite runbook lists top failures and fixes. Screenshots or a recorded backup save presentations. Stay calm and narrate.",
        "a11yNotes": [],
        "commonMistakes": [
          "No backup recording",
          "Panic debugging in silence",
          "Single point of failure with no alternative"
        ],
        "bestPractices": [
          "List top failure fixes",
          "Keep a backup recording",
          "Narrate while recovering"
        ],
        "interviewQuestions": [
          "What is a lite runbook?",
          "Why a backup recording?",
          "How should you behave on failure?"
        ],
        "cheatSheet": [
          {
            "tag": "runbook",
            "desc": "Steps to fix common failures"
          },
          {
            "tag": "backup recording",
            "desc": "Pre-recorded demo fallback"
          },
          {
            "tag": "narrate",
            "desc": "Explain recovery to the audience"
          }
        ]
      }
    ]
  },
  {
    "slug": "feedback-and-next",
    "title": "Feedback and Next",
    "description": "Collect feedback and plan what comes after launch.",
    "topics": [
      {
        "slug": "feedback-collection",
        "title": "Feedback Collection",
        "summary": "Gather structured feedback from reviewers and users.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "feedback",
          "survey",
          "notes"
        ],
        "challengeWeight": 4,
        "explanation": "Ask specific questions: clarity, trust, missing features, bugs. Capture notes in one place. Thank reviewers. Convert feedback into a short backlog for portfolio follow-ups.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only asking was it good",
          "Losing feedback in chat",
          "Defensive responses to critique"
        ],
        "bestPractices": [
          "Ask specific questions",
          "Centralize notes",
          "Turn feedback into backlog items"
        ],
        "interviewQuestions": [
          "What questions should you ask?",
          "Where store feedback?",
          "What do you do after?"
        ],
        "cheatSheet": [
          {
            "tag": "structured feedback",
            "desc": "Specific questions and answers"
          },
          {
            "tag": "backlog",
            "desc": "Ordered follow-up work"
          },
          {
            "tag": "reviewer",
            "desc": "Person giving critique"
          }
        ]
      },
      {
        "slug": "postmortem-lite",
        "title": "Postmortem Lite",
        "summary": "Reflect on what went well, what hurt, and what you will change.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "postmortem",
          "retro",
          "learning"
        ],
        "challengeWeight": 4,
        "explanation": "A lite postmortem covers timeline, what went well, what went wrong, and action items. Blameless tone matters. This becomes strong interview material when honest and concrete.",
        "a11yNotes": [],
        "commonMistakes": [
          "Blame-focused writeups",
          "No action items",
          "Skipping reflection entirely"
        ],
        "bestPractices": [
          "Write blameless notes",
          "Add concrete action items",
          "Save examples for interviews"
        ],
        "interviewQuestions": [
          "What sections are in a postmortem?",
          "Why blameless?",
          "How does it help interviews?"
        ],
        "cheatSheet": [
          {
            "tag": "went well",
            "desc": "Successful practices to keep"
          },
          {
            "tag": "went wrong",
            "desc": "Problems to learn from"
          },
          {
            "tag": "action item",
            "desc": "Specific change going forward"
          }
        ]
      },
      {
        "slug": "next-iteration",
        "title": "Next Iteration",
        "summary": "Define the next slice without pretending it is already done.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "iteration",
          "roadmap",
          "next"
        ],
        "challengeWeight": 3,
        "explanation": "After shipping, list the next iteration: top features, refactors, and debt. Keep it short. Separating shipped from next protects honesty in your portfolio. Optionally schedule a v2.",
        "a11yNotes": [],
        "commonMistakes": [
          "Mixing shipped and fantasy features in the README",
          "Infinite next lists",
          "No prioritization of next work"
        ],
        "bestPractices": [
          "Keep a short next list",
          "Separate shipped vs planned",
          "Prioritize the top three"
        ],
        "interviewQuestions": [
          "Why separate shipped vs next?",
          "How long should the next list be?",
          "What do you prioritize?"
        ],
        "cheatSheet": [
          {
            "tag": "v2",
            "desc": "Next planned version"
          },
          {
            "tag": "debt",
            "desc": "Known technical shortcuts to revisit"
          },
          {
            "tag": "planned",
            "desc": "Not yet shipped work"
          }
        ]
      },
      {
        "slug": "handoff-notes",
        "title": "Handoff Notes",
        "summary": "Write notes so another engineer can maintain the project.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "handoff",
          "maintain",
          "ops"
        ],
        "challengeWeight": 4,
        "explanation": "Handoff notes cover architecture map, env setup, deploy steps, common failures, and contacts. Even solo portfolio projects benefit when you revisit months later. Keep it practical.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only tribal memory",
          "Outdated handoff docs",
          "Missing deploy steps"
        ],
        "bestPractices": [
          "Document deploy and env",
          "Map key modules",
          "List common failures"
        ],
        "interviewQuestions": [
          "What belongs in handoff notes?",
          "Why help future you?",
          "What ops steps matter?"
        ],
        "cheatSheet": [
          {
            "tag": "handoff",
            "desc": "Transfer of maintenance knowledge"
          },
          {
            "tag": "module map",
            "desc": "Where important code lives"
          },
          {
            "tag": "ops steps",
            "desc": "Deploy and maintain commands"
          }
        ]
      },
      {
        "slug": "launch-announcement",
        "title": "Launch Announcement",
        "summary": "Tell a concise story when you share the project publicly.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "announce",
          "launch",
          "share"
        ],
        "challengeWeight": 3,
        "explanation": "A launch announcement states the problem, what shipped, the link, and a call for feedback. Keep it short for LinkedIn or Discord. Attach a screenshot or short clip. Invite specific critique.",
        "a11yNotes": [],
        "commonMistakes": [
          "Wall of text with no link",
          "No ask for feedback",
          "Hiding known limitations"
        ],
        "bestPractices": [
          "Lead with problem and link",
          "Ask for specific feedback",
          "Be honest about MVP limits"
        ],
        "interviewQuestions": [
          "What belongs in a launch post?",
          "Why ask specific feedback?",
          "How do you mention limits?"
        ],
        "cheatSheet": [
          {
            "tag": "call for feedback",
            "desc": "Specific ask to reviewers"
          },
          {
            "tag": "screenshot",
            "desc": "Visual proof of the product"
          },
          {
            "tag": "MVP honesty",
            "desc": "Clear about current limits"
          }
        ]
      }
    ]
  },
  {
    "slug": "presentation-day",
    "title": "Presentation Day",
    "description": "Rehearse, backup, and deliver calmly.",
    "topics": [
      {
        "slug": "rehearsal",
        "title": "Rehearsal",
        "summary": "Practice the full demo under time constraints.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "rehearse",
          "timing",
          "practice"
        ],
        "challengeWeight": 4,
        "explanation": "Rehearse with the real deploy and seed data. Time yourself. Fix friction you notice. Practice recovery lines for likely failures. Two rehearsals beat one long improv.",
        "a11yNotes": [],
        "commonMistakes": [
          "First live attempt is the graded demo",
          "Never timing the talk",
          "Using different data than production"
        ],
        "bestPractices": [
          "Rehearse on production",
          "Time each section",
          "Practice failure recovery lines"
        ],
        "interviewQuestions": [
          "Why rehearse on production?",
          "How many rehearsals help?",
          "What is a recovery line?"
        ],
        "cheatSheet": [
          {
            "tag": "timing",
            "desc": "Measured duration per section"
          },
          {
            "tag": "recovery line",
            "desc": "Prepared words during a glitch"
          },
          {
            "tag": "seed",
            "desc": "Reliable demo data set"
          }
        ]
      },
      {
        "slug": "environment-freeze",
        "title": "Environment Freeze",
        "summary": "Stop risky changes right before the presentation.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "freeze",
          "stability",
          "demo"
        ],
        "challengeWeight": 3,
        "explanation": "A freeze means no risky deploys or schema changes before the talk unless fixing a blocker. Tag the frozen revision. Communicate the freeze if teammates exist. Stability beats last-minute features.",
        "a11yNotes": [],
        "commonMistakes": [
          "Pushing untested features an hour before",
          "No tagged freeze revision",
          "Hotfixing without smoke"
        ],
        "bestPractices": [
          "Freeze risky changes",
          "Tag the presented revision",
          "Only blocker fixes with smoke"
        ],
        "interviewQuestions": [
          "What is an environment freeze?",
          "What changes are allowed?",
          "Why tag the freeze?"
        ],
        "cheatSheet": [
          {
            "tag": "freeze",
            "desc": "Pause risky changes pre-demo"
          },
          {
            "tag": "blocker fix",
            "desc": "Only critical repairs during freeze"
          },
          {
            "tag": "presented revision",
            "desc": "Exact code version you demo"
          }
        ]
      },
      {
        "slug": "q-and-a-prep",
        "title": "Q and A Prep",
        "summary": "Prepare answers for architecture, trade-offs, and next steps.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "qa",
          "interview",
          "trade-offs"
        ],
        "challengeWeight": 4,
        "explanation": "Reviewers ask why you chose the stack, what you would do differently, and how it scales. Prepare concise answers with trade-offs. Admit unknowns. Point to ADRs and metrics when useful.",
        "a11yNotes": [],
        "commonMistakes": [
          "Defensive answers",
          "Claiming infinite scale",
          "No idea what you would improve next"
        ],
        "bestPractices": [
          "Prepare trade-off answers",
          "Admit unknowns honestly",
          "Keep a next-steps answer ready"
        ],
        "interviewQuestions": [
          "What questions are common?",
          "How do you discuss trade-offs?",
          "What is a good next-steps answer?"
        ],
        "cheatSheet": [
          {
            "tag": "trade-off",
            "desc": "Balanced reason for a choice"
          },
          {
            "tag": "scale answer",
            "desc": "Honest limits and next scaling step"
          },
          {
            "tag": "unknown",
            "desc": "Something you have not validated yet"
          }
        ]
      },
      {
        "slug": "recording-backup",
        "title": "Recording Backup",
        "summary": "A short recorded walkthrough saves you if live demo fails.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "recording",
          "backup",
          "video"
        ],
        "challengeWeight": 3,
        "explanation": "Record a 2-3 minute walkthrough of the happy path. Store it offline and in the cloud. Use it if the network dies. Mention it as backup, not as the default. Keep it updated to the frozen build.",
        "a11yNotes": [],
        "commonMistakes": [
          "No backup when wifi fails",
          "Outdated recording that differs from live app",
          "Recording that is longer than the talk"
        ],
        "bestPractices": [
          "Record the happy path short",
          "Match the frozen build",
          "Keep offline and cloud copies"
        ],
        "interviewQuestions": [
          "Why record a backup?",
          "How long should it be?",
          "What build should it match?"
        ],
        "cheatSheet": [
          {
            "tag": "walkthrough",
            "desc": "Recorded happy-path demo"
          },
          {
            "tag": "offline copy",
            "desc": "Local file if network fails"
          },
          {
            "tag": "frozen build",
            "desc": "Same revision as the live demo"
          }
        ]
      }
    ]
  }
];

export function flattenShipTopics(): ShipTopicDef[] {
  return SHIP_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
