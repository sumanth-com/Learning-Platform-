-- Journey assignment submissions (static catalog → admin review)

create table if not exists public.journey_assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  catalog_id text not null,
  assignment_number integer not null default 0,
  assignment_title text not null default '',
  module_slug text not null default '',
  module_title text not null default '',
  profile_id uuid not null references public.profiles (id) on delete cascade,
  student_name text not null default '',
  student_email text not null default '',
  github_url text not null default '',
  live_url text not null default '',
  screenshots text not null default '',
  notes text not null default '',
  reflection text not null default '',
  status public.submission_status not null default 'submitted',
  marks integer check (marks is null or marks >= 0),
  feedback text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (catalog_id, profile_id)
);

create index if not exists journey_assignment_submissions_profile_id_idx
  on public.journey_assignment_submissions (profile_id);
create index if not exists journey_assignment_submissions_status_idx
  on public.journey_assignment_submissions (status);
create index if not exists journey_assignment_submissions_catalog_id_idx
  on public.journey_assignment_submissions (catalog_id);
create index if not exists journey_assignment_submissions_submitted_at_idx
  on public.journey_assignment_submissions (submitted_at desc);

drop trigger if exists journey_assignment_submissions_set_updated_at
  on public.journey_assignment_submissions;
create trigger journey_assignment_submissions_set_updated_at
  before update on public.journey_assignment_submissions
  for each row execute function public.set_updated_at();

alter table public.journey_assignment_submissions enable row level security;

drop policy if exists "journey_submissions_select_own_or_mentor"
  on public.journey_assignment_submissions;
create policy "journey_submissions_select_own_or_mentor"
  on public.journey_assignment_submissions for select to authenticated
  using (
    profile_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('instructor', 'admin')
    )
  );

drop policy if exists "journey_submissions_insert_own"
  on public.journey_assignment_submissions;
create policy "journey_submissions_insert_own"
  on public.journey_assignment_submissions for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "journey_submissions_update_own_or_mentor"
  on public.journey_assignment_submissions;
create policy "journey_submissions_update_own_or_mentor"
  on public.journey_assignment_submissions for update to authenticated
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
