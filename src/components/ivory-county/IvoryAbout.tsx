import { CheckCircle2, ArrowRight } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';

interface IvoryAboutProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
}

export default function IvoryAbout({ onOpenModal }: IvoryAboutProps) {
  const { aboutStory } = IVORY_COUNTY_DATA;

  return (
    <section id="overview" className="w-full bg-[#171717] py-24 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            The Masterpiece Vision
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-display font-light leading-tight text-[#F5F1E8]">
            {aboutStory.headline}
          </h2>
          <div className="mt-4 h-0.5 w-24 bg-gradient-to-r from-[#B59A6A] to-transparent" />
        </div>

        {/* Narrative & Visual Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Narrative (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-[#DED3C1]/85 font-light">
              {aboutStory.paragraph1}
            </p>
            <p className="text-base leading-relaxed text-[#DED3C1]/75 font-light">
              {aboutStory.paragraph2}
            </p>

            {/* Editorial Quote */}
            <div className="rounded-2xl border-l-4 border-[#B59A6A] bg-[#221c17] p-5 italic text-[#F5F1E8] text-sm sm:text-base font-serif">
              {aboutStory.quote}
            </div>

            {/* Bullet Points */}
            <div className="space-y-3 pt-2">
              {aboutStory.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#B59A6A] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#DED3C1]/90">{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => onOpenModal('general')}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition hover:scale-105 shadow-md shadow-[#B59A6A]/20 cursor-pointer"
              >
                <span>Schedule VIP Site Tour</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('brochure')}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 cursor-pointer"
              >
                Download Project Deck
              </button>
            </div>
          </div>

          {/* Right Visual Composition (Cols 7-12) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-[#B59A6A]/20 shadow-xl group">
                <img
                  src="/project-details/ivory building.webp"
                  alt="Ivory County Tower Elevation"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#221c17] p-4 text-center">
                <p className="text-2xl font-display font-bold text-[#B59A6A]">11+ Acres</p>
                <p className="text-xs text-[#DED3C1]/70 uppercase tracking-widest mt-1">
                  Central Botanical Forest
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-2xl border border-white/10 bg-[#221c17] p-4 text-center">
                <p className="text-2xl font-display font-bold text-[#B59A6A]">2 Clubhouses</p>
                <p className="text-xs text-[#DED3C1]/70 uppercase tracking-widest mt-1">
                  Club Ivor &amp; Club Aurus
                </p>
              </div>
              <div className="overflow-hidden rounded-3xl border border-[#B59A6A]/20 shadow-xl group">
                <img
                  src="/project-details/ivory gaarden.png"
                  alt="Ivory County Cascading Pool and Gardens"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
