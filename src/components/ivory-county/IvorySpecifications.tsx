import { useState } from 'react';
import { Building, Home, Bed, Utensils, Droplet, Zap, ShieldCheck, ChevronDown, Download } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';

interface IvorySpecificationsProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

export default function IvorySpecifications({ onOpenModal }: IvorySpecificationsProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Structure & Architecture': true,
    'Living, Dining & Foyer': true,
  });

  const toggleCategory = (catName: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const getSpecIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building':
        return Building;
      case 'Home':
        return Home;
      case 'Bed':
        return Bed;
      case 'Utensils':
        return Utensils;
      case 'Droplet':
        return Droplet;
      case 'Zap':
        return Zap;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Building;
    }
  };

  return (
    <section id="specifications" className="w-full bg-[#171717] py-24 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            Engineering Excellence
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            Premium Specifications
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            Uncompromising construction standards utilizing German shuttering, Italian marble, and international luxury fixtures.
          </p>
        </div>

        {/* Specifications Accordion List */}
        <div className="mt-12 space-y-4">
          {IVORY_COUNTY_DATA.specifications.map((cat) => {
            const Icon = getSpecIcon(cat.icon);
            const isOpen = !!openCategories[cat.category];

            return (
              <div
                key={cat.category}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e1a17] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.category)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/5 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B59A6A]/15 text-[#B59A6A] border border-[#B59A6A]/30">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base sm:text-lg font-display font-medium text-[#F5F1E8]">
                      {cat.category}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 hidden sm:inline-block">
                      {cat.items.length} Specifications
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#B59A6A] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 p-5 bg-[#171717]/60 space-y-3 animate-in fade-in">
                    {cat.items.map((item) => (
                      <div
                        key={item.feature}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs sm:text-sm py-2 border-b border-white/5 last:border-b-0"
                      >
                        <div className="sm:col-span-4 font-semibold text-[#B59A6A]">
                          {item.feature}
                        </div>
                        <div className="sm:col-span-8 text-[#DED3C1]/85 leading-relaxed font-light">
                          {item.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="mt-10 rounded-2xl border border-[#B59A6A]/30 bg-gradient-to-r from-[#1e1a17] to-[#25201a] p-6 text-center sm:flex sm:items-center sm:justify-between">
          <div className="text-left mb-4 sm:mb-0">
            <h4 className="text-base font-display font-medium text-white">
              Want the Complete Material &amp; Fitting Schedule?
            </h4>
            <p className="text-xs text-[#DED3C1]/70 mt-0.5">
              Download the comprehensive architectural specification docket.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenModal('brochure')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#B59A6A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#D4AF37] transition cursor-pointer"
          >
            <Download size={15} />
            <span>Download Spec Docket</span>
          </button>
        </div>
      </div>
    </section>
  );
}
