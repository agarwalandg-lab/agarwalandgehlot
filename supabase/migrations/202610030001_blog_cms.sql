create extension if not exists pgcrypto;

create or replace function public.is_blog_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.role() = 'authenticated' or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

create or replace function public.set_blog_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '',
  seo_title text not null default '',
  meta_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  profile_image text not null default '',
  bio text not null default '',
  profile_url text not null default '',
  social_links jsonb not null default '[]'::jsonb check (jsonb_typeof(social_links) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 5 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  content text not null default '',
  featured_image text not null default '',
  featured_image_srcset text not null default '',
  featured_image_alt text not null default '',
  featured_image_title text not null default '',
  featured_image_caption text not null default '',
  featured_image_credit text not null default '',
  category_id uuid references public.blog_categories(id) on delete set null,
  author_id uuid references public.authors(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled', 'archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or published_at is not null),
  check (status <> 'scheduled' or scheduled_at is not null)
);

create table if not exists public.blog_seo (
  blog_id uuid primary key references public.blogs(id) on delete cascade,
  seo_title text not null default '' check (char_length(seo_title) <= 80),
  meta_description text not null default '' check (char_length(meta_description) <= 320),
  focus_keyword text not null default '' check (char_length(focus_keyword) <= 120),
  secondary_keywords text[] not null default '{}',
  canonical_url text not null default '',
  robots text not null default 'index,follow' check (robots in ('index,follow', 'index,nofollow', 'noindex,follow', 'noindex,nofollow')),
  og_title text not null default '',
  og_description text not null default '',
  og_image text not null default '',
  twitter_card text not null default 'summary_large_image' check (twitter_card in ('summary', 'summary_large_image')),
  twitter_title text not null default '',
  twitter_description text not null default '',
  twitter_image text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_faqs (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  question text not null check (char_length(question) between 5 and 500),
  answer text not null check (char_length(answer) between 2 and 5000),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_tag_relations (
  blog_id uuid not null references public.blogs(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  primary key (blog_id, tag_id)
);

create table if not exists public.blog_links (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  anchor_text text not null check (char_length(anchor_text) between 1 and 200),
  url text not null check (url ~ '^(https://|/|#)'),
  link_type text not null check (link_type in ('internal', 'external')),
  open_in_new_tab boolean not null default false,
  nofollow boolean not null default false,
  sponsored boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists blogs_publication_idx on public.blogs (status, published_at desc, scheduled_at);
create index if not exists blogs_category_idx on public.blogs (category_id);
create index if not exists blogs_author_idx on public.blogs (author_id);
create index if not exists blog_faqs_order_idx on public.blog_faqs (blog_id, sort_order);
create index if not exists blog_links_order_idx on public.blog_links (blog_id, sort_order);
create index if not exists blog_tag_relations_tag_idx on public.blog_tag_relations (tag_id, blog_id);

create trigger blog_categories_updated_at before update on public.blog_categories
for each row execute function public.set_blog_updated_at();
create trigger authors_updated_at before update on public.authors
for each row execute function public.set_blog_updated_at();
create trigger blogs_updated_at before update on public.blogs
for each row execute function public.set_blog_updated_at();
create trigger blog_seo_updated_at before update on public.blog_seo
for each row execute function public.set_blog_updated_at();

alter table public.blog_categories enable row level security;
alter table public.authors enable row level security;
alter table public.blogs enable row level security;
alter table public.blog_seo enable row level security;
alter table public.blog_faqs enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_tag_relations enable row level security;
alter table public.blog_links enable row level security;

create policy "Anyone can read blog categories" on public.blog_categories
for select to anon, authenticated using (true);
create policy "Blog admins manage categories" on public.blog_categories
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read blog authors" on public.authors
for select to anon, authenticated using (true);
create policy "Blog admins manage authors" on public.authors
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read published blogs" on public.blogs
for select to anon, authenticated using (
  (status = 'published' and published_at <= now())
  or (status = 'scheduled' and scheduled_at <= now())
);
create policy "Blog admins manage blogs" on public.blogs
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read SEO for published blogs" on public.blog_seo
for select to anon, authenticated using (exists (
  select 1 from public.blogs b where b.id = blog_id and (
    (b.status = 'published' and b.published_at <= now())
    or (b.status = 'scheduled' and b.scheduled_at <= now())
  )
));
create policy "Blog admins manage SEO" on public.blog_seo
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read FAQs for published blogs" on public.blog_faqs
for select to anon, authenticated using (exists (
  select 1 from public.blogs b where b.id = blog_id and (
    (b.status = 'published' and b.published_at <= now())
    or (b.status = 'scheduled' and b.scheduled_at <= now())
  )
));
create policy "Blog admins manage FAQs" on public.blog_faqs
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read blog tags" on public.blog_tags
for select to anon, authenticated using (true);
create policy "Blog admins manage tags" on public.blog_tags
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read tags on published blogs" on public.blog_tag_relations
for select to anon, authenticated using (exists (
  select 1 from public.blogs b where b.id = blog_id and (
    (b.status = 'published' and b.published_at <= now())
    or (b.status = 'scheduled' and b.scheduled_at <= now())
  )
));
create policy "Blog admins manage tag relations" on public.blog_tag_relations
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

create policy "Anyone can read links on published blogs" on public.blog_links
for select to anon, authenticated using (exists (
  select 1 from public.blogs b where b.id = blog_id and (
    (b.status = 'published' and b.published_at <= now())
    or (b.status = 'scheduled' and b.scheduled_at <= now())
  )
));
create policy "Blog admins manage links" on public.blog_links
for all to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());

insert into public.blog_categories (name, slug, description) values
  ('Noida Real Estate', 'noida-real-estate', 'Property market information and locality guides for Noida.'),
  ('Greater Noida Real Estate', 'greater-noida-real-estate', 'Project and property guides for Greater Noida.'),
  ('Property Investment', 'property-investment', 'Practical guides to evaluating property investment and risk.'),
  ('Market Updates', 'market-updates', 'Dated updates about property markets and infrastructure.'),
  ('Buying Guide', 'buying-guide', 'Property purchase checklists and due diligence.'),
  ('Selling Guide', 'selling-guide', 'Information for property owners considering a sale.'),
  ('Rental Property', 'rental-property', 'Rental markets, ownership costs and leasing basics.'),
  ('Real Estate News', 'real-estate-news', 'Sourced property and infrastructure news.'),
  ('Project Updates', 'project-updates', 'Verified project status and document updates.'),
  ('Noida International Airport', 'noida-international-airport', 'Airport-area property information and verification guides.'),
  ('Jewar Airport', 'jewar-airport', 'Research and due diligence around the Jewar Airport area.'),
  ('Property Laws & RERA', 'property-laws-rera', 'Property documentation, regulations and RERA explainers.')
on conflict (slug) do nothing;

insert into public.authors (name, slug, bio, profile_url)
values ('A&G Realtors', 'a-g-realtors', 'Property consultants sharing practical information about Noida and Delhi NCR real estate.', '/author/a-g-realtors')
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-media', 'blog-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "Anyone can view blog media" on storage.objects
for select using (bucket_id = 'blog-media');
create policy "Blog admins can upload blog media" on storage.objects
for insert to authenticated with check (bucket_id = 'blog-media' and public.is_blog_admin());
create policy "Blog admins can update blog media" on storage.objects
for update to authenticated using (bucket_id = 'blog-media' and public.is_blog_admin())
with check (bucket_id = 'blog-media' and public.is_blog_admin());
create policy "Blog admins can delete blog media" on storage.objects
for delete to authenticated using (bucket_id = 'blog-media' and public.is_blog_admin());
