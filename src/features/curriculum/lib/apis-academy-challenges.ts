import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenApisTopics,
  type ApisTopicDef,
} from "@/features/curriculum/lib/apis-academy-curriculum";

export type ApisChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ApisChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ApisChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHttp: string;
  referenceHttp: string;
  starterJs: string;
  referenceJs: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "api-playground";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ApisChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHttp?: string;
  referenceHttp: string;
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

function httpExchange(title: string, request: string, response: string): string {
  return `# ${title}

## Request
${request}

## Response
${response}
`;
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
${body}
`;
}

function specsForTopic(topic: ApisTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "GET";
  const apisList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "GET, POST, JSON";

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft HTTP request/response examples and a fetch client that demonstrates "${title}". Use at least one idea from: ${apisList}.`,
    hints: [
      "Focus on the HTTP panel for request and response shape.",
      `Start with ${primary}.`,
      "Pair the HTTP example with a small fetch client in JS.",
    ],
    takeaways: [summary, "HTTP messages pair requests with responses"],
    referenceHttp: httpExchange(
      title,
      `GET /api/demo HTTP/1.1\nHost: api.example.com\nAccept: application/json\n`,
      `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"topic": ${JSON.stringify(clip(summary))}, "status": "ok"}\n`
    ),
    referenceJs: defaultJs(
      title,
      `const url = "https://api.example.com/demo";\n\nasync function demo() {\n  const res = await fetch(url, {\n    headers: { Accept: "application/json" },\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  const data = await res.json();\n  console.log(data);\n  return data;\n}\n\ndemo().catch(console.error);\n`
    ),
    acceptanceCriteria: [
      "Valid HTTP request and response examples",
      "Demonstrates the topic idea",
      "Fetch client mirrors the HTTP exchange",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build requests for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${apisList}.`,
    task: `Write HTTP examples and a fetch client that uses ${apisList} thoughtfully. Prefer clear headers and status handling.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Check res.ok before parsing JSON."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} - ${c.desc}`)
        : ["Document request shape", "Handle non-2xx responses explicitly"],
    referenceHttp: httpExchange(
      title,
      `POST /api/demo HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nAccept: application/json\n\n{"action": "run", "topic": ${JSON.stringify(clip(title))}}\n`,
      `HTTP/1.1 201 Created\nContent-Type: application/json\nLocation: /api/demo/1\n\n{"id": "1", "status": "created"}\n`
    ),
    referenceJs: defaultJs(
      title,
      `async function runDemo() {\n  const res = await fetch("https://api.example.com/demo", {\n    method: "POST",\n    headers: {\n      "Content-Type": "application/json",\n      Accept: "application/json",\n    },\n    body: JSON.stringify({ action: "run", topic: ${JSON.stringify(title)} }),\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  const data = await res.json();\n  console.log(data);\n  return data;\n}\n\nrunDemo().catch(console.error);\n`
    ),
    acceptanceCriteria: [
      "Uses the topic key HTTP patterns",
      "Headers and body match the scenario",
      "Fetch client handles status codes",
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
      scenario: `Reviewer flagged API usage for "${title}": ${mistake}`,
      task: `Rewrite the HTTP exchange and fetch client so they avoid this mistake: ${mistake}. Prefer maintainable error handling.`,
      hints: [
        commonMistakes[1]
          ? `Also watch for: ${commonMistakes[1]}`
          : "Return precise status codes, not 200 with errors.",
        bestPractices[0] ?? "Document expected request and response shapes.",
        "Branch on res.ok and res.status before parsing.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Correct HTTP semantics prevent client bugs.",
      ],
      referenceHttp: httpExchange(
        `${title} - fixed`,
        `GET /api/resource/42 HTTP/1.1\nHost: api.example.com\nAccept: application/json\n`,
        `HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{"error": "Resource not found", "code": "NOT_FOUND"}\n`
      ),
      referenceJs: defaultJs(
        title,
        `// Fixed: avoid "${clip(mistake)}"\nasync function fetchResource(id) {\n  const res = await fetch(\`https://api.example.com/resource/\${id}\`);\n  if (res.status === 404) {\n    const err = await res.json();\n    throw new Error(err.error ?? "Not found");\n  }\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nfetchResource("42").catch(console.error);\n`
      ),
      acceptanceCriteria: [
        "Mistake addressed in HTTP and JS",
        "Clear status and error handling",
        "Client behavior matches HTTP contract",
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
      task: `Write HTTP examples and a fetch client that clearly follow: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Prefer small, focused endpoints.",
        "Include Content-Type and Accept headers when sending JSON.",
        a11yNotes[0] ?? "Map API errors to user-readable messages in clients.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceHttp: httpExchange(
        title,
        `GET /api/guideline HTTP/1.1\nHost: api.example.com\nAccept: application/json\n`,
        `HTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: no-store\n\n{"guideline": ${JSON.stringify(clip(practice))}}\n`
      ),
      referenceJs: defaultJs(
        title,
        `async function followGuideline() {\n  const res = await fetch("https://api.example.com/guideline", {\n    headers: { Accept: "application/json" },\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  const data = await res.json();\n  console.log(data.guideline);\n  return data.guideline;\n}\n\nfollowGuideline().catch(console.error);\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in HTTP and fetch client",
        "Small, readable example",
        "Headers and status codes are intentional",
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
      task: `Answer with HTTP request/response examples and a fetch client. Add JS comments that explain your reasoning.`,
      hints: [
        "Comment the why in the JS client",
        interviewQuestions[1] ?? "Keep the example tiny",
        "Show status codes and headers that matter",
      ],
      takeaways: ["Explain why, not only what", clip(interviewQ)],
      referenceHttp: httpExchange(
        `Interview - ${title}`,
        `GET /api/interview HTTP/1.1\nHost: api.example.com\nAccept: application/json\n`,
        `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"answer": ${JSON.stringify(clip(summary))}}\n`
      ),
      referenceJs: defaultJs(
        title,
        `// Answering: ${interviewQ}\nasync function answer() {\n  const res = await fetch("https://api.example.com/interview");\n  const data = await res.json();\n  console.log(data.answer);\n  return data.answer;\n}\n\nanswer().catch(console.error);\n`
      ),
      acceptanceCriteria: [
        "JS comments explain the answer",
        "Working HTTP + fetch client pair",
        "Tied to the interview question",
      ],
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isWeather = topic.slug.includes("weather");
    push({
      key: "project",
      title: isWeather
        ? "Ship a weather API client"
        : "Ship a tiny todo REST client",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: isWeather
        ? `Portfolio warm-up: build a weather client for "${title}".`
        : `Portfolio warm-up: build a todo REST client for "${title}".`,
      task: isWeather
        ? "Write a GET request with query params and a fetch client that handles loading, success, and error states."
        : "Write HTTP examples for todo list and create, then a fetch client that lists and creates todos.",
      hints: [
        isWeather
          ? "Proxy API keys through your backend in production"
          : "Use POST for create and GET for list",
        "Check res.ok before parsing JSON",
        isWeather
          ? "Handle 404 city not found separately from network errors"
          : "Return 201 Created with Location on create",
      ],
      takeaways: isWeather
        ? ["Query params pass search input", "Surface friendly error messages"]
        : ["CRUD maps to HTTP methods", "Consistent JSON error shapes"],
      referenceHttp: isWeather
        ? httpExchange(
            "Weather lookup",
            `GET /weather?q=London&units=metric HTTP/1.1\nHost: api.example.com\nAccept: application/json\n`,
            `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"city": "London", "tempC": 18, "conditions": "Partly cloudy"}\n`
          )
        : httpExchange(
            "Todo CRUD",
            `GET /todos HTTP/1.1\nHost: api.example.com\nAccept: application/json\n\n---\n\nPOST /todos HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{"title": "Learn HTTP"}\n`,
            `HTTP/1.1 200 OK\nContent-Type: application/json\n\n[{"id": "1", "title": "Learn HTTP", "completed": false}]\n\n---\n\nHTTP/1.1 201 Created\nLocation: /todos/2\nContent-Type: application/json\n\n{"id": "2", "title": "Learn HTTP", "completed": false}\n`
          ),
      referenceJs: isWeather
        ? `let loading = false;\n\nasync function fetchWeather(city) {\n  loading = true;\n  try {\n    const res = await fetch(\n      \`https://api.example.com/weather?q=\${encodeURIComponent(city)}&units=metric\`\n    );\n    if (res.status === 404) throw new Error("City not found");\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    return await res.json();\n  } finally {\n    loading = false;\n  }\n}\n\nfetchWeather("London").then(console.log).catch(console.error);\n`
        : `async function listTodos() {\n  const res = await fetch("https://api.example.com/todos");\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nasync function createTodo(title) {\n  const res = await fetch("https://api.example.com/todos", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ title }),\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nlistTodos().then(console.log).catch(console.error);\n`,
      acceptanceCriteria: isWeather
        ? [
            "Query params pass city name",
            "Loading and error paths handled",
            "JSON parsed into usable data",
          ]
        : [
            "List and create flows represented",
            "Correct methods and status codes",
            "Fetch client matches HTTP contract",
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

function buildChallenge(topicSlug: string, spec: Spec): ApisChallenge {
  const id = `apis-${topicSlug}-${spec.key}`;
  const starterHttp = spec.starterHttp ?? spec.referenceHttp;
  const starterJs =
    spec.starterJs ??
    `// Start here\n// Write your fetch client\nconsole.log("Ready");\n`;
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
    starterHttp,
    referenceHttp: spec.referenceHttp,
    starterJs,
    referenceJs: spec.referenceJs,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "api-playground",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ApisChallenge[] = flattenApisTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ApisChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listApisAcademyChallenges(topicSlug: string): ApisChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allApisAcademyChallenges(): ApisChallenge[] {
  return BANK;
}

export function findApisAcademyChallenge(
  topicSlug: string,
  challengeId: string
): ApisChallenge | null {
  const list = listApisAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function apisAcademyTopicChallengeCount(topicSlug: string): number {
  return listApisAcademyChallenges(topicSlug).length;
}

export function isApisTheoryChallenge(challenge: ApisChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
