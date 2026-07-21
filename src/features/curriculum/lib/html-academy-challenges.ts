import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import { flattenHtmlTopics } from "@/features/curriculum/lib/html-academy-curriculum";

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

function specsForTopic(
  topicSlug: string,
  topicTitle: string,
  weight: number
): Spec[] {
  const specs: Spec[] = [];

  const push = (spec: Spec) => specs.push(spec);

  // Core trio
  push({
    key: "e1",
    title: `${topicTitle} — Easy build`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: [
      `HTML (HyperText Markup Language) is the structure of every webpage.`,
      `It is not a programming language — it marks up content so browsers know what is a heading, paragraph, link, form, or image.`,
      `Browsers read your HTML, build a DOM tree, then show the page. CSS styles it. JavaScript adds behavior.`,
      ``,
      `In this challenge you practice ${topicTitle} with clean, valid HTML5 a teammate could read without guessing.`,
    ].join("\n"),
    task: `Create a minimal page related to ${topicTitle}. Include DOCTYPE, html with lang, head with charset and title, and body content that demonstrates the topic.`,
    hints: [
      "Start from the HTML5 document shell.",
      "Set lang on the html element.",
      "Use a meaningful title.",
    ],
    referenceSolution: STARTER_SHELL.replace(
      "<!-- Build your solution here -->",
      `<main>\n    <h1>${topicTitle}</h1>\n    <p>Practice content for this topic.</p>\n  </main>`
    ).replace("<title>Document</title>", `<title>${topicTitle}</title>`),
    takeaways: [
      "Every page needs a valid document shell.",
      "lang and title are not optional polish.",
    ],
    validateIncludes: ["<!doctype html>", "lang=", "<title>", "<body"],
    acceptanceCriteria: [
      "HTML5 DOCTYPE present",
      "html lang attribute set",
      "title element present",
      "body content present",
    ],
  });

  push({
    key: "m1",
    title: `${topicTitle} — Medium practice`,
    difficulty: "medium",
    minutes: 16,
    kind: "semantic",
    scenario: `A designer handed you wireframes for ${topicTitle}. Structure the content with semantic HTML — not a pile of divs.`,
    task: `Build a section that correctly uses semantic elements for ${topicTitle}. Include headings in a logical order and at least one paragraph of real content.`,
    hints: [
      "Prefer semantic tags over anonymous wrappers.",
      "Do not skip heading levels.",
      "One clear h1 for the page topic.",
    ],
    referenceSolution: STARTER_SHELL.replace(
      "<!-- Build your solution here -->",
      `<main>\n    <h1>${topicTitle}</h1>\n    <section>\n      <h2>Overview</h2>\n      <p>Semantic structure for ${topicTitle}.</p>\n    </section>\n  </main>`
    ),
    takeaways: [
      "Semantics communicate meaning to browsers and assistive tech.",
      "Headings form the document outline.",
    ],
    validateIncludes: ["<h1", "<p", "<main"],
    acceptanceCriteria: [
      "Uses main landmark",
      "Includes h1 and paragraph",
      "Semantic structure for the topic",
    ],
  });

  push({
    key: "h1",
    title: `${topicTitle} — Hard company task`,
    difficulty: "hard",
    minutes: 22,
    kind: "fix",
    scenario: `A production page about ${topicTitle} failed accessibility and SEO review. Fix the markup to professional standards.`,
    task: `Rebuild a polished snippet for ${topicTitle} with: unique title, meta description, visible labels if forms appear, meaningful alt text for any images, and a correct landmark structure.`,
    hints: [
      "Add meta name=description in head.",
      "Images need useful alt (or empty alt if decorative).",
      "Forms need label for/id pairing.",
    ],
    referenceSolution: STARTER_SHELL.replace(
      "<title>Document</title>",
      `<title>${topicTitle} | SupraLearn</title>\n  <meta name="description" content="Learn ${topicTitle} with accessible semantic HTML." />`
    ).replace(
      "<!-- Build your solution here -->",
      `<header>\n    <nav aria-label="Primary">\n      <a href="/">Home</a>\n    </nav>\n  </header>\n  <main>\n    <h1>${topicTitle}</h1>\n    <p>Production-ready markup checklist complete.</p>\n  </main>\n  <footer>\n    <p>SupraLearn HTML Academy</p>\n  </footer>`
    ),
    takeaways: [
      "A11y and SEO reviews catch missing metadata and landmarks.",
      "Ship markup you would defend in a PR.",
    ],
    validateIncludes: [
      "meta name=\"description\"",
      "<main",
      "<h1",
      "lang=",
    ],
    acceptanceCriteria: [
      "Meta description present",
      "Landmark structure with main",
      "Page language set",
    ],
  });

  // Weight-based extras
  const extraCount = Math.max(0, weight - 1);
  for (let i = 0; i < extraCount; i += 1) {
    const n = i + 2;
    const difficulty: LearnDifficulty =
      i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard";
    const kind: HtmlChallengeKind =
      i % 5 === 0
        ? "a11y"
        : i % 5 === 1
          ? "seo"
          : i % 5 === 2
            ? "interview"
            : i % 5 === 3
              ? "fix"
              : "build";

    push({
      key: `${difficulty[0]}${n}`,
      title: `${topicTitle} — Drill ${n}`,
      difficulty,
      minutes: difficulty === "easy" ? 8 : difficulty === "medium" ? 14 : 20,
      kind,
      scenario: scenarioForKind(kind, topicTitle),
      task: taskForKind(kind, topicTitle, topicSlug),
      hints: hintsForKind(kind),
      referenceSolution: referenceForKind(kind, topicTitle),
      takeaways: takeawaysForKind(kind),
      validateIncludes: validateForKind(kind, topicSlug),
      acceptanceCriteria: criteriaForKind(kind),
    });
  }

  // Topic-specific packs
  if (topicSlug.includes("form") || topicSlug.includes("input") || topicSlug.includes("validation") || topicSlug.includes("select")) {
    specs.push(...formPack(topicTitle));
  }
  if (topicSlug.includes("a11y") || topicSlug.includes("aria") || topicSlug.includes("access")) {
    specs.push(...a11yPack(topicTitle));
  }
  if (topicSlug.includes("seo")) {
    specs.push(...seoPack(topicTitle));
  }
  if (topicSlug.includes("table")) {
    specs.push(...tablePack(topicTitle));
  }
  if (topicSlug.includes("img") || topicSlug.includes("picture") || topicSlug.includes("media") || topicSlug.includes("video")) {
    specs.push(...mediaPack(topicTitle));
  }
  if (topicSlug.includes("project") || topicSlug.includes("final")) {
    specs.push(...projectPack(topicSlug, topicTitle));
  }
  if (topicSlug.includes("interview")) {
    specs.push(...interviewPack(topicTitle));
  }

  return specs;
}

function scenarioForKind(kind: HtmlChallengeKind, topicTitle: string): string {
  switch (kind) {
    case "a11y":
      return `Accessibility review failed on a page covering ${topicTitle}. Screen reader users cannot complete key tasks.`;
    case "seo":
      return `Search preview for ${topicTitle} looks broken — missing or duplicate metadata.`;
    case "interview":
      return `Interview warm-up: explain and demonstrate ${topicTitle} with a tiny HTML example.`;
    case "fix":
      return `QA filed bugs against markup related to ${topicTitle}. Reproduce a correct version.`;
    case "project":
      return `Ship a mini deliverable for ${topicTitle} that could go in your portfolio.`;
    case "semantic":
      return `Replace div soup with semantic HTML for ${topicTitle}.`;
    default:
      return `Build a clear HTML example for ${topicTitle}.`;
  }
}

function taskForKind(
  kind: HtmlChallengeKind,
  topicTitle: string,
  topicSlug: string
): string {
  switch (kind) {
    case "a11y":
      return "Fix or build markup with: lang on html, visible labels for inputs (if any), meaningful alt or empty alt for decorative images, and a single main landmark.";
    case "seo":
      return "Add a unique title and meta description. Use one h1 that matches the page topic. Ensure at least one descriptive internal link.";
    case "interview":
      return `Write a short HTML snippet you would sketch on a whiteboard to explain ${topicTitle}. Include comments that state why each key tag exists.`;
    case "fix":
      return `Repair broken patterns for ${topicTitle}: wrong heading order, missing DOCTYPE, or non-semantic wrappers. Deliver valid HTML5.`;
    case "project":
      return `Create a polished page section for ${topicTitle} with header/nav/main/footer where appropriate.`;
    default:
      return `Demonstrate ${topicTitle} (${topicSlug}) with valid HTML5 and readable structure.`;
  }
}

function hintsForKind(kind: HtmlChallengeKind): string[] {
  switch (kind) {
    case "a11y":
      return [
        "lang=en on html",
        "label for= must match input id",
        "One main per page",
      ];
    case "seo":
      return [
        "title in head",
        "meta name=description",
        "Single clear h1",
      ];
    case "interview":
      return ["Keep the example tiny", "Comment the why", "Prefer semantic tags"];
    default:
      return ["Validate nesting", "Prefer semantic elements", "Keep content readable"];
  }
}

function referenceForKind(kind: HtmlChallengeKind, topicTitle: string): string {
  if (kind === "seo") {
    return STARTER_SHELL.replace(
      "<title>Document</title>",
      `<title>${topicTitle}</title>\n  <meta name="description" content="${topicTitle} guide for frontend developers." />`
    ).replace(
      "<!-- Build your solution here -->",
      `<main>\n    <h1>${topicTitle}</h1>\n    <p>Learn more on the <a href="/docs">docs</a>.</p>\n  </main>`
    );
  }
  if (kind === "a11y") {
    return STARTER_SHELL.replace(
      "<!-- Build your solution here -->",
      `<main>\n    <h1>${topicTitle}</h1>\n    <form>\n      <label for="name">Name</label>\n      <input id="name" name="name" type="text" required />\n      <button type="submit">Save</button>\n    </form>\n  </main>`
    );
  }
  return STARTER_SHELL.replace(
    "<!-- Build your solution here -->",
    `<main>\n    <h1>${topicTitle}</h1>\n    <p>Example for ${topicTitle}.</p>\n  </main>`
  );
}

function takeawaysForKind(kind: HtmlChallengeKind): string[] {
  switch (kind) {
    case "a11y":
      return ["Accessibility starts with correct HTML", "Labels beat placeholders"];
    case "seo":
      return ["Unique titles win", "Metadata + headings work together"];
    case "interview":
      return ["Explain why, not only what", "Tiny examples beat essays"];
    default:
      return ["Semantic HTML scales", "Readable markup is professional"];
  }
}

function validateForKind(kind: HtmlChallengeKind, _topicSlug: string): string[] {
  switch (kind) {
    case "a11y":
      return ["lang=", "<main", "<h1"];
    case "seo":
      return ["<title", "description", "<h1"];
    case "interview":
      return ["<!--", "<h1"];
    default:
      return ["<!doctype html>", "<body"];
  }
}

function criteriaForKind(kind: HtmlChallengeKind): string[] {
  switch (kind) {
    case "a11y":
      return ["Language set", "Main landmark", "Primary heading"];
    case "seo":
      return ["Title present", "Meta description", "Single clear h1"];
    default:
      return ["Valid HTML5 shell", "Visible body content"];
  }
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
        `<header><nav aria-label="Primary"><a href="/">Home</a></nav></header>\n<main><h1>${topicTitle}</h1></main>\n<footer><p>© SupraLearn</p></footer>`,
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
  specsForTopic(topic.slug, topic.title, topic.challengeWeight).map((spec) =>
    buildChallenge(topic.slug, spec)
  )
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
