import { Phone, MessageSquare, Download, ArrowRight } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

interface IvoryMobileStickyBarProps {
  onOpenModal: (type: 'brochure' | 'price' | 'general') => void;
}

export default function IvoryMobileStickyBar({ onOpenModal }: IvoryMobileStickyBarProps) {
  const { contact } = IVORY_COUNTY_DATA.projectOverview;
  const whatsappMsg = encodeURIComponent(
    'Hi A&G Realtors, I am interested in Ivory County Sector 115 Noida. Please share latest prices and available inventory.'
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#171717]/95 border-t border-[#B59A6A]/30 backdrop-blur-xl px-3 py-2.5 shadow-2xl md:hidden">
      <div className="grid grid-cols-4 gap-2">
        {/* Call Button */}
        <a
          href={`tel:${contact.phoneRaw}`}
          onClick={() => trackEvent('phone_call_click', { source: 'mobile_sticky_bar' })}
          className="flex flex-col items-center justify-center rounded-xl bg-white/10 py-1.5 text-center text-[10px] font-semibold text-white transition active:scale-95"
        >
          <Phone size={16} className="text-[#B59A6A] mb-0.5" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/919654322224?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { source: 'mobile_sticky_bar' })}
          className="flex flex-col items-center justify-center rounded-xl bg-emerald-600/90 py-1.5 text-center text-[10px] font-semibold text-white transition active:scale-95"
        >
          <MessageSquare size={16} className="text-white mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Brochure Button */}
        <button
          type="button"
          onClick={() => onOpenModal('brochure')}
          className="flex flex-col items-center justify-center rounded-xl bg-white/10 py-1.5 text-center text-[10px] font-semibold text-white transition active:scale-95"
        >
          <Download size={16} className="text-[#B59A6A] mb-0.5" />
          <span>Brochure</span>
        </button>

        {/* Price Sheet Button */}
        <button
          type="button"
          onClick={() => onOpenModal('price')}
          className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-1.5 text-center text-[10px] font-bold text-black shadow-md transition active:scale-95"
        >
          <ArrowRight size={16} className="text-black mb-0.5" />
          <span>Get Price</span>
        </button>
      </div>
    </div>
  );
}
