-- Allow owners to update their attachment rows (e.g. bind message_id after upload)

drop policy if exists "ai_attachments_update_own" on public.ai_attachments;
create policy "ai_attachments_update_own"
  on public.ai_attachments for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
