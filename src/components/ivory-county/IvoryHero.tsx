import { useState } from 'react';
import { Download, ArrowRight, Calendar, ShieldCheck, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface IvoryHeroProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general') => void;
}

export default function IvoryHero({ onOpenModal }: IvoryHeroProps) {
  const [phone, setPhone] = useState('');
  const [quickSent, setQuickSent] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    trackEvent('lead_submission', {
      sourceSection: 'hero_quick_form',
      phone,
      project: 'Ivory County Sector 115 Noida',
    });
    setQuickSent(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden bg-[#171717] pt-24 pb-16">
      {/* Muted looping project film with readable, lighter overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://www.youtube-nocookie.com/embed/quMeEsT4gMs?autoplay=1&mute=1&controls=0&loop=1&playlist=quMeEsT4gMs&playsinline=1&rel=0&modestbranding=1"
          title="Ivory County project film"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Typography & CTAs (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Sub-Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B59A6A]/40 bg-[#B59A6A]/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5F1E8]">
                Sector 115, Noida • By County Group
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="inline-block max-w-full rounded-r-2xl border-l-4 border-[#D4AF37] bg-black/65 px-5 py-4 text-4xl font-display font-medium leading-[1.08] tracking-tight text-white shadow-2xl backdrop-blur-sm sm:text-6xl xl:text-7xl">
              IVORY COUNTY
              <span className="mt-2 block text-2xl font-serif font-light italic text-[#F5F1E8] sm:text-3xl xl:text-4xl">
                A New Expression of Architectural Grandeur
              </span>
            </h1>

            {/* Subtitle & Value Proposition */}
            <p className="max-w-2xl rounded-lg bg-black/50 px-4 py-3 text-base font-light leading-relaxed text-white shadow-lg backdrop-blur-sm sm:text-lg">
              28 acres of low-density luxury living enveloped by 11+ acres of lush botanical greens. Featuring ultra-spacious 3, 4 &amp; 5 BHK residences, dual landmark clubhouses, and bespoke private sky decks.
            </p>

            {/* Key Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                '3, 4 & 5 BHK Residences',
                '28 Acres Master Estate',
                '11 Acres Landscape Greens',
                'Club Ivor & Club Aurus',
                '40:60 Flexible Payment Plan',
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm"
                >
                  ✓ {pill}
                </span>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenModal('price')}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B59A6A] via-[#D4AF37] to-[#B59A6A] px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-black shadow-lg shadow-[#B59A6A]/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Get Price &amp; Availability</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('brochure')}
                className="flex items-center gap-2 rounded-full border border-[#DED3C1]/40 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white cursor-pointer"
              >
                <Download size={16} className="text-[#B59A6A]" />
                <span>Download Brochure</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('sitevisit')}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-5 py-3.5 text-sm font-medium text-[#DED3C1] transition-all hover:bg-white/10 cursor-pointer"
              >
                <Calendar size={15} />
                <span>Book Site Tour</span>
              </button>
            </div>

            {/* RERA and Confidence Badges */}
            <div className="flex items-center gap-4 text-xs text-white/60 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={16} /> UP RERA Registered
              </span>
              <span>•</span>
              <span>Zero Brokerage Consultation</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#DED3C1]">
                <MapPin size={13} className="text-[#B59A6A]" /> FNG Corridor
              </span>
            </div>
          </div>

          {/* Quick Lead Capture Box (Cols 8-12) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#B59A6A]/30 bg-[#171717]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B59A6A] via-[#F5F1E8] to-[#B59A6A]" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B59A6A]">
                    Exclusive Buyer Benefits
                  </span>
                  <h3 className="text-xl font-display font-semibold text-[#F5F1E8]">
                    Request Price Sheet
                  </h3>
                </div>
                <div className="rounded-full bg-[#B59A6A]/10 px-2.5 py-1 text-[11px] font-medium text-[#DED3C1] border border-[#B59A6A]/20">
                  Starting ₹2.95 Cr*
                </div>
              </div>

              <p className="mt-3 text-xs text-white/70 leading-relaxed">
                Connect directly with Agarwal &amp; Gehlot Realtors to receive real-time tower availability, layout plans, and payment schedules.
              </p>

              {!quickSent ? (
                <form onSubmit={handleQuickSubmit} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium">
                      Mobile Number
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-white/50">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit number"
                        className="w-full rounded-xl border border-white/20 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder-white/40 focus:border-[#B59A6A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center text-white/80">
                      <span className="block font-semibold text-[#B59A6A]">3 &amp; 4 BHK</span>
                      <span className="text-[10px] text-white/50">2,034 - 3,195 sq ft</span>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center text-white/80">
                      <span className="block font-semibold text-[#B59A6A]">Ivory Gold</span>
                      <span className="text-[10px] text-white/50">3,987 - 6,939 sq ft</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-md transition hover:opacity-95 cursor-pointer"
                  >
                    <span>Get Instant Price &amp; Brochure</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => onOpenModal('general')}
                      className="text-[11px] text-[#DED3C1]/80 hover:text-white underline cursor-pointer"
                    >
                      Need custom specifications or site visit? Click here
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                  <p className="text-sm font-semibold text-emerald-400">Request Sent Successfully!</p>
                  <p className="mt-1 text-xs text-white/70">
                    Our team will share the complete cost sheet and plans on WhatsApp shortly.
                  </p>
                  <a
                    href={`https://wa.me/919654322224?text=${encodeURIComponent(
                      'Hi A&G, I just submitted the price request for Ivory County Sector 115 Noida.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Open WhatsApp Chat ↗
                  </a>
                </div>
              )}

              <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-white/50">
                <span>RERA: UPRERAPRJ256314</span>
                <span>T&amp;C Apply*</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <button
        type="button"
        onClick={() => scrollToSection('overview')}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-xs text-[#DED3C1]/60 hover:text-white transition-colors cursor-pointer"
        aria-label="Scroll to Overview"
      >
        <span className="text-[10px] tracking-widest uppercase">Explore Estate</span>
        <ChevronDown size={18} className="animate-bounce text-[#B59A6A]" />
      </button>
    </section>
  );
}
