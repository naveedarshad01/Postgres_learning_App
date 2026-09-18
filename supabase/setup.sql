-- Run once in the SQL Editor of a dedicated Supabase project (not the practice lab).
begin;
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
 display_name text not null default '' check (length(display_name)<=80),
 role text not null default 'learner' check (role in ('learner','admin')),
 created_at timestamptz not null default now(), last_seen_at timestamptz
);
create table public.learner_progress (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 state jsonb not null default '{}'::jsonb,
 revision integer not null default 0, updated_at timestamptz
);
alter table public.profiles enable row level security;
alter table public.learner_progress enable row level security;
revoke all on public.profiles, public.learner_progress from anon, authenticated;
grant select on public.profiles, public.learner_progress to authenticated;

create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
create policy profiles_read on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy progress_read on public.learner_progress for select to authenticated using (user_id=auth.uid());

create function public.handle_new_learner() returns trigger language plpgsql security definer set search_path = '' as $$
declare chosen text;
begin
 chosen := lower(trim(coalesce(new.raw_user_meta_data->>'username','')));
 if chosen !~ '^[a-z0-9_]{3,30}$' then raise exception 'Choose a username of 3–30 lowercase letters, digits or underscores.'; end if;
 insert into public.profiles(id,username,display_name) values(new.id,chosen,left(coalesce(new.raw_user_meta_data->>'display_name',''),80));
 insert into public.learner_progress(user_id) values(new.id);
 return new;
end; $$;
revoke all on function public.handle_new_learner() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_learner();
-- Accounts that existed before installation receive unique initial usernames.
insert into public.profiles(id,username,display_name)
 select id,'learner_'||left(replace(id::text,'-',''),20),left(coalesce(raw_user_meta_data->>'display_name',''),80) from auth.users;
insert into public.learner_progress(user_id) select id from public.profiles;

create function public.save_my_progress(p_state jsonb,p_revision integer) returns integer
language plpgsql security definer set search_path = '' as $$
declare next_revision integer; k text;
begin
 if auth.uid() is null then raise exception 'Sign in first.' using errcode='42501'; end if;
 if p_state is null or jsonb_typeof(p_state)<>'object' or octet_length(p_state::text)>1000000 then raise exception 'Progress must be an object smaller than 1 MB.'; end if;
 if (p_state->>'version') is distinct from '1' or coalesce(p_state->>'plan','') not in ('7','15','30') then raise exception 'Unsupported progress format.'; end if;
 if coalesce(p_state->>'day','') !~ '^[0-9]{1,2}$' then raise exception 'Invalid plan day.'; end if;
 if (p_state->>'day')::integer < 1 or (p_state->>'day')::integer > (p_state->>'plan')::integer then raise exception 'Invalid plan day.'; end if;
 if p_state->'quizScore' is not null and p_state->'quizScore' <> 'null'::jsonb then
  if jsonb_typeof(p_state->'quizScore') <> 'object' or coalesce(p_state#>>'{quizScore,score}','') !~ '^([0-9]|1[0-9]|20)$' or (p_state#>>'{quizScore,total}') is distinct from '20' then raise exception 'Invalid quiz score.'; end if;
 end if;
 foreach k in array array['completed','reviewed','drafts','notes','drills','helpUsed'] loop
  if jsonb_typeof(p_state->k) is distinct from 'object' then raise exception 'Invalid progress field: %',k; end if;
 end loop;
 if jsonb_typeof(p_state->'history') is distinct from 'array' then raise exception 'Invalid history.'; end if;
 update public.learner_progress set state=p_state,revision=revision+1,updated_at=now()
 where user_id=auth.uid() and revision=p_revision returning revision into next_revision;
 if next_revision is null then raise exception 'PROGRESS_CONFLICT: Another session saved changes. Export your work, then reload.'; end if;
 return next_revision;
end; $$;
revoke all on function public.save_my_progress(jsonb,integer) from public;
grant execute on function public.save_my_progress(jsonb,integer) to authenticated;

create function public.touch_my_activity() returns void language sql security definer set search_path = '' as $$
 update public.profiles set last_seen_at=now() where id=auth.uid();
$$;
revoke all on function public.touch_my_activity() from public;
grant execute on function public.touch_my_activity() to authenticated;

create function public.admin_learners(p_search text default '',p_offset integer default 0)
returns table(id uuid,username text,display_name text,role text,created_at timestamptz,last_seen_at timestamptz,updated_at timestamptz,learning jsonb,total bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
 if not public.is_admin() then raise exception 'Administrator access required.' using errcode='42501'; end if;
 return query select p.id,p.username,p.display_name,p.role,p.created_at,p.last_seen_at,l.updated_at,
 jsonb_build_object('plan',l.state->'plan','day',l.state->'day','completed',l.state->'completed','reviewed',l.state->'reviewed','quizScore',l.state->'quizScore'),count(*) over()
 from public.profiles p join public.learner_progress l on l.user_id=p.id
 where strpos(lower(p.username),lower(left(coalesce(p_search,''),80)))>0 or strpos(lower(p.display_name),lower(left(coalesce(p_search,''),80)))>0
 order by p.username limit 50 offset greatest(coalesce(p_offset,0),0);
end; $$;
revoke all on function public.admin_learners(text,integer) from public;
grant execute on function public.admin_learners(text,integer) to authenticated;
commit;
