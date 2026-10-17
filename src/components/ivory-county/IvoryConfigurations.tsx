import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { IVORY_COUNTY_DATA, ConfigurationItem } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryConfigurationsProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
  onSelectFloorPlan: (config: ConfigurationItem) => void;
}

export default function IvoryConfigurations({
  onOpenModal,
  onSelectFloorPlan,
}: IvoryConfigurationsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | '3bhk' | '4bhk' | 'gold'>('all');

  const filteredConfigs = IVORY_COUNTY_DATA.configurations.filter((item) => {
    if (activeFilter === '3bhk') return item.bedrooms === 3;
    if (activeFilter === '4bhk') return item.bedrooms === 4 && !item.id.includes('gold');
    if (activeFilter === 'gold') return item.id.includes('gold');
    return true;
  });

  return (
    <section id="configurations" className="w-full bg-[#171717] py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
              Exclusive Residences
            </p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
              Residences &amp; Configurations
            </h2>
            <p className="mt-2 text-sm text-[#DED3C1]/80 max-w-xl">
              Engineered with 11-foot ceilings, three-side ventilation, expansive wraparound balconies, and palatial master suites.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Layouts' },
              { id: '3bhk', label: '3 BHK Units' },
              { id: '4bhk', label: '4 BHK Units' },
              { id: 'gold', label: 'Ivory Gold Collection' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id as any);
                  trackEvent('amenity_tab_change', { category: tab.id });
                }}
                className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#B59A6A] text-black font-semibold shadow-md'
                    : 'bg-white/5 text-[#DED3C1] hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Configurations Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConfigs.map((config) => (
            <div
              key={config.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#1e1a17] transition-all duration-300 hover:border-[#B59A6A]/60 hover:shadow-2xl shadow-lg"
            >
              {/* Badge */}
              {config.badge && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-[#B59A6A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
                  <Sparkles size={11} />
                  <span>{config.badge}</span>
                </div>
              )}

              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <img
                  src={config.floorPlanImg}
                  alt={`${config.name} Ivory County Sector 115 Noida`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1a17] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-[#F5F1E8] backdrop-blur-sm border border-white/10">
                    Super Area: {config.superArea}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-display font-medium text-[#F5F1E8] group-hover:text-[#B59A6A] transition-colors">
                    {config.name}
                  </h3>
                  <p className="text-xs text-[#DED3C1]/70 mt-1 font-mono">{config.type}</p>

                  <p className="mt-3 text-xs leading-relaxed text-[#DED3C1]/80 line-clamp-2">
                    {config.description}
                  </p>

                  {/* Spec Icons Strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2.5 text-center text-xs">
                    <div>
                      <span className="block text-white/50 text-[10px] uppercase">Bedrooms</span>
                      <span className="font-semibold text-white">{config.bedrooms} BHK</span>
                    </div>
                    <div>
                      <span className="block text-white/50 text-[10px] uppercase">Baths</span>
                      <span className="font-semibold text-white">{config.bathrooms}</span>
                    </div>
                    <div>
                      <span className="block text-white/50 text-[10px] uppercase">Carpet</span>
                      <span className="font-semibold text-[#B59A6A]">{config.carpetArea.split(' ')[0]} sqft</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1.5">
                    {config.highlights.slice(0, 2).map((hl) => (
                      <div key={hl} className="flex items-center gap-2 text-xs text-white/75">
                        <span className="h-1 w-1 rounded-full bg-[#B59A6A]" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Strip */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-white/50">
                        Indicative Price
                      </span>
                      <span className="text-base font-display font-bold text-[#F5F1E8]">
                        {config.startingPrice}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectFloorPlan(config)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B59A6A] hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>View Layout</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenModal('price')}
                      className="rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider text-black transition hover:opacity-90 cursor-pointer"
                    >
                      Get Price Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenModal('brochure')}
                      className="rounded-xl border border-white/20 bg-white/5 py-2.5 px-3 text-center text-xs font-medium uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      Floor Plan PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
