import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import IvoryHeader from '../components/ivory-county/IvoryHeader';
import IvoryHero from '../components/ivory-county/IvoryHero';
import IvoryStats from '../components/ivory-county/IvoryStats';
import IvoryAbout from '../components/ivory-county/IvoryAbout';
import IvoryFeatures from '../components/ivory-county/IvoryFeatures';
import IvoryConfigurations from '../components/ivory-county/IvoryConfigurations';
import IvoryFloorPlans from '../components/ivory-county/IvoryFloorPlans';
import IvoryMasterPlan from '../components/ivory-county/IvoryMasterPlan';
import IvoryAmenities from '../components/ivory-county/IvoryAmenities';
import IvoryLifestyle from '../components/ivory-county/IvoryLifestyle';
import IvoryLocation from '../components/ivory-county/IvoryLocation';
import IvorySpecifications from '../components/ivory-county/IvorySpecifications';
import IvoryGallery from '../components/ivory-county/IvoryGallery';
import IvoryPricing from '../components/ivory-county/IvoryPricing';
import IvoryDeveloper from '../components/ivory-county/IvoryDeveloper';
import IvoryFaq from '../components/ivory-county/IvoryFaq';
import IvoryLegal from '../components/ivory-county/IvoryLegal';
import IvoryFinalCta from '../components/ivory-county/IvoryFinalCta';
import IvoryFooter from '../components/ivory-county/IvoryFooter';
import IvoryMobileStickyBar from '../components/ivory-county/IvoryMobileStickyBar';
import IvoryFloatingActions from '../components/ivory-county/IvoryFloatingActions';
import IvoryLeadModal, { ModalType } from '../components/ivory-county/IvoryLeadModal';
import { IVORY_COUNTY_DATA, ConfigurationItem } from '../data/ivoryCountyData';

export default function IvoryCountyMicrosite() {
  const location = useLocation();
  const siteUrl = 'https://agarwalandgehlot.com';
  const canonicalUrl = `${siteUrl}/projects/ivory-county`;

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    unitTitle?: string;
  }>({
    isOpen: false,
    type: 'general',
  });

  const [selectedFloorPlan, setSelectedFloorPlan] = useState<ConfigurationItem | null>(null);

  // This microsite sits outside the shared Layout, so it owns its scroll reset.
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => {
      cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [location.pathname]);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animFrame);
      lenis.destroy();
    };
  }, []);

  // Project-specific SEO for every Ivory County alias route.
  useEffect(() => {
    const title = 'Ivory County Sector 115 Noida | Price, Floor Plan & RERA';
    const description = 'Explore Ivory County Sector 115 Noida: 3, 4 and 5 BHK floor plans, amenities, RERA details, location and current price and inventory on request.';
    const imageUrl = `${siteUrl}/cover/ivory-county.webp`;

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta(
      'meta[name="keywords"]',
      'name',
      'keywords',
      'Ivory County, Ivory County Sector 115 Noida, Ivory County price, Ivory County floor plan, Ivory County 3 BHK, Ivory County 4 BHK, Ivory County 5 BHK, Ivory Gold, County Group Noida',
    );
    setMeta('meta[name="robots"]', 'name', 'robots', 'index,follow,max-image-preview:large');
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Agarwal and Gehlot Realtors');
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [canonicalUrl, siteUrl]);

  const openModal = (type: ModalType = 'general', unitTitle?: string) => {
    setModalState({
      isOpen: true,
      type,
      unitTitle,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectFloorPlan = (config: ConfigurationItem) => {
    setSelectedFloorPlan(config);
    const floorPlansSection = document.getElementById('floorplans');
    if (floorPlansSection) {
      floorPlansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD)
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        name: 'Ivory County Sector 115 Noida',
        description: 'Luxury 3, 4 and 5 BHK residences at Ivory County in Sector 115, Noida, with floor plans, amenities, location and RERA information.',
        url: canonicalUrl,
        image: `${siteUrl}/cover/ivory-county.webp`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sector 115, FNG Corridor',
          addressLocality: 'Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201301',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 28.5831,
          longitude: 77.3942,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: IVORY_COUNTY_DATA.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: `${siteUrl}/projects`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Ivory County Sector 115 Noida',
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-[#171717] text-white selection:bg-[#B59A6A] selection:text-black font-sans antialiased overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Luxury Sticky Header */}
      <IvoryHeader onOpenModal={openModal} />

      {/* Hero Section */}
      <IvoryHero onOpenModal={openModal} />

      {/* Key Stats Counter Strip */}
      <IvoryStats />

      {/* Editorial About Narrative */}
      <IvoryAbout onOpenModal={openModal} />

      {/* 4 Pillars of Distinction */}
      <IvoryFeatures onOpenModal={openModal} />

      {/* Configurations & Residences */}
      <IvoryConfigurations
        onOpenModal={openModal}
        onSelectFloorPlan={handleSelectFloorPlan}
      />

      {/* Interactive Floor Plans */}
      <IvoryFloorPlans
        onOpenModal={openModal}
        selectedConfig={selectedFloorPlan}
      />

      {/* 28-Acre Master Layout */}
      <IvoryMasterPlan onOpenModal={openModal} />

      {/* Categorized Resort Amenities */}
      <IvoryAmenities onOpenModal={openModal} />

      {/* Curated Lifestyle Chapters */}
      <IvoryLifestyle onOpenModal={openModal} />

      {/* Prime Location & Connectivity */}
      <IvoryLocation onOpenModal={openModal} />

      {/* Technical Construction Specifications */}
      <IvorySpecifications onOpenModal={openModal} />

      {/* Project Photo Gallery & Lightbox */}
      <IvoryGallery />

      {/* Pricing & 40:60 Payment Schedule */}
      <IvoryPricing onOpenModal={openModal} />

      {/* Developer Legacy & Credibility */}
      <IvoryDeveloper />

      {/* Comprehensive FAQs Accordion */}
      <IvoryFaq />

      {/* Legal & UP RERA Disclosures */}
      <IvoryLegal />

      {/* Final Full-Width Conversion CTA */}
      <IvoryFinalCta onOpenModal={openModal} />

      {/* Dedicated Luxury Footer */}
      <IvoryFooter />

      {/* Mobile Sticky Conversion Bottom Bar */}
      <IvoryMobileStickyBar onOpenModal={openModal} />

      {/* Floating Desktop WhatsApp & VIP Tour Concierge */}
      <IvoryFloatingActions onOpenModal={openModal} />

      {/* Universal Multi-Purpose Lead Capture Modal */}
      <IvoryLeadModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        unitTitle={modalState.unitTitle}
        sourceSection="ivory_county_microsite"
      />
    </div>
  );
}
