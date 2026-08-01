-- Expand access requests (seat_requests) for Super Admin CRM
alter table public.seat_requests drop constraint if exists seat_requests_status_check;

alter table public.seat_requests
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists applicant_status text
    check (applicant_status is null or applicant_status in (
      'student', 'working_professional', 'career_switcher'
    )),
  add column if not exists college_name text,
  add column if not exists message text,
  add column if not exists notes text,
  add column if not exists source text default 'reserve_access';

update public.seat_requests
set status = 'pending'
where status is null or status not in (
  'pending', 'approved', 'rejected', 'contacted', 'joined', 'inactive'
);

alter table public.seat_requests
  add constraint seat_requests_status_check
  check (status in (
    'pending', 'approved', 'rejected', 'contacted', 'joined', 'inactive'
  ));

comment on table public.seat_requests is 'Invite-only access / seat requests managed by Super Admin';
