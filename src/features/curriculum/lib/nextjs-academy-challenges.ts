import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenNextjsTopics,
  type NextjsTopicDef,
} from "@/features/curriculum/lib/nextjs-academy-curriculum";

export type NextjsChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type NextjsChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: NextjsChallengeKind;
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
  experience: "nextjs-preview";
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
  kind: NextjsChallengeKind;
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

function defaultPage(title: string, body: string): string {
  return `// ${title}
// app example — App Router style

${body}
`;
}

function specsForTopic(topic: NextjsTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "app/page.tsx";
  const apisList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "app/page.tsx, Link, metadata";

  const safeTitle = title.replace(/"/g, "");

  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Build a small Next.js App Router example that clearly demonstrates "${title}". Use at least one idea from: ${apisList}.`,
    hints: [
      "Focus on the JSX panel — keep the HTML root as the browser shell.",
      `Start with ${primary}.`,
      "Prefer Server Components unless interactivity is required.",
    ],
    takeaways: [summary, "App Router files define routes and UI"],
    referenceHtml: htmlPage(title),
    referenceJsx: defaultPage(
      title,
      `export default function Page() {\n  const message = ${JSON.stringify(clip(summary))};\n  return (\n    <main className="page">\n      <h1>${safeTitle}</h1>\n      <p>{message}</p>\n    </main>\n  );\n}\n`
    ),
    acceptanceCriteria: [
      "Valid App Router page/component",
      "JSX demonstrates the topic idea",
      "Readable file structure",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0]
      ? `Practice ${cheatSheet[0].tag}`
      : `Build Next.js UI for ${clip(title)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${apisList}.`,
    task: `Write Next.js JSX that uses ${apisList} thoughtfully. Prefer clear route/file conventions over clever hacks.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Keep Server Components by default."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} — ${c.desc}`)
        : ["File-based routing", "Server Components by default"],
    referenceHtml: htmlPage(title),
    referenceJsx: defaultPage(
      title,
      `import Link from "next/link";\n\nexport default function Page() {\n  // Focus: ${apisList}\n  return (\n    <main className="page">\n      <h1>${safeTitle}</h1>\n      <p>Ready for Next.js practice.</p>\n      <Link href="/">Home</Link>\n    </main>\n  );\n}\n`
    ),
    acceptanceCriteria: [
      "Uses the topic’s key Next.js APIs",
      "Clear route or component naming",
      "HTML root stays intact",
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
      scenario: `Reviewer flagged Next.js code for "${title}": ${mistake}`,
      task: `Rewrite the example so it avoids this mistake: ${mistake}. Prefer App Router best practices.`,
      hints: [
        commonMistakes[1] ? `Also watch for: ${commonMistakes[1]}` : "Add use client only when needed.",
        bestPractices[0] ?? "Keep data fetching close to the server.",
        "Don’t fight the framework conventions.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Readable Next.js is professional.",
      ],
      referenceHtml: htmlPage(`${title} — fixed`),
      referenceJsx: defaultPage(
        title,
        `// Fixed: avoid “${clip(mistake)}”\nexport default function Page() {\n  return (\n    <main className="page">\n      <h1>${safeTitle}</h1>\n      <p>Status: ok</p>\n    </main>\n  );\n}\n`
      ),
      acceptanceCriteria: [
        "Mistake addressed",
        "Follows App Router conventions",
        "Clear component structure",
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
      task: `Write a Next.js example that clearly follows: "${practice}". Keep it small and intentional.`,
      hints: [
        bestPractices[1] ?? "Colocate route UI in the app directory.",
        "Keep JSX readable.",
        a11yNotes[0] ?? "Use semantic landmarks and labels.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats clever hacks."].filter(
        Boolean
      ) as string[],
      referenceHtml: htmlPage(title),
      referenceJsx: defaultPage(
        title,
        `export default function Page() {\n  const note = ${JSON.stringify(clip(practice))};\n  return (\n    <main className="page">\n      <h1>${safeTitle}</h1>\n      <p>{note}</p>\n    </main>\n  );\n}\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in the example",
        "Small, readable route UI",
        "Semantic markup preferred",
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
      task: `Answer with a small Next.js App Router example. Add comments that explain your reasoning.`,
      hints: [
        "Comment the why in the file",
        interviewQuestions[1] ?? "Keep the example tiny",
        "Contrast Server vs Client Components when relevant",
      ],
      takeaways: ["Explain why, not only what", clip(interviewQ)],
      referenceHtml: htmlPage(`Interview — ${title}`),
      referenceJsx: defaultPage(
        title,
        `// Answering: ${interviewQ}\nexport default function Page() {\n  const answer = ${JSON.stringify(clip(summary))};\n  return (\n    <main className="page">\n      <h1>${safeTitle}</h1>\n      <p>{answer}</p>\n    </main>\n  );\n}\n`
      ),
      acceptanceCriteria: [
        "Comments explain the answer",
        "Working Next.js page example",
        "Tied to the interview question",
      ],
    });
  }

  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    const isDash = topic.slug.includes("dashboard");
    push({
      key: "project",
      title: isDash
        ? "Ship a Next.js dashboard shell"
        : "Ship a Next.js marketing landing",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: `Portfolio warm-up: build a tiny App Router UI for "${title}".`,
      task: isDash
        ? "Create a dashboard shell with a layout, nav links, and a main page using next/link."
        : "Create a marketing landing page with a hero, CTA link, and shared layout metadata title.",
      hints: [
        "Use app/layout.tsx + app/page.tsx patterns",
        "Link with next/link",
        "Keep Client Components only where needed",
      ],
      takeaways: [
        "Layouts wrap pages",
        "File-based routes compose the app",
      ],
      referenceHtml: htmlPage(isDash ? "Dashboard" : "Landing"),
      referenceJsx: isDash
        ? `import Link from "next/link";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="page">
      <header>
        <nav>
          <Link href="/">Overview</Link>
          {" · "}
          <Link href="/settings">Settings</Link>
        </nav>
      </header>
      <h1>Dashboard</h1>
      <p>Shell ready for widgets and tables.</p>
    </main>
  );
}
`
        : `import Link from "next/link";

export const metadata = {
  title: "Aurora — Landing",
  description: "Full-stack React framework for production apps.",
};

export default function LandingPage() {
  return (
    <main className="page">
      <h1>Ship faster with Next.js</h1>
      <p>Full-stack React framework for production apps.</p>
      <Link href="/docs">Read the docs</Link>
    </main>
  );
}
`,
      acceptanceCriteria: [
        "Uses App Router page patterns",
        "Navigation via next/link",
        "Clear landing or dashboard structure",
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

function buildChallenge(topicSlug: string, spec: Spec): NextjsChallenge {
  const id = `nextjs-${topicSlug}-${spec.key}`;
  const starterHtml = spec.starterHtml ?? spec.referenceHtml;
  const starterJsx =
    spec.starterJsx ??
    `export default function Page() {\n  return <main>Start here</main>;\n}\n`;
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
    experience: "nextjs-preview",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: NextjsChallenge[] = flattenNextjsTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, NextjsChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listNextjsAcademyChallenges(
  topicSlug: string
): NextjsChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allNextjsAcademyChallenges(): NextjsChallenge[] {
  return BANK;
}

export function findNextjsAcademyChallenge(
  topicSlug: string,
  challengeId: string
): NextjsChallenge | null {
  const list = listNextjsAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function nextjsAcademyTopicChallengeCount(topicSlug: string): number {
  return listNextjsAcademyChallenges(topicSlug).length;
}

export function isNextjsTheoryChallenge(challenge: NextjsChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
