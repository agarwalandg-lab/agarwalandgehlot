import { useEffect, useState } from 'react';
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
  const is3BhkLanding = location.pathname === '/3bhk-flat';

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    unitTitle?: string;
  }>({
    isOpen: false,
    type: 'general',
  });

  const [selectedFloorPlan, setSelectedFloorPlan] = useState<ConfigurationItem | null>(null);

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

  // Update Page Title and Meta description
  useEffect(() => {
    if (is3BhkLanding) {
      document.title = '3 BHK Flat in Noida | Ivory County Sector 115 Luxury Residences | A&G Realtors';
    } else {
      document.title = 'Ivory County Sector 115 Noida | 3, 4 & 5 BHK Price, Floor Plans, RERA | A&G Realtors';
    }

    // Inject SEO Meta tags
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      is3BhkLanding
        ? 'Explore luxury 3 BHK flats at Ivory County Sector 115 Noida. 2,034 - 2,304 sq ft with large balconies, 11-acre central greens, dual clubhouses, 40:60 payment plan & verified UP RERA.'
        : 'Discover Ivory County in Sector 115 Noida by County Group. Ultra-luxury 3, 4 & 5 BHK residences across 28 acres with 11 acres central greens, dual clubhouses, 40:60 payment plan & verified RERA details.'
    );
  }, [is3BhkLanding]);

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
        name: is3BhkLanding ? '3 BHK Flats in Noida - Ivory County' : 'Ivory County Sector 115 Noida',
        description: is3BhkLanding
          ? 'Luxury 3 BHK flats at Ivory County Sector 115, Noida. 2,034 - 2,304 sq ft with large balconies, 11-acre botanical greens, dual clubhouses, and verified UP RERA.'
          : 'Ultra-luxury 3, 4 & 5 BHK residential project in Sector 115, Noida by County Group, featuring 28 acres master estate, 11 acres botanical greens, and dual clubhouses.',
        url: is3BhkLanding ? 'https://agarwalandgehlotrealtors.com/3bhk-flat' : 'https://agarwalandgehlotrealtors.com/projects/ivory-county',
        image: 'https://agarwalandgehlotrealtors.com/cover/ivory-county.webp',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: '29500000',
          offerCount: '2372',
          priceValidUntil: '2027-12-31',
        },
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
            item: 'https://agarwalandgehlotrealtors.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: 'https://agarwalandgehlotrealtors.com/projects',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Ivory County Sector 115 Noida',
            item: 'https://agarwalandgehlotrealtors.com/projects/ivory-county',
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
