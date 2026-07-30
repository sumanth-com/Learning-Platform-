-- Durable, publicly verifiable skill credentials.

create table if not exists public.certificates (
  id text primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  certification_id text not null,
  recipient_name text not null check (char_length(recipient_name) between 2 and 100),
  title text not null,
  technology text not null,
  level text not null check (level in ('basic', 'intermediate')),
  score integer not null check (score between 0 and 100),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, certification_id)
);

create index if not exists certificates_profile_issued_idx
  on public.certificates (profile_id, issued_at desc);

drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at
  before update on public.certificates
  for each row execute function public.set_updated_at();

alter table public.certificates enable row level security;

drop policy if exists "certificates_select_own" on public.certificates;
create policy "certificates_select_own"
  on public.certificates for select to authenticated
  using (profile_id = auth.uid());

-- There is deliberately no client insert/update/delete policy. Credentials are
-- issued by the authenticated server action using the service role.

create or replace function public.verify_certificate(cert_id text)
returns table (
  id text,
  certification_id text,
  recipient_name text,
  title text,
  technology text,
  level text,
  score integer,
  issued_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id,
    c.certification_id,
    c.recipient_name,
    c.title,
    c.technology,
    c.level,
    c.score,
    c.issued_at
  from public.certificates c
  where c.id = cert_id
    and c.revoked_at is null
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
