import { useState } from 'react';
import { MapPin, Navigation, Clock, Building2, GraduationCap, HeartPulse, ShoppingBag, Car } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryLocationProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
}

export default function IvoryLocation({ onOpenModal }: IvoryLocationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { locationConnectivity } = IVORY_COUNTY_DATA;

  const categories = ['All', 'Connectivity', 'Metro', 'Hospitals', 'Education', 'Retail & Leisure'];

  const filteredPoints = locationConnectivity.highlights.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Connectivity':
        return Car;
      case 'Metro':
        return Navigation;
      case 'Hospitals':
        return HeartPulse;
      case 'Education':
        return GraduationCap;
      case 'Retail & Leisure':
        return ShoppingBag;
      case 'Business Hubs':
        return Building2;
      default:
        return MapPin;
    }
  };

  return (
    <section id="location" className="w-full bg-[#1e1a17] py-24 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
              Prime Sector 115 Noida
            </p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
              Location &amp; Connectivity
            </h2>
            <p className="mt-2 text-sm text-[#DED3C1]/80 max-w-xl">
              Strategically positioned at the junction of FNG Corridor and Master Plan roads, offering effortless access to Central Noida, South Delhi, and the upcoming Jewar Airport.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  trackEvent('amenity_tab_change', { locationCategory: cat });
                }}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#B59A6A] text-black font-semibold shadow-md'
                    : 'bg-white/5 text-[#DED3C1] hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Distance Cards Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Location Map View (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-3 shadow-2xl">
              <img
                src={locationConnectivity.mapImage}
                alt="Sector 115 Noida Location Map"
                className="aspect-[4/3] w-full object-cover rounded-2xl"
                loading="lazy"
              />
              <div className="absolute top-6 left-6 rounded-full bg-black/80 px-4 py-1.5 text-xs font-bold text-[#F5F1E8] backdrop-blur-md border border-[#B59A6A]/40 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#B59A6A]" />
                <span>Sector 115, Noida (FNG Corridor)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 text-xs text-[#DED3C1]/80 leading-relaxed flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Official GPS Coordinates:</span>
                <span>28.5831° N, 77.3942° E</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenModal('general')}
                className="rounded-xl bg-[#B59A6A] px-4 py-2 text-xs font-bold text-black hover:bg-[#D4AF37] cursor-pointer"
              >
                Get Driving Directions
              </button>
            </div>
          </div>

          {/* Key Distance Cards (Cols 7-12) */}
          <div className="lg:col-span-6 space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredPoints.map((point) => {
              const Icon = getCategoryIcon(point.category);
              return (
                <div
                  key={point.name}
                  className="rounded-2xl border border-white/10 bg-[#171717] p-4.5 transition hover:border-[#B59A6A]/50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B59A6A]/10 text-[#B59A6A] shrink-0 border border-[#B59A6A]/20">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#F5F1E8]">{point.name}</h4>
                      <p className="mt-0.5 text-xs text-[#DED3C1]/70">{point.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#B59A6A]/15 px-2.5 py-1 text-xs font-bold text-[#B59A6A]">
                      <Clock size={12} /> {point.travelTime}
                    </span>
                    <span className="block text-[11px] text-white/50 mt-1 font-mono">{point.distance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
