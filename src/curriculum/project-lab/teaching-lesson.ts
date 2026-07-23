import type {
  CodeBlockLesson,
  LabLanguage,
  LabTrack,
  ProjectLabContext,
  ProjectLabLesson,
  TeachSection,
} from "./types";
import { buildLabFiles } from "./code-samples";
import { languageLabel } from "./tracks";

function nextProjectHint(ctx: ProjectLabContext): string {
  if (ctx.difficulty === "easy") {
    return `After this, pick a Medium project in Module ${ctx.moduleNumber} — stretch the same idea with validation and tests.`;
  }
  if (ctx.difficulty === "medium") {
    return `Next, tackle a Hard project in Module ${ctx.moduleNumber} and add edge cases + a short design note.`;
  }
  return `Next, ship a related project from Module ${Math.min(20, ctx.moduleNumber + 1)} and explain your tradeoffs out loud.`;
}

function langFlavor(track: LabTrack, language: LabLanguage, label: string): string {
  if (track === "frontend") {
    if (language === "html") {
      return `We're looking at the HTML structure — the skeleton of the page. Think of HTML as the bones: headings, forms, and landmarks that screen readers and browsers understand.`;
    }
    if (language === "css") {
      return `We're looking at the CSS — how the page feels. Spacing, color, and hierarchy are product decisions, not decoration.`;
    }
    return `We're looking at the JavaScript behavior — what happens when a user clicks, types, or submits. This is where state and validation live in the browser.`;
  }
  if (track === "backend") {
    return `We're looking at a ${label} service. In a real company this would sit behind a load balancer, talk to a database, and return predictable JSON errors.`;
  }
  return `We're implementing this project in ${label}. The algorithm stays the same across languages — only syntax and standard libraries change.`;
}

function architectureBody(
  ctx: ProjectLabContext,
  track: LabTrack,
  language: LabLanguage,
  label: string
): string {
  if (track === "frontend") {
    return [
      `For "${ctx.title}" we keep a tiny, honest folder layout:`,
      ``,
      `project/`,
      `  index.html   → structure and accessibility landmarks`,
      `  styles.css   → visual hierarchy and responsive spacing`,
      `  app.js       → validation, core logic, and DOM updates`,
      ``,
      `Data flow is simple on purpose:`,
      `User input → validate → process → render result.`,
      ``,
      `Why split files? Because in real teams, designers touch CSS, content folks touch HTML, and engineers own behavior. Clear boundaries reduce merge pain.`,
      ``,
      `Right now you're focused on the ${label} file — that's the piece we're teaching in this tab.`,
    ].join("\n");
  }
  if (track === "backend") {
    return [
      `Backend shape for "${ctx.title}" (${label}):`,
      ``,
      `routes/handlers  → accept HTTP, return status codes`,
      `validation       → reject bad input early (400)`,
      `domain logic     → create/update the useful thing`,
      `in-memory store  → stand-in for a database while learning`,
      ``,
      `Request flow:`,
      `Client → HTTP endpoint → validate body → mutate store → JSON response`,
      ``,
      `Each file (or class) exists to answer one question: "What is my job if this service grows?" Handlers shouldn't parse SQL. Domain code shouldn't know about Express/Spring details.`,
    ].join("\n");
  }
  return [
    `${label} implementation layout for "${ctx.title}":`,
    ``,
    `main entry     → user interaction loop or demo harness`,
    `validate()     → protect the core logic from garbage input`,
    `run()          → pure-ish core transformation`,
    ``,
    `Data flow:`,
    `raw input → validate → run → print/return result`,
    ``,
    `We keep validate and run separate so you can unit-test logic without faking a console. That's how senior engineers keep CLI tools maintainable.`,
  ].join("\n");
}

function codeBlocksFor(
  track: LabTrack,
  language: LabLanguage,
  label: string,
  ctx: ProjectLabContext
): CodeBlockLesson[] {
  if (track === "frontend" && language === "html") {
    return [
      {
        name: "<main> + landmarks",
        purpose: "Give the page a clear primary region for assistive tech and layout.",
        inputs: "Static content + form fields the user will fill.",
        output: "A semantic document browsers can navigate by heading/region.",
        logic: "Wrap the app in <main>, label sections with headings, connect labels to inputs.",
        analogy: "Like labeling rooms in a building — people find the kitchen faster when the door says Kitchen.",
      },
      {
        name: "Form + <output>",
        purpose: "Collect input and reserve a place for results.",
        inputs: "Text from the user.",
        output: "A result region that JavaScript can update.",
        logic: "Use required fields and for/id pairing so validation and a11y come free.",
        analogy: "A restaurant order slip: clear fields in, kitchen ticket out.",
      },
    ];
  }
  if (track === "frontend" && language === "css") {
    return [
      {
        name: "Design tokens (:root)",
        purpose: "Centralize colors/spacing so the UI stays consistent.",
        inputs: "Brand decisions (background, accent, radius).",
        output: "Reusable CSS variables across components.",
        logic: "Define tokens once, consume with var(--token).",
        analogy: "A company brand kit — one indigo, used everywhere.",
      },
      {
        name: "Panel layout",
        purpose: "Create readable cards for the workspace and checklist.",
        inputs: "Content blocks from HTML.",
        output: "Visually separated sections with comfortable density.",
        logic: "Border + padding + radius beat giant margins for product UIs.",
        analogy: "Sticky notes on a desk — each note is one job.",
      },
    ];
  }
  if (track === "frontend") {
    return [
      {
        name: "validate()",
        purpose: "Reject empty/garbage input before it hits core logic.",
        inputs: "Raw string from the input field.",
        output: "A cleaned string, or a thrown Error.",
        logic: "Trim whitespace; fail fast with a human message.",
        analogy: "Security checking IDs at the door before the concert.",
      },
      {
        name: "processInput()",
        purpose: "Perform the project's real work without touching the DOM.",
        inputs: "Validated string.",
        output: "A small result object with message + metadata.",
        logic: "Keep this function testable and boring — pure when possible.",
        analogy: "The kitchen: ingredients in, plated dish out — no serving tables inside.",
      },
      {
        name: "submit handler",
        purpose: "Wire UI events to validate → process → render.",
        inputs: "Submit event from the form.",
        output: "Updated result text, or an error message.",
        logic: "preventDefault, try/catch, never let exceptions blank the page.",
        analogy: "A waiter taking the order, sending it to the kitchen, bringing food back.",
      },
    ];
  }
  if (track === "backend") {
    return [
      {
        name: "Health endpoint",
        purpose: "Prove the service is alive for deploy checks and load balancers.",
        inputs: "GET /health",
        output: "JSON { ok: true, ... }",
        logic: "Keep it cheap — no DB calls if you can avoid them.",
        analogy: "A store's 'Open' neon sign — not the whole inventory.",
      },
      {
        name: "POST /items",
        purpose: "Create a resource with validation and a proper status code.",
        inputs: "JSON body with title.",
        output: "201 + created entity, or 400 with error.",
        logic: "Validate → create id/timestamp → store → return created shape.",
        analogy: "Opening a bank account: reject incomplete forms, then issue an account number.",
      },
      {
        name: `Error shaping (${label})`,
        purpose: "Return predictable JSON errors clients can handle.",
        inputs: "Invalid payloads or unknown routes.",
        output: "Consistent { error: string } with correct HTTP status.",
        logic: "Never leak stack traces to clients in production.",
        analogy: "Customer support scripts — calm, specific, never panic.",
      },
    ];
  }
  return [
    {
      name: "validate()",
      purpose: "Guard the core function from empty or nonsense input.",
      inputs: `Raw user string (${label}).`,
      output: "Clean string or a clear exception/error.",
      logic: "Trim, check emptiness, throw early.",
      analogy: "Quality control before the factory line starts.",
    },
    {
      name: "run()",
      purpose: `Do the actual work of "${ctx.title}".`,
      inputs: "Validated input.",
      output: "A result string (or structured value in richer versions).",
      logic: "Keep side effects out — easier to test and reuse.",
      analogy: "A pure calculator chip: numbers in, answer out.",
    },
    {
      name: "main loop",
      purpose: "Provide a tiny interactive demo harness.",
      inputs: "Console lines until quit.",
      output: "Printed results or errors.",
      logic: "Read → run → print; catch errors without crashing the process.",
      analogy: "A help desk ticket loop — one customer at a time.",
    },
  ];
}

export function buildProjectLabLesson(
  ctx: ProjectLabContext,
  track: LabTrack,
  language: LabLanguage
): ProjectLabLesson {
  const label = languageLabel(track, language);
  const files = buildLabFiles(ctx, track, language);

  const sections: TeachSection[] = [
    {
      id: "overview",
      title: "Project Overview",
      body: [
        `Alright — pull up a chair. Today we're building **${ctx.title}**.`,
        ``,
        `### What are we building?`,
        ctx.description,
        ``,
        `This sits in **Module ${ctx.moduleNumber}: ${ctx.moduleTitle}** at **${ctx.difficulty}** difficulty. We're not collecting features for a resume bullet — we're practicing the exact muscles companies hire for.`,
        ``,
        `### Why is this project useful?`,
        `Because it forces you to turn a fuzzy idea into: input → rules → output → failure modes. That's software in one sentence.`,
        ``,
        `### Where is this used in real companies?`,
        `Teams ship tiny versions of this every sprint — internal tools, onboarding wizards, admin panels, API endpoints, CLI utilities. The names change; the engineering habits don't.`,
        ``,
        `### Real-world examples`,
        `- A support engineer needs a quick internal calculator or checklist tool.`,
        `- A product squad prototypes a flow before the "real" service exists.`,
        `- An SRE adds a health endpoint so deploys can verify the app is alive.`,
        ``,
        langFlavor(track, language, label),
      ].join("\n"),
    },
    {
      id: "before-code",
      title: "Before Writing Code",
      body: [
        `Don't open the editor yet. Senior engineers spend time thinking first — juniors who skip this write the project twice.`,
        ``,
        `### How should a developer approach this?`,
        `1. Restate the goal in one sentence a teammate would understand.`,
        `2. List inputs, outputs, and three failure cases.`,
        `3. Sketch the smallest demo that proves the idea.`,
        `4. Only then pick files/frameworks.`,
        ``,
        `### How should requirements be understood?`,
        `Read the acceptance checklist like a contract:`,
        ...ctx.features.map((f) => `- ${f.title}`),
        ``,
        `If a checklist item is vague, rewrite it as: "Given X, when Y, then Z."`,
        ``,
        `### Mistakes beginners should avoid`,
        `- Coding UI before validating input.`,
        `- Mixing "pretty" with "correct" — correctness first.`,
        `- Copying a huge framework when a small script teaches more.`,
        `- Ignoring error messages ("I'll fix UX later" becomes "it crashes in demos").`,
      ].join("\n"),
    },
    {
      id: "architecture",
      title: "Project Architecture",
      body: architectureBody(ctx, track, language, label),
    },
  ];

  const implementationSteps = [
    `Clarify the user story for "${ctx.title}" in one paragraph.`,
    `Define the happy path and 2–3 invalid inputs you must reject.`,
    `Create the ${label} file(s) and name things after jobs, not jokes.`,
    `Implement validation before core logic.`,
    `Implement the core transform/feature for the happy path.`,
    `Wire I/O (UI submit, HTTP route, or console loop).`,
    `Manually test checklist items: ${ctx.features.map((f) => f.title).join("; ")}.`,
    `Clean naming, remove dead code, write a 5-line README on how to run it.`,
  ];

  const bestPractices = [
    `Naming: functions are verbs (validate, createItem), data is nouns (item, result).`,
    `Folder structure: one job per file/module — don't invent a monorepo for a learning project.`,
    `Error handling: fail early with messages a human can act on.`,
    `Performance: for this size, clarity beats micro-optimizations. Avoid accidental O(n²) in hot loops later.`,
    `Scalability: design as if a database will replace the in-memory Map — keep storage behind a tiny boundary.`,
    `Clean code: short functions, no mystery abbreviations, delete commented-out graveyards.`,
  ];

  const commonMistakes = [
    `Swallowing errors with empty catch blocks — you'll debug ghosts.`,
    `Trusting user input — always validate at the boundary.`,
    `Hard-coding secrets or machine-specific paths.`,
    `Building features not on the checklist (scope creep).`,
    `Debugging tip: reproduce with the smallest input, print shapes at boundaries, then fix the first broken assumption.`,
    `Interview tip: narrate tradeoffs — "I chose ${label} here because… and I'd swap X if traffic grew."`,
  ];

  const workflow = [
    {
      title: "Planning",
      body: `Write the one-sentence goal, acceptance checks, and out-of-scope list for ${ctx.title}.`,
    },
    {
      title: "Architecture",
      body: `Decide boundaries: validation vs core logic vs I/O. Pick ${label} files accordingly.`,
    },
    {
      title: "Implementation",
      body: `Build the vertical slice: one happy path end-to-end before polishing.`,
    },
    {
      title: "Testing",
      body: `Walk the checklist. Add one automated test if your stack makes it cheap.`,
    },
    {
      title: "Optimization",
      body: `Only optimize after correctness. Prefer clearer code over clever code.`,
    },
    {
      title: "Deployment",
      body: track === "backend"
        ? `Containerize or script a start command; hit /health after boot.`
        : `Document run steps so another student can clone and demo in under 2 minutes.`,
    },
    {
      title: "Interview Questions",
      body: `Be ready to explain data flow, failure modes, and what you'd change at 10× users.`,
    },
  ];

  const interviewQuestions = [
    {
      question: `Walk me through the data flow of ${ctx.title} as if I never saw the code.`,
      answer: [
        `I'd start with the user story, not the files.`,
        ``,
        `1) Input arrives at the boundary — a form field, HTTP body, or CLI line.`,
        `2) We validate early: empty/garbage input fails with a clear message and never reaches core logic.`,
        `3) A small core function does the real work of "${ctx.title}" and returns a result shape.`,
        `4) The ${label} layer renders or responds — UI text, JSON, or console output.`,
        ``,
        `So the flow is boundary → validate → transform → present. That separation is what I'd draw on the whiteboard in an interview.`,
      ].join("\n"),
    },
    {
      question: `Where do you validate input, and what happens on invalid data?`,
      answer: [
        `Validation lives at the trust boundary — right where untrusted input enters.`,
        ``,
        `In this ${label} version, invalid data is rejected before business logic runs. We return a human-readable error (UI message, 400 JSON, or console Error) instead of crashing or silently continuing.`,
        ``,
        `Pro tip I'd say out loud: validate once at the edge, keep the core pure, and never leak stack traces to clients in production.`,
      ].join("\n"),
    },
    {
      question: `If this needed a database tomorrow, what would you change first?`,
      answer: [
        `I wouldn't rewrite the whole app. I'd introduce a storage boundary.`,
        ``,
        `1) Define a tiny repository interface: create/list/get.`,
        `2) Keep today's in-memory Map as one implementation.`,
        `3) Add a SQL/NoSQL implementation behind the same interface.`,
        `4) Keep validation and ${label} handlers unchanged.`,
        ``,
        `That way "${ctx.title}" stays shippable while persistence evolves — exactly how real teams migrate prototypes to production.`,
      ].join("\n"),
    },
    {
      question: `How would you test the core logic without the UI/HTTP layer?`,
      answer: [
        `I'd unit-test the pure functions — validate() and the core transform — with tables of cases:`,
        ``,
        `- happy path for "${ctx.title}"`,
        `- empty / whitespace-only input`,
        `- obviously bad shapes`,
        `- one edge case from the acceptance checklist`,
        ``,
        `UI/HTTP gets a thin integration smoke test later. In interviews, saying "I test the core without the framework" signals seniority.`,
      ].join("\n"),
    },
    {
      question: `What's one tradeoff you made in the ${label} version?`,
      answer: [
        `I optimized for clarity and teachability over framework power.`,
        ``,
        `Tradeoff: a small ${label} implementation is easy to explain and demo, but it won't include auth, migrations, or horizontal scaling out of the box.`,
        ``,
        `If traffic or team size grew, I'd keep the same data-flow boundaries and swap in stronger infrastructure — not throw away the design. That's the answer interviewers want: conscious tradeoffs, not "I used X because it's popular."`,
      ].join("\n"),
    },
  ];

  return {
    track,
    language,
    languageLabel: label,
    greeting: `Let's build "${ctx.title}" together — ${label} edition.`,
    sections,
    implementationSteps,
    codeBlocks: codeBlocksFor(track, language, label, ctx),
    bestPractices,
    commonMistakes,
    workflow,
    interviewQuestions,
    summary: {
      learned: [
        `How to turn "${ctx.title}" into a clear input → process → output design.`,
        `How ${label} expresses validation, core logic, and I/O boundaries.`,
        `How real teams talk about architecture before typing code.`,
      ],
      skills: [
        ctx.moduleTitle,
        `${label} implementation`,
        "Requirements → design → build",
        "Error handling & debugging",
        "Explaining tradeoffs",
      ],
      nextProject: nextProjectHint(ctx),
    },
    files,
  };
}
