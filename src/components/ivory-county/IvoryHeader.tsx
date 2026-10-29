import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryHeaderProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

export default function IvoryHeader({ onOpenModal }: IvoryHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Residences', href: '#configurations' },
    { label: 'Floor Plans', href: '#floorplans' },
    { label: 'Master Plan', href: '#masterplan' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Lifestyle', href: '#lifestyle' },
    { label: 'Location', href: '#location' },
    { label: 'Specs', href: '#specifications' },
    { label: 'Developer', href: '#developer' },
    { label: 'FAQs', href: '#faqs' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#171717]/90 backdrop-blur-md border-b border-[#B59A6A]/20 py-3 shadow-xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Tag */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="h-11 w-11 overflow-hidden rounded-xl border border-[#B59A6A]/60 bg-[#F5F1E8] p-0.5 shadow-md transition-transform group-hover:scale-105">
              <img
                src="/logos/ag-logo.png"
                alt="A&G Realtors"
                className="h-full w-full rounded-[0.6rem] object-contain"
              />
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-[#F5F1E8]">
                  IVORY COUNTY
                </span>
                <span className="hidden lg:inline-block rounded-full bg-[#B59A6A]/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#DED3C1] border border-[#B59A6A]/30">
                  Sector 115 Noida
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-[#DED3C1]/60 uppercase">
                By County Group • Marketed by A&G
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden 2xl:flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-[#DED3C1]/80 flex-1 justify-start pl-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="transition-colors hover:text-[#B59A6A] cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden 2xl:flex items-center gap-2 flex-shrink-0">
            <a
              href={`tel:${IVORY_COUNTY_DATA.projectOverview.contact.phoneRaw}`}
              onClick={() => trackEvent('phone_call_click', { source: 'header' })}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
            >
              <Phone size={13} className="text-[#B59A6A]" />
              <span className="hidden md:inline">{IVORY_COUNTY_DATA.projectOverview.contact.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenModal('brochure')}
              className="flex items-center gap-1.5 rounded-full border border-[#B59A6A]/50 bg-[#B59A6A]/10 px-3 py-2 text-xs font-medium text-[#F5F1E8] transition hover:bg-[#B59A6A] hover:text-black cursor-pointer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Brochure</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenModal('price')}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-transform hover:scale-105 shadow-md shadow-[#B59A6A]/20 cursor-pointer"
            >
              <span>Get Price</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 2xl:hidden flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenModal('price')}
              className="rounded-full bg-[#B59A6A] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-black sm:hidden"
            >
              Get Price
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-24 pb-10 px-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-top duration-300 2xl:hidden">
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#B59A6A]">
                Ivory County Noida
              </p>
              <p className="text-lg font-display text-white mt-1">
                Luxury 3, 4 &amp; 5 BHK Residences
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-3 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-[#DED3C1] hover:border-[#B59A6A] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('brochure');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#B59A6A] bg-[#B59A6A]/10 py-3.5 text-sm font-semibold text-[#F5F1E8]"
            >
              <Download size={16} /> Download 48-Page Brochure
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('sitevisit');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-3.5 text-sm font-semibold text-black"
            >
              Schedule VIP Site Tour
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-white/60 pt-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>UP RERA: UPRERAPRJ256314 / UPRERAPRJ115902</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
