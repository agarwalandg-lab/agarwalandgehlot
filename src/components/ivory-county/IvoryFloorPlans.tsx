import { useState } from 'react';
import { Download, Maximize2, Check, ChevronRight } from 'lucide-react';
import { IVORY_COUNTY_DATA, ConfigurationItem } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryFloorPlansProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general', unitTitle?: string) => void;
  selectedConfig?: ConfigurationItem | null;
}

export default function IvoryFloorPlans({ onOpenModal, selectedConfig }: IvoryFloorPlansProps) {
  const [activePlanId, setActivePlanId] = useState<string>(
    selectedConfig?.id || IVORY_COUNTY_DATA.configurations[0].id
  );
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const currentConfig =
    IVORY_COUNTY_DATA.configurations.find((item) => item.id === activePlanId) ||
    IVORY_COUNTY_DATA.configurations[0];

  return (
    <section id="floorplans" className="w-full bg-[#1e1a17] py-24 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            Architectural Master Layouts
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            Interactive Floor Plans
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            Select a configuration below to examine detailed dimensions, carpet area ratios, and spatial flow.
          </p>
        </div>

        {/* Plan Selector Navigation Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {IVORY_COUNTY_DATA.configurations.map((config) => (
            <button
              key={config.id}
              type="button"
              onClick={() => {
                setActivePlanId(config.id);
                trackEvent('floorplan_view', { planName: config.name });
              }}
              className={`rounded-xl px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activePlanId === config.id
                  ? 'bg-[#B59A6A] text-black font-bold shadow-lg shadow-[#B59A6A]/20 scale-105'
                  : 'border border-white/10 bg-[#171717] text-[#DED3C1] hover:border-[#B59A6A]/50'
              }`}
            >
              {config.name}
            </button>
          ))}
        </div>

        {/* Floor Plan Display Canvas */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl border border-white/10 bg-[#171717] p-6 sm:p-10 shadow-2xl">
          {/* Blueprint Image Preview (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-4 group">
              <img
                src={currentConfig.floorPlanImg}
                alt={`${currentConfig.name} Floor Plan Diagram`}
                className="mx-auto max-h-[460px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setFullscreenImage(currentConfig.floorPlanImg)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/20 hover:bg-[#B59A6A] hover:text-black transition-colors"
                aria-label="Enlarge blueprint"
              >
                <Maximize2 size={18} />
              </button>
              <div className="absolute bottom-4 left-4 rounded-md bg-black/80 px-3 py-1 text-xs text-white/80 border border-white/10">
                Click zoom to view high-resolution blueprint
              </div>
            </div>
          </div>

          {/* Plan Specifications & Details (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B59A6A]">
                {currentConfig.badge || 'Standard Layout'}
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-display font-medium text-[#F5F1E8]">
                {currentConfig.name}
              </h3>
              <p className="text-xs font-mono text-[#DED3C1]/60 mt-0.5">{currentConfig.type}</p>
            </div>

            {/* Area Table */}
            <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10 text-xs sm:text-sm">
              <div className="flex justify-between p-3.5">
                <span className="text-white/60">Super Built-Up Area</span>
                <span className="font-semibold text-white">{currentConfig.superArea}</span>
              </div>
              <div className="flex justify-between p-3.5">
                <span className="text-white/60">Usable Carpet Area</span>
                <span className="font-semibold text-[#B59A6A]">{currentConfig.carpetArea}</span>
              </div>
              <div className="flex justify-between p-3.5">
                <span className="text-white/60">Balcony &amp; Terrace Deck</span>
                <span className="font-semibold text-white">{currentConfig.balconyArea}</span>
              </div>
              <div className="flex justify-between p-3.5">
                <span className="text-white/60">Starting Price</span>
                <span className="font-bold text-[#F5F1E8]">{currentConfig.startingPrice}</span>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">
                Layout Highlights
              </p>
              <div className="space-y-2">
                {currentConfig.highlights.map((hl) => (
                  <div key={hl} className="flex items-start gap-2.5 text-xs text-[#DED3C1]/85">
                    <Check size={15} className="text-[#B59A6A] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenModal('floorplan', currentConfig.name)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-[#B59A6A]/20 transition hover:scale-[1.02] cursor-pointer"
              >
                <Download size={16} />
                <span>Download {currentConfig.name} PDF</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('price', currentConfig.name)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
              >
                <span>Request Unit Availability &amp; Cost Sheet</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High-Res Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={fullscreenImage}
              alt="High resolution floor plan"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#B59A6A] font-semibold text-sm uppercase"
            >
              ✕ Close Preview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
