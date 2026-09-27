import { useEffect, useState } from 'react';
import { projects as fallbackProjects, Project } from './projects';
import { supabase } from '../lib/supabase';

export type ProjectMedia = { src: string; label: string; type?: 'image' | 'video' };

export type ManagedProject = Project & {
  gallery?: ProjectMedia[];
  video?: string;
};

const fallback = fallbackProjects as ManagedProject[];

function parseList(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function parseObjectList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function normalizeProject(project: ManagedProject): ManagedProject {
  const raw = project as ManagedProject & Record<string, unknown>;
  let seo: unknown = raw.seo;
  if (typeof seo === 'string') {
    try { seo = JSON.parse(seo) as Record<string, unknown>; } catch { seo = {} as ManagedProject['seo']; }
  }
  return {
    ...project,
    highlights: parseList(raw.highlights) as string[],
    facts: parseList(raw.facts) as string[],
    sizes: parseList(raw.sizes) as string[],
    considerations: parseList(raw.considerations) as string[],
    similar: parseList(raw.similar) as string[],
    amenities: parseObjectList<{ category: string; items: string[] }>(raw.amenities),
    faqs: parseObjectList<{ question: string; answer: string }>(raw.faqs),
    seo: { title: '', description: '', primaryKeyword: '', secondaryKeywords: [], ...(seo as object) },
  };
}

export async function loadProjects(): Promise<ManagedProject[]> {
  if (!supabase) return fallback;
  const { data, error } = await supabase.from('projects').select('slug, content').order('created_at');
  if (error) {
    console.error('Unable to load projects from Supabase.', error);
    return fallback;
  }
  if (!data) return fallback;
  return data.map((row: { content: ManagedProject }) => row.content);
}

export function useProjects() {
  const [catalog, setCatalog] = useState<ManagedProject[]>(fallback);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    let active = true;
    loadProjects().then((items) => {
      if (active) setCatalog(items);
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { projects: catalog, loading, setProjects: setCatalog };
}

export async function saveProject(project: ManagedProject) {
  if (!supabase) throw new Error('Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY variables.');
  const content = normalizeProject(project);
  const { data, error } = await supabase
    .from('projects')
    .upsert({ slug: content.slug, content, updated_at: new Date().toISOString() })
    .select('slug, content')
    .single();
  if (error) throw error;
  if (!data?.content) throw new Error('Supabase saved the project but returned no project content. Check the projects table policies.');
  return data.content as ManagedProject;
}

export async function deleteProject(slug: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('projects').delete().eq('slug', slug);
  if (error) throw error;
}

export async function deleteProjectMedia(url: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const marker = '/storage/v1/object/public/project-media/';
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return;
  const path = decodeURIComponent(url.slice(markerIndex + marker.length));
  const { error } = await supabase.storage.from('project-media').remove([path]);
  if (error) throw error;
}

export async function uploadProjectMedia(file: File) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const path = `${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from('project-media').upload(path, file, { upsert: false });
  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new Error('Storage bucket "project-media" is missing. Create it in Supabase Storage, then try again.');
    }
    throw error;
  }
  return supabase.storage.from('project-media').getPublicUrl(path).data.publicUrl;
}
