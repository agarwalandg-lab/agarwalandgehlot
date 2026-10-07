import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { services } from '../data/services';
import { canonicalProjectAliases, projectAliasSeo, projectSlugAliases, seoLandingPages } from '../data/seoLandingPages';
import { useProjects } from '../data/projectStore';

const siteUrl = 'https://agarwalandgehlot.com';
const siteName = 'Agarwal and Gehlot Realtors';

const staticPages: Record<string, { title: string; description: string; image?: string }> = {
  '/': {
    title: 'A&G Realtors | Premium Real Estate in Noida & Greater Noida',
    description: 'A&G Realtors helps buyers explore residential and commercial property in Noida and Delhi NCR with clear project information and practical property advice.',
  },
  '/about': {
    title: 'A&G Realtors | Real Estate Consultants in Noida',
    description: 'Meet A&G Realtors, a property consultancy serving Noida and Delhi NCR. Learn about our approach to project research, buyer guidance and real estate advisory.',
  },
  '/services': {
    title: 'Real Estate Services in Noida | A&G Realtors',
    description: 'Explore A&G property consulting services for residential, commercial, investment and home-buying requirements in Noida and Delhi NCR.',
  },
  '/projects': {
    title: 'Residential Projects in Noida and Delhi NCR | A&G',
    description: 'Compare residential projects in Noida and Delhi NCR by location, configuration, status and published project information with A&G Realtors.',
    image: '/cover/ivory-county.webp',
  },
  '/projects/gallery': {
    title: 'A&G Realtors Project Gallery | Noida and Delhi NCR',
    description: 'View project photographs and property details from the A&G Realtors portfolio across Noida and Delhi NCR.',
  },
  '/blog': {
    title: 'Real Estate Insights | Market Updates and Buying Guides | A&G',
    description: 'Explore A&G Realtors insights on Noida and Greater Noida property, market updates, investment, buying guides and project news.',
  },
  '/community-blogs': {
    title: 'Community Real Estate Blog & Forum | A&G Realtors',
    description: 'Read real estate stories, buying guides, and property experiences shared directly by community members, buyers, and investors.',
  },
  '/residential': {
    title: 'Residential Property in Noida and Delhi NCR | A&G',
    description: 'Explore residential property and apartments in Noida and Delhi NCR. Compare project locations, configurations and availability with A&G Realtors.',
  },
  '/commercial': {
    title: 'Commercial Property in Noida | A&G Realtors',
    description: 'Explore commercial property, office space and retail opportunities in Noida and Delhi NCR. Verify current availability and terms before investing.',
  },
  '/plots': {
    title: 'Plot Buying Advisory in Noida | A&G Realtors',
    description: 'Review plot buying considerations in Noida with A&G Realtors. Verify land use, title, approvals, access and current availability before purchase.',
  },
  '/investment': {
    title: 'Property Investment Advisory in Noida | A&G Realtors',
    description: 'Get practical property investment guidance for Noida and Delhi NCR, including project comparison, due diligence and risk considerations.',
  },
  '/contact': {
    title: 'Contact A&G Realtors in Noida | Property Consultation',
    description: 'Contact A&G Realtors for property consultation in Noida and Delhi NCR. Share your requirements and request current project or inventory details.',
  },
  '/property-finder': {
    title: 'Find Property in Noida and Delhi NCR | A&G Realtors',
    description: 'Search property information in Noida and Delhi NCR by location, budget, configuration and buying objective with A&G Realtors.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | A&G Realtors',
    description: 'Read how A&G Realtors handles information submitted through its property consultation and enquiry services.',
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
      const canonicalSlug = projectSlugAliases[routeSlug] ? routeSlug : canonicalProjectAliases[routeSlug] || routeSlug;
      canonicalPath = `/projects/${canonicalSlug}`;
      metadata = {
        title: alias?.title || project.seo?.title || `${project.title} in ${project.location} | A&G Realtors`,
        description: alias?.description || project.seo?.description || `${project.description} Contact A&G for verified current availability and project information.`,
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
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const pageFaqs = landingPage?.faqs || faqs;
  const dynamicBlogMetadata = path.startsWith('/blog/') || path.startsWith('/author/');

  useEffect(() => {
    if (dynamicBlogMetadata) return;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
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
  }, [canonicalUrl, description, dynamicBlogMetadata, imageUrl, isKnown, pageFaqs, title, path]);

  return null;
}