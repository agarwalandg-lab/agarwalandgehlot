import { createClient } from '@supabase/supabase-js';
import { buildSitemap } from '../sitemap.mjs';

export default async function handler(_request, response) {
  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    response.status(200).send(buildSitemap());
    return;
  }

  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const now = new Date().toISOString();
  const [blogs, categories] = await Promise.all([
    client.from('blogs').select('slug,category_id,status,published_at,scheduled_at,updated_at,seo:blog_seo(robots,canonical_url),author:authors(slug)')
      .or(`and(status.eq.published,published_at.lte.${now}),and(status.eq.scheduled,scheduled_at.lte.${now})`),
    client.from('blog_categories').select('id,slug'),
  ]);

  if (blogs.error || categories.error) {
    console.error('Could not load blog sitemap data.', blogs.error || categories.error);
    response.status(200).send(buildSitemap());
    return;
  }
  response.status(200).send(buildSitemap(blogs.data || [], categories.data || []));
}
