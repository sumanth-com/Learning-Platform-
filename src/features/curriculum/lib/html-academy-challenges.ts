import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  flattenHtmlTopics,
  type HtmlTopicDef,
} from "@/features/curriculum/lib/html-academy-curriculum";

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

function clip(text: string, _max = 56): string {
  return text.replace(/\s+/g, " ").trim();
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
      `<main>\n    <h1>${title}</h1>\n    <p>${clip(summary, 120)}</p>\n  </main>`
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
      `<main>\n    <h1>${title}</h1>\n    <p>${clip(summary, 100)}</p>\n    ${cheatSheet
        .slice(0, 2)
        .map((c) => `<!-- ${c.tag}: ${c.desc} -->`)
        .join("\n    ")}\n  </main>`
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
        `<main>\n    <h1>${title}</h1>\n    <p>Correct approach: avoid “${clip(mistake, 80)}”.</p>\n  </main>`
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
        `<main>\n    <h1>${title}</h1>\n    <section>\n      <h2>Guideline</h2>\n      <p>${practice}</p>\n    </section>\n  </main>`
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
        `<main>\n    <h1>${title}</h1>\n    <p>${a11yNotes[0]}</p>\n  </main>`
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
        `<main>\n    <h1>${title}</h1>\n    <p>${seoNotes[0]}</p>\n    <p>Read the <a href="/docs/${slug}">${title} guide</a>.</p>\n  </main>`,
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
    push({
      key: "interview",
      title: clip(
        interviewQ.endsWith("?")
          ? interviewQ
          : `Interview: ${interviewQ}`,
        64
      ),
      difficulty: "hard",
      minutes: 12,
      kind: "interview",
      scenario: `Whiteboard warm-up for "${title}". Interviewer asks: ${interviewQ}`,
      task: `Answer with a tiny HTML sketch plus HTML comments that explain your reasoning. Keep it under ~20 lines.`,
      hints: [
        "Comment the why, not only the what",
        interviewQuestions[1] ?? "Prefer semantic tags",
        "Stay concrete — one working example",
      ],
      referenceSolution: shellWith(
        `Interview — ${title}`,
        `<main>\n    <!-- Answering: ${interviewQ} -->\n    <h1>${title}</h1>\n    <p>${clip(summary, 110)}</p>\n  </main>`
      ),
      takeaways: [
        "Explain why, not only what",
        clip(interviewQ, 80),
      ],
      validateIncludes: ["<!--", "<h1", "<p"],
      acceptanceCriteria: [
        "Comments explain the answer",
        "Working HTML example",
        "Tied to the interview question",
      ],
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
 * Beginner theory lessons use a read-only code reference.
 * Medium / hard / project challenges keep the interactive playground.
 */
export function isHtmlTheoryChallenge(challenge: HtmlChallenge): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
