import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiArrowUpRight } from 'react-icons/fi';

interface IvoryHeaderProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

const mainNavigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Community Blog', to: '/community-blogs' },
  { label: 'Investment', to: '/investment' },
  { label: 'Property', to: '/property-finder', hasDropdown: true },
  { label: 'Services', to: '/services', hasDropdown: true },
  { label: 'Enquire', to: '#', hasArrow: true },
];

export default function IvoryHeader({ onOpenModal }: IvoryHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div className="relative inline-flex max-w-full items-center rounded-full border border-[#E0E0E0] bg-[#F5F1E8]/95 backdrop-blur-sm px-2.5 py-1.5 shadow-md">
        <Link
          to="/"
          aria-label="A&G Realtors home"
          className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full border-2 border-[#5B9BD5] bg-white"></div>
          <div className="relative flex h-full w-full items-center justify-center">
            <img src="/logos/ag-logo.png" alt="A&G Realtors" className="h-6 w-6 object-contain" />
          </div>
        </Link>

        <div className="mx-1.5 hidden h-5 w-px bg-[#E0E0E0] sm:block" />
        <span className="hidden whitespace-nowrap text-xs font-semibold tracking-wide text-[#2C2C2C] sm:inline">Ivory County</span>

        <div className="mx-2 hidden h-5 w-px bg-[#E0E0E0] lg:block" />
        <div className="hidden items-center gap-1 lg:flex">
          {mainNavigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-3 py-1.5 text-xs font-medium text-[#2C2C2C] transition-all hover:bg-[#E8E8E8] flex items-center gap-1 ${
                item.label === 'Home' ? 'bg-[#2C2C2C] text-white' : ''
              }`}
            >
              {item.label}
              {item.hasDropdown && <FiChevronDown size={12} />}
              {item.hasArrow && <FiArrowUpRight size={12} />}
            </Link>
          ))}
        </div>

        <div className="mx-2 h-5 w-px bg-[#E0E0E0]" />
        <button
          type="button"
          onClick={() => onOpenModal('general')}
          className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#2C2C2C] transition-all hover:bg-[#E8E8E8]"
        >
          Enquire <span className="text-[11px] text-[#2C2C2C]/80">→</span>
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full text-[#2C2C2C] transition-colors hover:bg-[#E8E8E8] lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] rounded-3xl border border-[#E0E0E0] bg-[#FAF7F2] p-3 text-[#2C2C2C] shadow-2xl lg:hidden">
            {mainNavigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-[#EFEBE3] flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.hasDropdown && <FiChevronDown size={14} />}
                {item.hasArrow && <FiArrowUpRight size={14} />}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenModal('general');
              }}
              className="mt-2 w-full rounded-xl bg-[#2C2C2C] py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF7F2]"
            >
              Enquire Now →
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
