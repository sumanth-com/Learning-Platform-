-- Additive seed: Interview Preparation phase (Phase 2 update)
-- Safe to run after 20260320000002_seed_curriculum.sql

insert into public.phases (id, course_id, title, slug, description, sort_order)
values (
  'a0000002-0008-4000-8000-000000000001',
  'a0000001-0000-4000-8000-000000000001',
  'Interview Preparation',
  'interview-preparation',
  'Prepare for technical interviews with structured practice across DSA, system design, and behavioral rounds.',
  8
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, phase_id, title, slug, description, sort_order) values
  (
    'a0000003-0008-4000-8000-000000000001',
    'a0000002-0008-4000-8000-000000000001',
    'Technical Interview Fundamentals',
    'technical-interview-fundamentals',
    'Core patterns for coding interviews and communication under pressure.',
    1
  ),
  (
    'a0000003-0008-4000-8000-000000000002',
    'a0000002-0008-4000-8000-000000000001',
    'System Design & Behavioral',
    'system-design-and-behavioral',
    'High-level design interviews and storytelling for behavioral rounds.',
    2
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.lessons (
  id, module_id, title, slug, description, content,
  estimated_duration_minutes, difficulty, resources, sort_order
) values
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
