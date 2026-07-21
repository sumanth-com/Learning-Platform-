-- Programming Fundamentals: 7 Java week-1 topics + 60 challenges (20/20/20 via learning engine)

delete from public.lessons
where module_id = 'b0000003-0001-4000-8000-000000000001'
  and slug = 'thinking-like-a-developer';

insert into public.lessons (
  id, module_id, title, slug, description, content, duration_minutes, difficulty, is_preview, sort_order
) values
  (
    'b0000004-10f1-4000-8000-000000000001',
    'b0000003-0001-4000-8000-000000000001',
    'What is Java?',
    'what-is-java',
    'Platform, JVM, and why Java powers enterprise backends.',
    E'## What is Java?\n\nJava is a compiled, object-oriented language that runs on the **Java Virtual Machine (JVM)**.',
    30,
    'beginner',
    true,
    1
  ),
  (
    'b0000004-10f1-4000-8000-000000000002',
    'b0000003-0001-4000-8000-000000000001',
    'JDK, JRE & JVM',
    'jdk-jre-jvm',
    'Understand the runtime stack behind every Java program.',
    E'## JDK, JRE & JVM\n\nJVM executes bytecode; JRE runs apps; JDK builds them.',
    35,
    'beginner',
    false,
    2
  ),
  (
    'b0000004-10f1-4000-8000-000000000003',
    'b0000003-0001-4000-8000-000000000001',
    'Variables & Data Types',
    'variables-data-types',
    'Store state with primitives, references, and naming conventions.',
    E'## Variables & Data Types\n\nPrimitives vs references; naming and initialization.',
    40,
    'beginner',
    false,
    3
  ),
  (
    'b0000004-10f1-4000-8000-000000000004',
    'b0000003-0001-4000-8000-000000000001',
    'Operators',
    'operators',
    'Arithmetic, comparison, logical, and assignment operators.',
    E'## Operators\n\nCombine values with arithmetic and logical operators.',
    35,
    'beginner',
    false,
    4
  ),
  (
    'b0000004-10f1-4000-8000-000000000005',
    'b0000003-0001-4000-8000-000000000001',
    'Type Casting',
    'type-casting',
    'Widen, narrow, and convert between compatible types safely.',
    E'## Type Casting\n\nWidening is implicit; narrowing needs explicit casts.',
    30,
    'beginner',
    false,
    5
  ),
  (
    'b0000004-10f1-4000-8000-000000000006',
    'b0000003-0001-4000-8000-000000000001',
    'User Input (Scanner)',
    'scanner-input',
    'Read interactive input from the console with Scanner.',
    E'## User Input (Scanner)\n\nUse java.util.Scanner to read from System.in.',
    35,
    'beginner',
    false,
    6
  ),
  (
    'b0000004-10f1-4000-8000-000000000007',
    'b0000003-0001-4000-8000-000000000001',
    'First Java Program',
    'first-java-program',
    'Structure, main method, compile, and run your first app.',
    E'## First Java Program\n\njavac → java → ship a working console program.',
    45,
    'beginner',
    false,
    7
  )
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
set
  description = 'Java fundamentals — 7 topics and 60 practice challenges (20 easy, 20 medium, 20 hard).',
  estimated_duration = '1 week'
where slug = 'programming-fundamentals';
