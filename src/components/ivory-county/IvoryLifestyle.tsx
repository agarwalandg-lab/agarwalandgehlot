import { useState } from 'react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IvoryLifestyleProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

export default function IvoryLifestyle({ onOpenModal }: IvoryLifestyleProps) {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const stories = IVORY_COUNTY_DATA.lifestyleStorylines;
  const currentStory = stories[activeStoryIdx];

  return (
    <section id="lifestyle" className="w-full bg-[#171717] py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            The Curated Life
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            A Life of Unrivalled Distinction
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            Immerse yourself in an effortless balance of luxury residences, resort rejuvenation, and cherished community celebrations.
          </p>
        </div>

        {/* Story Selector Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {stories.map((story, idx) => (
            <button
              key={story.title}
              type="button"
              onClick={() => setActiveStoryIdx(idx)}
              className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeStoryIdx === idx
                  ? 'bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] text-black shadow-lg shadow-[#B59A6A]/20 scale-105'
                  : 'border border-white/10 bg-[#1e1a17] text-[#DED3C1] hover:border-white/30'
              }`}
            >
              {story.title}
            </button>
          ))}
        </div>

        {/* Editorial Story Card */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-[#1e1a17] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual Image (Cols 1-7) */}
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={currentStory.image}
                alt={currentStory.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-[#B59A6A] backdrop-blur-md border border-[#B59A6A]/30">
                {currentStory.pill}
              </div>
            </div>

            {/* Editorial Copy (Cols 8-12) */}
            <div className="lg:col-span-5 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#B59A6A]">
                <Sparkles size={14} />
                <span>Chapter {activeStoryIdx + 1} of 5</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-display font-medium text-[#F5F1E8] leading-tight">
                {currentStory.tagline}
              </h3>

              <p className="text-sm leading-relaxed text-[#DED3C1]/85 font-light">
                {currentStory.description}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenModal('sitevisit')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B59A6A] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Book Private Tour</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-xs text-white/40">Sector 115 Noida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
