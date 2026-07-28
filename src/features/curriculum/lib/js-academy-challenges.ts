import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenJsTopics,
  type JsTopicDef,
} from "@/features/curriculum/lib/js-academy-curriculum";
import { hardJsBundle } from "@/features/curriculum/lib/hard-challenge-blueprints";

export type JsChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type JsChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: JsChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml: string;
  referenceHtml: string;
  starterJs: string;
  referenceJs: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "javascript-console";
  source: "synthetic";
  weekId: number;
};

const BASE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  <main class="page">
    <h1 class="title">Title</h1>
    <p class="lead">Lead text for this lesson.</p>
    <output id="out" class="out"></output>
  </main>
</body>
</html>
`;

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: JsChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml?: string;
  referenceHtml: string;
  starterJs?: string;
  referenceJs: string;
  acceptanceCriteria: string[];
};

function clip(text: string, _max = 56): string {
  return text.replace(/\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function htmlPage(title: string, body: string): string {
  return BASE_HTML.replace("<title>Document</title>", `<title>${title}</title>`).replace(
    /<main class="page">[\s\S]*?<\/main>/,
    `<main class="page">\n    ${body}\n  </main>`
  );
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
  referenceJs: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "database-design",
    description: task,
    problemStatement: `## Scenario\n\n${scenario}\n\n## Task\n\n${task}`,
    erDiagram: scenario,
    tables: [],
    relationships: [],
    normalization: hints.join("\n"),
    indexes: [],
    realWorldExample: referenceJs,
    commonMistakes: hints,
    editorLanguage: "text",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function defaultJs(title: string, body: string): string {
  return `// ${title}
const out = document.querySelector("#out");

${body}
`;
}

function specsForTopic(topic: JsTopicDef): Spec[] {
  const specs: Spec[] = [];
  const push = (spec: Spec) => specs.push(spec);

  const title = topic.title;
  const summary = topic.summary ?? title;
  const explanation = topic.explanation ?? summary;
  const commonMistakes = topic.commonMistakes ?? [];
  const bestPractices = topic.bestPractices ?? [];
  const interviewQuestions = topic.interviewQuestions ?? [];
  const cheatSheet = topic.cheatSheet ?? [];
  const a11yNotes = topic.a11yNotes ?? [];

  const primary = cheatSheet[0]?.tag ?? "console.log";
  const apisList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "let, const, console.log";

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, ""), 64),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Write JavaScript that clearly demonstrates "${title}". Use at least one idea from: ${apisList}.`,
    hints: [
      "Focus on the JS panel — keep the HTML structure.",
      `Start with ${primary}.`,
      "Log or write results to #out so the idea is visible.",
    ],
    takeaways: [summary, "HTML structure + JS behavior"],
    referenceHtml: htmlPage(
      title,
      `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary, 110)}</p>\n    <output id="out" class="out"></output>`
    ),
    referenceJs: defaultJs(
      title,
      `const message = ${JSON.stringify(clip(summary, 80))};\nif (out) out.textContent = message;\nconsole.log(message);\n`
    ),
    acceptanceCriteria: [
      "HTML remains semantic",
      "JS demonstrates the topic idea",
      "Result is readable in #out or the console",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build logic for ${clip(title, 40)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${apisList}.`,
    task: `Write JS that uses ${apisList} thoughtfully with the provided HTML. Prefer clear names over clever one-liners.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Keep side effects obvious (console or #out)."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} — ${c.desc}`)
        : ["Small scripts teach big ideas", "Behavior lives in JavaScript"],
    referenceHtml: htmlPage(
      title,
      `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary, 100)}</p>\n    <button id="run" type="button">Run demo</button>\n    <output id="out" class="out"></output>`
    ),
    referenceJs: defaultJs(
      title,
      `const btn = document.querySelector("#run");\nfunction demo() {\n  // Focus: ${apisList}\n  const result = "Demo for ${title.replace(/"/g, '\\"')}";\n  if (out) out.textContent = result;\n  console.log(result);\n}\nbtn?.addEventListener("click", demo);\ndemo();\n`
    ),
    acceptanceCriteria: [
      "Uses the topic’s key APIs or concepts",
      "Readable variable names",
      "HTML structure stays intact",
    ],
  });

  const mistake = commonMistakes[0];
  if (mistake) {
    push({
      key: "fix",
      title: `Fix: ${clip(mistake, 52)}`,
      difficulty: "medium",
      minutes: 14,
      kind: "fix",
      scenario: `Reviewer flagged JS for "${title}": ${mistake}`,
      task: `Rewrite the script so it avoids this mistake: ${mistake}. Prefer clear, maintainable code.`,
      hints: [
        commonMistakes[1] ? `Also watch for: ${commonMistakes[1]}` : "Prefer const by default.",
        bestPractices[0] ?? "Name things for the next reader.",
        "Avoid silent failures — show the result.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Readable JS is professional.",
      ],
      referenceHtml: htmlPage(
        `${title} — fixed`,
        `<h1 class="title">${title}</h1>\n    <p class="lead">Correct approach: avoid “${clip(mistake, 70)}”.</p>\n    <output id="out" class="out"></output>`
      ),
      referenceJs: defaultJs(
        title,
        `// Fixed: avoid “${clip(mistake, 60)}”\nconst status = "ok";\nif (out) out.textContent = status;\nconsole.log(status);\n`
      ),
      acceptanceCriteria: [
        "Mistake addressed",
        "Clear control flow",
        "Visible output for verification",
      ],
    });
  }

  const practice = bestPractices[0];
  if (practice) {
    push({
      key: "practice",
      title: clip(practice, 60),
      difficulty: "medium",
      minutes: 16,
      kind: "layout",
      scenario: `Team guideline for "${title}": ${practice}`,
      task: `Write JS that clearly follows: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Prefer small functions.",
        "Keep the HTML semantic.",
        a11yNotes[0] ?? "Don’t trap keyboard users if you add interactivity.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceHtml: htmlPage(
        title,
        `<h1 class="title">${title}</h1>\n    <p class="lead">Guideline: ${clip(practice, 90)}</p>\n    <output id="out" class="out"></output>`
      ),
      referenceJs: defaultJs(
        title,
        `function followGuideline() {\n  return ${JSON.stringify(clip(practice, 70))};\n}\nconst note = followGuideline();\nif (out) out.textContent = note;\nconsole.log(note);\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in JS",
        "Small, readable example",
        "Semantic HTML preserved",
      ],
    });
  }

  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    const hard = hardJsBundle(title, interviewQ);
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?") ? interviewQ : `Interview: ${interviewQ}`,
        64
      ),
      difficulty: "hard",
      minutes: hard.minutes,
      kind: "interview",
      scenario: hard.scenario,
      task: hard.task,
      hints: hard.hints,
      takeaways: hard.takeaways,
      referenceHtml: hard.referenceHtml,
      referenceJs: hard.referenceJs,
      acceptanceCriteria: hard.acceptanceCriteria,
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    push({
      key: "project",
      title: topic.slug.includes("todo")
        ? "Ship a mini todo list"
        : "Ship an interactive counter",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: `Portfolio warm-up: build a tiny interactive UI for "${title}".`,
      task: topic.slug.includes("todo")
        ? "Create a todo list with add + toggle-complete using an array of objects and re-render from state."
        : "Create a counter with increment, decrement, and reset. Keep count in a variable and update the DOM.",
      hints: [
        "Hold state in JS, not only in the DOM",
        "Re-render from a single source of truth",
        "Wire buttons with addEventListener",
      ],
      takeaways: ["UI = state + render", "Events connect users to logic"],
      referenceHtml: htmlPage(
        topic.slug.includes("todo") ? "Todos" : "Counter",
        topic.slug.includes("todo")
          ? `<h1 class="title">Todos</h1>\n    <form id="form">\n      <input id="input" name="text" placeholder="New todo" />\n      <button type="submit">Add</button>\n    </form>\n    <ul id="list"></ul>`
          : `<h1 class="title">Counter</h1>\n    <p class="lead">Count: <strong id="count">0</strong></p>\n    <button id="dec" type="button">−</button>\n    <button id="inc" type="button">+</button>\n    <button id="reset" type="button">Reset</button>`
      ),
      referenceJs: topic.slug.includes("todo")
        ? `const form = document.querySelector("#form");\nconst input = document.querySelector("#input");\nconst list = document.querySelector("#list");\n\n/** @type {{ id: string, text: string, done: boolean }[]} */\nconst todos = [];\n\nfunction render() {\n  if (!list) return;\n  list.innerHTML = "";\n  for (const todo of todos) {\n    const li = document.createElement("li");\n    li.textContent = todo.text;\n    if (todo.done) li.style.textDecoration = "line-through";\n    li.addEventListener("click", () => {\n      todo.done = !todo.done;\n      render();\n    });\n    list.appendChild(li);\n  }\n}\n\nform?.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const text = input && "value" in input ? String(input.value).trim() : "";\n  if (!text) return;\n  todos.push({ id: String(Date.now()), text, done: false });\n  if (input && "value" in input) input.value = "";\n  render();\n});\n\nrender();\n`
        : `let count = 0;\nconst countEl = document.querySelector("#count");\n\nfunction render() {\n  if (countEl) countEl.textContent = String(count);\n}\n\ndocument.querySelector("#inc")?.addEventListener("click", () => {\n  count += 1;\n  render();\n});\ndocument.querySelector("#dec")?.addEventListener("click", () => {\n  count -= 1;\n  render();\n});\ndocument.querySelector("#reset")?.addEventListener("click", () => {\n  count = 0;\n  render();\n});\n\nrender();\n`,
      acceptanceCriteria: [
        "Interactive controls work",
        "State lives in JavaScript",
        "DOM updates from a render path",
      ],
    });
  }

  const seen = new Set<string>();
  const unique: Spec[] = [];
  for (const spec of specs) {
    const key = spec.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(spec);
  }
  return pickBalancedSpecs(unique, challengeLimit(topic.challengeWeight));
}

/** Prefer easy → medium → hard so each topic ladders cleanly. */
function pickBalancedSpecs(specs: Spec[], limit: number): Spec[] {
  const byKey = new Map(specs.map((s) => [s.key, s]));
  const prefer = (...keys: string[]) =>
    keys.map((k) => byKey.get(k)).filter((s): s is Spec => Boolean(s));

  // Project beats interview when both compete for the hard slot
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

function buildChallenge(topicSlug: string, spec: Spec): JsChallenge {
  const id = `js-${topicSlug}-${spec.key}`;
  const starterHtml = spec.starterHtml ?? spec.referenceHtml;
  const starterJs =
    spec.starterJs ??
    `// Start here\nconst out = document.querySelector("#out");\nconsole.log("Ready");\n`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceJs
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
    starterHtml,
    referenceHtml: spec.referenceHtml,
    starterJs,
    referenceJs: spec.referenceJs,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "javascript-console",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: JsChallenge[] = flattenJsTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, JsChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listJsAcademyChallenges(topicSlug: string): JsChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allJsAcademyChallenges(): JsChallenge[] {
  return BANK;
}

export function findJsAcademyChallenge(
  topicSlug: string,
  challengeId: string
): JsChallenge | null {
  const list = listJsAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function jsAcademyTopicChallengeCount(topicSlug: string): number {
  return listJsAcademyChallenges(topicSlug).length;
}

/** Theory lessons use dual read-only HTML + JS reference. */
export function isJsTheoryChallenge(challenge: JsChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
