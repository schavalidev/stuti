-- Stuti — the whole server side, in one file.
-- Paste into Supabase → SQL Editor → Run. Safe to run again: every statement
-- is idempotent. See stuti-app/docs/backend.md for the dashboard steps.

-- ---------------------------------------------------------------------------
-- 1. Sync: one row per localStorage key per account (stuti-cloud.ts).
--    `value` is the key's string exactly as the store wrote it (null = removed);
--    `ts` is the device's own stamp of when it changed, and the newer stamp wins.
-- ---------------------------------------------------------------------------
create table if not exists public.stuti_kv (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  key        text        not null check (key like 'stuti-%' and length(key) <= 120),
  value      text                 check (value is null or length(value) <= 2000000),
  ts         bigint      not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
create index if not exists stuti_kv_user_updated on public.stuti_kv (user_id, updated_at);

-- a late write from a phone that was offline must not overwrite a newer copy
create or replace function public.stuti_kv_guard() returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.ts < old.ts then
    return old;                     -- keep the newer row untouched
  end if;
  new.updated_at := clock_timestamp();
  return new;
end $$;
drop trigger if exists stuti_kv_guard on public.stuti_kv;
create trigger stuti_kv_guard before insert or update on public.stuti_kv
  for each row execute function public.stuti_kv_guard();

alter table public.stuti_kv enable row level security;
drop policy if exists "own rows" on public.stuti_kv;
create policy "own rows" on public.stuti_kv for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. The cue record: what a push server needs to ring the right bell at the
--    right minute (STUTI_PUSH.record — place and zone, sandhyā reminders,
--    quiet hours, digest hour, almanac settings, vows). One row per device.
--    No name, no gotra, no reading history.
-- ---------------------------------------------------------------------------
create table if not exists public.stuti_cue_prefs (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  device     text        not null check (length(device) <= 40),
  platform   text,
  record     jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, device)
);
create or replace function public.stuti_touch() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists stuti_cue_touch on public.stuti_cue_prefs;
create trigger stuti_cue_touch before insert or update on public.stuti_cue_prefs
  for each row execute function public.stuti_touch();

alter table public.stuti_cue_prefs enable row level security;
drop policy if exists "own rows" on public.stuti_cue_prefs;
create policy "own rows" on public.stuti_cue_prefs for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. Corrections: a verse fixed without a release (stuti-corrections.ts).
--    Everyone may read the published rows; only the dashboard (service role)
--    may write. `hymn` is the hymn's id or exact title; `n` the verse number
--    as printed ('' for a hymn-level field); `s` the section index, or null.
--    A row applies only while the verse still reads `old_text`.
-- ---------------------------------------------------------------------------
create table if not exists public.stuti_corrections (
  id         bigint generated always as identity primary key,
  hymn       text    not null,
  s          int,
  n          text    not null default '',
  field      text    not null check (field in ('deva','iast','en','tel','roman','hi','telugu','title','blurb')),
  old_text   text    not null,
  new_text   text    not null,
  note       text,
  published  boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.stuti_corrections enable row level security;
drop policy if exists "read published" on public.stuti_corrections;
create policy "read published" on public.stuti_corrections for select to anon, authenticated
  using (published);

-- ---------------------------------------------------------------------------
-- 4. Counters (stuti-count-sink.ts): the design's twelve events. Insert-only
--    for the app; readable only from the dashboard. No device, no user, no IP,
--    no time of day — the day is all.
-- ---------------------------------------------------------------------------
create table if not exists public.stuti_events (
  id       bigint generated always as identity primary key,
  day      date   not null default current_date,
  name     text   not null check (name in ('app_open','screen','onboarded','text_open','script','japa','guide','search','install','feedback','carry','gate')),
  props    jsonb  not null default '{}'::jsonb check (length(props::text) <= 400),
  platform text   check (length(platform) <= 12),
  build    text   check (length(build) <= 40)
);
create index if not exists stuti_events_day on public.stuti_events (day, name);
alter table public.stuti_events enable row level security;
drop policy if exists "count only" on public.stuti_events;
create policy "count only" on public.stuti_events for insert to anon, authenticated with check (true);
-- the client sends no `day`; make sure it cannot backdate one either
create or replace function public.stuti_events_day() returns trigger language plpgsql as $$
begin new.day := current_date; return new; end $$;
drop trigger if exists stuti_events_day on public.stuti_events;
create trigger stuti_events_day before insert on public.stuti_events
  for each row execute function public.stuti_events_day();

-- a daily summary to read in the SQL editor
create or replace view public.stuti_events_daily with (security_invoker = true) as
  select day, name, props->>'screen' as screen, props->>'script' as script, platform, count(*) as n
  from public.stuti_events group by 1,2,3,4,5 order by 1 desc, 6 desc;
revoke all on public.stuti_events_daily from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Deleting an account (stuti-cloud.ts → deleteAccount). The app holds only
--    the anon key, which cannot remove a user; this function runs as its owner
--    and removes exactly the caller. Every table above references auth.users
--    on delete cascade, so the synced keys and cue records go with it.
--    Counters and corrections hold no user and are untouched.
-- ---------------------------------------------------------------------------
create or replace function public.stuti_delete_my_account() returns void
  language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.stuti_delete_my_account() from public, anon;
grant execute on function public.stuti_delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Feedback (stuti-feedback-send.ts): every message from the sheet, kept so
--    it can be reviewed in the app (stuti-feedback-inbox.tsx). Anyone may add a
--    row; only the people listed in stuti_admins may read one, and they may
--    change nothing but its status. The relay also mails each message to the
--    support address and files it in Drive; this table is the list to work from.
-- ---------------------------------------------------------------------------
create table if not exists public.stuti_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note    text
);
alter table public.stuti_admins enable row level security;   -- no policies: read only through the function below

create or replace function public.stuti_is_admin() returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.stuti_admins where user_id = auth.uid());
$$;
revoke all on function public.stuti_is_admin() from public, anon;
grant execute on function public.stuti_is_admin() to authenticated;

create table if not exists public.stuti_feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id    uuid references auth.users(id) on delete set null default auth.uid(),
  kind       text not null check (kind in ('problem','idea','text')),
  subject    text check (length(subject) <= 200),
  body       text not null check (length(body) between 1 and 20000),
  build      text check (length(build) <= 60),
  platform   text check (length(platform) <= 12),
  status     text not null default 'new' check (status in ('new','seen','done'))
);
create index if not exists stuti_feedback_status on public.stuti_feedback (status, created_at desc);

create or replace function public.stuti_feedback_in() returns trigger language plpgsql as $$
begin
  new.created_at := now(); new.status := 'new';
  new.user_id := auth.uid();        -- the caller, or null when signed out; never a claimed id
  return new;
end $$;
drop trigger if exists stuti_feedback_in on public.stuti_feedback;
create trigger stuti_feedback_in before insert on public.stuti_feedback
  for each row execute function public.stuti_feedback_in();

alter table public.stuti_feedback enable row level security;
drop policy if exists "anyone sends" on public.stuti_feedback;
create policy "anyone sends" on public.stuti_feedback for insert to anon, authenticated with check (true);
drop policy if exists "admins read" on public.stuti_feedback;
create policy "admins read" on public.stuti_feedback for select to authenticated using (public.stuti_is_admin());
drop policy if exists "admins mark" on public.stuti_feedback;
create policy "admins mark" on public.stuti_feedback for update to authenticated using (public.stuti_is_admin()) with check (public.stuti_is_admin());
revoke update on public.stuti_feedback from anon, authenticated;
grant update (status) on public.stuti_feedback to authenticated;
