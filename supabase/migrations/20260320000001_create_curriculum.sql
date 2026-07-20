-- SupraLearn Phase 2: Curriculum Engine
-- Hierarchy: courses → phases → modules → lessons
-- lesson_progress supports Mark Complete (per-user)

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.lesson_difficulty as enum ('beginner', 'intermediate', 'advanced');
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.courses is 'Top-level learning programs';

-- ---------------------------------------------------------------------------
-- phases
-- ---------------------------------------------------------------------------
create table if not exists public.phases (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index if not exists phases_course_id_idx on public.phases (course_id);
create index if not exists phases_sort_order_idx on public.phases (course_id, sort_order);

-- ---------------------------------------------------------------------------
-- modules
-- ---------------------------------------------------------------------------
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.phases (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (phase_id, slug)
);

create index if not exists modules_phase_id_idx on public.modules (phase_id);
create index if not exists modules_sort_order_idx on public.modules (phase_id, sort_order);

-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null default '',
  content text not null default '',
  estimated_duration_minutes integer not null default 15
    check (estimated_duration_minutes > 0),
  difficulty public.lesson_difficulty not null default 'beginner',
  resources jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

create index if not exists lessons_module_id_idx on public.lessons (module_id);
create index if not exists lessons_sort_order_idx on public.lessons (module_id, sort_order);

-- ---------------------------------------------------------------------------
-- lesson_progress (required for Mark Complete)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists lesson_progress_user_id_idx on public.lesson_progress (user_id);
create index if not exists lesson_progress_lesson_id_idx on public.lesson_progress (lesson_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists phases_set_updated_at on public.phases;
create trigger phases_set_updated_at
  before update on public.phases
  for each row execute function public.set_updated_at();

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.courses enable row level security;
alter table public.phases enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;

-- Published curriculum is readable by authenticated learners
drop policy if exists "courses_select_published" on public.courses;
create policy "courses_select_published"
  on public.courses for select to authenticated
  using (is_published = true);

drop policy if exists "phases_select_authenticated" on public.phases;
create policy "phases_select_authenticated"
  on public.phases for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = phases.course_id and c.is_published = true
    )
  );

drop policy if exists "modules_select_authenticated" on public.modules;
create policy "modules_select_authenticated"
  on public.modules for select to authenticated
  using (
    exists (
      select 1
      from public.phases p
      join public.courses c on c.id = p.course_id
      where p.id = modules.phase_id and c.is_published = true
    )
  );

drop policy if exists "lessons_select_authenticated" on public.lessons;
create policy "lessons_select_authenticated"
  on public.lessons for select to authenticated
  using (
    exists (
      select 1
      from public.modules m
      join public.phases p on p.id = m.phase_id
      join public.courses c on c.id = p.course_id
      where m.id = lessons.module_id and c.is_published = true
    )
  );

-- Progress: own rows only
drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own"
  on public.lesson_progress for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own"
  on public.lesson_progress for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own"
  on public.lesson_progress for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_delete_own" on public.lesson_progress;
create policy "lesson_progress_delete_own"
  on public.lesson_progress for delete to authenticated
  using (auth.uid() = user_id);
