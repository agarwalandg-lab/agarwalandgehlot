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
  heroVideo: '/video.mp4', heroEyebrow: 'A&G Real Estate', heroTitle: 'Elevating Your Address.\nDefining Your Legacy.', heroDescription: 'Discover premium residential and commercial spaces curated for the most discerning individuals across Delhi NCR. Step into a world of architectural brilliance, strategic locations, and unmatched investment potential.', heroPrimaryCta: 'Explore Premium Properties', heroSecondaryCta: 'Schedule a Private Viewing',
  advisoryEyebrow: 'A&G Smart Advisory', advisoryTitle: 'What are you looking for?', advisoryDescription: 'Choose an objective and location to search the current A&G property catalogue.', advisoryCta: 'Open Property Finder', advisoryOptions: [{ label: 'Buy', value: 'buy' }, { label: 'Rent', value: 'rent' }, { label: 'Sell', value: 'sell' }, { label: 'Talk to Agent', value: 'agent' }],
  introTitle: 'A Heritage of Trust in Modern Real Estate', introParagraphs: ['We are more than property advisors; we are curators of exceptional lifestyles and strategic commercial addresses. Our journey is defined by an unwavering commitment to bringing you properties that reflect your ambitions.', 'Navigating the dynamic landscape of Delhi NCR, Noida, and Gurgaon, we handpick spaces that offer enduring value, superior design, and absolute peace of mind. Your legacy deserves a foundation built on expertise and integrity.'],
  featuredEyebrow: 'Featured Projects', featured: [{ slug: 'ivory-county-sector-115-noida', title: 'Ivory County', kicker: 'Sector 115, Noida • Ultra-Luxury Apartments', description: 'A sanctuary of refined living. Ivory County offers uninterrupted vistas, bespoke interiors, and world-class amenities designed for the modern elite. Experience a lifestyle where luxury knows no bounds.', image: '/cover/ivory-county.png', highlights: ['Golf-course facing', 'Expansive balconies', 'Private elevator access'] }, { slug: 'clove-county-sector-151-noida', title: 'Clove County', kicker: 'Clove County, Noida • Premium Commercial Office Space', description: 'Redefine your corporate identity. Clove County sits at the pinnacle of commercial excellence, offering cutting-edge infrastructure to accelerate your business growth.', image: '/cover/clove-county.png', highlights: ['Platinum LEED certified', 'State-of-the-art security', 'High-street retail on ground floor'] }],
  whyTitle: 'Why Choose Us', whyItems: [{ title: 'Market Expertise', desc: 'Leverage our deep understanding of the Delhi NCR market to secure properties with maximum appreciation potential and prime connectivity.' }, { title: 'Verified Properties', desc: 'Every listing undergoes rigorous legal and structural due diligence to guarantee absolute safety and transparency for your investment.' }, { title: 'Customer Trust', desc: 'Our foundation is built on lasting relationships. We prioritize your unique needs, ensuring a seamless and strictly confidential transaction process.' }, { title: 'Investment Guidance', desc: 'Gain access to data-driven insights and exclusive off-market opportunities that align perfectly with your wealth-building strategies.' }, { title: 'End-to-End Assistance', desc: 'From the initial property viewing to the final registration, our dedicated advisory team remains by your side, managing every intricate detail.' }],
  categoriesTitle: 'Property Categories', categories: [{ title: 'Residential', desc: 'Discover a curated selection of premium apartments, penthouses, and independent villas crafted for unparalleled comfort and modern elegance.', link: '/residential' }, { title: 'Commercial', desc: 'Strategically located office spaces and retail shops designed to elevate your business presence and attract maximum footfall.', link: '/commercial' }, { title: 'Plots', desc: 'Secure your future with prime residential and commercial plots in rapidly developing corridors, offering total freedom to build your vision.', link: '/plots' }, { title: 'Luxury Properties', desc: 'An exclusive portfolio of ultra-luxury estates and bespoke residences reserved for individuals who demand the absolute best in life.', link: '/projects' }],
  servicesTitle: 'Services Overview', servicesDescription: 'Comprehensive real estate advisory ensuring your property transactions are secure, profitable, and effortless.', serviceItems: [{ title: 'Property Buying Assistance', desc: 'Tailored property hunting based on your exact lifestyle and investment requirements.' }, { title: 'Property Selling Assistance', desc: 'Strategic marketing and elite networking to secure the highest value for your premium asset.' }, { title: 'Investment Consultancy', desc: 'Expert portfolio building and ROI analysis in the fast-growing NCR real estate market.' }, { title: 'Documentation Support', desc: 'Flawless handling of legal paperwork, title checks, and registration processes.' }, { title: 'Home Loan Assistance', desc: 'Seamless financial advisory and rapid loan processing through our network of leading banking partners.' }],
  testimonialsTitle: 'Client Testimonials', testimonials: [{ quote: 'Their understanding of the luxury market in Gurgaon is truly unmatched. They found us a residence that perfectly matched our taste, making the entire acquisition process completely effortless and entirely transparent.', author: 'Rahul S.' }, { quote: 'When expanding our business operations into Noida, we needed a commercial space that reflected our brand value. The advisory team secured a prime location for us with exceptional professionalism.', author: 'Anjali V.' }, { quote: 'Investing in real estate always felt daunting until I consulted their team. Their data-driven approach to high-growth corridors helped me secure a plot that has already seen remarkable appreciation.', author: 'Vikram M.' }],
  faqTitle: 'Frequently Asked Questions', faqs: [{ q: 'What regions do you primarily operate in?', a: 'We specialize in premium real estate across Delhi NCR, with a strong focus on high-growth corridors in Noida and Gurgaon.' }, { q: 'Are all your properties legally verified?', a: 'Absolutely. Every property in our portfolio undergoes a stringent multi-point legal verification process to ensure clean titles and risk-free transactions.' }, { q: 'Do you assist with financing and home loans?', a: 'Yes, we provide end-to-end financial assistance. Our dedicated team coordinates with top-tier financial institutions to secure the most favorable loan terms for our clients.' }, { q: 'Can you help me build a real estate investment portfolio?', a: 'Yes, our investment consultancy service is designed specifically to identify high-yield assets, manage risk, and maximize your long-term capital appreciation and rental yields.' }],
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
