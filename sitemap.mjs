const siteUrl = 'https://agarwalandgehlotrealtors.com';

export const staticSitePaths = [
  '/', '/about', '/contact', '/services', '/residential', '/commercial', '/plots', '/investment', '/property-finder',
  '/projects', '/projects/gallery', '/projects/jade-county', '/projects/ivory-county', '/projects/clove-county', '/projects/county-150',
  '/projects/cleo-county-sector-121-noida', '/projects/county-107-sector-107-noida', '/projects/orange-county-indirapuram',
  '/projects/ivy-county-sector-75-noida', '/projects/coco-county-greater-noida-west', '/projects/the-center-court-sector-88a-gurugram',
  '/projects/cherry-county-greater-noida-west', '/projects/county-courtyard-netaji-subhash-place', '/projects/olive-county-vasundhara-ghaziabad',
  '/property-in-noida', '/3bhk-flat', '/property-in-greater-noida', '/property-investment-noida', '/luxury-properties-noida', '/property-near-noida-airport',
  '/services/buy-property', '/services/sell-property', '/services/commercial-real-estate', '/services/property-investment',
  '/services/nri-services', '/services/property-consultation', '/services/site-visits', '/services/home-loan-assistance',
  '/services/legal-documentation', '/privacy-policy', '/blog', '/community-blogs',
];

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function seoRecord(blog) {
  return Array.isArray(blog.seo) ? blog.seo[0] : blog.seo;
}

export function buildSitemap(blogs = [], categories = []) {
  const entries = new Map();
  for (const path of staticSitePaths) entries.set(path, null);

  const publishable = blogs.filter((blog) => {
    const isLive = blog.status === 'published' && blog.published_at && new Date(blog.published_at) <= new Date()
      || blog.status === 'scheduled' && blog.scheduled_at && new Date(blog.scheduled_at) <= new Date();
    const seo = seoRecord(blog);
    const indexable = !seo?.robots?.startsWith('noindex');
    const canonical = seo?.canonical_url || `${siteUrl}/blog/${blog.slug}`;
    return isLive && indexable && canonical === `${siteUrl}/blog/${blog.slug}`;
  });

  const publishedSlugs = new Set(publishable.map((blog) => blog.slug));
  const categoryIdsWithArticles = new Set(publishable.map((blog) => blog.category_id).filter(Boolean));
  for (const category of categories) {
    if (category.slug && categoryIdsWithArticles.has(category.id) && !publishedSlugs.has(category.slug)) entries.set(`/blog/${category.slug}`, null);
  }
  const authorSlugs = new Set();
  for (const blog of publishable) {
    entries.set(`/blog/${blog.slug}`, blog.updated_at || blog.published_at);
    const author = Array.isArray(blog.author) ? blog.author[0] : blog.author;
    if (author?.slug) authorSlugs.add(author.slug);
  }
  for (const slug of authorSlugs) entries.set(`/author/${slug}`, null);

  const urls = [...entries].map(([path, lastmod]) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc>${lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString().slice(0, 10))}</lastmod>` : ''}</url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
