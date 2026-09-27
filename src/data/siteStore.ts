import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadProjectMedia } from './projectStore';

export type AboutContent = {
  heroTitle: string;
  heroVideo: string;
  heroImage: string;
  introTitle: string;
  introParagraphs: string[];
  directorImage: string;
  directorEyebrow: string;
  directorTitle: string;
  directorName: string;
  directorRole: string;
  directorParagraphs: string[];
  quote: string;
  quoteAuthor: string;
  values: { title: string; desc: string }[];
};

export const defaultAbout: AboutContent = {
  heroTitle: 'About A&G',
  heroVideo: '',
  heroImage: '',
  introTitle: 'Real Estate Guidance, Built Around You.',
  introParagraphs: [
    'At Agarwal & Gehlot Realtors, we believe the right property decision begins with understanding the client, not the inventory.',
    'A&G helps homebuyers and investors explore premium real estate opportunities across Noida and Delhi NCR through a more transparent, informed and personalized approach.',
    'From understanding your requirements and shortlisting suitable properties to project comparisons, site visits, negotiations and documentation assistance, our team supports you throughout the property-buying journey.',
    'Our objective is simple: to help you evaluate every opportunity with greater clarity and choose a property that genuinely aligns with your lifestyle, budget and investment goals.',
  ],
  directorImage: '',
  directorEyebrow: 'Meet Arpit Gehlot',
  directorTitle: 'The Perspective Behind A&G.',
  directorName: 'Arpit Gehlot',
  directorRole: 'Director, Agarwal & Gehlot Realtors',
  directorParagraphs: [
    'Arpit Gehlot leads A&G with a client-first approach to real estate advisory.',
    "His philosophy is simple: understand the client's objective first, then find the property that fits it.",
    'By focusing on factors such as location, developer credibility, pricing, lifestyle requirements and long-term potential, Arpit works to help buyers and investors look beyond sales pitches and make more informed property decisions.',
    'For him, real estate is not simply about completing a transaction. It is about building long-term relationships based on trust, knowledge and responsible guidance.',
  ],
  quote: 'The right property is not simply the one you can buy. It is the one that makes sense for where you want to go.',
  quoteAuthor: 'Arpit Gehlot',
  values: [
    { title: 'Precision', desc: 'Every recommendation is anchored in data, intuition, and a deep understanding of market nuances.' },
    { title: 'Confidentiality', desc: 'High-value transactions deserve discretion, care, and complete privacy at every stage.' },
    { title: 'Commitment', desc: 'Forging lifelong relationships built on mutual success.' },
  ],
};

export async function loadAbout(): Promise<AboutContent> {
  if (!supabase) return defaultAbout;
  const { data, error } = await supabase.from('site_content').select('content').eq('key', 'about').maybeSingle();
  return error || !data?.content ? defaultAbout : { ...defaultAbout, ...(data.content as Partial<AboutContent>) };
}

export async function saveAbout(content: AboutContent) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const parseParagraphs = (value: unknown) => Array.isArray(value) ? value : typeof value === 'string' ? value.split('\n').map((item) => item.trim()).filter(Boolean) : [];
  let values = content.values;
  if (typeof values === 'string') {
    try { values = JSON.parse(values); } catch { values = []; }
  }
  const normalized = { ...content, introParagraphs: parseParagraphs(content.introParagraphs), directorParagraphs: parseParagraphs(content.directorParagraphs), values: Array.isArray(values) ? values : [] };
  const { error } = await supabase.from('site_content').upsert({ key: 'about', content: normalized, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export { uploadProjectMedia };

export function useAbout() {
  const [about, setAbout] = useState<AboutContent>(defaultAbout);
  useEffect(() => { let active = true; loadAbout().then((content) => { if (active) setAbout(content); }); return () => { active = false; }; }, []);
  return { about, setAbout };
}
