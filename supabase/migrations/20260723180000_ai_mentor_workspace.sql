-- AI Mentor workspace (multi-user SaaS, strict own-row RLS)

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default 'New chat',
  pinned boolean not null default false,
  archived boolean not null default false,
  favorited boolean not null default false,
  context jsonb not null default '{}'::jsonb,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_conversations_profile_last_message_idx
  on public.ai_conversations (profile_id, last_message_at desc nulls last);
create index if not exists ai_conversations_profile_pinned_idx
  on public.ai_conversations (profile_id, pinned)
  where pinned = true and archived = false;
create index if not exists ai_conversations_profile_title_idx
  on public.ai_conversations (profile_id, title);

drop trigger if exists ai_conversations_set_updated_at on public.ai_conversations;
create trigger ai_conversations_set_updated_at
  before update on public.ai_conversations
  for each row execute function public.set_updated_at();

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null default '',
  status text not null default 'complete'
    check (status in ('pending', 'streaming', 'complete', 'error', 'cancelled')),
  model text,
  error text,
  token_input integer,
  token_output integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_messages_conversation_created_idx
  on public.ai_messages (conversation_id, created_at);
create index if not exists ai_messages_profile_id_idx
  on public.ai_messages (profile_id);

drop trigger if exists ai_messages_set_updated_at on public.ai_messages;
create trigger ai_messages_set_updated_at
  before update on public.ai_messages
  for each row execute function public.set_updated_at();

create table if not exists public.ai_attachments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  message_id uuid references public.ai_messages (id) on delete set null,
  file_name text not null,
  mime_type text not null default 'application/octet-stream',
  size_bytes integer not null default 0,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists ai_attachments_conversation_idx
  on public.ai_attachments (conversation_id);
create index if not exists ai_attachments_profile_idx
  on public.ai_attachments (profile_id);

create table if not exists public.ai_bookmarks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  message_id uuid references public.ai_messages (id) on delete cascade,
  label text not null default '',
  snippet text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists ai_bookmarks_profile_idx
  on public.ai_bookmarks (profile_id, created_at desc);

create table if not exists public.ai_saved_prompts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_saved_prompts_profile_idx
  on public.ai_saved_prompts (profile_id, updated_at desc);

drop trigger if exists ai_saved_prompts_set_updated_at on public.ai_saved_prompts;
create trigger ai_saved_prompts_set_updated_at
  before update on public.ai_saved_prompts
  for each row execute function public.set_updated_at();

create table if not exists public.ai_mentor_settings (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  preferred_provider text not null default 'gemini',
  preferred_model text,
  temperature real not null default 0.4,
  system_extra text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists ai_mentor_settings_set_updated_at on public.ai_mentor_settings;
create trigger ai_mentor_settings_set_updated_at
  before update on public.ai_mentor_settings
  for each row execute function public.set_updated_at();

-- RLS
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_attachments enable row level security;
alter table public.ai_bookmarks enable row level security;
alter table public.ai_saved_prompts enable row level security;
alter table public.ai_mentor_settings enable row level security;

-- conversations
drop policy if exists "ai_conversations_select_own" on public.ai_conversations;
create policy "ai_conversations_select_own"
  on public.ai_conversations for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "ai_conversations_insert_own" on public.ai_conversations;
create policy "ai_conversations_insert_own"
  on public.ai_conversations for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "ai_conversations_update_own" on public.ai_conversations;
create policy "ai_conversations_update_own"
  on public.ai_conversations for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "ai_conversations_delete_own" on public.ai_conversations;
create policy "ai_conversations_delete_own"
  on public.ai_conversations for delete to authenticated
  using (profile_id = auth.uid());

-- messages
drop policy if exists "ai_messages_select_own" on public.ai_messages;
create policy "ai_messages_select_own"
  on public.ai_messages for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "ai_messages_insert_own" on public.ai_messages;
create policy "ai_messages_insert_own"
  on public.ai_messages for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "ai_messages_update_own" on public.ai_messages;
create policy "ai_messages_update_own"
  on public.ai_messages for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "ai_messages_delete_own" on public.ai_messages;
create policy "ai_messages_delete_own"
  on public.ai_messages for delete to authenticated
  using (profile_id = auth.uid());

-- attachments
drop policy if exists "ai_attachments_select_own" on public.ai_attachments;
create policy "ai_attachments_select_own"
  on public.ai_attachments for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "ai_attachments_insert_own" on public.ai_attachments;
create policy "ai_attachments_insert_own"
  on public.ai_attachments for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "ai_attachments_delete_own" on public.ai_attachments;
create policy "ai_attachments_delete_own"
  on public.ai_attachments for delete to authenticated
  using (profile_id = auth.uid());

-- bookmarks
drop policy if exists "ai_bookmarks_select_own" on public.ai_bookmarks;
create policy "ai_bookmarks_select_own"
  on public.ai_bookmarks for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "ai_bookmarks_insert_own" on public.ai_bookmarks;
create policy "ai_bookmarks_insert_own"
  on public.ai_bookmarks for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "ai_bookmarks_delete_own" on public.ai_bookmarks;
create policy "ai_bookmarks_delete_own"
  on public.ai_bookmarks for delete to authenticated
  using (profile_id = auth.uid());

-- saved prompts
drop policy if exists "ai_saved_prompts_select_own" on public.ai_saved_prompts;
create policy "ai_saved_prompts_select_own"
  on public.ai_saved_prompts for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "ai_saved_prompts_insert_own" on public.ai_saved_prompts;
create policy "ai_saved_prompts_insert_own"
  on public.ai_saved_prompts for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "ai_saved_prompts_update_own" on public.ai_saved_prompts;
create policy "ai_saved_prompts_update_own"
  on public.ai_saved_prompts for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "ai_saved_prompts_delete_own" on public.ai_saved_prompts;
create policy "ai_saved_prompts_delete_own"
  on public.ai_saved_prompts for delete to authenticated
  using (profile_id = auth.uid());

-- settings
drop policy if exists "ai_mentor_settings_select_own" on public.ai_mentor_settings;
create policy "ai_mentor_settings_select_own"
  on public.ai_mentor_settings for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "ai_mentor_settings_insert_own" on public.ai_mentor_settings;
create policy "ai_mentor_settings_insert_own"
  on public.ai_mentor_settings for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "ai_mentor_settings_update_own" on public.ai_mentor_settings;
create policy "ai_mentor_settings_update_own"
  on public.ai_mentor_settings for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
