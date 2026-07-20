-- Seed: Full Stack + AI Engineering curriculum
-- Stable UUIDs so local + staging environments stay aligned.

-- Course
insert into public.courses (id, title, slug, description, is_published, sort_order)
values (
  'a0000001-0000-4000-8000-000000000001',
  'Full Stack + AI Engineering',
  'full-stack-ai-engineering',
  'A structured path from developer fundamentals through frontend, backend, databases, DevOps, and AI engineering — ending in capstone projects.',
  true,
  1
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

-- Phases
insert into public.phases (id, course_id, title, slug, description, sort_order) values
  ('a0000002-0001-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'Developer Foundation', 'developer-foundation', 'Core programming mindset, tooling, and problem-solving habits.', 1),
  ('a0000002-0002-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'Frontend Development', 'frontend-development', 'Build polished user interfaces with modern web technologies.', 2),
  ('a0000002-0003-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'Backend Development', 'backend-development', 'Design APIs, services, and secure application backends.', 3),
  ('a0000002-0004-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'Database Engineering', 'database-engineering', 'Model, query, and operate reliable data systems.', 4),
  ('a0000002-0005-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'DevOps', 'devops', 'Ship software safely with deployment, monitoring, and CI/CD.', 5),
  ('a0000002-0006-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'AI Engineering', 'ai-engineering', 'Integrate LLMs and AI systems into real products.', 6),
  ('a0000002-0007-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'Capstone Projects', 'capstone-projects', 'Apply everything by shipping portfolio-ready products.', 7),
  ('a0000002-0008-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'Interview Preparation', 'interview-preparation', 'Prepare for technical interviews with structured practice across DSA, system design, and behavioral rounds.', 8)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- Modules
insert into public.modules (id, phase_id, title, slug, description, sort_order) values
  -- Developer Foundation
  ('a0000003-0001-4000-8000-000000000001', 'a0000002-0001-4000-8000-000000000001', 'Programming Fundamentals', 'programming-fundamentals', 'How developers think, structure logic, and solve problems.', 1),
  ('a0000003-0001-4000-8000-000000000002', 'a0000002-0001-4000-8000-000000000001', 'Developer Tooling', 'developer-tooling', 'Git, terminal, and editor workflows used every day.', 2),
  -- Frontend
  ('a0000003-0002-4000-8000-000000000001', 'a0000002-0002-4000-8000-000000000001', 'Web Foundations', 'web-foundations', 'HTML, CSS, and accessible page structure.', 1),
  ('a0000003-0002-4000-8000-000000000002', 'a0000002-0002-4000-8000-000000000001', 'JavaScript & React', 'javascript-and-react', 'Interactive UIs with modern JavaScript and React.', 2),
  -- Backend
  ('a0000003-0003-4000-8000-000000000001', 'a0000002-0003-4000-8000-000000000001', 'APIs & Services', 'apis-and-services', 'HTTP, REST, and service design.', 1),
  ('a0000003-0003-4000-8000-000000000002', 'a0000002-0003-4000-8000-000000000001', 'Auth & Security Basics', 'auth-and-security-basics', 'Sessions, tokens, and secure defaults.', 2),
  -- Database
  ('a0000003-0004-4000-8000-000000000001', 'a0000002-0004-4000-8000-000000000001', 'Relational Databases', 'relational-databases', 'SQL, schemas, and query fundamentals.', 1),
  ('a0000003-0004-4000-8000-000000000002', 'a0000002-0004-4000-8000-000000000001', 'Data Modeling', 'data-modeling', 'Design schemas that scale with your product.', 2),
  -- DevOps
  ('a0000003-0005-4000-8000-000000000001', 'a0000002-0005-4000-8000-000000000001', 'Deployment Essentials', 'deployment-essentials', 'Environments, hosting, and release basics.', 1),
  ('a0000003-0005-4000-8000-000000000002', 'a0000002-0005-4000-8000-000000000001', 'CI/CD Fundamentals', 'ci-cd-fundamentals', 'Automated checks and delivery pipelines.', 2),
  -- AI
  ('a0000003-0006-4000-8000-000000000001', 'a0000002-0006-4000-8000-000000000001', 'LLM Fundamentals', 'llm-fundamentals', 'How large language models work in practice.', 1),
  ('a0000003-0006-4000-8000-000000000002', 'a0000002-0006-4000-8000-000000000001', 'Building AI Features', 'building-ai-features', 'Prompting, tools, and product integration patterns.', 2),
  -- Capstone
  ('a0000003-0007-4000-8000-000000000001', 'a0000002-0007-4000-8000-000000000001', 'Capstone Planning', 'capstone-planning', 'Scope, architecture, and delivery planning.', 1),
  ('a0000003-0007-4000-8000-000000000002', 'a0000002-0007-4000-8000-000000000001', 'Ship the Product', 'ship-the-product', 'Polish, launch, and present your work.', 2),
  -- Interview Preparation
  ('a0000003-0008-4000-8000-000000000001', 'a0000002-0008-4000-8000-000000000001', 'Technical Interview Fundamentals', 'technical-interview-fundamentals', 'Core patterns for coding interviews and communication under pressure.', 1),
  ('a0000003-0008-4000-8000-000000000002', 'a0000002-0008-4000-8000-000000000001', 'System Design & Behavioral', 'system-design-and-behavioral', 'High-level design interviews and storytelling for behavioral rounds.', 2)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- Lessons
insert into public.lessons (
  id, module_id, title, slug, description, content,
  estimated_duration_minutes, difficulty, resources, sort_order
) values
-- Programming Fundamentals
(
  'a0000004-0001-4000-8000-000000000001',
  'a0000003-0001-4000-8000-000000000001',
  'Thinking Like a Developer',
  'thinking-like-a-developer',
  'Build the mental models that separate beginners from effective engineers.',
  E'## Thinking Like a Developer\n\nGreat engineers break problems into smaller, testable pieces before writing code.\n\n### Goals\n- Decompose ambiguous problems\n- Prefer clarity over cleverness\n- Validate assumptions early\n\n### Practice\n1. Pick a real workflow you do daily.\n2. Write the steps as inputs → process → outputs.\n3. Identify where software could remove friction.\n\n### Key takeaway\nCode is the last step. Understanding the problem is the first.',
  25,
  'beginner',
  '[{"title":"How to think about software","url":"https://www.notion.so","type":"article"}]'::jsonb,
  1
),
(
  'a0000004-0001-4000-8000-000000000002',
  'a0000003-0001-4000-8000-000000000001',
  'Variables, Control Flow & Functions',
  'variables-control-flow-functions',
  'Core building blocks of every programming language.',
  E'## Variables, Control Flow & Functions\n\nPrograms store state, make decisions, and reuse logic.\n\n### You will learn\n- Variables and types\n- Conditionals and loops\n- Pure vs side-effecting functions\n\n### Exercise\nWrite a function that takes a list of study minutes and returns total hours rounded to one decimal.',
  35,
  'beginner',
  '[{"title":"MDN JavaScript Guide","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide","type":"docs"}]'::jsonb,
  2
),
(
  'a0000004-0001-4000-8000-000000000003',
  'a0000003-0001-4000-8000-000000000002',
  'Git & GitHub Essentials',
  'git-and-github-essentials',
  'Version control workflows every full-stack engineer uses daily.',
  E'## Git & GitHub Essentials\n\nVersion control is how teams collaborate safely.\n\n### Workflow\n1. `git status`\n2. Stage intentional changes\n3. Commit with a clear message\n4. Push and open a pull request\n\n### Practice\nCreate a repo, make three commits, and open a PR summary of what changed.',
  30,
  'beginner',
  '[{"title":"Git documentation","url":"https://git-scm.com/doc","type":"docs"}]'::jsonb,
  1
),
(
  'a0000004-0001-4000-8000-000000000004',
  'a0000003-0001-4000-8000-000000000002',
  'Terminal & Editor Workflow',
  'terminal-and-editor-workflow',
  'Move faster with the terminal and a configured editor.',
  E'## Terminal & Editor Workflow\n\nYour terminal and editor are your workshop.\n\n### Focus areas\n- Navigation and file operations\n- Running scripts and package managers\n- Editor shortcuts that compound over time',
  20,
  'beginner',
  '[]'::jsonb,
  2
),
-- Frontend
(
  'a0000004-0002-4000-8000-000000000001',
  'a0000003-0002-4000-8000-000000000001',
  'HTML Semantics & Accessibility',
  'html-semantics-and-accessibility',
  'Structure pages so humans and assistive tech can understand them.',
  E'## HTML Semantics & Accessibility\n\nSemantic HTML is the foundation of accessible products.\n\n### Checklist\n- Use landmarks (`header`, `main`, `nav`)\n- Label form controls\n- Prefer buttons for actions and links for navigation',
  30,
  'beginner',
  '[{"title":"WAI-ARIA basics","url":"https://www.w3.org/WAI/ARIA/apg/","type":"docs"}]'::jsonb,
  1
),
(
  'a0000004-0002-4000-8000-000000000002',
  'a0000003-0002-4000-8000-000000000001',
  'Modern CSS Layout',
  'modern-css-layout',
  'Build responsive layouts with Flexbox and Grid.',
  E'## Modern CSS Layout\n\nLayout systems let you design without fragile hacks.\n\n### Topics\n- Flexbox for one-dimensional alignment\n- Grid for two-dimensional structure\n- Mobile-first media queries',
  40,
  'intermediate',
  '[{"title":"CSS Tricks Flexbox guide","url":"https://css-tricks.com/snippets/css/a-guide-to-flexbox/","type":"article"}]'::jsonb,
  2
),
(
  'a0000004-0002-4000-8000-000000000003',
  'a0000003-0002-4000-8000-000000000002',
  'JavaScript for the DOM',
  'javascript-for-the-dom',
  'Make interfaces interactive with events and state.',
  E'## JavaScript for the DOM\n\nConnect user actions to UI updates.\n\n### Practice\nBuild a small checklist that adds, toggles, and removes items.',
  35,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0002-4000-8000-000000000004',
  'a0000003-0002-4000-8000-000000000002',
  'React Components & State',
  'react-components-and-state',
  'Compose UIs with components, props, and state.',
  E'## React Components & State\n\nReact turns UI into a predictable function of state.\n\n### Core ideas\n- Components as composition units\n- Props down, events up\n- State that earns its place',
  45,
  'intermediate',
  '[{"title":"React docs","url":"https://react.dev/learn","type":"docs"}]'::jsonb,
  2
),
-- Backend
(
  'a0000004-0003-4000-8000-000000000001',
  'a0000003-0003-4000-8000-000000000001',
  'HTTP & REST Fundamentals',
  'http-and-rest-fundamentals',
  'Understand how clients and servers communicate.',
  E'## HTTP & REST Fundamentals\n\nAPIs are contracts between systems.\n\n### You will cover\n- Methods, status codes, headers\n- Resource-oriented design\n- Idempotency and validation',
  35,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0003-4000-8000-000000000002',
  'a0000003-0003-4000-8000-000000000001',
  'Designing Node.js APIs',
  'designing-nodejs-apis',
  'Structure maintainable backend services.',
  E'## Designing Node.js APIs\n\nOrganize routes, services, and data access cleanly.\n\n### Patterns\n- Thin controllers\n- Explicit domain services\n- Consistent error shapes',
  40,
  'intermediate',
  '[]'::jsonb,
  2
),
(
  'a0000004-0003-4000-8000-000000000003',
  'a0000003-0003-4000-8000-000000000002',
  'Authentication Patterns',
  'authentication-patterns',
  'Sessions, JWTs, and when to use each.',
  E'## Authentication Patterns\n\nAuth is a product feature and a security boundary.\n\n### Compare\n- Cookie sessions\n- Bearer tokens\n- OAuth / social login',
  35,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0003-4000-8000-000000000004',
  'a0000003-0003-4000-8000-000000000002',
  'Secure API Defaults',
  'secure-api-defaults',
  'Protect endpoints with practical security basics.',
  E'## Secure API Defaults\n\nSecurity starts with defaults, not afterthoughts.\n\n### Checklist\n- Input validation\n- Rate limiting\n- Least-privilege data access',
  30,
  'advanced',
  '[]'::jsonb,
  2
),
-- Database
(
  'a0000004-0004-4000-8000-000000000001',
  'a0000003-0004-4000-8000-000000000001',
  'SQL Fundamentals',
  'sql-fundamentals',
  'Query and mutate relational data with confidence.',
  E'## SQL Fundamentals\n\nSQL is the language of relational systems.\n\n### Topics\n- SELECT, JOIN, GROUP BY\n- Indexes at a high level\n- Transactions',
  40,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0004-4000-8000-000000000002',
  'a0000003-0004-4000-8000-000000000001',
  'Postgres in Practice',
  'postgres-in-practice',
  'Use Postgres features common in SaaS apps.',
  E'## Postgres in Practice\n\nPostgres powers many production SaaS products.\n\n### Focus\n- Constraints and foreign keys\n- JSONB when it helps\n- RLS concepts',
  35,
  'intermediate',
  '[{"title":"Postgres docs","url":"https://www.postgresql.org/docs/","type":"docs"}]'::jsonb,
  2
),
(
  'a0000004-0004-4000-8000-000000000003',
  'a0000003-0004-4000-8000-000000000002',
  'Schema Design Basics',
  'schema-design-basics',
  'Model entities and relationships for real products.',
  E'## Schema Design Basics\n\nGood schemas encode domain rules.\n\n### Practice\nDesign tables for courses, lessons, and progress — then justify each foreign key.',
  35,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0004-4000-8000-000000000004',
  'a0000003-0004-4000-8000-000000000002',
  'Normalization & Tradeoffs',
  'normalization-and-tradeoffs',
  'Balance purity with query performance and product speed.',
  E'## Normalization & Tradeoffs\n\nNormalization reduces duplication; denormalization can speed reads.\n\n### Decision framework\nWrite down the queries first, then shape the schema.',
  30,
  'advanced',
  '[]'::jsonb,
  2
),
-- DevOps
(
  'a0000004-0005-4000-8000-000000000001',
  'a0000003-0005-4000-8000-000000000001',
  'Environments & Configuration',
  'environments-and-configuration',
  'Separate local, staging, and production safely.',
  E'## Environments & Configuration\n\nNever hardcode secrets. Treat config as part of the architecture.',
  25,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0005-4000-8000-000000000002',
  'a0000003-0005-4000-8000-000000000001',
  'Deploying Web Apps',
  'deploying-web-apps',
  'Ship a full-stack app to a hosted environment.',
  E'## Deploying Web Apps\n\nDeployment is a product skill.\n\n### Steps\n1. Build artifacts\n2. Configure env vars\n3. Verify health checks\n4. Roll forward carefully',
  40,
  'intermediate',
  '[]'::jsonb,
  2
),
(
  'a0000004-0005-4000-8000-000000000003',
  'a0000003-0005-4000-8000-000000000002',
  'Automated Checks',
  'automated-checks',
  'Use lint, typecheck, and tests as release gates.',
  E'## Automated Checks\n\nCI should fail fast and loudly on broken main.',
  30,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0005-4000-8000-000000000004',
  'a0000003-0005-4000-8000-000000000002',
  'Delivery Pipelines',
  'delivery-pipelines',
  'Automate build → test → deploy with confidence.',
  E'## Delivery Pipelines\n\nA pipeline encodes your team''s quality bar.',
  35,
  'advanced',
  '[]'::jsonb,
  2
),
-- AI
(
  'a0000004-0006-4000-8000-000000000001',
  'a0000003-0006-4000-8000-000000000001',
  'How LLMs Work (Practically)',
  'how-llms-work-practically',
  'Enough model intuition to build reliable AI features.',
  E'## How LLMs Work (Practically)\n\nLLMs predict tokens. Product quality comes from context, evaluation, and UX.',
  30,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0006-4000-8000-000000000002',
  'a0000003-0006-4000-8000-000000000001',
  'Prompting & Evaluation',
  'prompting-and-evaluation',
  'Write prompts you can measure and improve.',
  E'## Prompting & Evaluation\n\nTreat prompts like code: version them and test them.',
  35,
  'intermediate',
  '[]'::jsonb,
  2
),
(
  'a0000004-0006-4000-8000-000000000003',
  'a0000003-0006-4000-8000-000000000002',
  'RAG & Tool Use Patterns',
  'rag-and-tool-use-patterns',
  'Ground models in your data and let them take actions.',
  E'## RAG & Tool Use Patterns\n\nRetrieval and tools turn chatbots into product features.',
  45,
  'advanced',
  '[]'::jsonb,
  1
),
(
  'a0000004-0006-4000-8000-000000000004',
  'a0000003-0006-4000-8000-000000000002',
  'Shipping AI in a SaaS Product',
  'shipping-ai-in-a-saas-product',
  'Latency, cost, safety, and UX for production AI.',
  E'## Shipping AI in a SaaS Product\n\nProduction AI needs budgets, fallbacks, and clear user affordances.',
  40,
  'advanced',
  '[]'::jsonb,
  2
),
-- Capstone
(
  'a0000004-0007-4000-8000-000000000001',
  'a0000003-0007-4000-8000-000000000001',
  'Choosing Your Capstone',
  'choosing-your-capstone',
  'Pick a project that demonstrates full-stack + AI skills.',
  E'## Choosing Your Capstone\n\nPick a problem users feel. Scope for a shippable v1 in weeks, not months.',
  25,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0007-4000-8000-000000000002',
  'a0000003-0007-4000-8000-000000000001',
  'Architecture & Delivery Plan',
  'architecture-and-delivery-plan',
  'Design the system and a realistic milestone plan.',
  E'## Architecture & Delivery Plan\n\nWrite the architecture, data model, and weekly milestones before coding heavily.',
  35,
  'advanced',
  '[]'::jsonb,
  2
),
(
  'a0000004-0007-4000-8000-000000000003',
  'a0000003-0007-4000-8000-000000000002',
  'Build, Polish, Launch',
  'build-polish-launch',
  'Execute the plan and ship a credible demo.',
  E'## Build, Polish, Launch\n\nShip a narrow vertical slice first, then polish the story and UX.',
  50,
  'advanced',
  '[]'::jsonb,
  1
),
(
  'a0000004-0007-4000-8000-000000000004',
  'a0000003-0007-4000-8000-000000000002',
  'Portfolio Presentation',
  'portfolio-presentation',
  'Present your work like a professional engineer.',
  E'## Portfolio Presentation\n\nDocument the problem, architecture, tradeoffs, and demo path. Clarity beats volume.',
  30,
  'intermediate',
  '[]'::jsonb,
  2
),
-- Interview Preparation
(
  'a0000004-0008-4000-8000-000000000001',
  'a0000003-0008-4000-8000-000000000001',
  'Coding Interview Patterns',
  'coding-interview-patterns',
  'Recognize and apply the patterns that show up most often in interviews.',
  E'## Coding Interview Patterns\n\nInterview problems repeat. Pattern recognition beats memorization.\n\n### Focus\n- Two pointers and sliding window\n- Hash maps and frequency counting\n- Trees, graphs, and BFS/DFS\n- Talking through tradeoffs out loud',
  40,
  'intermediate',
  '[]'::jsonb,
  1
),
(
  'a0000004-0008-4000-8000-000000000002',
  'a0000003-0008-4000-8000-000000000001',
  'Live Problem Solving',
  'live-problem-solving',
  'Practice clarifying, planning, coding, and verifying under time pressure.',
  E'## Live Problem Solving\n\nA strong interview loop: clarify → examples → plan → code → test.\n\n### Practice\nSolve one medium problem while narrating your approach end to end.',
  45,
  'intermediate',
  '[]'::jsonb,
  2
),
(
  'a0000004-0008-4000-8000-000000000003',
  'a0000003-0008-4000-8000-000000000002',
  'System Design Lite',
  'system-design-lite',
  'Structure answers for junior/mid system design prompts.',
  E'## System Design Lite\n\nStart with requirements, sketch a simple architecture, then deepen bottlenecks.\n\n### Framework\n1. Functional + non-functional requirements\n2. High-level components\n3. Data model\n4. Scaling and failure modes',
  40,
  'advanced',
  '[]'::jsonb,
  1
),
(
  'a0000004-0008-4000-8000-000000000004',
  'a0000003-0008-4000-8000-000000000002',
  'Behavioral Stories That Land',
  'behavioral-stories-that-land',
  'Tell clear impact stories using a consistent structure.',
  E'## Behavioral Stories That Land\n\nUse Situation → Action → Result, and quantify impact when you can.\n\n### Prep\nWrite three stories covering conflict, ownership, and learning from failure.',
  30,
  'beginner',
  '[]'::jsonb,
  2
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  estimated_duration_minutes = excluded.estimated_duration_minutes,
  difficulty = excluded.difficulty,
  resources = excluded.resources,
  sort_order = excluded.sort_order;
