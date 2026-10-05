import { FormEvent, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { FiEdit2, FiExternalLink, FiLogOut, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import { BlogAuthor, BlogCategory, BlogDraft, BlogPost, BlogStatus, BlogTag, changeBlogStatus, deleteAuthor, deleteBlog, deleteCategory, deleteTag, loadAdminBlogData, makeEmptyBlog, saveBlog, saveTag, updateAuthor, updateCategory, uploadBlogImage } from '../data/blogStore';
import { supabase, supabaseConfigured } from '../lib/supabase';

const fieldClass = 'admin-input w-full px-3 py-3 text-sm';
const labelClass = 'mb-2 block text-xs uppercase tracking-[0.14em] text-muted';
type Tab = 'overview' | 'articles' | 'categories' | 'tags' | 'authors';
const BlogEditor = lazy(() => import('../components/BlogEditor'));

function draftFromPost(post: BlogPost): BlogDraft {
  return {
    ...makeEmptyBlog(), ...post,
    seo: { ...makeEmptyBlog().seo, ...(post.seo || {}) },
    faqs: (post.faqs || []).map((faq) => ({ ...faq })),
    links: (post.links || []).map((link) => ({ ...link })),
    tags: (post.tagRelations || []).map((relation) => relation.tag.name),
  };
}

function isoDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
}

export default function BlogAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [editing, setEditing] = useState<BlogDraft | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdmin = Boolean(session?.user);

  useEffect(() => {
    document.title = 'Private Blog Management | A&G Realtors';
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = 'noindex,nofollow';
    document.head.querySelector('link[rel="canonical"]')?.remove();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const listener = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.data.subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await loadAdminBlogData();
      setBlogs(data.blogs);
      setCategories(data.categories);
      setAuthors(data.authors);
      setTags(data.tags);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load blog workspace. Apply the blog CMS migration and check your admin role.');
    } finally { setBusy(false); }
  };

  useEffect(() => { if (isAdmin) void refresh(); }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || searchParams.get('new') !== '1' || editing) return;
    setTab('articles');
    setEditing(makeEmptyBlog());
    const next = new URLSearchParams(searchParams);
    next.delete('new');
    setSearchParams(next, { replace: true });
  }, [editing, isAdmin, searchParams, setSearchParams]);

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setLoginMessage('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.session) {
      setLoginMessage(authError?.message || 'Sign-in failed. Check your account details.');
      setBusy(false);
      return;
    }
    setSession(data.session);
    setBusy(false);
  };

  const openNew = () => { setTab('articles'); setEditing(makeEmptyBlog()); };
  const openEdit = (post: BlogPost) => { setTab('articles'); setEditing(draftFromPost(post)); };
  const save = async (draft: BlogDraft) => {
    const slug = draft.slug;
    if (blogs.some((post) => post.slug === slug && post.id !== draft.id)) throw new Error('That blog URL is already in use. Choose a unique slug.');
    if (categories.some((category) => category.slug === slug)) throw new Error('That URL is used by a category. Choose a different slug.');
    const id = await saveBlog(draft);
    setEditing((current) => current ? { ...current, ...draft, id } : current);
    await refresh();
    return id;
  };

  const filteredBlogs = useMemo(() => blogs.filter((post) => {
    const text = [post.title, post.slug, post.excerpt, post.author?.name, post.category?.name, ...(post.seo?.secondary_keywords || [])].join(' ').toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (statusFilter === 'all' || post.status === statusFilter) && (categoryFilter === 'all' || post.category_id === categoryFilter) && (authorFilter === 'all' || post.author_id === authorFilter);
  }).sort((a, b) => {
    const aDate = new Date(a.updated_at).getTime(); const bDate = new Date(b.updated_at).getTime();
    return sort === 'latest' ? bDate - aDate : aDate - bDate;
  }), [blogs, query, statusFilter, categoryFilter, authorFilter, sort]);
  const counts = { total: blogs.length, published: blogs.filter((post) => (post.status === 'published' && post.published_at && new Date(post.published_at) <= new Date()) || (post.status === 'scheduled' && post.scheduled_at && new Date(post.scheduled_at) <= new Date())).length, drafts: blogs.filter((post) => post.status === 'draft').length, scheduled: blogs.filter((post) => post.status === 'scheduled' && post.scheduled_at && new Date(post.scheduled_at) > new Date()).length };

  const duplicate = (post: BlogPost) => {
    const draft = draftFromPost(post);
    setEditing({ ...draft, id: undefined, title: `${post.title} (Copy)`, slug: `${post.slug}-copy`, status: 'draft', published_at: null, scheduled_at: null, is_featured: false });
    setTab('articles');
  };
  const remove = async (post: BlogPost) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    try { await deleteBlog(post.id); await refresh(); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'Could not delete article.'); }
  };
  const changeStatus = async (post: BlogPost, nextStatus: BlogStatus) => {
    try { await changeBlogStatus(post, nextStatus); await refresh(); }
    catch (statusError) { setError(statusError instanceof Error ? statusError.message : 'Could not update article status.'); }
  };

  if (!supabaseConfigured) return <AdminMessage title="Blog CMS unavailable" message="Supabase is not configured for this environment." />;
  if (!session) return <main className="admin-shell flex min-h-screen items-center justify-center p-6"><form onSubmit={submitLogin} className="admin-panel w-full max-w-md p-8"><p className="text-xs uppercase tracking-[0.2em] text-muted">A&amp;G private console</p><h1 className="mt-3 text-4xl font-display">Blog management</h1><p className="mt-3 text-sm leading-relaxed text-muted">Sign in with an account assigned the server-managed blog admin role.</p><label className="mt-8 block"><span className={labelClass}>Email</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} required /></label><label className="mt-4 block"><span className={labelClass}>Password</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={fieldClass} required /></label><button disabled={busy} className="admin-accent mt-6 w-full px-4 py-3 text-sm">{busy ? 'Signing in…' : 'Sign in'}</button>{loginMessage && <p role="alert" className="mt-4 text-sm text-amber-700">{loginMessage}</p>}<Link to="/blog" className="mt-6 inline-block text-xs text-muted">Return to public insights</Link></form></main>;
  if (!isAdmin) return <main className="admin-shell flex min-h-screen items-center justify-center p-6"><section className="admin-panel max-w-xl p-8"><p className="text-xs uppercase tracking-[0.2em] text-muted">Access restricted</p><h1 className="mt-3 text-4xl font-display">Blog administrator role required</h1><p className="mt-4 text-sm leading-relaxed text-muted">This signed-in account does not have the protected <code>app_metadata.role = admin</code> claim. A project owner must assign it through Supabase Auth; user-editable profile metadata is not accepted.</p><div className="mt-6 flex gap-3"><button onClick={() => void supabase.auth.signOut()} className="admin-muted-button px-4 py-3 text-sm">Sign out</button><Link to="/blog" className="admin-muted-button px-4 py-3 text-sm">Public blog</Link></div></section></main>;
  if (editing) return <main className="admin-shell min-h-screen p-4 md:p-8"><div className="mx-auto max-w-[1600px]"><Suspense fallback={<div role="status" className="admin-panel p-8 text-center text-sm text-muted">Loading the blog editor…</div>}><BlogEditor initial={editing} categories={categories} authors={authors} tags={tags} posts={blogs} onClose={() => setEditing(null)} onSave={save} /></Suspense></div></main>;

  const tabs: { value: Tab; label: string }[] = [{ value: 'overview', label: 'Overview' }, { value: 'articles', label: 'Articles' }, { value: 'categories', label: 'Categories' }, { value: 'tags', label: 'Tags' }, { value: 'authors', label: 'Authors' }];
  return <main className="admin-shell min-h-screen p-4 md:p-8"><div className="mx-auto max-w-[1500px]">
    <header className="flex flex-wrap items-center justify-between gap-5 border-b border-stroke pb-7"><div className="flex items-center gap-4"><Link to="/" className="flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-white"><img src="/logos/ag-logo.png" alt="A&G Realtors" className="h-full w-full object-contain p-1" /></Link><div><p className="text-xs uppercase tracking-[0.2em] text-muted">A&amp;G content studio</p><h1 className="mt-1 text-3xl font-display">Blog Management</h1></div></div><div className="flex flex-wrap gap-2"><Link to="/blog" className="admin-muted-button flex items-center gap-2 px-4 py-3 text-xs"><FiExternalLink /> View Blog</Link><button onClick={() => void supabase.auth.signOut()} className="admin-muted-button flex items-center gap-2 px-4 py-3 text-xs"><FiLogOut /> Sign out</button></div></header>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Metric label="Total Blogs" value={counts.total} /><Metric label="Published" value={counts.published} /><Metric label="Drafts" value={counts.drafts} /><Metric label="Scheduled" value={counts.scheduled} /><Metric label="Categories" value={categories.length} /></div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-stroke pb-4"><div className="flex flex-wrap gap-1">{tabs.map((item) => <button key={item.value} onClick={() => setTab(item.value)} className={`border-b-2 px-4 py-3 text-sm ${tab === item.value ? 'border-text-primary text-text-primary' : 'border-transparent text-muted hover:text-text-primary'}`}>{item.label}</button>)}</div><button onClick={openNew} className="admin-accent flex items-center gap-2 px-5 py-3 text-sm"><FiPlus /> Create New Blog</button></div>
    {error && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {busy && <p role="status" className="mt-3 text-xs text-muted">Refreshing content…</p>}
    {tab === 'overview' && <div className="mt-6 grid gap-6 lg:grid-cols-2"><RecentPosts title="Recently Published" posts={blogs.filter((post) => post.published_at).sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()).slice(0, 5)} onEdit={openEdit} /><RecentPosts title="Recently Updated" posts={[...blogs].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5)} onEdit={openEdit} /><section className="admin-panel p-6 lg:col-span-2"><p className="text-xs uppercase tracking-[0.16em] text-muted">Editorial workflow</p><h2 className="mt-2 text-2xl font-display">Draft carefully. Publish when it is ready.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">Create original, useful property information, verify facts and sources, then use the checklist for technical completeness. It is not a ranking guarantee.</p><button onClick={openNew} className="admin-accent mt-5 flex items-center gap-2 px-5 py-3 text-sm"><FiPlus /> Create New Blog</button></section></div>}
    {tab === 'articles' && <section className="admin-panel mt-6 p-4 md:p-6"><div className="grid gap-3 md:grid-cols-[minmax(200px,1fr)_repeat(4,minmax(140px,auto))]"><label className="relative"><span className="sr-only">Search blogs</span><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blogs" className={`${fieldClass} pl-10`} /></label><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={fieldClass}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><select value={authorFilter} onChange={(event) => setAuthorFilter(event.target.value)} className={fieldClass}><option value="all">All authors</option>{authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={fieldClass}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></select><select value={sort} onChange={(event) => setSort(event.target.value as 'latest' | 'oldest')} className={fieldClass}><option value="latest">Recently updated</option><option value="oldest">Oldest updated</option></select></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-stroke text-xs uppercase tracking-[0.12em] text-muted"><th className="p-3">Blog</th><th className="p-3">Category</th><th className="p-3">Author</th><th className="p-3">Status</th><th className="p-3">Published</th><th className="p-3">Updated</th><th className="p-3">Actions</th></tr></thead><tbody>{filteredBlogs.map((post) => <tr key={post.id} className="border-b border-stroke/70"><td className="max-w-[320px] p-3"><p className="truncate font-medium">{post.title}</p><p className="mt-1 truncate text-xs text-muted">/blog/{post.slug}</p></td><td className="p-3 text-muted">{post.category?.name || '—'}</td><td className="p-3 text-muted">{post.author?.name || '—'}</td><td className="p-3"><span className="border border-stroke px-2 py-1 text-xs capitalize">{post.status}</span></td><td className="p-3 text-xs text-muted">{isoDate(post.published_at)}</td><td className="p-3 text-xs text-muted">{isoDate(post.updated_at)}</td><td className="p-3"><div className="flex flex-wrap gap-2"><button onClick={() => openEdit(post)} aria-label={`Edit ${post.title}`} className="admin-muted-button p-2"><FiEdit2 /></button><button onClick={() => duplicate(post)} title="Duplicate" className="admin-muted-button px-3 py-2 text-xs">Duplicate</button>{post.status === 'published' ? <button onClick={() => void changeStatus(post, 'draft')} className="admin-muted-button px-3 py-2 text-xs">Unpublish</button> : <button onClick={() => setEditing({ ...draftFromPost(post), status: 'published' })} className="admin-muted-button px-3 py-2 text-xs">Publish</button>}<button onClick={() => void remove(post)} aria-label={`Delete ${post.title}`} className="admin-muted-button p-2 text-red-700"><FiTrash2 /></button></div></td></tr>)}</tbody></table>{!filteredBlogs.length && <p className="py-10 text-center text-sm text-muted">No blogs match these filters.</p>}</div></section>}
    {tab === 'categories' && <CategoryManager categories={categories} onChanged={refresh} onError={setError} />}
    {tab === 'tags' && <TagManager tags={tags} onChanged={refresh} onError={setError} />}
    {tab === 'authors' && <AuthorManager authors={authors} onChanged={refresh} onError={setError} />}
  </div></main>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="admin-panel p-5"><p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p><strong className="mt-3 block text-3xl font-display">{value}</strong></div>; }
function RecentPosts({ title, posts, onEdit }: { title: string; posts: BlogPost[]; onEdit: (post: BlogPost) => void }) { return <section className="admin-panel p-6"><h2 className="text-2xl font-display">{title}</h2><div className="mt-4 divide-y divide-stroke">{posts.length ? posts.map((post) => <button key={post.id} onClick={() => onEdit(post)} className="flex w-full items-center justify-between gap-4 py-3 text-left"><span className="min-w-0"><span className="block truncate text-sm">{post.title}</span><span className="mt-1 block text-xs text-muted">{post.status} · {isoDate(post.published_at || post.updated_at)}</span></span><FiEdit2 className="shrink-0 text-muted" /></button>) : <p className="py-5 text-sm text-muted">No articles yet.</p>}</div></section>; }

function CategoryManager({ categories, onChanged, onError }: { categories: BlogCategory[]; onChanged: () => Promise<void>; onError: (value: string) => void }) {
  const empty = { name: '', slug: '', description: '', seo_title: '', meta_description: '' };
  const [form, setForm] = useState<Partial<BlogCategory>>(empty);
  const [message, setMessage] = useState('');
  const edit = (category: BlogCategory) => setForm(category);
  const save = async () => { const slug = (form.slug || form.name || '').toLowerCase().trim(); if (categories.some((category) => category.id !== form.id && (category.slug === slug || category.name.trim().toLowerCase() === (form.name || '').trim().toLowerCase()))) { onError('A category with that name or slug already exists.'); return; } try { await updateCategory({ ...form, name: form.name || '', slug: form.slug || form.name || '' }); setForm(empty); setMessage('Category saved.'); await onChanged(); } catch (error) { onError(error instanceof Error ? error.message : 'Could not save category.'); } };
  const remove = async (category: BlogCategory) => { if (!window.confirm(`Delete category ${category.name}? Articles will remain uncategorized.`)) return; try { await deleteCategory(category.id); await onChanged(); } catch (error) { onError(error instanceof Error ? error.message : 'Could not delete category.'); } };
  return <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]"><div className="admin-panel overflow-x-auto p-5"><h2 className="mb-4 text-2xl font-display">Categories</h2><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-stroke text-xs uppercase text-muted"><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">SEO title</th><th className="p-3">Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-b border-stroke"><td className="p-3">{category.name}</td><td className="p-3 text-muted">{category.slug}</td><td className="p-3 text-muted">{category.seo_title || '—'}</td><td className="p-3"><button onClick={() => edit(category)} className="admin-muted-button px-3 py-2 text-xs">Edit</button> <button onClick={() => void remove(category)} className="admin-muted-button px-3 py-2 text-xs text-red-700">Delete</button></td></tr>)}</tbody></table></div><section className="admin-panel p-5"><h2 className="text-2xl font-display">{form.id ? 'Edit Category' : 'New Category'}</h2><label className="mt-5 block"><span className={labelClass}>Name</span><input value={form.name || ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: current.id ? current.slug : event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') }))} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Slug</span><input value={form.slug || ''} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') }))} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Description</span><textarea rows={3} value={form.description || ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>SEO Title</span><input value={form.seo_title || ''} onChange={(event) => setForm((current) => ({ ...current, seo_title: event.target.value }))} className={fieldClass} /></label><label className="mt-4 block"><span className={labelClass}>Meta Description</span><textarea rows={3} value={form.meta_description || ''} onChange={(event) => setForm((current) => ({ ...current, meta_description: event.target.value }))} className={fieldClass} /></label><div className="mt-5 flex gap-2"><button onClick={() => void save()} className="admin-accent px-5 py-3 text-sm">Save Category</button><button onClick={() => setForm(empty)} className="admin-muted-button px-5 py-3 text-sm">New</button></div>{message && <p role="status" className="mt-3 text-xs text-muted">{message}</p>}</section></section>;
}

function TagManager({ tags, onChanged, onError }: { tags: BlogTag[]; onChanged: () => Promise<void>; onError: (value: string) => void }) {
  const [name, setName] = useState(''); const [query, setQuery] = useState('');
  const [editingName, setEditingName] = useState<string>();
  const save = async (event: FormEvent) => { event.preventDefault(); try { await saveTag(name, editingName); setName(''); setEditingName(undefined); await onChanged(); } catch (error) { onError(error instanceof Error ? error.message : 'Could not save tag.'); } };
  const remove = async (tag: BlogTag) => { if (!window.confirm(`Delete tag ${tag.name}? Existing blog assignments will be removed.`)) return; try { await deleteTag(tag.id); await onChanged(); } catch (error) { onError(error instanceof Error ? error.message : 'Could not delete tag.'); } };
  const filtered = tags.filter((tag) => `${tag.name} ${tag.slug}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="admin-panel mt-6 p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-display">Tags</h2><p className="mt-1 text-sm text-muted">Use an existing tag when it describes the same topic.</p></div><form onSubmit={(event) => void save(event)} className="flex gap-2"><input value={name} onChange={(event) => setName(event.target.value)} placeholder={editingName ? 'Rename tag' : 'New tag'} className="admin-input px-3 py-2 text-sm" required /><button className="admin-accent px-4 py-2 text-sm">{editingName ? 'Save' : 'Add'}</button>{editingName && <button type="button" onClick={() => { setEditingName(undefined); setName(''); }} className="admin-muted-button px-3 py-2 text-sm">Cancel</button>}</form></div><label className="relative mt-5 block max-w-md"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tags" className={`${fieldClass} pl-10`} /></label><div className="mt-5 divide-y divide-stroke">{filtered.map((tag) => <div key={tag.id} className="flex items-center justify-between py-3"><span><strong className="text-sm font-normal">{tag.name}</strong><span className="ml-3 text-xs text-muted">{tag.slug}</span></span><div className="flex gap-2"><button onClick={() => { setEditingName(tag.name); setName(tag.name); }} className="admin-muted-button px-3 py-2 text-xs">Edit</button><button onClick={() => void remove(tag)} className="admin-muted-button px-3 py-2 text-xs text-red-700">Delete</button></div></div>)}</div></section>;
}

function AuthorManager({ authors, onChanged, onError }: { authors: BlogAuthor[]; onChanged: () => Promise<void>; onError: (value: string) => void }) {
  const empty = { name: '', slug: '', profile_image: '', bio: '', profile_url: '', social_links: [] as { label: string; url: string }[] };
  const [form, setForm] = useState<Partial<BlogAuthor>>(empty);
  const [message, setMessage] = useState('');
  const [socialLabel, setSocialLabel] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const save = async () => {
    if (form.profile_url && !form.profile_url.startsWith('/') && !/^https:\/\//i.test(form.profile_url)) { onError('Author URLs must be local paths or secure HTTPS links.'); return; }
    try { await updateAuthor({ ...form, name: form.name || '', slug: form.slug || form.name || '' }); setMessage('Author saved.'); setForm(empty); setSocialLabel(''); setSocialUrl(''); await onChanged(); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not save author.'); }
  };
  const addSocial = () => {
    if (!socialLabel.trim() || !/^https:\/\//i.test(socialUrl.trim())) { onError('Add a social profile label and a secure HTTPS URL.'); return; }
    setForm((current) => ({ ...current, social_links: [...(current.social_links || []), { label: socialLabel.trim(), url: socialUrl.trim() }] }));
    setSocialLabel(''); setSocialUrl('');
  };
  const remove = async (author: BlogAuthor) => { if (!window.confirm(`Delete author ${author.name}? Existing articles will retain their content without an author link.`)) return; try { await deleteAuthor(author.id); await onChanged(); } catch (error) { onError(error instanceof Error ? error.message : 'Could not delete author.'); } };
  return <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
    <div className="admin-panel p-5"><h2 className="mb-4 text-2xl font-display">Authors</h2><div className="divide-y divide-stroke">{authors.map((author) => <div key={author.id} className="flex items-center justify-between gap-4 py-3"><div className="flex items-center gap-3">{author.profile_image && <img src={author.profile_image} alt="" width="44" height="44" className="h-11 w-11 rounded-full object-cover" />}<span><strong className="block text-sm font-medium">{author.name}</strong><span className="text-xs text-muted">/author/{author.slug}</span></span></div><div className="flex gap-2"><button onClick={() => setForm(author)} className="admin-muted-button px-3 py-2 text-xs">Edit</button><button onClick={() => void remove(author)} className="admin-muted-button px-3 py-2 text-xs text-red-700">Delete</button></div></div>)}</div></div>
    <section className="admin-panel p-5"><h2 className="text-2xl font-display">{form.id ? 'Edit Author' : 'New Author'}</h2>
      <label className="mt-5 block"><span className={labelClass}>Name</span><input value={form.name || ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: current.id ? current.slug : event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') }))} className={fieldClass} /></label>
      <label className="mt-4 block"><span className={labelClass}>Author Slug</span><input value={form.slug || ''} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') }))} className={fieldClass} /></label>
      <label className="mt-4 block"><span className={labelClass}>Upload Profile Image</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={async (event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (!file) return; try { const image = await uploadBlogImage(file, form.slug || form.name || 'author'); setForm((current) => ({ ...current, profile_image: image.src })); } catch (error) { onError(error instanceof Error ? error.message : 'Profile image upload failed.'); } }} className={`${fieldClass} file:mr-3 file:border-0 file:bg-surface file:px-3 file:py-2`} /></label>
      <label className="mt-4 block"><span className={labelClass}>Profile Image URL</span><input value={form.profile_image || ''} onChange={(event) => setForm((current) => ({ ...current, profile_image: event.target.value }))} className={fieldClass} /></label>
      <label className="mt-4 block"><span className={labelClass}>Bio</span><textarea rows={4} value={form.bio || ''} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} className={fieldClass} /></label>
      <label className="mt-4 block"><span className={labelClass}>Website / Profile URL</span><input value={form.profile_url || ''} onChange={(event) => setForm((current) => ({ ...current, profile_url: event.target.value }))} className={fieldClass} /></label>
      <div className="mt-5 border-t border-stroke pt-4"><p className={labelClass}>Social Profiles</p><div className="grid gap-2 sm:grid-cols-2"><input value={socialLabel} onChange={(event) => setSocialLabel(event.target.value)} placeholder="Platform" className={fieldClass} /><input type="url" value={socialUrl} onChange={(event) => setSocialUrl(event.target.value)} placeholder="https://…" className={fieldClass} /></div><button type="button" onClick={addSocial} className="admin-muted-button mt-2 px-3 py-2 text-xs">+ Add Profile</button><div className="mt-2 space-y-2">{(form.social_links || []).map((item, index) => <div key={`${item.label}-${item.url}`} className="flex items-center justify-between border-b border-stroke py-2 text-xs"><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted underline">{item.label} · {item.url}</a><button type="button" onClick={() => setForm((current) => ({ ...current, social_links: (current.social_links || []).filter((_, itemIndex) => itemIndex !== index) }))} className="text-red-700">Remove</button></div>)}</div></div>
      <div className="mt-5 flex gap-2"><button onClick={() => void save()} className="admin-accent px-5 py-3 text-sm">Save Author</button><button onClick={() => { setForm(empty); setSocialLabel(''); setSocialUrl(''); }} className="admin-muted-button px-5 py-3 text-sm">New</button></div>{message && <p role="status" className="mt-3 text-xs text-muted">{message}</p>}
    </section>
  </section>;
}

function AdminMessage({ title, message }: { title: string; message: string }) { return <main className="admin-shell flex min-h-screen items-center justify-center p-6"><section className="admin-panel max-w-xl p-8"><h1 className="text-4xl font-display">{title}</h1><p className="mt-4 text-sm leading-relaxed text-muted">{message}</p></section></main>; }
