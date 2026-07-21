-- Module 1: fresher developer-thinking topics (replaces Java week-1 topic slugs)

delete from public.lessons
where module_id = 'b0000003-0001-4000-8000-000000000001'
  and slug in (
    'thinking-like-a-developer',
    'what-is-java',
    'jdk-jre-jvm',
    'variables-data-types',
    'operators',
    'type-casting',
    'scanner-input',
    'first-java-program'
  );

insert into public.lessons (
  id, module_id, title, slug, description, content, duration_minutes, difficulty, is_preview, sort_order
) values
  ('b0000004-10f1-4000-8000-000000000001', 'b0000003-0001-4000-8000-000000000001', 'Thinking Like a Developer', 'thinking-like-a-developer', 'Build the mental habits that separate beginners from effective problem solvers.', E'## Thinking Like a Developer\n\nClarity first, code second.', 30, 'beginner', true, 1),
  ('b0000004-10f1-4000-8000-000000000002', 'b0000003-0001-4000-8000-000000000001', 'Breaking Down Problems', 'breaking-down-problems', 'Split overwhelming tasks into small, ordered, doable pieces.', E'## Breaking Down Problems\n\nDecompose before you implement.', 35, 'beginner', false, 2),
  ('b0000004-10f1-4000-8000-000000000003', 'b0000003-0001-4000-8000-000000000001', 'Understanding Requirements', 'understanding-requirements', 'Read specs carefully, spot ambiguity, and define done clearly.', E'## Understanding Requirements\n\nAsk questions early.', 35, 'beginner', false, 3),
  ('b0000004-10f1-4000-8000-000000000004', 'b0000003-0001-4000-8000-000000000001', 'Pseudocode & Flowcharts', 'pseudocode-and-flowcharts', 'Plan logic on paper before touching an editor.', E'## Pseudocode & Flowcharts\n\nPlan before code.', 40, 'beginner', false, 4),
  ('b0000004-10f1-4000-8000-000000000005', 'b0000003-0001-4000-8000-000000000001', 'Variables & State', 'variables-and-state', 'How programs remember information and why naming matters.', E'## Variables & State\n\nName data clearly.', 35, 'beginner', false, 5),
  ('b0000004-10f1-4000-8000-000000000006', 'b0000003-0001-4000-8000-000000000001', 'Logic & Decisions', 'logic-and-decisions', 'Conditions, truth tables, and branching like a developer.', E'## Logic & Decisions\n\nEvery app makes choices.', 40, 'beginner', false, 6),
  ('b0000004-10f1-4000-8000-000000000007', 'b0000003-0001-4000-8000-000000000001', 'Patterns & Debugging', 'patterns-and-debugging', 'Loops, repetition, and a calm process when something breaks.', E'## Patterns & Debugging\n\nHypothesis, test, learn.', 45, 'beginner', false, 7)
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  content = excluded.content,
  duration_minutes = excluded.duration_minutes,
  difficulty = excluded.difficulty,
  is_preview = excluded.is_preview,
  sort_order = excluded.sort_order;

update public.modules
set description = 'How developers think, structure logic, and solve problems — built for freshers.'
where slug = 'programming-fundamentals';
