import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerColumns = [
    {
      title: 'PRODUCTS',
      links: [
        { label: 'Residential Homes', path: '/residential' },
        { label: '3bhk flat in noida', path: '/3bhkflat' },
        { label: 'Commercial Spaces', path: '/commercial' },
        { label: 'Plots & Land', path: '/plots' },
        { label: 'Investment Opportunities', path: '/investment' },
        { label: 'Property Finder', path: '/property-finder' },
      ],
    },
    {
      title: 'SOLUTIONS',
      links: [
        { label: 'Buy Property in Noida', path: '/services/buy-property' },
        { label: 'Sell Property Advisory', path: '/services/sell-property' },
        { label: 'Commercial Real Estate', path: '/services/commercial-real-estate' },
        { label: 'Property Investment', path: '/services/property-investment' },
        { label: 'NRI Real Estate Services', path: '/services/nri-services' },
        { label: 'Home Loan Assistance', path: '/services/home-loan-assistance' },
      ],
    },
    {
      title: 'INDUSTRIES / LOCATIONS',
      links: [
        { label: 'Property in Noida', path: '/property-in-noida' },
        { label: '3bhk flat in noida', path: '/3bhkflat' },
        { label: 'Property in Greater Noida', path: '/property-in-greater-noida' },
        { label: 'Sector 150 Noida', path: '/projects/clove-county-sector-151-noida' },
        { label: 'Sector 115 Noida', path: '/projects/ivory-county-sector-115-noida' },
        { label: 'Sector 107 Noida', path: '/projects/county-107-sector-107-noida' },
        { label: 'Near Noida Airport', path: '/property-near-noida-airport' },
      ],
    },
    {
      title: 'RESOURCES',
      links: [
        { label: 'Real Estate Blog', path: '/blog' },
        { label: 'Community Forum & Blogs', path: '/community-blogs' },
        { label: 'Noida Investment Guide', path: '/property-investment-noida' },
        { label: 'Luxury Properties Noida', path: '/luxury-properties-noida' },
        { label: 'Airport Region Guide', path: '/property-near-noida-airport' },
        { label: 'Project Gallery', path: '/projects/gallery' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About A&G Realtors', path: '/about' },
        { label: 'All Projects', path: '/projects' },
        { label: 'All Services', path: '/services' },
        { label: 'Contact Advisors', path: '/contact' },
        { label: 'Book Site Visit', path: '/services/site-visits' },
      ],
    },
    {
      title: 'COMPARE PROJECTS',
      links: [
        { label: 'Ivory County Sector 115', path: '/projects/ivory-county-sector-115-noida' },
        { label: 'Clove County Sector 151', path: '/projects/clove-county-sector-151-noida' },
        { label: 'Jade County Wave City', path: '/projects/jade-county-wave-city-ghaziabad' },
        { label: 'Cleo County Sector 121', path: '/projects/cleo-county-sector-121-noida' },
        { label: 'County 107 Sector 107', path: '/projects/county-107-sector-107-noida' },
      ],
    },
    {
      title: 'CUSTOMERS',
      links: [
        { label: 'Private Consultation', path: '/services/property-consultation' },
        { label: 'Legal & Title Verification', path: '/services/legal-documentation' },
        { label: 'Verified RERA Projects', path: '/projects' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Terms & Disclaimers', path: '/privacy-policy#terms' },
        { label: 'Contact & Support', path: '/contact' },
      ],
    },
  ];

  const whatsappMessage = encodeURIComponent('Hi A&G Realtors, I am visiting your website and would like to speak with a real estate advisor.');
  const whatsappUrl = `https://wa.me/919654322224?text=${whatsappMessage}`;

  return (
    <footer className="w-full border-t border-stroke bg-bg pt-16 pb-12 text-text-primary">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        
        {/* Main 8-Column Grid Layout */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h3 className="mb-6 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
                {col.title}
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-muted transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-14 w-full border-t border-stroke/60" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Copyright & Brand Badge */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-text-primary text-[10px] font-bold text-bg transition-transform hover:scale-110"
              aria-label="A&G Home"
            >
              A&G
            </Link>
            <span className="text-xs text-muted">
              © {currentYear} A&G Realtors. All rights reserved.
            </span>
          </div>

          {/* External WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text-primary"
          >
            <span>Open A&G WhatsApp Consultant</span>
            <FiArrowUpRight className="text-sm" />
          </a>

        </div>

      </div>
    </footer>
  );
}
