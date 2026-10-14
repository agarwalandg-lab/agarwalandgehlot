import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { services } from '../data/services';
import { canonicalProjectAliases, projectAliasSeo, projectSlugAliases, seoLandingPages } from '../data/seoLandingPages';
import { useProjects } from '../data/projectStore';

const siteUrl = 'https://agarwalandgehlot.com';
const siteName = 'Agarwal and Gehlot Realtors';

const staticPages: Record<string, { title: string; description: string; image?: string }> = {
  '/': {
    title: 'Real Estate Company in Noida, Flats in Noida - agarwal and Gehlot | Real Estate',
    description: 'Discover premium properties in Noida with agarwal and Gehlot Real Estate, a trusted real estate company in Noida. Explore The Best Luxury Flats in Noida.',
  },
  '/about': {
    title: 'About Us - agarwal and Gehlot | Real Estate',
    description: 'agarwal and Gehlot Real Estate helps you explore premium flats in Noida, property in Noida, and investment opportunities across Noida, Gurugram, and Delhi NCR.',
  },
  '/services': {
    title: 'Real Estate Services in Noida | A&G Realtors',
    description: 'Explore A&G property consulting services for residential, commercial, investment and home-buying requirements in Noida and Delhi NCR.',
  },
  '/projects': {
    title: 'Our Projects - agarwal and Gehlot | Real Estate',
    description: 'Explore more projects by agarwal and Gehlot featuring premium residential and commercial properties in Noida.',
    image: '/cover/ivory-county.webp',
  },
  '/projects/gallery': {
    title: 'Gallery and Phots - agarwal and Gehlot',
    description: 'Explore the photo gallery of agarwal and Gehlot to discover property images, premium homes, residential projects, and real estate developments across Noida and Delhi NCR.',
  },
  '/blog': {
    title: 'Real Estate News and Updates - agarwal and Gehlot | Real Estate',
    description: 'Stay updated with the latest real estate news, property trends, market insights, and investment updates in Noida and Delhi NCR with agarwal and Gehlot.',
  },
  '/community-blogs': {
    title: 'Blogs and Updates - agarwal and Gehlot | Real Estate',
    description: 'Read the latest real estate blogs, property market updates, buying guides, and investment insights from agarwal and Gehlot Real Estate.',
  },
  '/residential': {
    title: 'Residential Property in Noida - agarwal and Gehlot | Real Estate',
    description: 'Find the best residential properties in Noida with agarwal and Gehlot Real Estate. Explore premium flats, apartments, and homes in prime locations.',
  },
  '/commercial': {
    title: 'Commercial Property in Noida - agarwal and Gehlot | Real Estate',
    description: 'Discover commercial property in Noida with agarwal and Gehlot Real Estate. Explore office spaces, retail shops, and business properties for sale.',
  },
  '/plots': {
    title: 'Plots for sale in Noida, Plots in Noida - agarwal and Gehlot | Real Estate',
    description: 'Discover premium plots for sale in Noida with agarwal and Gehlot. Get expert real estate guidance to find the right plot for your dream home or investment.',
  },
  '/investment': {
    title: 'Property Investment in Noida - agarwal and Gehlot | Real Estate',
    description: 'Property Investment in Noida with agarwal and Gehlot Real Estate. Luxury Flats in Noida for Investment, and opportunities to suit your goals.',
  },
  '/contact': {
    title: 'Contact Us - agarwal and Gehlot | Real Estate',
    description: 'Contact agarwal and Gehlot for expert real estate assistance in Noida and Delhi NCR. Get in touch for property buying, selling, investment opportunities, and personalized property consultation.',
  },
  '/property-finder': {
    title: 'Find Property in Noida and Delhi NCR - agarwal and Gehlot | Real Estate',
    description: 'Find the best properties in Noida and Delhi NCR with agarwal and Gehlot Real Estate. Explore flats, apartments, luxury homes, and commercial properties.',
  },
  '/privacy-policy': {
    title: 'Privacy and Policy - agarwal and Gehlot | Real Estate',
    description: 'Learn how agarwal and Gehlot protects your privacy and handles personal information. Read our Privacy Policy to understand our data practices when using our real estate website and services.',
  },
};

const projectSheetSeo: Record<string, { title: string; description: string }> = {
  'clove-county-sector-151-noida': {
    title: 'Flats in Sector 151 Noida, Clove county Flats - agarwal and Gehlot | Real Estate',
    description: 'Clove County flats in Sector 151, Noida, with agarwal and Gehlot. Explore apartment options, compare property features, and find a home that fits your preferences and budget.',
  },
  'jade-county-wave-city-ghaziabad': {
    title: 'Flats in Ghaziabad, Flats in Wave City Ghaziabad. Jade County Flats - Agrwal and Gehlot | Real Estate',
    description: 'Your dream flat in Ghaziabad at Jade County, Wave City. agarwal and Gehlot helps you explore residential apartments and discover the right home for your lifestyle and budget.',
  },
  'cleo-county-sector-121-noida': {
    title: 'Flats in Sector 121 Noida, Cleo County Flats in Noida - agarwal and Gehlot | Real Estate',
    description: 'Explore premium flats in Sector 121, Noida, at Cleo County. Connect with agarwal and Gehlot for property details and assistance with your home search.',
  },
  'county-107-sector-107-noida': {
    title: 'Flats in Sector 107 Noida - agarwal and Gehlot | Real Estate',
    description: 'Looking for flats in Sector 107, Noida? Explore residential apartments with agarwal and Gehlot and discover property options that match your lifestyle, budget, and home-buying requirements.',
  },
};

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const { projects } = useProjects();
  const path = pathname.replace(/\/+$/, '') || '/';
  let metadata = staticPages[path];
  let canonicalPath = path;
  let image: string | undefined;
  let faqs: { question: string; answer: string }[] = [];
  let isKnown = Boolean(metadata || seoLandingPages[path]);

  const landingPage = seoLandingPages[path];
  if (landingPage) {
    metadata = { title: landingPage.title, description: landingPage.description, image: landingPage.image };
    image = landingPage.image;
  }

  if (path.startsWith('/projects/')) {
    const routeSlug = path.split('/')[2];
    const sourceSlug = projectSlugAliases[routeSlug] || routeSlug;
    const project = projects.find((item) => item.slug === sourceSlug);
    if (project) {
      const alias = projectAliasSeo[routeSlug] || projectAliasSeo[canonicalProjectAliases[routeSlug]];
      const sheetMetadata = projectSheetSeo[routeSlug] || projectSheetSeo[sourceSlug];
      const canonicalSlug = projectSlugAliases[routeSlug] ? routeSlug : canonicalProjectAliases[routeSlug] || routeSlug;
      canonicalPath = `/projects/${canonicalSlug}`;
      metadata = {
        title: sheetMetadata?.title || alias?.title || project.seo?.title || `${project.title} in ${project.location} | A&G Realtors`,
        description: sheetMetadata?.description || alias?.description || project.seo?.description || `${project.description} Contact A&G for verified current availability and project information.`,
        image: project.image,
      };
      image = project.image;
      faqs = project.faqs || [];
      isKnown = true;
    } else if (path !== '/projects/county-150') {
      isKnown = false;
    }
  }

  if (path.startsWith('/services/')) {
    const service = services.find((item) => item.slug === path.split('/')[2]);
    if (service) {
      metadata = { title: service.seoTitle, description: service.seoDescription };
      isKnown = true;
    } else {
      isKnown = false;
    }
  }

  const currentMetadata = metadata || {
    title: `${siteName} | Property in Noida and Delhi NCR`,
    description: 'Explore property information and real estate consulting from A&G Realtors in Noida and Delhi NCR.',
  };
  image = image || currentMetadata.image || '/logos/ag-logo.png';
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const title = currentMetadata.title;
  const description = currentMetadata.description;
  const keywords = title.split(/[|,-]/).map((keyword) => keyword.trim()).filter(Boolean).join(', ');
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const pageFaqs = landingPage?.faqs || faqs;
  const dynamicBlogMetadata = path.startsWith('/blog/') || path.startsWith('/author/');

  useEffect(() => {
    if (dynamicBlogMetadata) return;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="keywords"]', 'content', keywords);
    setMeta('meta[name="robots"]', 'content', isKnown ? 'index,follow' : 'noindex,follow');
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', siteName);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', imageUrl);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'RealEstateAgent',
        '@id': `${siteUrl}/#real-estate-agent`,
        name: siteName,
        alternateName: ['A&G Realtors', 'A&G Realty', 'Agarwal & Gehlot Realtors', 'Agarwal Gehlot Realty'],
        url: siteUrl,
        telephone: '+91 96543 22224',
        image: `${siteUrl}/logos/ag-logo.png`,
        areaServed: [
          { '@type': 'City', name: 'Noida' },
          { '@type': 'City', name: 'Greater Noida' },
          { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          ...(canonicalPath === '/' ? [] : [
            { '@type': 'ListItem', position: 2, name: currentMetadata.title.split('|')[0].trim(), item: canonicalUrl },
          ]),
        ],
      },
    ];
    if (pageFaqs.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }

    let structuredData = document.getElementById('a-and-g-route-structured-data') as HTMLScriptElement | null;
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'a-and-g-route-structured-data';
      structuredData.type = 'application/ld+json';
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [canonicalUrl, description, dynamicBlogMetadata, imageUrl, isKnown, keywords, pageFaqs, title, path]);

  return null;
}
