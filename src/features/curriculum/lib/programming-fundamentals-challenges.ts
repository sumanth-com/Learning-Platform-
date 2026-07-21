import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";

export type ProgrammingFundamentalsChallenge = {
  id: string;
  weekId: number;
  topicSlug: string;
  lesson: LearnLesson;
  source: "synthetic";
};

type ChallengeSpec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  problemType: "logic" | "output-prediction" | "debugging";
  statement: string;
  task: string;
  hints: string[];
};

function buildLesson(
  topicSlug: string,
  topicTitle: string,
  spec: ChallengeSpec
): LearnLesson {
  const id = `pf-${topicSlug}-${spec.key}`;
  return {
    id,
    topicSlug,
    weekId: 0,
    title: spec.title,
    difficulty: spec.difficulty,
    category: "java",
    description: `${topicTitle} — ${spec.title}`,
    problemStatement: `## Context\n\n${spec.statement}\n\n## Your task\n\n${spec.task}`,
    explanation: `This challenge builds the developer mindset from **${topicTitle}**. Think on paper first, then implement a tiny solution.`,
    code: `// Plan your approach for: ${spec.title}\n// Step 1: restate the problem\n// Step 2: list inputs and outputs\n// Step 3: write pseudocode\n// Step 4: implement\n\npublic class Solution {\n  public static void main(String[] args) {\n    // TODO\n  }\n}\n`,
    filename: "Solution.java",
    expectedOutput: "See problem statement",
    commonMistakes: [
      "Jumping to code without writing steps first",
      "Ignoring edge cases mentioned in the prompt",
    ],
    interviewTips: [
      "Explain your thinking out loud before typing.",
      "Start with the simplest example that proves you understand.",
    ],
    practiceQuestions: [
      `How does "${spec.title}" connect to everyday problem solving?`,
    ],
    editorLanguage: "java",
    estimatedMinutes: spec.minutes,
    problemType: spec.problemType,
    hints: spec.hints,
    constraints: [
      "Keep your solution under 50 lines",
      "Print clear output that shows your reasoning",
    ],
    exampleInput: "Varies per challenge",
    exampleOutput: "Clear, labeled console output",
    stepByStepExplanation: `1. Read the scenario.\n2. Break it into steps.\n3. Code the smallest working version.`,
  };
}

function topicChallenges(
  topicSlug: string,
  topicTitle: string,
  specs: ChallengeSpec[]
): ProgrammingFundamentalsChallenge[] {
  return specs.map((spec) => {
    const lesson = buildLesson(topicSlug, topicTitle, spec);
    return {
      id: lesson.id,
      weekId: 0,
      topicSlug,
      lesson,
      source: "synthetic" as const,
    };
  });
}

const THINKING: ChallengeSpec[] = [
  { key: "e1", title: "Restate the problem in your own words", difficulty: "easy", minutes: 8, problemType: "logic", statement: "A teammate asks you to build a login form. Before coding, developers restate what success looks like.", task: "Print three bullet points: what the user sees, what happens on success, what happens on failure.", hints: ["Think user-first", "Avoid technical jargon in bullets"] },
  { key: "e2", title: "Identify inputs and outputs", difficulty: "easy", minutes: 8, problemType: "logic", statement: "A program calculates a student's grade from assignment scores.", task: "Print labeled lines for INPUTS and OUTPUTS of the program.", hints: ["Inputs are data going in", "Output is the result"] },
  { key: "e3", title: "Spot missing information", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Requirement: 'Send users a reminder email.' Several details are ambiguous.", task: "Print at least 4 clarifying questions you would ask before building.", hints: ["When? How often? Which users?"] },
  { key: "m1", title: "Decompose a daily routine", difficulty: "medium", minutes: 15, problemType: "logic", statement: "Developers decompose big tasks into ordered steps.", task: "Print 6 numbered steps for 'making breakfast' as if instructing a robot.", hints: ["Each step must be one action", "Order matters"] },
  { key: "m2", title: "Find the smallest first step", difficulty: "medium", minutes: 15, problemType: "logic", statement: "You must build a todo app. The full app is overwhelming.", task: "Print the ONE smallest feature you would build first and why.", hints: ["MVP thinking", "One sentence why"] },
  { key: "m3", title: "Compare two approaches", difficulty: "medium", minutes: 18, problemType: "logic", statement: "You can sort a list by copying to a new array or sorting in place.", task: "Print pros and cons of each approach in two short lists.", hints: ["Memory vs simplicity", "Think like a fresher explaining to a friend"] },
  { key: "h1", title: "Design before code: ticket machine", difficulty: "hard", minutes: 25, problemType: "logic", statement: "A cinema ticket machine sells adult and child tickets with a daily limit.", task: "Print: entities, rules, edge cases, and step-by-step flow (no code required).", hints: ["Entities: ticket types, price, inventory", "Edge: sold out, invalid selection"] },
  { key: "h2", title: "Trade-off decision", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Deadline is tomorrow; the feature is half done.", task: "Print a short plan: what you ship, what you defer, and how you communicate.", hints: ["Professional communication matters", "Scope cut is normal"] },
  { key: "h3", title: "Teach-back challenge", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Explaining forces clarity — a core developer skill.", task: "Print a 5-line explanation of 'what is an algorithm' for a non-programmer friend.", hints: ["No jargon", "Use an everyday analogy"] },
];

const DECOMPOSE: ChallengeSpec[] = [
  { key: "e1", title: "Split a grocery list task", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Big tasks feel smaller when split.", task: "Print 4 subtasks for 'prepare for a week of meals'.", hints: ["Plan, shop, prep, store"] },
  { key: "e2", title: "Order the steps", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Steps must run in a valid order.", task: "Print the correct order for: deploy, write tests, write code, design API.", hints: ["Design comes first"] },
  { key: "e3", title: "Circle of control", difficulty: "easy", minutes: 10, problemType: "logic", statement: "When stuck, separate what you control from what you don't.", task: "Print two lists for 'app is slow': CAN control vs CANNOT control.", hints: ["Your code vs user's network"] },
  { key: "m1", title: "WBS: mini project", difficulty: "medium", minutes: 16, problemType: "logic", statement: "Work breakdown structures are used in real teams.", task: "Break 'build a personal portfolio page' into 5 deliverables with time estimates.", hints: ["Content, layout, deploy, etc."] },
  { key: "m2", title: "Dependency map", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Some tasks block others.", task: "Print which of these blocks which: database schema, UI mockup, API routes, auth.", hints: ["Schema before API", "Mockup can parallel"] },
  { key: "m3", title: "Reduce scope safely", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Shipping something small beats shipping nothing.", task: "Given 'social network app', print a v1 scope and a v2 scope.", hints: ["v1: one core loop"] },
  { key: "h1", title: "Event planning decomposition", difficulty: "hard", minutes: 26, problemType: "logic", statement: "Complex systems need layered breakdown.", task: "Print a 3-level breakdown (goal → phases → tasks) for a college hackathon.", hints: ["Logistics, tech, people"] },
  { key: "h2", title: "Failure recovery plan", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Good developers plan for things going wrong.", task: "Print a checklist if your demo fails live: immediate steps + follow-up.", hints: ["Stay calm", "Have backup demo"] },
  { key: "h3", title: "Estimate uncertainty", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Estimation is a skill; ranges beat false precision.", task: "Print best/likely/worst case hours for 'add user profiles' with assumptions.", hints: ["List assumptions explicitly"] },
];

const REQUIREMENTS: ChallengeSpec[] = [
  { key: "e1", title: "User story basics", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Requirements often arrive as user stories.", task: "Rewrite: 'Users want dark mode' as As a / I want / So that.", hints: ["Standard user story format"] },
  { key: "e2", title: "Acceptance criteria", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Done means testable criteria.", task: "Write 3 acceptance criteria for 'password reset email'.", hints: ["Given/When/Then style works"] },
  { key: "e3", title: "Find the contradiction", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Conflicting requirements cause bugs.", task: "Explain the conflict: 'must be free' and 'must use paid SMS API'.", hints: ["Name the tension"] },
  { key: "m1", title: "Non-functional requirements", difficulty: "medium", minutes: 16, problemType: "logic", statement: "Not all requirements are features.", task: "List 4 non-functional reqs for a banking app (security, speed, etc.).", hints: ["Performance, accessibility, security"] },
  { key: "m2", title: "Assumption log", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Unspoken assumptions break projects.", task: "Print 5 assumptions you'd document before building a chat feature.", hints: ["Online only? Group chats?"] },
  { key: "m3", title: "Priority matrix", difficulty: "medium", minutes: 18, problemType: "logic", statement: "You can't build everything at once.", task: "Categorize 4 features into Must/Should/Could/Won't for an MVP.", hints: ["MoSCoW method"] },
  { key: "h1", title: "Ambiguous spec rewrite", difficulty: "hard", minutes: 26, problemType: "logic", statement: "Vague specs need refinement.", task: "Rewrite 'make it fast and secure' into 6 measurable requirements.", hints: ["Numbers and tests"] },
  { key: "h2", title: "Stakeholder questions", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Freshers must ask good questions early.", task: "Print 8 questions for a client who wants 'an AI app' with no details.", hints: ["Users, data, budget, timeline"] },
  { key: "h3", title: "Scope creep response", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Mid-project changes happen.", task: "Print how you'd respond when asked to add payments mid-sprint.", hints: ["Impact on timeline", "Trade-offs"] },
];

const PSEUDOCODE: ChallengeSpec[] = [
  { key: "e1", title: "Pseudocode: find max", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Pseudocode is language-agnostic planning.", task: "Print pseudocode to find the largest number in a list (plain English steps).", hints: ["Initialize max", "Loop and compare"] },
  { key: "e2", title: "Flowchart in text", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Flowcharts show decision paths.", task: "Print a text flowchart for: if score >= 60 pass else fail.", hints: ["Start → decision → outcomes"] },
  { key: "e3", title: "Trace a simple loop", difficulty: "easy", minutes: 10, problemType: "output-prediction", statement: "Tracing builds mental models.", task: "Print the output of a loop that prints 1 to 5 (write the 5 lines).", hints: ["One number per line"] },
  { key: "m1", title: "Pseudocode: login check", difficulty: "medium", minutes: 16, problemType: "logic", statement: "Auth flows are everywhere.", task: "Write pseudocode: read username/password, check match, print result.", hints: ["Handle wrong password"] },
  { key: "m2", title: "Nested decisions", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Real logic branches.", task: "Pseudocode for shipping cost: free over $50, else $5, +$10 if express.", hints: ["Nested if"] },
  { key: "m3", title: "Loop pattern: accumulate", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Accumulators are a core pattern.", task: "Pseudocode to sum all numbers in a list starting sum=0.", hints: ["sum = sum + item"] },
  { key: "h1", title: "Design a vending machine flow", difficulty: "hard", minutes: 26, problemType: "logic", statement: "State machines appear in many apps.", task: "Print pseudocode for: select item → pay → dispense → give change.", hints: ["Handle insufficient funds"] },
  { key: "h2", title: "Refine messy steps", difficulty: "hard", minutes: 28, problemType: "logic", statement: "First drafts of logic are rarely clean.", task: "Improve this pseudocode: 'do stuff, check thing, maybe fix'.", hints: ["Be specific", "Name variables"] },
  { key: "h3", title: "Pseudocode to code gap", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Translation is a skill.", task: "Write pseudocode then implement Java that prints pass/fail for 3 scores.", hints: ["Pseudocode first in comments"] },
];

const VARIABLES: ChallengeSpec[] = [
  { key: "e1", title: "What is state?", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Programs remember values in variables.", task: "Print examples of state in a shopping cart app (3 variables with sample values).", hints: ["cartTotal, itemCount, userId"] },
  { key: "e2", title: "Naming matters", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Good names reduce bugs.", task: "Rename: `x`, `temp`, `data` to meaningful names for a temperature converter.", hints: ["celsius, fahrenheit, result"] },
  { key: "e3", title: "Constants vs variables", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Some values shouldn't change.", task: "Print which should be constant vs variable in a tax calculator.", hints: ["Tax rate might be constant"] },
  { key: "m1", title: "Track changing values", difficulty: "medium", minutes: 15, problemType: "output-prediction", statement: "Follow value updates line by line.", task: "Implement Java: int count=0; count++; count+=2; print count.", hints: ["Trace: 0→1→3"] },
  { key: "m2", title: "Swap two values", difficulty: "medium", minutes: 16, problemType: "logic", statement: "Classic logic exercise.", task: "Implement Java to swap a and b using a temp variable and print both.", hints: ["temp = a; a = b; b = temp"] },
  { key: "m3", title: "Invalid state detection", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Validate before using data.", task: "Print rules that catch invalid age (-1, 200) before storing.", hints: ["Range checks"] },
  { key: "h1", title: "Model a bank balance", difficulty: "hard", minutes: 26, problemType: "logic", statement: "State changes must stay consistent.", task: "Pseudocode + Java: deposit, withdraw, never go below zero.", hints: ["Check balance before withdraw"] },
  { key: "h2", title: "Shadowing confusion", difficulty: "hard", minutes: 28, problemType: "debugging", statement: "Same names in different scopes confuse beginners.", task: "Explain in print statements why inner and outer `count` differ.", hints: ["Scope blocks"] },
  { key: "h3", title: "Design data for a quiz app", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Choosing data shapes is design work.", task: "Print what variables/objects you need for questions, answers, score.", hints: ["Think JSON-like structure"] },
];

const LOGIC: ChallengeSpec[] = [
  { key: "e1", title: "Truth table: AND", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Decisions combine conditions.", task: "Print truth table for A AND B (4 rows).", hints: ["True only when both true"] },
  { key: "e2", title: "Simple eligibility", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Rules become if-statements.", task: "Java: print eligible if age >= 18 else not eligible.", hints: ["One if-else"] },
  { key: "e3", title: "Grade boundaries", difficulty: "easy", minutes: 10, problemType: "logic", statement: "Ranges need careful boundaries.", task: "Print which grade (A/B/C/F) for scores 59, 60, 89, 90.", hints: ["Watch off-by-one"] },
  { key: "m1", title: "Combine conditions", difficulty: "medium", minutes: 16, problemType: "logic", statement: "Real rules use AND/OR.", task: "Java: discount if member AND total > 100.", hints: ["&& operator"] },
  { key: "m2", title: "Else-if ladder", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Multiple exclusive branches.", task: "Java: map day number 1-7 to weekday name (use else-if).", hints: ["One branch only"] },
  { key: "m3", title: "Guard clauses", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Early returns simplify logic.", task: "Explain in comments when guard clauses beat nested ifs.", hints: ["Fail fast pattern"] },
  { key: "h1", title: "Complex rule engine", difficulty: "hard", minutes: 26, problemType: "logic", statement: "Shipping rules stack up.", task: "Pseudocode: free shipping if premium OR (order>50 AND domestic).", hints: ["Parentheses matter"] },
  { key: "h2", title: "Find the bug in logic", difficulty: "hard", minutes: 28, problemType: "debugging", statement: "Debugging starts with expected vs actual.", task: "Fix Java that prints wrong grade for score=60 (use >= not >).", hints: ["Boundary bug"] },
  { key: "h3", title: "Decision tree", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Trees model multi-step decisions.", task: "Print text decision tree for tech support: wifi? restart? still broken?", hints: ["3-4 levels deep"] },
];

const PATTERNS: ChallengeSpec[] = [
  { key: "e1", title: "Repeat a pattern", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Loops repeat work.", task: "Java: print 'Study' 5 times with line numbers.", hints: ["for loop"] },
  { key: "e2", title: "Count down", difficulty: "easy", minutes: 8, problemType: "logic", statement: "Loop direction matters.", task: "Java: print countdown 5 to 1 then 'Go!'.", hints: ["while or for"] },
  { key: "m1", title: "Sum 1 to N", difficulty: "medium", minutes: 16, problemType: "logic", statement: "Accumulator in a loop.", task: "Java: print sum of 1..10.", hints: ["sum += i"] },
  { key: "m2", title: "Find first match", difficulty: "medium", minutes: 18, problemType: "logic", statement: "Search loops stop early.", task: "Pseudocode: find first even number in a list.", hints: ["break when found"] },
  { key: "h1", title: "Debug the infinite loop", difficulty: "hard", minutes: 26, problemType: "debugging", statement: "Infinite loops haunt beginners.", task: "Fix Java while loop that never increments i.", hints: ["Update loop variable"] },
  { key: "h2", title: "Reflect on a bug you fixed", difficulty: "hard", minutes: 28, problemType: "logic", statement: "Debugging mindset: hypothesis → test → learn.", task: "Print: symptom, hypothesis, test, fix for a hypothetical off-by-one bug.", hints: ["Scientific method"] },
];

const BANK: Array<{
  slug: string;
  title: string;
  specs: ChallengeSpec[];
}> = [
  { slug: "thinking-like-a-developer", title: "Thinking Like a Developer", specs: THINKING },
  { slug: "breaking-down-problems", title: "Breaking Down Problems", specs: DECOMPOSE },
  { slug: "understanding-requirements", title: "Understanding Requirements", specs: REQUIREMENTS },
  { slug: "pseudocode-and-flowcharts", title: "Pseudocode & Flowcharts", specs: PSEUDOCODE },
  { slug: "variables-and-state", title: "Variables & State", specs: VARIABLES },
  { slug: "logic-and-decisions", title: "Logic & Decisions", specs: LOGIC },
  { slug: "patterns-and-debugging", title: "Patterns & Debugging", specs: PATTERNS },
];

const CHALLENGES_BY_TOPIC = new Map(
  BANK.map((t) => [
    t.slug,
    topicChallenges(t.slug, t.title, t.specs),
  ])
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
