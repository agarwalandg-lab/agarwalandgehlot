import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type HomeContent = {
  heroVideo: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  advisoryEyebrow: string;
  advisoryTitle: string;
  advisoryDescription: string;
  advisoryCta: string;
  advisoryOptions: { label: string; value: string }[];
  introTitle: string;
  introParagraphs: string[];
  featuredEyebrow: string;
  featured: { slug: string; title: string; kicker: string; description: string; image: string; highlights: string[] }[];
  whyTitle: string;
  whyItems: { title: string; desc: string }[];
  categoriesTitle: string;
  categories: { title: string; desc: string; link: string }[];
  servicesTitle: string;
  servicesDescription: string;
  serviceItems: { title: string; desc: string }[];
  testimonialsTitle: string;
  testimonials: { quote: string; author: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
};

export const defaultHome: HomeContent = {
  heroVideo: '/main.mp4', heroEyebrow: 'A&G Real Estate', heroTitle: 'Elevating Your Address.\nDefining Your Legacy.', heroDescription: 'Explore residential and commercial property information across Delhi NCR. Compare locations, project details and buying considerations with A&G Realtors.', heroPrimaryCta: 'Explore Properties', heroSecondaryCta: 'Schedule a Consultation',
  advisoryEyebrow: 'A&G Smart Advisory', advisoryTitle: 'What are you looking for?', advisoryDescription: 'Choose an objective and location to search the current A&G property catalogue.', advisoryCta: 'Open Property Finder', advisoryOptions: [{ label: 'Buy', value: 'buy' }, { label: 'Rent', value: 'rent' }, { label: 'Sell', value: 'sell' }, { label: 'Talk to Agent', value: 'agent' }],
  introTitle: 'Property Guidance for Noida and Delhi NCR', introParagraphs: ['A&G Realtors helps buyers explore residential and commercial properties and understand the details that matter to their search.', 'Compare location, configuration, price, project status and documentation using current information. Buyers should independently verify property records and seek qualified legal and financial advice before making a commitment.'],
  featuredEyebrow: 'Featured Projects', featured: [{ slug: 'ivory-county-sector-115-noida', title: 'Ivory County', kicker: 'Sector 115, Noida • 3, 4 and 5 BHK', description: 'A residential development in Sector 115 with multiple apartment configurations, landscaped areas and two clubhouses. Confirm current unit details and availability directly.', image: '/cover/ivory-county.webp', highlights: ['Approx. 28-acre development', 'Two clubhouses', 'Project phases and inventory to be verified'] }, { slug: 'clove-county-sector-151-noida', title: 'Clove County', kicker: 'Sector 151, Noida • 4 and 5 BHK', description: 'A residential project in Sector 151 with large-format homes and landscaped spaces. Review the current project documents and unit information before making a decision.', image: '/cover/clove-county.webp', highlights: ['Approx. 5-acre development', 'Three towers listed', 'Current availability on request'] }],
  whyTitle: 'A Clearer Property Search', whyItems: [{ title: 'Local Context', desc: 'Compare locations, project details and current documents across Noida and Delhi NCR.' }, { title: 'Document Checks', desc: 'We help buyers identify records to review. Buyers should verify approvals, title and registration with official sources and qualified professionals.' }, { title: 'Buyer-Focused Guidance', desc: 'Discuss your budget, timeline and requirements before shortlisting relevant property options.' }, { title: 'Investment Questions', desc: 'Review costs, risks, rental assumptions and holding periods without promises of future returns.' }, { title: 'Process Support', desc: 'Get help coordinating project information, property visits and next steps during your search.' }],
  categoriesTitle: 'Explore Property Types', categories: [{ title: 'Residential', desc: 'Compare apartments and residential communities by location, configuration, project status and available documentation.', link: '/residential' }, { title: 'Commercial', desc: 'Review office, retail and commercial project details, including unit specifications and ownership or lease terms.', link: '/commercial' }, { title: 'Plots', desc: 'Check land use, title, approvals, access and development conditions before considering a plot purchase.', link: '/plots' }, { title: 'Luxury Properties', desc: 'Explore larger-format homes and premium apartment options in the A&G project catalog.', link: '/luxury-properties-noida' }],
  servicesTitle: 'Property Advisory Services', servicesDescription: 'Practical support for property searches, project comparisons, visits and document review coordination.', serviceItems: [{ title: 'Property Buying Assistance', desc: 'Shortlist options around your budget, location and requirements.' }, { title: 'Property Selling Assistance', desc: 'Discuss pricing evidence, presentation and the steps involved in a sale.' }, { title: 'Investment Consultancy', desc: 'Review purchase costs, rental assumptions, time horizon and investment risks.' }, { title: 'Documentation Support', desc: 'Coordinate information requests and help identify documents for independent professional review.' }, { title: 'Home Loan Assistance', desc: 'Understand the application steps and compare lender terms directly with the lender.' }],
  testimonialsTitle: 'Client Testimonials', testimonials: [],
  faqTitle: 'Frequently Asked Questions', faqs: [{ q: 'What areas does A&G Realtors cover?', a: 'A&G Realtors focuses on Noida and Delhi NCR. Availability varies by project and current inventory.' }, { q: 'How should I verify a property?', a: 'Check the project, promoter, approvals and title documents using official records and consult qualified legal professionals before committing.' }, { q: 'Can A&G help me compare home-loan offers?', a: 'A&G can help you understand the application process. Confirm eligibility, rates, fees and final terms directly with each lender.' }, { q: 'Can A&G estimate investment returns?', a: 'A&G can help identify costs and assumptions to review, but rental income and property appreciation are uncertain and are not guaranteed.' }],
  ctaTitle: 'Ready to Secure Your Next Prime Asset?', ctaDescription: 'Connect with our expert advisors today to explore exclusive opportunities in the residential and commercial sectors.', ctaLabel: 'Request a Consultation',
};

export async function loadHome(): Promise<HomeContent> {
  if (!supabase) return defaultHome;
  const { data, error } = await supabase.from('site_content').select('content').eq('key', 'home').maybeSingle();
  return error || !data?.content ? defaultHome : { ...defaultHome, ...(data.content as Partial<HomeContent>) };
}

export async function saveHome(content: HomeContent) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('site_content').upsert({ key: 'home', content, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function useHome() {
  const [home, setHome] = useState<HomeContent>(defaultHome);
  useEffect(() => { let active = true; loadHome().then((content) => { if (active) setHome(content); }); return () => { active = false; }; }, []);
  return { home, setHome };
}
