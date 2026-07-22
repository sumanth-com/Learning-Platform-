import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenCicdTopics,
  type CicdTopicDef,
} from "@/features/curriculum/lib/cicd-academy-curriculum";

export type CicdChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type CicdChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: CicdChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterYaml: string;
  referenceYaml: string;
  starterShell: string;
  referenceShell: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "cicd-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: CicdChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterYaml?: string;
  referenceYaml: string;
  starterShell?: string;
  referenceShell: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function blockA(title: string, body: string): string {
  return "# " + title + "\n" + body + "\n";
}

function blockB(title: string, body: string): string {
  return "# " + title + "\n" + body + "\n";
}

function slugToken(topic: CicdTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: CicdTopicDef): string {
  return blockA(topic.title, `name: ${slugToken(topic)}
on:
  pull_request:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup
        run: echo "setup for ${clip(topic.title)}"
      - name: Test
        run: echo "run checks"
`);
}

function defaultB(topic: CicdTopicDef): string {
  return blockB(topic.title, `#!/usr/bin/env bash
set -euo pipefail
echo "Local mirror of CI for ${slugToken(topic)}"
npm ci
npm test
npm run build
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

function specsForTopic(topic: CicdTopicDef): Spec[] {
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

  const baseA = defaultA(topic);
  const baseB = defaultB(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft reference files that demonstrate "${title}". Use ideas from: ${toolList}.`,
    hints: [
      "Start from the primary concept pane and keep it minimal.",
      `Focus on ${primary}.`,
      "Pair the panes so a teammate could follow the steps.",
    ],
    takeaways: [summary, "Automation and clear config make releases safer"],
    referenceYaml: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Both panes are coherent together",
      "No secrets hardcoded in the examples",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build a workflow for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${toolList}.`,
    task: `Produce practical examples using ${toolList}. Prefer clear names and comments.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `Use ${c.tag}: ${c.desc}`)
      .concat(["Keep the example small enough to review in one pass."]),
    takeaways: bestPractices.slice(0, 2),
    referenceYaml: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable comments explain why",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "fix",
    title: `Fix a broken ${clip(title)} setup`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: `A teammate shipped a fragile "${title}" setup. Common mistakes include: ${commonMistakes.slice(0, 2).join("; ") || "missing validation and hardcoded config"}.`,
    task: `Repair the reference so it follows safer practices for ${title}. Call out what was wrong.`,
    hints: [
      commonMistakes[0] || "Remove hardcoded secrets",
      bestPractices[0] || "Prefer explicit configuration",
      `Re-check ${primary} usage`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid fragile manual steps",
      bestPractices[0] || "Prefer repeatable automation",
    ],
    referenceYaml: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Identifies the failure mode",
      "Applies at least one best practice",
      "Leaves a safer reference than before",
    ],
  });

  push({
    key: "practice",
    title: `Practice ${clip(title)}`,
    difficulty: "medium",
    minutes: 12,
    kind: "layout",
    scenario: `You are preparing a handoff doc for "${title}" using: ${toolList}.`,
    task: `Create a clean reference a junior engineer can copy. Include verification commands.`,
    hints: [
      "Keep commands copy-pasteable",
      `Highlight ${primary}`,
      bestPractices[1] || "Document rollback or failure handling",
    ],
    takeaways: bestPractices.slice(0, 2),
    referenceYaml: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Includes verification steps",
      "Uses topic terminology correctly",
      "Suitable as a team reference",
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
      task: `Answer with concrete examples in both panes. Cover trade-offs and failure modes for ${title}.`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you verify success",
        bestPractices[0] || "Mention observability",
      ],
      takeaways: [
        summary,
        bestPractices[0] || "Prefer reversible changes",
      ],
      referenceYaml: baseA,
      referenceShell: baseB,
      acceptanceCriteria: [
        "Answers the interview angle",
        "Includes a concrete example",
        "Mentions at least one risk",
      ],
    });
  } else {
    push({
      key: "project",
      title: `Mini project: ${clip(title)}`,
      difficulty: "hard",
      minutes: 18,
      kind: "project",
      scenario: `Ship a small but complete "${title}" setup for a demo service using ${toolList}.`,
      task: `Produce production-minded references with comments for rollout, verification, and rollback.`,
      hints: [
        bestPractices[0] || "Automate the happy path",
        bestPractices[1] || "Plan rollback",
        commonMistakes[0] || "Avoid secrets in files",
      ],
      takeaways: bestPractices.slice(0, 3),
      referenceYaml: baseA,
      referenceShell: baseB,
      acceptanceCriteria: [
        "Looks like a real team reference",
        "Includes verification",
        "Includes a rollback or abort note",
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

function buildChallenge(topicSlug: string, spec: Spec): CicdChallenge {
  const id = `cicd-${topicSlug}-${spec.key}`;
  const starterYaml = spec.starterYaml ?? spec.referenceYaml;
  const starterShell =
    spec.starterShell ??
    `# Start here\n# Write your commands\necho "todo"\n`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceShell
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
    starterYaml,
    referenceYaml: spec.referenceYaml,
    starterShell,
    referenceShell: spec.referenceShell,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "cicd-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: CicdChallenge[] = flattenCicdTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, CicdChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listCicdAcademyChallenges(topicSlug: string): CicdChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allCicdAcademyChallenges(): CicdChallenge[] {
  return BANK;
}

export function findCicdAcademyChallenge(
  topicSlug: string,
  challengeId: string
): CicdChallenge | null {
  const list = listCicdAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function cicdAcademyTopicChallengeCount(topicSlug: string): number {
  return listCicdAcademyChallenges(topicSlug).length;
}

export function isCicdTheoryChallenge(challenge: CicdChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
