import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenSystemsTopics,
  type SystemsTopicDef,
} from "@/features/curriculum/lib/systems-academy-curriculum";

export type SystemsChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type SystemsChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: SystemsChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterMarkdown: string;
  referenceMarkdown: string;
  starterJson: string;
  referenceJson: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "systems-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: SystemsChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterMarkdown?: string;
  referenceMarkdown: string;
  starterJson?: string;
  referenceJson: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function blockA(title: string, body: string): string {
  return "# " + title + "\n\n" + body + "\n";
}

function blockB(title: string, body: string): string {
  return body.endsWith("\n") ? body : body + "\n";
}

function slugToken(topic: SystemsTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: SystemsTopicDef): string {
  return blockA(topic.title, `## Design notes: ${slugToken(topic)}
### Requirements
- Functional:
- Non-functional:

### High-level
- Clients -> API -> Service -> Storage

### Deep dive
- Bottleneck:
- Trade-offs:
`);
}

function defaultB(topic: SystemsTopicDef): string {
  return blockB(topic.title, `{
  "topic": "${slugToken(topic)}",
  "components": ["client", "api", "service", "db", "cache"],
  "hot_path": "read",
  "tradeoffs": ["latency", "consistency", "cost"],
  "deep_dive": "cache-invalidation"
}
`);
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
  referenceCode: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "git",
    description: task,
    problemStatement: `## Scenario\n\n${scenario}\n\n## Task\n\n${task}`,
    command: "bash",
    terminalOutput: referenceCode,
    workflowDiagram: scenario,
    explanation: task,
    commonMistakes: hints,
    editorLanguage: "bash",
    estimatedMinutes: minutes,
    problemType: "terminal",
    hints,
  };
}

function specsForTopic(topic: SystemsTopicDef): Spec[] {
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
      ? cheatSheet.slice(0, 4).map((c) => c.tag).join(", ")
      : primary;
  const baseA = defaultA(topic);
  const baseB = defaultB(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft interview-ready references for "${title}". Use ideas from: ${toolList}.`,
    hints: [
      "Keep the talk track explicit.",
      `Focus on ${primary}.`,
      "Make the second pane concrete and reusable.",
    ],
    takeaways: [summary, "Clear structure beats improvisation under pressure"],
    referenceMarkdown: baseA,
    referenceJson: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Both panes work together",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0] ? `Practice ${cheatSheet[0].tag}` : `Practice ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${toolList}.`,
    task: `Produce practical references using ${toolList}. Prefer clarity over cleverness.`,
    hints: cheatSheet.slice(0, 3).map((c) => `Use ${c.tag}: ${c.desc}`).concat(["Keep it short enough to review in one pass."]),
    takeaways: bestPractices.slice(0, 2),
    referenceMarkdown: baseA,
    referenceJson: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable structure",
      "Useful under interview pressure",
    ],
  });

  push({
    key: "fix",
    title: `Fix a weak ${clip(title)} answer`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: `A candidate's "${title}" answer is fragile. Common mistakes include: ${commonMistakes.slice(0, 2).join("; ") || "vague structure and missing trade-offs"}.`,
    task: `Repair the references so they follow stronger practices for ${title}.`,
    hints: [
      commonMistakes[0] || "Make the structure explicit",
      bestPractices[0] || "Add concrete examples",
      `Re-check ${primary}`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid vague answers",
      bestPractices[0] || "Prefer structured communication",
    ],
    referenceMarkdown: baseA,
    referenceJson: baseB,
    acceptanceCriteria: [
      "Identifies the failure mode",
      "Applies at least one best practice",
      "Leaves a stronger reference than before",
    ],
  });

  push({
    key: "practice",
    title: `Practice ${clip(title)}`,
    difficulty: "medium",
    minutes: 12,
    kind: "layout",
    scenario: `Prepare a reusable interview reference for "${title}" using: ${toolList}.`,
    task: `Create a clean reference you could reuse in a mock interview, including checkpoints.`,
    hints: [
      "Keep steps checkable",
      `Highlight ${primary}`,
      bestPractices[1] || "Include a recovery move if you get stuck",
    ],
    takeaways: bestPractices.slice(0, 2),
    referenceMarkdown: baseA,
    referenceJson: baseB,
    acceptanceCriteria: [
      "Includes checkpoints",
      "Uses topic terminology correctly",
      "Suitable as a personal interview sheet",
    ],
  });

  const hardKey = topic.challengeWeight >= 5 ? "project" : "interview";
  if (hardKey === "interview") {
    push({
      key: "interview",
      title: `Interview: ${clip(title)}`,
      difficulty: "hard",
      minutes: 15,
      kind: "interview",
      scenario: interviewQuestions[0]
        ? `Interview prompt: ${interviewQuestions[0]}`
        : `Explain "${title}" as you would in a staffing interview.`,
      task: `Answer with concrete artifacts. Cover trade-offs for ${title}.`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you verify success",
        bestPractices[0] || "Mention failure modes",
      ],
      takeaways: [summary, bestPractices[0] || "Structure beats improvisation"],
      referenceMarkdown: baseA,
      referenceJson: baseB,
      acceptanceCriteria: [
        "Answers the interview angle",
        "Includes a concrete example",
        "Mentions at least one risk or trade-off",
      ],
    });
  } else {
    push({
      key: "project",
      title: `Mini project: ${clip(title)}`,
      difficulty: "hard",
      minutes: 18,
      kind: "project",
      scenario: `Build a complete interview-ready pack for "${title}" using ${toolList}.`,
      task: `Produce polished references with structure, examples, and a recovery plan.`,
      hints: [
        bestPractices[0] || "Make structure explicit",
        bestPractices[1] || "Add a worked example",
        commonMistakes[0] || "Avoid vague ownership of the answer",
      ],
      takeaways: bestPractices.slice(0, 3),
      referenceMarkdown: baseA,
      referenceJson: baseB,
      acceptanceCriteria: [
        "Looks like a real interview sheet",
        "Includes an example",
        "Includes a recovery note",
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

function buildChallenge(topicSlug: string, spec: Spec): SystemsChallenge {
  const id = `systems-${topicSlug}-${spec.key}`;
  const starterMarkdown = spec.starterMarkdown ?? spec.referenceMarkdown;
  const starterJson = spec.starterJson ?? `{\n  "todo": true\n}\n`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceJson
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
    starterMarkdown,
    referenceMarkdown: spec.referenceMarkdown,
    starterJson,
    referenceJson: spec.referenceJson,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "systems-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: SystemsChallenge[] = flattenSystemsTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, SystemsChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listSystemsAcademyChallenges(topicSlug: string): SystemsChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allSystemsAcademyChallenges(): SystemsChallenge[] {
  return BANK;
}

export function findSystemsAcademyChallenge(
  topicSlug: string,
  challengeId: string
): SystemsChallenge | null {
  const list = listSystemsAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null;
}

export function systemsAcademyTopicChallengeCount(topicSlug: string): number {
  return listSystemsAcademyChallenges(topicSlug).length;
}

export function isSystemsTheoryChallenge(challenge: SystemsChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
