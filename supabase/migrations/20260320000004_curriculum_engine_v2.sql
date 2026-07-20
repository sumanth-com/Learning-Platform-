-- SupraLearn Curriculum Engine v2
-- Replaces Phase-2 v1 tables with the normalized learning schema.
-- Safe to re-run: drops curriculum tables then recreates them.

drop table if exists public.lesson_progress cascade;
drop table if exists public.lesson_resources cascade;
drop table if exists public.lessons cascade;
drop table if exists public.modules cascade;
drop table if exists public.phases cascade;
drop table if exists public.courses cascade;

do $$ begin
  create type public.course_difficulty as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.lesson_difficulty as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.resource_type as enum ('article', 'docs', 'video', 'github', 'tool', 'other');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  thumbnail text,
  difficulty public.course_difficulty not null default 'beginner',
  estimated_duration text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- phases
-- ---------------------------------------------------------------------------
create table public.phases (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index phases_course_id_idx on public.phases (course_id);
create index phases_sort_order_idx on public.phases (course_id, sort_order);

-- ---------------------------------------------------------------------------
-- modules
-- ---------------------------------------------------------------------------
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.phases (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null default '',
  icon text not null default 'book-open',
  color text not null default 'indigo',
  estimated_duration text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (phase_id, slug)
);

create index modules_phase_id_idx on public.modules (phase_id);
create index modules_slug_idx on public.modules (slug);

-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null default '',
  content text not null default '',
  duration_minutes integer not null default 15 check (duration_minutes > 0),
  difficulty public.lesson_difficulty not null default 'beginner',
  video_url text,
  is_preview boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (module_id, slug)
);

create index lessons_module_id_idx on public.lessons (module_id);
create index lessons_slug_idx on public.lessons (slug);

-- ---------------------------------------------------------------------------
-- lesson_resources
-- ---------------------------------------------------------------------------
create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null,
  type public.resource_type not null default 'other',
  url text not null,
  created_at timestamptz not null default now()
);

create index lesson_resources_lesson_id_idx on public.lesson_resources (lesson_id);

-- ---------------------------------------------------------------------------
-- lesson_progress
-- ---------------------------------------------------------------------------
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (lesson_id, profile_id)
);

create index lesson_progress_profile_id_idx on public.lesson_progress (profile_id);
create index lesson_progress_lesson_id_idx on public.lesson_progress (lesson_id);

-- ---------------------------------------------------------------------------
-- updated_at
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

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.courses enable row level security;
alter table public.phases enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.lesson_progress enable row level security;

create policy "courses_select_published"
  on public.courses for select to authenticated
  using (is_published = true);

create policy "phases_select_authenticated"
  on public.phases for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = phases.course_id and c.is_published = true
    )
  );

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

create policy "lesson_resources_select_authenticated"
  on public.lesson_resources for select to authenticated
  using (
    exists (
      select 1
      from public.lessons l
      join public.modules m on m.id = l.module_id
      join public.phases p on p.id = m.phase_id
      join public.courses c on c.id = p.course_id
      where l.id = lesson_resources.lesson_id and c.is_published = true
    )
  );

create policy "lesson_progress_select_own"
  on public.lesson_progress for select to authenticated
  using (auth.uid() = profile_id);

create policy "lesson_progress_insert_own"
  on public.lesson_progress for insert to authenticated
  with check (auth.uid() = profile_id);

create policy "lesson_progress_update_own"
  on public.lesson_progress for update to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "lesson_progress_delete_own"
  on public.lesson_progress for delete to authenticated
  using (auth.uid() = profile_id);
