import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { services } from '../data/services';
import Chatbot from './Chatbot';
import RouteSeo from './RouteSeo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isMobilePropertyOpen, setIsMobilePropertyOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setIsPropertyOpen(false);
    setIsMobilePropertyOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsServicesOpen(false);
        setIsPropertyOpen(false);
      }
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) setIsServicesOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Community Blog', path: '/community-blogs' },
    { name: 'Investment', path: '/investment' },
  ];

  const propertyItems = [
    { name: 'Find a Property', path: '/property-finder', description: 'Get inventory-based recommendations' },
    { name: 'Residential', path: '/residential', description: 'Premium homes and established communities' },
    { name: 'Commercial', path: '/commercial', description: 'Office, retail and investment spaces' },
    { name: 'Plots', path: '/plots', description: 'Residential and commercial land opportunities' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      {/* Navbar pill */}
      <div className={`glass-nav inline-flex items-center rounded-full border border-[#1a1614]/15 px-2.5 py-1.5 transition-all duration-300 ${scrolled ? 'shadow-xl shadow-black/15' : 'shadow-md'}`}>
        
        <Link to="/" className="group relative w-10 h-10 rounded-full cursor-pointer flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
          <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" style={{ padding: '2px' }}>
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logos/ag-logo.png" alt="A&G Logo" className="w-full h-full object-contain p-[2px]" />
            </div>
          </div>
        </Link>

        <div className="w-px h-5 bg-[#1a1614]/15 mx-1.5 md:mx-2"></div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-xs sm:text-sm font-medium rounded-full px-3.5 py-1.5 transition-all ${
                  isActive 
                    ? 'text-[#1a1614] bg-black/10 font-semibold shadow-inner' 
                    : 'text-[#2a241f] hover:text-black hover:bg-black/5'
                }`}
              >
                {item.name}
              </Link>
            )
          })}

          {/* Property dropdown trigger */}
          <div className="relative" onMouseEnter={() => setIsPropertyOpen(true)} onMouseLeave={() => setIsPropertyOpen(false)}>
            <button 
              type="button" 
              onClick={() => setIsPropertyOpen((open) => !open)} 
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                propertyItems.some((item) => location.pathname === item.path) || isPropertyOpen
                  ? 'bg-black/10 text-[#1a1614] font-semibold' 
                  : 'text-[#2a241f] hover:text-black hover:bg-black/5'
              }`} 
              aria-expanded={isPropertyOpen} 
              aria-haspopup="true"
            >
              Property <FiChevronDown className={`text-xs transition-transform duration-300 ${isPropertyOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Services dropdown trigger */}
          <div ref={servicesRef} className="relative" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
            <button 
              type="button" 
              onClick={() => setIsServicesOpen((open) => !open)} 
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                location.pathname.startsWith('/services') || isServicesOpen
                  ? 'bg-black/10 text-[#1a1614] font-semibold' 
                  : 'text-[#2a241f] hover:text-black hover:bg-black/5'
              }`} 
              aria-expanded={isServicesOpen} 
              aria-haspopup="true"
            >
              Services <FiChevronDown className={`text-xs transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="w-px h-5 bg-[#1a1614]/15 mx-2 hidden md:block"></div>

        <Link 
          to="/contact" 
          className="rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#1a1614] transition-all hover:bg-black/8 inline-flex items-center gap-1"
        >
          <span>Enquire</span> <span className="text-[11px] text-[#1a1614]/80">↗</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a1614] transition-colors hover:bg-black/8 md:hidden ml-0.5"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* ── Dropdowns rendered OUTSIDE the glass-nav pill so backdrop-filter doesn't break fixed positioning ── */}

      {/* Property dropdown */}
      <AnimatePresence>
        {isPropertyOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -8, x: '-50%' }}
            transition={{ duration: 0.22 }}
            onMouseEnter={() => setIsPropertyOpen(true)}
            onMouseLeave={() => setIsPropertyOpen(false)}
            className="absolute top-full left-1/2 mt-2 w-80 rounded-2xl border border-[#d6cfc4] bg-[#FAF7F2] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] text-[#1a1614] z-50 overflow-hidden"
          >
            {propertyItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group block rounded-xl border-b border-[#e5dfd5] px-4 py-3.5 last:border-0 hover:bg-[#EFEBE3] transition-colors"
              >
                <span className="flex items-center justify-between text-sm font-semibold text-[#1a1614]">
                  {item.name}
                  <span className="transition-transform group-hover:translate-x-1 text-[#786c5e]">→</span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-[#524a42]">
                  {item.description}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services mega-menu — fully opaque and high-contrast */}
      <AnimatePresence>
        {isServicesOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -8, x: '-50%' }}
            transition={{ duration: 0.25 }}
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            className="absolute top-full left-1/2 mt-2 w-[calc(100vw-32px)] max-w-[1020px] rounded-3xl border border-[#d6cfc4] bg-[#FAF7F2] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] text-[#1a1614] overflow-hidden z-50"
          >
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr]">
                {(['Buy & Sell', 'Advisory'] as const).map((group) => (
                  <div key={group}>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[#786c5e] font-semibold">{group}</p>
                    <div className="space-y-1">
                      {services.filter((service) => service.group === group).map((service) => (
                        <Link
                          key={service.slug}
                          to={`/services/${service.slug}`}
                          className="group/item block rounded-xl border-t border-[#e5dfd5] px-3.5 py-3 transition-colors hover:bg-[#EFEBE3]"
                        >
                          <span className="flex items-center justify-between text-sm font-semibold text-[#1a1614]">
                            {service.menuTitle}
                            <span className="-translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100 text-[#1a1614]">→</span>
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-[#524a42] font-normal">{service.shortDescription}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="bg-[#EDE6DC] rounded-2xl border border-[#d6cfc4] p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1 shadow-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#786c5e] font-semibold">Private Property Consultation</p>
                    <h3 className="mt-3 text-2xl font-display lg:text-3xl leading-snug text-[#1a1614]">Not sure where to start?</h3>
                    <p className="mt-3 text-xs leading-relaxed text-[#4a423a]">Receive a curated shortlist based on your budget, location and objective.</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Link to="/services/property-consultation" className="block rounded-xl bg-[#1a1614] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF7F2] transition-transform hover:scale-[1.02] hover:bg-black">
                      Book Consultation
                    </Link>
                    <Link to="/services" className="block text-center text-xs uppercase tracking-[0.14em] text-[#524a42] hover:text-[#1a1614] font-medium pt-1">
                      View All Services
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#dcd6cc] pt-5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#786c5e] font-semibold">Quick Support:</span>
                {services.filter((service) => service.group === 'Support').map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="text-xs text-[#38312a] font-medium transition-colors hover:text-black hover:underline flex items-center gap-1"
                  >
                    {service.menuTitle} →
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-20 left-4 right-4 rounded-3xl border border-[#d6cfc4] bg-[#FAF7F2] p-4 shadow-2xl text-[#1a1614] md:hidden z-50"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#1a1614] transition-colors hover:bg-[#EFEBE3]"
              >
                {item.name}
              </Link>
            ))}
            <button type="button" onClick={() => setIsMobilePropertyOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#1a1614] hover:bg-[#EFEBE3]" aria-expanded={isMobilePropertyOpen}>
              Property <FiChevronDown className={`transition-transform duration-300 ${isMobilePropertyOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isMobilePropertyOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-l-2 border-[#1a1614]/20 pl-3 my-1">
                {propertyItems.map((item) => <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#524a42] hover:text-black">{item.name}</Link>)}
              </motion.div>}
            </AnimatePresence>
            <button type="button" onClick={() => setIsMobileServicesOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#1a1614] hover:bg-[#EFEBE3]" aria-expanded={isMobileServicesOpen}>
              Services <FiChevronDown className={`transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isMobileServicesOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-l-2 border-[#1a1614]/20 pl-3 my-1">
                {services.map((service) => <Link key={service.slug} to={`/services/${service.slug}`} onClick={() => setIsMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#524a42] hover:text-black">{service.menuTitle}</Link>)}
                <Link to="/services" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1614] hover:underline">View All Services →</Link>
              </motion.div>}
            </AnimatePresence>
            <div className="pt-3 mt-2 border-t border-[#e5dfd5]">
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block w-full text-center rounded-xl bg-[#1a1614] py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF7F2]">
                Enquire Now ↗
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <RouteSeo />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
