import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenSystemsTopics,
  type SystemsTopicDef,
} from "@/features/curriculum/lib/systems-academy-curriculum";
import {
  buildSystemsPrepDrills,
  pickPrepDrillKeys,
  type PrepDrillGuide,
  type PrepPattern,
} from "@/features/curriculum/lib/interview-prep-drill-factory";

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
  prep: PrepDrillGuide;
  lesson: LearnLesson;
  experience: "systems-lab";
  source: "synthetic";
  weekId: number;
};

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

function talkTrackToMarkdown(title: string, prep: PrepDrillGuide): string {
  return `# ${title}

## Briefing
${prep.briefing}

## Prompts
${prep.prompts.map((p, i) => `${i + 1}. ${p}`).join("\n")}

## Talk track
${prep.talkTrack}
`;
}

function patternsToJson(title: string, patterns: PrepPattern[], prep: PrepDrillGuide): string {
  return `${JSON.stringify(
    {
      title,
      patterns,
      dos: prep.dos,
      donts: prep.donts,
      talkTrack: prep.talkTrack,
    },
    null,
    2
  )}\n`;
}

function specsForTopic(topic: SystemsTopicDef) {
  const drills = buildSystemsPrepDrills(topic);
  const keys = pickPrepDrillKeys(
    topic.challengeWeight,
    topic.challengeWeight >= 5
  );
  return keys.map((key) => {
    const d = drills[key];
    return {
      key,
      title: d.title,
      difficulty: d.difficulty,
      minutes: d.minutes,
      kind: d.kind,
      scenario: d.scenario,
      task: d.task,
      hints: d.hints,
      takeaways: d.takeaways,
      acceptanceCriteria: d.acceptanceCriteria,
      referenceMarkdown: talkTrackToMarkdown(d.title, d.prep),
      referenceJson: patternsToJson(d.title, d.prep.patterns, d.prep),
      prep: d.prep,
    };
  });
}

function buildChallenge(
  topicSlug: string,
  spec: ReturnType<typeof specsForTopic>[number]
): SystemsChallenge {
  const id = `systems-${topicSlug}-${spec.key}`;
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
    starterMarkdown: spec.referenceMarkdown,
    referenceMarkdown: spec.referenceMarkdown,
    starterJson: spec.referenceJson,
    referenceJson: spec.referenceJson,
    acceptanceCriteria: spec.acceptanceCriteria,
    prep: spec.prep,
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
