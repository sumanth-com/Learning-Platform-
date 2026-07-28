import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenAuthTopics,
  type AuthTopicDef,
} from "@/features/curriculum/lib/auth-academy-curriculum";
import { hardAuthBundle } from "@/features/curriculum/lib/hard-challenge-blueprints";

export type AuthChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type AuthChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: AuthChallengeKind;
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
  experience: "auth-lab";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: AuthChallengeKind;
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

function specsForTopic(topic: AuthTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "authn";
  const apisList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "session, JWT, bcrypt";

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Draft HTTP auth examples and a fetch client that demonstrates "${title}". Use at least one idea from: ${apisList}.`,
    hints: [
      "Focus on the HTTP panel for auth headers and cookies.",
      `Start with ${primary}.`,
      "Pair the HTTP example with a small fetch client in JS.",
    ],
    takeaways: [summary, "Auth flows combine HTTP messages with client credentials"],
    referenceHttp: httpExchange(
      title,
      `GET /api/profile HTTP/1.1\nHost: api.example.com\nAccept: application/json\nCookie: sessionId=abc123; HttpOnly\n`,
      `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"user": "demo", "authenticated": true}\n`
    ),
    referenceJs: defaultJs(
      title,
      `// Session cookie sent automatically when credentials included\nasync function fetchProfile() {\n  const res = await fetch("https://api.example.com/profile", {\n    credentials: "include",\n    headers: { Accept: "application/json" },\n  });\n  if (res.status === 401) throw new Error("Not authenticated");\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nfetchProfile().then(console.log).catch(console.error);\n`
    ),
    acceptanceCriteria: [
      "Valid HTTP auth request and response examples",
      "Demonstrates the topic idea",
      "Fetch client mirrors the HTTP exchange",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build auth flow for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${apisList}.`,
    task: `Write HTTP auth examples and a fetch client that uses ${apisList} thoughtfully. Prefer secure cookie and header patterns.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Never log passwords or tokens in production."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} - ${c.desc}`)
        : ["Hash passwords server-side", "Use HttpOnly cookies for sessions"],
    referenceHttp: httpExchange(
      title,
      `POST /auth/login HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{"email": "user@example.com", "password": "secret"}\n`,
      `HTTP/1.1 200 OK\nContent-Type: application/json\nSet-Cookie: sessionId=sess_abc; HttpOnly; Secure; SameSite=Lax\n\n{"ok": true}\n`
    ),
    referenceJs: defaultJs(
      title,
      `// bcrypt hash happens server-side: bcrypt.hash(password, 12)\nasync function login(email, password) {\n  const res = await fetch("https://api.example.com/auth/login", {\n    method: "POST",\n    credentials: "include",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ email, password }),\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nlogin("user@example.com", "secret").catch(console.error);\n`
    ),
    acceptanceCriteria: [
      "Uses the topic key auth patterns",
      "Secure cookie or header usage shown",
      "Fetch client handles 401 responses",
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
      scenario: `Reviewer flagged auth usage for "${title}": ${mistake}`,
      task: `Rewrite the HTTP exchange and fetch client so they avoid this mistake: ${mistake}. Prefer maintainable security practices.`,
      hints: [
        commonMistakes[1]
          ? `Also watch for: ${commonMistakes[1]}`
          : "Enforce auth checks on the server, not only in UI.",
        bestPractices[0] ?? "Hash passwords; never store plain text.",
        "Validate tokens and sessions on every protected request.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Secure auth is enforced server-side.",
      ],
      referenceHttp: httpExchange(
        `${title} - fixed`,
        `GET /api/admin HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiJ9...\nAccept: application/json\n`,
        `HTTP/1.1 403 Forbidden\nContent-Type: application/json\n\n{"error": "Insufficient permissions"}\n`
      ),
      referenceJs: defaultJs(
        title,
        `// Fixed: avoid "${clip(mistake)}"\nasync function fetchAdmin(token) {\n  const res = await fetch("https://api.example.com/admin", {\n    headers: {\n      Authorization: \`Bearer \${token}\`,\n      Accept: "application/json",\n    },\n  });\n  if (res.status === 401) throw new Error("Not authenticated");\n  if (res.status === 403) throw new Error("Not authorized");\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nfetchAdmin("token").catch(console.error);\n`
      ),
      acceptanceCriteria: [
        "Mistake addressed in HTTP and JS",
        "Clear 401 vs 403 handling",
        "Client behavior matches auth contract",
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
      task: `Write HTTP auth examples and a fetch client that clearly follow: "${practice}". Keep the example small and intentional.`,
      hints: [
        bestPractices[1] ?? "Use least privilege for roles and scopes.",
        "Set HttpOnly, Secure, and SameSite on session cookies.",
        a11yNotes[0] ?? "Auth errors should be readable, not codes alone.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceHttp: httpExchange(
        title,
        `POST /auth/logout HTTP/1.1\nHost: api.example.com\nCookie: sessionId=sess_abc; HttpOnly\nX-CSRF-Token: csrf_xyz\n`,
        `HTTP/1.1 204 No Content\nSet-Cookie: sessionId=; HttpOnly; Secure; Max-Age=0\n`
      ),
      referenceJs: defaultJs(
        title,
        `async function logout(csrfToken) {\n  const res = await fetch("https://api.example.com/auth/logout", {\n    method: "POST",\n    credentials: "include",\n    headers: { "X-CSRF-Token": csrfToken },\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  console.log(${JSON.stringify(clip(practice))});\n}\n\nlogout("csrf_xyz").catch(console.error);\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in HTTP and fetch client",
        "Small, readable example",
        "Cookie and CSRF patterns are intentional",
      ],
    });
  }

  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    const hard = hardAuthBundle(title, interviewQ);
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?") ? interviewQ : `Interview: ${interviewQ}`
      ),
      difficulty: "hard",
      minutes: hard.minutes,
      kind: "interview",
      scenario: hard.scenario,
      task: hard.task,
      hints: hard.hints,
      takeaways: hard.takeaways,
      referenceHttp: httpExchange(
        `Interview - ${title}`,
        `POST /auth/login HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nX-CSRF-Token: csrf_xyz\n\n{"email":"dev@acme.test","password":"••••••••"}\n`,
        `HTTP/1.1 204 No Content\nSet-Cookie: sessionId=sess_abc; HttpOnly; Secure; SameSite=Lax; Path=/\n`
      ),
      referenceJs: hard.referenceJs,
      acceptanceCriteria: hard.acceptanceCriteria,
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isJwt = topic.slug.includes("jwt");
    push({
      key: "project",
      title: isJwt
        ? "Ship a JWT-protected request"
        : "Ship a session login flow sketch",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: isJwt
        ? `Portfolio warm-up: protect API routes with JWT for "${title}".`
        : `Portfolio warm-up: sketch a session login flow for "${title}".`,
      task: isJwt
        ? "Write login/token HTTP examples and a fetch client that sends Authorization: Bearer on protected routes."
        : "Write login/logout HTTP examples with Set-Cookie and a fetch client using credentials: include.",
      hints: [
        isJwt
          ? "Validate exp and signature server-side"
          : "bcrypt.hash(password, 12) on the server before storing",
        isJwt
          ? "Keep access token TTL short"
          : "Regenerate session ID after login",
        isJwt
          ? "Return 401 for missing or invalid bearer tokens"
          : "Set HttpOnly, Secure, SameSite on session cookies",
      ],
      takeaways: isJwt
        ? ["Bearer tokens on Authorization header", "Verify JWT before route handlers"]
        : ["Sessions use HttpOnly cookies", "CSRF tokens on state-changing requests"],
      referenceHttp: isJwt
        ? httpExchange(
            "JWT protected API",
            `POST /auth/login HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{"email": "user@example.com", "password": "secret"}\n\n---\n\nGET /profile HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nAccept: application/json\n`,
            `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}\n\n---\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{"email": "user@example.com", "role": "user"}\n`
          )
        : httpExchange(
            "Session login flow",
            `POST /auth/login HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{"email": "user@example.com", "password": "secret"}\n\n---\n\nPOST /auth/logout HTTP/1.1\nHost: api.example.com\nCookie: sessionId=sess_abc; HttpOnly\nX-CSRF-Token: csrf_xyz\n`,
            `HTTP/1.1 200 OK\nSet-Cookie: sessionId=sess_new; HttpOnly; Secure; SameSite=Lax\n\n{"ok": true}\n\n---\n\nHTTP/1.1 204 No Content\nSet-Cookie: sessionId=; HttpOnly; Secure; Max-Age=0\n`
          ),
      referenceJs: isJwt
        ? `let accessToken = null;\n\nasync function login(email, password) {\n  const res = await fetch("https://api.example.com/auth/login", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ email, password }),\n  });\n  const data = await res.json();\n  accessToken = data.accessToken;\n  return data;\n}\n\nasync function fetchProfile() {\n  const res = await fetch("https://api.example.com/profile", {\n    headers: {\n      Authorization: \`Bearer \${accessToken}\`,\n      Accept: "application/json",\n    },\n  });\n  if (res.status === 401) throw new Error("Token invalid or expired");\n  return res.json();\n}\n\nlogin("user@example.com", "secret").then(fetchProfile).catch(console.error);\n`
        : `// Server: bcrypt.compare(password, storedHash) on login\nasync function login(email, password) {\n  const res = await fetch("https://api.example.com/auth/login", {\n    method: "POST",\n    credentials: "include",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ email, password }),\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}\n\nasync function logout(csrfToken) {\n  const res = await fetch("https://api.example.com/auth/logout", {\n    method: "POST",\n    credentials: "include",\n    headers: { "X-CSRF-Token": csrfToken },\n  });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n}\n\nlogin("user@example.com", "secret").catch(console.error);\n`,
      acceptanceCriteria: isJwt
        ? [
            "Login returns access token",
            "Protected request sends Bearer header",
            "401 handled for invalid tokens",
          ]
        : [
            "Login sets session cookie via Set-Cookie",
            "Logout clears cookie and uses CSRF token",
            "Fetch client uses credentials: include",
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

function buildChallenge(topicSlug: string, spec: Spec): AuthChallenge {
  const id = `auth-${topicSlug}-${spec.key}`;
  const starterHttp = spec.starterHttp ?? spec.referenceHttp;
  const starterJs =
    spec.starterJs ??
    `// Start here\n// Write your auth fetch client\nconsole.log("Ready");\n`;
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
    experience: "auth-lab",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: AuthChallenge[] = flattenAuthTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, AuthChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listAuthAcademyChallenges(topicSlug: string): AuthChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allAuthAcademyChallenges(): AuthChallenge[] {
  return BANK;
}

export function findAuthAcademyChallenge(
  topicSlug: string,
  challengeId: string
): AuthChallenge | null {
  const list = listAuthAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function authAcademyTopicChallengeCount(topicSlug: string): number {
  return listAuthAcademyChallenges(topicSlug).length;
}

export function isAuthTheoryChallenge(challenge: AuthChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
