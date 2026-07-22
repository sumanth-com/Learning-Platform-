import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenReactTopics,
  type ReactTopicDef,
} from "@/features/curriculum/lib/react-academy-curriculum";

export type ReactChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ReactChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ReactChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml: string;
  referenceHtml: string;
  starterJsx: string;
  referenceJsx: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "react-preview";
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
  <div id="root"></div>
</body>
</html>
`;

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ReactChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml?: string;
  referenceHtml: string;
  starterJsx?: string;
  referenceJsx: string;
  acceptanceCriteria: string[];
};

function clip(text: string, _max = 56): string {
  return text.replace(/\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

function htmlPage(title: string): string {
  return BASE_HTML.replace("<title>Document</title>", `<title>${title}</title>`);
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
  referenceJsx: string
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
    realWorldExample: referenceJsx,
    commonMistakes: hints,
    editorLanguage: "text",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function defaultJsx(title: string, body: string): string {
  return `// ${title}
import { useState } from "react";

${body}
`;
}

function specsForTopic(topic: ReactTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "useState";
  const apisList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "props, useState, JSX";

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, ""), 64),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Build a small React component that clearly demonstrates "${title}". Use at least one idea from: ${apisList}.`,
    hints: [
      "Focus on the JSX panel — keep the HTML root mount.",
      `Start with ${primary}.`,
      "Export a clear component name.",
    ],
    takeaways: [summary, "Components + JSX describe UI"],
    referenceHtml: htmlPage(title),
    referenceJsx: defaultJsx(
      title,
      `export default function Demo() {\n  const message = ${JSON.stringify(clip(summary, 80))};\n  return (\n    <main className="page">\n      <h1>${title.replace(/"/g, "")}</h1>\n      <p>{message}</p>\n    </main>\n  );\n}\n`
    ),
    acceptanceCriteria: [
      "Valid function component",
      "JSX demonstrates the topic idea",
      "Readable component structure",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build UI for ${clip(title, 40)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${apisList}.`,
    task: `Write JSX that uses ${apisList} thoughtfully. Prefer clear component and prop names over clever one-liners.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Keep components small and focused."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} — ${c.desc}`)
        : ["Props in, UI out", "State triggers re-renders"],
    referenceHtml: htmlPage(title),
    referenceJsx: defaultJsx(
      title,
      `export default function Practice() {\n  const [ready, setReady] = useState(true);\n  // Focus: ${apisList}\n  return (\n    <main className="page">\n      <h1>${title.replace(/"/g, "")}</h1>\n      <p>{ready ? "Ready" : "Loading…"}</p>\n      <button type="button" onClick={() => setReady((v) => !v)}>\n        Toggle\n      </button>\n    </main>\n  );\n}\n`
    ),
    acceptanceCriteria: [
      "Uses the topic’s key React APIs",
      "Clear component / prop names",
      "HTML root stays intact",
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
      scenario: `Reviewer flagged React code for "${title}": ${mistake}`,
      task: `Rewrite the component so it avoids this mistake: ${mistake}. Prefer maintainable React patterns.`,
      hints: [
        commonMistakes[1] ? `Also watch for: ${commonMistakes[1]}` : "Prefer pure render paths.",
        bestPractices[0] ?? "Keep state minimal.",
        "Don’t mutate props or state in place.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Readable React is professional.",
      ],
      referenceHtml: htmlPage(`${title} — fixed`),
      referenceJsx: defaultJsx(
        title,
        `// Fixed: avoid “${clip(mistake, 60)}”\nexport default function Fixed() {\n  const [status] = useState("ok");\n  return (\n    <main className="page">\n      <h1>${title.replace(/"/g, "")}</h1>\n      <p>Status: {status}</p>\n    </main>\n  );\n}\n`
      ),
      acceptanceCriteria: [
        "Mistake addressed",
        "Immutable / predictable updates",
        "Clear component structure",
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
      task: `Write a component that clearly follows: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Prefer composition over inheritance.",
        "Keep JSX readable.",
        a11yNotes[0] ?? "Use semantic elements and labels when interactive.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceHtml: htmlPage(title),
      referenceJsx: defaultJsx(
        title,
        `export default function Guideline() {\n  const note = ${JSON.stringify(clip(practice, 70))};\n  return (\n    <main className="page">\n      <h1>${title.replace(/"/g, "")}</h1>\n      <p>{note}</p>\n    </main>\n  );\n}\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in JSX",
        "Small, readable component",
        "Semantic markup preferred",
      ],
    });
  }

  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?") ? interviewQ : `Interview: ${interviewQ}`,
        64
      ),
      difficulty: "hard",
      minutes: 12,
      kind: "interview",
      scenario: `Whiteboard warm-up for "${title}". Interviewer asks: ${interviewQ}`,
      task: `Answer with a small React component. Add JSX comments that explain your reasoning.`,
      hints: [
        "Comment the why in JSX/JS",
        interviewQuestions[1] ?? "Keep the example tiny",
        "Prefer modern hooks over class components",
      ],
      takeaways: ["Explain why, not only what", clip(interviewQ, 80)],
      referenceHtml: htmlPage(`Interview — ${title}`),
      referenceJsx: defaultJsx(
        title,
        `// Answering: ${interviewQ}\nexport default function Answer() {\n  const answer = ${JSON.stringify(clip(summary, 90))};\n  return (\n    <main className="page">\n      <h1>${title.replace(/"/g, "")}</h1>\n      <p>{answer}</p>\n    </main>\n  );\n}\n`
      ),
      acceptanceCriteria: [
        "Comments explain the answer",
        "Working React component",
        "Tied to the interview question",
      ],
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isTodo = topic.slug.includes("todo");
    push({
      key: "project",
      title: isTodo ? "Ship a React todo list" : "Ship a React counter",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: `Portfolio warm-up: build a tiny interactive React UI for "${title}".`,
      task: isTodo
        ? "Create a todo list with add + toggle-complete using useState and map with stable keys."
        : "Create a counter with increment, decrement, and reset using useState.",
      hints: [
        "Hold UI state in useState",
        "Derive lists with map + key",
        "Wire buttons with onClick handlers",
      ],
      takeaways: ["UI = state + render", "Events update state, React re-renders"],
      referenceHtml: htmlPage(isTodo ? "Todos" : "Counter"),
      referenceJsx: isTodo
        ? `import { useState } from "react";

type Todo = { id: string; text: string; done: boolean };

export default function TodoApp() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [
      ...prev,
      { id: String(Date.now()), text: value, done: false },
    ]);
    setText("");
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <main className="page">
      <h1>Todos</h1>
      <form onSubmit={addTodo}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
              />
              <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}
`
        : `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <main className="page">
      <h1>Counter</h1>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <button type="button" onClick={() => setCount((c) => c - 1)}>
        −
      </button>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
      <button type="button" onClick={() => setCount(0)}>
        Reset
      </button>
    </main>
  );
}
`,
      acceptanceCriteria: [
        "Interactive controls work via state",
        "State lives in React hooks",
        "UI re-renders from state changes",
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

function buildChallenge(topicSlug: string, spec: Spec): ReactChallenge {
  const id = `react-${topicSlug}-${spec.key}`;
  const starterHtml = spec.starterHtml ?? spec.referenceHtml;
  const starterJsx =
    spec.starterJsx ??
    `import { useState } from "react";\n\nexport default function App() {\n  const [ready] = useState(true);\n  return <main>{ready ? "Start here" : null}</main>;\n}\n`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceJsx
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
    starterJsx,
    referenceJsx: spec.referenceJsx,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "react-preview",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ReactChallenge[] = flattenReactTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ReactChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listReactAcademyChallenges(topicSlug: string): ReactChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allReactAcademyChallenges(): ReactChallenge[] {
  return BANK;
}

export function findReactAcademyChallenge(
  topicSlug: string,
  challengeId: string
): ReactChallenge | null {
  const list = listReactAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function reactAcademyTopicChallengeCount(topicSlug: string): number {
  return listReactAcademyChallenges(topicSlug).length;
}

export function isReactTheoryChallenge(challenge: ReactChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
