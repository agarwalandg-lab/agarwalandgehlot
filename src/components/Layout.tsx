import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hls from 'hls.js';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.colorScheme = 'dark';
      root.style.setProperty('--bg', '0 0% 4%');
      root.style.setProperty('--surface', '0 0% 8%');
      root.style.setProperty('--text', '0 0% 96%');
      root.style.setProperty('--muted', '0 0% 53%');
      root.style.setProperty('--stroke', '0 0% 12%');
    } else {
      root.style.colorScheme = 'light';
      root.style.setProperty('--bg', '0 0% 98%');
      root.style.setProperty('--surface', '0 0% 92%');
      root.style.setProperty('--text', '0 0% 8%');
      root.style.setProperty('--muted', '0 0% 40%');
      root.style.setProperty('--stroke', '0 0% 80%');
    }
  }, [isDark]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Residential', path: '/residential' },
    { name: 'Commercial', path: '/commercial' },
    { name: 'Plots', path: '/plots' },
    { name: 'Investment', path: '/investment' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div className={`glass-nav inline-flex items-center rounded-full border border-white/20 px-2 py-2 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
        
        <Link to="/" className="group relative w-10 h-10 rounded-full cursor-pointer flex items-center justify-center overflow-hidden hover:scale-110 transition-transform">
          <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" style={{ padding: '2px' }}>
            <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
              <span className="font-display text-[14px] text-text-primary">A&G</span>
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
        </div>

        <div className="w-px h-5 bg-stroke mx-2 hidden md:block"></div>

        <button
          onClick={() => setIsDark(!isDark)}
          className="relative text-xs sm:text-sm rounded-full px-3 py-1.5 text-text-primary hover:text-text-primary hover:bg-stroke/50 transition-colors flex items-center gap-2"
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

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
          <div className="flex gap-6 text-sm text-muted">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <Link to="/about" className="hover:text-text-primary transition-colors">About Us</Link>
            <Link to="/projects" className="hover:text-text-primary transition-colors">Projects</Link>
            <Link to="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
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
    </div>
  );
}
