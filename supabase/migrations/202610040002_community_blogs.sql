-- Migration: 202610040002_community_blogs.sql
-- Description: Creates the community_blogs table allowing unauthenticated public submissions and reads

create table if not exists public.community_blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 250),
  slug text not null unique,
  author_name text not null check (char_length(author_name) between 2 and 120),
  category text not null default 'General Real Estate',
  content text not null check (char_length(content) >= 10),
  status text not null default 'published' check (status in ('published', 'pending', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.community_blogs enable row level security;

drop policy if exists "Anyone can read community blogs" on public.community_blogs;
create policy "Anyone can read community blogs"
  on public.community_blogs for select
  using (status = 'published');

drop policy if exists "Anyone can submit community blogs" on public.community_blogs;
create policy "Anyone can submit community blogs"
  on public.community_blogs for insert to anon, authenticated
  with check (true);
