-- Uncle Ted editorial collection. Safe to run more than once.
create table if not exists public.uncle_ted_columns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  teaser text,
  letter text not null default '',
  correspondent_name text,
  response text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  image_url text,
  image_alt text,
  original_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.uncle_ted_columns enable row level security;
drop policy if exists "Published Uncle Ted columns are public" on public.uncle_ted_columns;
create policy "Published Uncle Ted columns are public" on public.uncle_ted_columns for select using (status='published' and published_at<=now());
drop policy if exists "Admins manage Uncle Ted columns" on public.uncle_ted_columns;
create policy "Admins manage Uncle Ted columns" on public.uncle_ted_columns for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.uncle_ted_columns to anon,authenticated;
grant insert,update,delete on public.uncle_ted_columns to authenticated;

insert into public.uncle_ted_columns(title,slug,teaser,letter,correspondent_name,response,status,published_at,image_url,image_alt,original_url)
values (
  'Ted Talk: Nairobi winter is killing me but wife has refused with the jiko',
  'nairobi-winter-is-killing-me-but-wife-has-refused-with-the-jiko',
  'Join either the Akorino or Roho Israeli sects. Jumping in their keshas all night will warm your chilled bones and take you to heaven as a bonus.',
  '<p>My wife stopped exciting me, so we rarely get intimate. We can go for as long as six months without doing anything. I have a girlfriend, but unfortunately, she gave birth two weeks ago.</p><p>Recently, I tried getting intimate with my wife because of the cold weather and she told me to go to hell. What should I do?</p>',
  'Joram',
  '<p>Bwana Joram,</p><p>I have a sneaking feeling that your wife suspects or knows you have been lighting another woman’s oven. Knowing women, she is not too excited about you bringing bacteria from “I don’t know where” into her marital bed.</p><p>There is also the likelihood that when you took a sabbatical from your conjugal duties, she got herself a helper who is strumming her guitar way better than you ever did.</p><p>I would, therefore, strongly advise that you join either the Akorino or Roho Israeli sects. Jumping in their keshas all night will warm your chilled bones and take you to heaven as a bonus.</p>',
  'published','2016-06-26T06:00:00Z',
  null,
  null,
  null
)
on conflict(slug) do update set title=excluded.title,teaser=excluded.teaser,letter=excluded.letter,correspondent_name=excluded.correspondent_name,response=excluded.response,status=excluded.status,published_at=excluded.published_at,image_url=excluded.image_url,image_alt=excluded.image_alt,original_url=excluded.original_url,updated_at=now();
