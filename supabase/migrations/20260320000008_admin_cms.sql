-- Phase 4: Admin CMS
-- Staff (instructor/admin) write access to curriculum + student visibility.
-- Adds learning_objectives on lessons and pdf resource type.

-- ---------------------------------------------------------------------------
-- Schema tweaks
-- ---------------------------------------------------------------------------
alter table public.lessons
  add column if not exists learning_objectives text[] not null default '{}';

do $$ begin
  alter type public.resource_type add value if not exists 'pdf';
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Staff helper
-- ---------------------------------------------------------------------------
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
      and p.role in ('instructor', 'admin')
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

-- ---------------------------------------------------------------------------
-- Profiles: staff can list students
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_staff" on public.profiles;
create policy "profiles_select_staff"
  on public.profiles for select to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Courses: staff full access (incl. unpublished)
-- ---------------------------------------------------------------------------
drop policy if exists "courses_select_staff" on public.courses;
create policy "courses_select_staff"
  on public.courses for select to authenticated
  using (public.is_staff());

drop policy if exists "courses_insert_staff" on public.courses;
create policy "courses_insert_staff"
  on public.courses for insert to authenticated
  with check (public.is_staff());

drop policy if exists "courses_update_staff" on public.courses;
create policy "courses_update_staff"
  on public.courses for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "courses_delete_staff" on public.courses;
create policy "courses_delete_staff"
  on public.courses for delete to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Phases
-- ---------------------------------------------------------------------------
drop policy if exists "phases_select_staff" on public.phases;
create policy "phases_select_staff"
  on public.phases for select to authenticated
  using (public.is_staff());

drop policy if exists "phases_insert_staff" on public.phases;
create policy "phases_insert_staff"
  on public.phases for insert to authenticated
  with check (public.is_staff());

drop policy if exists "phases_update_staff" on public.phases;
create policy "phases_update_staff"
  on public.phases for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "phases_delete_staff" on public.phases;
create policy "phases_delete_staff"
  on public.phases for delete to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Modules
-- ---------------------------------------------------------------------------
drop policy if exists "modules_select_staff" on public.modules;
create policy "modules_select_staff"
  on public.modules for select to authenticated
  using (public.is_staff());

drop policy if exists "modules_insert_staff" on public.modules;
create policy "modules_insert_staff"
  on public.modules for insert to authenticated
  with check (public.is_staff());

drop policy if exists "modules_update_staff" on public.modules;
create policy "modules_update_staff"
  on public.modules for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "modules_delete_staff" on public.modules;
create policy "modules_delete_staff"
  on public.modules for delete to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Lessons
-- ---------------------------------------------------------------------------
drop policy if exists "lessons_select_staff" on public.lessons;
create policy "lessons_select_staff"
  on public.lessons for select to authenticated
  using (public.is_staff());

drop policy if exists "lessons_insert_staff" on public.lessons;
create policy "lessons_insert_staff"
  on public.lessons for insert to authenticated
  with check (public.is_staff());

drop policy if exists "lessons_update_staff" on public.lessons;
create policy "lessons_update_staff"
  on public.lessons for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "lessons_delete_staff" on public.lessons;
create policy "lessons_delete_staff"
  on public.lessons for delete to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Lesson resources
-- ---------------------------------------------------------------------------
drop policy if exists "lesson_resources_select_staff" on public.lesson_resources;
create policy "lesson_resources_select_staff"
  on public.lesson_resources for select to authenticated
  using (public.is_staff());

drop policy if exists "lesson_resources_insert_staff" on public.lesson_resources;
create policy "lesson_resources_insert_staff"
  on public.lesson_resources for insert to authenticated
  with check (public.is_staff());

drop policy if exists "lesson_resources_update_staff" on public.lesson_resources;
create policy "lesson_resources_update_staff"
  on public.lesson_resources for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "lesson_resources_delete_staff" on public.lesson_resources;
create policy "lesson_resources_delete_staff"
  on public.lesson_resources for delete to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Lesson progress: staff can view all (student management)
-- ---------------------------------------------------------------------------
drop policy if exists "lesson_progress_select_staff" on public.lesson_progress;
create policy "lesson_progress_select_staff"
  on public.lesson_progress for select to authenticated
  using (public.is_staff());
