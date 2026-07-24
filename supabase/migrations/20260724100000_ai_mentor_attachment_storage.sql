-- Private storage for AI Mentor file uploads (RLS via storage policies)

insert into storage.buckets (id, name, public, file_size_limit)
values ('ai-mentor-attachments', 'ai-mentor-attachments', false, 10485760)
on conflict (id) do update
set file_size_limit = excluded.file_size_limit;

drop policy if exists "ai_mentor_attachments_select_own" on storage.objects;
create policy "ai_mentor_attachments_select_own"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'ai-mentor-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ai_mentor_attachments_insert_own" on storage.objects;
create policy "ai_mentor_attachments_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'ai-mentor-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ai_mentor_attachments_delete_own" on storage.objects;
create policy "ai_mentor_attachments_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'ai-mentor-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
