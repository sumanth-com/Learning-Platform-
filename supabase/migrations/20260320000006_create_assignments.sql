-- Phase 3: Assignment Engine
-- Lesson → Assignment → Submission (+ assignment_resources)

do $$ begin
  create type public.assignment_difficulty as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.assignment_resource_type as enum (
    'article', 'docs', 'video', 'github', 'figma', 'other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.submission_status as enum (
    'pending',
    'submitted',
    'under_review',
    'revision_requested',
    'approved'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- assignments
-- ---------------------------------------------------------------------------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null,
  description text not null default '',
  instructions text not null default '',
  difficulty public.assignment_difficulty not null default 'beginner',
  estimated_time text not null default '',
  total_marks integer not null default 100 check (total_marks > 0),
  due_days integer not null default 7 check (due_days > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assignments_lesson_id_idx on public.assignments (lesson_id);
create index if not exists assignments_published_idx on public.assignments (is_published);

-- ---------------------------------------------------------------------------
-- assignment_resources
-- ---------------------------------------------------------------------------
create table if not exists public.assignment_resources (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  title text not null,
  type public.assignment_resource_type not null default 'other',
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists assignment_resources_assignment_id_idx
  on public.assignment_resources (assignment_id);

-- ---------------------------------------------------------------------------
-- assignment_submissions
-- ---------------------------------------------------------------------------
create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  github_url text not null default '',
  demo_url text,
  notes text not null default '',
  status public.submission_status not null default 'pending',
  marks integer check (marks is null or marks >= 0),
  feedback text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, profile_id)
);

create index if not exists assignment_submissions_assignment_id_idx
  on public.assignment_submissions (assignment_id);
create index if not exists assignment_submissions_profile_id_idx
  on public.assignment_submissions (profile_id);
create index if not exists assignment_submissions_status_idx
  on public.assignment_submissions (status);

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

drop trigger if exists assignments_set_updated_at on public.assignments;
create trigger assignments_set_updated_at
  before update on public.assignments
  for each row execute function public.set_updated_at();

drop trigger if exists assignment_submissions_set_updated_at on public.assignment_submissions;
create trigger assignment_submissions_set_updated_at
  before update on public.assignment_submissions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.assignments enable row level security;
alter table public.assignment_resources enable row level security;
alter table public.assignment_submissions enable row level security;

-- Students: published assignments only
drop policy if exists "assignments_select_published" on public.assignments;
create policy "assignments_select_published"
  on public.assignments for select to authenticated
  using (
    is_published = true
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

-- Mentors: full write access
drop policy if exists "assignments_mentor_insert" on public.assignments;
create policy "assignments_mentor_insert"
  on public.assignments for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

drop policy if exists "assignments_mentor_update" on public.assignments;
create policy "assignments_mentor_update"
  on public.assignments for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

drop policy if exists "assignments_mentor_delete" on public.assignments;
create policy "assignments_mentor_delete"
  on public.assignments for delete to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

-- Resources follow assignment visibility
drop policy if exists "assignment_resources_select" on public.assignment_resources;
create policy "assignment_resources_select"
  on public.assignment_resources for select to authenticated
  using (
    exists (
      select 1 from public.assignments a
      where a.id = assignment_resources.assignment_id
        and (
          a.is_published = true
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role in ('instructor', 'admin')
          )
        )
    )
  );

drop policy if exists "assignment_resources_mentor_write" on public.assignment_resources;
create policy "assignment_resources_mentor_insert"
  on public.assignment_resources for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

create policy "assignment_resources_mentor_update"
  on public.assignment_resources for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

create policy "assignment_resources_mentor_delete"
  on public.assignment_resources for delete to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

-- Submissions: students own rows; mentors can read/update all
drop policy if exists "submissions_select_own_or_mentor" on public.assignment_submissions;
create policy "submissions_select_own_or_mentor"
  on public.assignment_submissions for select to authenticated
  using (
    profile_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

drop policy if exists "submissions_insert_own" on public.assignment_submissions;
create policy "submissions_insert_own"
  on public.assignment_submissions for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "submissions_update_own_or_mentor" on public.assignment_submissions;
create policy "submissions_update_own_or_mentor"
  on public.assignment_submissions for update to authenticated
  using (
    profile_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  )
  with check (
    profile_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );
