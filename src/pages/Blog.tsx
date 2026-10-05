import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { BlogCategory, BlogPost, estimateReadingMinutes, loadBlogCategories, loadPublishedBlogs } from '../data/blogStore';
import { BlogArticleView } from './BlogArticle';

const pageSize = 9;
const siteUrl = 'https://agarwalandgehlotrealtors.com';

function formatDate(value: string | null) {
  if (!value) return 'Date to be confirmed';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

function publicationDate(post: BlogPost) {
  return post.published_at || (post.status === 'scheduled' ? post.scheduled_at : null);
}

function updateMeta(selector: string, key: 'name' | 'property', value: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(key, value);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function useBlogListingData() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all([loadPublishedBlogs(), loadBlogCategories()])
      .then(([items, categoryItems]) => { if (active) { setBlogs(items); setCategories(categoryItems); } })
      .catch(() => { if (active) setError('Articles are temporarily unavailable. Please try again later.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { blogs, categories, loading, error };
}

export function BlogRouteResolver() {
  const { slug } = useParams();
  const { blogs, categories, loading, error } = useBlogListingData();
  const post = blogs.find((blog) => blog.slug === slug);
  const category = categories.find((item) => item.slug === slug);
  useEffect(() => {
    if (loading || error || post || category) return;
    document.title = 'Article Not Found | A&G Realtors';
    updateMeta('meta[name="robots"]', 'name', 'robots', 'noindex,follow');
    document.head.querySelector('link[rel="canonical"]')?.remove();
  }, [category, error, loading, post]);
  if (loading) return <main className="min-h-screen bg-bg px-6 pt-36 text-center text-muted">Loading real estate insights...</main>;
  if (error) return <main className="min-h-screen bg-bg px-6 pt-36 text-center text-muted">{error}</main>;
  if (post) return <BlogArticleView post={post} allBlogs={blogs} />;
  if (category) return <BlogListing category={category} allBlogs={blogs} categories={categories} />;
  return <main className="min-h-[70vh] bg-bg px-6 pt-40 text-center"><h1 className="text-4xl font-display">This article isn&apos;t available</h1><Link to="/blog" className="mt-6 inline-block border-b border-stroke pb-1 text-sm">Browse all insights</Link></main>;
}

export default function BlogPage() {
  const { blogs, categories, loading, error } = useBlogListingData();
  if (loading) return <main className="min-h-screen bg-bg px-6 pt-36 text-center text-muted">Loading real estate insights...</main>;
  if (error) return <main className="min-h-screen bg-bg px-6 pt-36 text-center text-muted">{error}</main>;
  return <BlogListing allBlogs={blogs} categories={categories} />;
}

function BlogListing({ allBlogs, categories, category }: { allBlogs: BlogPost[]; categories: BlogCategory[]; category?: BlogCategory }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'latest';
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const title = category?.seo_title || (category ? `${category.name} Articles | Real Estate Insights | A&G` : 'Real Estate Insights | Market Updates and Buying Guides | A&G');
    const description = category?.meta_description || (category ? `Read ${category.name.toLowerCase()} articles, buying guides and property updates from A&G Realtors.` : 'Explore A&G Realtors insights on Noida and Greater Noida property, market updates, investment, buying guides and project news.');
    const canonical = `${siteUrl}${category ? `/blog/${category.slug}` : '/blog'}`;
    document.title = title;
    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[name="robots"]', 'name', 'robots', category && !allBlogs.some((post) => post.category_id === category.id) ? 'noindex,follow' : 'index,follow');
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
  }, [allBlogs, category]);

  const filteredBlogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matching = allBlogs.filter((blog) => (!category || blog.category_id === category.id) && (!q || [blog.title, blog.excerpt, blog.category?.name, blog.author?.name, ...(blog.seo?.secondary_keywords || [])].join(' ').toLowerCase().includes(q)));
    return matching.sort((a, b) => {
      const aDate = new Date(publicationDate(a) || a.updated_at).getTime();
      const bDate = new Date(publicationDate(b) || b.updated_at).getTime();
      return sort === 'latest' ? bDate - aDate : aDate - bDate;
    });
  }, [allBlogs, category, query, sort]);

  const featured = filteredBlogs.find((blog) => blog.is_featured) || filteredBlogs[0];
  const nonFeatured = filteredBlogs.filter((blog) => blog.id !== featured?.id);
  const visibleBlogs = nonFeatured.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasMore = currentPage * pageSize < nonFeatured.length;
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next, { replace: true });
  };

  return <main className="min-h-screen bg-bg pb-24 pt-32">
    <section className="mx-auto max-w-[1400px] px-6 md:px-10">
      <div className="grid gap-10 border-b border-stroke pb-12 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <div><p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted">A&amp;G Realtors · Noida &amp; Delhi NCR</p><h1 className="max-w-4xl text-5xl font-display leading-tight md:text-7xl">Real Estate Insights</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">Property insights, market updates, considered investment guides and project news to help you ask better questions before you buy, sell or invest.</p><Link to="/admin/blogs?new=1" className="mt-6 inline-flex items-center gap-2 border border-stroke px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-text-primary transition-colors hover:bg-surface"><span aria-hidden="true">+</span> Create New Blog</Link></div>
        <label className="relative block"><span className="sr-only">Search articles</span><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setParam('q', event.target.value)} placeholder="Search articles..." className="h-14 w-full border border-stroke bg-surface pl-12 pr-4 text-sm outline-none focus:border-text-primary" /></label>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-stroke py-5" aria-label="Blog categories">
        <Link to="/blog" className={`border px-4 py-2 text-xs transition-colors ${!category ? 'border-text-primary bg-text-primary text-bg' : 'border-stroke text-muted hover:text-text-primary'}`}>All Insights</Link>
        {categories.map((item) => <Link key={item.id} to={`/blog/${item.slug}`} className={`border px-4 py-2 text-xs transition-colors ${category?.id === item.id ? 'border-text-primary bg-text-primary text-bg' : 'border-stroke text-muted hover:text-text-primary'}`}>{item.name}</Link>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke py-5"><p className="text-sm text-muted">{category?.name || 'Latest articles'} · {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}</p><label className="flex items-center gap-3 text-xs text-muted">Sort<select value={sort} onChange={(event) => setParam('sort', event.target.value)} className="border border-stroke bg-bg px-3 py-2 text-text-primary"><option value="latest">Latest</option><option value="oldest">Oldest</option></select></label></div>
      {featured && currentPage === 1 && <FeaturedBlog post={featured} />}
      {visibleBlogs.length ? <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">{visibleBlogs.map((post) => <BlogCard key={post.id} post={post} />)}</div> : !featured ? <p className="py-20 text-center text-muted">No articles match this search yet.</p> : null}
      {hasMore && <div className="mt-14 text-center"><button type="button" onClick={() => setParam('page', String(currentPage + 1))} className="inline-flex items-center gap-3 border border-stroke px-7 py-4 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-surface">Load More <FiArrowRight /></button></div>}
    </section>
  </main>;
}

function FeaturedBlog({ post }: { post: BlogPost }) {
  return <article className="mt-8 grid overflow-hidden border border-stroke bg-surface lg:grid-cols-[1.15fr_0.85fr]">
    <Link to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`} className="block aspect-[16/10] overflow-hidden bg-black/5 lg:aspect-auto"><img src={post.featured_image} srcSet={post.featured_image_srcset || undefined} sizes="(min-width: 1024px) 60vw, 100vw" alt={post.featured_image_alt} title={post.featured_image_title || undefined} width="1600" height="1000" fetchPriority="high" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" /></Link>
    <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12"><p className="text-xs uppercase tracking-[0.2em] text-muted">Featured · {post.category?.name || 'Real Estate Insights'}</p><Link to={`/blog/${post.slug}`}><h2 className="mt-4 text-3xl font-display leading-tight md:text-5xl">{post.title}</h2></Link><p className="mt-5 leading-relaxed text-muted">{post.excerpt}</p><BlogByline post={post} /><Link to={`/blog/${post.slug}`} className="mt-8 inline-flex w-fit items-center gap-3 border-b border-text-primary pb-2 text-xs uppercase tracking-[0.16em]">Read Article <FiArrowRight /></Link></div>
  </article>;
}

function BlogCard({ post }: { post: BlogPost }) {
  return <article className="flex min-w-0 flex-col border-t border-stroke pt-4">
    <Link to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`} className="block aspect-[4/3] overflow-hidden bg-surface"><img src={post.featured_image} srcSet={post.featured_image_srcset || undefined} sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" alt={post.featured_image_alt} title={post.featured_image_title || undefined} width="960" height="720" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.035]" /></Link>
    <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted">{post.category?.name || 'Real Estate Insights'}</p>
    <Link to={`/blog/${post.slug}`}><h2 className="mt-2 text-2xl font-display leading-snug">{post.title}</h2></Link>
    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
    <BlogByline post={post} compact />
    <Link to={`/blog/${post.slug}`} className="mt-5 flex items-center justify-between border-t border-stroke pt-4 text-xs uppercase tracking-[0.14em]">Read More <FiArrowRight /></Link>
  </article>;
}

function BlogByline({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  return <div className={`mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted ${compact ? 'text-[11px]' : ''}`}>
    <span>By <Link to={`/author/${post.author?.slug || 'a-g-realtors'}`} className="text-text-primary hover:underline">{post.author?.name || 'A&G Realtors'}</Link></span><span aria-hidden="true">·</span><time dateTime={publicationDate(post) || ''}>{formatDate(publicationDate(post))}</time><span aria-hidden="true">·</span><span>{estimateReadingMinutes(post.content)} min read</span>
  </div>;
}

export { BlogCard, BlogByline, FeaturedBlog, formatDate, siteUrl };
