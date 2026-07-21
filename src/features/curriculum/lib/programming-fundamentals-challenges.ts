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
    constraints: ["No code editor — write your reasoning"],
    exampleInput: "See scenario",
    exampleOutput: "Clear written answer",
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
    kind: "scenario",
    statement:
      "A teammate asks you to build a login form. Before coding, developers restate what success looks like.",
    task: "Write three bullet points: what the user sees, what happens on success, what happens on failure.",
    hints: ["Think user-first", "Avoid technical jargon in bullets"],
    referenceSolution:
      "• User sees email/password fields and a Sign in button.\n• Success: they enter the app/home screen.\n• Failure: a clear error message; password stays hidden; they can retry.",
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
    kind: "input-output",
    statement:
      "A program calculates a student's grade from assignment scores.",
    task: "List labeled INPUTS and OUTPUTS of the program.",
    hints: ["Inputs are data going in", "Output is the result"],
    referenceSolution:
      "INPUTS: list of assignment scores, maybe weights, grading scale.\nOUTPUTS: letter grade and/or percentage, possibly pass/fail flag.",
  },
  {
    key: "e3",
    title: "Spot missing information",
    difficulty: "easy",
    minutes: 10,
    kind: "requirement-analysis",
    statement:
      "Requirement: 'Send users a reminder email.' Several details are ambiguous.",
    task: "Write at least 4 clarifying questions you would ask before building.",
    hints: ["When? How often? Which users?"],
    referenceSolution:
      "1. Which users (all, inactive, opted-in)?\n2. When is a reminder due?\n3. How often / max per week?\n4. What does the email say / CTA?\n5. What if email bounces?",
  },
  {
    key: "m1",
    title: "Decompose a daily routine",
    difficulty: "medium",
    minutes: 15,
    kind: "problem-analysis",
    statement:
      "Developers decompose big tasks into ordered steps.",
    task: "Write 6 numbered steps for 'making breakfast' as if instructing a robot.",
    hints: ["Each step must be one action", "Order matters"],
  },
  {
    key: "m2",
    title: "Find the smallest first step",
    difficulty: "medium",
    minutes: 15,
    kind: "problem-analysis",
    statement:
      "You must build a todo app. The full app is overwhelming.",
    task: "Name the ONE smallest feature you would build first and why.",
    hints: ["MVP thinking", "One sentence why"],
  },
  {
    key: "m3",
    title: "Compare two approaches",
    difficulty: "medium",
    minutes: 18,
    kind: "problem-analysis",
    statement:
      "You can sort a list by copying to a new array or sorting in place.",
    task: "Write pros and cons of each approach in two short lists.",
    hints: ["Memory vs simplicity", "Think like a fresher explaining to a friend"],
  },
  {
    key: "h1",
    title: "Design before code: ticket machine",
    difficulty: "hard",
    minutes: 25,
    kind: "scenario",
    statement:
      "A cinema ticket machine sells adult and child tickets with a daily limit.",
    task: "List: entities, rules, edge cases, and step-by-step flow (no code).",
    hints: ["Entities: ticket types, price, inventory", "Edge: sold out, invalid selection"],
  },
  {
    key: "h2",
    title: "Trade-off decision",
    difficulty: "hard",
    minutes: 28,
    kind: "reflection",
    statement: "Deadline is tomorrow; the feature is half done.",
    task: "Write a short plan: what you ship, what you defer, and how you communicate.",
    hints: ["Professional communication matters", "Scope cut is normal"],
  },
  {
    key: "h3",
    title: "Teach-back challenge",
    difficulty: "hard",
    minutes: 28,
    kind: "reflection",
    statement:
      "Explaining forces clarity — a core developer skill.",
    task: "Write a 5-line explanation of 'what is an algorithm' for a non-programmer friend.",
    hints: ["No jargon", "Use an everyday analogy"],
  },
];

const DECOMPOSE: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Split a grocery list task",
    difficulty: "easy",
    minutes: 8,
    kind: "problem-analysis",
    statement: "Big tasks feel smaller when split.",
    task: "List 4 subtasks for 'prepare for a week of meals'.",
    hints: ["Plan, shop, prep, store"],
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
      "1. Design the API\n2. Write the code\n3. Write tests\n4. Deploy\n\n(Design unlocks implementation; tests before deploy catches regressions.)",
  },
  {
    key: "e3",
    title: "Circle of control",
    difficulty: "easy",
    minutes: 10,
    kind: "problem-analysis",
    statement:
      "When stuck, separate what you control from what you don't.",
    task: "Make two lists for 'app is slow': CAN control vs CANNOT control.",
    hints: ["Your code vs user's network"],
  },
  {
    key: "m1",
    title: "WBS: mini project",
    difficulty: "medium",
    minutes: 16,
    kind: "problem-analysis",
    statement: "Work breakdown structures are used in real teams.",
    task: "Break 'build a personal portfolio page' into 5 deliverables with time estimates.",
    hints: ["Content, layout, deploy, etc."],
  },
  {
    key: "m2",
    title: "Dependency map",
    difficulty: "medium",
    minutes: 18,
    kind: "arrange-steps",
    statement: "Some tasks block others.",
    task: "Arrange a sensible build order for these workstreams.",
    hints: ["Schema before API", "Mockup can parallel"],
    arrangeSteps: [
      "Database schema",
      "API routes",
      "UI mockup",
      "Auth",
    ],
    referenceSolution:
      "Typical order: Database schema → API routes → Auth → UI mockup can start earlier in parallel, but API/auth usually precede real UI wiring.\n\nA solid fresher answer: schema first, then API, then auth, with mockup overlapping.",
  },
  {
    key: "m3",
    title: "Reduce scope safely",
    difficulty: "medium",
    minutes: 18,
    kind: "requirement-analysis",
    statement: "Shipping something small beats shipping nothing.",
    task: "Given 'social network app', define a v1 scope and a v2 scope.",
    hints: ["v1: one core loop"],
  },
  {
    key: "h1",
    title: "Event planning decomposition",
    difficulty: "hard",
    minutes: 26,
    kind: "problem-analysis",
    statement: "Complex systems need layered breakdown.",
    task: "Write a 3-level breakdown (goal → phases → tasks) for a college hackathon.",
    hints: ["Logistics, tech, people"],
  },
  {
    key: "h2",
    title: "Failure recovery plan",
    difficulty: "hard",
    minutes: 28,
    kind: "scenario",
    statement: "Good developers plan for things going wrong.",
    task: "Write a checklist if your demo fails live: immediate steps + follow-up.",
    hints: ["Stay calm", "Have backup demo"],
  },
  {
    key: "h3",
    title: "Estimate uncertainty",
    difficulty: "hard",
    minutes: 28,
    kind: "reflection",
    statement:
      "Estimation is a skill; ranges beat false precision.",
    task: "Give best/likely/worst case hours for 'add user profiles' with assumptions.",
    hints: ["List assumptions explicitly"],
  },
];

const REQUIREMENTS: ChallengeSpec[] = [
  {
    key: "e1",
    title: "User story basics",
    difficulty: "easy",
    minutes: 8,
    kind: "requirement-analysis",
    statement: "Requirements often arrive as user stories.",
    task: "Rewrite: 'Users want dark mode' as As a / I want / So that.",
    hints: ["Standard user story format"],
    referenceSolution:
      "As a user, I want a dark theme toggle, so that I can reduce eye strain at night.",
  },
  {
    key: "e2",
    title: "Acceptance criteria",
    difficulty: "easy",
    minutes: 10,
    kind: "requirement-analysis",
    statement: "Done means testable criteria.",
    task: "Write 3 acceptance criteria for 'password reset email'.",
    hints: ["Given/When/Then style works"],
  },
  {
    key: "e3",
    title: "Find the contradiction",
    difficulty: "easy",
    minutes: 10,
    kind: "problem-analysis",
    statement: "Conflicting requirements cause bugs.",
    task: "Explain the conflict: 'must be free' and 'must use paid SMS API'.",
    hints: ["Name the tension"],
  },
  {
    key: "m1",
    title: "Non-functional requirements",
    difficulty: "medium",
    minutes: 16,
    kind: "requirement-analysis",
    statement: "Not all requirements are features.",
    task: "List 4 non-functional reqs for a banking app (security, speed, etc.).",
    hints: ["Performance, accessibility, security"],
  },
  {
    key: "m2",
    title: "Assumption log",
    difficulty: "medium",
    minutes: 18,
    kind: "requirement-analysis",
    statement: "Unspoken assumptions break projects.",
    task: "List 5 assumptions you'd document before building a chat feature.",
    hints: ["Online only? Group chats?"],
  },
  {
    key: "m3",
    title: "Priority matrix",
    difficulty: "medium",
    minutes: 18,
    kind: "requirement-analysis",
    statement: "You can't build everything at once.",
    task: "Categorize 4 features into Must/Should/Could/Won't for an MVP.",
    hints: ["MoSCoW method"],
  },
  {
    key: "h1",
    title: "Ambiguous spec rewrite",
    difficulty: "hard",
    minutes: 26,
    kind: "requirement-analysis",
    statement: "Vague specs need refinement.",
    task: "Rewrite 'make it fast and secure' into 6 measurable requirements.",
    hints: ["Numbers and tests"],
  },
  {
    key: "h2",
    title: "Stakeholder questions",
    difficulty: "hard",
    minutes: 28,
    kind: "scenario",
    statement: "Freshers must ask good questions early.",
    task: "Write 8 questions for a client who wants 'an AI app' with no details.",
    hints: ["Users, data, budget, timeline"],
  },
  {
    key: "h3",
    title: "Scope creep response",
    difficulty: "hard",
    minutes: 28,
    kind: "scenario",
    statement: "Mid-project changes happen.",
    task: "Write how you'd respond when asked to add payments mid-sprint.",
    hints: ["Impact on timeline", "Trade-offs"],
  },
];

const PSEUDOCODE: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Pseudocode: find max",
    difficulty: "easy",
    minutes: 10,
    kind: "pseudocode",
    statement: "Pseudocode is language-agnostic planning.",
    task: "Write pseudocode to find the largest number in a list (plain English steps).",
    hints: ["Initialize max", "Loop and compare"],
    referenceSolution:
      "SET max = first item\nFOR each number in list\n  IF number > max THEN max = number\nRETURN max",
  },
  {
    key: "e2",
    title: "Flowchart in text",
    difficulty: "easy",
    minutes: 10,
    kind: "flowchart",
    statement: "Flowcharts show decision paths.",
    task: "Draw a text flowchart for: if score >= 60 pass else fail.",
    hints: ["Start → decision → outcomes"],
    referenceSolution:
      "Start\n→ Read score\n→ Decision: score >= 60?\n   Yes → Pass → End\n   No → Fail → End",
  },
  {
    key: "e3",
    title: "Trace a simple loop",
    difficulty: "easy",
    minutes: 10,
    kind: "input-output",
    statement: "Tracing builds mental models.",
    task: "Write the output of a loop that prints 1 to 5 (one number per line).",
    hints: ["One number per line"],
    referenceSolution: "1\n2\n3\n4\n5",
  },
  {
    key: "m1",
    title: "Pseudocode: login check",
    difficulty: "medium",
    minutes: 16,
    kind: "pseudocode",
    statement: "Auth flows are everywhere.",
    task: "Write pseudocode: read username/password, check match, print result.",
    hints: ["Handle wrong password"],
  },
  {
    key: "m2",
    title: "Nested decisions",
    difficulty: "medium",
    minutes: 18,
    kind: "pseudocode",
    statement: "Real logic branches.",
    task: "Pseudocode for shipping cost: free over $50, else $5, +$10 if express.",
    hints: ["Nested if"],
  },
  {
    key: "m3",
    title: "Loop pattern: accumulate",
    difficulty: "medium",
    minutes: 18,
    kind: "pseudocode",
    statement: "Accumulators are a core pattern.",
    task: "Pseudocode to sum all numbers in a list starting sum=0.",
    hints: ["sum = sum + item"],
  },
  {
    key: "h1",
    title: "Design a vending machine flow",
    difficulty: "hard",
    minutes: 26,
    kind: "flowchart",
    statement: "State machines appear in many apps.",
    task: "Write pseudocode/flow for: select item → pay → dispense → give change.",
    hints: ["Handle insufficient funds"],
  },
  {
    key: "h2",
    title: "Refine messy steps",
    difficulty: "hard",
    minutes: 28,
    kind: "pseudocode",
    statement: "First drafts of logic are rarely clean.",
    task: "Improve this pseudocode: 'do stuff, check thing, maybe fix'.",
    hints: ["Be specific", "Name variables"],
  },
  {
    key: "h3",
    title: "Pseudocode to code gap",
    difficulty: "hard",
    minutes: 28,
    kind: "pseudocode",
    statement: "Translation is a skill.",
    task: "Write pseudocode for pass/fail across 3 scores, then note what a real language would add.",
    hints: ["Pseudocode first"],
  },
];

const VARIABLES: ChallengeSpec[] = [
  {
    key: "e1",
    title: "What is state?",
    difficulty: "easy",
    minutes: 8,
    kind: "input-output",
    statement: "Programs remember values in variables.",
    task: "List examples of state in a shopping cart app (3 variables with sample values).",
    hints: ["cartTotal, itemCount, userId"],
  },
  {
    key: "e2",
    title: "Naming matters",
    difficulty: "easy",
    minutes: 8,
    kind: "reflection",
    statement: "Good names reduce bugs.",
    task: "Rename: `x`, `temp`, `data` to meaningful names for a temperature converter.",
    hints: ["celsius, fahrenheit, result"],
  },
  {
    key: "e3",
    title: "Constants vs variables",
    difficulty: "easy",
    minutes: 10,
    kind: "problem-analysis",
    statement: "Some values shouldn't change.",
    task: "List which should be constant vs variable in a tax calculator.",
    hints: ["Tax rate might be constant"],
  },
  {
    key: "m1",
    title: "Track changing values",
    difficulty: "medium",
    minutes: 15,
    kind: "input-output",
    statement: "Follow value updates line by line.",
    task: "Trace: int count=0; count++; count+=2; what is count?",
    hints: ["Trace: 0→1→3"],
    referenceSolution: "count ends at 3.\n0 → 1 (count++) → 3 (count+=2).",
  },
  {
    key: "m2",
    title: "Swap two values",
    difficulty: "medium",
    minutes: 16,
    kind: "pseudocode",
    statement: "Classic logic exercise.",
    task: "Write steps to swap a and b using a temp variable.",
    hints: ["temp = a; a = b; b = temp"],
  },
  {
    key: "m3",
    title: "Invalid state detection",
    difficulty: "medium",
    minutes: 18,
    kind: "requirement-analysis",
    statement: "Validate before using data.",
    task: "Write rules that catch invalid age (-1, 200) before storing.",
    hints: ["Range checks"],
  },
  {
    key: "h1",
    title: "Model a bank balance",
    difficulty: "hard",
    minutes: 26,
    kind: "pseudocode",
    statement: "State changes must stay consistent.",
    task: "Pseudocode: deposit, withdraw, never go below zero.",
    hints: ["Check balance before withdraw"],
  },
  {
    key: "h2",
    title: "Shadowing confusion",
    difficulty: "hard",
    minutes: 28,
    kind: "reflection",
    statement: "Same names in different scopes confuse beginners.",
    task: "Explain why an inner and outer `count` can differ.",
    hints: ["Scope blocks"],
  },
  {
    key: "h3",
    title: "Design data for a quiz app",
    difficulty: "hard",
    minutes: 28,
    kind: "problem-analysis",
    statement: "Choosing data shapes is design work.",
    task: "List what variables/objects you need for questions, answers, score.",
    hints: ["Think JSON-like structure"],
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
    kind: "pseudocode",
    statement: "Rules become if-statements.",
    task: "Write steps: print eligible if age >= 18 else not eligible.",
    hints: ["One if-else"],
  },
  {
    key: "e3",
    title: "Grade boundaries",
    difficulty: "easy",
    minutes: 10,
    kind: "input-output",
    statement: "Ranges need careful boundaries.",
    task: "Assign grades (A/B/C/F) for scores 59, 60, 89, 90 using clear cutoffs you define.",
    hints: ["Watch off-by-one"],
  },
  {
    key: "m1",
    title: "Combine conditions",
    difficulty: "medium",
    minutes: 16,
    kind: "multiple-choice",
    statement: "Real rules use AND/OR.",
    task: "A shop gives a discount if the shopper is a member AND total > 100. Which case gets the discount?",
    hints: ["&& operator"],
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
    kind: "pseudocode",
    statement: "Multiple exclusive branches.",
    task: "Pseudocode: map day number 1-7 to weekday name (use else-if).",
    hints: ["One branch only"],
  },
  {
    key: "m3",
    title: "Guard clauses",
    difficulty: "medium",
    minutes: 18,
    kind: "reflection",
    statement: "Early returns simplify logic.",
    task: "Explain when guard clauses beat nested ifs.",
    hints: ["Fail fast pattern"],
  },
  {
    key: "h1",
    title: "Complex rule engine",
    difficulty: "hard",
    minutes: 26,
    kind: "pseudocode",
    statement: "Shipping rules stack up.",
    task: "Pseudocode: free shipping if premium OR (order>50 AND domestic).",
    hints: ["Parentheses matter"],
  },
  {
    key: "h2",
    title: "Find the bug in logic",
    difficulty: "hard",
    minutes: 28,
    kind: "problem-analysis",
    statement: "Debugging starts with expected vs actual.",
    task: "A grade rule uses score > 60 for pass. Score 60 fails. What is wrong and how do you fix it?",
    hints: ["Boundary bug"],
    referenceSolution:
      "Expected: 60 should pass if the rule is '60 or above'.\nBug: using > instead of >=.\nFix: pass when score >= 60.",
  },
  {
    key: "h3",
    title: "Decision tree",
    difficulty: "hard",
    minutes: 28,
    kind: "flowchart",
    statement: "Trees model multi-step decisions.",
    task: "Draw a text decision tree for tech support: wifi? restart? still broken?",
    hints: ["3-4 levels deep"],
  },
];

const PATTERNS: ChallengeSpec[] = [
  {
    key: "e1",
    title: "Repeat a pattern",
    difficulty: "easy",
    minutes: 8,
    kind: "pseudocode",
    statement: "Loops repeat work.",
    task: "Write steps to print 'Study' 5 times with line numbers.",
    hints: ["for loop"],
  },
  {
    key: "e2",
    title: "Count down",
    difficulty: "easy",
    minutes: 8,
    kind: "pseudocode",
    statement: "Loop direction matters.",
    task: "Write steps to print countdown 5 to 1 then 'Go!'.",
    hints: ["while or for"],
  },
  {
    key: "m1",
    title: "Sum 1 to N",
    difficulty: "medium",
    minutes: 16,
    kind: "pseudocode",
    statement: "Accumulator in a loop.",
    task: "Pseudocode: print sum of 1..10.",
    hints: ["sum += i"],
  },
  {
    key: "m2",
    title: "Find first match",
    difficulty: "medium",
    minutes: 18,
    kind: "pseudocode",
    statement: "Search loops stop early.",
    task: "Pseudocode: find first even number in a list.",
    hints: ["break when found"],
  },
  {
    key: "h1",
    title: "Debug the infinite loop",
    difficulty: "hard",
    minutes: 26,
    kind: "problem-analysis",
    statement: "Infinite loops haunt beginners.",
    task: "A while loop never increments i. What happens and how do you fix it?",
    hints: ["Update loop variable"],
    referenceSolution:
      "Without updating i, the condition stays true forever.\nFix: increment (or otherwise change) i each iteration, and ensure the exit condition can become true.",
  },
  {
    key: "h2",
    title: "Reflect on a bug you fixed",
    difficulty: "hard",
    minutes: 28,
    kind: "reflection",
    statement:
      "Debugging mindset: hypothesis → test → learn.",
    task: "Write: symptom, hypothesis, test, fix for a hypothetical off-by-one bug.",
    hints: ["Scientific method"],
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
