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

-- ---------------------------------------------------------------------------
-- 7. Push (src/stuti-webpush.ts → netlify/functions/push-send.mjs). A browser
--    that has allowed notifications hands over its week of bells, each one
--    already sealed to that browser on the device (src/stuti-push-seal.ts).
--    So the server keeps an endpoint, a minute and ciphertext it cannot read:
--    no account, no place, no hymn, no name. Anyone may lay a queue for an
--    endpoint, because knowing the endpoint is what it takes, and only that
--    browser can open what is sent to it.
--    The sender is woken by supabase/push-cron.sql, which needs pg_cron and
--    pg_net and so lives in its own file; run it after this one.
-- ---------------------------------------------------------------------------

-- the push services a browser can hand out an endpoint on. The sender POSTs to
-- whatever endpoint a row names, so nothing else may ever become one.
create or replace function public.stuti_push_host_ok(e text) returns boolean
  language sql immutable set search_path = '' as $$
  select coalesce(e ~ '^https://(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+(\.[a-z0-9-]+)*\.push\.apple\.com|[a-z0-9-]+(\.[a-z0-9-]+)*\.notify\.windows\.com)/', false);
$$;

create table if not exists public.stuti_push_subs (
  endpoint   text primary key check (length(endpoint) <= 1000 and public.stuti_push_host_ok(endpoint)),
  created_at timestamptz not null default now(),
  laid_at    timestamptz not null default now()
);
create table if not exists public.stuti_push_queue (
  id       bigint generated always as identity primary key,
  endpoint text   not null references public.stuti_push_subs(endpoint) on delete cascade,
  slot     bigint not null,             -- the device's own hash of cue and day; means nothing here
  due_at   timestamptz not null,
  ttl      int    not null check (ttl between 60 and 86400),   -- seconds after due_at it is still worth sending
  urgency  text   not null default 'normal' check (urgency in ('very-low','low','normal','high')),
  payload  text   not null check (length(payload) <= 5600),    -- base64url of the sealed request body
  sent_at  timestamptz,
  tries    int    not null default 0,
  outcome  text,
  unique (endpoint, slot)
);
create index if not exists stuti_push_due on public.stuti_push_queue (due_at) where sent_at is null;
alter table public.stuti_push_subs  enable row level security;   -- no policies: only through the functions below
alter table public.stuti_push_queue enable row level security;

-- the sender's side: the secret the cron hands it (it holds no credential of
-- its own), where it lives, the key it signs with, and when it last ran clean
create table if not exists public.stuti_push_sender (
  id        int primary key default 1 check (id = 1),
  secret    text not null default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  url       text not null default 'https://stuti-app.netlify.app/.netlify/functions/push-send',
  key       text,
  beat_at   timestamptz,
  beat_ok   boolean not null default false,
  pinged_at timestamptz,
  note      text
);
insert into public.stuti_push_sender (id) values (1) on conflict (id) do nothing;
alter table public.stuti_push_sender enable row level security;

-- A browser's week, replacing whatever it laid before. Refused unless the
-- sender has run cleanly in the last twenty minutes with the same key the app
-- subscribed with: the page stands its own bells down once a lay is accepted,
-- so accepting one the sender cannot deliver would silence the reciter.
create or replace function public.stuti_push_lay(p_endpoint text, p_key text, p_cues jsonb)
  returns jsonb language plpgsql security definer set search_path = '' as $$
declare s public.stuti_push_sender; n int;
begin
  select * into s from public.stuti_push_sender where id = 1;
  if not found or s.beat_at is null or s.beat_at < now() - interval '20 minutes' then
    return jsonb_build_object('ok', false, 'reason', 'asleep');
  end if;
  if not s.beat_ok then return jsonb_build_object('ok', false, 'reason', 'sender', 'note', s.note); end if;
  if s.key is distinct from p_key then return jsonb_build_object('ok', false, 'reason', 'key'); end if;
  if p_endpoint is null or length(p_endpoint) > 1000 or not public.stuti_push_host_ok(p_endpoint) then
    return jsonb_build_object('ok', false, 'reason', 'endpoint');
  end if;
  if p_cues is null or jsonb_typeof(p_cues) <> 'array' or jsonb_array_length(p_cues) > 64 then
    return jsonb_build_object('ok', false, 'reason', 'cues');
  end if;
  insert into public.stuti_push_subs (endpoint) values (p_endpoint)
    on conflict (endpoint) do update set laid_at = now();
  delete from public.stuti_push_queue q where q.endpoint = p_endpoint and q.sent_at is null;
  insert into public.stuti_push_queue (endpoint, slot, due_at, ttl, urgency, payload)
    select p_endpoint, (c->>'slot')::bigint, to_timestamp((c->>'at')::double precision / 1000),
           least(greatest(coalesce((c->>'ttl')::int, 900), 60), 86400),
           case when c->>'urgency' in ('very-low','low','normal','high') then c->>'urgency' else 'normal' end,
           c->>'payload'
      from jsonb_array_elements(p_cues) c
     where jsonb_typeof(c->'slot') = 'number' and jsonb_typeof(c->'at') = 'number'
       and jsonb_typeof(c->'payload') = 'string' and length(c->>'payload') <= 5600
       and (c->>'at')::double precision / 1000 between extract(epoch from now()) - 60 and extract(epoch from now()) + 9 * 86400
    on conflict (endpoint, slot) do nothing;   -- already sent: a cue is never sent twice
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'laid', n);
end $$;
revoke all on function public.stuti_push_lay(text, text, jsonb) from public;
grant execute on function public.stuti_push_lay(text, text, jsonb) to anon, authenticated;

-- the bells are switched off, or the browser is giving up its subscription
create or replace function public.stuti_push_drop(p_endpoint text) returns void
  language sql security definer set search_path = '' as $$
  delete from public.stuti_push_subs where endpoint = p_endpoint;
$$;
revoke all on function public.stuti_push_drop(text) from public;
grant execute on function public.stuti_push_drop(text) to anon, authenticated;

-- The sender takes what has fallen due. It calls with the anon key, so the
-- secret is the whole of its authority. Claimed rows are marked sent at once,
-- so two overlapping runs can never send the same bell.
create or replace function public.stuti_push_claim(p_secret text, p_limit int default 200)
  returns table (id bigint, endpoint text, payload text, ttl int, urgency text)
  language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if p_secret is null or p_secret is distinct from (select s.secret from public.stuti_push_sender s where s.id = 1) then
    raise exception 'not the sender' using errcode = '42501';
  end if;
  -- a bell past its use is never sent late: a sandhyā cue an hour after the kāla is not a reminder but a false one
  update public.stuti_push_queue q set sent_at = now(), outcome = 'stale'
   where q.sent_at is null and q.due_at + make_interval(secs => q.ttl) < now();
  -- two days of sent rows is history enough; a browser that has not laid a week in a month has gone
  delete from public.stuti_push_queue q where q.sent_at < now() - interval '2 days';
  delete from public.stuti_push_subs s where s.laid_at < now() - interval '30 days';
  return query
    update public.stuti_push_queue q set sent_at = now(), tries = q.tries + 1
     where q.id in (select x.id from public.stuti_push_queue x
                     where x.sent_at is null and x.due_at <= now() + interval '20 seconds'
                     order by x.due_at limit greatest(1, least(coalesce(p_limit, 200), 500))
                     for update skip locked)
    returning q.id, q.endpoint, q.payload,
              greatest(60, (q.ttl - extract(epoch from (now() - q.due_at)))::int), q.urgency;
end $$;
revoke all on function public.stuti_push_claim(text, int) from public;
grant execute on function public.stuti_push_claim(text, int) to anon;

-- What happened to each, and how the sender itself fared. `gone` means the
-- browser unsubscribed or its subscription expired: the endpoint and its queue
-- go. `retry` (the service was busy or down) goes back in while still of use,
-- three tries at most.
create or replace function public.stuti_push_done(p_secret text, p_key text, p_ok boolean, p_note text, p_results jsonb)
  returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_secret is null or p_secret is distinct from (select s.secret from public.stuti_push_sender s where s.id = 1) then
    raise exception 'not the sender' using errcode = '42501';
  end if;
  update public.stuti_push_sender
     set key = p_key, beat_at = now(), beat_ok = coalesce(p_ok, false), note = left(p_note, 300)
   where id = 1;
  if p_results is null or jsonb_typeof(p_results) <> 'array' then return; end if;
  update public.stuti_push_queue q set outcome = left(r.outcome, 40)
    from jsonb_to_recordset(p_results) as r(id bigint, outcome text) where q.id = r.id;
  delete from public.stuti_push_subs s
   where s.endpoint in (select q.endpoint from public.stuti_push_queue q
                         join jsonb_to_recordset(p_results) as r(id bigint, outcome text) on q.id = r.id
                        where r.outcome = 'gone');
  update public.stuti_push_queue q set sent_at = null
    from jsonb_to_recordset(p_results) as r(id bigint, outcome text)
   where q.id = r.id and r.outcome = 'retry' and q.tries < 3 and q.due_at + make_interval(secs => q.ttl) > now();
end $$;
revoke all on function public.stuti_push_done(text, text, boolean, text, jsonb) from public;
grant execute on function public.stuti_push_done(text, text, boolean, text, jsonb) to anon;
