import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCopy, FiShare2 } from 'react-icons/fi';
import { BlogPost, estimateReadingMinutes, makeTocAndSafeHtml } from '../data/blogStore';
import { BlogByline, BlogCard, formatDate, siteUrl } from './Blog';

function writeMeta(selector: string, key: 'name' | 'property', name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) { meta = document.createElement('meta'); meta.setAttribute(key, name); document.head.appendChild(meta); }
  meta.content = content;
}

export function BlogArticleView({ post, allBlogs, isPreview = false }: { post: BlogPost; allBlogs: BlogPost[]; isPreview?: boolean }) {
  const [shareMessage, setShareMessage] = useState('');
  const canonical = post.seo?.canonical_url || `${siteUrl}/blog/${post.slug}`;
  const title = post.seo?.seo_title || `${post.title} | A&G Realtors`;
  const description = post.seo?.meta_description || post.excerpt;
  const image = post.seo?.og_image || post.featured_image;
  const robots = post.seo?.robots || 'index,follow';
  const { html, headings } = useMemo(() => makeTocAndSafeHtml(post.content), [post.content]);
  const related = allBlogs.filter((item) => item.id !== post.id && item.category_id === post.category_id).slice(0, 3);
  const orderedPosts = [...allBlogs].sort((a, b) => new Date(b.published_at || b.updated_at).getTime() - new Date(a.published_at || a.updated_at).getTime());
  const currentIndex = orderedPosts.findIndex((item) => item.id === post.id);
  const newer = currentIndex > 0 ? orderedPosts[currentIndex - 1] : null;
  const older = currentIndex >= 0 ? orderedPosts[currentIndex + 1] : null;
  const shareUrl = canonical;

  useEffect(() => {
    if (isPreview) return;
    document.title = title;
    writeMeta('meta[name="description"]', 'name', 'description', description);
    writeMeta('meta[name="robots"]', 'name', 'robots', robots);
    writeMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    writeMeta('meta[property="og:title"]', 'property', 'og:title', post.seo?.og_title || title);
    writeMeta('meta[property="og:description"]', 'property', 'og:description', post.seo?.og_description || description);
    writeMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    writeMeta('meta[property="og:image"]', 'property', 'og:image', image.startsWith('http') ? image : `${siteUrl}${image}`);
    writeMeta('meta[name="twitter:card"]', 'name', 'twitter:card', post.seo?.twitter_card || 'summary_large_image');
    writeMeta('meta[name="twitter:title"]', 'name', 'twitter:title', post.seo?.twitter_title || title);
    writeMeta('meta[name="twitter:description"]', 'name', 'twitter:description', post.seo?.twitter_description || description);
    writeMeta('meta[name="twitter:image"]', 'name', 'twitter:image', post.seo?.twitter_image || (image.startsWith('http') ? image : `${siteUrl}${image}`));
    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) { canonicalLink = document.createElement('link'); canonicalLink.rel = 'canonical'; document.head.appendChild(canonicalLink); }
    canonicalLink.href = canonical;

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description,
        image: image.startsWith('http') ? image : `${siteUrl}${image}`,
        datePublished: post.published_at || post.scheduled_at,
        dateModified: post.updated_at,
        author: { '@type': 'Person', name: post.author?.name || 'A&G Realtors', url: `${siteUrl}/author/${post.author?.slug || 'a-g-realtors'}` },
        publisher: { '@type': 'Organization', name: 'Agarwal and Gehlot Realtors', url: siteUrl },
        mainEntityOfPage: canonical,
        articleSection: post.category?.name,
        wordCount: post.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length,
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Real Estate Insights', item: `${siteUrl}/blog` },
        ...(post.category ? [{ '@type': 'ListItem', position: 3, name: post.category.name, item: `${siteUrl}/blog/${post.category.slug}` }] : []),
        { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title, item: canonical },
      ] },
    ];
    if (post.faqs?.length) graph.push({ '@type': 'FAQPage', mainEntity: post.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });
    let script = document.getElementById('blog-article-structured-data') as HTMLScriptElement | null;
    if (!script) { script = document.createElement('script'); script.id = 'blog-article-structured-data'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    return () => script?.remove();
  }, [canonical, description, image, isPreview, post, robots, title]);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.excerpt, url: shareUrl });
      else { await navigator.clipboard.writeText(shareUrl); setShareMessage('Article link copied.'); }
    } catch { setShareMessage('Sharing was cancelled.'); }
  };

  return <main className="min-h-screen bg-bg pb-24 pt-32">
    <article className="mx-auto max-w-[1180px] px-6 md:px-10">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted"><Link to="/" className="hover:text-text-primary">Home</Link><span aria-hidden="true">/</span><Link to="/blog" className="hover:text-text-primary">Real Estate Insights</Link>{post.category && <><span aria-hidden="true">/</span><Link to={`/blog/${post.category.slug}`} className="hover:text-text-primary">{post.category.name}</Link></>}<span aria-hidden="true">/</span><span className="text-text-primary">{post.title}</span></nav>
      <header className="mx-auto max-w-4xl border-b border-stroke pb-10 text-center">
        <Link to={`/blog/${post.category?.slug || ''}`} className="text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary">{post.category?.name || 'Real Estate Insights'}</Link>
        <h1 className="mt-5 text-4xl font-display leading-tight md:text-6xl">{post.title}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">{post.excerpt}</p>
        <div className="mt-6 flex justify-center"><BlogByline post={post} /></div>
        <p className="mt-2 text-xs text-muted">Updated {formatDate(post.updated_at)} · {estimateReadingMinutes(post.content)} minute read</p>
      </header>

      {post.featured_image && <figure className="mx-auto mt-10 max-w-[1100px]"><img src={post.featured_image} srcSet={post.featured_image_srcset || undefined} sizes="(min-width: 1200px) 1100px, 100vw" alt={post.featured_image_alt} title={post.featured_image_title || undefined} width="1600" height="1000" fetchPriority="high" className="aspect-[16/9] max-h-[70vh] w-full object-cover" />{(post.featured_image_caption || post.featured_image_credit) && <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted">{post.featured_image_caption}<span>{post.featured_image_credit}</span></figcaption>}</figure>}

      <div className="mx-auto mt-12 grid max-w-[1180px] gap-10 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
        {headings.length > 1 && <nav aria-label="Table of contents" className="self-start border-y border-stroke py-5 lg:sticky lg:top-28"><p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">In this article</p><ol className="space-y-3 text-sm">{headings.map((heading) => <li key={heading.id} className={heading.level === 'h3' ? 'pl-4' : ''}><a href={`#${heading.id}`} className="text-muted hover:text-text-primary">{heading.text}</a></li>)}</ol></nav>}
        <div className="min-w-0">
          <div className="blog-prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          {post.links?.length ? <aside className="mt-10 border-y border-stroke py-6"><h2 className="text-xl font-display">Related resources</h2><ul className="mt-4 space-y-3">{post.links.map((link) => <li key={`${link.url}-${link.anchor_text}`}><a href={link.url} target={link.open_in_new_tab || link.link_type === 'external' ? '_blank' : undefined} rel={link.link_type === 'external' ? `${link.nofollow ? 'nofollow ' : ''}${link.sponsored ? 'sponsored ' : ''}noopener noreferrer` : undefined} className="text-sm underline decoration-stroke underline-offset-4 hover:text-accent">{link.anchor_text}</a></li>)}</ul></aside> : null}

          {post.faqs?.length ? <section className="mt-14" aria-labelledby="article-faqs"><h2 id="article-faqs" className="mb-5 text-3xl font-display">Frequently Asked Questions</h2><div className="divide-y divide-stroke border-y border-stroke">{[...post.faqs].sort((a, b) => a.sort_order - b.sort_order).map((faq) => <details key={faq.id || faq.question} className="group py-5"><summary className="cursor-pointer list-none pr-6 text-base">{faq.question}<span className="float-right text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p></details>)}</div></section> : null}

          <section className="mt-14 border-y border-stroke py-5" aria-label="Share article"><div className="flex flex-wrap items-center gap-3"><span className="mr-2 text-xs uppercase tracking-[0.16em] text-muted">Share</span><button type="button" onClick={() => void share()} className="flex items-center gap-2 border border-stroke px-4 py-2 text-xs hover:bg-surface"><FiShare2 /> Share</button><a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" className="border border-stroke px-4 py-2 text-xs hover:bg-surface">WhatsApp</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="border border-stroke px-4 py-2 text-xs hover:bg-surface">LinkedIn</a><a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="border border-stroke px-4 py-2 text-xs hover:bg-surface">X</a><button type="button" onClick={() => void navigator.clipboard.writeText(shareUrl).then(() => setShareMessage('Article link copied.'))} className="flex items-center gap-2 border border-stroke px-4 py-2 text-xs hover:bg-surface"><FiCopy /> Copy link</button>{shareMessage && <span role="status" className="text-xs text-muted">{shareMessage}</span>}</div></section>
        </div>
      </div>

      <section className="mx-auto mt-16 max-w-4xl border-y border-stroke py-8"><div className="flex items-center gap-5">{post.author?.profile_image && <img src={post.author.profile_image} alt={post.author.name} width="72" height="72" loading="lazy" className="h-16 w-16 rounded-full object-cover" />}<div><p className="text-xs uppercase tracking-[0.18em] text-muted">Written by</p><Link to={`/author/${post.author?.slug || 'a-g-realtors'}`} className="mt-1 inline-block text-2xl font-display hover:underline">{post.author?.name || 'A&G Realtors'}</Link>{post.author?.bio && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{post.author.bio}</p>}</div></div></section>

      <section className="mx-auto mt-16 max-w-[1100px] border-y border-stroke py-12"><p className="text-xs uppercase tracking-[0.2em] text-muted">A&amp;G Realtors</p><h2 className="mt-4 max-w-3xl text-3xl font-display md:text-4xl">Looking for the right property in Noida or Greater Noida?</h2><div className="mt-6 flex flex-wrap gap-3"><Link to="/projects" className="bg-text-primary px-6 py-3 text-sm text-bg">Explore Projects</Link><Link to="/contact" className="border border-stroke px-6 py-3 text-sm">Contact A&amp;G Realtors</Link><a href="https://wa.me/919654322224" target="_blank" rel="noopener noreferrer" className="border border-stroke px-6 py-3 text-sm">WhatsApp Us</a></div></section>

      {related.length > 0 && <section className="mx-auto mt-16 max-w-[1100px]"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-muted">Continue Reading</p><h2 className="mt-2 text-3xl font-display">Related articles</h2></div><Link to="/blog" className="text-xs uppercase tracking-[0.12em]">All insights <FiArrowRight className="inline" /></Link></div><div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <BlogCard key={item.id} post={item} />)}</div></section>}

      <nav aria-label="Previous and next articles" className="mx-auto mt-12 flex max-w-[1100px] justify-between gap-4 border-t border-stroke pt-6">{older ? <Link to={`/blog/${older.slug}`} className="flex max-w-[48%] items-center gap-2 text-sm"><FiArrowLeft /> <span><span className="block text-xs text-muted">Older article</span>{older.title}</span></Link> : <span />}{newer && <Link to={`/blog/${newer.slug}`} className="flex max-w-[48%] items-center gap-2 text-right text-sm"><span><span className="block text-xs text-muted">Newer article</span>{newer.title}</span> <FiArrowRight /></Link>}</nav>
    </article>
  </main>;
}
