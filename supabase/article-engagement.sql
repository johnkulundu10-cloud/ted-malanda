create table if not exists public.article_stats (
  slug text primary key,
  views bigint not null default 0 check (views >= 0),
  likes bigint not null default 0 check (likes >= 0),
  dislikes bigint not null default 0 check (dislikes >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_daily_views (
  slug text not null,
  visitor_id text not null,
  viewed_on date not null default current_date,
  primary key (slug, visitor_id, viewed_on)
);

create table if not exists public.article_reactions (
  slug text not null,
  visitor_id text not null,
  reaction text not null check (reaction in ('like', 'dislike')),
  updated_at timestamptz not null default now(),
  primary key (slug, visitor_id)
);

alter table public.article_stats enable row level security;
alter table public.article_daily_views enable row level security;
alter table public.article_reactions enable row level security;

drop policy if exists "Public can read article stats" on public.article_stats;
create policy "Public can read article stats" on public.article_stats for select using (true);

create or replace function public.record_article_view(p_slug text, p_visitor_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare inserted_count integer;
begin
  if length(trim(p_slug)) = 0 or length(trim(p_visitor_id)) < 8 then return; end if;
  insert into article_daily_views(slug, visitor_id) values (p_slug, p_visitor_id) on conflict do nothing;
  get diagnostics inserted_count = row_count;
  insert into article_stats(slug) values (p_slug) on conflict do nothing;
  if inserted_count = 1 then
    update article_stats set views = views + 1, updated_at = now() where slug = p_slug;
  end if;
end;
$$;

create or replace function public.set_article_reaction(p_slug text, p_visitor_id text, p_reaction text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare previous_reaction text;
begin
  if length(trim(p_slug)) = 0 or length(trim(p_visitor_id)) < 8 then return; end if;
  if p_reaction is not null and p_reaction not in ('like', 'dislike') then raise exception 'Invalid reaction'; end if;
  insert into article_stats(slug) values (p_slug) on conflict do nothing;
  select reaction into previous_reaction from article_reactions where slug = p_slug and visitor_id = p_visitor_id for update;
  if previous_reaction = p_reaction then return; end if;
  if previous_reaction = 'like' then update article_stats set likes = greatest(0, likes - 1) where slug = p_slug; end if;
  if previous_reaction = 'dislike' then update article_stats set dislikes = greatest(0, dislikes - 1) where slug = p_slug; end if;
  if p_reaction is null then
    delete from article_reactions where slug = p_slug and visitor_id = p_visitor_id;
  else
    insert into article_reactions(slug, visitor_id, reaction) values (p_slug, p_visitor_id, p_reaction)
    on conflict (slug, visitor_id) do update set reaction = excluded.reaction, updated_at = now();
    if p_reaction = 'like' then update article_stats set likes = likes + 1 where slug = p_slug; end if;
    if p_reaction = 'dislike' then update article_stats set dislikes = dislikes + 1 where slug = p_slug; end if;
  end if;
  update article_stats set updated_at = now() where slug = p_slug;
end;
$$;

revoke all on function public.record_article_view(text, text) from public;
revoke all on function public.set_article_reaction(text, text, text) from public;
grant execute on function public.record_article_view(text, text) to anon, authenticated;
grant execute on function public.set_article_reaction(text, text, text) to anon, authenticated;
grant select on public.article_stats to anon, authenticated;
