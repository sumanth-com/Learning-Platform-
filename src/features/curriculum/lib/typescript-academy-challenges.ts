import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenTypescriptTopics,
  type TypescriptTopicDef,
} from "@/features/curriculum/lib/typescript-academy-curriculum";

export type TypescriptChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type TypescriptChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: TypescriptChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml: string;
  referenceHtml: string;
  starterTs: string;
  referenceTs: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "typescript-console";
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
  kind: TypescriptChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml?: string;
  referenceHtml: string;
  starterTs?: string;
  referenceTs: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
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
  referenceTs: string
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
    realWorldExample: referenceTs,
    commonMistakes: hints,
    editorLanguage: "text",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function defaultTs(title: string, body: string): string {
  return `// ${title}
const out = document.querySelector("#out");

${body}
`;
}

function specsForTopic(topic: TypescriptTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "string";
  const apisList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "string, number, boolean";

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Write TypeScript that clearly demonstrates "${title}". Use at least one idea from: ${apisList}.`,
    hints: [
      "Focus on the TS panel - keep the HTML structure.",
      `Start with ${primary}.`,
      "Prefer explicit types over any.",
    ],
    takeaways: [summary, "Types document intent and catch bugs early"],
    referenceHtml: htmlPage(
      title,
      `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary)}</p>\n    <output id="out" class="out"></output>`
    ),
    referenceTs: defaultTs(
      title,
      `const message: string = ${JSON.stringify(clip(summary))};\nif (out) out.textContent = message;\nconsole.log(message);\n`
    ),
    acceptanceCriteria: [
      "Valid TypeScript with clear annotations",
      "Demonstrates the topic idea",
      "Readable output in #out or the console",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build types for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${apisList}.`,
    task: `Write TypeScript that uses ${apisList} thoughtfully with the provided HTML. Prefer clear names and avoid any.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Keep side effects obvious (console or #out)."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} - ${c.desc}`)
        : ["Annotate public APIs", "Let inference handle locals when obvious"],
    referenceHtml: htmlPage(
      title,
      `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary)}</p>\n    <button id="run" type="button">Run demo</button>\n    <output id="out" class="out"></output>`
    ),
    referenceTs: defaultTs(
      title,
      `const btn = document.querySelector("#run");\nfunction demo(): void {\n  // Focus: ${apisList}\n  const result: string = "Demo for ${title.replace(/"/g, '\\"')}";\n  if (out) out.textContent = result;\n  console.log(result);\n}\nbtn?.addEventListener("click", demo);\ndemo();\n`
    ),
    acceptanceCriteria: [
      "Uses the topic key TypeScript features",
      "Readable type annotations",
      "HTML structure stays intact",
    ],
  });

  const mistake = commonMistakes[0];
  if (mistake) {
    push({
      key: "fix",
      title: `Fix: ${clip(mistake)}`,
      difficulty: "medium",
      minutes: 14,
      kind: "fix",
      scenario: `Reviewer flagged TypeScript for "${title}": ${mistake}`,
      task: `Rewrite the script so it avoids this mistake: ${mistake}. Prefer maintainable types.`,
      hints: [
        commonMistakes[1] ? `Also watch for: ${commonMistakes[1]}` : "Prefer unknown over any.",
        bestPractices[0] ?? "Name types for the next reader.",
        "Narrow before you use a value.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Readable TypeScript is professional.",
      ],
      referenceHtml: htmlPage(
        `${title} - fixed`,
        `<h1 class="title">${title}</h1>\n    <p class="lead">Correct approach: avoid "${clip(mistake)}".</p>\n    <output id="out" class="out"></output>`
      ),
      referenceTs: defaultTs(
        title,
        `// Fixed: avoid "${clip(mistake)}"\nconst status: "ok" | "error" = "ok";\nif (out) out.textContent = status;\nconsole.log(status);\n`
      ),
      acceptanceCriteria: [
        "Mistake addressed",
        "Clear types and narrowing",
        "Visible output for verification",
      ],
    });
  }

  const practice = bestPractices[0];
  if (practice) {
    push({
      key: "practice",
      title: clip(practice),
      difficulty: "medium",
      minutes: 16,
      kind: "layout",
      scenario: `Team guideline for "${title}": ${practice}`,
      task: `Write TypeScript that clearly follows: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Prefer small typed functions.",
        "Keep the HTML semantic.",
        a11yNotes[0] ?? "Typed events still need accessible markup.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceHtml: htmlPage(
        title,
        `<h1 class="title">${title}</h1>\n    <p class="lead">Guideline: ${clip(practice)}</p>\n    <output id="out" class="out"></output>`
      ),
      referenceTs: defaultTs(
        title,
        `function followGuideline(): string {\n  return ${JSON.stringify(clip(practice))};\n}\nconst note: string = followGuideline();\nif (out) out.textContent = note;\nconsole.log(note);\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in TypeScript",
        "Small, readable example",
        "Semantic HTML preserved",
      ],
    });
  }

  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?") ? interviewQ : `Interview: ${interviewQ}`
      ),
      difficulty: "hard",
      minutes: 12,
      kind: "interview",
      scenario: `Whiteboard warm-up for "${title}". Interviewer asks: ${interviewQ}`,
      task: `Answer with a small HTML + TypeScript example. Add TS comments that explain your reasoning.`,
      hints: [
        "Comment the why in TypeScript",
        interviewQuestions[1] ?? "Keep the example tiny",
        "Prefer unknown + narrowing over any",
      ],
      takeaways: ["Explain why, not only what", clip(interviewQ)],
      referenceHtml: htmlPage(
        `Interview - ${title}`,
        `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary)}</p>\n    <output id="out" class="out"></output>`
      ),
      referenceTs: defaultTs(
        title,
        `// Answering: ${interviewQ}\nconst answer: string = ${JSON.stringify(clip(summary))};\nif (out) out.textContent = answer;\nconsole.log(answer);\n`
      ),
      acceptanceCriteria: [
        "TS comments explain the answer",
        "Working HTML + TypeScript pair",
        "Tied to the interview question",
      ],
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isForm = topic.slug.includes("form");
    push({
      key: "project",
      title: isForm
        ? "Ship a typed form model"
        : "Ship a typed todo list",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: `Portfolio warm-up: build a tiny typed app for "${title}".`,
      task: isForm
        ? "Model a contact form with an interface, validate required fields, and render typed status messages."
        : "Create a typed todo list with add + toggle-complete using an interface and immutable updates.",
      hints: [
        "Define an interface for your data",
        "Avoid any in state and handlers",
        "Narrow before reading optional fields",
      ],
      takeaways: ["Interfaces model domain data", "Types make refactors safer"],
      referenceHtml: htmlPage(
        isForm ? "Form" : "Todos",
        isForm
          ? `<h1 class="title">Contact</h1>\n    <form id="form">\n      <input id="name" name="name" placeholder="Name" />\n      <input id="email" name="email" placeholder="Email" />\n      <button type="submit">Send</button>\n    </form>\n    <output id="out" class="out"></output>`
          : `<h1 class="title">Todos</h1>\n    <form id="form">\n      <input id="input" name="text" placeholder="New todo" />\n      <button type="submit">Add</button>\n    </form>\n    <ul id="list"></ul>`
      ),
      referenceTs: isForm
        ? `interface ContactForm {\n  name: string;\n  email: string;\n}\n\nconst form = document.querySelector("#form");\nconst nameInput = document.querySelector("#name");\nconst emailInput = document.querySelector("#email");\nconst out = document.querySelector("#out");\n\nfunction readValue(el: Element | null): string {\n  return el && "value" in el ? String((el as HTMLInputElement).value).trim() : "";\n}\n\nform?.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const data: ContactForm = {\n    name: readValue(nameInput),\n    email: readValue(emailInput),\n  };\n  const status: string =\n    data.name && data.email.includes("@")\n      ? \`Ready to send to \${data.email}\`\n      : "Name and valid email required";\n  if (out) out.textContent = status;\n});\n`
        : `interface Todo {\n  id: string;\n  text: string;\n  done: boolean;\n}\n\nconst form = document.querySelector("#form");\nconst input = document.querySelector("#input");\nconst list = document.querySelector("#list");\n\nlet todos: Todo[] = [];\n\nfunction render(): void {\n  if (!list) return;\n  list.innerHTML = "";\n  for (const todo of todos) {\n    const li = document.createElement("li");\n    li.textContent = todo.text;\n    if (todo.done) li.style.textDecoration = "line-through";\n    li.addEventListener("click", () => {\n      todos = todos.map((t) =>\n        t.id === todo.id ? { ...t, done: !t.done } : t\n      );\n      render();\n    });\n    list.appendChild(li);\n  }\n}\n\nform?.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const text =\n    input && "value" in input ? String((input as HTMLInputElement).value).trim() : "";\n  if (!text) return;\n  const next: Todo = { id: String(Date.now()), text, done: false };\n  todos = [...todos, next];\n  if (input && "value" in input) (input as HTMLInputElement).value = "";\n  render();\n});\n\nrender();\n`,
      acceptanceCriteria: [
        "Domain data uses an interface",
        "No any in core logic",
        "UI updates from typed state",
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

function buildChallenge(topicSlug: string, spec: Spec): TypescriptChallenge {
  const id = `ts-${topicSlug}-${spec.key}`;
  const starterHtml = spec.starterHtml ?? spec.referenceHtml;
  const starterTs =
    spec.starterTs ??
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
    spec.referenceTs
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
    starterTs,
    referenceTs: spec.referenceTs,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "typescript-console",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: TypescriptChallenge[] = flattenTypescriptTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, TypescriptChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listTypescriptAcademyChallenges(
  topicSlug: string
): TypescriptChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allTypescriptAcademyChallenges(): TypescriptChallenge[] {
  return BANK;
}

export function findTypescriptAcademyChallenge(
  topicSlug: string,
  challengeId: string
): TypescriptChallenge | null {
  const list = listTypescriptAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function typescriptAcademyTopicChallengeCount(topicSlug: string): number {
  return listTypescriptAcademyChallenges(topicSlug).length;
}

export function isTypescriptTheoryChallenge(
  challenge: TypescriptChallenge
): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
