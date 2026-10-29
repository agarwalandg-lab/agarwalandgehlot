import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';

export default function IvoryFooter() {
  const { contact, reraNumbers } = IVORY_COUNTY_DATA.projectOverview;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#111] text-white border-t border-white/10 pt-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-white/10 pb-12">
          {/* Brand & About (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-xl border border-[#B59A6A]/60 bg-[#F5F1E8] p-0.5">
                <img
                  src="/logos/ag-logo.png"
                  alt="A&G Realtors"
                  className="h-full w-full rounded-[0.6rem] object-contain"
                />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-wider text-[#F5F1E8]">
                  AGARWAL &amp; GEHLOT
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#B59A6A]">
                  Luxury Real Estate Advisory
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#DED3C1]/75 leading-relaxed max-w-sm font-light">
              Authorized channel marketing partner for Ivory County Sector 115 Noida. Dedicated to delivering verified property advisory, transparent documentation, and zero brokerage customer service.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck size={16} />
              <span>UP RERA: {reraNumbers.phase1}</span>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="space-y-3 text-xs">
            <p className="font-semibold uppercase tracking-widest text-[#B59A6A]">
              Ivory County
            </p>
            <ul className="space-y-2 text-[#DED3C1]/80">
              <li><a href="#overview" className="hover:text-white">Project Overview</a></li>
              <li><a href="#configurations" className="hover:text-white">3, 4 &amp; 5 BHK Residences</a></li>
              <li><a href="#floorplans" className="hover:text-white">Floor Plan Blueprints</a></li>
              <li><a href="#masterplan" className="hover:text-white">28-Acre Master Plan</a></li>
              <li><a href="#amenities" className="hover:text-white">Clubhouses &amp; Pools</a></li>
              <li><a href="#location" className="hover:text-white">Sector 115 Map &amp; Metro</a></li>
              <li><a href="#specifications" className="hover:text-white">Technical Specifications</a></li>
            </ul>
          </div>

          {/* Other Luxury Portfolio */}
          <div className="space-y-3 text-xs">
            <p className="font-semibold uppercase tracking-widest text-[#B59A6A]">
              County Portfolio
            </p>
            <ul className="space-y-2 text-[#DED3C1]/80">
              <li><Link to="/projects/clove-county" className="hover:text-white">Clove County (Sector 151)</Link></li>
              <li><Link to="/projects/county-107" className="hover:text-white">County 107 (Sector 107)</Link></li>
              <li><Link to="/projects/jade-county" className="hover:text-white">Jade County (Wave City)</Link></li>
              <li><Link to="/projects/cleo-county-sector-121-noida" className="hover:text-white">Cleo County (Sector 121)</Link></li>
              <li><Link to="/projects/ivy-county-sector-75-noida" className="hover:text-white">Ivy County (Sector 75)</Link></li>
              <li><Link to="/3bhk-flat" className="hover:text-white text-[#B59A6A]">3 BHK Flats in Noida</Link></li>
              <li><Link to="/luxury-properties-noida" className="hover:text-white">Luxury Properties Noida</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3 text-xs">
            <p className="font-semibold uppercase tracking-widest text-[#B59A6A]">
              Direct Contact
            </p>
            <ul className="space-y-2.5 text-[#DED3C1]/80">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#B59A6A]" />
                <a href={`tel:${contact.phoneRaw}`} className="hover:text-white font-medium">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#B59A6A]" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#B59A6A] shrink-0 mt-0.5" />
                <span>Sector 115 / Central Noida, Uttar Pradesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
          <p>© 2026 Agarwal &amp; Gehlot Realtors. All rights reserved. Marketed under UP RERA guidelines.</p>

          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">Contact Us</Link>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#B59A6A] hover:text-white cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
