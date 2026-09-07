-- Ted Malanda publishing foundation. Safe to run more than once.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  image_url text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  author_id uuid references public.authors(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  image_alt text,
  image_caption text,
  original_publication text,
  original_url text,
  is_archived boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = auth.uid()) $$;

alter table public.admin_users enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public" on public.articles for select using (status = 'published' and published_at <= now());
drop policy if exists "Authors are public" on public.authors;
create policy "Authors are public" on public.authors for select using (true);
drop policy if exists "Categories are public" on public.categories;
create policy "Categories are public" on public.categories for select using (true);
drop policy if exists "Settings are public" on public.site_settings;
create policy "Settings are public" on public.site_settings for select using (true);

drop policy if exists "Admins manage articles" on public.articles;
create policy "Admins manage articles" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage authors" on public.authors;
create policy "Admins manage authors" on public.authors for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can see themselves" on public.admin_users;
create policy "Admins can see themselves" on public.admin_users for select to authenticated using (user_id = auth.uid());

insert into public.categories(name, slug) values
  ('Public Affairs','public-affairs'),('Kenyan Life','kenyan-life'),('People & Society','people-society'),
  ('Memory & Place','memory-place'),('Humour & Satire','humour-satire')
on conflict (slug) do nothing;

insert into public.authors(name, slug, bio, is_default) values
  ('Ted Malanda','ted-malanda','Kenyan writer, columnist and veteran editor.',true)
on conflict (slug) do update set is_default = true;

insert into public.site_settings(key, value) values
('about', '{"heading":"Writer. Editor. Observer of Kenyan life.","intro":"Ted Malanda is a Kenyan writer, columnist and veteran editor known for finding humour, contradiction and insight in everyday life.","body":"Across a long career in Kenyan journalism, Ted has written about the institutions that shape public life and the ordinary encounters that reveal who we are.","secondary":"He has worked as a writer and editor, including serving as the founding editor of The Nairobian.","closing_heading":"Old stories, new observations.","closing_body":"The collection will continue to grow as earlier columns are prepared for the archive and new work is published.","image_url":"/images/ted-malanda.png"}'::jsonb),
('appearance', '{"heading_font":"Figtree","reading_font":"Source Serif 4"}'::jsonb)
on conflict (key) do nothing;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('article-images','article-images',true,10485760,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true;

drop policy if exists "Public reads article images" on storage.objects;
create policy "Public reads article images" on storage.objects for select using (bucket_id = 'article-images');
drop policy if exists "Admins upload article images" on storage.objects;
create policy "Admins upload article images" on storage.objects for insert to authenticated with check (bucket_id = 'article-images' and public.is_admin());
drop policy if exists "Admins update article images" on storage.objects;
create policy "Admins update article images" on storage.objects for update to authenticated using (bucket_id = 'article-images' and public.is_admin());
drop policy if exists "Admins delete article images" on storage.objects;
create policy "Admins delete article images" on storage.objects for delete to authenticated using (bucket_id = 'article-images' and public.is_admin());

-- Anonymous article engagement.
create table if not exists public.article_stats (slug text primary key, views bigint not null default 0 check (views >= 0), likes bigint not null default 0 check (likes >= 0), dislikes bigint not null default 0 check (dislikes >= 0), updated_at timestamptz not null default now());
create table if not exists public.article_daily_views (slug text not null, visitor_id text not null, viewed_on date not null default current_date, primary key (slug, visitor_id, viewed_on));
create table if not exists public.article_reactions (slug text not null, visitor_id text not null, reaction text not null check (reaction in ('like','dislike')), updated_at timestamptz not null default now(), primary key (slug, visitor_id));
alter table public.article_stats enable row level security;
alter table public.article_daily_views enable row level security;
alter table public.article_reactions enable row level security;
drop policy if exists "Public can read article stats" on public.article_stats;
create policy "Public can read article stats" on public.article_stats for select using (true);

create or replace function public.record_article_view(p_slug text, p_visitor_id text) returns void language plpgsql security definer set search_path=public as $$
declare inserted_count integer;
begin
  if length(trim(p_slug))=0 or length(trim(p_visitor_id))<8 then return; end if;
  insert into article_daily_views(slug,visitor_id) values(p_slug,p_visitor_id) on conflict do nothing;
  get diagnostics inserted_count = row_count;
  insert into article_stats(slug) values(p_slug) on conflict do nothing;
  if inserted_count=1 then update article_stats set views=views+1,updated_at=now() where slug=p_slug; end if;
end $$;

create or replace function public.set_article_reaction(p_slug text,p_visitor_id text,p_reaction text default null) returns void language plpgsql security definer set search_path=public as $$
declare previous_reaction text;
begin
  if length(trim(p_slug))=0 or length(trim(p_visitor_id))<8 then return; end if;
  if p_reaction is not null and p_reaction not in ('like','dislike') then raise exception 'Invalid reaction'; end if;
  insert into article_stats(slug) values(p_slug) on conflict do nothing;
  select reaction into previous_reaction from article_reactions where slug=p_slug and visitor_id=p_visitor_id for update;
  if previous_reaction=p_reaction then return; end if;
  if previous_reaction='like' then update article_stats set likes=greatest(0,likes-1) where slug=p_slug; end if;
  if previous_reaction='dislike' then update article_stats set dislikes=greatest(0,dislikes-1) where slug=p_slug; end if;
  if p_reaction is null then delete from article_reactions where slug=p_slug and visitor_id=p_visitor_id;
  else insert into article_reactions(slug,visitor_id,reaction) values(p_slug,p_visitor_id,p_reaction) on conflict(slug,visitor_id) do update set reaction=excluded.reaction,updated_at=now();
    if p_reaction='like' then update article_stats set likes=likes+1 where slug=p_slug; end if;
    if p_reaction='dislike' then update article_stats set dislikes=dislikes+1 where slug=p_slug; end if;
  end if;
  update article_stats set updated_at=now() where slug=p_slug;
end $$;

revoke all on function public.record_article_view(text,text) from public;
revoke all on function public.set_article_reaction(text,text,text) from public;
grant execute on function public.record_article_view(text,text) to anon,authenticated;
grant execute on function public.set_article_reaction(text,text,text) to anon,authenticated;
grant select on public.article_stats to anon,authenticated;
grant select on public.articles,public.authors,public.categories,public.site_settings to anon,authenticated;
grant insert,update,delete on public.articles,public.authors,public.categories,public.site_settings to authenticated;
grant select on public.admin_users to authenticated;

-- After creating your Auth user, run this separately with the correct email:
-- insert into public.admin_users(user_id) select id from auth.users where email = 'YOUR-EMAIL@example.com' on conflict do nothing;
