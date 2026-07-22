import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenCapstoneTopics,
  type CapstoneTopicDef,
} from "@/features/curriculum/lib/capstone-academy-curriculum";

export type CapstoneChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type CapstoneChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: CapstoneChallengeKind;
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
  experience: "capstone-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: CapstoneChallengeKind;
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

function mdBlock(title: string, body: string): string {
  return "# " + title + "\n\n" + body + "\n";
}

function jsonBlock(title: string, body: string): string {
  return body.endsWith("\n") ? body : body + "\n";
}

function slugToken(topic: CapstoneTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: CapstoneTopicDef): string {
  return mdBlock(topic.title, `## Goal
Ship a finishable MVP for ${slugToken(topic)}.

## Primary user
- Persona:
- Job to be done:

## Success
- [ ] Happy path works
- [ ] Demo rehearsed
`);
}

function defaultB(topic: CapstoneTopicDef): string {
  return jsonBlock(topic.title, `{
  "decision": "${slugToken(topic)}",
  "status": "accepted",
  "context": "Capstone MVP needs a clear architecture choice.",
  "options": ["simple-monolith", "extra-services"],
  "choice": "simple-monolith",
  "consequences": ["Faster demo", "Fewer moving parts"]
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

function specsForTopic(topic: CapstoneTopicDef): Spec[] {
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
    referenceJson: baseB,
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
    referenceJson: baseB,
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
    referenceJson: baseB,
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
    referenceJson: baseB,
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
      referenceJson: baseB,
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
      referenceJson: baseB,
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

function buildChallenge(topicSlug: string, spec: Spec): CapstoneChallenge {
  const id = `capstone-${topicSlug}-${spec.key}`;
  const starterMarkdown = spec.starterMarkdown ?? spec.referenceMarkdown;
  const starterJson =
    spec.starterJson ??
    `{\n  "todo": true\n}\n`;
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
    experience: "capstone-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: CapstoneChallenge[] = flattenCapstoneTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, CapstoneChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listCapstoneAcademyChallenges(topicSlug: string): CapstoneChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allCapstoneAcademyChallenges(): CapstoneChallenge[] {
  return BANK;
}

export function findCapstoneAcademyChallenge(
  topicSlug: string,
  challengeId: string
): CapstoneChallenge | null {
  const list = listCapstoneAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null;
}

export function capstoneAcademyTopicChallengeCount(topicSlug: string): number {
  return listCapstoneAcademyChallenges(topicSlug).length;
}

export function isCapstoneTheoryChallenge(challenge: CapstoneChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
