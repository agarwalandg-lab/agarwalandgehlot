import { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

export default function IvoryGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems = IVORY_COUNTY_DATA.gallery;

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="w-full bg-[#1e1a17] py-24 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
              Visual Showcase
            </p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
              Project Gallery
            </h2>
            <p className="mt-2 text-sm text-[#DED3C1]/80 max-w-xl">
              Experience the grandeur of Sector 115 Noida through actual project site elevations, mock-up suites, and resort landscape views.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'interiors', label: 'Interiors' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'greens', label: 'Greens' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.id);
                  trackEvent('amenity_tab_change', { galleryFilter: tab.id });
                }}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#B59A6A] text-black font-semibold shadow-md'
                    : 'bg-white/5 text-[#DED3C1] hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                setLightboxIndex(index);
                trackEvent('gallery_view', { imageTitle: item.title });
              }}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-black cursor-pointer shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-[#B59A6A]/60"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={16} />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B59A6A] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {item.category}
                </span>
                <h4 className="mt-1 text-base font-display font-medium text-white group-hover:text-[#F5F1E8]">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-xs text-[#DED3C1]/70 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close viewer"
          >
            <X size={22} />
          </button>

          {filteredItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
                  );
                }}
                className="absolute left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-8"
                aria-label="Previous image"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
                }}
                className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-8"
                aria-label="Next image"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <div
            className="relative max-h-[85vh] max-w-[85vw] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h4 className="text-lg font-display text-white">
                {filteredItems[lightboxIndex].title}
              </h4>
              <p className="text-xs text-[#DED3C1]/75 mt-0.5">
                {filteredItems[lightboxIndex].description} • Photo {lightboxIndex + 1} of {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
