-- Seed: example assignment for Introduction to HTML lesson

insert into public.assignments (
  id,
  lesson_id,
  title,
  description,
  instructions,
  difficulty,
  estimated_time,
  total_marks,
  due_days,
  is_published
) values (
  'c0000001-0000-4000-8000-000000000001',
  'b0000004-1001-4000-8000-000000000001',
  'Build Your First HTML Page',
  'Create a valid, accessible personal profile page using only HTML. No CSS frameworks required.',
  E'## Instructions\n\n1. Create a repository named `supralearn-html-profile`.\n2. Add an `index.html` with a complete document structure (`<!DOCTYPE html>`, `html`, `head`, `body`).\n3. Include:\n   - A page title\n   - Your name as an `h1`\n   - A short bio paragraph\n   - An unordered list of 3 skills\n   - A link to your GitHub profile\n4. Use semantic landmarks where appropriate (`header`, `main`, `footer`).\n5. Push to GitHub and submit the repository URL.\n\n### Acceptance criteria\n- Valid HTML structure\n- Meaningful link text (not “click here”)\n- At least one list and one external link',
  'beginner',
  '45–60 minutes',
  100,
  7,
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  instructions = excluded.instructions,
  difficulty = excluded.difficulty,
  estimated_time = excluded.estimated_time,
  total_marks = excluded.total_marks,
  due_days = excluded.due_days,
  is_published = excluded.is_published;

insert into public.assignment_resources (id, assignment_id, title, type, url) values
  (
    'c0000002-0000-4000-8000-000000000001',
    'c0000001-0000-4000-8000-000000000001',
    'MDN: Getting started with HTML',
    'docs',
    'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started'
  ),
  (
    'c0000002-0000-4000-8000-000000000002',
    'c0000001-0000-4000-8000-000000000001',
    'HTML element reference',
    'docs',
    'https://developer.mozilla.org/en-US/docs/Web/HTML/Element'
  )
on conflict (id) do update set
  title = excluded.title,
  type = excluded.type,
  url = excluded.url;
