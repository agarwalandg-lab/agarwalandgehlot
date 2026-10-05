import { MessageSquare, Calendar } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface IvoryFloatingActionsProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

export default function IvoryFloatingActions({ onOpenModal }: IvoryFloatingActionsProps) {
  const whatsappMsg = encodeURIComponent(
    'Hi A&G Realtors, I am requesting immediate details on Ivory County Sector 115 Noida.'
  );

  return (
    <div className="fixed right-5 bottom-6 z-30 hidden md:flex flex-col items-end gap-3 animate-in fade-in">
      {/* Schedule Tour Floating Pill */}
      <button
        type="button"
        onClick={() => onOpenModal('sitevisit')}
        className="flex items-center gap-2 rounded-full border border-[#B59A6A]/40 bg-[#171717]/95 px-4 py-2.5 text-xs font-semibold text-[#F5F1E8] shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-[#B59A6A] hover:bg-[#221c17] cursor-pointer"
      >
        <Calendar size={15} className="text-[#B59A6A]" />
        <span>Book VIP Site Visit</span>
      </button>

      {/* Floating WhatsApp Concierge Button */}
      <a
        href={`https://wa.me/919654322224?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', { source: 'floating_widget' })}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40 transition-all duration-300 hover:scale-110 hover:bg-emerald-500"
        aria-label="Chat on WhatsApp with Ivory County Portfolio Advisor"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white" />
        </span>
        <MessageSquare size={26} />

        {/* Hover Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 rounded-xl bg-[#171717] px-3.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap opacity-0 shadow-xl transition-opacity group-hover:opacity-100 border border-white/10 pointer-events-none">
          💬 Instant WhatsApp Concierge
        </span>
      </a>
    </div>
  );
}
