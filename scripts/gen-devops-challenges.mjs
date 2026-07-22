import fs from "fs";
import path from "path";

const root = process.cwd();

function challengesFile({
  importPath,
  topicType,
  flattenName,
  challengeType,
  kindType,
  experience,
  idPrefix,
  paneA,
  paneB,
  paneALangComment,
  defaultPaneA,
  defaultPaneB,
  category,
  editorLanguage,
}) {
  const A = paneA; // Dockerfile or Yaml
  const B = paneB; // Shell
  const starterA = `starter${A}`;
  const referenceA = `reference${A}`;
  const starterB = `starter${B}`;
  const referenceB = `reference${B}`;

  return `import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  ${flattenName},
  type ${topicType},
} from "@/features/curriculum/lib/${importPath}";

export type ${kindType} =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ${challengeType} = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${starterA}: string;
  ${referenceA}: string;
  ${starterB}: string;
  ${referenceB}: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "${experience}";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${starterA}?: string;
  ${referenceA}: string;
  ${starterB}?: string;
  ${referenceB}: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function blockA(title: string, body: string): string {
  return ${JSON.stringify(paneALangComment)} + title + "\\n" + body + "\\n";
}

function blockB(title: string, body: string): string {
  return "# " + title + "\\n" + body + "\\n";
}

function slugToken(topic: ${topicType}): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: ${topicType}): string {
  return blockA(topic.title, ${defaultPaneA});
}

function defaultB(topic: ${topicType}): string {
  return blockB(topic.title, ${defaultPaneB});
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
    category: "${category}",
    description: task,
    problemStatement: \`## Scenario\\n\\n\${scenario}\\n\\n## Task\\n\\n\${task}\`,
    erDiagram: scenario,
    tables: [],
    relationships: [],
    normalization: hints.join("\\n"),
    indexes: [],
    realWorldExample: referenceCode,
    commonMistakes: hints,
    editorLanguage: "${editorLanguage}",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function specsForTopic(topic: ${topicType}): Spec[] {
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
    title: clip(String(summary).replace(/\\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\\.)\\s+/).slice(0, 2).join(" "),
    task: \`Draft reference files that demonstrate "\${title}". Use ideas from: \${toolList}.\`,
    hints: [
      "Start from the primary concept pane and keep it minimal.",
      \`Focus on \${primary}.\`,
      "Pair the panes so a teammate could follow the steps.",
    ],
    takeaways: [summary, "Automation and clear config make releases safer"],
    ${referenceA}: baseA,
    ${referenceB}: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Both panes are coherent together",
      "No secrets hardcoded in the examples",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? \`Practice \${cheatSheet[0].tag}\`
      : \`Build a workflow for \${clip(title)}\`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: \`Practice the core tools for "\${title}": \${toolList}.\`,
    task: \`Produce practical examples using \${toolList}. Prefer clear names and comments.\`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => \`Use \${c.tag}: \${c.desc}\`)
      .concat(["Keep the example small enough to review in one pass."]),
    takeaways: bestPractices.slice(0, 2),
    ${referenceA}: baseA,
    ${referenceB}: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable comments explain why",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "fix",
    title: \`Fix a broken \${clip(title)} setup\`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: \`A teammate shipped a fragile "\${title}" setup. Common mistakes include: \${commonMistakes.slice(0, 2).join("; ") || "missing validation and hardcoded config"}.\`,
    task: \`Repair the reference so it follows safer practices for \${title}. Call out what was wrong.\`,
    hints: [
      commonMistakes[0] || "Remove hardcoded secrets",
      bestPractices[0] || "Prefer explicit configuration",
      \`Re-check \${primary} usage\`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid fragile manual steps",
      bestPractices[0] || "Prefer repeatable automation",
    ],
    ${referenceA}: baseA,
    ${referenceB}: baseB,
    acceptanceCriteria: [
      "Identifies the failure mode",
      "Applies at least one best practice",
      "Leaves a safer reference than before",
    ],
  });

  push({
    key: "practice",
    title: \`Practice \${clip(title)}\`,
    difficulty: "medium",
    minutes: 12,
    kind: "layout",
    scenario: \`You are preparing a handoff doc for "\${title}" using: \${toolList}.\`,
    task: \`Create a clean reference a junior engineer can copy. Include verification commands.\`,
    hints: [
      "Keep commands copy-pasteable",
      \`Highlight \${primary}\`,
      bestPractices[1] || "Document rollback or failure handling",
    ],
    takeaways: bestPractices.slice(0, 2),
    ${referenceA}: baseA,
    ${referenceB}: baseB,
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
      title: \`Interview: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 15,
      kind: "interview",
      scenario: interviewQuestions[0]
        ? \`Interview prompt: \${interviewQuestions[0]}\`
        : \`Explain "\${title}" as you would in a staffing interview.\`,
      task: \`Answer with concrete examples in both panes. Cover trade-offs and failure modes for \${title}.\`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you verify success",
        bestPractices[0] || "Mention observability",
      ],
      takeaways: [
        summary,
        bestPractices[0] || "Prefer reversible changes",
      ],
      ${referenceA}: baseA,
      ${referenceB}: baseB,
      acceptanceCriteria: [
        "Answers the interview angle",
        "Includes a concrete example",
        "Mentions at least one risk",
      ],
    });
  } else {
    push({
      key: "project",
      title: \`Mini project: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 18,
      kind: "project",
      scenario: \`Ship a small but complete "\${title}" setup for a demo service using \${toolList}.\`,
      task: \`Produce production-minded references with comments for rollout, verification, and rollback.\`,
      hints: [
        bestPractices[0] || "Automate the happy path",
        bestPractices[1] || "Plan rollback",
        commonMistakes[0] || "Avoid secrets in files",
      ],
      takeaways: bestPractices.slice(0, 3),
      ${referenceA}: baseA,
      ${referenceB}: baseB,
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

function buildChallenge(topicSlug: string, spec: Spec): ${challengeType} {
  const id = \`${idPrefix}-\${topicSlug}-\${spec.key}\`;
  const ${starterA} = spec.${starterA} ?? spec.${referenceA};
  const ${starterB} =
    spec.${starterB} ??
    \`# Start here\\n# Write your commands\\necho "todo"\\n\`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.${referenceB}
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
    ${starterA},
    ${referenceA}: spec.${referenceA},
    ${starterB},
    ${referenceB}: spec.${referenceB},
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "${experience}",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ${challengeType}[] = ${flattenName}().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ${challengeType}[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function list${challengeType}s(topicSlug: string): ${challengeType}[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function all${challengeType}s(): ${challengeType}[] {
  return BANK;
}

export function find${challengeType}(
  topicSlug: string,
  challengeId: string
): ${challengeType} | null {
  const list = list${challengeType}s(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function ${idPrefix}AcademyTopicChallengeCount(topicSlug: string): number {
  return list${challengeType}s(topicSlug).length;
}

export function is${challengeType.replace("Challenge", "")}TheoryChallenge(challenge: ${challengeType}): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
`;
}

// Fix export names to match expected API (listDeploymentAcademyChallenges etc.)
// The template above used awkward names - write specialized files instead.

const deployDefaultA = `\`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
# Topic token: \${slugToken(topic)}
\``;

const deployDefaultB = `\`#!/usr/bin/env bash
set -euo pipefail
IMAGE="app:\${slugToken(topic)}"
docker build -t "$IMAGE" .
docker run --rm -p 3000:3000 -e PORT=3000 "$IMAGE"
curl -fsS http://127.0.0.1:3000/health || true
\``;

const cicdDefaultA = `\`name: \${slugToken(topic)}
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
        run: echo "setup for \${clip(topic.title)}"
      - name: Test
        run: echo "run checks"
\``;

const cicdDefaultB = `\`#!/usr/bin/env bash
set -euo pipefail
echo "Local mirror of CI for \${slugToken(topic)}"
npm ci
npm test
npm run build
\``;

function writeChallenges(outFile, opts) {
  // Use a cleaner hand-written-ish generator via Function replacement
  let src = challengesFile(opts);
  // Fix export function names
  if (opts.idPrefix === "deploy") {
    src = src
      .replaceAll("listDeploymentChallenges", "listDeploymentAcademyChallenges")
      .replaceAll("allDeploymentChallenges", "allDeploymentAcademyChallenges")
      .replaceAll("findDeploymentChallenge", "findDeploymentAcademyChallenge")
      .replaceAll(
        "deployAcademyTopicChallengeCount",
        "deploymentAcademyTopicChallengeCount"
      )
      .replaceAll(
        "isDeploymentTheoryChallenge",
        "isDeploymentTheoryChallenge"
      )
      .replaceAll("list${challengeType}s", "listDeploymentAcademyChallenges")
      .replaceAll("all${challengeType}s", "allDeploymentAcademyChallenges")
      .replaceAll("find${challengeType}", "findDeploymentAcademyChallenge")
      .replace(
        /export function listDeploymentChallenges/,
        "export function listDeploymentAcademyChallenges"
      );
  }
  fs.writeFileSync(path.join(root, outFile), src);
  console.log("wrote", outFile);
}

// The template interpolation for list${challengeType}s already resolved.
// challengeType DeploymentChallenge -> listDeploymentChallenges - need Academy in name.

function finalize(src, names) {
  return src
    .replaceAll(`list${names.type}s`, names.list)
    .replaceAll(`all${names.type}s`, names.all)
    .replaceAll(`find${names.type}`, names.find)
    .replaceAll(`${names.prefix}AcademyTopicChallengeCount`, names.count)
    .replaceAll(
      `is${names.type.replace("Challenge", "")}TheoryChallenge`,
      names.theory
    );
}

{
  const raw = challengesFile({
    importPath: "deployment-academy-curriculum",
    topicType: "DeploymentTopicDef",
    flattenName: "flattenDeploymentTopics",
    challengeType: "DeploymentChallenge",
    kindType: "DeploymentChallengeKind",
    experience: "deploy-lab",
    idPrefix: "deploy",
    paneA: "Dockerfile",
    paneB: "Shell",
    paneALangComment: "# ",
    defaultPaneA: deployDefaultA,
    defaultPaneB: deployDefaultB,
    category: "git",
    editorLanguage: "shell",
  });
  const src = finalize(raw, {
    type: "DeploymentChallenge",
    prefix: "deploy",
    list: "listDeploymentAcademyChallenges",
    all: "allDeploymentAcademyChallenges",
    find: "findDeploymentAcademyChallenge",
    count: "deploymentAcademyTopicChallengeCount",
    theory: "isDeploymentTheoryChallenge",
  });
  fs.writeFileSync(
    path.join(root, "src/features/curriculum/lib/deployment-academy-challenges.ts"),
    src
  );
  console.log("wrote deployment-academy-challenges.ts");
}

{
  const raw = challengesFile({
    importPath: "cicd-academy-curriculum",
    topicType: "CicdTopicDef",
    flattenName: "flattenCicdTopics",
    challengeType: "CicdChallenge",
    kindType: "CicdChallengeKind",
    experience: "cicd-lab",
    idPrefix: "cicd",
    paneA: "Yaml",
    paneB: "Shell",
    paneALangComment: "# ",
    defaultPaneA: cicdDefaultA,
    defaultPaneB: cicdDefaultB,
    category: "git",
    editorLanguage: "yaml",
  });
  const src = finalize(raw, {
    type: "CicdChallenge",
    prefix: "cicd",
    list: "listCicdAcademyChallenges",
    all: "allCicdAcademyChallenges",
    find: "findCicdAcademyChallenge",
    count: "cicdAcademyTopicChallengeCount",
    theory: "isCicdTheoryChallenge",
  });
  fs.writeFileSync(
    path.join(root, "src/features/curriculum/lib/cicd-academy-challenges.ts"),
    src
  );
  console.log("wrote cicd-academy-challenges.ts");
}
