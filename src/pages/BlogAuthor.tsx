import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlogAuthor as AuthorRecord, BlogPost, loadAuthor, loadAuthorBlogs } from '../data/blogStore';
import { BlogCard, siteUrl } from './Blog';

export default function BlogAuthor() {
  const { slug = '' } = useParams();
  const [author, setAuthor] = useState<AuthorRecord | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profileHref = author?.profile_url.startsWith('/') || /^https:\/\//i.test(author?.profile_url || '') ? author?.profile_url : '';

  useEffect(() => {
    let active = true;
    loadAuthor(slug).then(async (profile) => {
      if (!profile) return;
      const articles = await loadAuthorBlogs(profile.id);
      if (active) { setAuthor(profile); setPosts(articles); }
    }).catch(() => { if (active) setError('Author information is temporarily unavailable.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!author) return;
    const title = `${author.name} | Authors | A&G Realtors`;
    const description = author.bio || `Read property insights written by ${author.name} for A&G Realtors.`;
    const canonical = `${siteUrl}/author/${author.slug}`;
    document.title = title;
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = posts.length ? 'index,follow' : 'noindex,follow';
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
    const schema = { '@context': 'https://schema.org', '@type': 'Person', name: author.name, description, url: canonical, image: author.profile_image || undefined, sameAs: author.social_links.map((item) => item.url) };
    let script = document.getElementById('blog-author-structured-data') as HTMLScriptElement | null;
    if (!script) { script = document.createElement('script'); script.id = 'blog-author-structured-data'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
    return () => script?.remove();
  }, [author, posts.length]);

  if (loading) return <main className="min-h-[70vh] bg-bg px-6 pt-40 text-center text-muted">Loading author...</main>;
  if (!author) return <main className="min-h-[70vh] bg-bg px-6 pt-40 text-center"><h1 className="text-4xl font-display">{error || 'Author not found'}</h1><Link to="/blog" className="mt-6 inline-block border-b border-stroke pb-1 text-sm">Browse real estate insights</Link></main>;

  return <main className="min-h-screen bg-bg pb-24 pt-32"><section className="mx-auto max-w-[1200px] px-6 md:px-10"><nav aria-label="Breadcrumb" className="mb-10 flex gap-2 text-xs text-muted"><Link to="/">Home</Link><span>/</span><Link to="/blog">Insights</Link><span>/</span><span className="text-text-primary">{author.name}</span></nav><header className="flex flex-col gap-7 border-b border-stroke pb-12 sm:flex-row sm:items-center">{author.profile_image && <img src={author.profile_image} alt={author.name} width="144" height="144" fetchPriority="high" className="h-28 w-28 rounded-full object-cover" />}<div><p className="text-xs uppercase tracking-[0.2em] text-muted">A&amp;G Realtors author</p><h1 className="mt-3 text-5xl font-display">{author.name}</h1><p className="mt-4 max-w-3xl leading-relaxed text-muted">{author.bio}</p>{profileHref && <a href={profileHref} target={profileHref.startsWith('/') ? undefined : '_blank'} rel={profileHref.startsWith('/') ? undefined : 'noopener noreferrer'} className="mt-4 inline-block border-b border-stroke pb-1 text-sm">Author profile</a>}</div></header><section className="pt-12"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-muted">Author archive</p><h2 className="mt-2 text-3xl font-display">Published articles</h2></div><span className="text-sm text-muted">{posts.length} {posts.length === 1 ? 'article' : 'articles'}</span></div>{posts.length ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div> : <p className="border-t border-stroke py-10 text-sm text-muted">No published articles yet.</p>}</section></section></main>;
}
