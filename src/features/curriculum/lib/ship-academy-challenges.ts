import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenShipTopics,
  type ShipTopicDef,
} from "@/features/curriculum/lib/ship-academy-curriculum";

export type ShipChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ShipChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ShipChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterMarkdown: string;
  referenceMarkdown: string;
  starterShell: string;
  referenceShell: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "ship-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ShipChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterMarkdown?: string;
  referenceMarkdown: string;
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

function mdBlock(title: string, body: string): string {
  return "# " + title + "\n\n" + body + "\n";
}

function shellBlock(title: string, body: string): string {
  return "# " + title + "\n" + body + "\n";
}

function slugToken(topic: ShipTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: ShipTopicDef): string {
  return mdBlock(topic.title, `## Launch checklist: ${slugToken(topic)}
- [ ] Env vars set
- [ ] Migrations applied
- [ ] Smoke happy path on production
- [ ] README updated
- [ ] Rollback owner named
- [ ] Backup recording ready
`);
}

function defaultB(topic: ShipTopicDef): string {
  return shellBlock(topic.title, `#!/usr/bin/env bash
set -euo pipefail
echo "Ship checks for ${slugToken(topic)}"
npm run build
npm run lint
git tag -f demo-freeze
curl -fsS "$APP_URL/health" || true
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

function specsForTopic(topic: ShipTopicDef): Spec[] {
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
    task: `Draft planning/shipping references that demonstrate "${title}". Use ideas from: ${toolList}.`,
    hints: [
      "Keep the markdown concise and scannable.",
      `Focus on ${primary}.`,
      "Make the second pane actionable.",
    ],
    takeaways: [summary, "Clear docs make delivery safer"],
    referenceMarkdown: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Both panes work together",
      "No secrets hardcoded",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0] ? `Practice ${cheatSheet[0].tag}` : `Build a plan for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${toolList}.`,
    task: `Produce practical references using ${toolList}. Prefer clear structure and checklists.`,
    hints: cheatSheet.slice(0, 3).map((c) => `Use ${c.tag}: ${c.desc}`).concat(["Keep it short enough to review in one pass."]),
    takeaways: bestPractices.slice(0, 2),
    referenceMarkdown: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable structure",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "fix",
    title: `Fix a weak ${clip(title)} plan`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: `A teammate shipped a fragile "${title}" plan. Common mistakes include: ${commonMistakes.slice(0, 2).join("; ") || "vague scope and missing owners"}.`,
    task: `Repair the references so they follow safer practices for ${title}.`,
    hints: [
      commonMistakes[0] || "Make outcomes explicit",
      bestPractices[0] || "Add owners and dates",
      `Re-check ${primary}`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid vague plans",
      bestPractices[0] || "Prefer checklists with owners",
    ],
    referenceMarkdown: baseA,
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
    scenario: `Prepare a handoff reference for "${title}" using: ${toolList}.`,
    task: `Create a clean reference a teammate can follow, including verification notes.`,
    hints: [
      "Keep commands and checklists copy-pasteable",
      `Highlight ${primary}`,
      bestPractices[1] || "Include a rollback or backup note",
    ],
    takeaways: bestPractices.slice(0, 2),
    referenceMarkdown: baseA,
    referenceShell: baseB,
    acceptanceCriteria: [
      "Includes verification notes",
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
      task: `Answer with concrete planning/shipping artifacts. Cover trade-offs for ${title}.`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you verify success",
        bestPractices[0] || "Mention risks and mitigations",
      ],
      takeaways: [summary, bestPractices[0] || "Plan for failure modes"],
      referenceMarkdown: baseA,
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
      scenario: `Ship a small but complete "${title}" artifact pack using ${toolList}.`,
      task: `Produce production-minded references with owners, verification, and fallback notes.`,
      hints: [
        bestPractices[0] || "Make outcomes explicit",
        bestPractices[1] || "Plan rollback or backup",
        commonMistakes[0] || "Avoid vague ownership",
      ],
      takeaways: bestPractices.slice(0, 3),
      referenceMarkdown: baseA,
      referenceShell: baseB,
      acceptanceCriteria: [
        "Looks like a real team reference",
        "Includes verification",
        "Includes a fallback note",
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

function buildChallenge(topicSlug: string, spec: Spec): ShipChallenge {
  const id = `ship-${topicSlug}-${spec.key}`;
  const starterMarkdown = spec.starterMarkdown ?? spec.referenceMarkdown;
  const starterShell =
    spec.starterShell ??
    `# Start here\necho todo\n`;
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
    starterMarkdown,
    referenceMarkdown: spec.referenceMarkdown,
    starterShell,
    referenceShell: spec.referenceShell,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "ship-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ShipChallenge[] = flattenShipTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ShipChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listShipAcademyChallenges(topicSlug: string): ShipChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allShipAcademyChallenges(): ShipChallenge[] {
  return BANK;
}

export function findShipAcademyChallenge(
  topicSlug: string,
  challengeId: string
): ShipChallenge | null {
  const list = listShipAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null;
}

export function shipAcademyTopicChallengeCount(topicSlug: string): number {
  return listShipAcademyChallenges(topicSlug).length;
}

export function isShipTheoryChallenge(challenge: ShipChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
