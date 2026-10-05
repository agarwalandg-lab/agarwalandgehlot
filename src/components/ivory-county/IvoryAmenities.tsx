import { useState } from 'react';
import { Sparkles, Trophy, Crown, Smile, Trees, CheckCircle2, Download } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryAmenitiesProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

export default function IvoryAmenities({ onOpenModal }: IvoryAmenitiesProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    IVORY_COUNTY_DATA.amenitiesCategories[0].id
  );

  const activeCategory =
    IVORY_COUNTY_DATA.amenitiesCategories.find((c) => c.id === activeTabId) ||
    IVORY_COUNTY_DATA.amenitiesCategories[0];

  const getTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'Trophy':
        return Trophy;
      case 'Crown':
        return Crown;
      case 'Smile':
        return Smile;
      case 'Trees':
        return Trees;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="amenities" className="w-full bg-[#1e1a17] py-24 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            World-Class Privileges
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            50+ Curated Resort Amenities
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            From temperature-controlled indoor swimming pools and tournament tennis courts to dual grand clubhouses and tranquil zen water gardens.
          </p>
        </div>

        {/* Category Selection Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {IVORY_COUNTY_DATA.amenitiesCategories.map((category) => {
            const Icon = getTabIcon(category.iconName);
            const isActive = category.id === activeTabId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveTabId(category.id);
                  trackEvent('amenity_tab_change', { category: category.title });
                }}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] text-black shadow-lg shadow-[#B59A6A]/20 scale-105'
                    : 'border border-white/10 bg-[#171717] text-[#DED3C1] hover:border-[#B59A6A]/40'
                }`}
              >
                <Icon size={16} />
                <span>{category.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Showcase Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl border border-white/10 bg-[#171717] p-6 sm:p-10 shadow-2xl">
          {/* Left Visual Banner (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
              <img
                src={activeCategory.heroImage}
                alt={activeCategory.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="rounded-full bg-[#B59A6A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                  Sector 115 Noida Exclusive
                </span>
                <h4 className="mt-2 text-xl font-display font-medium text-white">
                  {activeCategory.title}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#DED3C1]/75 italic px-2">
              “{activeCategory.subtitle}”
            </p>
          </div>

          {/* Right Amenity List (Cols 7-12) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B59A6A] font-semibold">
                Category Highlights
              </p>
              <h3 className="mt-1 text-2xl sm:text-3xl font-display font-medium text-[#F5F1E8]">
                {activeCategory.title}
              </h3>
            </div>

            <div className="space-y-3.5">
              {activeCategory.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#B59A6A]/40"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#B59A6A] shrink-0" />
                    <h5 className="text-sm font-semibold text-[#F5F1E8]">{item.title}</h5>
                  </div>
                  <p className="mt-1.5 text-xs text-[#DED3C1]/80 leading-relaxed pl-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenModal('brochure')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-md transition hover:scale-105 cursor-pointer"
              >
                <Download size={15} />
                <span>Download Amenities Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('sitevisit')}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
              >
                Experience on Site Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
