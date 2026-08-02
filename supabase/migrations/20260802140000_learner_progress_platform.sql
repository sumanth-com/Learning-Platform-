-- ============================================================================
-- Learner progress platform (additive only — never drops user data)
-- Restore strategy: Supabase PITR / daily backups. No destructive DDL.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles.headline (optional)
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists headline text;

-- ---------------------------------------------------------------------------
-- learner_stats
-- ---------------------------------------------------------------------------
create table if not exists public.learner_stats (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer not null default 1 check (level >= 1),
  streak integer not null default 0 check (streak >= 0),
  last_active_date date,
  total_study_hours numeric(10,2) not null default 0 check (total_study_hours >= 0),
  current_week integer not null default 1 check (current_week >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists learner_stats_set_updated_at on public.learner_stats;
create trigger learner_stats_set_updated_at
  before update on public.learner_stats
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- xp_ledger (append-only awards; unique source_key prevents duplicates)
-- ---------------------------------------------------------------------------
create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  amount integer not null check (amount > 0),
  source_key text not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  unique (profile_id, source_key)
);

create index if not exists xp_ledger_profile_created_idx
  on public.xp_ledger (profile_id, created_at desc);

-- ---------------------------------------------------------------------------
-- entity_progress (universal completion map)
-- ---------------------------------------------------------------------------
create table if not exists public.entity_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  entity_id text not null,
  completed boolean not null default true,
  completed_at timestamptz,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, entity_id)
);

create index if not exists entity_progress_profile_completed_idx
  on public.entity_progress (profile_id, completed_at desc);

drop trigger if exists entity_progress_set_updated_at on public.entity_progress;
create trigger entity_progress_set_updated_at
  before update on public.entity_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- module_gates
-- ---------------------------------------------------------------------------
create table if not exists public.module_gates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  module text not null,
  unlocked_week_ids integer[] not null default '{1}',
  completed_week_ids integer[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (profile_id, module)
);

drop trigger if exists module_gates_set_updated_at on public.module_gates;
create trigger module_gates_set_updated_at
  before update on public.module_gates
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- learner_notes (Notes workspace)
-- ---------------------------------------------------------------------------
create table if not exists public.learner_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default '',
  content text not null default '',
  week_id integer,
  pinned boolean not null default false,
  accent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learner_notes_profile_updated_idx
  on public.learner_notes (profile_id, updated_at desc);

drop trigger if exists learner_notes_set_updated_at on public.learner_notes;
create trigger learner_notes_set_updated_at
  before update on public.learner_notes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- entity_notes + week_notes
-- ---------------------------------------------------------------------------
create table if not exists public.entity_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  entity_id text not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  unique (profile_id, entity_id)
);

create table if not exists public.week_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  week_id integer not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  unique (profile_id, week_id)
);

-- ---------------------------------------------------------------------------
-- learner_bookmarks
-- ---------------------------------------------------------------------------
create table if not exists public.learner_bookmarks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  entity_id text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, entity_id)
);

create index if not exists learner_bookmarks_profile_idx
  on public.learner_bookmarks (profile_id, created_at desc);

-- ---------------------------------------------------------------------------
-- project_progress
-- ---------------------------------------------------------------------------
create table if not exists public.project_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  project_id text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default 'not-started'
    check (status in ('not-started', 'in-progress', 'completed')),
  github_link text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now(),
  unique (profile_id, project_id)
);

drop trigger if exists project_progress_set_updated_at on public.project_progress;
create trigger project_progress_set_updated_at
  before update on public.project_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- assignment_local_meta (drafts + solved mirror)
-- ---------------------------------------------------------------------------
create table if not exists public.assignment_local_meta (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  catalog_id text not null,
  status text not null default 'not_started',
  github_url text not null default '',
  live_url text not null default '',
  screenshots text not null default '',
  notes text not null default '',
  reflection text not null default '',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  feedback text,
  marks integer,
  updated_at timestamptz not null default now(),
  unique (profile_id, catalog_id)
);

drop trigger if exists assignment_local_meta_set_updated_at on public.assignment_local_meta;
create trigger assignment_local_meta_set_updated_at
  before update on public.assignment_local_meta
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- learner_resume
-- ---------------------------------------------------------------------------
create table if not exists public.learner_resume (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  module text not null default 'practice',
  week_id integer not null default 1,
  title text not null default '',
  subtitle text,
  href text not null default '/dashboard',
  topic_slug text,
  topic_title text,
  lesson_id text,
  updated_at timestamptz not null default now()
);

drop trigger if exists learner_resume_set_updated_at on public.learner_resume;
create trigger learner_resume_set_updated_at
  before update on public.learner_resume
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- learner_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.learner_preferences (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  notifications_muted boolean not null default false,
  notification_sound text not null default 'chime',
  notify_learning boolean not null default true,
  notify_mentor boolean not null default true,
  notify_achievements boolean not null default true,
  celebrations_enabled boolean not null default true,
  today_goal text not null default '',
  today_goal_date date,
  today_goal_completed boolean not null default false,
  celebrated_week_ids integer[] not null default '{}',
  scroll_positions jsonb not null default '{}'::jsonb,
  github_repo_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists learner_preferences_set_updated_at on public.learner_preferences;
create trigger learner_preferences_set_updated_at
  before update on public.learner_preferences
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- learner_notifications
-- ---------------------------------------------------------------------------
create table if not exists public.learner_notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  channel text not null check (channel in ('learning', 'mentor', 'achievements')),
  title text not null,
  body text not null default '',
  href text,
  kind text not null default 'generic',
  meta jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists learner_notifications_profile_created_idx
  on public.learner_notifications (profile_id, created_at desc);

-- ---------------------------------------------------------------------------
-- achievements
-- ---------------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  achievement_key text not null,
  title text not null default '',
  awarded_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb,
  unique (profile_id, achievement_key)
);

-- ---------------------------------------------------------------------------
-- cert_attempts
-- ---------------------------------------------------------------------------
create table if not exists public.cert_attempts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  certification_id text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'in_progress',
  score integer,
  updated_at timestamptz not null default now(),
  unique (profile_id, certification_id)
);

drop trigger if exists cert_attempts_set_updated_at on public.cert_attempts;
create trigger cert_attempts_set_updated_at
  before update on public.cert_attempts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- hub_library
-- ---------------------------------------------------------------------------
create table if not exists public.hub_library (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  bookmarks text[] not null default '{}',
  liked text[] not null default '{}',
  recent jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists hub_library_set_updated_at on public.hub_library;
create trigger hub_library_set_updated_at
  before update on public.hub_library
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- study_sessions
-- ---------------------------------------------------------------------------
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  session_date date not null,
  hours numeric(6,2) not null default 0 check (hours >= 0),
  week_id integer not null default 1,
  created_at timestamptz not null default now(),
  unique (profile_id, session_date)
);

-- ---------------------------------------------------------------------------
-- audit_events (append-only; students cannot insert directly)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_profile_created_idx
  on public.audit_events (profile_id, created_at desc);
create index if not exists audit_events_type_created_idx
  on public.audit_events (event_type, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.learner_stats enable row level security;
alter table public.xp_ledger enable row level security;
alter table public.entity_progress enable row level security;
alter table public.module_gates enable row level security;
alter table public.learner_notes enable row level security;
alter table public.entity_notes enable row level security;
alter table public.week_notes enable row level security;
alter table public.learner_bookmarks enable row level security;
alter table public.project_progress enable row level security;
alter table public.assignment_local_meta enable row level security;
alter table public.learner_resume enable row level security;
alter table public.learner_preferences enable row level security;
alter table public.learner_notifications enable row level security;
alter table public.achievements enable row level security;
alter table public.cert_attempts enable row level security;
alter table public.hub_library enable row level security;
alter table public.study_sessions enable row level security;
alter table public.audit_events enable row level security;

-- Own-row policies (students)
do $$
declare
  t text;
begin
  foreach t in array array[
    'learner_stats','entity_progress','module_gates','learner_notes',
    'entity_notes','week_notes','learner_bookmarks','project_progress',
    'assignment_local_meta','learner_resume','learner_preferences',
    'learner_notifications','achievements','cert_attempts','hub_library',
    'study_sessions'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_select_own', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (profile_id = auth.uid() or public.is_staff())',
      t || '_select_own', t
    );
    execute format('drop policy if exists %I on public.%I', t || '_insert_own', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (profile_id = auth.uid())',
      t || '_insert_own', t
    );
    execute format('drop policy if exists %I on public.%I', t || '_update_own', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid())',
      t || '_update_own', t
    );
    execute format('drop policy if exists %I on public.%I', t || '_delete_own', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (profile_id = auth.uid())',
      t || '_delete_own', t
    );
  end loop;
end $$;

-- xp_ledger: select own; no direct client insert/update/delete
drop policy if exists "xp_ledger_select_own" on public.xp_ledger;
create policy "xp_ledger_select_own"
  on public.xp_ledger for select to authenticated
  using (profile_id = auth.uid() or public.is_staff());

-- audit_events: staff select; no client writes
drop policy if exists "audit_events_select_staff" on public.audit_events;
create policy "audit_events_select_staff"
  on public.audit_events for select to authenticated
  using (public.is_staff() or profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Helpers + RPCs
-- ---------------------------------------------------------------------------

create or replace function public.compute_learner_level(p_xp integer)
returns integer
language sql
immutable
as $$
  select greatest(1, floor(sqrt(greatest(p_xp, 0)::numeric / 100.0))::integer + 1);
$$;

create or replace function public.ensure_learner_workspace(p_profile_id uuid default auth.uid())
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := coalesce(p_profile_id, auth.uid());
  modules text[] := array[
    'roadmap','practice','ai-skills','projects','github','interview','communication'
  ];
  m text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if uid <> auth.uid() and not public.is_staff() then
    raise exception 'Forbidden';
  end if;

  insert into public.learner_stats (profile_id)
  values (uid)
  on conflict (profile_id) do nothing;

  insert into public.learner_preferences (profile_id)
  values (uid)
  on conflict (profile_id) do nothing;

  insert into public.hub_library (profile_id)
  values (uid)
  on conflict (profile_id) do nothing;

  foreach m in array modules
  loop
    insert into public.module_gates (profile_id, module, unlocked_week_ids, completed_week_ids)
    values (uid, m, array[1], array[]::integer[])
    on conflict (profile_id, module) do nothing;
  end loop;
end;
$$;

revoke all on function public.ensure_learner_workspace(uuid) from public;
grant execute on function public.ensure_learner_workspace(uuid) to authenticated;

create or replace function public._award_xp(
  p_profile_id uuid,
  p_amount integer,
  p_source_key text,
  p_reason text default ''
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted boolean := false;
begin
  if p_amount is null or p_amount <= 0 then
    return false;
  end if;

  begin
    insert into public.xp_ledger (profile_id, amount, source_key, reason)
    values (p_profile_id, p_amount, p_source_key, coalesce(p_reason, ''));
    inserted := true;
  exception when unique_violation then
    return false;
  end;

  insert into public.learner_stats (profile_id, total_xp, level)
  values (p_profile_id, p_amount, public.compute_learner_level(p_amount))
  on conflict (profile_id) do update
    set total_xp = public.learner_stats.total_xp + excluded.total_xp,
        level = public.compute_learner_level(public.learner_stats.total_xp + excluded.total_xp),
        updated_at = now();

  insert into public.audit_events (profile_id, actor_id, event_type, entity_type, entity_id, payload)
  values (
    p_profile_id, p_profile_id, 'xp_awarded', 'xp_ledger', p_source_key,
    jsonb_build_object('amount', p_amount, 'reason', coalesce(p_reason, ''))
  );

  return inserted;
end;
$$;

create or replace function public._touch_streak(p_profile_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := (timezone('utc', now()))::date;
  yesterday date := today - 1;
  cur_streak integer;
  last_day date;
begin
  perform public.ensure_learner_workspace(p_profile_id);

  select streak, last_active_date into cur_streak, last_day
  from public.learner_stats
  where profile_id = p_profile_id
  for update;

  if last_day = today then
    return cur_streak;
  elsif last_day = yesterday then
    cur_streak := coalesce(cur_streak, 0) + 1;
  else
    cur_streak := 1;
  end if;

  update public.learner_stats
  set streak = cur_streak,
      last_active_date = today,
      updated_at = now()
  where profile_id = p_profile_id;

  return cur_streak;
end;
$$;

create or replace function public.touch_daily_activity()
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  return public._touch_streak(auth.uid());
end;
$$;

revoke all on function public.touch_daily_activity() from public;
grant execute on function public.touch_daily_activity() to authenticated;

create or replace function public._push_notification(
  p_profile_id uuid,
  p_channel text,
  p_title text,
  p_body text,
  p_href text default null,
  p_kind text default 'generic',
  p_meta jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  nid uuid;
begin
  insert into public.learner_notifications (
    profile_id, channel, title, body, href, kind, meta
  ) values (
    p_profile_id, p_channel, p_title, coalesce(p_body, ''), p_href,
    coalesce(p_kind, 'generic'), coalesce(p_meta, '{}'::jsonb)
  )
  returning id into nid;

  -- Keep inbox bounded
  delete from public.learner_notifications n
  where n.profile_id = p_profile_id
    and n.id not in (
      select id from public.learner_notifications
      where profile_id = p_profile_id
      order by created_at desc
      limit 80
    );

  return nid;
end;
$$;

create or replace function public.complete_entity(
  p_entity_id text,
  p_xp integer default 0,
  p_source_key text default null,
  p_completed boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  source text;
  awarded boolean := false;
  streak_val integer;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_entity_id is null or length(trim(p_entity_id)) = 0 then
    raise exception 'entity_id required';
  end if;

  perform public.ensure_learner_workspace(uid);

  if p_completed then
    insert into public.entity_progress (profile_id, entity_id, completed, completed_at, xp_earned)
    values (uid, p_entity_id, true, now(), greatest(coalesce(p_xp, 0), 0))
    on conflict (profile_id, entity_id) do update
      set completed = true,
          completed_at = coalesce(public.entity_progress.completed_at, now()),
          xp_earned = greatest(public.entity_progress.xp_earned, excluded.xp_earned),
          updated_at = now();

    streak_val := public._touch_streak(uid);

    source := coalesce(nullif(trim(p_source_key), ''), 'entity:' || p_entity_id);
    if coalesce(p_xp, 0) > 0 then
      awarded := public._award_xp(uid, p_xp, source, 'Entity completed');
    end if;

    insert into public.audit_events (profile_id, actor_id, event_type, entity_type, entity_id, payload)
    values (
      uid, uid, 'entity_completed', 'entity', p_entity_id,
      jsonb_build_object('xp', coalesce(p_xp, 0), 'awarded', awarded)
    );
  else
    update public.entity_progress
    set completed = false,
        completed_at = null,
        updated_at = now()
    where profile_id = uid and entity_id = p_entity_id;

    streak_val := coalesce((select streak from public.learner_stats where profile_id = uid), 0);
  end if;

  return jsonb_build_object(
    'entity_id', p_entity_id,
    'completed', p_completed,
    'xp_awarded', awarded,
    'streak', streak_val
  );
end;
$$;

revoke all on function public.complete_entity(text, integer, text, boolean) from public;
grant execute on function public.complete_entity(text, integer, text, boolean) to authenticated;

create or replace function public.submit_and_complete_journey_assignment(
  p_catalog_id text,
  p_assignment_number integer,
  p_assignment_title text,
  p_module_slug text,
  p_module_title text,
  p_student_name text,
  p_student_email text,
  p_github_url text default '',
  p_live_url text default '',
  p_screenshots text default '',
  p_notes text default '',
  p_reflection text default '',
  p_xp integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  existing public.journey_assignment_submissions%rowtype;
  row_out public.journey_assignment_submissions%rowtype;
  entity_key text;
  awarded boolean := false;
  streak_val integer;
  now_ts timestamptz := now();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_catalog_id is null or length(trim(p_catalog_id)) = 0 then
    raise exception 'catalog_id required';
  end if;

  perform public.ensure_learner_workspace(uid);

  select * into existing
  from public.journey_assignment_submissions
  where catalog_id = p_catalog_id and profile_id = uid
  for update;

  if found and existing.status in ('under_review', 'approved') then
    raise exception 'This submission is locked while under review or after approval.';
  end if;

  insert into public.journey_assignment_submissions as jas (
    catalog_id, assignment_number, assignment_title, module_slug, module_title,
    profile_id, student_name, student_email, github_url, live_url, screenshots,
    notes, reflection, status, submitted_at, marks, feedback, reviewed_at
  ) values (
    p_catalog_id,
    coalesce(p_assignment_number, 0),
    coalesce(p_assignment_title, ''),
    coalesce(p_module_slug, ''),
    coalesce(p_module_title, ''),
    uid,
    coalesce(p_student_name, ''),
    coalesce(p_student_email, ''),
    coalesce(p_github_url, ''),
    coalesce(p_live_url, ''),
    coalesce(p_screenshots, ''),
    coalesce(p_notes, ''),
    coalesce(p_reflection, ''),
    'submitted',
    now_ts,
    case when existing.status = 'revision_requested' then null else existing.marks end,
    case when existing.status = 'revision_requested' then null else existing.feedback end,
    case when existing.status = 'revision_requested' then null else existing.reviewed_at end
  )
  on conflict (catalog_id, profile_id) do update set
    assignment_number = excluded.assignment_number,
    assignment_title = excluded.assignment_title,
    module_slug = excluded.module_slug,
    module_title = excluded.module_title,
    student_name = excluded.student_name,
    student_email = excluded.student_email,
    github_url = excluded.github_url,
    live_url = excluded.live_url,
    screenshots = excluded.screenshots,
    notes = excluded.notes,
    reflection = excluded.reflection,
    status = 'submitted',
    submitted_at = excluded.submitted_at,
    marks = excluded.marks,
    feedback = excluded.feedback,
    reviewed_at = excluded.reviewed_at,
    updated_at = now()
  returning * into row_out;

  entity_key := p_catalog_id || '-complete';

  insert into public.entity_progress (profile_id, entity_id, completed, completed_at, xp_earned)
  values (uid, entity_key, true, now_ts, greatest(coalesce(p_xp, 0), 0))
  on conflict (profile_id, entity_id) do update
    set completed = true,
        completed_at = coalesce(public.entity_progress.completed_at, now_ts),
        xp_earned = greatest(public.entity_progress.xp_earned, excluded.xp_earned),
        updated_at = now();

  insert into public.assignment_local_meta as alm (
    profile_id, catalog_id, status, github_url, live_url, screenshots,
    notes, reflection, submitted_at
  ) values (
    uid, p_catalog_id, 'submitted',
    coalesce(p_github_url, ''), coalesce(p_live_url, ''), coalesce(p_screenshots, ''),
    coalesce(p_notes, ''), coalesce(p_reflection, ''), now_ts
  )
  on conflict (profile_id, catalog_id) do update set
    status = 'submitted',
    github_url = excluded.github_url,
    live_url = excluded.live_url,
    screenshots = excluded.screenshots,
    notes = excluded.notes,
    reflection = excluded.reflection,
    submitted_at = excluded.submitted_at,
    updated_at = now();

  streak_val := public._touch_streak(uid);

  if coalesce(p_xp, 0) > 0 then
    awarded := public._award_xp(uid, p_xp, 'journey:' || p_catalog_id, 'Assignment submitted');
  end if;

  perform public._push_notification(
    uid,
    'learning',
    'Assignment submitted',
    coalesce(p_assignment_title, 'Your assignment') || ' was submitted for review.',
    '/assignments/' || coalesce(p_module_slug, ''),
    'generic',
    jsonb_build_object('catalogId', p_catalog_id)
  );

  insert into public.achievements (profile_id, achievement_key, title, meta)
  values (
    uid,
    'assignment_submit:' || p_catalog_id,
    'Assignment submitted',
    jsonb_build_object('catalogId', p_catalog_id)
  )
  on conflict (profile_id, achievement_key) do nothing;

  insert into public.audit_events (profile_id, actor_id, event_type, entity_type, entity_id, payload)
  values (
    uid, uid, 'assignment_completed', 'journey_assignment', p_catalog_id,
    jsonb_build_object(
      'submission_id', row_out.id,
      'xp_awarded', awarded,
      'streak', streak_val
    )
  );

  return jsonb_build_object(
    'submission', to_jsonb(row_out),
    'xp_awarded', awarded,
    'streak', streak_val,
    'entity_id', entity_key
  );
end;
$$;

revoke all on function public.submit_and_complete_journey_assignment(
  text, integer, text, text, text, text, text, text, text, text, text, text, integer
) from public;
grant execute on function public.submit_and_complete_journey_assignment(
  text, integer, text, text, text, text, text, text, text, text, text, text, integer
) to authenticated;

-- Auto-provision workspace when a profile is created
create or replace function public.handle_new_learner_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_learner_workspace(new.id);
  return new;
end;
$$;

drop trigger if exists profiles_ensure_learner_workspace on public.profiles;
create trigger profiles_ensure_learner_workspace
  after insert on public.profiles
  for each row execute function public.handle_new_learner_workspace();

-- Backfill existing profiles (empty progress only)
insert into public.learner_stats (profile_id)
select id from public.profiles
on conflict (profile_id) do nothing;

insert into public.learner_preferences (profile_id)
select id from public.profiles
on conflict (profile_id) do nothing;

insert into public.hub_library (profile_id)
select id from public.profiles
on conflict (profile_id) do nothing;
