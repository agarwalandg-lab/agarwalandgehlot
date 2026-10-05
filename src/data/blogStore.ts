import DOMPurify from 'dompurify';
import { supabase } from '../lib/supabase';

export type BlogStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type BlogCategory = { id: string; name: string; slug: string; description: string; seo_title: string; meta_description: string };
export type BlogAuthor = { id: string; name: string; slug: string; profile_image: string; bio: string; profile_url: string; social_links: { label: string; url: string }[] };
export type BlogFaq = { id?: string; question: string; answer: string; sort_order: number };
export type BlogLink = { id?: string; anchor_text: string; url: string; link_type: 'internal' | 'external'; open_in_new_tab: boolean; nofollow: boolean; sponsored: boolean; sort_order: number };
export type BlogTag = { id: string; name: string; slug: string };
export type BlogSeo = {
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
  secondary_keywords: string[];
  canonical_url: string;
  robots: 'index,follow' | 'index,nofollow' | 'noindex,follow' | 'noindex,nofollow';
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: 'summary' | 'summary_large_image';
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
};
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_srcset: string;
  featured_image_alt: string;
  featured_image_title: string;
  featured_image_caption: string;
  featured_image_credit: string;
  category_id: string | null;
  author_id: string | null;
  status: BlogStatus;
  is_featured: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  category?: BlogCategory | null;
  author?: BlogAuthor | null;
  seo?: BlogSeo | null;
  faqs?: BlogFaq[];
  links?: BlogLink[];
  tagRelations?: { tag: BlogTag }[];
};

export type BlogDraft = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  faqs: BlogFaq[];
  links: BlogLink[];
  tags: string[];
  seo: BlogSeo;
};

export const emptyBlogSeo = (): BlogSeo => ({
  seo_title: '', meta_description: '', focus_keyword: '', secondary_keywords: [],
  canonical_url: '', robots: 'index,follow', og_title: '', og_description: '', og_image: '',
  twitter_card: 'summary_large_image', twitter_title: '', twitter_description: '', twitter_image: '',
});

export const makeEmptyBlog = (): BlogDraft => ({
  title: '', slug: '', excerpt: '', content: '', featured_image: '', featured_image_alt: '',
  featured_image_srcset: '', featured_image_title: '', featured_image_caption: '', featured_image_credit: '', category_id: null,
  author_id: null, status: 'draft', is_featured: false, published_at: null, scheduled_at: null,
  faqs: [], links: [], tags: [], seo: emptyBlogSeo(),
});

export function slugify(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
}

const blogSelection = '*, category:blog_categories(id,name,slug,description,seo_title,meta_description), author:authors(id,name,slug,profile_image,bio,profile_url,social_links), seo:blog_seo(*), faqs:blog_faqs(*), links:blog_links(*), tagRelations:blog_tag_relations(tag:blog_tags(id,name,slug))';

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

export async function loadPublishedBlogs() {
  const client = requireSupabase();
  const now = new Date().toISOString();
  const { data, error } = await client.from('blogs').select(blogSelection)
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`)
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data || []) as unknown as BlogPost[];
}

export async function loadPublishedBlog(slug: string) {
  const client = requireSupabase();
  const now = new Date().toISOString();
  const { data, error } = await client.from('blogs').select(blogSelection).eq('slug', slug)
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`).maybeSingle();
  if (error) throw error;
  return data as unknown as BlogPost | null;
}

export async function loadAuthor(slug: string) {
  const client = requireSupabase();
  const { data, error } = await client.from('authors').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as BlogAuthor | null;
}

export async function loadBlogCategories() {
  const { data, error } = await requireSupabase().from('blog_categories').select('*').order('name');
  if (error) throw error;
  return (data || []) as BlogCategory[];
}

export async function loadAuthorBlogs(authorId: string) {
  const client = requireSupabase();
  const now = new Date().toISOString();
  const { data, error } = await client.from('blogs').select(blogSelection).eq('author_id', authorId)
    .or(`and(status.eq.published,published_at.lte.${now}),and(status.eq.scheduled,scheduled_at.lte.${now})`)
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data || []) as unknown as BlogPost[];
}

export async function loadAdminBlogData() {
  const client = requireSupabase();
  let [blogs, categories, authors, tags] = await Promise.all([
    client.from('blogs').select(blogSelection).order('updated_at', { ascending: false }),
    client.from('blog_categories').select('*').order('name'),
    client.from('authors').select('*').order('name'),
    client.from('blog_tags').select('*').order('name'),
  ]);
  const failure = [blogs, categories, authors, tags].find((result) => result.error);
  if (failure?.error) throw failure.error;

  // Auto-seed default category if none exists
  let categoryList = (categories.data || []) as BlogCategory[];
  if (categoryList.length === 0) {
    const { data: seededCat } = await client.from('blog_categories').insert({
      name: 'Market Insights',
      slug: 'market-insights',
      description: 'Property market updates and insights in Noida and Delhi NCR',
      seo_title: 'Noida Real Estate Market Insights | A&G Realtors',
      meta_description: 'Read the latest real estate market updates and buying guides in Noida from A&G Realtors.',
    }).select('*');
    if (seededCat?.length) categoryList = seededCat as BlogCategory[];
  }

  // Auto-seed default author if none exists
  let authorList = (authors.data || []) as BlogAuthor[];
  if (authorList.length === 0) {
    const { data: seededAuthor } = await client.from('authors').insert({
      name: 'A&G Editorial Team',
      slug: 'ag-editorial-team',
      bio: 'The editorial and research team at A&G Realtors providing property insights in Noida & Delhi NCR.',
      profile_image: '/logos/ag-logo.png',
      profile_url: 'https://agarwalandgehlotrealtors.com/about',
      social_links: [],
    }).select('*');
    if (seededAuthor?.length) authorList = seededAuthor as BlogAuthor[];
  }

  return {
    blogs: (blogs.data || []) as unknown as BlogPost[],
    categories: categoryList,
    authors: authorList,
    tags: (tags.data || []) as BlogTag[],
  };
}

export async function saveBlog(input: BlogDraft) {
  const client = requireSupabase();
  let title = (input.title || '').trim();
  if (!title) title = 'Untitled Article';

  let slug = slugify(input.slug || title);
  if (!slug) slug = `article-${Date.now()}`;

  let categoryId = input.category_id;
  if (!categoryId) {
    const { data: catData } = await client.from('blog_categories').select('id').limit(1).maybeSingle();
    if (catData?.id) {
      categoryId = catData.id;
    } else {
      const { data: newCat } = await client.from('blog_categories').insert({
        name: 'Market Insights',
        slug: 'market-insights',
        description: 'Property market updates and insights in Noida and Delhi NCR',
        seo_title: 'Noida Real Estate Market Insights | A&G Realtors',
        meta_description: 'Read the latest real estate market updates and buying guides in Noida from A&G Realtors.',
      }).select('id').single();
      if (newCat) categoryId = newCat.id;
    }
  }

  let authorId = input.author_id;
  if (!authorId) {
    const { data: authorData } = await client.from('authors').select('id').limit(1).maybeSingle();
    if (authorData?.id) {
      authorId = authorData.id;
    } else {
      const { data: newAuthor } = await client.from('authors').insert({
        name: 'A&G Editorial Team',
        slug: 'ag-editorial-team',
        bio: 'The editorial and research team at A&G Realtors providing property insights in Noida & Delhi NCR.',
        profile_image: '/logos/ag-logo.png',
        profile_url: 'https://agarwalandgehlotrealtors.com/about',
        social_links: [],
      }).select('id').single();
      if (newAuthor) authorId = newAuthor.id;
    }
  }

  const plainContent = input.content ? input.content.replace(/<[^>]*>/g, ' ').trim() : '';
  const excerpt = (input.excerpt || '').trim() || plainContent.slice(0, 180) || title;
  const featuredImage = input.featured_image || '/cover/ivory-county.webp';
  const featuredAlt = (input.featured_image_alt || '').trim() || `${title} - A&G Realtors`;

  if (input.status === 'scheduled' && !input.scheduled_at) {
    throw new Error('Choose a publishing date and time for scheduled articles.');
  }

  const { data: saved, error } = await client.from('blogs').upsert({
    ...(input.id ? { id: input.id } : {}),
    title,
    slug,
    excerpt,
    content: DOMPurify.sanitize(input.content || '', { ADD_ATTR: ['srcset', 'sizes'] }),
    featured_image: featuredImage,
    featured_image_srcset: input.featured_image_srcset || '',
    featured_image_alt: featuredAlt,
    featured_image_title: (input.featured_image_title || '').trim(),
    featured_image_caption: (input.featured_image_caption || '').trim(),
    featured_image_credit: (input.featured_image_credit || '').trim(),
    category_id: categoryId,
    author_id: authorId,
    status: input.status,
    is_featured: input.is_featured,
    published_at: input.status === 'published' ? input.published_at || new Date().toISOString() : input.published_at,
    scheduled_at: input.status === 'scheduled' ? input.scheduled_at : null,
  }).select('id').single();
  if (error) throw error;

  const blogId = saved.id as string;
  const seo = input.seo || emptyBlogSeo();
  const { error: seoError } = await client.from('blog_seo').upsert({ ...seo, blog_id: blogId });
  if (seoError) throw seoError;

  const childWrites = await Promise.all([
    client.from('blog_faqs').delete().eq('blog_id', blogId),
    client.from('blog_links').delete().eq('blog_id', blogId),
    client.from('blog_tag_relations').delete().eq('blog_id', blogId),
  ]);
  const childFailure = childWrites.find((result) => result.error);
  if (childFailure?.error) throw childFailure.error;

  if (input.faqs.length) {
    const { error: faqError } = await client.from('blog_faqs').insert(input.faqs.map((faq, sort_order) => ({ blog_id: blogId, question: faq.question.trim(), answer: faq.answer.trim(), sort_order })));
    if (faqError) throw faqError;
  }
  if (input.links.length) {
    const { error: linkError } = await client.from('blog_links').insert(input.links.map((link, sort_order) => ({ ...link, blog_id: blogId, anchor_text: link.anchor_text.trim(), url: link.url.trim(), sort_order })));
    if (linkError) throw linkError;
  }
  if (input.tags.length) {
    const tagRows = input.tags.map((name) => ({ name: name.trim(), slug: slugify(name) })).filter((tag) => tag.name && tag.slug);
    if (tagRows.length) {
      const { data: tagData, error: tagError } = await client.from('blog_tags').upsert(tagRows, { onConflict: 'slug' }).select('id');
      if (tagError) throw tagError;
      const { error: relationError } = await client.from('blog_tag_relations').insert((tagData || []).map((tag) => ({ blog_id: blogId, tag_id: tag.id })));
      if (relationError) throw relationError;
    }
  }
  return blogId;
}

export async function deleteBlog(id: string) {
  const { error } = await requireSupabase().from('blogs').delete().eq('id', id);
  if (error) throw error;
}

export async function changeBlogStatus(blog: BlogPost, status: BlogStatus) {
  const { error } = await requireSupabase().from('blogs').update({
    status,
    published_at: status === 'published' ? blog.published_at || new Date().toISOString() : blog.published_at,
    scheduled_at: status === 'scheduled' ? blog.scheduled_at : null,
  }).eq('id', blog.id);
  if (error) throw error;
}

export async function updateCategory(category: Partial<BlogCategory> & Pick<BlogCategory, 'name' | 'slug'>) {
  const { error } = await requireSupabase().from('blog_categories').upsert({
    ...category,
    slug: slugify(category.slug || category.name),
    description: category.description || '',
    seo_title: category.seo_title || '',
    meta_description: category.meta_description || '',
  });
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await requireSupabase().from('blog_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAuthor(author: Partial<BlogAuthor> & Pick<BlogAuthor, 'name' | 'slug'>) {
  const { error } = await requireSupabase().from('authors').upsert({
    ...author,
    slug: slugify(author.slug || author.name),
    profile_image: author.profile_image || '',
    bio: author.bio || '',
    profile_url: author.profile_url || '',
    social_links: author.social_links || [],
  });
  if (error) throw error;
}

export async function deleteAuthor(id: string) {
  const { error } = await requireSupabase().from('authors').delete().eq('id', id);
  if (error) throw error;
}

export async function saveTag(name: string, currentName?: string) {
  const client = requireSupabase();
  const tagName = name.trim();
  const slug = slugify(tagName);
  if (!tagName || !slug) throw new Error('Enter a valid tag name.');
  if (currentName && currentName !== tagName) {
    const { error: renameError } = await client.from('blog_tags').update({ name: tagName, slug }).eq('name', currentName);
    if (renameError) throw renameError;
    return;
  }
  const { error } = await client.from('blog_tags').upsert({ name: tagName, slug }, { onConflict: 'slug' });
  if (error) throw error;
}

export async function deleteTag(id: string) {
  const { error } = await requireSupabase().from('blog_tags').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadBlogImage(file: File, slug: string) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) throw new Error('Choose a JPEG, PNG, WebP or AVIF image.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Images must be 20 MB or smaller.');

  const bitmap = await createImageBitmap(file);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const widths = [...new Set([480, 960, 1600].filter((width) => width < originalWidth).concat(Math.min(1800, originalWidth)))].sort((a, b) => a - b);
  const basePath = `${slugify(slug || 'article')}/${crypto.randomUUID()}`;
  const client = requireSupabase();
  const variants: { width: number; url: string }[] = [];

  for (const width of widths) {
    const height = Math.max(1, Math.round(originalHeight * width / originalWidth));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      bitmap.close();
      throw new Error('Image optimization is not available in this browser.');
    }
    context.drawImage(bitmap, 0, 0, width, height);
    const optimized = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not optimize this image.')), 'image/webp', 0.82));
    const path = `${basePath}-${width}.webp`;
    const { data, error } = await client.storage.from('blog-media').upload(path, optimized, { contentType: 'image/webp', upsert: false, cacheControl: '31536000' });
    if (error) {
      bitmap.close();
      throw error;
    }
    variants.push({ width, url: client.storage.from('blog-media').getPublicUrl(data.path).data.publicUrl });
  }
  bitmap.close();
  const largest = variants[variants.length - 1];
  return {
    src: largest.url,
    srcset: variants.map((variant) => `${variant.url} ${variant.width}w`).join(', '),
    width: largest.width,
    height: Math.max(1, Math.round(originalHeight * largest.width / originalWidth)),
  };
}

export function estimateReadingMinutes(content: string) {
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function makeTocAndSafeHtml(rawHtml: string) {
  const fragment = DOMPurify.sanitize(rawHtml, { RETURN_DOM_FRAGMENT: true, ADD_TAGS: ['iframe'], ADD_ATTR: ['srcset', 'sizes', 'allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy', 'title'] });
  const container = document.createElement('div');
  container.append(fragment);
  container.querySelectorAll('iframe').forEach((frame) => {
    const src = frame.getAttribute('src') || '';
    try {
      const url = new URL(src);
      if (url.protocol !== 'https:' || url.hostname !== 'www.youtube-nocookie.com' || !url.pathname.startsWith('/embed/')) { frame.remove(); return; }
      frame.setAttribute('loading', 'lazy');
      frame.setAttribute('title', frame.getAttribute('title') || 'Embedded YouTube video');
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      frame.setAttribute('allowfullscreen', '');
    } catch { frame.remove(); }
  });
  const headings = Array.from(container.querySelectorAll('h2, h3')).map((heading, index) => {
    const text = heading.textContent?.trim() || `Section ${index + 1}`;
    let id = slugify(text) || `section-${index + 1}`;
    if (container.querySelectorAll(`[id="${id}"]`).length > 0) id += `-${index + 1}`;
    heading.id = id;
    return { id, text, level: heading.tagName.toLowerCase() };
  });
  container.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href') || '';
    if (/^https?:/i.test(href)) {
      anchor.setAttribute('rel', 'noopener noreferrer');
      if (!anchor.hasAttribute('target')) anchor.setAttribute('target', '_blank');
    }
  });
  return { html: DOMPurify.sanitize(container.innerHTML, { ADD_ATTR: ['srcset', 'sizes'] }), headings };
}
