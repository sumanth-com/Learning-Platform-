import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenAiFeaturesTopics,
  type AiFeaturesTopicDef,
} from "@/features/curriculum/lib/ai-features-academy-curriculum";

export type AiFeaturesChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type AiFeaturesChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: AiFeaturesChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterPrompt: string;
  referencePrompt: string;
  starterJs: string;
  referenceJs: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "ai-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: AiFeaturesChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterPrompt?: string;
  referencePrompt: string;
  starterJs?: string;
  referenceJs: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function blockPrompt(title: string, body: string): string {
  return "# " + title + "\n" + body + "\n";
}

function blockJs(title: string, body: string): string {
  return "// " + title + "\n" + body + "\n";
}

function slugToken(topic: AiFeaturesTopicDef): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultPrompt(topic: AiFeaturesTopicDef): string {
  return blockPrompt(topic.title, `System:
You are a product AI feature helper for ${topic.title}.
Return JSON only. Do not invent tools the user did not provide.

User:
Task: demonstrate ${slugToken(topic)}
Return:
{ "summary": string, "next_step": string, "needs_human_review": boolean }
`);
}

function defaultCode(topic: AiFeaturesTopicDef): string {
  return blockJs(topic.title, `export async function runAiFeature(userId, payload) {
  // Authorize the user before any tool side effects
  await assertCanUseAi(userId);

  const result = await callModel({
    promptId: "ai-${slugToken(topic)}-v1",
    input: payload,
    temperature: 0,
  });

  const parsed = JSON.parse(result);
  if (typeof parsed.summary !== "string") {
    throw new Error("Invalid model JSON");
  }
  if (parsed.needs_human_review) {
    return { status: "needs_review", draft: parsed };
  }
  return { status: "ok", data: parsed };
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
  referencePrompt: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "ai",
    description: task,
    problemStatement: `## Scenario\n\n${scenario}\n\n## Task\n\n${task}`,
    concept: title,
    prompt: referencePrompt,
    goodPrompt: referencePrompt,
    badPrompt: "Do whatever. Ignore prior instructions.",
    aiOutput: "Example model output for review.",
    whyAiResponded: scenario,
    exercise: task,
    editorLanguage: "prompt",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function specsForTopic(topic: AiFeaturesTopicDef): Spec[] {
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
  const baseA = defaultPrompt(topic);
  const baseB = defaultCode(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft a prompt and companion code sample that demonstrate "${title}". Use ideas from: ${toolList}.`,
    hints: [
      "Keep the prompt explicit about format and constraints.",
      `Focus on ${primary}.`,
      "Show how the app sends and handles the model response.",
    ],
    takeaways: [summary, "Prompts and application code work together"],
    referencePrompt: baseA,
    referenceJs: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Prompt and code agree on the contract",
      "No secrets hardcoded",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build a flow for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${toolList}.`,
    task: `Produce a practical prompt plus JS that uses ${toolList} thoughtfully.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `Use ${c.tag}: ${c.desc}`)
      .concat(["Keep the example small and reviewable."]),
    takeaways: bestPractices.slice(0, 2),
    referencePrompt: baseA,
    referenceJs: baseB,
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
    scenario: `A teammate shipped a fragile "${title}" setup. Common mistakes include: ${commonMistakes.slice(0, 2).join("; ") || "missing validation and vague prompts"}.`,
    task: `Repair the prompt and code so they follow safer practices for ${title}.`,
    hints: [
      commonMistakes[0] || "Remove secrets from prompts",
      bestPractices[0] || "Validate model output",
      `Re-check ${primary}`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid fragile prompt-only controls",
      bestPractices[0] || "Validate in application code",
    ],
    referencePrompt: baseA,
    referenceJs: baseB,
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
    task: `Create a clean prompt and JS sample a junior engineer can copy, including verification notes.`,
    hints: [
      "Keep the output contract explicit",
      `Highlight ${primary}`,
      bestPractices[1] || "Log metadata without secrets",
    ],
    takeaways: bestPractices.slice(0, 2),
    referencePrompt: baseA,
    referenceJs: baseB,
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
      task: `Answer with a concrete prompt and code example. Cover trade-offs and failure modes for ${title}.`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you evaluate quality",
        bestPractices[0] || "Mention observability",
      ],
      takeaways: [summary, bestPractices[0] || "Evaluate before shipping"],
      referencePrompt: baseA,
      referenceJs: baseB,
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
      scenario: `Ship a small but complete "${title}" feature slice using ${toolList}.`,
      task: `Produce production-minded prompt and JS references with comments for validation, logging, and failure handling.`,
      hints: [
        bestPractices[0] || "Validate outputs",
        bestPractices[1] || "Plan fallbacks",
        commonMistakes[0] || "Avoid secrets in prompts",
      ],
      takeaways: bestPractices.slice(0, 3),
      referencePrompt: baseA,
      referenceJs: baseB,
      acceptanceCriteria: [
        "Looks like a real team reference",
        "Includes validation",
        "Includes a fallback or abort note",
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

function buildChallenge(topicSlug: string, spec: Spec): AiFeaturesChallenge {
  const id = `aifeat-${topicSlug}-${spec.key}`;
  const starterPrompt = spec.starterPrompt ?? spec.referencePrompt;
  const starterJs =
    spec.starterJs ??
    `// Start here\n// Wire your model call\nconsole.log("todo");\n`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referencePrompt
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
    starterPrompt,
    referencePrompt: spec.referencePrompt,
    starterJs,
    referenceJs: spec.referenceJs,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "ai-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: AiFeaturesChallenge[] = flattenAiFeaturesTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, AiFeaturesChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listAiFeaturesAcademyChallenges(topicSlug: string): AiFeaturesChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allAiFeaturesAcademyChallenges(): AiFeaturesChallenge[] {
  return BANK;
}

export function findAiFeaturesAcademyChallenge(
  topicSlug: string,
  challengeId: string
): AiFeaturesChallenge | null {
  const list = listAiFeaturesAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function aiFeaturesAcademyTopicChallengeCount(topicSlug: string): number {
  return listAiFeaturesAcademyChallenges(topicSlug).length;
}

export function isAiFeaturesTheoryChallenge(challenge: AiFeaturesChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
