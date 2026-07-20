-- Seed: Full Stack + AI Engineering (Curriculum Engine v2)

-- Course
insert into public.courses (
  id, title, slug, description, thumbnail, difficulty, estimated_duration, is_published
) values (
  'b0000001-0000-4000-8000-000000000001',
  'Full Stack + AI Engineering',
  'full-stack-ai-engineering',
  'A structured path from developer fundamentals through frontend, backend, databases, DevOps, AI engineering, capstones, and interview prep.',
  null,
  'intermediate',
  '6–9 months',
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  estimated_duration = excluded.estimated_duration,
  is_published = excluded.is_published;

-- Phases
insert into public.phases (id, course_id, title, slug, description, sort_order) values
  ('b0000002-0001-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Developer Foundation', 'developer-foundation', 'Core programming mindset, tooling, and problem-solving habits.', 1),
  ('b0000002-0002-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Frontend Development', 'frontend-development', 'Build polished user interfaces with modern web technologies.', 2),
  ('b0000002-0003-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Backend Development', 'backend-development', 'Design APIs, services, and secure application backends.', 3),
  ('b0000002-0004-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Database Engineering', 'database-engineering', 'Model, query, and operate reliable data systems.', 4),
  ('b0000002-0005-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'DevOps', 'devops', 'Ship software safely with deployment, monitoring, and CI/CD.', 5),
  ('b0000002-0006-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'AI Engineering', 'ai-engineering', 'Integrate LLMs and AI systems into real products.', 6),
  ('b0000002-0007-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Capstone Projects', 'capstone-projects', 'Apply everything by shipping portfolio-ready products.', 7),
  ('b0000002-0008-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Interview Preparation', 'interview-preparation', 'Prepare for technical interviews across coding, system design, and behavioral rounds.', 8)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- Modules (Frontend fully specified; other phases scaffolded)
insert into public.modules (
  id, phase_id, title, slug, description, icon, color, estimated_duration, sort_order
) values
  -- Developer Foundation
  ('b0000003-0001-4000-8000-000000000001', 'b0000002-0001-4000-8000-000000000001', 'Programming Fundamentals', 'programming-fundamentals', 'How developers think, structure logic, and solve problems.', 'code-2', 'sky', '1 week', 1),
  ('b0000003-0001-4000-8000-000000000002', 'b0000002-0001-4000-8000-000000000001', 'Developer Tooling', 'developer-tooling', 'Git, terminal, and editor workflows used every day.', 'terminal', 'violet', '1 week', 2),
  -- Frontend Development (required detail)
  ('b0000003-0002-4000-8000-000000000001', 'b0000002-0002-4000-8000-000000000001', 'HTML', 'html', 'Structure the web with semantic markup and accessible documents.', 'file-code', 'orange', '1–2 weeks', 1),
  ('b0000003-0002-4000-8000-000000000002', 'b0000002-0002-4000-8000-000000000001', 'CSS', 'css', 'Layout, visual design, and responsive interfaces.', 'palette', 'pink', '2 weeks', 2),
  ('b0000003-0002-4000-8000-000000000003', 'b0000002-0002-4000-8000-000000000001', 'JavaScript', 'javascript', 'Language fundamentals for interactive web apps.', 'braces', 'amber', '3 weeks', 3),
  ('b0000003-0002-4000-8000-000000000004', 'b0000002-0002-4000-8000-000000000001', 'React', 'react', 'Component-driven UI with props, state, and effects.', 'atom', 'cyan', '3 weeks', 4),
  ('b0000003-0002-4000-8000-000000000005', 'b0000002-0002-4000-8000-000000000001', 'Next.js', 'nextjs', 'Full-stack React framework for production apps.', 'layers', 'zinc', '2 weeks', 5),
  ('b0000003-0002-4000-8000-000000000006', 'b0000002-0002-4000-8000-000000000001', 'TypeScript', 'typescript', 'Typed JavaScript for safer, scalable frontends.', 'file-type', 'blue', '2 weeks', 6),
  -- Backend
  ('b0000003-0003-4000-8000-000000000001', 'b0000002-0003-4000-8000-000000000001', 'APIs & Services', 'apis-and-services', 'HTTP, REST, and service design.', 'server', 'emerald', '2 weeks', 1),
  ('b0000003-0003-4000-8000-000000000002', 'b0000002-0003-4000-8000-000000000001', 'Auth & Security', 'auth-and-security', 'Sessions, tokens, and secure defaults.', 'shield', 'red', '2 weeks', 2),
  -- Database
  ('b0000003-0004-4000-8000-000000000001', 'b0000002-0004-4000-8000-000000000001', 'Relational Databases', 'relational-databases', 'SQL, schemas, and query fundamentals.', 'database', 'teal', '2 weeks', 1),
  ('b0000003-0004-4000-8000-000000000002', 'b0000002-0004-4000-8000-000000000001', 'Data Modeling', 'data-modeling', 'Design schemas that scale with your product.', 'git-branch', 'lime', '1 week', 2),
  -- DevOps
  ('b0000003-0005-4000-8000-000000000001', 'b0000002-0005-4000-8000-000000000001', 'Deployment Essentials', 'deployment-essentials', 'Environments, hosting, and release basics.', 'cloud', 'indigo', '1 week', 1),
  ('b0000003-0005-4000-8000-000000000002', 'b0000002-0005-4000-8000-000000000001', 'CI/CD Fundamentals', 'ci-cd-fundamentals', 'Automated checks and delivery pipelines.', 'workflow', 'fuchsia', '1 week', 2),
  -- AI
  ('b0000003-0006-4000-8000-000000000001', 'b0000002-0006-4000-8000-000000000001', 'LLM Fundamentals', 'llm-fundamentals', 'How large language models work in practice.', 'brain', 'purple', '2 weeks', 1),
  ('b0000003-0006-4000-8000-000000000002', 'b0000002-0006-4000-8000-000000000001', 'Building AI Features', 'building-ai-features', 'Prompting, tools, and product integration patterns.', 'sparkles', 'violet', '2 weeks', 2),
  -- Capstone
  ('b0000003-0007-4000-8000-000000000001', 'b0000002-0007-4000-8000-000000000001', 'Capstone Planning', 'capstone-planning', 'Scope, architecture, and delivery planning.', 'map', 'amber', '1 week', 1),
  ('b0000003-0007-4000-8000-000000000002', 'b0000002-0007-4000-8000-000000000001', 'Ship the Product', 'ship-the-product', 'Polish, launch, and present your work.', 'rocket', 'orange', '2 weeks', 2),
  -- Interview
  ('b0000003-0008-4000-8000-000000000001', 'b0000002-0008-4000-8000-000000000001', 'Technical Interviews', 'technical-interviews', 'Coding patterns and communication under pressure.', 'target', 'rose', '2 weeks', 1),
  ('b0000003-0008-4000-8000-000000000002', 'b0000002-0008-4000-8000-000000000001', 'System Design & Behavioral', 'system-design-behavioral', 'Design interviews and storytelling for behavioral rounds.', 'messages-square', 'sky', '2 weeks', 2)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  color = excluded.color,
  estimated_duration = excluded.estimated_duration,
  sort_order = excluded.sort_order;

-- HTML lessons (required detail)
insert into public.lessons (
  id, module_id, title, slug, description, content, duration_minutes, difficulty, video_url, is_preview, sort_order
) values
(
  'b0000004-1001-4000-8000-000000000001',
  'b0000003-0002-4000-8000-000000000001',
  'Introduction to HTML',
  'introduction-to-html',
  'What HTML is, how browsers parse documents, and how pages are structured.',
  E'## Introduction to HTML\n\nHTML is the skeleton of every web page.\n\n### Goals\n- Understand documents, elements, and attributes\n- Create a minimal valid HTML page\n- Inspect markup in browser DevTools\n\n### Practice\nCreate an `index.html` with a title, heading, paragraph, and link.',
  20,
  'beginner',
  null,
  true,
  1
),
(
  'b0000004-1001-4000-8000-000000000002',
  'b0000003-0002-4000-8000-000000000001',
  'HTML Elements',
  'html-elements',
  'Core text, list, and link elements used in everyday pages.',
  E'## HTML Elements\n\nElements describe content meaning.\n\n### Cover\n- Headings and paragraphs\n- Lists and links\n- Inline vs block elements',
  25,
  'beginner',
  null,
  false,
  2
),
(
  'b0000004-1001-4000-8000-000000000003',
  'b0000003-0002-4000-8000-000000000001',
  'Forms',
  'forms',
  'Collect user input with labels, inputs, and validation-friendly markup.',
  E'## Forms\n\nForms are how users talk to your product.\n\n### Topics\n- Input types\n- Labels and accessibility\n- Buttons and submission',
  30,
  'beginner',
  null,
  false,
  3
),
(
  'b0000004-1001-4000-8000-000000000004',
  'b0000003-0002-4000-8000-000000000001',
  'Tables',
  'tables',
  'Present tabular data correctly without using tables for layout.',
  E'## Tables\n\nUse tables for data, not page layout.\n\n### Practice\nBuild a simple pricing comparison table with headers and captions.',
  20,
  'beginner',
  null,
  false,
  4
),
(
  'b0000004-1001-4000-8000-000000000005',
  'b0000003-0002-4000-8000-000000000001',
  'Semantic HTML',
  'semantic-html',
  'Choose elements that communicate structure to browsers and assistive tech.',
  E'## Semantic HTML\n\nSemantics improve accessibility, SEO, and maintainability.\n\n### Landmarks\n- header, nav, main, article, section, footer',
  25,
  'intermediate',
  null,
  false,
  5
),
(
  'b0000004-1001-4000-8000-000000000006',
  'b0000003-0002-4000-8000-000000000001',
  'Media',
  'media',
  'Embed images, audio, and video with responsive and accessible defaults.',
  E'## Media\n\nMedia makes interfaces richer — and heavier.\n\n### Checklist\n- Meaningful alt text\n- Responsive images\n- Captions when needed',
  25,
  'beginner',
  null,
  false,
  6
),
(
  'b0000004-1001-4000-8000-000000000007',
  'b0000003-0002-4000-8000-000000000001',
  'Accessibility',
  'accessibility',
  'Build HTML that works for keyboard users and screen readers.',
  E'## Accessibility\n\nAccessibility is part of quality, not a polish pass.\n\n### Focus\n- Keyboard navigation\n- Labels and names\n- Color is not the only signal',
  30,
  'intermediate',
  null,
  false,
  7
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  duration_minutes = excluded.duration_minutes,
  difficulty = excluded.difficulty,
  sort_order = excluded.sort_order;

-- Starter lessons for other Frontend modules + key non-frontend modules
insert into public.lessons (
  id, module_id, title, slug, description, content, duration_minutes, difficulty, is_preview, sort_order
) values
  ('b0000004-1002-4000-8000-000000000001', 'b0000003-0002-4000-8000-000000000002', 'CSS Fundamentals', 'css-fundamentals', 'Selectors, the cascade, and the box model.', E'## CSS Fundamentals\n\nStyle is structure plus presentation.', 25, 'beginner', true, 1),
  ('b0000004-1002-4000-8000-000000000002', 'b0000003-0002-4000-8000-000000000002', 'Flexbox & Grid', 'flexbox-and-grid', 'Modern layout systems for responsive UI.', E'## Flexbox & Grid\n\nChoose Flex for one axis, Grid for two.', 35, 'intermediate', false, 2),
  ('b0000004-1003-4000-8000-000000000001', 'b0000003-0002-4000-8000-000000000003', 'JavaScript Basics', 'javascript-basics', 'Variables, functions, and control flow.', E'## JavaScript Basics\n\nJS powers interactivity in the browser.', 30, 'beginner', true, 1),
  ('b0000004-1003-4000-8000-000000000002', 'b0000003-0002-4000-8000-000000000003', 'DOM & Events', 'dom-and-events', 'Connect user actions to UI updates.', E'## DOM & Events\n\nListen, update, and keep state coherent.', 35, 'intermediate', false, 2),
  ('b0000004-1004-4000-8000-000000000001', 'b0000003-0002-4000-8000-000000000004', 'React Components', 'react-components', 'Compose UI with components and props.', E'## React Components\n\nUI as a function of state.', 30, 'intermediate', true, 1),
  ('b0000004-1004-4000-8000-000000000002', 'b0000003-0002-4000-8000-000000000004', 'State & Effects', 'state-and-effects', 'Manage local state and side effects.', E'## State & Effects\n\nState earns its place; effects are explicit.', 40, 'intermediate', false, 2),
  ('b0000004-1005-4000-8000-000000000001', 'b0000003-0002-4000-8000-000000000005', 'Next.js App Router', 'nextjs-app-router', 'Routing, layouts, and server components.', E'## Next.js App Router\n\nFile-system routing with RSC defaults.', 35, 'intermediate', true, 1),
  ('b0000004-1006-4000-8000-000000000001', 'b0000003-0002-4000-8000-000000000006', 'TypeScript Essentials', 'typescript-essentials', 'Types, interfaces, and safer refactors.', E'## TypeScript Essentials\n\nTypes document intent and catch bugs early.', 30, 'intermediate', true, 1),
  ('b0000004-1007-4000-8000-000000000001', 'b0000003-0001-4000-8000-000000000001', 'Thinking Like a Developer', 'thinking-like-a-developer', 'Decompose problems before writing code.', E'## Thinking Like a Developer\n\nClarity first, code second.', 25, 'beginner', true, 1),
  ('b0000004-1008-4000-8000-000000000001', 'b0000003-0001-4000-8000-000000000002', 'Git & GitHub Essentials', 'git-and-github-essentials', 'Version control workflows for daily work.', E'## Git & GitHub Essentials\n\nCommit early, commit often, explain why.', 30, 'beginner', true, 1),
  ('b0000004-1009-4000-8000-000000000001', 'b0000003-0003-4000-8000-000000000001', 'HTTP & REST Fundamentals', 'http-and-rest-fundamentals', 'How clients and servers communicate.', E'## HTTP & REST Fundamentals\n\nAPIs are contracts.', 35, 'intermediate', true, 1),
  ('b0000004-100a-4000-8000-000000000001', 'b0000003-0004-4000-8000-000000000001', 'SQL Fundamentals', 'sql-fundamentals', 'Query and mutate relational data.', E'## SQL Fundamentals\n\nSpeak the language of data.', 40, 'intermediate', true, 1),
  ('b0000004-100b-4000-8000-000000000001', 'b0000003-0005-4000-8000-000000000001', 'Deploying Web Apps', 'deploying-web-apps', 'Ship a full-stack app to a hosted environment.', E'## Deploying Web Apps\n\nDeployment is a product skill.', 35, 'intermediate', true, 1),
  ('b0000004-100c-4000-8000-000000000001', 'b0000003-0006-4000-8000-000000000001', 'How LLMs Work Practically', 'how-llms-work-practically', 'Enough model intuition to build features.', E'## How LLMs Work Practically\n\nTokens, context, and product quality.', 30, 'intermediate', true, 1),
  ('b0000004-100d-4000-8000-000000000001', 'b0000003-0007-4000-8000-000000000001', 'Choosing Your Capstone', 'choosing-your-capstone', 'Pick a project that demonstrates full-stack + AI skills.', E'## Choosing Your Capstone\n\nScope for a shippable v1.', 25, 'intermediate', true, 1),
  ('b0000004-100e-4000-8000-000000000001', 'b0000003-0008-4000-8000-000000000001', 'Coding Interview Patterns', 'coding-interview-patterns', 'Patterns that show up most often in interviews.', E'## Coding Interview Patterns\n\nPattern recognition beats memorization.', 40, 'intermediate', true, 1)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  duration_minutes = excluded.duration_minutes,
  difficulty = excluded.difficulty,
  sort_order = excluded.sort_order;

-- Sample resources for HTML intro lesson
insert into public.lesson_resources (id, lesson_id, title, type, url) values
  (
    'b0000005-0001-4000-8000-000000000001',
    'b0000004-1001-4000-8000-000000000001',
    'MDN: HTML basics',
    'docs',
    'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics'
  ),
  (
    'b0000005-0001-4000-8000-000000000002',
    'b0000004-1001-4000-8000-000000000001',
    'HTML Living Standard',
    'docs',
    'https://html.spec.whatwg.org/'
  ),
  (
    'b0000005-0001-4000-8000-000000000003',
    'b0000004-1001-4000-8000-000000000007',
    'WAI-ARIA Authoring Practices',
    'docs',
    'https://www.w3.org/WAI/ARIA/apg/'
  )
on conflict (id) do update set
  title = excluded.title,
  type = excluded.type,
  url = excluded.url;
