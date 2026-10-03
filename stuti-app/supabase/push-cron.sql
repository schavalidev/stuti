-- Stuti — waking the push sender. Run after schema.sql (section 7), in the same
-- SQL Editor. Safe to run again. Kept apart from schema.sql because it needs two
-- extensions, and a project where they cannot be created should still get
-- everything else.
--
-- Every thirty seconds the database asks itself whether a bell falls due in the
-- next twenty, and only then calls the sender (netlify/functions/push-send.mjs),
-- handing it the secret from stuti_push_sender. So the function runs when there
-- is something to send, plus one health call every ten minutes so a lay can
-- tell whether anything is listening. A quiet night costs nothing.
--
-- If the site moves to another address:
--   update public.stuti_push_sender set url = 'https://<site>/.netlify/functions/push-send';

create extension if not exists pg_net;
create extension if not exists pg_cron;

create or replace function public.stuti_push_tick() returns void
  language plpgsql security definer set search_path = '' as $$
declare s public.stuti_push_sender;
begin
  select * into s from public.stuti_push_sender where id = 1;
  if not found then return; end if;
  -- what nobody sent in time is past its use; marking it here keeps a dead
  -- sender from being called every thirty seconds for a week of old bells
  update public.stuti_push_queue q set sent_at = now(), outcome = 'stale'
   where q.sent_at is null and q.due_at + make_interval(secs => q.ttl) < now();
  if exists (select 1 from public.stuti_push_queue q where q.sent_at is null and q.due_at <= now() + interval '20 seconds')
     or s.pinged_at is null or s.pinged_at < now() - interval '10 minutes' then
    update public.stuti_push_sender set pinged_at = now() where id = 1;
    perform net.http_post(
      url := s.url,
      body := jsonb_build_object('secret', s.secret),
      headers := '{"Content-Type": "application/json"}'::jsonb,
      timeout_milliseconds := 25000);
  end if;
end $$;
revoke all on function public.stuti_push_tick() from public, anon, authenticated;

-- pg_cron 1.5 and later take a seconds interval; an older one gets the minute
do $$
begin
  perform cron.schedule('stuti-push', '30 seconds', 'select public.stuti_push_tick()');
exception when others then
  perform cron.schedule('stuti-push', '* * * * *', 'select public.stuti_push_tick()');
end $$;

-- To see it working:
--   select beat_at, beat_ok, note from public.stuti_push_sender;   -- the sender's last run
--   select outcome, count(*) from public.stuti_push_queue group by 1;
--   select * from net._http_response order by created desc limit 5;  -- what the calls returned
-- To stop it:  select cron.unschedule('stuti-push');
