import { Phone, Download, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryFinalCtaProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
}

export default function IvoryFinalCta({ onOpenModal }: IvoryFinalCtaProps) {
  const { contact } = IVORY_COUNTY_DATA.projectOverview;

  return (
    <section className="relative w-full overflow-hidden bg-[#171717] py-24 text-white">
      {/* Background Graphic & Luxury Glow */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/cover/ivory-county.webp"
          alt="Ivory County Noida"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/90 to-[#171717]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B59A6A]/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B59A6A]/40 bg-[#B59A6A]/10 px-4 py-1.5 backdrop-blur-md">
          <Sparkles size={14} className="text-[#D4AF37]" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F5F1E8]">
            Limited Luxury Inventory
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-light text-white tracking-tight leading-tight">
          Your Address. Your Legacy.
          <span className="block text-2xl sm:text-4xl text-[#B59A6A] font-serif italic mt-2">
            Sanctuary Awaits at Ivory County
          </span>
        </h2>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#DED3C1]/85 font-light leading-relaxed">
          Book your private consultation with Agarwal &amp; Gehlot Realtors today to secure early-stage allotment pricing, exclusive floor choices, and flexible 40:60 payment schedules.
        </p>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onOpenModal('price')}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B59A6A] via-[#D4AF37] to-[#B59A6A] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black shadow-xl shadow-[#B59A6A]/30 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Request Complete Price Sheet</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('brochure')}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/15 transition cursor-pointer"
          >
            <Download size={16} className="text-[#B59A6A]" />
            <span>Download 48-Page E-Brochure</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('general')}
            className="flex items-center gap-2 rounded-full border border-[#B59A6A]/50 bg-[#B59A6A]/10 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-[#F5F1E8] hover:bg-[#B59A6A] hover:text-black transition cursor-pointer"
          >
            <Calendar size={16} />
            <span>Book VIP Site Visit</span>
          </button>
        </div>

        {/* Direct Call Concierge */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
          <span>Prefer direct discussion?</span>
          <a
            href={`tel:${contact.phoneRaw}`}
            onClick={() => trackEvent('phone_call_click', { source: 'final_cta' })}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#F5F1E8] hover:text-[#B59A6A] transition-colors"
          >
            <Phone size={15} className="text-[#B59A6A]" />
            <span>Call Portfolio Concierge: {contact.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
