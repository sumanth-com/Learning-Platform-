-- Invite-only onboarding: roles (super_admin | student) + seat_requests + invitations
-- ---------------------------------------------------------------------------

-- 1) Roles: only student | super_admin
alter table public.profiles drop constraint if exists profiles_role_check;

update public.profiles
set role = 'student'
where role in ('instructor', 'admin')
  and lower(email) <> 'sumanth.reddy@ifranchise.in';

update public.profiles
set role = 'super_admin'
where lower(email) = 'sumanth.reddy@ifranchise.in';

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'super_admin'));

comment on column public.profiles.role is
  'student (default) or super_admin (seeded only for sumanth.reddy@ifranchise.in)';

-- 2) Staff helper → super_admin only
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'super_admin'
  );
$$;

-- 3) Lock role changes: only service role / security definer can set super_admin
create or replace function public.enforce_profile_role_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  super_email constant text := 'sumanth.reddy@ifranchise.in';
begin
  -- Nobody may become super_admin except the seeded email
  if new.role = 'super_admin' and lower(coalesce(new.email, '')) <> super_email then
    raise exception 'super_admin role is reserved';
  end if;

  -- Authenticated users cannot escalate their own role via client updates
  if tg_op = 'UPDATE'
     and old.role is distinct from new.role
     and auth.uid() is not null
     and auth.role() = 'authenticated' then
    raise exception 'Role cannot be changed from the application';
  end if;

  -- Ensure the seeded email always stays super_admin if present
  if lower(coalesce(new.email, '')) = super_email then
    new.role := 'super_admin';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_enforce_role_guard on public.profiles;
create trigger profiles_enforce_role_guard
  before insert or update on public.profiles
  for each row
  execute function public.enforce_profile_role_guard();

-- New auth users always get student (seeded super admin already exists)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  super_email constant text := 'sumanth.reddy@ifranchise.in';
  assigned_role text := 'student';
begin
  if lower(coalesce(new.email, '')) = super_email then
    assigned_role := 'super_admin';
  end if;

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    assigned_role
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        role = case
          when lower(excluded.email) = super_email then 'super_admin'
          else public.profiles.role
        end;

  return new;
end;
$$;

-- 4) seat_requests
create table if not exists public.seat_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  approved_by uuid references auth.users (id) on delete set null,
  approved_at timestamptz,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seat_requests_email_unique unique (email)
);

create index if not exists seat_requests_status_idx on public.seat_requests (status);
create index if not exists seat_requests_created_at_idx on public.seat_requests (created_at desc);

drop trigger if exists seat_requests_set_updated_at on public.seat_requests;
create trigger seat_requests_set_updated_at
  before update on public.seat_requests
  for each row
  execute function public.set_updated_at();

alter table public.seat_requests enable row level security;

-- Public insert is done via service role from Next.js; no anon insert policy.
-- Super admin can read/update/delete.
drop policy if exists seat_requests_staff_select on public.seat_requests;
create policy seat_requests_staff_select
  on public.seat_requests for select
  to authenticated
  using (public.is_staff());

drop policy if exists seat_requests_staff_update on public.seat_requests;
create policy seat_requests_staff_update
  on public.seat_requests for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists seat_requests_staff_delete on public.seat_requests;
create policy seat_requests_staff_delete
  on public.seat_requests for delete
  to authenticated
  using (public.is_staff());

-- 5) seat_invitations (one-time activation tokens)
create table if not exists public.seat_invitations (
  id uuid primary key default gen_random_uuid(),
  seat_request_id uuid not null references public.seat_requests (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint seat_invitations_one_active_per_request unique (seat_request_id)
);

create index if not exists seat_invitations_email_idx on public.seat_invitations (email);
create index if not exists seat_invitations_expires_at_idx on public.seat_invitations (expires_at);

alter table public.seat_invitations enable row level security;

drop policy if exists seat_invitations_staff_select on public.seat_invitations;
create policy seat_invitations_staff_select
  on public.seat_invitations for select
  to authenticated
  using (public.is_staff());

grant select, update, delete on public.seat_requests to authenticated;
grant select on public.seat_invitations to authenticated;
