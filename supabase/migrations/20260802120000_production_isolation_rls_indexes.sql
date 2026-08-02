-- Production isolation: align submission RLS with is_staff(), allow staff
-- certificate reads, and add composite indexes for concurrent learner load.
-- Safe additive migration — does not drop user tables or mutate progress rows.

-- ---------------------------------------------------------------------------
-- Assignment submissions: own rows OR staff
-- ---------------------------------------------------------------------------
drop policy if exists "submissions_select_own_or_mentor" on public.assignment_submissions;
create policy "submissions_select_own_or_mentor"
  on public.assignment_submissions for select to authenticated
  using (
    profile_id = auth.uid()
    or public.is_staff()
  );

drop policy if exists "submissions_update_own_or_mentor" on public.assignment_submissions;
create policy "submissions_update_own_or_mentor"
  on public.assignment_submissions for update to authenticated
  using (
    profile_id = auth.uid()
    or public.is_staff()
  )
  with check (
    profile_id = auth.uid()
    or public.is_staff()
  );

-- ---------------------------------------------------------------------------
-- Journey submissions: own rows OR staff
-- ---------------------------------------------------------------------------
drop policy if exists "journey_submissions_select_own_or_mentor"
  on public.journey_assignment_submissions;
create policy "journey_submissions_select_own_or_mentor"
  on public.journey_assignment_submissions for select to authenticated
  using (
    profile_id = auth.uid()
    or public.is_staff()
  );

drop policy if exists "journey_submissions_update_own_or_mentor"
  on public.journey_assignment_submissions;
create policy "journey_submissions_update_own_or_mentor"
  on public.journey_assignment_submissions for update to authenticated
  using (
    profile_id = auth.uid()
    or public.is_staff()
  )
  with check (
    profile_id = auth.uid()
    or public.is_staff()
  );

-- ---------------------------------------------------------------------------
-- Certificates: staff can list for admin analytics (students remain own-only)
-- ---------------------------------------------------------------------------
drop policy if exists "certificates_select_staff" on public.certificates;
create policy "certificates_select_staff"
  on public.certificates for select to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Indexes for multi-tenant progress lookups under load
-- ---------------------------------------------------------------------------
create index if not exists lesson_progress_profile_lesson_idx
  on public.lesson_progress (profile_id, lesson_id);

create index if not exists assignment_submissions_profile_assignment_idx
  on public.assignment_submissions (profile_id, assignment_id);

create index if not exists journey_assignment_submissions_profile_catalog_idx
  on public.journey_assignment_submissions (profile_id, catalog_id);

create index if not exists certificates_profile_certification_idx
  on public.certificates (profile_id, certification_id);
