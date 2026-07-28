import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenCssTopics,
  type CssTopicDef,
} from "@/features/curriculum/lib/css-academy-curriculum";
import { hardCssBundle } from "@/features/curriculum/lib/hard-challenge-blueprints";

export type CssChallengeKind =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type CssChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: CssChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml: string;
  referenceHtml: string;
  starterCss: string;
  referenceCss: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "css-live";
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
  </main>
</body>
</html>
`;

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: CssChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  starterHtml?: string;
  referenceHtml: string;
  starterCss?: string;
  referenceCss: string;
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
  referenceHtml: string
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
    realWorldExample: referenceHtml,
    commonMistakes: hints,
    editorLanguage: "text",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

function defaultCss(title: string, props: string): string {
  return `/* ${title} */
.page {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  padding: 1.5rem;
}

.title {
  margin: 0 0 0.5rem;
}

.lead {
  margin: 0;
  color: #52525b;
}

${props}
`;
}

/** Map cheat-sheet CSS tags to real declarations for unique, valid demos. */
function cssDeclsFromTags(tags: string[]): string {
  const lines: string[] = [];
  for (const raw of tags.slice(0, 5)) {
    const tag = raw.replace(/[;{}]/g, "").trim().toLowerCase();
    if (!tag) continue;
    if (tag.includes("flex") && !tag.includes("grid")) {
      lines.push("  display: flex;", "  gap: 0.75rem;", "  align-items: center;");
      continue;
    }
    if (tag.includes("grid")) {
      lines.push(
        "  display: grid;",
        "  grid-template-columns: repeat(2, minmax(0, 1fr));",
        "  gap: 1rem;"
      );
      continue;
    }
    if (tag.startsWith(":") || tag.includes("pseudo")) {
      lines.push("  /* use :hover / ::before on interactive elements */");
      continue;
    }
    if (tag.includes("media") || tag.includes("@media")) {
      lines.push("/* see @media block below */");
      continue;
    }
    if (tag.includes("var(") || tag.includes("--") || tag.includes("variable")) {
      lines.push("  color: var(--brand, #0f766e);");
      continue;
    }
    if (tag.includes("color") || tag.includes("background")) {
      lines.push("  color: #0f172a;", "  background-color: #f8fafc;");
      continue;
    }
    if (tag.includes("font") || tag.includes("text") || tag.includes("line-height")) {
      lines.push("  font-size: 1.125rem;", "  line-height: 1.6;", "  font-weight: 600;");
      continue;
    }
    if (tag.includes("margin") || tag.includes("padding") || tag.includes("box")) {
      lines.push("  margin: 0;", "  padding: 1rem;", "  box-sizing: border-box;");
      continue;
    }
    if (tag.includes("border") || tag.includes("radius") || tag.includes("shadow")) {
      lines.push(
        "  border: 1px solid #e4e4e7;",
        "  border-radius: 0.75rem;",
        "  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);"
      );
      continue;
    }
    if (tag.includes("position") || tag.includes("z-index") || tag.includes("top")) {
      lines.push("  position: relative;", "  z-index: 1;");
      continue;
    }
    if (tag.includes("width") || tag.includes("height") || tag.includes("max-width") || tag.includes("%") || tag.includes("rem") || tag.includes("em") || tag.includes("vh")) {
      lines.push("  max-width: 40rem;", "  width: 100%;");
      continue;
    }
    if (tag.includes("overflow")) {
      lines.push("  overflow: auto;");
      continue;
    }
    if (tag.includes("transition") || tag.includes("transform")) {
      lines.push("  transition: transform 160ms ease;", "  transform: translateY(0);");
      continue;
    }
    if (tag.includes("display")) {
      lines.push("  display: block;");
      continue;
    }
    // Generic property:tag form like "color: red" already
    if (tag.includes(":")) {
      lines.push(`  ${raw.trim().replace(/;$/, "")};`);
    } else {
      lines.push(`  /* practice: ${raw.trim()} */`);
    }
  }

  const unique = [...new Set(lines)];
  if (unique.length === 0) {
    return "  color: #0f172a;\n  padding: 1rem;";
  }
  return unique.join("\n");
}

function topicCssBlock(title: string, cheatSheet: Array<{ tag: string; desc: string }>, mode: string): string {
  const tags = cheatSheet.map((c) => c.tag);
  const decls = cssDeclsFromTags(tags);
  const media =
    tags.some((t) => /media|responsive/i.test(t)) || mode === "responsive"
      ? `\n@media (min-width: 640px) {\n  .page {\n    padding: 2rem;\n  }\n}\n`
      : "";
  const vars =
    tags.some((t) => /var|--|variable/i.test(t))
      ? `:root {\n  --brand: #0f766e;\n  --ink: #0f172a;\n}\n\n`
      : "";

  return defaultCss(
    title,
    `${vars}.demo {\n${decls}\n}\n\n.title {\n  color: #0f172a;\n  font-size: 1.75rem;\n}\n\n.lead {\n  max-width: 36rem;\n}\n${media}`
  );
}

function specsForTopic(topic: CssTopicDef): Spec[] {
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

  const primary = cheatSheet[0]?.tag ?? "color";
  const propsList =
    cheatSheet.length > 0
      ? cheatSheet
          .slice(0, 4)
          .map((c) => c.tag)
          .join(", ")
      : "color, padding, font-size";

  // 1) Concept
  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, ""), 64),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Style the sample page so it clearly demonstrates "${title}". Use at least one property from: ${propsList}.`,
    hints: [
      "Edit the CSS panel — keep the HTML structure.",
      `Start with ${primary}.`,
      "Keep contrast readable.",
    ],
    takeaways: [summary, "HTML structure + CSS presentation"],
    referenceHtml: htmlPage(
      title,
      `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary, 110)}</p>`
    ),
    referenceCss: topicCssBlock(title, cheatSheet, "concept"),
    acceptanceCriteria: [
      "HTML remains semantic",
      "CSS demonstrates the topic idea",
      "Readable contrast",
    ],
  });

  // 2) Property focus
  push({
    key: "build",
    title: cheatSheet[0]
      ? `Style with ${cheatSheet[0].tag}`
      : `Build styles for ${clip(title, 40)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `Practice the core tools for "${title}": ${propsList}.`,
    task: `Write CSS that uses ${propsList} thoughtfully on the provided HTML. Make the page look intentional — not random colors.`,
    hints: cheatSheet
      .slice(0, 3)
      .map((c) => `${c.tag}: ${c.desc}`)
      .concat(["Keep selectors simple (.title, .lead, .page)."])
      .slice(0, 4),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} — ${c.desc}`)
        : ["Simple selectors scale", "Presentation lives in CSS"],
    referenceHtml: htmlPage(
      title,
      `<h1 class="title">${title}</h1>\n    <p class="lead">${clip(summary, 100)}</p>\n    <div class="demo">Demo surface</div>`
    ),
    referenceCss: topicCssBlock(title, cheatSheet, "build"),
    acceptanceCriteria: [
      "Uses the topic’s key properties",
      "Selectors target classes cleanly",
      "Layout remains intact",
    ],
  });

  // 3) Fix mistake
  const mistake = commonMistakes[0];
  if (mistake) {
    push({
      key: "fix",
      title: `Fix: ${clip(mistake, 52)}`,
      difficulty: "medium",
      minutes: 14,
      kind: "fix",
      scenario: `Reviewer flagged CSS for "${title}": ${mistake}`,
      task: `Rewrite the CSS so it avoids this mistake: ${mistake}. Prefer maintainable class-based styles.`,
      hints: [
        commonMistakes[1] ? `Also watch for: ${commonMistakes[1]}` : "Prefer classes over IDs.",
        bestPractices[0] ?? "Keep specificity low.",
        "Don’t rely on !important.",
      ],
      takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Readable CSS is professional.",
      ],
      referenceHtml: htmlPage(
        `${title} — fixed`,
        `<h1 class="title">${title}</h1>\n    <p class="lead">Correct approach: avoid “${clip(mistake, 70)}”.</p>\n    <div class="demo">Fixed surface</div>`
      ),
      referenceCss: topicCssBlock(title, cheatSheet, "fix"),
      acceptanceCriteria: [
        "Mistake addressed",
        "Class-based selectors",
        "No unnecessary !important",
      ],
    });
  }

  // 4) Best practice / layout
  const practice = bestPractices[0];
  if (practice) {
    push({
      key: "practice",
      title: clip(practice, 60),
      difficulty: "medium",
      minutes: 16,
      kind: "layout",
      scenario: `Team guideline for "${title}": ${practice}`,
      task: `Apply CSS that clearly follows: "${practice}". Use flex or spacing properties if they help demonstrate the guideline.`,
      hints: [
        bestPractices[1] ?? "Prefer gap over margin hacks.",
        "Keep the HTML semantic.",
        a11yNotes[0] ?? "Check contrast.",
      ],
      takeaways: [practice, bestPractices[1] ?? "Consistency beats one-off hacks."].filter(
        Boolean
      ) as string[],
      referenceHtml: htmlPage(
        title,
        `<h1 class="title">${title}</h1>\n    <div class="row">\n      <p class="lead">Guideline</p>\n      <p class="lead">${practice}</p>\n    </div>`
      ),
      referenceCss: defaultCss(
        title,
        `.row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n`
      ),
      acceptanceCriteria: [
        "Guideline reflected in CSS",
        "Clean layout spacing",
        "Semantic HTML preserved",
      ],
    });
  }

  // 5) Interview — industry depth
  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    const hard = hardCssBundle(title, interviewQ);
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
      referenceCss: hard.referenceCss,
      acceptanceCriteria: hard.acceptanceCriteria,
    });
  }

  // Mini project topic gets a project-shaped challenge
  if (topic.slug.includes("project") || topic.keywords.includes("project")) {
    push({
      key: "project",
      title: "Ship a polished card component",
      difficulty: "hard",
      minutes: 20,
      kind: "project",
      scenario: `Portfolio warm-up: style a reusable card for "${title}".`,
      task: "Create card styles with padding, radius, subtle shadow, and clear typography hierarchy.",
      hints: [
        "border-radius + box-shadow",
        "Consistent spacing scale",
        "Check text contrast",
      ],
      takeaways: ["Components combine layout + type + color", "Reusable class names"],
      referenceHtml: htmlPage(
        "Card",
        `<article class="card">\n      <h1 class="title">Aurora Headphones</h1>\n      <p class="lead">Wireless comfort with all-day battery.</p>\n      <button class="btn" type="button">Add to cart</button>\n    </article>`
      ),
      referenceCss: defaultCss(
        "Card",
        `.card {\n  max-width: 22rem;\n  padding: 1.25rem;\n  border-radius: 1rem;\n  background: #fff;\n  border: 1px solid #e4e4e7;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.08);\n}\n\n.btn {\n  margin-top: 1rem;\n  padding: 0.55rem 0.9rem;\n  border: 0;\n  border-radius: 0.6rem;\n  background: #059669;\n  color: #fff;\n  font-weight: 600;\n}\n`
      ),
      acceptanceCriteria: [
        "Card looks intentional",
        "Typography hierarchy clear",
        "Button styled accessibly",
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

function buildChallenge(topicSlug: string, spec: Spec): CssChallenge {
  const id = `css-${topicSlug}-${spec.key}`;
  const starterHtml = spec.starterHtml ?? spec.referenceHtml;
  const starterCss =
    spec.starterCss ??
    `/* Start here */\n.page {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.referenceHtml
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
    starterCss,
    referenceCss: spec.referenceCss,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "css-live",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: CssChallenge[] = flattenCssTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, CssChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listCssAcademyChallenges(topicSlug: string): CssChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allCssAcademyChallenges(): CssChallenge[] {
  return BANK;
}

export function findCssAcademyChallenge(
  topicSlug: string,
  challengeId: string
): CssChallenge | null {
  const list = listCssAcademyChallenges(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return (
    list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null
  );
}

export function cssAcademyTopicChallengeCount(topicSlug: string): number {
  return listCssAcademyChallenges(topicSlug).length;
}

/** Theory lessons use dual read-only HTML + CSS reference. */
export function isCssTheoryChallenge(challenge: CssChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
