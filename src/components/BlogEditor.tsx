import { lazy, Suspense, useEffect, useState } from 'react';
import { FiArrowDown, FiArrowUp, FiEye, FiSave, FiSend, FiX } from 'react-icons/fi';
import { BlogAuthor, BlogCategory, BlogDraft, BlogPost, BlogStatus, BlogTag, BlogLink, makeEmptyBlog, slugify, uploadBlogImage } from '../data/blogStore';
import { BlogArticleView } from '../pages/BlogArticle';
import { siteUrl } from '../pages/Blog';

type Props = {
  initial: BlogDraft;
  categories: BlogCategory[];
  authors: BlogAuthor[];
  tags: BlogTag[];
  posts: BlogPost[];
  onClose: () => void;
  onSave: (draft: BlogDraft) => Promise<string>;
};

const fieldClass = 'admin-input w-full px-3 py-3 text-sm';
const sectionClass = 'border-t border-stroke py-7';
const labelClass = 'mb-2 block text-xs uppercase tracking-[0.14em] text-muted';
const BlogRichEditor = lazy(() => import('./BlogRichEditor'));
const seoDefaults = (title: string, slug: string): BlogDraft['seo'] => ({
  seo_title: title ? `${title} | A&G Realtors` : '', meta_description: '', focus_keyword: '', secondary_keywords: [],
  canonical_url: slug ? `${siteUrl}/blog/${slug}` : '', robots: 'index,follow', og_title: '', og_description: '', og_image: '',
  twitter_card: 'summary_large_image', twitter_title: '', twitter_description: '', twitter_image: '',
});

function fieldSlug(slug: string) { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug); }
function localDateTime(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function BlogEditor({ initial, categories, authors, tags, posts, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<BlogDraft>(() => ({ ...makeEmptyBlog(), ...initial, seo: { ...seoDefaults(initial.title, initial.slug), ...initial.seo } }));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [preview, setPreview] = useState<'desktop' | 'tablet' | 'mobile' | null>(null);
  const [keywordInput, setKeywordInput] = useState((initial.seo.secondary_keywords || []).join(', '));
  const [tagInput, setTagInput] = useState((initial.tags || []).join(', '));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [canonicalTouched, setCanonicalTouched] = useState(Boolean(initial.seo.canonical_url));
  const [recoveryNotice, setRecoveryNotice] = useState(false);

  const update = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateSeo = <K extends keyof BlogDraft['seo']>(key: K, value: BlogDraft['seo'][K]) => setDraft((current) => ({ ...current, seo: { ...current.seo, [key]: value } }));
  const autosaveKey = `ag-blog-draft:${initial.id || 'new'}`;
  const initialUpdatedAt = (initial as BlogDraft & { updated_at?: string }).updated_at || initial.published_at;

  useEffect(() => {
    const stored = localStorage.getItem(autosaveKey);
    if (!stored) return;
    try {
      const recovery = JSON.parse(stored) as { savedAt: string; baseUpdatedAt?: string; draft: BlogDraft };
      const isNewer = !initial.id || !initialUpdatedAt || new Date(recovery.savedAt) > new Date(initialUpdatedAt);
      if (recovery.draft && isNewer && window.confirm('Restore the latest autosaved draft from this browser?')) {
        setDraft(recovery.draft);
        setKeywordInput(recovery.draft.seo.secondary_keywords.join(', '));
        setTagInput(recovery.draft.tags.join(', '));
        setRecoveryNotice(true);
      }
    } catch { localStorage.removeItem(autosaveKey); }
  }, [autosaveKey, initial.id, initialUpdatedAt]);

  useEffect(() => {
    if (!draft.title && !draft.content && !draft.excerpt) return;
    const timeout = window.setTimeout(() => {
      const savedAt = new Date();
      localStorage.setItem(autosaveKey, JSON.stringify({ savedAt: savedAt.toISOString(), baseUpdatedAt: initialUpdatedAt, draft }));
      setLastSaved(savedAt);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [draft, autosaveKey, initialUpdatedAt]);

  const wordCount = draft.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const seoTitle = draft.seo.seo_title || draft.title;
  const metaDescription = draft.seo.meta_description || draft.excerpt;
  const checks = [
    ['SEO title is set', Boolean(draft.seo.seo_title)],
    ['Meta description is set', Boolean(draft.seo.meta_description)],
    ['Slug uses lowercase words and hyphens', fieldSlug(draft.slug)],
    ['Focus keyword is set', Boolean(draft.seo.focus_keyword.trim())],
    ['Focus keyword appears in SEO title', Boolean(draft.seo.focus_keyword && seoTitle.toLowerCase().includes(draft.seo.focus_keyword.toLowerCase()))],
    ['Focus keyword appears in opening copy', Boolean(draft.seo.focus_keyword && draft.content.replace(/<[^>]*>/g, ' ').slice(0, 900).toLowerCase().includes(draft.seo.focus_keyword.toLowerCase()))],
    ['Article uses section headings', /<h[2-4]\b/i.test(draft.content)],
    ['Featured image is set', Boolean(draft.featured_image)],
    ['Featured image has alt text', Boolean(draft.featured_image_alt.trim())],
    ['Internal link is included', draft.links.some((link) => link.link_type === 'internal') || /href="\//i.test(draft.content)],
    ['External reference is included', draft.links.some((link) => link.link_type === 'external') || /href="https:\/\//i.test(draft.content)],
    ['Visible FAQs are added', draft.faqs.length > 0],
    ['Canonical URL is configured', Boolean(draft.seo.canonical_url)],
    ['Useful article length (500+ words)', wordCount >= 500],
    ['Open Graph image is set', Boolean(draft.seo.og_image || draft.featured_image)],
  ] as const;
  const completeChecks = checks.filter(([, complete]) => complete).length;
  const previewPost: BlogPost = {
    ...draft,
    id: draft.id || 'draft-preview',
    slug: draft.slug || 'draft-preview',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: categories.find((category) => category.id === draft.category_id) || null,
    author: authors.find((author) => author.id === draft.author_id) || null,
    faqs: draft.faqs,
    links: draft.links,
    tagRelations: draft.tags.map((name) => ({ tag: { id: name, name, slug: slugify(name) } })),
  };

  const upload = async (file: File) => uploadBlogImage(file, draft.slug || draft.title);
  const setTitle = (title: string) => {
    setDraft((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
      seo: {
        ...current.seo,
        seo_title: current.seo.seo_title ? current.seo.seo_title : `${title} | A&G Realtors`,
        canonical_url: canonicalTouched ? current.seo.canonical_url : `${siteUrl}/blog/${slugTouched ? current.slug : slugify(title)}`,
      },
    }));
  };
  const setSlug = (value: string, manuallyEdited = true) => {
    const slug = slugify(value);
    if (manuallyEdited) setSlugTouched(true);
    update('slug', slug);
    if (!canonicalTouched) updateSeo('canonical_url', `${siteUrl}/blog/${slug}`);
  };
  const addFaq = () => update('faqs', [...draft.faqs, { question: '', answer: '', sort_order: draft.faqs.length }]);
  const setFaq = (index: number, key: 'question' | 'answer', value: string) => update('faqs', draft.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const moveFaq = (index: number, offset: number) => {
    const next = [...draft.faqs];
    const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update('faqs', next.map((faq, sort_order) => ({ ...faq, sort_order })));
  };
  const addLink = () => update('links', [...draft.links, { anchor_text: '', url: '', link_type: 'internal', open_in_new_tab: false, nofollow: false, sponsored: false, sort_order: draft.links.length }]);
  const setLink = (index: number, key: keyof BlogLink, value: string | boolean) => update('links', draft.links.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));

  const submit = async (status: BlogStatus) => {
    let title = draft.title.trim();
    if (!title) title = 'Untitled Article';

    let slug = draft.slug ? slugify(draft.slug) : slugify(title);
    if (!slug) slug = `article-${Date.now()}`;

    let categoryId = draft.category_id || (categories.length > 0 ? categories[0].id : null);
    let authorId = draft.author_id || (authors.length > 0 ? authors[0].id : null);

    let featuredImage = draft.featured_image || '/cover/ivory-county.webp';
    let featuredAlt = draft.featured_image_alt.trim() || `${title} - A&G Realtors`;

    let plainText = draft.content.replace(/<[^>]*>/g, ' ').trim();
    let excerpt = draft.excerpt.trim() || plainText.slice(0, 180) || title;

    if (status === 'scheduled' && !draft.scheduled_at) {
      setMessage('Choose a scheduled publishing time first.');
      return;
    }

    const next: BlogDraft = {
      ...draft,
      title,
      slug,
      excerpt,
      featured_image: featuredImage,
      featured_image_alt: featuredAlt,
      category_id: categoryId,
      author_id: authorId,
      status,
      published_at: status === 'published' ? draft.published_at || new Date().toISOString() : draft.published_at,
      scheduled_at: status === 'scheduled' ? new Date(draft.scheduled_at as string).toISOString() : null,
      seo: {
        ...draft.seo,
        seo_title: draft.seo.seo_title || `${title} | A&G Realtors`,
        canonical_url: draft.seo.canonical_url || `${siteUrl}/blog/${slug}`,
        secondary_keywords: keywordInput.split(',').map((word) => word.trim()).filter(Boolean),
      },
      tags: [...new Set(tagInput.split(',').map((tag) => tag.trim()).filter(Boolean))],
    };

    setBusy(true);
    setMessage('Saving article…');
    try {
      const savedId = await onSave(next);
      setDraft((current) => ({ ...current, ...next, id: savedId }));
      localStorage.removeItem(autosaveKey);
      setMessage(status === 'published' ? '✓ Article published successfully!' : status === 'scheduled' ? '✓ Article scheduled successfully!' : '✓ Draft saved successfully!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save article. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (preview) return <main className="min-h-screen bg-bg pb-12 pt-5"><div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-stroke bg-bg/95 px-4 py-3 backdrop-blur"><div className="flex gap-2"><button onClick={() => setPreview('desktop')} className={`admin-muted-button px-4 py-2 text-xs ${preview === 'desktop' ? 'bg-surface' : ''}`}>Desktop</button><button onClick={() => setPreview('tablet')} className={`admin-muted-button px-4 py-2 text-xs ${preview === 'tablet' ? 'bg-surface' : ''}`}>Tablet</button><button onClick={() => setPreview('mobile')} className={`admin-muted-button px-4 py-2 text-xs ${preview === 'mobile' ? 'bg-surface' : ''}`}>Mobile</button></div><button onClick={() => setPreview(null)} className="admin-muted-button flex items-center gap-2 px-4 py-2 text-xs"><FiX /> Return to Editor</button></div><div className={`mx-auto mt-6 overflow-hidden border border-stroke bg-bg shadow-xl ${preview === 'mobile' ? 'max-w-[390px]' : preview === 'tablet' ? 'max-w-[820px]' : 'max-w-[1440px]'}`}><BlogArticleView post={previewPost} allBlogs={posts} isPreview /></div></main>;

  return <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
    <div className="min-w-0 space-y-5">
      <section className="admin-panel p-5 md:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.18em] text-muted">Blog Editor</p><p className="mt-1 text-xs text-muted">{lastSaved ? `Saved ${Math.max(0, Math.round((Date.now() - lastSaved.getTime()) / 1000))} seconds ago` : recoveryNotice ? 'Restored browser draft' : 'Autosave is on'}</p></div><button type="button" onClick={onClose} className="admin-muted-button flex items-center gap-2 px-4 py-2 text-xs"><FiX /> Close</button></div>
        <label className="block"><span className={labelClass}>Blog Title <span className="normal-case">({draft.title.length}/180)</span></span><input maxLength={180} value={draft.title} onChange={(event) => setTitle(event.target.value)} placeholder="Write a clear, specific article title" className={`${fieldClass} text-lg`} /></label>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end"><label className="block"><span className={labelClass}>URL Slug</span><div className="flex items-center border border-stroke bg-bg"><span className="shrink-0 pl-3 text-xs text-muted">/blog/</span><input value={draft.slug} onChange={(event) => setSlug(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none" /></div><span className="mt-1 block text-[11px] text-muted">Lowercase letters, numbers and hyphens.</span></label><button type="button" onClick={() => { setSlugTouched(false); setSlug(draft.title, false); }} className="admin-muted-button px-4 py-3 text-xs">Generate from Title</button></div>
        <label className="mt-5 block"><span className={labelClass}>Short Description / Excerpt <span className="normal-case">({draft.excerpt.length}/500)</span></span><textarea maxLength={500} rows={3} value={draft.excerpt} onChange={(event) => update('excerpt', event.target.value)} className={fieldClass} placeholder="Summarize the practical value of this article." /></label>
        <div className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className={labelClass}>Category</span><select value={draft.category_id || ''} onChange={(event) => update('category_id', event.target.value || null)} className={fieldClass}><option value="">Choose category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><span className={labelClass}>Author</span><select value={draft.author_id || ''} onChange={(event) => update('author_id', event.target.value || null)} className={fieldClass}><option value="">Choose author</option>{authors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
        <label className="mt-5 block"><span className={labelClass}>Tags <span className="normal-case">comma separated</span></span><input value={tagInput} onChange={(event) => setTagInput(event.target.value)} list="blog-tag-list" placeholder="Noida, Buying Guide" className={fieldClass} /><datalist id="blog-tag-list">{tags.map((tag) => <option key={tag.id} value={tag.name} />)}</datalist></label>
      </section>

      <section className="admin-panel p-5 md:p-7"><h2 className="text-2xl font-display">Featured Image</h2><div className="mt-5 grid gap-6 md:grid-cols-[1fr_1fr]">{draft.featured_image && <img src={draft.featured_image} srcSet={draft.featured_image_srcset || undefined} sizes="(min-width: 768px) 50vw, 100vw" alt={draft.featured_image_alt} className="aspect-[16/10] w-full bg-surface object-cover" />}<div className="space-y-4"><label className="block"><span className={labelClass}>Upload / Replace Image</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={async (event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (!file) return; setBusy(true); try { const image = await upload(file); setDraft((current) => ({ ...current, featured_image: image.src, featured_image_srcset: image.srcset, featured_image_alt: current.featured_image_alt || file.name.replace(/\.[^.]+$/, '') })); setMessage('Optimized image variants uploaded.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Image upload failed.'); } finally { setBusy(false); } }} className={`${fieldClass} file:mr-4 file:border-0 file:bg-surface file:px-3 file:py-2`} /></label><label className="block"><span className={labelClass}>Image URL</span><input value={draft.featured_image} onChange={(event) => update('featured_image', event.target.value)} className={fieldClass} /></label><label className="block"><span className={labelClass}>Alt Text</span><input maxLength={300} value={draft.featured_image_alt} onChange={(event) => update('featured_image_alt', event.target.value)} className={fieldClass} placeholder="Describe the image, not a list of keywords" /></label><label className="block"><span className={labelClass}>Image Title</span><input value={draft.featured_image_title} onChange={(event) => update('featured_image_title', event.target.value)} className={fieldClass} /></label><label className="block"><span className={labelClass}>Caption</span><input value={draft.featured_image_caption} onChange={(event) => update('featured_image_caption', event.target.value)} className={fieldClass} /></label><label className="block"><span className={labelClass}>Image Credit / Source</span><input value={draft.featured_image_credit} onChange={(event) => update('featured_image_credit', event.target.value)} className={fieldClass} /></label></div></div></section>

      <section className="admin-panel p-5 md:p-7"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-display">Article Content</h2><p className="mt-1 text-xs text-muted">H1 is reserved for the article title. Current length: {wordCount} words.</p></div><label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={draft.is_featured} onChange={(event) => update('is_featured', event.target.checked)} /> Featured article</label></div><Suspense fallback={<div role="status" className="min-h-[420px] animate-pulse border border-stroke bg-surface">Loading content tools…</div>}><BlogRichEditor value={draft.content} onChange={(content) => update('content', content)} onUploadImage={upload} /></Suspense></section>

      <section className={sectionClass}><div className="mb-4 flex items-center justify-between"><div><h2 className="text-2xl font-display">Frequently Asked Questions</h2><p className="mt-1 text-xs text-muted">Only these visible questions are included in FAQ structured data.</p></div><button type="button" onClick={addFaq} className="admin-muted-button px-4 py-2 text-xs">+ Add FAQ</button></div>{draft.faqs.map((faq, index) => <div key={index} className="mb-4 border border-stroke p-4"><div className="flex items-start gap-3"><div className="flex flex-1 flex-col gap-3"><input value={faq.question} onChange={(event) => setFaq(index, 'question', event.target.value)} placeholder="Question" className={fieldClass} /><textarea value={faq.answer} onChange={(event) => setFaq(index, 'answer', event.target.value)} placeholder="Answer" rows={3} className={fieldClass} /></div><div className="flex flex-col gap-1"><button disabled={index === 0} onClick={() => moveFaq(index, -1)} className="admin-muted-button p-2" aria-label="Move FAQ up"><FiArrowUp /></button><button disabled={index === draft.faqs.length - 1} onClick={() => moveFaq(index, 1)} className="admin-muted-button p-2" aria-label="Move FAQ down"><FiArrowDown /></button><button onClick={() => update('faqs', draft.faqs.filter((_, itemIndex) => index !== itemIndex))} className="admin-muted-button p-2 text-red-700" aria-label="Delete FAQ"><FiX /></button></div></div></div>)}</section>

      <section className={sectionClass}><div className="mb-4 flex items-center justify-between"><div><h2 className="text-2xl font-display">Links</h2><p className="mt-1 text-xs text-muted">Add useful references and internal destinations.</p></div><button type="button" onClick={addLink} className="admin-muted-button px-4 py-2 text-xs">+ Add Link</button></div>{draft.links.map((link, index) => <div key={index} className="mb-4 grid gap-3 border border-stroke p-4 md:grid-cols-2"><label><span className={labelClass}>Anchor Text</span><input value={link.anchor_text} onChange={(event) => setLink(index, 'anchor_text', event.target.value)} className={fieldClass} /></label><label><span className={labelClass}>URL</span><input value={link.url} onChange={(event) => setLink(index, 'url', event.target.value)} className={fieldClass} placeholder="/projects/ivory-county or https://..." /></label><label><span className={labelClass}>Type</span><select value={link.link_type} onChange={(event) => setLink(index, 'link_type', event.target.value)} className={fieldClass}><option value="internal">Internal</option><option value="external">External (HTTPS)</option></select></label><div className="flex flex-wrap items-end gap-4 text-xs"><label className="flex gap-2"><input type="checkbox" checked={link.open_in_new_tab} onChange={(event) => setLink(index, 'open_in_new_tab', event.target.checked)} /> New tab</label><label className="flex gap-2"><input type="checkbox" checked={link.nofollow} onChange={(event) => setLink(index, 'nofollow', event.target.checked)} /> Nofollow</label><label className="flex gap-2"><input type="checkbox" checked={link.sponsored} onChange={(event) => setLink(index, 'sponsored', event.target.checked)} /> Sponsored</label><button onClick={() => update('links', draft.links.filter((_, itemIndex) => index !== itemIndex))} className="text-red-700">Remove</button></div></div>)}</section>
    </div>

    <aside className="space-y-5 xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)] xl:overflow-y-auto">
      <section className="admin-panel p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-display">Publishing</h2><span className="text-xs text-muted">{draft.status}</span></div><label className="mt-4 block"><span className={labelClass}>Status</span><select value={draft.status} onChange={(event) => update('status', event.target.value as BlogStatus)} className={fieldClass}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></select></label><label className="mt-4 block"><span className={labelClass}>Publish on</span><input type="datetime-local" value={localDateTime(draft.scheduled_at)} onChange={(event) => update('scheduled_at', event.target.value ? new Date(event.target.value).toISOString() : null)} className={fieldClass} /></label><p className="mt-3 text-xs leading-relaxed text-muted">Scheduled articles become publicly available at the selected time. They are not added to the public sitemap before then.</p><div className="mt-5 grid grid-cols-2 gap-2"><button disabled={busy} onClick={() => void submit('draft')} className="admin-muted-button flex items-center justify-center gap-2 px-3 py-3 text-xs"><FiSave /> Save Draft</button><button disabled={busy} onClick={() => setPreview('desktop')} className="admin-muted-button flex items-center justify-center gap-2 px-3 py-3 text-xs"><FiEye /> Preview</button><button disabled={busy} onClick={() => void submit('scheduled')} className="admin-muted-button col-span-2 flex items-center justify-center gap-2 px-3 py-3 text-xs"><FiSend /> Schedule</button><button disabled={busy} onClick={() => void submit('published')} className="admin-accent col-span-2 flex items-center justify-center gap-2 px-3 py-3 text-xs"><FiSend /> {draft.status === 'published' ? 'Update Article' : 'Publish Article'}</button></div>{message && <p role="status" className="mt-3 text-xs text-muted">{message}</p>}</section>

      <section className="admin-panel p-5"><h2 className="text-xl font-display">SEO Settings</h2><label className="mt-4 block"><span className={labelClass}>SEO Title ({draft.seo.seo_title.length}/60 recommended)</span><input maxLength={80} value={draft.seo.seo_title} onChange={(event) => updateSeo('seo_title', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Meta Description ({draft.seo.meta_description.length}/160 recommended)</span><textarea maxLength={320} rows={4} value={draft.seo.meta_description} onChange={(event) => updateSeo('meta_description', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>SEO Slug</span><input value={draft.slug} onChange={(event) => setSlug(event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Focus Keyword</span><input maxLength={120} value={draft.seo.focus_keyword} onChange={(event) => updateSeo('focus_keyword', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Secondary Keywords</span><input value={keywordInput} onChange={(event) => { setKeywordInput(event.target.value); updateSeo('secondary_keywords', event.target.value.split(',').map((word) => word.trim()).filter(Boolean)); }} className={fieldClass} placeholder="Comma-separated, natural phrases" /></label><label className="mt-4 block"><span className={labelClass}>Canonical URL</span><input value={draft.seo.canonical_url || `${siteUrl}/blog/${draft.slug || 'article-slug'}`} onChange={(event) => { setCanonicalTouched(true); updateSeo('canonical_url', event.target.value); }} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Robots</span><select value={draft.seo.robots} onChange={(event) => updateSeo('robots', event.target.value as BlogDraft['seo']['robots'])} className={fieldClass}><option value="index,follow">Index, Follow</option><option value="index,nofollow">Index, NoFollow</option><option value="noindex,follow">NoIndex, Follow</option><option value="noindex,nofollow">NoIndex, NoFollow</option></select></label></section>

      <section className="admin-panel p-5"><h2 className="text-xl font-display">Social Preview</h2><label className="mt-4 block"><span className={labelClass}>Open Graph Title</span><input value={draft.seo.og_title} onChange={(event) => updateSeo('og_title', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Open Graph Description</span><textarea rows={3} value={draft.seo.og_description} onChange={(event) => updateSeo('og_description', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Open Graph Image URL</span><input value={draft.seo.og_image} onChange={(event) => updateSeo('og_image', event.target.value)} className={fieldClass} placeholder={draft.featured_image || 'Featured image fallback'} /></label><label className="mt-4 block"><span className={labelClass}>Twitter / X Card</span><select value={draft.seo.twitter_card} onChange={(event) => updateSeo('twitter_card', event.target.value as BlogDraft['seo']['twitter_card'])} className={fieldClass}><option value="summary_large_image">Large Image</option><option value="summary">Summary</option></select></label><label className="mt-4 block"><span className={labelClass}>Twitter / X Title</span><input value={draft.seo.twitter_title} onChange={(event) => updateSeo('twitter_title', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Twitter / X Description</span><textarea rows={3} value={draft.seo.twitter_description} onChange={(event) => updateSeo('twitter_description', event.target.value)} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Twitter / X Image URL</span><input value={draft.seo.twitter_image} onChange={(event) => updateSeo('twitter_image', event.target.value)} className={fieldClass} placeholder={draft.featured_image || 'Featured image fallback'} /></label><div className="mt-5 overflow-hidden border border-stroke bg-white text-black"><img src={draft.seo.og_image || draft.featured_image || '/logos/ag-logo.png'} alt="" width="1200" height="630" className="aspect-[1.91/1] w-full object-cover" /><div className="p-4"><p className="text-[10px] uppercase tracking-wider text-zinc-500">WhatsApp · Facebook · LinkedIn</p><p className="mt-2 line-clamp-2 text-base font-medium">{draft.seo.og_title || seoTitle || 'Open Graph title'}</p><p className="mt-1 line-clamp-2 text-xs text-zinc-600">{draft.seo.og_description || metaDescription || 'Open Graph description'}</p></div></div><div className="mt-3 overflow-hidden rounded-xl border border-stroke bg-white p-4 text-black"><p className="text-[10px] uppercase tracking-wider text-zinc-500">X · {draft.seo.twitter_card === 'summary' ? 'Summary' : 'Large image'}</p>{draft.seo.twitter_card === 'summary_large_image' && <img src={draft.seo.twitter_image || draft.featured_image || '/logos/ag-logo.png'} alt="" width="1200" height="630" className="mt-3 aspect-[1.91/1] w-full rounded object-cover" />}<p className="mt-3 line-clamp-2 text-sm font-medium">{draft.seo.twitter_title || seoTitle || 'Twitter / X title'}</p><p className="mt-1 line-clamp-2 text-xs text-zinc-600">{draft.seo.twitter_description || metaDescription || 'Twitter / X description'}</p></div></section>

      <section className="admin-panel p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-display">SEO Setup</h2><span className="text-sm font-medium">{completeChecks}/{checks.length}</span></div><p className="mt-2 text-xs leading-relaxed text-muted">Actionable editorial checks, not a ranking score or guarantee.</p><ul className="mt-4 space-y-3">{checks.map(([label, complete]) => <li key={label} className="flex items-start gap-2 text-xs"><span className={complete ? 'text-emerald-700' : 'text-amber-700'}>{complete ? '✓' : '○'}</span><span>{label}</span></li>)}</ul></section>

      <section className="admin-panel p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-display">Google Preview</h2><span className="text-[10px] uppercase tracking-[0.12em] text-muted">Live</span></div><div className="rounded border border-stroke bg-white p-4 text-left text-black"><p className="text-xs text-emerald-800">A&amp;G Realtors</p><p className="mt-1 line-clamp-2 text-lg leading-snug text-blue-800">{seoTitle || 'Article title preview'}</p><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-700">{metaDescription || 'Meta description preview'}</p><p className="mt-1 truncate text-[10px] text-zinc-500">agarwalandgehlotrealtors.com/blog/{draft.slug || 'article-slug'}</p></div><div className="mt-3 rounded border border-stroke bg-white p-3 text-left text-black"><p className="text-[10px] text-zinc-500">Mobile Search Preview</p><p className="mt-1 line-clamp-2 text-sm text-blue-800">{seoTitle || 'Article title preview'}</p><p className="mt-1 line-clamp-2 text-xs text-zinc-700">{metaDescription || 'Meta description preview'}</p></div></section>

      <section className="admin-panel p-5"><h2 className="text-xl font-display">Suggested internal links</h2><p className="mt-2 text-xs leading-relaxed text-muted">Choose links that genuinely help a reader continue their research.</p><div className="mt-4 flex flex-wrap gap-2">{['/property-in-noida', '/property-in-greater-noida', '/property-investment-noida', '/luxury-properties-noida', '/projects'].map((path) => <button key={path} type="button" onClick={() => update('links', [...draft.links, { anchor_text: path === '/projects' ? 'A&G projects' : path.replace(/-/g, ' ').replace('/', '').trim(), url: path, link_type: 'internal', open_in_new_tab: false, nofollow: false, sponsored: false, sort_order: draft.links.length }])} className="border border-stroke px-2 py-1 text-[10px] hover:bg-surface">{path}</button>)}</div><div className="mt-4 space-y-2">{posts.filter((post) => post.id !== draft.id).slice(0, 4).map((post) => <button key={post.id} type="button" onClick={() => update('links', [...draft.links, { anchor_text: post.title, url: `/blog/${post.slug}`, link_type: 'internal', open_in_new_tab: false, nofollow: false, sponsored: false, sort_order: draft.links.length }])} className="block text-left text-xs text-muted underline decoration-stroke underline-offset-4">{post.title}</button>)}</div></section>
    </aside>
  </div>;
}
