import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hls from 'hls.js';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { services } from '../data/services';
import Chatbot from './Chatbot';

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
    { name: 'Gallery', path: '/projects/gallery' },
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
      <div className={`glass-nav inline-flex items-center rounded-full border border-white/20 px-2 py-2 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
        
        <Link to="/" className="group relative w-10 h-10 rounded-full cursor-pointer flex items-center justify-center overflow-hidden hover:scale-110 transition-transform">
          <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" style={{ padding: '2px' }}>
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logos/ag-logo.png" alt="A&G Logo" className="w-full h-full object-contain p-[2px]" />
            </div>
          </div>
        </Link>

        <div className="w-px h-5 bg-stroke mx-2 hidden md:block"></div>

        <div className="hidden md:flex items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-xs sm:text-sm rounded-full px-3 py-1.5 transition-colors ${isActive ? 'text-text-primary bg-stroke/50' : 'text-muted hover:text-text-primary hover:bg-stroke/50'}`}
              >
                {item.name}
              </Link>
            )
          })}

          {/* Property dropdown trigger */}
          <div className="relative" onMouseEnter={() => setIsPropertyOpen(true)} onMouseLeave={() => setIsPropertyOpen(false)}>
            <button type="button" onClick={() => setIsPropertyOpen((open) => !open)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition-colors sm:text-sm ${propertyItems.some((item) => location.pathname === item.path) ? 'bg-stroke/50 text-text-primary' : 'text-muted hover:bg-stroke/50 hover:text-text-primary'}`} aria-expanded={isPropertyOpen} aria-haspopup="true">
              Property <FiChevronDown className={`transition-transform duration-300 ${isPropertyOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Services dropdown trigger */}
          <div ref={servicesRef} className="relative" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
            <button type="button" onClick={() => setIsServicesOpen((open) => !open)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition-colors sm:text-sm ${location.pathname.startsWith('/services') ? 'bg-stroke/50 text-text-primary' : 'text-muted hover:bg-stroke/50 hover:text-text-primary'}`} aria-expanded={isServicesOpen} aria-haspopup="true">
              Services <FiChevronDown className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="w-px h-5 bg-stroke mx-2 hidden md:block"></div>

        <Link to="/contact" className="group relative rounded-full bg-transparent px-4 py-1.5 text-xs text-text-primary transition-colors hover:bg-white/10 sm:text-sm">
          <div className="relative z-10 flex items-center gap-2 rounded-full bg-transparent">
            Enquire <span className="text-[10px]">↗</span>
          </div>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-stroke/50 md:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* ── Dropdowns rendered OUTSIDE the glass-nav pill so backdrop-filter doesn't break fixed positioning ── */}

      {/* Property dropdown */}
      <AnimatePresence>
        {isPropertyOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
            onMouseEnter={() => setIsPropertyOpen(true)} onMouseLeave={() => setIsPropertyOpen(false)}
            className="absolute top-full mt-2 w-72 border border-stroke bg-bg p-2 shadow-2xl text-text-primary"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            {propertyItems.map((item) => (
              <Link key={item.path} to={item.path} className="group block border-b border-stroke px-4 py-4 last:border-0 hover:bg-surface">
                <span className="flex items-center justify-between text-sm text-text-primary">{item.name}<span className="transition-transform group-hover:translate-x-1">→</span></span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">{item.description}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services mega-menu — sibling to pill, no backdrop-filter parent */}
      <AnimatePresence>
        {isServicesOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}
            className="absolute top-full mt-2 border border-stroke bg-bg shadow-2xl text-text-primary overflow-hidden"
            style={{ left: '50%', transform: 'translateX(-50%)', width: 'min(1100px, calc(100vw - 48px))' }}
          >
            <div className="p-5 md:p-7">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr]">
                {(['Buy & Sell', 'Advisory'] as const).map((group) => (
                  <div key={group}>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted">{group}</p>
                    {services.filter((service) => service.group === group).map((service) => (
                      <Link key={service.slug} to={`/services/${service.slug}`} className="group/item block border-t border-stroke px-2 py-3 transition-colors hover:bg-surface">
                        <span className="flex items-center justify-between text-sm">{service.menuTitle}<span className="-translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100">→</span></span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted">{service.shortDescription}</span>
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="bg-surface p-5 sm:col-span-2 lg:col-span-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Private Property Consultation</p>
                  <h3 className="mt-4 text-2xl font-display lg:text-3xl">Not sure where to start?</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">Receive a curated shortlist based on your budget, location and objective.</p>
                  <Link to="/services/property-consultation" className="mt-5 block bg-text-primary px-5 py-3 text-center text-xs uppercase tracking-[0.14em] text-bg">Book Consultation</Link>
                  <Link to="/services" className="mt-3 block text-center text-xs uppercase tracking-[0.14em] text-muted">View All Services</Link>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-stroke pt-5">
                {services.filter((service) => service.group === 'Support').map((service) => (
                  <Link key={service.slug} to={`/services/${service.slug}`} className="text-xs text-muted transition-colors hover:text-text-primary">{service.menuTitle} →</Link>
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
            className="glass-nav absolute top-20 left-4 right-4 rounded-2xl border border-white/20 p-3 shadow-xl md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block rounded-xl px-4 py-3 text-sm text-text-primary transition-colors hover:bg-stroke/50"
              >
                {item.name}
              </Link>
            ))}
            <button type="button" onClick={() => setIsMobilePropertyOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-text-primary" aria-expanded={isMobilePropertyOpen}>
              Property <FiChevronDown className={`transition-transform ${isMobilePropertyOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isMobilePropertyOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-l border-stroke pl-3">
                {propertyItems.map((item) => <Link key={item.path} to={item.path} className="block rounded-lg px-4 py-2.5 text-sm text-muted">{item.name}</Link>)}
              </motion.div>}
            </AnimatePresence>
            <button type="button" onClick={() => setIsMobileServicesOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-text-primary" aria-expanded={isMobileServicesOpen}>
              Services <FiChevronDown className={`transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isMobileServicesOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-l border-stroke pl-3">
                {services.map((service) => <Link key={service.slug} to={`/services/${service.slug}`} className="block rounded-lg px-4 py-2.5 text-sm text-muted">{service.menuTitle}</Link>)}
                <Link to="/services" className="block px-4 py-3 text-xs uppercase tracking-[0.14em] text-text-primary">View All Services →</Link>
              </motion.div>}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const videoSrc = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
    }
  }, []);

  return (
    <footer className="relative bg-bg pt-16 md:pt-20 pb-8 overflow-hidden border-t border-stroke/50">
      <div className="absolute inset-0 z-0 opacity-50">
         <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-y-[-1]"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full overflow-hidden mb-16 whitespace-nowrap">
          <div className="inline-block animate-marquee">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-6xl md:text-9xl font-display text-text-primary/20 mx-4">AGARWAL AND GEHLOT •</span>
            ))}
          </div>
        </div>

        <Link to="/contact" className="group relative border border-stroke bg-surface/50 backdrop-blur-md text-text-primary rounded-full px-12 py-5 text-lg hover:border-transparent transition-all mb-20">
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
          <span className="relative z-10 bg-bg rounded-full px-12 py-5 w-full h-full border border-transparent group-hover:border-transparent">hello@agarwalandgehlot.com</span>
        </Link>

        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-stroke/50 pt-8">
          <div className="flex gap-6 text-sm text-text-primary">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-primary">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Delhi NCR Market Experts
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
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
