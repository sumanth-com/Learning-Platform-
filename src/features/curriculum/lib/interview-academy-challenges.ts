import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenInterviewTopics,
  type InterviewTopicDef,
} from "@/features/curriculum/lib/interview-academy-curriculum";
import {
  buildInterviewPrepDrills,
  pickPrepDrillKeys,
  type PrepDrillGuide,
  type PrepPattern,
} from "@/features/curriculum/lib/interview-prep-drill-factory";

export type InterviewChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type InterviewChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: InterviewChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterJs: string;
  referenceJs: string;
  starterMarkdown: string;
  referenceMarkdown: string;
  acceptanceCriteria: string[];
  prep: PrepDrillGuide;
  lesson: LearnLesson;
  experience: "interview-lab";
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

function patternsToJs(title: string, patterns: PrepPattern[]): string {
  const lines = patterns
    .map((p) => `  // ${p.tag}: ${p.desc}`)
    .join("\n");
  return `// ${title}\nfunction patternNotes() {\n${lines}\n  return true;\n}\n`;
}

function specsForTopic(topic: InterviewTopicDef) {
  const drills = buildInterviewPrepDrills(topic);
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
      referenceJs: patternsToJs(d.title, d.prep.patterns),
      prep: d.prep,
    };
  });
}

function buildChallenge(
  topicSlug: string,
  spec: ReturnType<typeof specsForTopic>[number]
): InterviewChallenge {
  const id = `interview-${topicSlug}-${spec.key}`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceMarkdown
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
    starterJs: spec.referenceJs,
    referenceJs: spec.referenceJs,
    starterMarkdown: spec.referenceMarkdown,
    referenceMarkdown: spec.referenceMarkdown,
    acceptanceCriteria: spec.acceptanceCriteria,
    prep: spec.prep,
    lesson,
    experience: "interview-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: InterviewChallenge[] = flattenInterviewTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, InterviewChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listInterviewAcademyChallenges(topicSlug: string): InterviewChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allInterviewAcademyChallenges(): InterviewChallenge[] {
  return BANK;
}

export function findInterviewAcademyChallenge(
  topicSlug: string,
  challengeId: string
): InterviewChallenge | null {
  const list = listInterviewAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null;
}

export function interviewAcademyTopicChallengeCount(topicSlug: string): number {
  return listInterviewAcademyChallenges(topicSlug).length;
}

export function isInterviewTheoryChallenge(challenge: InterviewChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
