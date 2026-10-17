import { Crown, Trees, Sparkles, Compass, ChevronRight } from 'lucide-react';

interface IvoryFeaturesProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
}

export default function IvoryFeatures({ onOpenModal }: IvoryFeaturesProps) {
  const pillars = [
    {
      icon: Crown,
      tag: 'Exclusive Privilege',
      title: 'Dual Grand Clubhouses',
      description:
        'Over 1,00,000 sq. ft. of elite hospitality across Club Ivor (general community club) and Club Aurus (exclusive to Ivory Gold residents) with temperature-controlled indoor pool, 32-seater Dolby theatre, bowling alley, and fine dining.',
      image: '/project-details/ivory sitting.jpg',
    },
    {
      icon: Sparkles,
      tag: 'Palatial Sky Mansions',
      title: 'The Ivory Gold Collection',
      description:
        'Large-format 4 & 5 BHK residences ranging from 3,987 to 6,939 sq. ft. Featuring private elevator arrivals, double-height living room ceilings, private plunge decks, and dedicated family lounges.',
      image: '/cover/ivory-county.webp',
    },
    {
      icon: Trees,
      tag: 'Biophilic Sanctuary',
      title: '11+ Acres Central Greens',
      description:
        'A zero-vehicle ground podium enveloped by 10,000+ native trees, cascading waterfall fountains, sensory reflexology trails, stepped amphitheatre, and 2.5 km canopy jogging paths.',
      image: '/project-details/ivory garden.webp',
    },
    {
      icon: Compass,
      tag: 'Strategic Nexus',
      title: 'FNG & Metro Connectivity',
      description:
        'Direct 75m wide FNG Expressway frontage in Sector 115. Reach Sector 76 Metro in 5 minutes, Central Noida in 7 minutes, and Noida-Gr. Noida Expressway in 10 minutes.',
      image: '/project-details/ivory map.webp',
    },
  ];

  return (
    <section className="w-full bg-[#1e1a17] py-20 text-white border-y border-[#B59A6A]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            The Pillars of Distinction
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            Crafted for the Discerning Few
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            Four foundational elements that elevate Ivory County Sector 115 beyond conventional luxury.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#171717] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B59A6A]/50 hover:shadow-2xl shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B59A6A]/15 text-[#B59A6A] border border-[#B59A6A]/30 group-hover:bg-[#B59A6A] group-hover:text-black transition-colors">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#B59A6A] bg-[#B59A6A]/10 px-2.5 py-1 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-display font-medium text-[#F5F1E8] group-hover:text-[#B59A6A] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#DED3C1]/75">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenModal('general')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B59A6A] group-hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={14} />
                  </button>
                  <span className="text-[10px] text-white/40">Sector 115</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
