import DOMPurify from 'dompurify';
import { supabase } from '../lib/supabase';

export type CommunityBlog = {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  content: string;
  category?: string;
  created_at: string;
  status: 'published' | 'pending';
};

const LOCAL_STORAGE_KEY = 'ag_community_blogs_fallback';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Default initial community blogs for instant rich content
const defaultCommunityBlogs: CommunityBlog[] = [
  {
    id: 'comm-1',
    title: 'My Experience Buying a 3 BHK Apartment in Sector 150 Noida',
    slug: 'my-experience-buying-3-bhk-sector-150-noida',
    author_name: 'Vikram Malhotra',
    category: 'Buyer Story',
    content: `<h2>Finding the Right Home in Noida</h2>
<p>After evaluating several sectors across Greater Noida and Noida, my family decided to explore Sector 150. What attracted us immediately was the high ratio of green open spaces and low-density planning compared to other central sectors.</p>
<h2>Key Takeaways for Buyers</h2>
<p>1. Always check RERA registration details directly on the UP RERA portal before signing any document.</p>
<p>2. Verify builder timeline track record across previous developments.</p>
<p>3. Pay attention to maintenance terms and visitor parking provisions in the agreement.</p>`,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'published',
  },
  {
    id: 'comm-2',
    title: 'Why Greater Noida West Commercial Spaces Are Gaining Momentum',
    slug: 'why-greater-noida-west-commercial-spaces-gaining-momentum',
    author_name: 'Priya Sharma',
    category: 'Market Insight',
    content: `<h2>Emerging Commercial Hubs</h2>
<p>Greater Noida West has witnessed rapid residential occupancy over the last three years. With thousands of families moving in, local retail and office spaces are seeing increased footfall.</p>
<h2>Investment Considerations</h2>
<p>If you are looking at retail shop investment, focus on ground floor lockable units with high frontage and direct road connectivity.</p>`,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: 'published',
  },
];

function getLocalBlogs(): CommunityBlog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return defaultCommunityBlogs;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultCommunityBlogs;
  } catch {
    return defaultCommunityBlogs;
  }
}

function saveLocalBlogs(blogs: CommunityBlog[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchCommunityBlogs(): Promise<CommunityBlog[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('community_blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as CommunityBlog[];
      }
    }
  } catch (err) {
    console.warn('Could not load community blogs from Supabase, using local fallback:', err);
  }

  return getLocalBlogs();
}

export async function fetchCommunityBlogBySlug(slug: string): Promise<CommunityBlog | null> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('community_blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data as CommunityBlog;
      }
    }
  } catch {
    // Fallback to local
  }

  const local = getLocalBlogs();
  return local.find((item) => item.slug === slug) || null;
}

export async function submitCommunityBlog(input: {
  title: string;
  author_name: string;
  content: string;
  category?: string;
}): Promise<CommunityBlog> {
  const title = input.title.trim();
  const author_name = input.author_name.trim();
  const rawContent = input.content.trim();
  const category = (input.category || 'General Real Estate').trim();

  if (!title || title.length < 3) {
    throw new Error('Please enter a valid title (at least 3 characters).');
  }
  if (!author_name || author_name.length < 2) {
    throw new Error('Please enter your author name.');
  }
  if (!rawContent || rawContent.length < 10) {
    throw new Error('Please write your blog body content.');
  }

  // Format simple linebreaks to HTML paragraphs if raw text
  let formattedContent = rawContent;
  if (!/<[a-z][\s\S]*>/i.test(rawContent)) {
    formattedContent = rawContent
      .split(/\n\n+/)
      .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  const sanitizedContent = DOMPurify.sanitize(formattedContent);
  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newBlog: CommunityBlog = {
    id: `comm-${Date.now()}`,
    title,
    slug,
    author_name,
    content: sanitizedContent,
    category,
    created_at: now,
    status: 'published',
  };

  // Attempt Supabase insert
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('community_blogs')
        .insert({
          title,
          slug,
          author_name,
          content: sanitizedContent,
          category,
          status: 'published',
        })
        .select('*')
        .single();

      if (!error && data) {
        newBlog.id = data.id;
      }
    } catch (err) {
      console.warn('Supabase community insert failed, persisting to local fallback:', err);
    }
  }

  // Always sync to local state fallback
  const currentLocal = getLocalBlogs();
  const updatedLocal = [newBlog, ...currentLocal.filter((b) => b.id !== newBlog.id)];
  saveLocalBlogs(updatedLocal);

  return newBlog;
}
