import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  defaultReferenceSolution,
  defaultTakeaways,
  inferThinkingKind,
  type ThinkingChallengeData,
  type ThinkingChallengeKind,
  type ThinkingMcqOption,
} from "@/features/curriculum/lib/thinking-challenge";

export type ProgrammingFundamentalsChallenge = {
  id: string;
  weekId: number;
  topicSlug: string;
  lesson: LearnLesson;
  source: "synthetic";
  experience: "thinking";
  thinking: ThinkingChallengeData;
};

type ChallengeSpec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind?: ThinkingChallengeKind;
  statement: string;
  task: string;
  hints: string[];
  referenceSolution?: string;
  takeaways?: string[];
  options?: ThinkingMcqOption[];
  arrangeSteps?: string[];
};

/** LearnLesson kept for hub cards/progress — never opens a code editor for PF. */
function buildLesson(
  topicSlug: string,
  topicTitle: string,
  spec: ChallengeSpec,
  thinking: ThinkingChallengeData
): LearnLesson {
  const id = `pf-${topicSlug}-${spec.key}`;
  return {
    id,
    topicSlug,
    weekId: 0,
    title: spec.title,
    difficulty: spec.difficulty,
    category: "database-design",
    description: `${topicTitle} — ${spec.title}`,
    problemStatement: `## Scenario\n\n${thinking.scenario}\n\n## Your task\n\n${thinking.task}`,
    erDiagram: thinking.scenario,
    tables: [],
    relationships: [],
    normalization: thinking.takeaways.join("\n"),
    indexes: [],
    realWorldExample: thinking.referenceSolution,
    commonMistakes: [
      "Jumping to tools before understanding the problem",
      "Skipping edge cases and clarifying questions",
    ],
    editorLanguage: "text",
    estimatedMinutes: spec.minutes,
    problemType: thinking.kind === "multiple-choice" ? "mcq" : "logic",
    hints: thinking.hints,
    constraints:
      thinking.kind === "arrange-steps"
        ? ["No code editor — drag steps into the correct order"]
        : ["No code editor — choose the best answer"],
    exampleInput: "See scenario",
    exampleOutput:
      thinking.kind === "arrange-steps"
        ? "Steps in correct order"
        : "One selected option",
    stepByStepExplanation: thinking.referenceSolution,
  };
}

function buildThinking(
  topicSlug: string,
  index: number,
  spec: ChallengeSpec
): ThinkingChallengeData {
  const kind = spec.kind ?? inferThinkingKind(topicSlug, index);
  return {
    kind,
    title: spec.title,
    difficulty: spec.difficulty,
    estimatedMinutes: spec.minutes,
    scenario: spec.statement,
    task: spec.task,
    hints: spec.hints,
    referenceSolution:
      spec.referenceSolution ??
      defaultReferenceSolution(spec.task, kind),
    takeaways: spec.takeaways ?? defaultTakeaways(kind),
    options: spec.options,
    arrangeSteps: spec.arrangeSteps,
  };
}

function topicChallenges(
  topicSlug: string,
  topicTitle: string,
  specs: ChallengeSpec[]
): ProgrammingFundamentalsChallenge[] {
  return specs.map((spec, index) => {
    const thinking = buildThinking(topicSlug, index, spec);
    const lesson = buildLesson(topicSlug, topicTitle, spec, thinking);
    return {
      id: lesson.id,
      weekId: 0,
      topicSlug,
      lesson,
      source: "synthetic" as const,
      experience: "thinking" as const,
      thinking,
    };
  });
}

const THINKING: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Restate the problem in your own words",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement:
      "A teammate asks you to build a login form. Before coding, developers restate what success looks like.",
    task: "Choose the best restatement of the problem.",
    hints: ["Think user-first", "Success and failure paths both matter"],
    options: [
      {
        id: "a",
        label: "Build a React form with validation hooks",
        correct: false,
      },
      {
        id: "b",
        label:
          "Let users sign in with email/password; on success they reach the app; on failure they see a clear error and can retry",
        correct: true,
      },
      {
        id: "c",
        label: "Add JWT authentication to the backend API",
        correct: false,
      },
      {
        id: "d",
        label: "Make the login page look modern and responsive",
        correct: false,
      },
    ],
    referenceSolution:
      "The best restatement names user-visible outcomes: fields shown, success path (enter app), failure path (error + retry). It avoids jumping to tools (React, JWT) or UI polish alone.",
    takeaways: [
      "Restate outcomes before choosing a tech stack.",
      "Success and failure paths are part of the problem.",
      "User language beats jargon in early planning.",
    ],
  },
  {
    key: "e2",
    title: "Identify inputs and outputs",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement:
      "A program calculates a student's grade from assignment scores.",
    task: "Choose the best INPUT / OUTPUT pairing.",
    hints: ["Inputs are data going in", "Output is the result"],
    options: [
      {
        id: "a",
        label: "INPUT: letter grade — OUTPUT: assignment scores",
        correct: false,
      },
      {
        id: "b",
        label: "INPUT: assignment scores — OUTPUT: letter grade or percentage",
        correct: true,
      },
      {
        id: "c",
        label: "INPUT: the grading program — OUTPUT: the student",
        correct: false,
      },
      {
        id: "d",
        label: "INPUT: pass/fail flag — OUTPUT: weights and scale",
        correct: false,
      },
    ],
    referenceSolution:
      "Inputs are data the program reads (scores, optionally weights/scale). Outputs are computed results (grade, percentage, pass/fail).",
  },
  {
    key: "e3",
    title: "Spot missing information",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement:
      "Requirement: 'Send users a reminder email.' Several details are ambiguous.",
    task: "Which clarifying question is most important to ask first?",
    hints: ["Who receives it?", "When is it due?"],
    options: [
      {
        id: "a",
        label: "Which email font should we use?",
        correct: false,
      },
      {
        id: "b",
        label: "Which users should receive reminders and when are they due?",
        correct: true,
      },
      {
        id: "c",
        label: "Should the email server use TLS 1.3?",
        correct: false,
      },
      {
        id: "d",
        label: "What color is the Send button?",
        correct: false,
      },
    ],
    referenceSolution:
      "Audience and timing define the feature. Font, TLS version, and button color are implementation details that come later.",
  },
  {
    key: "m1",
    title: "Decompose a daily routine",
    difficulty: "medium",
    minutes: 15,
    kind: "arrange-steps",
    statement:
      "Developers decompose big tasks into ordered steps — like instructing a robot to make breakfast.",
    task: "Arrange these steps in a sensible order.",
    hints: ["Gather before cook", "Each step is one action"],
    arrangeSteps: [
      "Gather ingredients and tools",
      "Heat the pan or appliance",
      "Cook the food",
      "Plate and serve",
      "Clean up",
    ],
    referenceSolution:
      "1. Gather ingredients and tools\n2. Heat the pan or appliance\n3. Cook the food\n4. Plate and serve\n5. Clean up\n\nYou need ingredients before cooking; cleanup comes last.",
  },
  {
    key: "m2",
    title: "Find the smallest first step",
    difficulty: "medium",
    minutes: 15,
    kind: "multiple-choice",
    statement:
      "You must build a todo app. The full app feels overwhelming.",
    task: "Choose the best first feature to build (MVP thinking).",
    hints: ["One core loop", "Smallest useful slice"],
    options: [
      {
        id: "a",
        label: "User accounts, OAuth, and profile photos",
        correct: false,
      },
      {
        id: "b",
        label: "Add, view, and mark one todo item complete on a single screen",
        correct: true,
      },
      {
        id: "c",
        label: "Push notifications and calendar sync",
        correct: false,
      },
      {
        id: "d",
        label: "Full mobile app with offline mode and themes",
        correct: false,
      },
    ],
    referenceSolution:
      "The smallest useful loop is add → view → complete one todo. Auth, notifications, and polish can follow once the core works.",
  },
  {
    key: "m3",
    title: "Compare two approaches",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement:
      "You can sort a list by copying to a new array or sorting in place.",
    task: "When is sorting in place usually the better choice?",
    hints: ["Memory vs mutating original"],
    options: [
      {
        id: "a",
        label: "When you must keep the original list unchanged for other code",
        correct: false,
      },
      {
        id: "b",
        label: "When memory is tight and nothing else needs the original order",
        correct: true,
      },
      {
        id: "c",
        label: "When you always want a new array reference for immutability",
        correct: false,
      },
      {
        id: "d",
        label: "When the list is read-only and shared across threads",
        correct: false,
      },
    ],
    referenceSolution:
      "In-place saves memory but mutates the original. Copy-then-sort preserves the original — better when other code still needs it.",
  },
  {
    key: "h1",
    title: "Design before code: ticket machine",
    difficulty: "hard",
    minutes: 25,
    kind: "multiple-choice",
    statement:
      "A cinema ticket machine sells adult and child tickets with a daily limit.",
    task: "What should you define before writing any code?",
    hints: ["Entities, rules, edge cases"],
    options: [
      {
        id: "a",
        label: "CSS theme colors and button hover states",
        correct: false,
      },
      {
        id: "b",
        label:
          "Ticket types, prices, inventory rules, sold-out behavior, and the step-by-step purchase flow",
        correct: true,
      },
      {
        id: "c",
        label: "Which npm package to use for the UI",
        correct: false,
      },
      {
        id: "d",
        label: "The variable names in the first function",
        correct: false,
      },
    ],
    referenceSolution:
      "Design captures entities (ticket types, prices), rules (daily limit), edge cases (sold out, invalid selection), and flow before tools or syntax.",
  },
  {
    key: "h2",
    title: "Trade-off decision",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Deadline is tomorrow; the feature is half done.",
    task: "Choose the best professional response.",
    hints: ["Scope cut is normal", "Communicate early"],
    options: [
      {
        id: "a",
        label: "Stay silent, ship nothing, and hope no one notices",
        correct: false,
      },
      {
        id: "b",
        label:
          "Propose a smaller shippable slice, name what you defer, and update stakeholders today",
        correct: true,
      },
      {
        id: "c",
        label: "Add three bonus features to impress the team",
        correct: false,
      },
      {
        id: "d",
        label: "Blame the deadline without offering a plan",
        correct: false,
      },
    ],
    referenceSolution:
      "Cut scope to something shippable, be explicit about deferrals, and communicate early. Silence or blame erodes trust.",
  },
  {
    key: "h3",
    title: "Explain like a friend",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement:
      "Explaining forces clarity — a core developer skill.",
    task: "Which explanation of 'algorithm' is best for a non-programmer?",
    hints: ["No jargon", "Everyday analogy"],
    options: [
      {
        id: "a",
        label:
          "An algorithm is a finite sequence of well-defined instructions that terminates in O(n log n) time",
        correct: false,
      },
      {
        id: "b",
        label:
          "An algorithm is a clear step-by-step recipe — like following directions to make tea, in order, until you get the result",
        correct: true,
      },
      {
        id: "c",
        label: "An algorithm is whatever the compiler optimizes",
        correct: false,
      },
      {
        id: "d",
        label: "An algorithm is a type of database index",
        correct: false,
      },
    ],
    referenceSolution:
      "A recipe analogy conveys ordered steps and a predictable outcome without jargon like Big-O or compiler internals.",
  },
];

const DECOMPOSE: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Split a grocery list task",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Big tasks feel smaller when split into subtasks.",
    task: "Which breakdown best splits 'prepare for a week of meals'?",
    hints: ["Plan, shop, prep, store"],
    options: [
      {
        id: "a",
        label: "Buy everything, panic, order takeout",
        correct: false,
      },
      {
        id: "b",
        label: "Plan meals → make shopping list → shop → prep and store portions",
        correct: true,
      },
      {
        id: "c",
        label: "Start cooking without a list",
        correct: false,
      },
      {
        id: "d",
        label: "Only buy snacks for the week",
        correct: false,
      },
    ],
    referenceSolution:
      "A useful breakdown follows the real workflow: plan, list, shop, prep/store — each step is actionable.",
  },
  {
    key: "e2",
    title: "Order the steps",
    difficulty: "easy",
    minutes: 8,
    kind: "arrange-steps",
    statement: "Steps must run in a valid order.",
    task: "Arrange these steps in the correct order for shipping software.",
    hints: ["Design comes first"],
    arrangeSteps: [
      "Design the API",
      "Write the code",
      "Write tests",
      "Deploy",
    ],
    referenceSolution:
      "1. Design the API\n2. Write the code\n3. Write tests\n4. Deploy\n\nDesign unlocks implementation; tests before deploy catches regressions.",
  },
  {
    key: "e3",
    title: "Circle of control",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement:
      "When stuck, separate what you control from what you don't.",
    task: "For 'the app feels slow,' which item is in your control?",
    hints: ["Your code vs user's network"],
    options: [
      {
        id: "a",
        label: "The user's home Wi-Fi quality",
        correct: false,
      },
      {
        id: "b",
        label: "Whether your API makes one query or twenty per page load",
        correct: true,
      },
      {
        id: "c",
        label: "Global internet outages",
        correct: false,
      },
      {
        id: "d",
        label: "The user's device age",
        correct: false,
      },
    ],
    referenceSolution:
      "You control your queries, caching, and bundle size. User network, device, and ISP issues are inputs you can design for but not fix directly.",
  },
  {
    key: "m1",
    title: "WBS: mini project",
    difficulty: "medium",
    minutes: 16,
    kind: "multiple-choice",
    statement: "Work breakdown structures are used in real teams.",
    task: "Which set of deliverables best breaks down 'build a personal portfolio page'?",
    hints: ["Content, layout, deploy"],
    options: [
      {
        id: "a",
        label: "One task: 'finish portfolio'",
        correct: false,
      },
      {
        id: "b",
        label:
          "Write content → design layout → build sections → test on mobile → deploy",
        correct: true,
      },
      {
        id: "c",
        label: "Buy a domain only",
        correct: false,
      },
      {
        id: "d",
        label: "Pick a font, then stop",
        correct: false,
      },
    ],
    referenceSolution:
      "Deliverables should be concrete and ordered: content, layout, build, test, deploy — not one vague blob.",
  },
  {
    key: "m2",
    title: "Dependency map",
    difficulty: "medium",
    minutes: 18,
    kind: "arrange-steps",
    statement: "Some tasks block others.",
    task: "Arrange a sensible build order for these workstreams.",
    hints: ["Schema before API", "Mockup can start early"],
    arrangeSteps: [
      "Database schema",
      "API routes",
      "Auth",
      "UI mockup",
    ],
    referenceSolution:
      "Typical order: Database schema → API routes → Auth → UI mockup (mockup can overlap earlier, but schema/API/auth usually precede wiring real data).",
  },
  {
    key: "m3",
    title: "Reduce scope safely",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Shipping something small beats shipping nothing.",
    task: "For a 'social network app,' what belongs in v1?",
    hints: ["One core loop"],
    options: [
      {
        id: "a",
        label: "Stories, reels, marketplace, and live streaming",
        correct: false,
      },
      {
        id: "b",
        label: "Sign up, post one text update, see a feed of posts",
        correct: true,
      },
      {
        id: "c",
        label: "Full recommendation algorithm and ads platform",
        correct: false,
      },
      {
        id: "d",
        label: "Every feature competitors have on day one",
        correct: false,
      },
    ],
    referenceSolution:
      "v1 is one core loop: create a post, view a feed. Stories, ads, and algorithms are v2+.",
  },
  {
    key: "h1",
    title: "Event planning decomposition",
    difficulty: "hard",
    minutes: 26,
    kind: "multiple-choice",
    statement: "Complex systems need layered breakdown.",
    task: "Which three phases best organize planning a college hackathon?",
    hints: ["Logistics, tech, people"],
    options: [
      {
        id: "a",
        label: "Before, during, after — with no subtasks",
        correct: false,
      },
      {
        id: "b",
        label:
          "Logistics (venue, food) → Program (schedule, judging) → Outreach (registration, mentors)",
        correct: true,
      },
      {
        id: "c",
        label: "Only design the logo",
        correct: false,
      },
      {
        id: "d",
        label: "Start coding the scoring app on day one with no plan",
        correct: false,
      },
    ],
    referenceSolution:
      "Layer goals into phases (logistics, program, outreach), each with concrete tasks underneath.",
  },
  {
    key: "h2",
    title: "Failure recovery plan",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Good developers plan for things going wrong.",
    task: "Your live demo crashes. What do you do first?",
    hints: ["Stay calm", "Have a backup"],
    options: [
      {
        id: "a",
        label: "Leave the call immediately",
        correct: false,
      },
      {
        id: "b",
        label:
          "Acknowledge it calmly, switch to a backup recording or simpler path, and note follow-up",
        correct: true,
      },
      {
        id: "c",
        label: "Argue that the demo environment is always broken",
        correct: false,
      },
      {
        id: "d",
        label: "Restart your laptop for 10 minutes without saying anything",
        correct: false,
      },
    ],
    referenceSolution:
      "Acknowledge, recover with backup (recording, slides, simpler flow), communicate follow-up. Panic or silence wastes the room.",
  },
  {
    key: "h3",
    title: "Estimate uncertainty",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement:
      "Estimation is a skill; ranges beat false precision.",
    task: "Which estimate for 'add user profiles' is most professional?",
    hints: ["State assumptions"],
    options: [
      {
        id: "a",
        label: "Exactly 4.0 hours, no assumptions listed",
        correct: false,
      },
      {
        id: "b",
        label:
          "Best 6h / likely 12h / worst 24h — assumes basic fields, no photo upload, existing auth",
        correct: true,
      },
      {
        id: "c",
        label: "It will take as long as it takes",
        correct: false,
      },
      {
        id: "d",
        label: "Zero hours because AI will do it",
        correct: false,
      },
    ],
    referenceSolution:
      "Give a range with explicit assumptions (fields, auth exists, no uploads). False precision and hand-waving both fail in real teams.",
  },
];

const REQUIREMENTS: ChallengeSpec[] = [
  {
    key: "e1",
    title: "User story basics",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Requirements often arrive as user stories.",
    task: "Which user story best captures 'Users want dark mode'?",
    hints: ["As a / I want / So that"],
    options: [
      {
        id: "a",
        label: "As a developer, I want dark CSS, so that I practice Tailwind",
        correct: false,
      },
      {
        id: "b",
        label:
          "As a user, I want a dark theme toggle, so that I can reduce eye strain at night",
        correct: true,
      },
      {
        id: "c",
        label: "As a manager, I want fewer tickets, so that KPIs look good",
        correct: false,
      },
      {
        id: "d",
        label: "As a user, I want the app, so that I use the app",
        correct: false,
      },
    ],
    referenceSolution:
      "A good story names the user, the want (toggle), and the why (eye strain) — not developer convenience or vague goals.",
  },
  {
    key: "e2",
    title: "Acceptance criteria",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Done means testable criteria.",
    task: "Which is the best acceptance criterion for 'password reset email'?",
    hints: ["Given/When/Then style works"],
    options: [
      {
        id: "a",
        label: "The feature should feel fast",
        correct: false,
      },
      {
        id: "b",
        label:
          "Given a registered email, when the user requests reset, then they receive a link that expires in 24 hours",
        correct: true,
      },
      {
        id: "c",
        label: "Emails should look nice",
        correct: false,
      },
      {
        id: "d",
        label: "Reset should be secure (no details)",
        correct: false,
      },
    ],
    referenceSolution:
      "Testable criteria specify trigger, action, and observable outcome (link sent, 24h expiry) — not vibes like 'fast' or 'nice'.",
  },
  {
    key: "e3",
    title: "Find the contradiction",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Conflicting requirements cause bugs.",
    task: "'Must be free' and 'must use paid SMS API' — what's the conflict?",
    hints: ["Name the tension"],
    options: [
      {
        id: "a",
        label: "There is no conflict; APIs are always free",
        correct: false,
      },
      {
        id: "b",
        label:
          "Free for users usually conflicts with per-message SMS costs — you need budget, limits, or a different channel",
        correct: true,
      },
      {
        id: "c",
        label: "The conflict is only about font choice",
        correct: false,
      },
      {
        id: "d",
        label: "Paid APIs cannot send SMS",
        correct: false,
      },
    ],
    referenceSolution:
      "Per-message costs clash with 'free for users' unless someone pays (company budget, caps, or email instead of SMS).",
  },
  {
    key: "m1",
    title: "Non-functional requirements",
    difficulty: "medium",
    minutes: 16,
    kind: "multiple-choice",
    statement: "Not all requirements are features.",
    task: "Which is a non-functional requirement for a banking app?",
    hints: ["Performance, accessibility, security"],
    options: [
      {
        id: "a",
        label: "Users can transfer money between accounts",
        correct: false,
      },
      {
        id: "b",
        label: "Login endpoints respond within 2 seconds under normal load",
        correct: true,
      },
      {
        id: "c",
        label: "Users can view transaction history",
        correct: false,
      },
      {
        id: "d",
        label: "Users can set a profile photo",
        correct: false,
      },
    ],
    referenceSolution:
      "NFRs describe how the system behaves (speed, security, uptime) — not a specific feature like transfers or history.",
  },
  {
    key: "m2",
    title: "Assumption log",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Unspoken assumptions break projects.",
    task: "Before building chat, which assumption must be written down?",
    hints: ["Online only? Group chats?"],
    options: [
      {
        id: "a",
        label: "The favicon will be blue",
        correct: false,
      },
      {
        id: "b",
        label: "Messages are 1:1 only vs group rooms — and whether offline delivery is required",
        correct: true,
      },
      {
        id: "c",
        label: "Developers prefer tabs over spaces",
        correct: false,
      },
      {
        id: "d",
        label: "The office has good coffee",
        correct: false,
      },
    ],
    referenceSolution:
      "Chat scope (1:1 vs groups, online-only vs history) changes architecture. Cosmetic and team prefs are not project assumptions.",
  },
  {
    key: "m3",
    title: "Priority matrix",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "You can't build everything at once.",
    task: "Using MoSCoW, where does 'user can log in' belong for an MVP?",
    hints: ["Must have for most apps with accounts"],
    options: [
      {
        id: "a",
        label: "Won't have",
        correct: false,
      },
      {
        id: "b",
        label: "Must have",
        correct: true,
      },
      {
        id: "c",
        label: "Could have — only if time remains after themes and animations",
        correct: false,
      },
      {
        id: "d",
        label: "Should have — after custom emoji reactions",
        correct: false,
      },
    ],
    referenceSolution:
      "Auth is Must for apps that need accounts. Themes and emoji reactions are Could/Won't for MVP.",
  },
  {
    key: "h1",
    title: "Ambiguous spec rewrite",
    difficulty: "hard",
    minutes: 26,
    kind: "multiple-choice",
    statement: "Vague specs need refinement.",
    task: "Which turns 'make it fast and secure' into a measurable requirement?",
    hints: ["Numbers and tests"],
    options: [
      {
        id: "a",
        label: "The app should be faster and more secure",
        correct: false,
      },
      {
        id: "b",
        label:
          "P95 page load under 2s on 4G; passwords hashed with bcrypt; sessions expire after 30 minutes idle",
        correct: true,
      },
      {
        id: "c",
        label: "Use the fastest framework",
        correct: false,
      },
      {
        id: "d",
        label: "Security is important to us",
        correct: false,
      },
    ],
    referenceSolution:
      "Measurable reqs name metrics (P95 < 2s), algorithms (bcrypt), and session policy — not adjectives alone.",
  },
  {
    key: "h2",
    title: "Stakeholder questions",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Freshers must ask good questions early.",
    task: "A client wants 'an AI app' with no details. What do you ask first?",
    hints: ["Users, problem, success"],
    options: [
      {
        id: "a",
        label: "Which GPU should we buy?",
        correct: false,
      },
      {
        id: "b",
        label:
          "Who is the user, what problem should the app solve, and how will we know it succeeded?",
        correct: true,
      },
      {
        id: "c",
        label: "Can we use purple in the logo?",
        correct: false,
      },
      {
        id: "d",
        label: "Should we fine-tune a 70B model this week?",
        correct: false,
      },
    ],
    referenceSolution:
      "Start with user, problem, and success criteria — before hardware, branding, or model size.",
  },
  {
    key: "h3",
    title: "Scope creep response",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Mid-project changes happen.",
    task: "Asked to add payments mid-sprint. Best response?",
    hints: ["Impact on timeline", "Trade-offs"],
    options: [
      {
        id: "a",
        label: "Say yes silently and miss the original deadline",
        correct: false,
      },
      {
        id: "b",
        label:
          "Explain impact on timeline, propose trade-offs (swap scope or extend date), get written agreement",
        correct: true,
      },
      {
        id: "c",
        label: "Refuse without discussion",
        correct: false,
      },
      {
        id: "d",
        label: "Add payments and drop all testing",
        correct: false,
      },
    ],
    referenceSolution:
      "Surface impact, offer trade-offs, align in writing. Silent yes or dropping quality both fail professionally.",
  },
];

const PSEUDOCODE: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Pseudocode: find max",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Pseudocode is language-agnostic planning.",
    task: "Which pseudocode correctly finds the largest number in a list?",
    hints: ["Initialize max", "Loop and compare"],
    options: [
      {
        id: "a",
        label: "RETURN first item only",
        correct: false,
      },
      {
        id: "b",
        label:
          "SET max = first item\nFOR each number in list\n  IF number > max THEN max = number\nRETURN max",
        correct: true,
      },
      {
        id: "c",
        label: "FOR each number\n  RETURN number",
        correct: false,
      },
      {
        id: "d",
        label: "SET max = 0 always, then RETURN max",
        correct: false,
      },
    ],
    referenceSolution:
      "Initialize from the list, compare each item, update max. Returning on first iteration or assuming 0 fails for negatives.",
  },
  {
    key: "e2",
    title: "Flowchart in text",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Flowcharts show decision paths.",
    task: "Score >= 60 means pass. Which flow is correct?",
    hints: ["Start → decision → outcomes"],
    options: [
      {
        id: "a",
        label: "Start → Pass → End (no score read)",
        correct: false,
      },
      {
        id: "b",
        label:
          "Start → Read score → score >= 60? Yes: Pass / No: Fail → End",
        correct: true,
      },
      {
        id: "c",
        label: "Start → Fail always → End",
        correct: false,
      },
      {
        id: "d",
        label: "Start → Read score → Pass and Fail → End",
        correct: false,
      },
    ],
    referenceSolution:
      "Read input, one decision, two exclusive outcomes, then end.",
  },
  {
    key: "e3",
    title: "Trace a simple loop",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Tracing builds mental models.",
    task: "A loop prints integers 1 to 5 (one per line). What is the output?",
    hints: ["One number per line"],
    options: [
      {
        id: "a",
        label: "1 2 3 4 5 on one line",
        correct: false,
      },
      {
        id: "b",
        label: "1\n2\n3\n4\n5",
        correct: true,
      },
      {
        id: "c",
        label: "0\n1\n2\n3\n4",
        correct: false,
      },
      {
        id: "d",
        label: "5\n4\n3\n2\n1",
        correct: false,
      },
    ],
    referenceSolution: "1 through 5, each on its own line.",
  },
  {
    key: "m1",
    title: "Pseudocode: login check",
    difficulty: "medium",
    minutes: 16,
    kind: "multiple-choice",
    statement: "Auth flows are everywhere.",
    task: "Read username/password, check match. Best pseudocode?",
    hints: ["Handle wrong password"],
    options: [
      {
        id: "a",
        label: "PRINT welcome always",
        correct: false,
      },
      {
        id: "b",
        label:
          "READ username, password\nIF stored credentials match THEN PRINT success\nELSE PRINT invalid credentials",
        correct: true,
      },
      {
        id: "c",
        label: "IF username is empty THEN PRINT success",
        correct: false,
      },
      {
        id: "d",
        label: "DELETE user on first wrong try",
        correct: false,
      },
    ],
    referenceSolution:
      "Read both fields, branch on match vs mismatch — no unconditional success or destructive failure.",
  },
  {
    key: "m2",
    title: "Nested decisions",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Real logic branches.",
    task: "Shipping: free over $50, else $5; +$10 if express. Order $40 express. Total?",
    hints: ["Nested if"],
    options: [
      {
        id: "a",
        label: "$0 (free shipping always)",
        correct: false,
      },
      {
        id: "b",
        label: "$15 ($5 base + $10 express)",
        correct: true,
      },
      {
        id: "c",
        label: "$10 (express only)",
        correct: false,
      },
      {
        id: "d",
        label: "$5 (ignores express)",
        correct: false,
      },
    ],
    referenceSolution:
      "$40 is not over $50 → $5 base. Express adds $10 → $15 total.",
  },
  {
    key: "m3",
    title: "Loop pattern: accumulate",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Accumulators are a core pattern.",
    task: "Which pseudocode sums all numbers in a list?",
    hints: ["sum = sum + item"],
    options: [
      {
        id: "a",
        label: "SET sum = 0\nFOR each item\n  sum = sum + item\nRETURN sum",
        correct: true,
      },
      {
        id: "b",
        label: "RETURN item without loop",
        correct: false,
      },
      {
        id: "c",
        label: "SET sum = 1 and never add",
        correct: false,
      },
      {
        id: "d",
        label: "FOR each item\n  sum = item (overwrite each time)",
        correct: false,
      },
    ],
    referenceSolution:
      "Start sum at 0, add each item in a loop, return final sum.",
  },
  {
    key: "h1",
    title: "Design a vending machine flow",
    difficulty: "hard",
    minutes: 26,
    kind: "arrange-steps",
    statement: "State machines appear in many apps.",
    task: "Arrange the steps for a basic vending purchase.",
    hints: ["Handle insufficient funds"],
    arrangeSteps: [
      "User selects item",
      "User inserts payment",
      "Check payment >= price",
      "Dispense item and return change",
    ],
    referenceSolution:
      "Select → pay → verify funds → dispense/change. Checking payment before dispense prevents free items.",
  },
  {
    key: "h2",
    title: "Refine messy steps",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "First drafts of logic are rarely clean.",
    task: "Improve: 'do stuff, check thing, maybe fix'. Best replacement?",
    hints: ["Be specific", "Name variables"],
    options: [
      {
        id: "a",
        label: "do stuff again, check thing twice, maybe fix",
        correct: false,
      },
      {
        id: "b",
        label:
          "READ inputFile\nVALIDATE rows are not empty\nIF invalid THEN LOG error and STOP\nELSE WRITE cleaned rows to outputFile",
        correct: true,
      },
      {
        id: "c",
        label: "fix everything magically",
        correct: false,
      },
      {
        id: "d",
        label: "check thing only if you feel like it",
        correct: false,
      },
    ],
    referenceSolution:
      "Name inputs/outputs, explicit validation, clear branch outcomes — not vague 'stuff' and 'maybe'.",
  },
  {
    key: "h3",
    title: "Pseudocode to code gap",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Translation is a skill.",
    task: "After pseudocode for pass/fail across 3 scores, what does real code add?",
    hints: ["Syntax, types, I/O"],
    options: [
      {
        id: "a",
        label: "Nothing — pseudocode runs directly",
        correct: false,
      },
      {
        id: "b",
        label:
          "Concrete syntax, types, input parsing, and error handling for bad input",
        correct: true,
      },
      {
        id: "c",
        label: "Only comments; logic disappears",
        correct: false,
      },
      {
        id: "d",
        label: "A requirement to remove all if-statements",
        correct: false,
      },
    ],
    referenceSolution:
      "Real languages add syntax, types, I/O, and edge-case handling on top of the planned steps.",
  },
];

const VARIABLES: ChallengeSpec[] = [
  {
    key: "e1",
    title: "What is state?",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Programs remember values in variables.",
    task: "Which best describes state in a shopping cart app?",
    hints: ["Values that change as the user acts"],
    options: [
      {
        id: "a",
        label: "The programming language version",
        correct: false,
      },
      {
        id: "b",
        label: "cartTotal, itemCount, and line items — values that update as the user shops",
        correct: true,
      },
      {
        id: "c",
        label: "The color of the checkout button only",
        correct: false,
      },
      {
        id: "d",
        label: "Comments in the source file",
        correct: false,
      },
    ],
    referenceSolution:
      "State is data the program remembers and updates (totals, counts, items) — not tooling or static styling alone.",
  },
  {
    key: "e2",
    title: "Naming matters",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Good names reduce bugs.",
    task: "Best rename for a temperature converter using `x`, `temp`, `data`?",
    hints: ["celsius, fahrenheit, result"],
    options: [
      {
        id: "a",
        label: "a, b, c",
        correct: false,
      },
      {
        id: "b",
        label: "celsiusInput, fahrenheitOutput, conversionFactor",
        correct: true,
      },
      {
        id: "c",
        label: "thing1, thing2, thing3",
        correct: false,
      },
      {
        id: "d",
        label: "x, temp, data (keep as-is)",
        correct: false,
      },
    ],
    referenceSolution:
      "Names should reveal role: input unit, output unit, factor — not single letters or 'data'.",
  },
  {
    key: "e3",
    title: "Constants vs variables",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Some values shouldn't change.",
    task: "In a tax calculator, what should usually be a constant?",
    hints: ["Tax rate might be fixed per release"],
    options: [
      {
        id: "a",
        label: "The user's purchase amount",
        correct: false,
      },
      {
        id: "b",
        label: "The tax rate configured for this app version",
        correct: true,
      },
      {
        id: "c",
        label: "The running total tax owed per cart",
        correct: false,
      },
      {
        id: "d",
        label: "The number of items the user adds",
        correct: false,
      },
    ],
    referenceSolution:
      "Purchase amount and running totals change per user/action. Tax rate is often fixed until config changes.",
  },
  {
    key: "m1",
    title: "Track changing values",
    difficulty: "medium",
    minutes: 15,
    kind: "multiple-choice",
    statement: "Follow value updates line by line.",
    task: "Trace: count=0; count++; count+=2; What is count?",
    hints: ["Trace: 0→1→3"],
    options: [
      {
        id: "a",
        label: "0",
        correct: false,
      },
      {
        id: "b",
        label: "3",
        correct: true,
      },
      {
        id: "c",
        label: "2",
        correct: false,
      },
      {
        id: "d",
        label: "1",
        correct: false,
      },
    ],
    referenceSolution: "count ends at 3.\n0 → 1 (count++) → 3 (count+=2).",
  },
  {
    key: "m2",
    title: "Swap two values",
    difficulty: "medium",
    minutes: 16,
    kind: "arrange-steps",
    statement: "Swapping needs a temporary holder.",
    task: "Arrange the steps to swap a and b using temp.",
    hints: ["temp = a; a = b; b = temp"],
    arrangeSteps: [
      "SET temp = a",
      "SET a = b",
      "SET b = temp",
    ],
    referenceSolution:
      "temp = a → a = b → b = temp. Skipping temp loses one value.",
  },
  {
    key: "m3",
    title: "Invalid state detection",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Validate before using data.",
    task: "Best rule before storing age?",
    hints: ["Range checks"],
    options: [
      {
        id: "a",
        label: "Accept any number including -1 and 200",
        correct: false,
      },
      {
        id: "b",
        label: "Reject if age < 0 or age > 120; show a clear error",
        correct: true,
      },
      {
        id: "c",
        label: "Store age as text with no validation",
        correct: false,
      },
      {
        id: "d",
        label: "Only validate on the homepage, not the form",
        correct: false,
      },
    ],
    referenceSolution:
      "Validate at the point of entry with sensible bounds and user-visible errors.",
  },
  {
    key: "h1",
    title: "Model a bank balance",
    difficulty: "hard",
    minutes: 26,
    kind: "multiple-choice",
    statement: "State changes must stay consistent.",
    task: "Withdraw must never go below zero. Best rule?",
    hints: ["Check balance before withdraw"],
    options: [
      {
        id: "a",
        label: "Allow any withdraw; fix negative balance later",
        correct: false,
      },
      {
        id: "b",
        label: "IF amount <= balance THEN subtract ELSE reject withdraw",
        correct: true,
      },
      {
        id: "c",
        label: "Set balance to zero after every transaction",
        correct: false,
      },
      {
        id: "d",
        label: "Withdraw twice the requested amount",
        correct: false,
      },
    ],
    referenceSolution:
      "Guard withdraw with balance check — reject invalid state instead of repairing after the fact.",
  },
  {
    key: "h2",
    title: "Shadowing confusion",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Same names in different scopes confuse beginners.",
    task: "Outer count=5; inner block declares count=2. Inside inner block, count is?",
    hints: ["Inner binding hides outer"],
    options: [
      {
        id: "a",
        label: "Always 5 everywhere",
        correct: false,
      },
      {
        id: "b",
        label: "2 inside the inner block; outer count stays 5 outside",
        correct: true,
      },
      {
        id: "c",
        label: "7 (automatically added)",
        correct: false,
      },
      {
        id: "d",
        label: "Undefined in the inner block",
        correct: false,
      },
    ],
    referenceSolution:
      "Inner declaration shadows outer inside that block; outer variable is unchanged outside.",
  },
  {
    key: "h3",
    title: "Design data for a quiz app",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Choosing data shapes is design work.",
    task: "Minimum data to track one quiz attempt?",
    hints: ["Questions, answers, score"],
    options: [
      {
        id: "a",
        label: "Only a single number with no context",
        correct: false,
      },
      {
        id: "b",
        label:
          "List of questions (prompt + options), user's selected answers, and computed score",
        correct: true,
      },
      {
        id: "c",
        label: "The developer's favorite color",
        correct: false,
      },
      {
        id: "d",
        label: "Entire browser history",
        correct: false,
      },
    ],
    referenceSolution:
      "Need question content, user selections, and score — structured enough to grade and review.",
  },
];

const LOGIC: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Truth table: AND",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Decisions combine conditions.",
    task: "When is A AND B true?",
    hints: ["True only when both true"],
    options: [
      { id: "a", label: "When A is true and B is false", correct: false },
      { id: "b", label: "When both A and B are true", correct: true },
      { id: "c", label: "When either A or B is true", correct: false },
      { id: "d", label: "When both are false", correct: false },
    ],
    referenceSolution: "AND is true only when both sides are true.",
  },
  {
    key: "e2",
    title: "Simple eligibility",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Rules become if-statements.",
    task: "Print eligible if age >= 18 else not eligible. Age 17. Output?",
    hints: ["One if-else"],
    options: [
      { id: "a", label: "eligible", correct: false },
      { id: "b", label: "not eligible", correct: true },
      { id: "c", label: "both messages", correct: false },
      { id: "d", label: "no output", correct: false },
    ],
    referenceSolution: "17 < 18 → not eligible.",
  },
  {
    key: "e3",
    title: "Grade boundaries",
    difficulty: "easy",
    minutes: 10,
    kind: "multiple-choice",
    statement: "Ranges need careful boundaries.",
    task: "A: 90+, B: 80-89, C: 70-79, F: below 70. Score 89?",
    hints: ["Watch off-by-one"],
    options: [
      { id: "a", label: "A", correct: false },
      { id: "b", label: "B", correct: true },
      { id: "c", label: "C", correct: false },
      { id: "d", label: "F", correct: false },
    ],
    referenceSolution: "89 is in 80-89 → B. 90 would be A.",
  },
  {
    key: "m1",
    title: "Combine conditions",
    difficulty: "medium",
    minutes: 16,
    kind: "multiple-choice",
    statement: "Real rules use AND/OR.",
    task: "A shop gives a discount if the shopper is a member AND total > 100. Which case gets the discount?",
    hints: ["Both conditions must hold"],
    options: [
      { id: "a", label: "Member, total = 80", correct: false },
      { id: "b", label: "Non-member, total = 150", correct: false },
      { id: "c", label: "Member, total = 120", correct: true },
      { id: "d", label: "Non-member, total = 50", correct: false },
    ],
    referenceSolution: "Both conditions must hold: member AND total > 100 → option C.",
  },
  {
    key: "m2",
    title: "Else-if ladder",
    difficulty: "medium",
    minutes: 18,
    kind: "arrange-steps",
    statement: "Multiple exclusive branches need order.",
    task: "Arrange checks for grade tiers from highest to lowest threshold.",
    hints: ["Check A before B before C"],
    arrangeSteps: [
      "IF score >= 90 THEN grade = A",
      "ELSE IF score >= 80 THEN grade = B",
      "ELSE IF score >= 70 THEN grade = C",
      "ELSE grade = F",
    ],
    referenceSolution:
      "Highest threshold first — otherwise a 95 might match B if you check 80 before 90.",
  },
  {
    key: "m3",
    title: "Guard clauses",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Early returns simplify logic.",
    task: "When are guard clauses usually better than deep nesting?",
    hints: ["Fail fast pattern"],
    options: [
      {
        id: "a",
        label: "When invalid inputs should exit early before main work",
        correct: true,
      },
      {
        id: "b",
        label: "When you want six levels of nested ifs for readability",
        correct: false,
      },
      {
        id: "c",
        label: "When every path must run the same 200 lines first",
        correct: false,
      },
      {
        id: "d",
        label: "When you never validate input",
        correct: false,
      },
    ],
    referenceSolution:
      "Guard clauses handle invalid/edge cases upfront, keeping the happy path flat.",
  },
  {
    key: "h1",
    title: "Complex rule engine",
    difficulty: "hard",
    minutes: 26,
    kind: "multiple-choice",
    statement: "Shipping rules stack up.",
    task: "Free shipping if premium OR (order > 50 AND domestic). Who gets free shipping?",
    hints: ["Parentheses matter"],
    options: [
      {
        id: "a",
        label: "Non-premium, order $40, domestic",
        correct: false,
      },
      {
        id: "b",
        label: "Non-premium, order $60, international",
        correct: false,
      },
      {
        id: "c",
        label: "Premium member, order $10, international",
        correct: true,
      },
      {
        id: "d",
        label: "Non-premium, order $50 exactly, domestic",
        correct: false,
      },
    ],
    referenceSolution:
      "Premium alone qualifies. Non-premium needs order > 50 AND domestic — $50 exactly does not qualify (> not >=).",
  },
  {
    key: "h2",
    title: "Find the bug in logic",
    difficulty: "hard",
    minutes: 28,
    kind: "multiple-choice",
    statement: "Debugging starts with expected vs actual.",
    task: "Pass rule uses score > 60. Score 60 fails. What's wrong?",
    hints: ["Boundary bug"],
    options: [
      {
        id: "a",
        label: "Nothing; 60 should fail",
        correct: false,
      },
      {
        id: "b",
        label: "Should use >= 60 if '60 or above' is pass",
        correct: true,
      },
      {
        id: "c",
        label: "Should use score < 60 for pass",
        correct: false,
      },
      {
        id: "d",
        label: "Remove all comparisons",
        correct: false,
      },
    ],
    referenceSolution:
      "Expected: 60 should pass if the rule is '60 or above'.\nBug: using > instead of >=.\nFix: pass when score >= 60.",
  },
  {
    key: "h3",
    title: "Decision tree",
    difficulty: "hard",
    minutes: 28,
    kind: "arrange-steps",
    statement: "Trees model multi-step decisions.",
    task: "Arrange basic tech-support triage steps.",
    hints: ["Simple checks before heavy fixes"],
    arrangeSteps: [
      "Ask if device is powered on",
      "Check Wi-Fi connection",
      "Try restart",
      "Escalate if still broken",
    ],
    referenceSolution:
      "Power → network → restart → escalate. Skipping cheap checks wastes time.",
  },
];

const PATTERNS: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Repeat a pattern",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Loops repeat work.",
    task: "Print 'Study' 5 times with line numbers 1-5. Best approach?",
    hints: ["for loop with counter"],
    options: [
      {
        id: "a",
        label: "Write five separate print statements only — no loop",
        correct: false,
      },
      {
        id: "b",
        label: "FOR i from 1 to 5\n  PRINT i + '. Study'",
        correct: true,
      },
      {
        id: "c",
        label: "WHILE true forever",
        correct: false,
      },
      {
        id: "d",
        label: "PRINT once and hope it repeats",
        correct: false,
      },
    ],
    referenceSolution:
      "A counted loop produces numbered lines without infinite repetition or copy-paste five times.",
  },
  {
    key: "e2",
    title: "Count down",
    difficulty: "easy",
    minutes: 8,
    kind: "multiple-choice",
    statement: "Loop direction matters.",
    task: "Countdown 5 to 1 then 'Go!'. Correct output sequence?",
    hints: ["Descending then final line"],
    options: [
      {
        id: "a",
        label: "1, 2, 3, 4, 5, Go!",
        correct: false,
      },
      {
        id: "b",
        label: "5, 4, 3, 2, 1, Go!",
        correct: true,
      },
      {
        id: "c",
        label: "Go! only",
        correct: false,
      },
      {
        id: "d",
        label: "5, 5, 5, 5, 5",
        correct: false,
      },
    ],
    referenceSolution: "Descending 5→1, then print Go! once.",
  },
  {
    key: "m1",
    title: "Sum 1 to N",
    difficulty: "medium",
    minutes: 16,
    kind: "multiple-choice",
    statement: "Accumulator in a loop.",
    task: "Sum 1..10. Best pattern?",
    hints: ["sum += i"],
    options: [
      {
        id: "a",
        label: "SET sum = 0\nFOR i from 1 to 10\n  sum = sum + i\nPRINT sum",
        correct: true,
      },
      {
        id: "b",
        label: "PRINT 10 only",
        correct: false,
      },
      {
        id: "c",
        label: "Multiply without loop and call it sum",
        correct: false,
      },
      {
        id: "d",
        label: "SET sum = 10 before loop and never add",
        correct: false,
      },
    ],
    referenceSolution: "Initialize sum=0, add each i, print final sum (55).",
  },
  {
    key: "m2",
    title: "Find first match",
    difficulty: "medium",
    minutes: 18,
    kind: "multiple-choice",
    statement: "Search loops stop early.",
    task: "Find first even number in a list. Best approach?",
    hints: ["break when found"],
    options: [
      {
        id: "a",
        label: "Always scan entire list even after finding one",
        correct: false,
      },
      {
        id: "b",
        label:
          "FOR each number\n  IF number is even THEN save it and STOP loop",
        correct: true,
      },
      {
        id: "c",
        label: "Return the last odd number",
        correct: false,
      },
      {
        id: "d",
        label: "Skip the loop and guess",
        correct: false,
      },
    ],
    referenceSolution:
      "Stop at first match — no need to scan the rest once found.",
  },
  {
    key: "h1",
    title: "Debug the infinite loop",
    difficulty: "hard",
    minutes: 26,
    kind: "multiple-choice",
    statement: "Infinite loops haunt beginners.",
    task: "while (i < 10) { print(i); } — i never changes. Fix?",
    hints: ["Update loop variable"],
    options: [
      {
        id: "a",
        label: "Remove the condition",
        correct: false,
      },
      {
        id: "b",
        label: "Increment i each iteration so the exit condition can become true",
        correct: true,
      },
      {
        id: "c",
        label: "Print i one more time",
        correct: false,
      },
      {
        id: "d",
        label: "Change 10 to 10_000_000",
        correct: false,
      },
    ],
    referenceSolution:
      "Without updating i, the condition stays true forever. Increment (or otherwise advance) i each iteration.",
  },
  {
    key: "h2",
    title: "Debugging mindset",
    difficulty: "hard",
    minutes: 28,
    kind: "arrange-steps",
    statement:
      "Debugging mindset: hypothesis → test → learn.",
    task: "Arrange the steps for tackling an off-by-one bug.",
    hints: ["Scientific method"],
    arrangeSteps: [
      "Observe symptom (wrong last item)",
      "Form hypothesis (loop stops one early)",
      "Test with small input and log indices",
      "Fix boundary and verify",
    ],
    referenceSolution:
      "Observe → hypothesize → test → fix. Random edits skip learning.",
  },
];

const BANK: Array<{
  slug: string;
  title: string;
  specs: ChallengeSpec[];
}> = [
  {
    slug: "thinking-like-a-developer",
    title: "Thinking Like a Developer",
    specs: THINKING,
  },
  {
    slug: "breaking-down-problems",
    title: "Breaking Down Problems",
    specs: DECOMPOSE,
  },
  {
    slug: "understanding-requirements",
    title: "Understanding Requirements",
    specs: REQUIREMENTS,
  },
  {
    slug: "pseudocode-and-flowcharts",
    title: "Pseudocode & Flowcharts",
    specs: PSEUDOCODE,
  },
  { slug: "variables-and-state", title: "Variables & State", specs: VARIABLES },
  { slug: "logic-and-decisions", title: "Logic & Decisions", specs: LOGIC },
  {
    slug: "patterns-and-debugging",
    title: "Patterns & Debugging",
    specs: PATTERNS,
  },
];

const CHALLENGES_BY_TOPIC = new Map(
  BANK.map((t) => [t.slug, topicChallenges(t.slug, t.title, t.specs)])
);

export function listProgrammingFundamentalsChallenges(
  topicSlug: string
): ProgrammingFundamentalsChallenge[] {
  return CHALLENGES_BY_TOPIC.get(topicSlug) ?? [];
}

export function allProgrammingFundamentalsChallenges(): ProgrammingFundamentalsChallenge[] {
  return BANK.flatMap((t) => CHALLENGES_BY_TOPIC.get(t.slug) ?? []);
}

export function findProgrammingFundamentalsChallenge(
  topicSlug: string,
  challengeId: string
): ProgrammingFundamentalsChallenge | null {
  const list = listProgrammingFundamentalsChallenges(topicSlug);
  return (
    list.find((c) => c.id === challengeId || c.lesson.id === challengeId) ??
    null
  );
}

export function programmingFundamentalsTopicChallengeCount(
  topicSlug: string
): number {
  return listProgrammingFundamentalsChallenges(topicSlug).length;
}
