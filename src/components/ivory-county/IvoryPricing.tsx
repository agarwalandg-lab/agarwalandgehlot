import { ShieldCheck, FileText } from 'lucide-react';

interface IvoryPricingProps {
  onOpenModal: (type: 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general', unitTitle?: string) => void;
}

export default function IvoryPricing({ onOpenModal }: IvoryPricingProps) {
  const paymentMilestones = [
    { step: '01', percent: '10%', title: 'At the Time of Booking', desc: 'Secure your chosen residence, tower elevation, and preferred floor.' },
    { step: '02', percent: '30%', title: 'Within 45 to 60 Days', desc: 'Execution of registered Builder-Buyer Agreement (BBA) and excavation milestone.' },
    { step: '03', percent: '60%', title: 'On Notice of Possession', desc: 'Final balance payment upon receipt of Occupancy Certificate (OC) & handover.' },
  ];

  return (
    <section className="w-full bg-[#171717] py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            Financial Clarity &amp; Transparency
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            Pricing &amp; 40:60 Payment Plan
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            Enjoy flexible, buyer-friendly construction linked and possession-linked payment plans with complete RERA escrow protection.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 40:60 Plan Visualizer (Cols 1-7) */}
          <div className="lg:col-span-7 rounded-3xl border border-[#B59A6A]/40 bg-[#1e1a17] p-6 sm:p-10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59A6A]">
                    Featured Scheme
                  </span>
                  <h3 className="text-2xl font-display font-medium text-[#F5F1E8]">
                    Special 40:60 Payment Schedule
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Investor &amp; End-User Friendly
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {paymentMilestones.map((m) => (
                  <div
                    key={m.step}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#171717] p-4 transition hover:border-[#B59A6A]/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#B59A6A] to-[#8C7348] text-black font-display font-bold text-base shrink-0">
                      {m.percent}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#F5F1E8]">
                        Stage {m.step}: {m.title}
                      </h4>
                      <p className="mt-1 text-xs text-[#DED3C1]/75 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>All payments routed via UP RERA designated escrow account</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenModal('price')}
                className="rounded-xl bg-[#B59A6A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#D4AF37] transition cursor-pointer"
              >
                Request Custom Schedule
              </button>
            </div>
          </div>

          {/* Price Estimator & Loan Assistance (Cols 8-12) */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#1e1a17] p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B59A6A]">
                Indicative Price Bands
              </span>
              <h3 className="mt-1 text-2xl font-display font-medium text-[#F5F1E8]">
                Unit Price Summary
              </h3>

              <div className="mt-5 space-y-3">
                {[
                  { size: '3 BHK (2,034 sq ft)', price: 'Starting ₹ 2.95 Cr*' },
                  { size: '3 BHK + Utility (2,304 sq ft)', price: 'Starting ₹ 3.35 Cr*' },
                  { size: '4 BHK Grand (2,727 sq ft)', price: 'Starting ₹ 3.98 Cr*' },
                  { size: '4 BHK Estate (3,195 sq ft)', price: 'Starting ₹ 4.65 Cr*' },
                  { size: 'Ivory Gold Palatial (3,987+ sq ft)', price: 'Price on Request' },
                ].map((item) => (
                  <div
                    key={item.size}
                    className="flex justify-between items-center rounded-xl bg-white/5 p-3 text-xs"
                  >
                    <span className="text-[#DED3C1]">{item.size}</span>
                    <span className="font-bold text-[#F5F1E8] font-mono">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Loan Tie-ups */}
            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 text-xs space-y-2">
              <span className="text-[11px] font-semibold uppercase text-white/60 block">
                Approved Leading Lending Partners:
              </span>
              <p className="text-[#DED3C1]/80">
                SBI, HDFC Bank, ICICI Bank, Axis Bank, Bank of Baroda &amp; Kotak Mahindra.
              </p>
              <p className="text-[10px] text-white/40">
                *Home loan assistance provided at 0% processing brokerage through A&amp;G.
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onOpenModal('price')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-[#B59A6A]/20 transition hover:scale-[1.02] cursor-pointer"
              >
                <FileText size={15} />
                <span>Get Detailed Cost Sheet with Taxes</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('general')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
              >
                <span>Speak with a Loan Advisor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
