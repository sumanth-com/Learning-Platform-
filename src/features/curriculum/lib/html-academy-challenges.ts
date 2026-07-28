import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenHtmlTopics,
  type HtmlTopicDef,
} from "@/features/curriculum/lib/html-academy-curriculum";
import { hardHtmlBundle } from "@/features/curriculum/lib/hard-challenge-blueprints";

export type HtmlChallengeKind =
  | "build"
  | "fix"
  | "a11y"
  | "seo"
  | "semantic"
  | "interview"
  | "project";

export type HtmlChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: HtmlChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  referenceSolution: string;
  takeaways: string[];
  starterHtml: string;
  /** Substrings that must appear in submitted HTML (case-insensitive) */
  validateIncludes: string[];
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "html-live";
  source: "synthetic";
  weekId: number;
};

const STARTER_SHELL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  <!-- Build your solution here -->
</body>
</html>
`;

function buildLesson(
  topicSlug: string,
  id: string,
  title: string,
  difficulty: LearnDifficulty,
  minutes: number,
  scenario: string,
  task: string,
  hints: string[],
  starterHtml: string
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
    realWorldExample: starterHtml,
    commonMistakes: hints,
    editorLanguage: "text",
    estimatedMinutes: minutes,
    problemType: "logic",
    hints,
  };
}

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: HtmlChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  referenceSolution: string;
  takeaways: string[];
  starterHtml?: string;
  validateIncludes: string[];
  acceptanceCriteria: string[];
};

function shellWith(
  title: string,
  body: string,
  extraHead = ""
): string {
  return STARTER_SHELL.replace("<title>Document</title>", `<title>${title}</title>${extraHead}`).replace(
    "<!-- Build your solution here -->",
    body
  );
}

function tagName(tag: string): string {
  return tag.replace(/[<>/]/g, "").trim().toLowerCase();
}

/** Real markup for a topic tag — never comments-only placeholders. */
function snippetForTag(tag: string, title: string, summary: string): string | null {
  const name = tagName(tag);
  if (
    !name ||
    name === "!doctype html" ||
    name === "doctype" ||
    name === "html" ||
    name === "head" ||
    name === "body" ||
    name === "meta" ||
    name === "title" ||
    name === "link" ||
    name === "script" ||
    name === "style"
  ) {
    return null;
  }

  switch (name) {
    case "main":
      return null;
    case "header":
      return `<header>\n      <p>${title}</p>\n    </header>`;
    case "footer":
      return `<footer>\n      <p>© SupraBase · ${title}</p>\n    </footer>`;
    case "nav":
      return `<nav aria-label="Primary">\n      <a href="/">Home</a>\n      <a href="/learn">${title}</a>\n    </nav>`;
    case "section":
      return `<section>\n      <h2>Overview</h2>\n      <p>${clip(summary, 100)}</p>\n    </section>`;
    case "article":
      return `<article>\n      <h2>${title}</h2>\n      <p>${clip(summary, 100)}</p>\n    </article>`;
    case "aside":
      return `<aside>\n      <h2>Tip</h2>\n      <p>Keep markup semantic for ${title}.</p>\n    </aside>`;
    case "h1":
      return `<h1>${title}</h1>`;
    case "h2":
      return `<h2>Key idea</h2>`;
    case "h3":
      return `<h3>Details</h3>`;
    case "p":
      return `<p>${clip(summary, 120)}</p>`;
    case "a":
      return `<p>Read the <a href="/docs/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${title} guide</a>.</p>`;
    case "img":
      return `<img src="/images/demo.svg" alt="Illustration for ${title}" width="320" height="180" />`;
    case "figure":
      return `<figure>\n      <img src="/images/demo.svg" alt="Figure for ${title}" width="320" height="180" />\n      <figcaption>${title} example</figcaption>\n    </figure>`;
    case "picture":
      return `<picture>\n      <source srcset="/images/demo-wide.svg" media="(min-width: 640px)" />\n      <img src="/images/demo.svg" alt="${title} responsive image" />\n    </picture>`;
    case "ul":
      return `<ul>\n      <li>${title} basics</li>\n      <li>Clear structure</li>\n      <li>Accessible markup</li>\n    </ul>`;
    case "ol":
      return `<ol>\n      <li>Read the requirement</li>\n      <li>Write valid HTML</li>\n      <li>Check landmarks</li>\n    </ol>`;
    case "li":
      return `<ul>\n      <li>${clip(summary, 60)}</li>\n    </ul>`;
    case "dl":
      return `<dl>\n      <dt>${title}</dt>\n      <dd>${clip(summary, 90)}</dd>\n    </dl>`;
    case "table":
      return `<table>\n      <caption>${title}</caption>\n      <thead><tr><th scope="col">Item</th><th scope="col">Notes</th></tr></thead>\n      <tbody><tr><td>Example</td><td>${clip(summary, 40)}</td></tr></tbody>\n    </table>`;
    case "form":
      return `<form action="/submit" method="post">\n      <label for="q">Question</label>\n      <input id="q" name="q" type="text" required />\n      <button type="submit">Send</button>\n    </form>`;
    case "label":
      return `<label for="topic-note">Note about ${title}</label>\n    <input id="topic-note" name="note" type="text" />`;
    case "input":
      return `<label for="email">Email</label>\n    <input id="email" name="email" type="email" required />`;
    case "button":
      return `<button type="button">Continue with ${title}</button>`;
    case "textarea":
      return `<label for="bio">Bio</label>\n    <textarea id="bio" name="bio" rows="3"></textarea>`;
    case "select":
      return `<label for="level">Level</label>\n    <select id="level" name="level">\n      <option value="easy">Easy</option>\n      <option value="medium">Medium</option>\n    </select>`;
    case "details":
      return `<details>\n      <summary>${title}</summary>\n      <p>${clip(summary, 100)}</p>\n    </details>`;
    case "blockquote":
      return `<blockquote>\n      <p>${clip(summary, 100)}</p>\n    </blockquote>`;
    case "pre":
    case "code":
      return `<pre><code>&lt;${title.split(" ")[0]?.toLowerCase() ?? "tag"}&gt;</code></pre>`;
    case "video":
      return `<video controls width="480">\n      <source src="/media/demo.mp4" type="video/mp4" />\n      Your browser does not support video.\n    </video>`;
    case "audio":
      return `<audio controls>\n      <source src="/media/demo.mp3" type="audio/mpeg" />\n    </audio>`;
    case "iframe":
      return `<iframe title="${title} embed" src="/embed/demo" width="480" height="270" loading="lazy"></iframe>`;
    case "dialog":
      return `<dialog open>\n      <p>${title}</p>\n      <form method="dialog"><button>Close</button></form>\n    </dialog>`;
    default:
      return `<p data-topic="${name}">${title}: ${clip(summary, 80)}</p>`;
  }
}

function bodyFromTopicTags(
  title: string,
  summary: string,
  tags: string[],
  mode: "concept" | "build" | "fix" | "practice" | "a11y" | "seo" | "interview"
): string {
  const parts: string[] = [];
  const used = new Set<string>();

  const ensureH1 = () => {
    if (!used.has("h1")) {
      parts.push(`<h1>${title}</h1>`);
      used.add("h1");
    }
  };

  if (mode === "concept") {
    ensureH1();
    parts.push(`<p>${clip(summary, 140)}</p>`);
    used.add("p");
  }

  for (const tag of tags.slice(0, mode === "build" ? 5 : 3)) {
    const name = tagName(tag);
    if (!name || used.has(name)) continue;
    const snip = snippetForTag(tag, title, summary);
    if (!snip) continue;
    parts.push(snip);
    used.add(name);
  }

  if (mode === "fix" || mode === "practice") {
    ensureH1();
    if (!used.has("p")) {
      parts.push(`<p>${clip(summary, 120)}</p>`);
    }
  }

  if (mode === "a11y") {
    ensureH1();
    parts.push(`<p>${clip(summary, 100)}</p>`);
  }

  if (mode === "seo") {
    ensureH1();
    parts.push(`<p>${clip(summary, 100)}</p>`);
    parts.push(
      `<p>Learn more in the <a href="/learn/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${title} docs</a>.</p>`
    );
  }

  if (mode === "interview") {
    ensureH1();
    parts.push(`<!-- Interview sketch for ${title} -->`);
    parts.push(`<p>${clip(summary, 110)}</p>`);
  }

  if (parts.length === 0) {
    ensureH1();
    parts.push(`<p>${clip(summary, 120)}</p>`);
  }

  return `<main>\n    ${parts.join("\n    ")}\n  </main>`;
}

function clip(text: string, max = 56): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function challengeLimit(weight: number): number {
  return Math.min(6, Math.max(3, weight + 1));
}

/**
 * Build unique challenges from each topic's own curriculum data —
 * no repeated "Topic — Easy build / Drill N" templates.
 */
function specsForTopic(topic: HtmlTopicDef): Spec[] {
  const specs: Spec[] = [];
  const push = (spec: Spec) => specs.push(spec);
  const title = topic.title;
  const slug = topic.slug;
  const summary = topic.summary ?? title;
  const explanation = topic.explanation ?? summary;
  const commonMistakes = topic.commonMistakes ?? [];
  const bestPractices = topic.bestPractices ?? [];
  const interviewQuestions = topic.interviewQuestions ?? [];
  const cheatSheet = topic.cheatSheet ?? [];
  const a11yNotes = topic.a11yNotes ?? [];
  const seoNotes = topic.seoNotes ?? [];

  const primaryTags = cheatSheet.map((c) => c.tag).filter(Boolean);
  const tagList =
    primaryTags.length > 0
      ? primaryTags.slice(0, 4).join(", ")
      : "<!DOCTYPE html>, <html>, <head>, <body>";

  // 1) Concept — unique to this topic's summary
  push({
    key: "concept",
    title: clip(String(summary).replace(/\.$/, ""), 64),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\.)\s+/).slice(0, 2).join(" "),
    task: `Create a tiny HTML page that demonstrates the idea behind "${title}". Use a clear <h1> and one short paragraph that restates the concept in your own words.`,
    hints: [
      "Use a valid HTML5 document shell.",
      "One h1 that names the idea.",
      "Keep the paragraph concrete — not vague filler.",
    ],
    referenceSolution: shellWith(
      title,
      bodyFromTopicTags(title, summary, primaryTags, "concept")
    ),
    takeaways: [summary, "HTML communicates meaning, not just layout."],
    validateIncludes: ["<!doctype html>", "<h1", "<p", "lang="],
    acceptanceCriteria: [
      "Valid HTML5 shell",
      "Clear h1 for the topic",
      "Short explanatory paragraph",
    ],
  });

  // 2) Hands-on build with this topic's cheat-sheet tags
  push({
    key: "build",
    title: primaryTags[0]
      ? `Use ${primaryTags[0]} correctly`
      : `Build a page for ${clip(title, 40)}`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: `You are drafting a starter page for "${title}". Focus on the tags that matter for this topic: ${tagList}.`,
    task: `Write valid HTML that includes these building blocks where they make sense: ${tagList}. Add real content related to ${title} — not placeholder lorem ipsum.`,
    hints: [
      ...cheatSheet.slice(0, 3).map((c) => `${c.tag}: ${c.desc}`),
      "Prefer semantic structure over empty wrappers.",
    ].slice(0, 4),
    referenceSolution: shellWith(
      title,
      bodyFromTopicTags(title, summary, primaryTags, "build")
    ),
    takeaways:
      cheatSheet.length > 0
        ? cheatSheet.slice(0, 2).map((c) => `${c.tag} — ${c.desc}`)
        : ["Valid HTML5 shell", "Clear structure for the topic"],
    validateIncludes: ["<!doctype html>", "<body", "<h1"],
    acceptanceCriteria: [
      "Document shell present",
      "Topic-related heading",
      "Uses the topic's key tags thoughtfully",
    ],
  });

  // 3) Fix a topic-specific mistake
  const mistake = commonMistakes[0];
  if (mistake) {
  push({
      key: "fix",
      title: `Fix: ${clip(mistake, 52)}`,
      difficulty: "medium",
      minutes: 14,
    kind: "fix",
      scenario: `A teammate shipped broken markup for "${title}". Reviewer note: "${mistake}".`,
      task: `Rewrite a correct HTML snippet for ${title} that avoids this mistake: ${mistake}. Deliver clean HTML5 a reviewer would approve.`,
    hints: [
        commonMistakes[1] ? `Also watch for: ${commonMistakes[1]}` : "Validate nesting and DOCTYPE.",
        bestPractices[0] ?? "Prefer semantic tags.",
        "Keep the example small and correct.",
      ],
      referenceSolution: shellWith(
        `${title} — fixed`,
        bodyFromTopicTags(
          title,
          `Correct approach: avoid “${clip(mistake, 80)}”. ${clip(summary, 60)}`,
          primaryTags,
          "fix"
        )
    ),
    takeaways: [
        `Avoid: ${mistake}`,
        bestPractices[0] ?? "Readable markup is professional.",
      ],
      validateIncludes: ["<!doctype html>", "<main", "<h1"],
    acceptanceCriteria: [
        "Mistake addressed in the markup",
        "Valid HTML5 structure",
        "Clear topic heading",
    ],
  });
  }

  // 4) Apply a best practice
  const practice = bestPractices[0];
  if (practice) {
    push({
      key: "practice",
      title: clip(practice, 60),
      difficulty: "medium",
      minutes: 16,
      kind: "semantic",
      scenario: `Your team adopted this guideline for "${title}": ${practice}`,
      task: `Build an HTML example that clearly follows: "${practice}". Use landmarks and headings that match the topic.`,
      hints: [
        bestPractices[1] ?? "One clear h1.",
        "Use <main> for primary content.",
        a11yNotes[0] ?? "Semantics help assistive tech.",
      ],
      referenceSolution: shellWith(
        title,
        bodyFromTopicTags(title, practice, primaryTags, "practice")
      ),
      takeaways: [practice, bestPractices[1] ?? "Semantics beat div soup."].filter(
        Boolean
      ) as string[],
      validateIncludes: ["<main", "<h1", "<p"],
      acceptanceCriteria: [
        "Guideline reflected in content",
        "Semantic landmarks used",
        "Logical heading structure",
      ],
    });
  }

  // 5) Accessibility note when available
  if (a11yNotes[0] && topic.challengeWeight >= 3) {
    push({
      key: "a11y",
      title: clip(a11yNotes[0], 60),
      difficulty: "medium",
      minutes: 14,
      kind: "a11y",
      scenario: `Accessibility review for "${title}" called out: ${a11yNotes[0]}`,
      task: `Produce HTML for ${title} that satisfies this accessibility note. Set lang on <html>, include a single <main>, and a clear <h1>.`,
      hints: [
        "lang attribute on html",
        "One main landmark",
        a11yNotes[1] ?? "Visible text beats icon-only UI",
      ],
      referenceSolution: shellWith(
        title,
        bodyFromTopicTags(title, a11yNotes[0], primaryTags, "a11y")
      ),
      takeaways: [a11yNotes[0], "Accessibility starts with correct HTML"],
      validateIncludes: ["lang=", "<main", "<h1"],
      acceptanceCriteria: ["Language set", "Main landmark", "Primary heading"],
    });
  }

  // 6) SEO note when available
  if (seoNotes[0] && topic.challengeWeight >= 4) {
    push({
      key: "seo",
      title: clip(seoNotes[0], 60),
      difficulty: "hard",
      minutes: 18,
      kind: "seo",
      scenario: `SEO preview for "${title}" looks weak. Guidance: ${seoNotes[0]}`,
      task: `Add a unique <title>, a meta description about ${title}, one h1, and at least one descriptive link.`,
      hints: [
        "meta name=\"description\"",
        "Title should be specific",
        seoNotes[1] ?? "One clear h1",
      ],
      referenceSolution: shellWith(
        `${title} | SupraBase`,
        bodyFromTopicTags(title, seoNotes[0], primaryTags, "seo"),
        `\n  <meta name="description" content="${clip(summary, 140)}" />`
      ),
      takeaways: [seoNotes[0], "Unique titles + descriptions help discovery"],
      validateIncludes: ["<title", "description", "<h1", "<a "],
      acceptanceCriteria: [
        "Unique title",
        "Meta description",
        "Heading + descriptive link",
      ],
    });
  }

  // 7) Interview-style unique prompt
  const interviewQ = interviewQuestions[0];
  if (interviewQ) {
    const hard = hardHtmlBundle(title, interviewQ, summary);
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?")
          ? interviewQ
          : `Interview: ${interviewQ}`,
        64
      ),
      difficulty: "hard",
      minutes: hard.minutes,
      kind: "interview",
      scenario: hard.scenario,
      task: hard.task,
      hints: hard.hints,
      referenceSolution: hard.referenceSolution,
      takeaways: hard.takeaways,
      validateIncludes: ["<!doctype html", "<main", "<form", "lang="],
      acceptanceCriteria: hard.acceptanceCriteria,
    });
  }

  // Specialty packs (already unique within their domain)
  if (
    slug.includes("form") ||
    slug.includes("input") ||
    slug.includes("validation") ||
    slug.includes("select")
  ) {
    specs.push(...formPack(title));
  }
  if (slug.includes("a11y") || slug.includes("aria") || slug.includes("access")) {
    specs.push(...a11yPack(title));
  }
  if (slug.includes("seo")) {
    specs.push(...seoPack(title));
  }
  if (slug.includes("table")) {
    specs.push(...tablePack(title));
  }
  if (
    slug.includes("img") ||
    slug.includes("picture") ||
    slug.includes("media") ||
    slug.includes("video")
  ) {
    specs.push(...mediaPack(title));
  }
  if (slug.includes("project") || slug.includes("final")) {
    specs.push(...projectPack(slug, title));
  }
  if (slug.includes("interview")) {
    specs.push(...interviewPack(title));
  }

  // Deduplicate by title, keep insertion order, cap by weight
  const seen = new Set<string>();
  const unique: Spec[] = [];
  for (const spec of specs) {
    const key = spec.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(spec);
  }

  return unique.slice(0, challengeLimit(topic.challengeWeight));
}

function formPack(topicTitle: string): Spec[] {
  return [
    {
      key: "form-e",
      title: `${topicTitle} — Labeled text input`,
      difficulty: "easy",
      minutes: 10,
      kind: "build",
      scenario: "Build an accessible text field pair.",
      task: "Create a form with a text input and a correctly associated label. Include a submit button.",
      hints: ["label for matches input id", "button type=submit"],
      referenceSolution:
        `<form>\n  <label for="full-name">Full name</label>\n  <input id="full-name" name="fullName" type="text" required />\n  <button type="submit">Continue</button>\n</form>`,
      takeaways: ["for/id pairing is mandatory"],
      validateIncludes: ["<form", "<label", "for=", "<input", "type=\"submit\""],
      acceptanceCriteria: ["form", "label/input association", "submit control"],
    },
    {
      key: "form-m",
      title: `${topicTitle} — Email + password`,
      difficulty: "medium",
      minutes: 14,
      kind: "build",
      scenario: "Login form for a company portal.",
      task: "Build email and password fields with labels, autocomplete attributes, and required.",
      hints: ["type=email and type=password", "autocomplete=email / current-password"],
      referenceSolution:
        `<form>\n  <label for="email">Email</label>\n  <input id="email" type="email" name="email" autocomplete="email" required />\n  <label for="password">Password</label>\n  <input id="password" type="password" name="password" autocomplete="current-password" required />\n  <button type="submit">Sign in</button>\n</form>`,
      takeaways: ["Correct types improve mobile keyboards and validation"],
      validateIncludes: ["type=\"email\"", "type=\"password\"", "autocomplete=", "required"],
      acceptanceCriteria: ["email field", "password field", "autocomplete", "required"],
    },
    {
      key: "form-h",
      title: `${topicTitle} — Fieldset survey`,
      difficulty: "hard",
      minutes: 20,
      kind: "a11y",
      scenario: "Survey with radio group must be announced correctly.",
      task: "Use fieldset/legend around a radio group, plus a textarea with label, and submit.",
      hints: ["fieldset + legend", "same name on radios", "label for textarea"],
      referenceSolution:
        `<form>\n  <fieldset>\n    <legend>Preferred contact</legend>\n    <label><input type="radio" name="contact" value="email" /> Email</label>\n    <label><input type="radio" name="contact" value="phone" /> Phone</label>\n  </fieldset>\n  <label for="notes">Notes</label>\n  <textarea id="notes" name="notes"></textarea>\n  <button type="submit">Send</button>\n</form>`,
      takeaways: ["Radio groups need fieldset/legend"],
      validateIncludes: ["<fieldset", "<legend", "type=\"radio\"", "<textarea"],
      acceptanceCriteria: ["fieldset/legend", "radio group", "textarea"],
    },
    {
      key: "form-select",
      title: `${topicTitle} — Select with optgroup`,
      difficulty: "medium",
      minutes: 12,
      kind: "build",
      scenario: "Country/region picker for checkout.",
      task: "Build a labeled select with at least one optgroup and multiple options.",
      hints: ["label for select id", "optgroup label attribute"],
      referenceSolution:
        `<label for="region">Region</label>\n<select id="region" name="region">\n  <optgroup label="Americas">\n    <option>United States</option>\n    <option>Canada</option>\n  </optgroup>\n</select>`,
      takeaways: ["optgroup organizes long lists"],
      validateIncludes: ["<select", "<optgroup", "<option", "<label"],
      acceptanceCriteria: ["labeled select", "optgroup", "options"],
    },
  ];
}

function a11yPack(topicTitle: string): Spec[] {
  return [
    {
      key: "a11y-e",
      title: `${topicTitle} — Skip link + main`,
      difficulty: "easy",
      minutes: 10,
      kind: "a11y",
      scenario: "Keyboard users need a skip link.",
      task: "Add a skip link to #main-content and a main element with that id containing an h1.",
      hints: ["a href=#main-content", "main id=main-content"],
      referenceSolution:
        `<a href="#main-content">Skip to content</a>\n<main id="main-content">\n  <h1>${topicTitle}</h1>\n</main>`,
      takeaways: ["Skip links help keyboard users"],
      validateIncludes: ["href=\"#main-content\"", "id=\"main-content\"", "<main"],
      acceptanceCriteria: ["Skip link", "main target", "h1"],
    },
    {
      key: "a11y-m",
      title: `${topicTitle} — Named navigation`,
      difficulty: "medium",
      minutes: 12,
      kind: "a11y",
      scenario: "Two nav regions must be distinguishable.",
      task: "Create two nav elements with different aria-label values and link lists inside.",
      hints: ["aria-label on each nav", "ul/li/a structure"],
      referenceSolution:
        `<nav aria-label="Primary"><ul><li><a href="/">Home</a></li></ul></nav>\n<nav aria-label="Footer"><ul><li><a href="/legal">Legal</a></li></ul></nav>`,
      takeaways: ["Label multiple nav landmarks"],
      validateIncludes: ["aria-label=", "<nav", "<ul"],
      acceptanceCriteria: ["Two labeled navs", "Lists of links"],
    },
    {
      key: "a11y-h",
      title: `${topicTitle} — Button name for icon`,
      difficulty: "hard",
      minutes: 14,
      kind: "a11y",
      scenario: "Icon-only control has no accessible name.",
      task: "Create a button with aria-label that describes the action (example: Close dialog).",
      hints: ["Use button not div", "aria-label=Close dialog"],
      referenceSolution: `<button type="button" aria-label="Close dialog">×</button>`,
      takeaways: ["Icon buttons need accessible names"],
      validateIncludes: ["<button", "aria-label="],
      acceptanceCriteria: ["Native button", "Accessible name"],
    },
  ];
}

function seoPack(topicTitle: string): Spec[] {
  return [
    {
      key: "seo-e",
      title: `${topicTitle} — Title craft`,
      difficulty: "easy",
      minutes: 8,
      kind: "seo",
      scenario: "SERP title is missing.",
      task: "Set a descriptive title that includes the topic name.",
      hints: ["title in head"],
      referenceSolution: `<title>${topicTitle} | Learn HTML</title>`,
      takeaways: ["Titles are unique per page"],
      validateIncludes: ["<title", topicTitle.split(" ")[0]!.toLowerCase()],
      acceptanceCriteria: ["Descriptive title"],
    },
    {
      key: "seo-m",
      title: `${topicTitle} — Description + h1`,
      difficulty: "medium",
      minutes: 12,
      kind: "seo",
      scenario: "Snippet and on-page topic must align.",
      task: "Add meta description and a matching h1.",
      hints: ["meta name=description", "One h1"],
      referenceSolution:
        `<meta name="description" content="A practical guide to ${topicTitle}." />\n<h1>${topicTitle}</h1>`,
      takeaways: ["Description supports the click; h1 supports the page"],
      validateIncludes: ["name=\"description\"", "<h1"],
      acceptanceCriteria: ["Meta description", "h1"],
    },
    {
      key: "seo-h",
      title: `${topicTitle} — Canonical + OG title`,
      difficulty: "hard",
      minutes: 16,
      kind: "seo",
      scenario: "Duplicate URLs confuse crawlers and social previews.",
      task: "Add link rel=canonical and og:title meta property.",
      hints: ["link rel=canonical href=...", "meta property=og:title"],
      referenceSolution:
        `<link rel="canonical" href="https://example.com/html/" />\n<meta property="og:title" content="${topicTitle}" />`,
      takeaways: ["Canonical + social meta are production basics"],
      validateIncludes: ["rel=\"canonical\"", "og:title"],
      acceptanceCriteria: ["Canonical link", "Open Graph title"],
    },
  ];
}

function tablePack(topicTitle: string): Spec[] {
  return [
    {
      key: "table-e",
      title: `${topicTitle} — Caption + headers`,
      difficulty: "easy",
      minutes: 12,
      kind: "a11y",
      scenario: "Pricing data needs an accessible table.",
      task: "Build a table with caption, thead with th scope=col, and tbody rows.",
      hints: ["caption", "scope=col on th"],
      referenceSolution:
        `<table>\n  <caption>Plans</caption>\n  <thead><tr><th scope="col">Plan</th><th scope="col">Price</th></tr></thead>\n  <tbody><tr><td>Basic</td><td>$9</td></tr></tbody>\n</table>`,
      takeaways: ["caption + scope make tables usable"],
      validateIncludes: ["<table", "<caption", "scope=\"col\"", "<thead", "<tbody"],
      acceptanceCriteria: ["caption", "column headers", "tbody"],
    },
  ];
}

function mediaPack(topicTitle: string): Spec[] {
  return [
    {
      key: "media-e",
      title: `${topicTitle} — Meaningful alt`,
      difficulty: "easy",
      minutes: 8,
      kind: "a11y",
      scenario: "Product photo needs a useful alt.",
      task: "Add an img with descriptive alt (not 'image'). Include width and height attributes.",
      hints: ["alt describes the subject", "width/height reduce CLS"],
      referenceSolution: `<img src="/shoes.jpg" alt="Red running shoes on a white background" width="640" height="480" />`,
      takeaways: ["Alt describes purpose/content"],
      validateIncludes: ["<img", "alt=", "width=", "height="],
      acceptanceCriteria: ["img with alt", "dimensions"],
    },
    {
      key: "media-m",
      title: `${topicTitle} — Lazy image`,
      difficulty: "medium",
      minutes: 10,
      kind: "build",
      scenario: "Below-fold gallery image should lazy load.",
      task: "Create an img with loading=lazy and a non-empty alt.",
      hints: ["loading=lazy"],
      referenceSolution: `<img src="/gallery-2.jpg" alt="Team workshop whiteboard" loading="lazy" />`,
      takeaways: ["Lazy loading is an HTML performance tool"],
      validateIncludes: ["loading=\"lazy\"", "alt="],
      acceptanceCriteria: ["lazy loading", "alt"],
    },
    {
      key: "media-h",
      title: `${topicTitle} — Video with captions track`,
      difficulty: "hard",
      minutes: 16,
      kind: "a11y",
      scenario: "Marketing video must include captions.",
      task: "Build a video with controls and a track kind=captions.",
      hints: ["video controls", "track kind=captions src=..."],
      referenceSolution:
        `<video controls>\n  <source src="/intro.mp4" type="video/mp4" />\n  <track kind="captions" src="/intro.vtt" srclang="en" label="English" />\n</video>`,
      takeaways: ["Captions are required for accessible video"],
      validateIncludes: ["<video", "controls", "kind=\"captions\""],
      acceptanceCriteria: ["video controls", "captions track"],
    },
  ];
}

function projectPack(topicSlug: string, topicTitle: string): Spec[] {
  return [
    {
      key: "proj-e",
      title: `${topicTitle} — Page shell`,
      difficulty: "easy",
      minutes: 14,
      kind: "project",
      scenario: "Scaffold the project document.",
      task: "Create header with nav, main with h1, and footer.",
      hints: ["header/nav/main/footer"],
      referenceSolution:
        `<header><nav aria-label="Primary"><a href="/">Home</a></nav></header>\n<main><h1>${topicTitle}</h1></main>\n<footer><p>© SupraBase</p></footer>`,
      takeaways: ["Landmarks first"],
      validateIncludes: ["<header", "<nav", "<main", "<footer", "<h1"],
      acceptanceCriteria: ["header/nav/main/footer", "h1"],
    },
    {
      key: "proj-m",
      title: `${topicTitle} — Content sections`,
      difficulty: "medium",
      minutes: 18,
      kind: "project",
      scenario: "Fill the project with real sections.",
      task: "Add two sections with h2 headings and lists or paragraphs of content.",
      hints: ["section + h2", "ul or p content"],
      referenceSolution:
        `<main>\n  <h1>${topicTitle}</h1>\n  <section><h2>Features</h2><ul><li>Fast</li><li>Accessible</li></ul></section>\n  <section><h2>Details</h2><p>Project details go here.</p></section>\n</main>`,
      takeaways: ["Sections need headings"],
      validateIncludes: ["<section", "<h2", "<main"],
      acceptanceCriteria: ["Two sections with h2"],
    },
    {
      key: "proj-h",
      title: `${topicTitle} — Contact form`,
      difficulty: "hard",
      minutes: 22,
      kind: "project",
      scenario: "Every marketing/project page needs contact.",
      task: "Add a contact form with name, email, message textarea, labels, and submit.",
      hints: ["label each control", "required on key fields"],
      referenceSolution:
        `<form>\n  <label for="name">Name</label>\n  <input id="name" name="name" required />\n  <label for="email">Email</label>\n  <input id="email" type="email" name="email" required />\n  <label for="msg">Message</label>\n  <textarea id="msg" name="message" required></textarea>\n  <button type="submit">Send</button>\n</form>`,
      takeaways: ["Contact forms must be labeled"],
      validateIncludes: ["<form", "type=\"email\"", "<textarea", "<label"],
      acceptanceCriteria: ["Labeled name/email/message", "submit"],
    },
  ];
}

function interviewPack(topicTitle: string): Spec[] {
  return [
    {
      key: "iv-e",
      title: `${topicTitle} — Explain with markup`,
      difficulty: "easy",
      minutes: 10,
      kind: "interview",
      scenario: "Whiteboard question: show a tiny example.",
      task: "Write HTML plus HTML comments explaining strong vs em OR article vs section — pick one pair.",
      hints: ["Use comments", "Keep under 20 lines"],
      referenceSolution:
        `<!-- strong = importance; em = emphasis -->\n<p><strong>Warning:</strong> <em>Save your work</em> before continuing.</p>`,
      takeaways: ["Interview answers need a concrete snippet"],
      validateIncludes: ["<!--", "<"],
      acceptanceCriteria: ["Commented explanation", "Working snippet"],
    },
    {
      key: "iv-h",
      title: `${topicTitle} — Code review fix`,
      difficulty: "hard",
      minutes: 16,
      kind: "interview",
      scenario: "Reviewer asks you to fix div-based fake button and missing lang.",
      task: "Provide corrected markup: html lang, and a real button element instead of clickable div.",
      hints: ["button type=button", "lang on html"],
      referenceSolution:
        `<html lang="en">\n<body>\n  <button type="button">Save draft</button>\n</body>\n</html>`,
      takeaways: ["Senior answers fix root causes"],
      validateIncludes: ["lang=", "<button"],
      acceptanceCriteria: ["lang set", "native button"],
    },
  ];
}

function buildChallenge(
  topicSlug: string,
  spec: Spec
): HtmlChallenge {
  const id = `html-${topicSlug}-${spec.key}`;
  const starterHtml = spec.starterHtml ?? STARTER_SHELL;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    starterHtml
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
    referenceSolution: spec.referenceSolution,
    takeaways: spec.takeaways,
    starterHtml,
    validateIncludes: spec.validateIncludes,
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "html-live",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: HtmlChallenge[] = flattenHtmlTopics().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, HtmlChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listHtmlAcademyChallenges(topicSlug: string): HtmlChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allHtmlAcademyChallenges(): HtmlChallenge[] {
  return BANK;
}

export function findHtmlAcademyChallenge(
  topicSlug: string,
  challengeId: string
): HtmlChallenge | null {
  const list = listHtmlAcademyChallenges(topicSlug);
  return (
    list.find((c) => c.id === challengeId || c.lesson.id === challengeId) ??
    null
  );
}

export function htmlAcademyTopicChallengeCount(topicSlug: string): number {
  return listHtmlAcademyChallenges(topicSlug).length;
}

/**
 * All HTML academy challenges use the read-only code reference layout
 * (question left, code + Copy right). No Run / Show solution.
 */
export function isHtmlTheoryChallenge(_challenge: HtmlChallenge): boolean {
  return true;
}
