import { useEffect, useState, FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPlus, FiUser, FiCalendar, FiBookOpen, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';
import {
  CommunityBlog,
  fetchCommunityBlogs,
  fetchCommunityBlogBySlug,
  submitCommunityBlog,
} from '../data/communityBlogStore';

export default function CommunityBlogs() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState<CommunityBlog[]>([]);
  const [activeArticle, setActiveArticle] = useState<CommunityBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('Buyer Experience');
  const [content, setContent] = useState('');

  useEffect(() => {
    document.title = 'Community Real Estate Blogs | A&G Realtors';
    loadBlogs();
  }, []);

  useEffect(() => {
    if (slug) {
      fetchCommunityBlogBySlug(slug).then((res) => {
        if (res) setActiveArticle(res);
      });
    } else {
      setActiveArticle(null);
    }
  }, [slug]);

  async function loadBlogs() {
    setLoading(true);
    try {
      const data = await fetchCommunityBlogs();
      setBlogs(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitSuccess(false);

    if (!title.trim() || !authorName.trim() || !content.trim()) {
      setSubmitMessage('Please fill out Title, Author Name, and Article Body.');
      return;
    }

    setSubmitting(true);
    try {
      await submitCommunityBlog({
        title,
        author_name: authorName,
        category,
        content,
      });

      setSubmitSuccess(true);
      setSubmitMessage('✓ Your blog post has been published successfully!');
      setTitle('');
      setAuthorName('');
      setContent('');
      setShowForm(false);
      await loadBlogs();
    } catch (err) {
      setSubmitMessage(err instanceof Error ? err.message : 'Could not publish your blog. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string) {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(iso));
    } catch {
      return 'Recently';
    }
  }

  // Single Article View Route
  if (activeArticle) {
    return (
      <main className="min-h-screen w-full pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/community-blogs"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted hover:text-text-primary mb-8 transition-colors"
          >
            <FiArrowLeft /> Back to Community Blogs
          </Link>

          <div className="bg-surface border border-stroke rounded-3xl p-8 md:p-12">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-stroke/60 text-muted mb-4 uppercase tracking-[0.12em]">
              {activeArticle.category || 'Community Article'}
            </span>
            <h1 className="text-4xl md:text-6xl font-display text-text-primary mb-6 leading-tight">
              {activeArticle.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted border-y border-stroke py-4 mb-8">
              <span className="flex items-center gap-2">
                <FiUser className="text-text-primary" />
                Published by <strong className="text-text-primary font-medium">{activeArticle.author_name}</strong>
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar className="text-muted" />
                {formatDate(activeArticle.created_at)}
              </span>
            </div>

            <div
              className="prose prose-invert max-w-none text-muted leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: activeArticle.content }}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stroke pb-10 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-muted block mb-2">
              Public Real Estate Forum
            </span>
            <h1 className="text-4xl md:text-6xl font-display text-text-primary leading-tight">
              Community Blog &amp; Insights
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl mt-3">
              Read real estate experiences, buyer stories, and neighborhood insights published directly by buyers, investors, and local community members. No account required to post.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-text-primary px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-bg transition-transform hover:scale-105 shrink-0"
          >
            {showForm ? <FiX className="text-base" /> : <FiPlus className="text-base" />}
            {showForm ? 'Close Form' : 'Publish Your Blog'}
          </button>
        </div>

        {/* Status Messages */}
        {submitMessage && (
          <div
            role="status"
            className={`p-4 rounded-2xl mb-8 border text-sm flex items-center gap-3 ${
              submitSuccess
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400'
                : 'bg-amber-950/40 border-amber-600/40 text-amber-400'
            }`}
          >
            {submitSuccess ? <FiCheck className="text-lg" /> : <FiBookOpen className="text-lg" />}
            {submitMessage}
          </div>
        )}

        {/* Unauthenticated User Blog Upload Form */}
        {showForm && (
          <section className="bg-surface border border-stroke rounded-3xl p-8 md:p-10 mb-16 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6 border-b border-stroke pb-4">
              <div>
                <h2 className="text-2xl font-display text-text-primary">Publish Your Blog Post</h2>
                <p className="text-xs text-muted mt-1">No sign-in or registration required. Fill in the details below to share your story.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-muted hover:text-text-primary p-2"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="blogTitle" className="block text-xs uppercase tracking-[0.14em] text-muted mb-2">
                    Blog Title <span className="text-accent">*</span>
                  </label>
                  <input
                    id="blogTitle"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My Experience Buying Property in Noida Sector 150"
                    className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-text-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="authorName" className="block text-xs uppercase tracking-[0.14em] text-muted mb-2">
                    Your Name (Author) <span className="text-accent">*</span>
                  </label>
                  <input
                    id="authorName"
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-text-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-xs uppercase tracking-[0.14em] text-muted mb-2">
                  Topic / Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-text-primary transition-colors"
                >
                  <option value="Buyer Experience">Buyer Experience</option>
                  <option value="Market Insight">Market Insight</option>
                  <option value="Locality Review">Locality Review</option>
                  <option value="Investment Tip">Investment Tip</option>
                  <option value="General Real Estate">General Real Estate</option>
                </select>
              </div>

              <div>
                <label htmlFor="blogBody" className="block text-xs uppercase tracking-[0.14em] text-muted mb-2">
                  Heading &amp; Body Content <span className="text-accent">*</span>
                </label>
                <p className="text-[11px] text-muted mb-2">
                  You can use HTML tags like <code>&lt;h2&gt;Heading&lt;/h2&gt;</code> and <code>&lt;p&gt;Paragraph&lt;/p&gt;</code>, or simply write in plain text with line breaks.
                </p>
                <textarea
                  id="blogBody"
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here... &#10;&#10;Use line breaks to separate paragraphs, or add headings like: &#10;<h2>Why I Chose Noida Sector 150</h2> &#10;<p>The greenery and open space planning made a huge difference...</p>"
                  className="w-full bg-bg border border-stroke rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-text-primary transition-colors resize-y min-h-[180px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stroke">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-stroke px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-text-primary hover:bg-stroke/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-text-primary px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-bg transition-transform hover:scale-105 disabled:opacity-60"
                >
                  {submitting ? 'Publishing...' : 'Publish Blog Post'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Community Blogs List Grid */}
        {loading ? (
          <div role="status" className="py-20 text-center text-muted text-sm">
            Loading community blog posts...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-3xl border border-stroke bg-surface p-7 transition-all duration-300 hover:border-text-primary hover:shadow-xl hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 text-[11px] uppercase tracking-[0.12em] rounded-full bg-stroke/50 text-muted font-medium">
                      {item.category || 'Community Post'}
                    </span>
                    <span className="text-xs text-muted">{formatDate(item.created_at)}</span>
                  </div>

                  <h2 className="text-2xl font-display text-text-primary mb-3 leading-snug group-hover:underline transition-all">
                    <Link to={`/community-blogs/${item.slug}`}>{item.title}</Link>
                  </h2>

                  <div
                    className="text-xs text-muted leading-relaxed line-clamp-4 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: item.content.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ''),
                    }}
                  />
                </div>

                <div className="pt-4 border-t border-stroke flex items-center justify-between text-xs">
                  <span className="text-muted flex items-center gap-1.5">
                    <FiUser className="text-text-primary" />
                    By <strong className="text-text-primary font-medium">{item.author_name}</strong>
                  </span>

                  <Link
                    to={`/community-blogs/${item.slug}`}
                    className="text-text-primary font-medium hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Read Post &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
