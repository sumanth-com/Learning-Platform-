/**
 * Generates src/curriculum/assignment-catalog/module-assignments.ts
 * Exactly 4 unique, module-matched assignments per roadmap module.
 * Briefs are authored per assignment — not shared type templates.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * @typedef {{ title: string, items: string[], note?: string }} Section
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   description: string,
 *   type: string,
 *   time: string,
 *   skills: string[],
 *   xp: number,
 *   notes: string[],
 *   files: string[],
 *   objective: string,
 *   instructions: string,
 *   sections: Section[],
 *   checklist?: string[],
 * }} AssignmentSpec
 */

/** @type {Array<{ n: number, slug: string, title: string, displayTitle: string, assignments: AssignmentSpec[] }>} */
const modules = [
  {
    n: 1,
    slug: "programming-fundamentals",
    title: "Programming Fundamentals",
    displayTitle: "Developer Foundation",
    assignments: [
      {
        slug: "problem-solving-basics",
        title: "Problem Solving Basics",
        description:
          "Break a messy product ask into inputs, outputs, constraints, and edge cases before writing any code.",
        type: "Problem Solving",
        time: "45–60 minutes",
        skills: ["Decomposition", "Edge cases", "Clarity"],
        xp: 80,
        notes: [
          "Do not write production code for this assignment.",
          "Focus on clarity — a mentor must understand your thinking without asking questions.",
          "Use short bullet points over long paragraphs.",
          "Call out assumptions explicitly.",
        ],
        files: ["PROBLEM.md", "README.md"],
        objective:
          "Practice breaking ambiguous requests into a clear problem statement an engineer could implement.",
        instructions:
          "Pick one everyday product scenario (for example: “users want to reset passwords”). Document the problem so another developer could start coding tomorrow.",
        sections: [
          {
            title: "Restate the problem",
            items: [
              "Write the goal in one sentence.",
              "List who the user is and what success looks like.",
              "List what is explicitly out of scope.",
            ],
          },
          {
            title: "Inputs and outputs",
            items: [
              "Define every input the system needs.",
              "Define every output or side effect.",
              "Note which inputs are required vs optional.",
            ],
          },
          {
            title: "Edge cases",
            items: [
              "List at least 6 edge cases (empty, invalid, duplicate, timeout, etc.).",
              "For each edge case, write the expected behavior in one line.",
            ],
          },
        ],
      },
      {
        slug: "thinking-like-a-developer",
        title: "Thinking Like a Developer",
        description:
          "Compare three solution approaches and defend a tradeoff the way engineers do in standups.",
        type: "Developer Mindset",
        time: "45–60 minutes",
        skills: ["Tradeoffs", "Communication", "Prioritization"],
        xp: 80,
        notes: [
          "There is no single correct answer — clarity of reasoning matters most.",
          "Avoid buzzwords; explain tradeoffs in plain language.",
          "Keep the document under two pages.",
        ],
        files: ["TRADEOFFS.md", "README.md"],
        objective:
          "Build the habit of comparing options on correctness, speed, and maintainability before coding.",
        instructions:
          "Choose a simple feature (example: sorting a contact list). Propose three approaches and pick one with a written rationale.",
        sections: [
          {
            title: "Three approaches",
            items: [
              "Describe Approach A, B, and C in 3–5 bullets each.",
              "For each approach, note one strength and one weakness.",
            ],
          },
          {
            title: "Decision",
            items: [
              "Pick one approach for a junior team shipping this week.",
              "Explain why it wins on time-to-ship vs long-term quality.",
              "List what you would improve later if you had more time.",
            ],
          },
          {
            title: "Standup script",
            items: [
              "Write a 60-second update you would say in standup about this decision.",
            ],
          },
        ],
      },
      {
        slug: "algorithm-thinking",
        title: "Algorithm Thinking",
        description:
          "Choose a simple algorithm for a constrained task and explain why it fits.",
        type: "Problem Solving",
        time: "60–75 minutes",
        skills: ["Algorithms", "Complexity intuition", "Step tracing"],
        xp: 100,
        notes: [
          "Prefer simple algorithms you can explain out loud.",
          "Do not copy advanced solutions you cannot defend.",
          "Trace at least one example by hand.",
        ],
        files: ["ALGORITHM.md", "TRACE.md", "README.md"],
        objective:
          "Connect a real constraint (list size, uniqueness, sortedness) to an algorithm choice.",
        instructions:
          "Solve: find whether a list of usernames contains duplicates. Document algorithm choice, complexity intuition, and a hand trace.",
        sections: [
          {
            title: "Algorithm choice",
            items: [
              "State the algorithm in plain steps (not code).",
              "Say whether you need sorting, hashing, or nested loops — and why.",
              "Give a rough sense of how work grows as the list gets longer.",
            ],
          },
          {
            title: "Hand trace",
            items: [
              "Trace your steps on this list: [sam, lee, sam, rio].",
              "Show the state after each major step until you detect the duplicate.",
            ],
          },
          {
            title: "Failure modes",
            items: [
              "What happens with an empty list?",
              "What if every name is unique?",
              "What if names differ only by capitalization?",
            ],
          },
        ],
      },
      {
        slug: "pseudocode-challenge",
        title: "Pseudocode Challenge",
        description:
          "Write interview-ready pseudocode another engineer could implement without guessing.",
        type: "Problem Solving",
        time: "45–60 minutes",
        skills: ["Pseudocode", "Specification", "Reviewability"],
        xp: 100,
        notes: [
          "Pseudocode must be unambiguous — no vague steps like “handle errors somehow”.",
          "Use indentation and named steps.",
          "Do not paste real language syntax unless necessary.",
        ],
        files: ["PSEUDOCODE.md", "README.md"],
        objective:
          "Practice writing specifications that bridge product language and implementation.",
        instructions:
          "Write pseudocode for: validate a signup form (name, email, password) and return field-level errors.",
        sections: [
          {
            title: "Function contract",
            items: [
              "Name the function and list its parameters.",
              "Define the success return shape and the error return shape.",
            ],
          },
          {
            title: "Pseudocode body",
            items: [
              "Validate name, email, and password with explicit rules.",
              "Collect all errors (do not stop at the first failure).",
              "Return a clear result object.",
            ],
          },
          {
            title: "Test cases",
            items: [
              "Provide 4 sample inputs with expected outputs (valid + 3 invalid).",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 2,
    slug: "developer-tooling",
    title: "Developer Tooling",
    displayTitle: "Developer Tooling",
    assignments: [
      {
        slug: "vscode-workspace-setup",
        title: "VS Code Workspace Setup",
        description:
          "Configure VS Code like a professional: extensions, format-on-save, and a clean workspace.",
        type: "Terminal Commands",
        time: "45–60 minutes",
        skills: ["VS Code", "Editor config", "Productivity"],
        xp: 90,
        notes: [
          "Document every setting you change and why.",
          "Prefer project settings over global ones when sharing with a team.",
          "Do not install random unused extensions.",
        ],
        files: ["WORKSPACE.md", "settings.json", "README.md"],
        objective:
          "Build a repeatable editor setup that keeps formatting consistent across machines.",
        instructions:
          "Create a sample project folder and configure VS Code for it. Capture evidence of your setup.",
        sections: [
          {
            title: "Extensions",
            items: [
              "Install at least 4 useful extensions (list name + why).",
              "Disable or avoid extensions that slow the editor for no benefit.",
            ],
          },
          {
            title: "Settings",
            items: [
              "Enable format-on-save.",
              "Set a sensible tab size / indent style.",
              "Include a sample settings.json (or screenshot of settings UI).",
            ],
          },
          {
            title: "Workspace layout",
            items: [
              "Describe your sidebar, terminal, and split-editor habits.",
              "Explain how you open and switch files quickly.",
            ],
          },
        ],
      },
      {
        slug: "git-github-first-repo",
        title: "Git & GitHub First Repo",
        description:
          "Create a GitHub presence with auth, a profile README, and your first public repository.",
        type: "Git Practice",
        time: "60–75 minutes",
        skills: ["Git", "GitHub", "Portfolio"],
        xp: 110,
        notes: [
          "Never commit secrets, tokens, or .env files.",
          "Use clear commit messages.",
          "Your profile README should look professional, not spammy.",
        ],
        files: ["SETUP.md", "README.md"],
        objective:
          "Get a real GitHub workflow working end-to-end from local machine to remote.",
        instructions:
          "Create a public repo, push an initial commit, and write a short profile README.",
        sections: [
          {
            title: "Local Git",
            items: [
              "Initialize a repository and create a meaningful first commit.",
              "Show `git status` / `git log` evidence in SETUP.md.",
            ],
          },
          {
            title: "Remote GitHub",
            items: [
              "Create the remote repository on GitHub.",
              "Push your branch and share the repo URL.",
            ],
          },
          {
            title: "Profile README",
            items: [
              "Add a profile README with who you are, what you’re learning, and links.",
              "Keep it concise (under ~40 lines).",
            ],
          },
        ],
      },
      {
        slug: "branch-commit-pr-workflow",
        title: "Branch → Commit → PR Workflow",
        description:
          "Practice the branch, commit, pull request, and review habits used on real teams.",
        type: "Git Practice",
        time: "75–90 minutes",
        skills: ["Branching", "Pull requests", "Commit hygiene"],
        xp: 130,
        notes: [
          "One PR should solve one focused change.",
          "Write a PR description a reviewer can skim in 30 seconds.",
          "Do not force-push shared branches.",
        ],
        files: ["WORKFLOW.md", "PR_NOTES.md", "README.md"],
        objective:
          "Internalize a safe team Git workflow instead of committing only to main.",
        instructions:
          "In a practice repo, create a feature branch, make 2–3 clean commits, open a PR (or document the PR text if using a solo fork), and summarize the review checklist.",
        sections: [
          {
            title: "Branching",
            items: [
              "Create a branch named like feature/short-description.",
              "Explain when you would branch vs commit directly to main.",
            ],
          },
          {
            title: "Commits",
            items: [
              "Make at least two commits with clear messages.",
              "Avoid “fix” / “update” style messages.",
            ],
          },
          {
            title: "Pull request",
            items: [
              "Write a PR title and description (What / Why / How to test).",
              "List 5 things you check before requesting review.",
            ],
          },
        ],
      },
      {
        slug: "terminal-daily-drivers",
        title: "Terminal Daily Drivers",
        description:
          "Master the everyday terminal commands developers use to navigate, inspect, and manage projects.",
        type: "Terminal Commands",
        time: "45–60 minutes",
        skills: ["Shell", "Navigation", "File ops"],
        xp: 100,
        notes: [
          "Use a real shell (PowerShell, bash, or zsh) — document which one.",
          "Paste commands and outputs; do not invent results.",
          "Prefer safe commands; avoid destructive deletes on important folders.",
        ],
        files: ["COMMANDS.md", "README.md"],
        objective:
          "Become comfortable living in the terminal for everyday project tasks.",
        instructions:
          "Create a practice folder tree and demonstrate navigation, listing, copying, and searching with evidence.",
        sections: [
          {
            title: "Navigation",
            items: [
              "Show how you list files, change directories, and print the current path.",
              "Create a nested folder structure with at least 3 levels.",
            ],
          },
          {
            title: "File operations",
            items: [
              "Create, copy, rename, and move a sample file (document each command).",
              "Show how you read a file’s contents from the terminal.",
            ],
          },
          {
            title: "Search and inspect",
            items: [
              "Search for a string inside files.",
              "Explain one command you use to inspect disk usage or process list (platform-appropriate).",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 3,
    slug: "html",
    title: "HTML",
    displayTitle: "HTML",
    assignments: [
      {
        slug: "personal-portfolio-page",
        title: "Personal Portfolio Page",
        description:
          "Build a semantic personal portfolio homepage a hiring manager could open today.",
        type: "HTML Build",
        time: "60–90 minutes",
        skills: ["Semantics", "Accessibility", "Structure"],
        xp: 120,
        notes: [
          "Use only HTML for this assignment — no CSS frameworks, no JavaScript.",
          "Prefer semantic tags (header, main, section, nav, footer).",
          "Write clean, indented markup.",
          "All images need meaningful alt text.",
        ],
        files: ["index.html", "README.md"],
        objective:
          "Create a complete single-page portfolio structure using semantic HTML only.",
        instructions:
          "Build one index.html portfolio page with introduction, about, skills, projects list, and contact form sections.",
        sections: [
          {
            title: "Document structure",
            items: [
              "Valid HTML5 doctype and lang attribute.",
              "Meaningful <title> and meta description.",
              "Landmarks: header, nav, main, footer.",
            ],
          },
          {
            title: "Content sections",
            items: [
              "Hero with full name, title, and one-line intro.",
              "About Me paragraph (100–150 words).",
              "Skills as an unordered list (at least 5 items).",
              "Projects as an ordered or unordered list with links.",
            ],
          },
          {
            title: "Contact form",
            items: [
              "Name, email, and message fields with matching labels.",
              "Submit button.",
              "Use appropriate input types (email, text, textarea).",
            ],
          },
        ],
      },
      {
        slug: "semantic-blog-article",
        title: "Semantic Blog Article",
        description:
          "Mark up a blog article with landmarks, metadata, and a readable heading hierarchy.",
        type: "HTML Build",
        time: "75–90 minutes",
        skills: ["Article markup", "Landmarks", "SEO basics"],
        xp: 130,
        notes: [
          "HTML only — no CSS frameworks or JavaScript.",
          "Use one h1 and a logical heading ladder (h2/h3).",
          "Wrap the story in <article> with header and footer metadata.",
        ],
        files: ["index.html", "article.html", "README.md"],
        objective:
          "Practice content-first HTML for long-form writing, not marketing pages.",
        instructions:
          "Create a blog index page linking to one full article page about a technical topic you care about.",
        sections: [
          {
            title: "Blog index",
            items: [
              "List at least 3 post previews (title, date, short excerpt).",
              "Each preview links to the article page (one can be real; others may be placeholders).",
            ],
          },
          {
            title: "Article page",
            items: [
              "Use <article>, <header>, <time datetime>, and author byline.",
              "Include at least 400 words of original content with h2/h3 sections.",
              "Add a related-posts or tags list in an <aside> or footer.",
            ],
          },
          {
            title: "Metadata & links",
            items: [
              "Provide a descriptive page title.",
              "Include at least one figure with <figcaption> or an image with alt text.",
              "External links use target=\"_blank\" with rel=\"noopener noreferrer\".",
            ],
          },
        ],
      },
      {
        slug: "resume-website",
        title: "Resume Website",
        description:
          "Create a single-page resume site with experience, education, skills, and contact.",
        type: "HTML Build",
        time: "60–75 minutes",
        skills: ["Resume UX", "Lists", "Tables"],
        xp: 120,
        notes: [
          "HTML only — structure must stand alone without CSS.",
          "Content should look like a real resume (use honest sample data if needed).",
          "Prefer definition lists or tables where they improve scanability.",
        ],
        files: ["index.html", "README.md"],
        objective:
          "Translate a CV into clean semantic HTML a recruiter can skim.",
        instructions:
          "Build a one-page resume with clear sections and professional content hierarchy.",
        sections: [
          {
            title: "Header identity",
            items: [
              "Name, role title, location, email, and GitHub/LinkedIn links.",
            ],
          },
          {
            title: "Experience & education",
            items: [
              "At least 2 experience entries with role, org, dates, and 3 bullets each.",
              "Education section with institution and dates.",
            ],
          },
          {
            title: "Skills & extras",
            items: [
              "Skills grouped (for example: Languages, Tools, Soft skills).",
              "A simple table for certifications or coursework (headers required).",
              "Optional: languages spoken or volunteer work.",
            ],
          },
        ],
      },
      {
        slug: "accessible-registration-form",
        title: "Accessible Registration Form",
        description:
          "Design a production-minded registration form with labels, grouping, and helpful constraints.",
        type: "HTML Build",
        time: "75–90 minutes",
        skills: ["Forms", "Accessibility", "Validation attributes"],
        xp: 150,
        notes: [
          "HTML only — focus on accessible form semantics.",
          "Every control needs a visible label (no placeholder-only labels).",
          "Use fieldset/legend for related groups.",
          "Do not use JavaScript validation for this assignment.",
        ],
        files: ["index.html", "README.md"],
        objective:
          "Ship a registration form that is keyboard-friendly and understandable without CSS magic.",
        instructions:
          "Build a Create Account page form with personal details, credentials, preferences, and consent.",
        sections: [
          {
            title: "Fields",
            items: [
              "Full name, email, password, confirm password.",
              "Country select with at least 5 options.",
              "Newsletter opt-in checkbox and terms acceptance checkbox.",
            ],
          },
          {
            title: "Accessibility",
            items: [
              "Associate every label with its control using for/id.",
              "Group credentials in a fieldset with a legend.",
              "Provide short helper text under password rules.",
            ],
          },
          {
            title: "HTML constraints",
            items: [
              "Use required, minlength, type=\"email\", and autocomplete attributes where appropriate.",
              "Disable submit styling is optional — but the button must be a real submit control.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 4,
    slug: "css",
    title: "CSS",
    displayTitle: "CSS",
    assignments: [
      {
        slug: "design-tokens-profile-card",
        title: "Design Tokens Profile Card",
        description:
          "Style a profile card using CSS variables for color, spacing, and type.",
        type: "CSS Styling",
        time: "60–75 minutes",
        skills: ["CSS variables", "Typography", "Spacing"],
        xp: 120,
        notes: [
          "You may use minimal HTML structure, but all visual design must live in CSS.",
          "Define tokens as :root custom properties.",
          "No CSS frameworks or UI libraries.",
        ],
        files: ["index.html", "styles.css", "README.md"],
        objective:
          "Learn token-driven styling so themes stay consistent and easy to change.",
        instructions:
          "Build a profile card (avatar, name, role, bio, social links) styled entirely with CSS variables.",
        sections: [
          {
            title: "Tokens",
            items: [
              "Define tokens for colors, font sizes, spacing, radius, and shadow.",
              "Use tokens everywhere — avoid hard-coded random values in rules.",
            ],
          },
          {
            title: "Card UI",
            items: [
              "Centered card with avatar, name, role, short bio, and 2–3 links.",
              "Clear visual hierarchy (name stronger than bio).",
            ],
          },
          {
            title: "Theme switch demo",
            items: [
              "Provide a second theme by overriding tokens on a .theme-dark class (toggle can be manual in HTML).",
            ],
          },
        ],
      },
      {
        slug: "responsive-landing-layout",
        title: "Responsive Landing Layout",
        description:
          "Build a responsive landing hero and features grid that holds up on mobile.",
        type: "CSS Styling",
        time: "75–90 minutes",
        skills: ["Flexbox", "Grid", "Media queries"],
        xp: 130,
        notes: [
          "No CSS frameworks.",
          "Mobile-first media queries preferred.",
          "Avoid horizontal scrolling on narrow screens.",
        ],
        files: ["index.html", "styles.css", "README.md"],
        objective:
          "Practice real marketing-page layout skills with Flexbox/Grid and breakpoints.",
        instructions:
          "Create a landing page with nav, hero, 3-feature grid, and footer that reflows on small screens.",
        sections: [
          {
            title: "Hero",
            items: [
              "Headline, supporting text, and primary/secondary CTA buttons.",
              "Layout stacks on mobile and sits side-by-side on desktop if you include a hero visual.",
            ],
          },
          {
            title: "Features grid",
            items: [
              "Exactly 3 feature cards using CSS Grid.",
              "1 column on mobile, 3 columns on desktop.",
            ],
          },
          {
            title: "Responsive polish",
            items: [
              "At least two breakpoints.",
              "Nav remains usable on mobile (simple stacked links are fine).",
            ],
          },
        ],
      },
      {
        slug: "interactive-state-kit",
        title: "Interactive State Kit",
        description:
          "Design buttons, inputs, and alerts with hover, focus, and disabled states.",
        type: "CSS Styling",
        time: "75–90 minutes",
        skills: ["UI states", "Focus rings", "Consistency"],
        xp: 140,
        notes: [
          "Focus styles must be visible — do not remove outlines without a replacement.",
          "Keep a consistent spacing and color language across components.",
          "No JavaScript required; states can be shown via classes.",
        ],
        files: ["index.html", "styles.css", "README.md"],
        objective:
          "Build a small component gallery that proves you understand interactive CSS states.",
        instructions:
          "Create a style guide page showcasing button, input, and alert variants with all key states.",
        sections: [
          {
            title: "Buttons",
            items: [
              "Primary, secondary, and danger variants.",
              "Hover, focus-visible, and disabled styles for each.",
            ],
          },
          {
            title: "Inputs",
            items: [
              "Default, focus, error, and disabled input styles.",
              "Matching label and helper/error text styles.",
            ],
          },
          {
            title: "Alerts",
            items: [
              "Info, success, and error alert boxes with icon-friendly layout (emoji/icon optional).",
            ],
          },
        ],
      },
      {
        slug: "saas-dashboard-shell",
        title: "SaaS Dashboard Shell",
        description:
          "Create a sidebar + topbar + content shell used in SaaS products.",
        type: "UI Clone",
        time: "2–3 hours",
        skills: ["Layout systems", "Responsive shell", "SaaS UI"],
        xp: 180,
        notes: [
          "Focus on layout chrome, not real data features.",
          "Sidebar should collapse or stack on small screens.",
          "No UI libraries.",
        ],
        files: ["index.html", "styles.css", "README.md"],
        objective:
          "Reproduce the structural skeleton of a modern product dashboard with CSS.",
        instructions:
          "Build a dashboard shell with sticky topbar, sidebar navigation, and a main content area containing placeholder widgets.",
        sections: [
          {
            title: "Shell layout",
            items: [
              "Topbar with product name and user avatar placeholder.",
              "Sidebar with at least 5 nav items.",
              "Main content area with a page title and 3 placeholder cards/widgets.",
            ],
          },
          {
            title: "Responsive behavior",
            items: [
              "On narrow screens, sidebar becomes horizontal scroll links or a stacked top menu.",
              "Content cards reflow to a single column.",
            ],
          },
          {
            title: "Visual polish",
            items: [
              "Consistent spacing scale and subtle borders/shadows.",
              "Active nav item visually distinct.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 5,
    slug: "javascript",
    title: "JavaScript",
    displayTitle: "JavaScript",
    assignments: [
      {
        slug: "dom-todo-lab",
        title: "DOM Todo Lab",
        description:
          "Build a todo app with add, complete, delete, and localStorage persistence.",
        type: "JavaScript Logic",
        time: "75–90 minutes",
        skills: ["DOM", "Events", "localStorage"],
        xp: 130,
        notes: [
          "Vanilla JavaScript only — no frameworks.",
          "Persist todos across refresh.",
          "Handle empty input cleanly.",
        ],
        files: ["index.html", "styles.css", "app.js", "README.md"],
        objective:
          "Practice DOM events and browser persistence with a complete mini app.",
        instructions:
          "Ship a todo list where users can add tasks, mark them done, delete them, and reload without losing data.",
        sections: [
          {
            title: "Core CRUD",
            items: [
              "Add a todo from an input + button (Enter key also works).",
              "Toggle completed state.",
              "Delete a todo.",
            ],
          },
          {
            title: "Persistence",
            items: [
              "Save to localStorage after every change.",
              "Restore on page load.",
            ],
          },
          {
            title: "UX details",
            items: [
              "Ignore blank todos.",
              "Show a count of remaining items.",
            ],
          },
        ],
      },
      {
        slug: "form-validation-engine",
        title: "Form Validation Engine",
        description:
          "Validate a form with clear field errors and accessible messaging in JavaScript.",
        type: "JavaScript Logic",
        time: "75–90 minutes",
        skills: ["Validation", "UX", "Accessibility"],
        xp: 140,
        notes: [
          "Validate on submit; optional live validation is a bonus.",
          "Do not rely only on HTML required attributes.",
          "Errors must be tied to fields accessibly.",
        ],
        files: ["index.html", "styles.css", "validate.js", "README.md"],
        objective:
          "Implement client-side validation that feels production-ready.",
        instructions:
          "Build a profile form (name, email, age, website) with JavaScript validation and inline errors.",
        sections: [
          {
            title: "Rules",
            items: [
              "Name: required, min 2 characters.",
              "Email: required, basic email pattern.",
              "Age: required number between 13 and 120.",
              "Website: optional, but if present must start with http:// or https://.",
            ],
          },
          {
            title: "Error UX",
            items: [
              "Show per-field error text.",
              "Prevent submit when invalid.",
              "On success, show a confirmation message and reset or keep values (document choice).",
            ],
          },
          {
            title: "Code quality",
            items: [
              "Keep validation rules in clear functions or a config object.",
              "Avoid alert() popups for field errors.",
            ],
          },
        ],
      },
      {
        slug: "fetch-and-render",
        title: "Fetch and Render",
        description:
          "Call a public API, handle loading and error states, and render results cleanly.",
        type: "JavaScript Logic",
        time: "90–120 minutes",
        skills: ["Fetch", "Async", "UI states"],
        xp: 160,
        notes: [
          "Use fetch + async/await.",
          "Always handle network failures.",
          "Do not block the UI without a loading indicator.",
        ],
        files: ["index.html", "styles.css", "app.js", "README.md"],
        objective:
          "Learn real async UI patterns: loading, success, empty, and error.",
        instructions:
          "Fetch a public API (for example JSONPlaceholder posts or a public users API) and render a searchable list.",
        sections: [
          {
            title: "Fetching",
            items: [
              "Load data on page start or via a Load button.",
              "Show a loading state while the request is in flight.",
              "Show an error state with a retry action on failure.",
            ],
          },
          {
            title: "Rendering",
            items: [
              "Render at least 8 items with title + body/subtitle.",
              "Include an empty state if filters match nothing.",
            ],
          },
          {
            title: "Filter",
            items: [
              "Add a text filter that narrows results client-side.",
            ],
          },
        ],
      },
      {
        slug: "quiz-engine",
        title: "Quiz Engine",
        description:
          "Ship a timed multiple-choice quiz with scoring and a results summary.",
        type: "Mini Projects",
        time: "2 hours",
        skills: ["State", "Timers", "Scoring"],
        xp: 170,
        notes: [
          "Vanilla JS only.",
          "Questions should live in a data array (easy to edit).",
          "Timer must be clear to the user.",
        ],
        files: ["index.html", "styles.css", "quiz.js", "questions.js", "README.md"],
        objective:
          "Build a complete interactive quiz with state transitions and a final score screen.",
        instructions:
          "Create a 5+ question quiz with a countdown timer, one question at a time, and a results summary.",
        sections: [
          {
            title: "Quiz flow",
            items: [
              "Start screen → question screens → results screen.",
              "Only one question visible at a time.",
              "Disable advancing without selecting an answer.",
            ],
          },
          {
            title: "Timer & scoring",
            items: [
              "Countdown timer for the whole quiz or per question (document choice).",
              "Score + percentage on results.",
              "Review list showing correct vs chosen answers.",
            ],
          },
          {
            title: "Content",
            items: [
              "At least 5 multiple-choice questions about JavaScript basics.",
              "Questions stored separately from rendering logic.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 6,
    slug: "react",
    title: "React",
    displayTitle: "React",
    assignments: [
      {
        slug: "component-props-gallery",
        title: "Component & Props Gallery",
        description: "Compose presentational React components with props and clean JSX.",
        type: "UI Clone",
        time: "75–90 minutes",
        skills: ["Components", "Props", "JSX"],
        xp: 140,
        notes: [
          "Use React (Vite or Next is fine) — document how to run.",
          "Keep components small and presentational for this assignment.",
          "No global CSS frameworks required.",
        ],
        files: ["src/App.jsx", "src/components/", "README.md"],
        objective: "Practice component thinking: break UI into reusable pieces driven by props.",
        instructions: "Build a profile dashboard UI from reusable Card, Badge, and UserHeader components.",
        sections: [
          {
            title: "Components",
            items: [
              "UserHeader(name, role, avatarUrl)",
              "Badge(label, tone)",
              "StatCard(label, value)",
              "Compose them in App to show 1 user + 3 stats.",
            ],
          },
          {
            title: "Props discipline",
            items: [
              "No hard-coded user strings inside child components.",
              "Render at least two different users by changing props only.",
            ],
          },
          {
            title: "Quality",
            items: [
              "Meaningful component file names.",
              "README with install/run steps.",
            ],
          },
        ],
      },
      {
        slug: "controlled-form-state",
        title: "Controlled Form State",
        description: "Build controlled inputs with validation and submit UX in React.",
        type: "JavaScript Logic",
        time: "90–120 minutes",
        skills: ["useState", "Forms", "UX"],
        xp: 150,
        notes: [
          "All inputs must be controlled.",
          "Validate before submit.",
          "Keep form state in one place unless you intentionally split it.",
        ],
        files: ["src/App.jsx", "src/ContactForm.jsx", "README.md"],
        objective: "Master controlled components and form state transitions in React.",
        instructions: "Create a contact form with name, email, topic select, and message. Validate and show success state.",
        sections: [
          {
            title: "State",
            items: [
              "Controlled values for every field.",
              "Track touched/errors as needed.",
              "Disable submit while submitting (simulate with setTimeout).",
            ],
          },
          {
            title: "Validation",
            items: [
              "Required fields with clear messages.",
              "Email format check.",
              "Message minimum length 20.",
            ],
          },
          {
            title: "Success UX",
            items: [
              "Show a success panel after submit.",
              "Allow reset / send another.",
            ],
          },
        ],
      },
      {
        slug: "list-fetch-effects",
        title: "Lists, Keys & Effects",
        description: "Render lists correctly and fetch data with useEffect safely.",
        type: "JavaScript Logic",
        time: "90–120 minutes",
        skills: ["Keys", "useEffect", "Fetch"],
        xp: 160,
        notes: [
          "Never use array index as key if the list can reorder/delete.",
          "Handle loading and error states.",
          "Avoid infinite fetch loops.",
        ],
        files: ["src/App.jsx", "src/PostList.jsx", "README.md"],
        objective: "Combine lists + effects into a reliable data-driven React view.",
        instructions: "Fetch posts from a public API and render them with filter + delete-from-UI behavior.",
        sections: [
          {
            title: "Fetching",
            items: [
              "Fetch on mount with useEffect.",
              "Loading and error UI.",
            ],
          },
          {
            title: "Lists",
            items: [
              "Stable unique keys.",
              "Client-side text filter.",
              "Remove item from local state without refetch.",
            ],
          },
          {
            title: "Effect safety",
            items: [
              "Explain in README how you prevented repeated requests.",
            ],
          },
        ],
      },
      {
        slug: "react-router-notes-app",
        title: "React Router Notes App",
        description: "Ship a small multi-route notes app with layout and navigation.",
        type: "Mini Projects",
        time: "2 hours",
        skills: ["Routing", "Layouts", "State"],
        xp: 170,
        notes: [
          "Use React Router (or Next App Router if you prefer — document choice).",
          "Shared layout with nav links.",
          "Keep scope small: list + detail + create.",
        ],
        files: ["src/", "README.md"],
        objective: "Learn multi-page React structure with shared layout and route params.",
        instructions: "Build a notes app with /notes, /notes/:id, and /notes/new routes.",
        sections: [
          {
            title: "Routes",
            items: [
              "List page of notes.",
              "Detail page from URL id.",
              "Create page that adds a note and navigates to detail.",
            ],
          },
          {
            title: "Layout",
            items: [
              "Shared nav with active link styling.",
              "404-style message for unknown note ids.",
            ],
          },
          {
            title: "Data",
            items: [
              "In-memory state or localStorage is fine.",
              "At least create + read working end-to-end.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 7,
    slug: "nextjs",
    title: "Next.js",
    displayTitle: "Next.js",
    assignments: [
      {
        slug: "app-router-basics",
        title: "App Router Basics",
        description: "Create routes, layouts, and navigation with the Next.js App Router.",
        type: "Mini Projects",
        time: "90–120 minutes",
        skills: ["App Router", "Layouts", "Navigation"],
        xp: 150,
        notes: [
          "Use the App Router (app/ directory).",
          "Keep styling simple.",
          "Document Node version and run scripts.",
        ],
        files: ["app/", "README.md"],
        objective: "Get comfortable with Next.js file-based routing and nested layouts.",
        instructions: "Create a small marketing site with Home, About, and Blog index routes sharing a root layout.",
        sections: [
          {
            title: "Routes",
            items: [
              "app/page.tsx — Home",
              "app/about/page.tsx — About",
              "app/blog/page.tsx — Blog index with 3 placeholder posts",
            ],
          },
          {
            title: "Layout & nav",
            items: [
              "Root layout with header nav links.",
              "Active-looking nav (aria-current or style).",
            ],
          },
          {
            title: "Polish",
            items: [
              "Unique titles per page via metadata export.",
            ],
          },
        ],
      },
      {
        slug: "server-vs-client-boundaries",
        title: "Server vs Client Boundaries",
        description: "Choose server/client component boundaries deliberately for a simple page.",
        type: "Debugging",
        time: "90–120 minutes",
        skills: ["RSC", "Boundaries", "Performance mindset"],
        xp: 160,
        notes: [
          "Only add \"use client\" where interactivity requires it.",
          "Explain every client component in README.",
          "Do not make the whole app a client component.",
        ],
        files: ["app/", "README.md"],
        objective: "Understand when React Server Components help and when client components are required.",
        instructions: "Build a page with server-rendered content and a small client interactive widget (tabs or counter).",
        sections: [
          {
            title: "Server content",
            items: [
              "A page that fetches or hardcodes content on the server.",
              "No unnecessary client JS for static text.",
            ],
          },
          {
            title: "Client island",
            items: [
              "One interactive client component (tabs/counter/theme toggle).",
              "Imported into a server page.",
            ],
          },
          {
            title: "Write-up",
            items: [
              "In README, list each component and mark server vs client with reasons.",
            ],
          },
        ],
      },
      {
        slug: "next-data-fetching",
        title: "Next Data Fetching",
        description: "Fetch data in server components with loading and error UI.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Fetching", "Loading UI", "Error UI"],
        xp: 170,
        notes: [
          "Prefer fetching in Server Components for this assignment.",
          "Add loading.tsx and error.tsx for the route.",
          "Use a real public API or local mock route.",
        ],
        files: ["app/", "README.md"],
        objective: "Practice Next.js data UX: streaming-friendly loading and recoverable errors.",
        instructions: "Create a /explore route that loads a list from an API and supports a detail page.",
        sections: [
          {
            title: "List route",
            items: [
              "Server-fetch a list of items.",
              "loading.tsx skeleton while loading.",
            ],
          },
          {
            title: "Detail route",
            items: [
              "Dynamic [id] page fetching one item.",
              "Not-found UI for missing ids.",
            ],
          },
          {
            title: "Errors",
            items: [
              "error.tsx with retry.",
              "README explains how to demo loading/error.",
            ],
          },
        ],
      },
      {
        slug: "route-handler-api",
        title: "Route Handler API",
        description: "Build a route handler that validates input and returns JSON.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Route handlers", "Validation", "JSON APIs"],
        xp: 180,
        notes: [
          "Implement POST (and optional GET) in app/api/...",
          "Return correct status codes.",
          "No database required — memory/file is fine.",
        ],
        files: ["app/api/", "README.md"],
        objective: "Learn Next.js route handlers as tiny backend endpoints.",
        instructions: "Create /api/feedback that accepts JSON feedback messages and lists them.",
        sections: [
          {
            title: "POST /api/feedback",
            items: [
              "Validate name and message (min lengths).",
              "Return 400 with error payload when invalid.",
              "Return 201 with saved item when valid.",
            ],
          },
          {
            title: "GET /api/feedback",
            items: [
              "Return the list of feedback items.",
            ],
          },
          {
            title: "Manual test notes",
            items: [
              "Include example curl/fetch calls in README.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 8,
    slug: "typescript",
    title: "TypeScript",
    displayTitle: "TypeScript",
    assignments: [
      {
        slug: "types-fundamentals",
        title: "TypeScript Types Fundamentals",
        description: "Model domain data with interfaces, unions, and narrowing.",
        type: "Problem Solving",
        time: "75–90 minutes",
        skills: ["Interfaces", "Unions", "Narrowing"],
        xp: 140,
        notes: [
          "Enable strict TypeScript.",
          "Avoid any.",
          "Show narrowing with type guards or discriminated unions.",
        ],
        files: ["src/models.ts", "src/main.ts", "README.md"],
        objective: "Get fluent modeling everyday domain objects with TypeScript.",
        instructions: "Model a Task tracker domain (Task, Priority, Status) and write functions that narrow unions safely.",
        sections: [
          {
            title: "Models",
            items: [
              "Task interface with id, title, status, priority, createdAt.",
              "Status and Priority as union types.",
            ],
          },
          {
            title: "Functions",
            items: [
              "createTask, completeTask, filterByStatus with correct types.",
              "A function that handles a Result<T> style union (success | error).",
            ],
          },
          {
            title: "Demo",
            items: [
              "main.ts runs a small demo printed to console.",
            ],
          },
        ],
      },
      {
        slug: "typing-api-client",
        title: "Typing an API Client",
        description: "Type request/response contracts for a small API client.",
        type: "Backend APIs",
        time: "90–120 minutes",
        skills: ["API types", "Generics", "Errors"],
        xp: 160,
        notes: [
          "Define types for DTOs separately from runtime fetch code.",
          "Handle non-OK responses with typed errors.",
          "No any.",
        ],
        files: ["src/types.ts", "src/client.ts", "src/demo.ts", "README.md"],
        objective: "Make API calls safer by typing contracts at the boundary.",
        instructions: "Build a typed client for a public posts API with getPosts and getPost(id).",
        sections: [
          {
            title: "Contracts",
            items: [
              "Post type matching API fields you use.",
              "ApiError type with status + message.",
            ],
          },
          {
            title: "Client",
            items: [
              "getPosts(): Promise<Post[]>",
              "getPost(id): Promise<Post>",
              "Throw or return typed error on failure — document choice.",
            ],
          },
          {
            title: "Demo",
            items: [
              "demo.ts calls both methods and logs results.",
            ],
          },
        ],
      },
      {
        slug: "generic-utilities",
        title: "Generic Utility Types Lab",
        description: "Build reusable generics for Result-style helpers and collections.",
        type: "Problem Solving",
        time: "2 hours",
        skills: ["Generics", "Utilities", "DX"],
        xp: 180,
        notes: [
          "Prefer simple generics you can explain.",
          "Include usage examples.",
          "Avoid over-engineering.",
        ],
        files: ["src/result.ts", "src/utils.ts", "src/examples.ts", "README.md"],
        objective: "Create small typed utilities that improve day-to-day TypeScript DX.",
        instructions: "Implement Result<T>, unwrap helpers, and a keyed groupBy utility with tests/examples.",
        sections: [
          {
            title: "Result type",
            items: [
              "Ok/Err discriminated union.",
              "ok() and err() constructors.",
              "mapResult helper.",
            ],
          },
          {
            title: "Collection util",
            items: [
              "groupBy<T>(items, keyFn) with correct return type.",
            ],
          },
          {
            title: "Examples",
            items: [
              "examples.ts shows both utilities with real sample data.",
            ],
          },
        ],
      },
      {
        slug: "ts-react-props-contracts",
        title: "Typed React Props Contracts",
        description: "Type React component props strictly, including optional variants and event handlers.",
        type: "Mini Projects",
        time: "90–120 minutes",
        skills: ["React + TS", "Props", "Events"],
        xp: 170,
        notes: [
          "Use .tsx files.",
          "No any on props or events.",
          "Export prop types for reuse.",
        ],
        files: ["src/components/", "README.md"],
        objective: "Connect TypeScript to UI components the way production React teams do.",
        instructions: "Build Button, Modal, and TextField components with strict props and a demo page.",
        sections: [
          {
            title: "Button",
            items: [
              "variant and size unions.",
              "onClick typed.",
              "disabled optional boolean.",
            ],
          },
          {
            title: "TextField",
            items: [
              "value, onChange, label, errorMessage props.",
            ],
          },
          {
            title: "Modal",
            items: [
              "open boolean, onClose, title, children.",
              "Demo wires all three components together.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 9,
    slug: "apis-and-services",
    title: "APIs & Services",
    displayTitle: "Backend — APIs",
    assignments: [
      {
        slug: "rest-api-design-workshop",
        title: "REST API Design Workshop",
        description: "Design a clean, resource-oriented REST API for a bookmarks service — verbs, routes, status codes, and pagination — before writing any implementation.",
        type: "Problem Solving",
        time: "60–75 minutes",
        skills: ["REST design", "HTTP semantics", "API contracts"],
        xp: 110,
        notes: [
          "This assignment is a design document — no server code required.",
          "Use correct HTTP verbs and status codes throughout.",
          "Prefer nouns for resource paths, not verbs.",
        ],
        files: ["API_DESIGN.md", "README.md"],
        objective: "Practice designing a REST API contract that a backend team could implement without follow-up questions.",
        instructions: "Design the full REST API for a Bookmarks service: users save, tag, list, and delete bookmarked links.",
        sections: [
          {
            title: "Resources & routes",
            items: [
              "List every resource and its base route (e.g. /bookmarks).",
              "Define GET/POST/PATCH/DELETE routes with correct verbs.",
              "Show one nested route for tags on a bookmark.",
            ],
          },
          {
            title: "Request & response shapes",
            items: [
              "Show a sample JSON request body for creating a bookmark.",
              "Show a sample JSON response including id, createdAt, and tags.",
              "Define pagination query params (page/limit or cursor) and response shape.",
            ],
          },
          {
            title: "Status codes & errors",
            items: [
              "List status codes used for success, validation error, not found, and conflict.",
              "Show one example error response body shape.",
            ],
          },
        ],
      },
      {
        slug: "bookmarks-crud-api",
        title: "Bookmarks CRUD API",
        description: "Implement a working CRUD API for bookmarks with an Express (or similar) server and in-memory storage.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Express", "CRUD", "Routing"],
        xp: 170,
        notes: [
          "Node + Express (or Fastify) is expected — document how to run.",
          "In-memory array storage is fine; no database needed.",
          "Return proper status codes for every route.",
        ],
        files: ["server.js", "routes/bookmarks.js", "README.md"],
        objective: "Ship a real, runnable CRUD API end-to-end, not just a design doc.",
        instructions: "Implement GET/POST/PATCH/DELETE for /bookmarks with validation and in-memory persistence.",
        sections: [
          {
            title: "Routes",
            items: [
              "GET /bookmarks — list with optional ?tag= filter.",
              "POST /bookmarks — create with url and title (validate both).",
              "PATCH /bookmarks/:id — update title or tags.",
              "DELETE /bookmarks/:id — remove and return 204.",
            ],
          },
          {
            title: "Validation",
            items: [
              "Reject missing/invalid url with 400 and a clear error body.",
              "Return 404 for unknown ids on PATCH/DELETE/GET-by-id.",
            ],
          },
          {
            title: "Manual testing",
            items: [
              "Include curl or REST client examples for every route in README.",
            ],
          },
        ],
      },
      {
        slug: "debugging-a-broken-api",
        title: "Debugging a Broken Feedback API",
        description: "Diagnose and fix a feedback API with intentional validation, error-handling, and status-code bugs.",
        type: "Debugging",
        time: "90 minutes",
        skills: ["Debugging", "Validation", "Error handling"],
        xp: 150,
        notes: [
          "Start from a small broken Express app you write yourself (recreate a buggy feedback API) or use one you built earlier.",
          "Document each bug found and the fix.",
          "Add at least one regression test/manual check per bug.",
        ],
        files: ["server.js", "BUGS.md", "README.md"],
        objective: "Practice methodically finding and fixing real API bugs instead of just adding new features.",
        instructions: "Build (or reuse) a small /feedback API with at least 4 seeded bugs (wrong status codes, missing validation, unhandled JSON parse errors, inconsistent error shape), then find and fix them.",
        sections: [
          {
            title: "Bug hunt",
            items: [
              "List each bug: what happened, root cause, and how you found it.",
              "Cover at least: a wrong status code, a missing validation check, and an unhandled error case.",
            ],
          },
          {
            title: "Fixes",
            items: [
              "Fix each bug with minimal, targeted changes.",
              "Add a consistent error response shape across all routes.",
            ],
          },
          {
            title: "Verification",
            items: [
              "Show a before/after request+response example for each bug.",
            ],
          },
        ],
      },
      {
        slug: "third-party-api-integration",
        title: "Integrating a Third-Party API",
        description: "Wrap a public third-party API behind your own backend endpoint with caching and rate-limit handling.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Server-side fetch", "Caching", "Rate limits"],
        xp: 180,
        notes: [
          "Call the third-party API only from the server, never directly from the browser.",
          "Handle the third-party API being slow, down, or rate-limited.",
          "Do not commit API keys — use environment variables.",
        ],
        files: ["server.js", "services/weatherClient.js", "README.md"],
        objective: "Learn to build a resilient backend proxy around an external API instead of calling it blindly.",
        instructions: "Build a GET /weather?city=... endpoint that calls a public weather (or similar) API, caches results briefly, and degrades gracefully on failure.",
        sections: [
          {
            title: "Proxy endpoint",
            items: [
              "GET /weather?city= validates the city param.",
              "Calls the third-party API server-side using an API key from .env.",
            ],
          },
          {
            title: "Caching & resilience",
            items: [
              "Cache successful responses per city for a short TTL (e.g. 5 minutes) in memory.",
              "Return a clear error (with status code) if the upstream API fails or times out.",
            ],
          },
          {
            title: "Documentation",
            items: [
              "README documents required env vars and how to get an API key.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 10,
    slug: "auth-and-security",
    title: "Auth & Security",
    displayTitle: "Backend — Auth",
    assignments: [
      {
        slug: "password-auth-from-scratch",
        title: "Password Auth From Scratch",
        description: "Implement signup and login with properly hashed passwords and clear validation errors.",
        type: "Backend APIs",
        time: "90–120 minutes",
        skills: ["Hashing", "Signup/login", "Validation"],
        xp: 160,
        notes: [
          "Never store plaintext passwords — use bcrypt or an equivalent hashing library.",
          "Do not leak whether an email exists on failed login (generic error message).",
          "In-memory or file-based user store is fine.",
        ],
        files: ["server.js", "auth/users.js", "README.md"],
        objective: "Understand what actually happens under the hood in a signup/login flow.",
        instructions: "Build POST /signup and POST /login for an app's users, using hashed passwords and sane validation.",
        sections: [
          {
            title: "Signup",
            items: [
              "Validate email format and password length (min 8).",
              "Reject duplicate emails with 409.",
              "Hash the password before storing — never store it raw.",
            ],
          },
          {
            title: "Login",
            items: [
              "Compare submitted password against the stored hash.",
              "Return a generic 401 for both wrong email and wrong password.",
            ],
          },
          {
            title: "Security notes",
            items: [
              "README explains, in your own words, why passwords are hashed and salted.",
            ],
          },
        ],
      },
      {
        slug: "jwt-token-auth-middleware",
        title: "JWT Token Auth Middleware",
        description: "Issue signed JWTs on login and build middleware that protects routes using them.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["JWT", "Middleware", "Stateless auth"],
        xp: 170,
        notes: [
          "Sign tokens with a secret from an environment variable.",
          "Set a reasonable expiry (e.g. 1 hour) on tokens.",
          "Never put sensitive data (like a password) inside the token payload.",
        ],
        files: ["server.js", "middleware/requireAuth.js", "README.md"],
        objective: "Learn stateless authentication with JWTs the way many production APIs implement it.",
        instructions: "Issue a JWT on login and write middleware that rejects requests to /me without a valid, unexpired token.",
        sections: [
          {
            title: "Issuing tokens",
            items: [
              "On successful login, sign a JWT containing user id and email only.",
              "Return the token in the login response body.",
            ],
          },
          {
            title: "Middleware",
            items: [
              "requireAuth reads the Authorization: Bearer header.",
              "Returns 401 for missing, malformed, or expired tokens.",
              "Attaches the decoded user to the request for downstream handlers.",
            ],
          },
          {
            title: "Protected route",
            items: [
              "GET /me returns the current user's data only when authenticated.",
            ],
          },
        ],
      },
      {
        slug: "role-based-access-control",
        title: "Role-Based Access Control",
        description: "Add roles (admin/member) and lock down routes so only the right role can access them.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["RBAC", "Authorization", "Middleware"],
        xp: 180,
        notes: [
          "Build on top of an existing auth/JWT setup (reuse from a prior assignment or a fresh minimal one).",
          "Authorization checks happen server-side only — never trust the client.",
          "Return 403 (not 401) when a valid user lacks permission.",
        ],
        files: ["server.js", "middleware/requireRole.js", "README.md"],
        objective: "Practice layering authorization on top of authentication in a small API.",
        instructions: "Add a role field to users and protect an admin-only endpoint for managing a list of products.",
        sections: [
          {
            title: "Roles",
            items: [
              "Users have a role of \"member\" or \"admin\".",
              "Seed at least one admin and one member user for testing.",
            ],
          },
          {
            title: "Authorization middleware",
            items: [
              "requireRole(\"admin\") rejects non-admins with 403.",
              "DELETE /products/:id is admin-only; GET /products is open to any authenticated user.",
            ],
          },
          {
            title: "Verification",
            items: [
              "Document, with example requests, the 401 vs 403 vs 200 cases.",
            ],
          },
        ],
      },
      {
        slug: "web-vulnerability-audit",
        title: "Web Vulnerability Audit",
        description: "Find and fix common web vulnerabilities (XSS, injection, weak validation) in a small sample app.",
        type: "Debugging",
        time: "2 hours",
        skills: ["Security review", "XSS", "Input sanitization"],
        xp: 190,
        notes: [
          "Use a small app you already built (or a minimal new one) as the audit target.",
          "Do not just patch symptoms — explain the underlying vulnerability class.",
          "This assignment is about finding real classes of bugs, not memorizing OWASP terms.",
        ],
        files: ["AUDIT.md", "README.md"],
        objective: "Learn to think like an attacker briefly, then fix what you find like a defender.",
        instructions: "Audit a small app (a form + API you control) for at least 4 vulnerabilities across categories like unescaped output, missing input validation, and unsafe defaults, then fix each.",
        sections: [
          {
            title: "Findings",
            items: [
              "For each vulnerability: what it is, how it could be exploited, and its severity (low/med/high).",
              "Cover at least one client-side issue (e.g. rendering untrusted input) and one server-side issue (e.g. missing validation).",
            ],
          },
          {
            title: "Fixes",
            items: [
              "Show the exact before/after code for each fix.",
              "Explain why the fix closes the vulnerability, not just hides it.",
            ],
          },
          {
            title: "Prevention checklist",
            items: [
              "Write a 5-item checklist you will apply to future projects.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 11,
    slug: "relational-databases",
    title: "Relational Databases",
    displayTitle: "Databases",
    assignments: [
      {
        slug: "sql-query-drills",
        title: "SQL Query Drills",
        description: "Write SELECT, JOIN, GROUP BY, and subquery queries against a sample orders schema.",
        type: "Database Design",
        time: "75–90 minutes",
        skills: ["SQL", "Joins", "Aggregation"],
        xp: 130,
        notes: [
          "Use SQLite, Postgres, or any SQL engine you can run locally.",
          "Include the schema and seed data you used.",
          "Paste actual query output, not guessed results.",
        ],
        files: ["schema.sql", "seed.sql", "queries.sql", "README.md"],
        objective: "Get comfortable writing everyday analytical SQL against a normalized schema.",
        instructions: "Create customers, orders, and order_items tables with sample data, then answer 6 questions using SQL.",
        sections: [
          {
            title: "Schema & seed",
            items: [
              "Create the three tables with appropriate keys and foreign keys.",
              "Seed at least 5 customers and 10 orders with line items.",
            ],
          },
          {
            title: "Queries",
            items: [
              "Total spend per customer, highest first.",
              "Orders with more than 2 line items.",
              "Customers who have never placed an order (use a JOIN or subquery).",
              "Monthly order count using GROUP BY.",
            ],
          },
          {
            title: "Output",
            items: [
              "Paste the real output of each query in queries.sql as comments.",
            ],
          },
        ],
      },
      {
        slug: "schema-design-blog-platform",
        title: "Schema Design for a Blog Platform",
        description: "Design a normalized relational schema for a multi-author blog with posts, comments, and tags.",
        type: "Database Design",
        time: "90 minutes",
        skills: ["Normalization", "Keys", "DDL"],
        xp: 150,
        notes: [
          "Aim for at least 3NF unless you have a documented reason not to.",
          "Every table needs a primary key; every relationship needs a foreign key.",
          "Write real CREATE TABLE statements, not just a diagram.",
        ],
        files: ["SCHEMA.md", "schema.sql", "README.md"],
        objective: "Practice translating a product domain into a clean, normalized relational schema.",
        instructions: "Design tables for authors, posts, comments, tags, and post_tags for a blogging platform.",
        sections: [
          {
            title: "Entities & relationships",
            items: [
              "One author has many posts; one post has many comments.",
              "Tags are many-to-many with posts via a join table.",
            ],
          },
          {
            title: "DDL",
            items: [
              "Write CREATE TABLE statements with primary/foreign keys and NOT NULL where sensible.",
              "Add a unique constraint where duplicates would be wrong (e.g. tag name).",
            ],
          },
          {
            title: "Design notes",
            items: [
              "Explain one normalization decision you made and why.",
            ],
          },
        ],
      },
      {
        slug: "connecting-api-to-postgres",
        title: "Connecting an API to Postgres",
        description: "Wire a small Node API to a real Postgres database using a client or lightweight ORM.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Postgres", "SQL client/ORM", "CRUD"],
        xp: 180,
        notes: [
          "Use pg, Prisma, or Drizzle — document your choice.",
          "Never build SQL strings by concatenating user input — use parameterized queries.",
          "Include setup steps for running Postgres locally (or note a hosted free-tier option).",
        ],
        files: ["server.js", "db/client.js", "README.md"],
        objective: "Move from designing schemas on paper to querying a real database from application code.",
        instructions: "Build a CRUD API for tasks backed by a real Postgres table, with parameterized queries.",
        sections: [
          {
            title: "Setup",
            items: [
              "Provide the CREATE TABLE for tasks.",
              "Document DB connection config via environment variables.",
            ],
          },
          {
            title: "CRUD routes",
            items: [
              "GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id all hit real SQL.",
              "Use parameterized queries everywhere (no string concatenation of user input).",
            ],
          },
          {
            title: "Verification",
            items: [
              "Show example requests and the resulting DB rows.",
            ],
          },
        ],
      },
      {
        slug: "indexing-and-query-performance",
        title: "Indexing & Query Performance",
        description: "Measure a slow query, add the right index, and prove the improvement with EXPLAIN.",
        type: "Database Design",
        time: "90 minutes",
        skills: ["Indexes", "EXPLAIN", "Performance"],
        xp: 170,
        notes: [
          "Use a table with at least a few thousand seeded rows so timing differences are visible.",
          "Use EXPLAIN (or EXPLAIN ANALYZE) before and after adding the index.",
          "Do not index every column — justify the one(s) you choose.",
        ],
        files: ["PERF.md", "queries.sql", "README.md"],
        objective: "Build intuition for how indexes change query plans and real-world performance.",
        instructions: "Seed a large orders table, find a slow filtered/sorted query, add an index, and document the before/after.",
        sections: [
          {
            title: "Baseline",
            items: [
              "Seed at least 5,000 rows.",
              "Run EXPLAIN on a query filtering/sorting by an unindexed column; record the plan and timing.",
            ],
          },
          {
            title: "Index & recheck",
            items: [
              "Add a targeted index on the filtered/sorted column(s).",
              "Re-run EXPLAIN and compare the plan and timing.",
            ],
          },
          {
            title: "Write-up",
            items: [
              "Explain, in plain language, why the index helped (or didn't).",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 12,
    slug: "data-modeling",
    title: "Data Modeling",
    displayTitle: "Data Modeling",
    assignments: [
      {
        slug: "erd-workshop-ecommerce",
        title: "ERD Workshop: E-Commerce Domain",
        description: "Draw an entity-relationship diagram for products, categories, carts, and orders.",
        type: "Database Design",
        time: "75 minutes",
        skills: ["ERD", "Relationships", "Cardinality"],
        xp: 130,
        notes: [
          "A hand-drawn or tool-made diagram is fine — clarity matters more than polish.",
          "Label cardinality on every relationship (1-1, 1-many, many-many).",
          "Do not model attributes you can't justify needing.",
        ],
        files: ["ERD.png", "ERD_NOTES.md", "README.md"],
        objective: "Practice modeling a realistic multi-entity domain visually before writing any SQL.",
        instructions: "Model customers, products, categories, carts, cart_items, orders, and order_items with an ERD.",
        sections: [
          {
            title: "Entities",
            items: [
              "List every entity with 4–6 key attributes each.",
              "Mark the primary key of each entity.",
            ],
          },
          {
            title: "Relationships",
            items: [
              "Draw and label every relationship with correct cardinality.",
              "Identify at least one many-to-many relationship and its join entity.",
            ],
          },
          {
            title: "Assumptions",
            items: [
              "Document 3 assumptions you made about the domain.",
            ],
          },
        ],
      },
      {
        slug: "normalization-practice-spreadsheet",
        title: "Normalization Practice: Messy Spreadsheet",
        description: "Take a flat, repetitive spreadsheet of orders and normalize it to 3NF.",
        type: "Database Design",
        time: "90 minutes",
        skills: ["1NF/2NF/3NF", "Redundancy removal", "Keys"],
        xp: 150,
        notes: [
          "Start from a genuinely messy single flat table with repeated customer/product info per row.",
          "Show your work at each normal form step — don't jump straight to the final schema.",
          "Every new table needs a clear primary key.",
        ],
        files: ["MESSY_DATA.csv", "NORMALIZATION.md", "README.md"],
        objective: "Understand why normalization exists by removing redundancy from a real messy dataset step by step.",
        instructions: "Create a 15+ row flat orders spreadsheet (customer name/email repeated per row, product name/price repeated per row), then normalize it to 3NF.",
        sections: [
          {
            title: "Starting data",
            items: [
              "Provide the flat spreadsheet with obvious repeated data across rows.",
              "Point out at least 3 concrete redundancy/anomaly problems in it.",
            ],
          },
          {
            title: "Normalization steps",
            items: [
              "Show the 1NF, 2NF, and 3NF versions with brief explanations of what changed at each step.",
            ],
          },
          {
            title: "Final schema",
            items: [
              "List the final tables with primary/foreign keys.",
            ],
          },
        ],
      },
      {
        slug: "modeling-many-to-many-relationships",
        title: "Modeling Many-to-Many Relationships",
        description: "Implement join tables for students/courses and authors/books with real sample data.",
        type: "Database Design",
        time: "90 minutes",
        skills: ["Join tables", "Composite keys", "Data integrity"],
        xp: 160,
        notes: [
          "Use real SQL DDL, not just a diagram, for this one.",
          "Join tables should have a composite key or their own surrogate key — pick one and justify it.",
          "Seed enough data to demonstrate the many-to-many pattern clearly.",
        ],
        files: ["schema.sql", "seed.sql", "README.md"],
        objective: "Get hands-on with the join-table pattern that powers most many-to-many relationships.",
        instructions: "Model students↔courses (enrollments) and authors↔books (authorship) with join tables and seed data.",
        sections: [
          {
            title: "Students & courses",
            items: [
              "students, courses, and enrollments tables.",
              "Seed at least 4 students and 3 courses with overlapping enrollments.",
            ],
          },
          {
            title: "Authors & books",
            items: [
              "authors, books, and book_authors tables (supporting co-authored books).",
              "Seed at least one book with two authors.",
            ],
          },
          {
            title: "Queries",
            items: [
              "Write a query listing each student with their enrolled course names.",
              "Write a query listing each book with a comma-joined list of author names.",
            ],
          },
        ],
      },
      {
        slug: "relational-vs-document-modeling",
        title: "Relational vs Document Modeling",
        description: "Model the same small domain as relational tables and as NoSQL documents, then compare tradeoffs.",
        type: "System Design",
        time: "90 minutes",
        skills: ["NoSQL modeling", "Denormalization", "Tradeoff analysis"],
        xp: 170,
        notes: [
          "You do not need to run a real NoSQL database — JSON document shapes are enough.",
          "Be specific about tradeoffs; avoid generic \"NoSQL is more flexible\" statements.",
          "Use the same domain (e.g. a blog with authors/posts/comments) for both models.",
        ],
        files: ["RELATIONAL.sql", "DOCUMENTS.json", "COMPARISON.md", "README.md"],
        objective: "Build judgment for when to normalize into tables vs embed/denormalize into documents.",
        instructions: "Model a small blog domain (authors, posts, comments) both as normalized SQL tables and as embedded JSON documents, then compare.",
        sections: [
          {
            title: "Relational model",
            items: [
              "Provide table DDL with foreign keys for authors/posts/comments.",
            ],
          },
          {
            title: "Document model",
            items: [
              "Provide sample JSON documents where comments are embedded inside posts.",
              "Decide whether author info is embedded or referenced, and justify it.",
            ],
          },
          {
            title: "Comparison",
            items: [
              "Compare both for: read performance, write complexity, and consistency risk.",
              "State which model you'd pick for this specific domain and why.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 13,
    slug: "deployment-essentials",
    title: "Deployment Essentials",
    displayTitle: "Deployment",
    assignments: [
      {
        slug: "environment-config-and-secrets",
        title: "Environment Config & Secrets Hygiene",
        description: "Set up separate dev/production config with environment variables and no leaked secrets.",
        type: "Terminal Commands",
        time: "60 minutes",
        skills: [".env management", "Config separation", "Secret hygiene"],
        xp: 110,
        notes: [
          "Never commit a real .env file — commit a .env.example instead.",
          "Config values (API URLs, keys) must come from environment variables, not hard-coded strings.",
          "Use an existing small project of yours as the target for this assignment.",
        ],
        files: [".env.example", "CONFIG.md", "README.md"],
        objective: "Build the habit of separating config/secrets from code before deploying anything.",
        instructions: "Audit a small project, move all hard-coded config/secrets into environment variables, and document dev vs production values.",
        sections: [
          {
            title: "Audit",
            items: [
              "List every hard-coded value that should be config (API keys, base URLs, ports).",
            ],
          },
          {
            title: "Environment variables",
            items: [
              "Move each value into process.env / import.meta.env as appropriate.",
              "Provide a .env.example with placeholder values (no real secrets).",
            ],
          },
          {
            title: "Dev vs production",
            items: [
              "Document which values differ between local dev and production.",
              "Confirm .env is in .gitignore.",
            ],
          },
        ],
      },
      {
        slug: "deploying-a-frontend-app",
        title: "Deploying a Frontend App to Production",
        description: "Ship a static or frontend app to a real hosting provider with a working live URL.",
        type: "Mini Projects",
        time: "60–75 minutes",
        skills: ["Static hosting", "Build pipelines", "Live deploys"],
        xp: 130,
        notes: [
          "Use Vercel, Netlify, or GitHub Pages — document your choice and steps.",
          "The final deliverable is a working public URL, not just local instructions.",
          "Document how a rebuild/redeploy happens after a code change.",
        ],
        files: ["DEPLOY.md", "README.md"],
        objective: "Get a real project live on the internet, not just running on localhost.",
        instructions: "Take an existing frontend project (from an earlier module) and deploy it to a hosting provider with a public URL.",
        sections: [
          {
            title: "Build & deploy",
            items: [
              "Document the exact build command and output directory used.",
              "Connect the project to the hosting provider and trigger a deploy.",
            ],
          },
          {
            title: "Verification",
            items: [
              "Provide the live public URL.",
              "Confirm the deployed site matches local behavior (note any differences).",
            ],
          },
          {
            title: "Redeploy flow",
            items: [
              "Make one small change, push it, and document how the live site updates.",
            ],
          },
        ],
      },
      {
        slug: "deploying-a-node-api",
        title: "Deploying a Node API to a Real Host",
        description: "Deploy a small Node/Express API to a real hosting provider with environment variables configured.",
        type: "Mini Projects",
        time: "90 minutes",
        skills: ["Backend hosting", "Process management", "Env config in prod"],
        xp: 150,
        notes: [
          "Use Render, Railway, Fly.io, or similar — document your choice.",
          "Configure environment variables through the host's dashboard, not hard-coded values.",
          "Confirm the API works from an external client, not just localhost.",
        ],
        files: ["DEPLOY.md", "README.md"],
        objective: "Move a backend API from your machine to a real running production instance.",
        instructions: "Deploy an existing small API (from an earlier module) to a hosting provider with proper start command and env vars.",
        sections: [
          {
            title: "Deployment setup",
            items: [
              "Document the start command and Node version used.",
              "Configure required environment variables on the host.",
            ],
          },
          {
            title: "Live verification",
            items: [
              "Hit at least 2 endpoints on the deployed URL and paste real responses.",
            ],
          },
          {
            title: "Operational notes",
            items: [
              "Document how you would view logs or restart the service if it crashed.",
            ],
          },
        ],
      },
      {
        slug: "domains-https-and-monitoring",
        title: "Custom Domains, HTTPS & Uptime Monitoring",
        description: "Point a domain (or subdomain) at a deployed app, confirm HTTPS, and add basic uptime monitoring.",
        type: "Debugging",
        time: "75 minutes",
        skills: ["DNS", "HTTPS", "Monitoring basics"],
        xp: 160,
        notes: [
          "A free subdomain (e.g. from Vercel/Netlify) is fine if you don't own a domain.",
          "Confirm HTTPS is enforced, not just available.",
          "Use a free uptime monitor (e.g. UptimeRobot or similar) — document setup, not code.",
        ],
        files: ["DOMAIN_SETUP.md", "README.md"],
        objective: "Understand the last mile of shipping: domains, TLS, and knowing when something breaks in production.",
        instructions: "Attach a domain/subdomain to a deployed app, verify HTTPS, and configure an uptime check with alerting.",
        sections: [
          {
            title: "Domain & HTTPS",
            items: [
              "Document the DNS record(s) added (or the platform-provided domain used).",
              "Confirm HTTP requests redirect to HTTPS.",
            ],
          },
          {
            title: "Monitoring",
            items: [
              "Set up an uptime check hitting the live URL on an interval.",
              "Configure at least one alert channel (email is fine).",
            ],
          },
          {
            title: "Incident drill",
            items: [
              "Temporarily break the deployed app (or simulate it) and document what the monitor reported.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 14,
    slug: "ci-cd-fundamentals",
    title: "CI/CD Fundamentals",
    displayTitle: "CI/CD",
    assignments: [
      {
        slug: "first-github-actions-workflow",
        title: "Your First GitHub Actions Workflow",
        description: "Write a GitHub Actions workflow that lints and checks a project on every push.",
        type: "Terminal Commands",
        time: "60–75 minutes",
        skills: ["GitHub Actions", "YAML", "Automation"],
        xp: 130,
        notes: [
          "Workflow file must live in .github/workflows/.",
          "Trigger on push and pull_request.",
          "Keep the workflow small and fast — no unnecessary steps.",
        ],
        files: [".github/workflows/ci.yml", "README.md"],
        objective: "Understand the basic anatomy of a CI workflow file and how it runs on GitHub.",
        instructions: "Add a workflow that installs dependencies and runs lint (and build, if applicable) on every push/PR to main.",
        sections: [
          {
            title: "Workflow triggers",
            items: [
              "Runs on push and pull_request to main.",
              "Uses an appropriate Node version via actions/setup-node.",
            ],
          },
          {
            title: "Steps",
            items: [
              "Checkout, install dependencies, run lint.",
              "Fail the workflow if lint fails (do not swallow errors).",
            ],
          },
          {
            title: "Evidence",
            items: [
              "Include a screenshot or link showing a green (or intentionally red) run in the Actions tab.",
            ],
          },
        ],
      },
      {
        slug: "automated-testing-in-ci",
        title: "Automated Testing in CI",
        description: "Add a test suite and wire it into CI so pull requests are blocked when tests fail.",
        type: "Mini Projects",
        time: "90 minutes",
        skills: ["Testing", "CI gating", "Status checks"],
        xp: 160,
        notes: [
          "A handful of meaningful tests is enough — don't chase 100% coverage.",
          "The CI run must actually fail when a test fails (verify this, don't assume it).",
          "Use any test runner appropriate for your stack (Vitest, Jest, etc.).",
        ],
        files: [".github/workflows/ci.yml", "tests/", "README.md"],
        objective: "Connect automated tests to CI so broken code can't silently merge.",
        instructions: "Add at least 4 tests to a small project and update CI to run them, then prove a failing test blocks the workflow.",
        sections: [
          {
            title: "Tests",
            items: [
              "At least 4 tests covering one non-trivial function or component each.",
              "Include one intentionally-failing test as evidence, then fix it before final submission.",
            ],
          },
          {
            title: "CI wiring",
            items: [
              "CI runs the test command as a required step.",
              "Document how you confirmed a failing test turns the run red.",
            ],
          },
          {
            title: "Write-up",
            items: [
              "Explain what \"CI gating\" means in your own words.",
            ],
          },
        ],
      },
      {
        slug: "build-and-deploy-pipeline",
        title: "Build & Deploy Pipeline",
        description: "Extend CI into a CD pipeline that deploys automatically after tests pass on main.",
        type: "Mini Projects",
        time: "2 hours",
        skills: ["CI/CD", "Deploy automation", "Pipeline stages"],
        xp: 180,
        notes: [
          "Deploy step should only run after lint/test steps pass.",
          "Store deploy secrets (tokens/keys) as encrypted repository secrets, never in the workflow file.",
          "Document the full pipeline stages in README.",
        ],
        files: [".github/workflows/deploy.yml", "README.md"],
        objective: "Learn how automated deploys are gated by earlier pipeline stages in a real CI/CD setup.",
        instructions: "Create a pipeline with lint → test → deploy stages that only deploys on pushes to main after prior stages succeed.",
        sections: [
          {
            title: "Pipeline stages",
            items: [
              "Separate jobs (or steps) for lint, test, and deploy in that order.",
              "Deploy job depends on (needs:) the earlier jobs succeeding.",
            ],
          },
          {
            title: "Secrets",
            items: [
              "Add the deploy token/key as a GitHub Actions secret.",
              "Reference it via secrets.* in the workflow — never hard-code it.",
            ],
          },
          {
            title: "Verification",
            items: [
              "Show evidence of one successful pipeline run that ended in a real deploy.",
            ],
          },
        ],
      },
      {
        slug: "branch-protection-and-release-flow",
        title: "Branch Protection & Release Flow",
        description: "Configure branch protection rules and a simple versioned release process.",
        type: "Git Practice",
        time: "75 minutes",
        skills: ["Branch protection", "Semantic versioning", "Release notes"],
        xp: 150,
        notes: [
          "Protect main so it cannot be pushed to directly.",
          "Use semantic version tags (vMAJOR.MINOR.PATCH).",
          "Release notes should be readable by a non-engineer.",
        ],
        files: ["RELEASE_PROCESS.md", "CHANGELOG.md", "README.md"],
        objective: "Practice the branch and release hygiene that keeps main always deployable.",
        instructions: "Enable branch protection requiring passing CI + review on main, then cut a tagged release with changelog notes.",
        sections: [
          {
            title: "Branch protection",
            items: [
              "Require status checks (CI) to pass before merging into main.",
              "Require at least one approving review (or document the setting even if solo).",
            ],
          },
          {
            title: "Release",
            items: [
              "Tag a release using semantic versioning.",
              "Write release notes summarizing what changed since the last tag.",
            ],
          },
          {
            title: "Process doc",
            items: [
              "RELEASE_PROCESS.md documents the exact steps for the next release.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 15,
    slug: "llm-fundamentals",
    title: "LLM Fundamentals",
    displayTitle: "AI Engineering",
    assignments: [
      {
        slug: "prompt-engineering-basics",
        title: "Prompt Engineering Basics",
        description: "Compare naive vs well-structured prompts for the same task and document what changed the output quality.",
        type: "Problem Solving",
        time: "60–75 minutes",
        skills: ["Prompting", "Instruction design", "Evaluation"],
        xp: 120,
        notes: [
          "Use any LLM you have access to (ChatGPT, Claude, or an API) — document which one.",
          "Keep the task itself fixed while you vary only the prompt.",
          "Judge outputs by correctness and format, not just length.",
        ],
        files: ["PROMPTS.md", "README.md"],
        objective: "Build intuition for how prompt structure changes LLM output quality and reliability.",
        instructions: "Pick one task (e.g. summarizing a support ticket into a structured report) and test 3 prompt variants against it.",
        sections: [
          {
            title: "Task & variants",
            items: [
              "Define the task and a fixed input to test against.",
              "Write a naive one-line prompt, a role+instructions prompt, and a prompt with an explicit output format.",
            ],
          },
          {
            title: "Results",
            items: [
              "Paste the actual output for each of the 3 prompts.",
              "Score each output 1–5 on correctness and format adherence.",
            ],
          },
          {
            title: "Takeaways",
            items: [
              "Write 3 concrete lessons about what made the best prompt better.",
            ],
          },
        ],
      },
      {
        slug: "calling-an-llm-api-from-code",
        title: "Calling an LLM API From Code",
        description: "Call an LLM provider's API from a small server script, handling streaming and error cases.",
        type: "Backend APIs",
        time: "90–120 minutes",
        skills: ["LLM APIs", "Streaming", "Error handling"],
        xp: 160,
        notes: [
          "Use any LLM provider's API (OpenAI, Anthropic, or an equivalent) — never expose the API key to the browser.",
          "Handle rate-limit and timeout errors gracefully, not with a crash.",
          "Store the API key in an environment variable.",
        ],
        files: ["server.js", "services/llmClient.js", "README.md"],
        objective: "Move from chatting in a UI to calling an LLM programmatically like a real backend feature.",
        instructions: "Build a POST /ask endpoint that sends a prompt to an LLM API and returns the response, with basic streaming support.",
        sections: [
          {
            title: "Endpoint",
            items: [
              "POST /ask accepts { prompt } and validates it is non-empty.",
              "Calls the LLM API server-side with the key from .env.",
            ],
          },
          {
            title: "Streaming & errors",
            items: [
              "Stream tokens back to the client as they arrive (or document a clear reason if using non-streaming).",
              "Return a clear error response on API failure/timeout instead of hanging.",
            ],
          },
          {
            title: "Demo",
            items: [
              "Show one real request/response example (with a redacted key) in README.",
            ],
          },
        ],
      },
      {
        slug: "structured-output-and-function-calling",
        title: "Structured Output & Function Calling",
        description: "Force an LLM to return strictly structured JSON (or a function call) instead of free-form text.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Structured output", "Function calling", "Schema validation"],
        xp: 180,
        notes: [
          "Use your provider's structured-output or function/tool-calling feature if available.",
          "Validate the LLM's output against your schema before trusting it — never assume it's always correct.",
          "Handle the case where the model returns invalid or incomplete JSON.",
        ],
        files: ["server.js", "schema.js", "README.md"],
        objective: "Learn to constrain LLM output into a reliable, machine-usable shape.",
        instructions: "Build an endpoint that extracts { name, date, amount } from a free-text expense note using structured output/function calling.",
        sections: [
          {
            title: "Schema",
            items: [
              "Define the exact output schema (fields + types) the model must return.",
            ],
          },
          {
            title: "Extraction",
            items: [
              "Send a free-text note and get back strictly structured data.",
              "Validate the response against the schema server-side before returning it to the caller.",
            ],
          },
          {
            title: "Failure handling",
            items: [
              "Show what happens (and what you return) when the model output fails validation.",
            ],
          },
        ],
      },
      {
        slug: "mini-llm-eval-harness",
        title: "Building a Mini LLM Eval Harness",
        description: "Build a small script that runs a fixed prompt against multiple test cases and scores the outputs automatically.",
        type: "Problem Solving",
        time: "2 hours",
        skills: ["Evaluation", "Test cases", "Scoring"],
        xp: 190,
        notes: [
          "At least 8 test cases with known expected properties (not necessarily exact string matches).",
          "Prefer simple, explainable scoring rules over another LLM call for grading, unless you document why you chose LLM-graded scoring.",
          "Re-running the harness should be repeatable and produce a summary report.",
        ],
        files: ["eval.js", "cases.json", "REPORT.md", "README.md"],
        objective: "Understand why teams building AI features need repeatable evals, not just manual vibe-checking.",
        instructions: "Build an eval harness for a summarization or classification prompt with at least 8 test cases and an automatic pass/fail score.",
        sections: [
          {
            title: "Test cases",
            items: [
              "At least 8 cases with input + an explicit expected property (e.g. contains keyword, correct label, length under N).",
            ],
          },
          {
            title: "Scoring",
            items: [
              "Run each case through the prompt and check it against its expected property programmatically.",
              "Produce a pass/fail count and pass rate.",
            ],
          },
          {
            title: "Report",
            items: [
              "REPORT.md summarizes results and calls out any case that consistently fails.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 16,
    slug: "building-ai-features",
    title: "Building AI Features",
    displayTitle: "AI Features",
    assignments: [
      {
        slug: "streaming-chat-ui",
        title: "Streaming Chat UI",
        description: "Build a chat interface that streams LLM responses token-by-token into the UI.",
        type: "UI Clone",
        time: "2 hours",
        skills: ["Streaming UI", "Chat UX", "State management"],
        xp: 170,
        notes: [
          "Use React (or your framework of choice) for the UI and any LLM API for the backend.",
          "The response must visibly stream in, not appear all at once.",
          "Show a clear \"thinking/streaming\" indicator while a response is in flight.",
        ],
        files: ["src/App.jsx", "src/Chat.jsx", "server.js", "README.md"],
        objective: "Build the streaming chat UX pattern used by most modern AI products.",
        instructions: "Build a single-conversation chat UI where messages stream in from an LLM backend endpoint.",
        sections: [
          {
            title: "Chat UI",
            items: [
              "Message list with clear user vs assistant styling.",
              "Input box with send-on-Enter and a disabled state while streaming.",
            ],
          },
          {
            title: "Streaming",
            items: [
              "Assistant text appears incrementally as chunks arrive from the server.",
              "Handle a stream error mid-response without crashing the UI.",
            ],
          },
          {
            title: "History",
            items: [
              "Keep at least the current session's message history in state.",
            ],
          },
        ],
      },
      {
        slug: "mini-rag-project",
        title: "Mini RAG Project",
        description: "Build a small retrieval-augmented generation pipeline over a handful of your own documents.",
        type: "Mini Projects",
        time: "2–3 hours",
        skills: ["Retrieval", "Embeddings", "RAG"],
        xp: 200,
        notes: [
          "A handful of plain-text documents (5–10) is enough — no need for a huge corpus.",
          "You may use a simple in-memory vector store or keyword search for retrieval if a real vector DB is unavailable.",
          "The model must answer using retrieved context, not just its own general knowledge.",
        ],
        files: ["docs/", "ingest.js", "query.js", "README.md"],
        objective: "Understand the core RAG loop: chunk, embed/index, retrieve, and generate with grounded context.",
        instructions: "Ingest 5–10 short documents, retrieve the most relevant chunks for a question, and have the LLM answer using only that context.",
        sections: [
          {
            title: "Ingestion",
            items: [
              "Chunk each document into reasonably sized pieces.",
              "Store chunks with embeddings (or a keyword index if using a fallback approach).",
            ],
          },
          {
            title: "Retrieval & generation",
            items: [
              "Given a question, retrieve the top-k most relevant chunks.",
              "Pass only those chunks as context to the LLM and ask it to answer, citing which chunk(s) it used.",
            ],
          },
          {
            title: "Evaluation",
            items: [
              "Ask 3 questions that should be answerable from the docs and 1 that should not be — check the model correctly says \"not found\" for the last one.",
            ],
          },
        ],
      },
      {
        slug: "ai-feature-with-guardrails",
        title: "AI Feature With Guardrails",
        description: "Add input/output guardrails and rate limiting to an existing AI-powered endpoint.",
        type: "Backend APIs",
        time: "2 hours",
        skills: ["Guardrails", "Rate limiting", "Content safety"],
        xp: 190,
        notes: [
          "Build on top of an AI endpoint from a prior assignment (or a fresh minimal one).",
          "Guardrails should reject clearly bad input/output, not just log a warning.",
          "Rate limiting should be per-user or per-IP, not global-only.",
        ],
        files: ["server.js", "middleware/rateLimit.js", "guardrails.js", "README.md"],
        objective: "Learn the defensive layer every production AI feature needs around the raw model call.",
        instructions: "Add input length/content checks, an output safety check, and per-IP rate limiting to an AI endpoint.",
        sections: [
          {
            title: "Input guardrails",
            items: [
              "Reject empty or excessively long prompts with a clear error.",
              "Reject input matching a small blocklist you define (e.g. obvious prompt-injection attempts).",
            ],
          },
          {
            title: "Output guardrails",
            items: [
              "Check the model's output against a simple rule (e.g. max length, no leaked system prompt) before returning it.",
            ],
          },
          {
            title: "Rate limiting",
            items: [
              "Limit requests per IP/user within a time window and return 429 when exceeded.",
            ],
          },
        ],
      },
      {
        slug: "cost-and-latency-aware-ai-feature",
        title: "Cost- and Latency-Aware AI Feature",
        description: "Add caching and a cheaper fallback model to reduce cost and latency on repeated AI requests.",
        type: "Mini Projects",
        time: "2 hours",
        skills: ["Caching", "Fallback strategy", "Cost awareness"],
        xp: 190,
        notes: [
          "Cache should key on the normalized input, not the raw request object.",
          "Fallback can be a smaller/cheaper model or a cached generic answer — document your choice.",
          "Log token usage or estimated cost per request for visibility.",
        ],
        files: ["server.js", "cache.js", "README.md"],
        objective: "Practice the cost/latency tradeoffs real AI products have to manage in production.",
        instructions: "Add response caching for repeated prompts and a fallback path for when the primary model is slow or fails.",
        sections: [
          {
            title: "Caching",
            items: [
              "Cache responses keyed by a normalized version of the prompt.",
              "Serve cache hits without calling the model again; log hit vs miss.",
            ],
          },
          {
            title: "Fallback",
            items: [
              "If the primary model call exceeds a timeout or errors, fall back to a cheaper/faster path.",
              "Clearly mark fallback responses (e.g. a flag in the response body).",
            ],
          },
          {
            title: "Cost visibility",
            items: [
              "Log an estimated token count or cost per request to the console.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 17,
    slug: "capstone-planning",
    title: "Capstone Planning",
    displayTitle: "Capstone",
    assignments: [
      {
        slug: "capstone-idea-and-scope",
        title: "Capstone Idea & Scope Document",
        description: "Pick your capstone project idea and write a tight scope document with explicit non-goals.",
        type: "Problem Solving",
        time: "60–75 minutes",
        skills: ["Scoping", "Prioritization", "Product thinking"],
        xp: 110,
        notes: [
          "Pick something you can realistically finish in the time you have left.",
          "Non-goals are as important as goals — be explicit about what you will NOT build.",
          "Avoid picking an idea that depends on data/APIs you don't actually have access to.",
        ],
        files: ["SCOPE.md", "README.md"],
        objective: "Commit to a capstone idea with a scope tight enough to actually finish.",
        instructions: "Write a scope document for your capstone: problem, target user, core features (v1 only), and explicit non-goals.",
        sections: [
          {
            title: "Problem & user",
            items: [
              "State the problem in one sentence and who has it.",
              "Describe the target user in 2–3 sentences.",
            ],
          },
          {
            title: "V1 scope",
            items: [
              "List the 3–5 core features that make v1 usable end-to-end.",
              "List at least 5 explicit non-goals (things you will not build for v1).",
            ],
          },
          {
            title: "Feasibility check",
            items: [
              "List every external dependency (API, data, auth provider) and confirm you have access to each.",
            ],
          },
        ],
      },
      {
        slug: "capstone-architecture-plan",
        title: "Capstone Architecture Plan",
        description: "Write a lightweight system design doc for your capstone: stack, data model, and key flows.",
        type: "System Design",
        time: "90 minutes",
        skills: ["System design", "Data modeling", "Documentation"],
        xp: 140,
        notes: [
          "Keep this proportional to your capstone's actual size — no over-engineering.",
          "Diagrams can be simple boxes-and-arrows; clarity beats polish.",
          "Call out the riskiest technical unknown explicitly.",
        ],
        files: ["ARCHITECTURE.md", "README.md"],
        objective: "Think through your capstone's architecture before writing implementation code.",
        instructions: "Document your capstone's stack choice, data model, and the 2–3 key user flows end-to-end.",
        sections: [
          {
            title: "Stack & structure",
            items: [
              "List your chosen frontend, backend, and database technologies with one-line reasons.",
              "Sketch the high-level folder/module structure.",
            ],
          },
          {
            title: "Data model",
            items: [
              "List the core entities and their key fields/relationships.",
            ],
          },
          {
            title: "Key flows",
            items: [
              "Walk through 2–3 critical user flows end-to-end (e.g. signup → first action → result).",
              "Call out the single riskiest technical unknown and how you plan to de-risk it.",
            ],
          },
        ],
      },
      {
        slug: "capstone-milestone-plan",
        title: "Capstone Milestone Plan",
        description: "Break your capstone into weekly milestones with concrete, checkable deliverables.",
        type: "Developer Mindset",
        time: "60 minutes",
        skills: ["Planning", "Milestones", "Time management"],
        xp: 120,
        notes: [
          "Milestones must be checkable — \"work on backend\" is not a milestone.",
          "Plan for less time than you think you have; leave buffer for polish/QA.",
          "Order milestones so each one produces something demoable.",
        ],
        files: ["MILESTONES.md", "README.md"],
        objective: "Turn your capstone scope into a week-by-week plan you can actually track.",
        instructions: "Break your capstone into weekly milestones from today until your ship date, each with a demoable deliverable.",
        sections: [
          {
            title: "Milestones",
            items: [
              "One milestone per week with a specific, checkable deliverable.",
              "Each milestone should be demoable, not just \"code written\".",
            ],
          },
          {
            title: "Sequencing",
            items: [
              "Order milestones so core functionality lands before polish.",
              "Reserve the final milestone for QA, polish, and deployment only.",
            ],
          },
          {
            title: "Risk buffer",
            items: [
              "Identify which milestone is most likely to slip and what you'll cut first if it does.",
            ],
          },
        ],
      },
      {
        slug: "capstone-risk-spike",
        title: "Capstone Risk Spike",
        description: "Do a small time-boxed spike to prove out your capstone's riskiest technical unknown.",
        type: "Debugging",
        time: "2 hours",
        skills: ["Spikes", "Risk reduction", "Prototyping"],
        xp: 150,
        notes: [
          "This is throwaway code meant to answer one question, not production quality.",
          "Time-box the spike (e.g. 2 hours) and stop even if the answer is \"this is harder than expected\".",
          "A spike that reveals a problem early is a success, not a failure.",
        ],
        files: ["spike/", "SPIKE_NOTES.md", "README.md"],
        objective: "De-risk your capstone by proving out the scariest unknown before committing real build time to it.",
        instructions: "Identify your capstone's riskiest technical unknown (an API, a library, a performance question) and spend a time-boxed spike proving it works (or doesn't).",
        sections: [
          {
            title: "Risk identification",
            items: [
              "State the specific unknown and why it's risky (could block the whole project if wrong).",
            ],
          },
          {
            title: "Spike",
            items: [
              "Write the minimum throwaway code needed to answer the question.",
              "Record how long the spike actually took vs your time-box.",
            ],
          },
          {
            title: "Outcome",
            items: [
              "State a clear answer: it works, it doesn't, or it needs a different approach — and what you'll do next.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 18,
    slug: "ship-the-product",
    title: "Ship the Product",
    displayTitle: "Ship",
    assignments: [
      {
        slug: "build-the-capstone-mvp",
        title: "Build the Capstone MVP",
        description: "Implement the core end-to-end flow of your capstone, even if rough around the edges.",
        type: "Capstone Projects",
        time: "1–2 weeks",
        skills: ["Full-stack build", "Focus", "Execution"],
        xp: 260,
        notes: [
          "Prioritize one complete end-to-end flow over many half-built features.",
          "It is fine for the MVP to look rough — polish comes in a later assignment.",
          "Commit and push regularly, not in one giant commit at the end.",
        ],
        files: ["src/", "README.md"],
        objective: "Get your capstone's core value working end-to-end, even imperfectly.",
        instructions: "Implement the core features from your scope document as one working end-to-end flow.",
        sections: [
          {
            title: "Core flow",
            items: [
              "Implement the single most important user flow from your scope doc, fully working.",
              "Wire up the real data layer (no more hard-coded mock data for this flow).",
            ],
          },
          {
            title: "Progress hygiene",
            items: [
              "Commit in small, meaningful increments with clear messages.",
              "Update MILESTONES.md (or equivalent) with what actually shipped this week.",
            ],
          },
          {
            title: "Known gaps",
            items: [
              "List what is intentionally rough or unfinished at this stage.",
            ],
          },
        ],
      },
      {
        slug: "polish-and-qa-bug-bash",
        title: "Polish & QA Bug Bash",
        description: "Run a structured bug bash on your capstone and fix the highest-impact issues found.",
        type: "Capstone Projects",
        time: "1 week",
        skills: ["QA", "Bug triage", "UX polish"],
        xp: 220,
        notes: [
          "Test as a real user would, not just the happy path you already know works.",
          "Triage bugs by severity before fixing — fix the worst ones first.",
          "Get at least one other person to click through your app if possible.",
        ],
        files: ["BUGS.md", "README.md"],
        objective: "Turn a working MVP into something you'd be comfortable showing a stranger.",
        instructions: "Do a full pass through every screen/flow of your capstone, log every issue found, then fix the highest-severity ones.",
        sections: [
          {
            title: "Bug bash",
            items: [
              "Click through every screen and flow, including edge cases (empty states, errors, slow network).",
              "Log at least 10 findings with severity (low/med/high).",
            ],
          },
          {
            title: "Fixes",
            items: [
              "Fix all high-severity issues and as many medium ones as time allows.",
              "Re-test each fix to confirm it's actually resolved.",
            ],
          },
          {
            title: "Polish",
            items: [
              "Address at least 3 UX rough edges (spacing, copy, loading states).",
            ],
          },
        ],
      },
      {
        slug: "deploy-the-capstone",
        title: "Deploy the Capstone to Production",
        description: "Deploy your finished capstone to a real public URL with working environment configuration.",
        type: "Capstone Projects",
        time: "1 day",
        skills: ["Deployment", "Environment config", "Verification"],
        xp: 200,
        notes: [
          "The final deliverable is a working public URL — not a promise it works locally.",
          "Double-check environment variables/secrets are configured in the hosting platform, not just locally.",
          "Test the deployed version end-to-end, not just that it loads.",
        ],
        files: ["DEPLOY.md", "README.md"],
        objective: "Get your capstone live and verified in a real production environment.",
        instructions: "Deploy your capstone's frontend and backend (as applicable) to production and verify every core flow works live.",
        sections: [
          {
            title: "Deployment",
            items: [
              "Deploy frontend and backend (or full-stack app) to a real hosting provider.",
              "Configure all environment variables/secrets on the hosting platform.",
            ],
          },
          {
            title: "Live verification",
            items: [
              "Walk through your core flow(s) on the live URL and confirm they work.",
              "Fix any environment-specific issues found only in production.",
            ],
          },
          {
            title: "Runbook",
            items: [
              "Document how to redeploy and how to check logs if something breaks.",
            ],
          },
        ],
      },
      {
        slug: "product-launch-writeup",
        title: "Product Launch Write-Up",
        description: "Write a launch-quality README and short demo walkthrough for your finished capstone.",
        type: "Capstone Projects",
        time: "1 day",
        skills: ["Technical writing", "Storytelling", "Demos"],
        xp: 180,
        notes: [
          "Write for someone seeing your project for the first time — no assumed context.",
          "A short screen recording is strongly preferred over static screenshots alone.",
          "Be honest about known limitations rather than hiding them.",
        ],
        files: ["README.md", "DEMO.md"],
        objective: "Present your finished capstone the way you would in a real product launch or portfolio piece.",
        instructions: "Write a final README covering what it is, how to run it, and a short demo walkthrough of the core flow.",
        sections: [
          {
            title: "README",
            items: [
              "Problem statement, who it's for, and the core feature list.",
              "Setup/run instructions that work for someone with a clean machine.",
            ],
          },
          {
            title: "Demo walkthrough",
            items: [
              "Record (or storyboard with screenshots) a 60–120 second walkthrough of the core flow.",
              "Link the live deployed URL.",
            ],
          },
          {
            title: "Retrospective",
            items: [
              "List 2 things you'd do differently and 1 thing you're proud of.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 19,
    slug: "technical-interviews",
    title: "Technical Interviews",
    displayTitle: "Interviews",
    assignments: [
      {
        slug: "data-structures-warmup-set",
        title: "Data Structures Warm-Up Set",
        description: "Solve a set of array/string/hash-map problems and explain your approach for each.",
        type: "Problem Solving",
        time: "90 minutes",
        skills: ["Arrays", "Strings", "Hash maps"],
        xp: 130,
        notes: [
          "Solve in a language you're comfortable explaining out loud.",
          "For each problem, write the time/space complexity, not just the code.",
          "No looking up full solutions — look up syntax only if needed.",
        ],
        files: ["solutions/", "NOTES.md", "README.md"],
        objective: "Warm up core data-structure pattern recognition before mock interviews.",
        instructions: "Solve 5 problems covering arrays, strings, and hash maps (e.g. two-sum style, anagram check, sliding window), each with a written explanation.",
        sections: [
          {
            title: "Problems",
            items: [
              "Solve at least 5 problems spanning arrays, strings, and a hash-map-based approach.",
              "Include the working code for each.",
            ],
          },
          {
            title: "Explanations",
            items: [
              "For each: state the approach in plain English before the code.",
              "State time and space complexity for each solution.",
            ],
          },
          {
            title: "Reflection",
            items: [
              "Note which problem took longest and why.",
            ],
          },
        ],
      },
      {
        slug: "whiteboard-style-problem-walkthrough",
        title: "Whiteboard-Style Problem Walkthrough",
        description: "Practice narrating your thought process out loud (recorded or written) while solving a medium problem.",
        type: "Problem Solving",
        time: "60–90 minutes",
        skills: ["Communication", "Live problem solving", "Clarification"],
        xp: 140,
        notes: [
          "Record yourself (audio/video) or write a moment-by-moment transcript — either is fine.",
          "Ask clarifying questions before jumping to code, like a real interview.",
          "It's fine to not reach the optimal solution — narrate the process honestly.",
        ],
        files: ["TRANSCRIPT.md", "solution.js", "README.md"],
        objective: "Build the interview habit of thinking out loud clearly under mild pressure.",
        instructions: "Pick one medium-difficulty problem you haven't seen before and narrate your full process: clarify → brute force → optimize → code → test.",
        sections: [
          {
            title: "Clarification",
            items: [
              "Write down at least 2 clarifying questions you'd ask an interviewer.",
              "State your assumptions if you can't get an answer.",
            ],
          },
          {
            title: "Approach",
            items: [
              "Describe a brute-force approach first, then an optimization.",
              "State complexity for both.",
            ],
          },
          {
            title: "Code & test",
            items: [
              "Write working code for the optimized approach.",
              "Trace through at least one example and one edge case by hand.",
            ],
          },
        ],
      },
      {
        slug: "mock-coding-interview-reflection",
        title: "Mock Coding Interview Reflection",
        description: "Run a timed mock coding interview (with a peer, mentor, or solo timer) and reflect honestly on performance.",
        type: "Developer Mindset",
        time: "60 minutes + reflection",
        skills: ["Time management", "Self-assessment", "Interview stamina"],
        xp: 150,
        notes: [
          "45 minutes strictly timed for the problem, then untimed reflection.",
          "Be specific and honest in the reflection — vague self-praise doesn't help you improve.",
          "If solo, use a random problem you haven't pre-seen the answer to.",
        ],
        files: ["MOCK_NOTES.md", "REFLECTION.md", "README.md"],
        objective: "Practice under real interview time pressure, then convert the experience into an improvement plan.",
        instructions: "Do one 45-minute timed mock interview on an unseen problem, then write a structured reflection.",
        sections: [
          {
            title: "Mock session",
            items: [
              "Record the problem, your timeline (when you understood it, when you started coding, when you finished), and whether you finished.",
            ],
          },
          {
            title: "Reflection",
            items: [
              "What went well, specifically.",
              "What slowed you down, specifically (not \"nerves\" — be concrete).",
            ],
          },
          {
            title: "Action plan",
            items: [
              "List 2 specific things you'll practice differently before your next mock.",
            ],
          },
        ],
      },
      {
        slug: "behavioral-story-bank-star",
        title: "Behavioral Story Bank (STAR)",
        description: "Write 5 STAR-format stories covering common behavioral interview themes from your own experience.",
        type: "Developer Mindset",
        time: "90 minutes",
        skills: ["Behavioral interviewing", "STAR method", "Storytelling"],
        xp: 140,
        notes: [
          "Use real experiences — school projects, part-time jobs, and personal projects all count.",
          "Each story should be tight enough to tell in under 2 minutes out loud.",
          "Quantify results wherever honestly possible.",
        ],
        files: ["STAR_STORIES.md", "README.md"],
        objective: "Build a reusable bank of behavioral stories instead of improvising under pressure in real interviews.",
        instructions: "Write 5 STAR stories covering: a conflict, a failure/mistake, a time you helped someone, a tight deadline, and one of your choice.",
        sections: [
          {
            title: "Story coverage",
            items: [
              "One story each for: conflict, failure/mistake, helping a teammate, tight deadline.",
              "One additional story of your choice (leadership, ambiguity, or initiative).",
            ],
          },
          {
            title: "STAR structure",
            items: [
              "Each story has clear Situation, Task, Action, and Result sections.",
              "Result includes a concrete outcome, even if qualitative.",
            ],
          },
          {
            title: "Delivery prep",
            items: [
              "Time yourself telling one story out loud; note if it's under 2 minutes.",
            ],
          },
        ],
      },
    ],
  },
  {
    n: 20,
    slug: "system-design-behavioral",
    title: "System Design & Behavioral",
    displayTitle: "System Design & Behavioral",
    assignments: [
      {
        slug: "system-design-url-shortener",
        title: "System Design: URL Shortener",
        description: "Design a URL shortener covering API, data model, ID generation, and scale considerations.",
        type: "System Design",
        time: "90 minutes",
        skills: ["System design", "API design", "Scale estimation"],
        xp: 160,
        notes: [
          "This is a design document, not an implementation.",
          "Do rough back-of-envelope math for scale — exact numbers matter less than the reasoning.",
          "Cover at least one failure mode explicitly.",
        ],
        files: ["DESIGN.md", "README.md"],
        objective: "Practice the classic entry-level system design problem end-to-end.",
        instructions: "Design a URL shortener: create-short-link and redirect APIs, data model, ID generation strategy, and a rough scale estimate.",
        sections: [
          {
            title: "API & data model",
            items: [
              "Define POST /links and GET /:code with request/response shapes.",
              "Define the storage schema (short code, long URL, created at, optional expiry).",
            ],
          },
          {
            title: "ID generation",
            items: [
              "Pick a short-code generation strategy (counter+encoding, random+collision check, hash) and justify it.",
            ],
          },
          {
            title: "Scale & failure modes",
            items: [
              "Rough estimate: reads vs writes per second at a stated user count.",
              "Describe one failure mode (e.g. code collision, hot key) and how you'd handle it.",
            ],
          },
        ],
      },
      {
        slug: "system-design-scaling-a-feed",
        title: "System Design: Scaling a Social Feed",
        description: "Design a social media feed system that can handle read-heavy traffic at scale.",
        type: "System Design",
        time: "2 hours",
        skills: ["System design", "Caching", "Read scaling"],
        xp: 190,
        notes: [
          "Focus on the read path (viewing a feed), not full feature parity with real social apps.",
          "Justify caching and fan-out choices with tradeoffs, not just buzzwords.",
          "It's fine to simplify — this is about reasoning, not building.",
        ],
        files: ["DESIGN.md", "README.md"],
        objective: "Practice reasoning about a read-heavy, fan-out-style system at a level appropriate for early-career interviews.",
        instructions: "Design a feed system where users see posts from people they follow, optimized for fast reads at scale.",
        sections: [
          {
            title: "Data model & API",
            items: [
              "Define users, posts, and follows relationships.",
              "Define GET /feed and its response shape.",
            ],
          },
          {
            title: "Fan-out strategy",
            items: [
              "Choose fan-out-on-write vs fan-out-on-read (or a hybrid) and justify it for this use case.",
              "Explain how the choice changes under a celebrity account with millions of followers.",
            ],
          },
          {
            title: "Caching & bottlenecks",
            items: [
              "Identify where you'd add caching and why.",
              "Name the single most likely bottleneck at 10x current scale.",
            ],
          },
        ],
      },
      {
        slug: "behavioral-deep-dive",
        title: "Behavioral Deep Dive",
        description: "Go deeper on your strongest STAR stories with likely interviewer follow-up questions.",
        type: "Developer Mindset",
        time: "75 minutes",
        skills: ["Behavioral depth", "Follow-up handling", "Reflection"],
        xp: 150,
        notes: [
          "Build on stories from an earlier behavioral assignment if you have them, or write fresh ones.",
          "Anticipate at least 2 realistic follow-up questions per story.",
          "Ownership and specificity matter more than sounding impressive.",
        ],
        files: ["BEHAVIORAL_DEEP_DIVE.md", "README.md"],
        objective: "Prepare for the follow-up questions that separate strong behavioral answers from rehearsed ones.",
        instructions: "Take your 2 strongest stories and write out likely interviewer follow-ups with honest, specific answers.",
        sections: [
          {
            title: "Story selection",
            items: [
              "Pick your 2 strongest stories (ideally: one conflict, one failure/ownership).",
            ],
          },
          {
            title: "Follow-up prep",
            items: [
              "Write at least 2 realistic follow-up questions per story an interviewer might ask.",
              "Answer each follow-up specifically — no vague deflection.",
            ],
          },
          {
            title: "Self-review",
            items: [
              "Note anywhere your story sounds rehearsed rather than honest, and rewrite that part.",
            ],
          },
        ],
      },
      {
        slug: "mock-onsite-design-and-behavioral-combo",
        title: "Mock Onsite: Design + Behavioral Combo",
        description: "Run a combined mock session: one system design problem plus 2 behavioral questions, timed like a real onsite loop.",
        type: "System Design",
        time: "90 minutes + reflection",
        skills: ["System design", "Behavioral", "Interview stamina"],
        xp: 200,
        notes: [
          "Time-box: ~45 minutes for design, ~30 minutes for behavioral, ~15 minutes reflection.",
          "Treat this like the real thing — no pausing to look up answers mid-session.",
          "This is a capstone-style combo assignment pulling together the whole module.",
        ],
        files: ["SESSION_NOTES.md", "REFLECTION.md", "README.md"],
        objective: "Simulate a real onsite loop's mixed format and mental switching between design and behavioral modes.",
        instructions: "In one sitting, solve one new system design prompt (~45 min) then answer 2 behavioral questions (~30 min), then reflect.",
        sections: [
          {
            title: "System design segment",
            items: [
              "Pick one design prompt you haven't already solved this module.",
              "Document your requirements clarification, API/data model, and one scale consideration — all within the time-box.",
            ],
          },
          {
            title: "Behavioral segment",
            items: [
              "Answer 2 behavioral questions you didn't already fully script, using STAR structure live.",
            ],
          },
          {
            title: "Reflection",
            items: [
              "Note where you felt rushed or under-prepared in each segment.",
              "List one concrete adjustment for your next mock onsite.",
            ],
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Generation logic
// ---------------------------------------------------------------------------

import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(
  __dirname,
  "..",
  "src/curriculum/assignment-catalog/module-assignments.ts"
);

const EXPECTED_MODULE_COUNT = 20;
const EXPECTED_ASSIGNMENTS_PER_MODULE = 4;

/** Writing-style types get a rubric weighted toward reasoning/clarity instead of code quality. */
const WRITING_TYPES = new Set(["Problem Solving", "Developer Mindset", "System Design"]);

function evaluationCriteriaFor(type) {
  if (WRITING_TYPES.has(type)) {
    return [
      { criteria: "Problem Understanding", marks: 25 },
      { criteria: "Reasoning & Approach", marks: 30 },
      { criteria: "Clarity & Structure", marks: 20 },
      { criteria: "Edge Cases / Tradeoffs", marks: 15 },
      { criteria: "Presentation", marks: 10 },
    ];
  }
  return [
    { criteria: "Requirements Coverage", marks: 35 },
    { criteria: "Code Quality", marks: 25 },
    { criteria: "Correctness & Edge Cases", marks: 20 },
    { criteria: "Documentation", marks: 15 },
    { criteria: "Submission Hygiene", marks: 5 },
  ];
}

function defaultSubmissionChecklist() {
  return [
    "The project runs / opens correctly.",
    "All required sections are completed.",
    "The code or document is properly formatted.",
    "The project is uploaded to GitHub.",
    "The GitHub repository link is ready to share with the mentor.",
  ];
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Validate the source data before generating anything.
if (modules.length !== EXPECTED_MODULE_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_MODULE_COUNT} modules, found ${modules.length}.`
  );
}
for (const mod of modules) {
  if (mod.assignments.length !== EXPECTED_ASSIGNMENTS_PER_MODULE) {
    throw new Error(
      `Module "${mod.slug}" has ${mod.assignments.length} assignments, expected ${EXPECTED_ASSIGNMENTS_PER_MODULE}.`
    );
  }
}

let globalSeq = 0;
const outputModules = modules.map((mod) => {
  const assignments = mod.assignments.map((a, index) => {
    globalSeq += 1;
    const localNumber = index + 1;
    const id = `a${pad2(globalSeq)}-${a.slug}`;
    const folderName = `assignment-m${pad2(mod.n)}-${pad2(localNumber)}-${a.slug}`;

    return {
      id,
      number: localNumber,
      slug: a.slug,
      title: a.title,
      description: a.description,
      difficulty: "beginner",
      type: a.type,
      estimatedTime: a.time,
      skills: a.skills,
      xp: a.xp,
      teach: {
        objective: a.objective,
        instructions: a.instructions,
        notes: a.notes,
        projectStructure: {
          folderName,
          files: a.files,
        },
        requirementSections: a.sections.map((s) => ({
          title: s.title,
          items: s.items,
          ...(s.note ? { note: s.note } : {}),
        })),
        submissionRequirements: [
          `Create a GitHub repository named: ${folderName}`,
          "Upload your completed project to the repository.",
          "Submit the GitHub Repository Link.",
          "Submit a screenshot (or equivalent evidence) of your final result.",
          "Share a short note or reflection if asked by your mentor.",
        ],
        evaluationCriteria: evaluationCriteriaFor(a.type),
        submissionChecklist:
          a.checklist && a.checklist.length
            ? a.checklist
            : defaultSubmissionChecklist(),
      },
      starterFiles: [],
    };
  });

  return {
    moduleNumber: mod.n,
    slug: mod.slug,
    title: mod.title,
    displayTitle: mod.displayTitle,
    assignments,
  };
});

const totalAssignments = outputModules.reduce(
  (sum, m) => sum + m.assignments.length,
  0
);

const header = `/* Auto-generated by scripts/gen-module-assignments.mjs — do not edit by hand. */
import type { RoadmapModuleAssignments } from "./types";

export const ROADMAP_MODULE_ASSIGNMENTS: RoadmapModuleAssignments[] = `;

const body = JSON.stringify(outputModules, null, 2).replace(
  /"([A-Za-z0-9_]+)":/g,
  "$1:"
);

const footer = `;

export function getAssignmentModuleMeta(moduleNumber: number) {
  return ROADMAP_MODULE_ASSIGNMENTS.find((m) => m.moduleNumber === moduleNumber) ?? null;
}

export function listAssignmentModuleOptions() {
  return ROADMAP_MODULE_ASSIGNMENTS.map((m) => ({
    id: m.moduleNumber,
    slug: m.slug,
    title: m.title,
    displayTitle: m.displayTitle,
    label: \`Module \${m.moduleNumber}\`,
  }));
}
`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, header + body + footer, "utf8");

console.log(
  `Generated ${totalAssignments} assignments across ${outputModules.length} modules -> ${path.relative(process.cwd(), OUTPUT_PATH)}`
);

if (totalAssignments !== EXPECTED_MODULE_COUNT * EXPECTED_ASSIGNMENTS_PER_MODULE) {
  throw new Error(
    `Expected exactly ${EXPECTED_MODULE_COUNT * EXPECTED_ASSIGNMENTS_PER_MODULE} assignments, generated ${totalAssignments}.`
  );
}
