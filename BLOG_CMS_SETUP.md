# Blog CMS Setup

## Database

The blog tables, RLS policies, seeded categories/author and `blog-media` storage bucket are defined in `supabase/migrations/202610030001_blog_cms.sql`. The migration has been applied to the connected A&G Supabase project. Apply it once when setting up another project.

Public reads are limited to published articles and scheduled articles whose scheduled time has arrived. All content writes, category/tag/author management and media uploads require the JWT claim `app_metadata.role = admin`.

## Admin Access

Set these server environment variables in local `.env` and in the Vercel project settings:

- `ADMIN_EMAIL`: the email of the intended A&G administrator's existing Supabase Auth user
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service-role key; server-side only, never prefix it with `VITE_`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

After configuration, sign in at `/admin/blogs` with that Supabase Auth account. The server bootstrap endpoint grants the protected app-metadata role only when the authenticated email exactly matches `ADMIN_EMAIL`. Blog tables independently enforce the same role in RLS.

## Publishing And Sitemap

`/sitemap.xml` is served dynamically by the Node server and the Vercel function. It includes static site routes plus published/indexable blogs, categories with published articles and their active author pages. Drafts, future scheduled posts, noindex posts and posts with an alternate canonical are omitted. Submit `https://agarwalandgehlotrealtors.com/sitemap.xml` to Google Search Console after deploying.

The public site is currently a Vite React SPA. Blog routes set metadata and JSON-LD client-side for search engines that render JavaScript; a future SSR migration would improve first-response metadata for crawlers that do not render JavaScript.
