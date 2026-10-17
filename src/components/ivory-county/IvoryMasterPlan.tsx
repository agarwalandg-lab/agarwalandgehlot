import { useState } from 'react';
import { Info, Download } from 'lucide-react';
import { IVORY_COUNTY_DATA, MasterPlanHotspot } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryMasterPlanProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
}

export default function IvoryMasterPlan({ onOpenModal }: IvoryMasterPlanProps) {
  const [activeHotspot, setActiveHotspot] = useState<MasterPlanHotspot>(
    IVORY_COUNTY_DATA.masterPlanHotspots[1]
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredHotspots = IVORY_COUNTY_DATA.masterPlanHotspots.filter((spot) => {
    if (filterCategory === 'all') return true;
    return spot.category === filterCategory;
  });

  return (
    <section id="masterplan" className="w-full bg-[#171717] py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
              Master Estate Planning
            </p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
              28-Acre Master Layout
            </h2>
            <p className="mt-2 text-sm text-[#DED3C1]/80 max-w-xl">
              Engineered with zero ground-level vehicular traffic, expansive pedestrian promenades, and seamless integration between towers and 11 acres of central greens.
            </p>
          </div>

          {/* Legend / Category Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'clubhouse', label: 'Clubhouses' },
              { id: 'green', label: 'Greens & Parks' },
              { id: 'amenity', label: 'Sports & Pools' },
              { id: 'tower', label: 'Towers' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-[#B59A6A] text-black font-semibold shadow-md'
                    : 'bg-white/5 text-[#DED3C1] hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Plan Interactive Area */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Display & Hotspots (Cols 1-8) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
              <img
                src={IVORY_COUNTY_DATA.locationConnectivity.mapImage}
                alt="Ivory County 28-Acre Master Plan Map"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20" />

              {/* Interactive Hotspot Pins */}
              {filteredHotspots.map((spot) => {
                const isSelected = activeHotspot.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => {
                      setActiveHotspot(spot);
                      trackEvent('floorplan_view', { hotspot: spot.title });
                    }}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 z-20 cursor-pointer ${
                      isSelected
                        ? 'h-9 w-9 bg-[#D4AF37] text-black ring-4 ring-[#B59A6A]/50 scale-125'
                        : 'h-7 w-7 bg-black/80 text-[#B59A6A] border border-[#B59A6A] hover:scale-110 hover:bg-[#B59A6A] hover:text-black'
                    }`}
                    title={spot.title}
                  >
                    <span className="text-xs font-bold">{spot.id}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-white/60 px-2">
              <span className="flex items-center gap-1.5">
                <Info size={14} className="text-[#B59A6A]" /> Click any numbered pin to inspect zone specifications
              </span>
              <span>28 Acres Master Plan</span>
            </div>
          </div>

          {/* Active Hotspot Inspector Card (Cols 9-12) */}
          <div className="lg:col-span-4 rounded-3xl border border-[#B59A6A]/40 bg-[#1e1a17] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="rounded-full bg-[#B59A6A]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B59A6A] border border-[#B59A6A]/30">
                Hotspot #{activeHotspot.id} • {activeHotspot.tag}
              </span>
              <span className="text-xs text-white/50 capitalize font-mono">{activeHotspot.category}</span>
            </div>

            <div>
              <h3 className="text-2xl font-display font-medium text-[#F5F1E8]">
                {activeHotspot.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#DED3C1]/85 font-light">
                {activeHotspot.description}
              </p>
            </div>

            {/* Quick Master Facts */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs space-y-2.5">
              <div className="flex justify-between text-white/70">
                <span>Total Master Estate:</span>
                <span className="font-semibold text-white">28 Acres</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Central Green Podium:</span>
                <span className="font-semibold text-[#B59A6A]">11+ Acres (Car-Free)</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Dual Clubhouses:</span>
                <span className="font-semibold text-white">1,00,000+ Sq. Ft.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenModal('brochure')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-[#B59A6A]/20 transition hover:scale-[1.02] cursor-pointer"
              >
                <Download size={15} />
                <span>Download Master Plan PDF</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('general')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
              >
                <span>Book On-Site Walkthrough</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
