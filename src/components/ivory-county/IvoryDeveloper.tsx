import { ShieldCheck, ArrowRight } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { Link } from 'react-router-dom';

export default function IvoryDeveloper() {
  const { developerStory } = IVORY_COUNTY_DATA;

  return (
    <section id="developer" className="w-full bg-[#1e1a17] py-24 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            Developer Credibility
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            The County Group Legacy
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            {developerStory.subtitle}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {developerStory.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#171717] p-6 text-center shadow-lg"
            >
              <p className="text-3xl sm:text-4xl font-display font-bold text-[#B59A6A]">
                {stat.num}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#DED3C1]/75">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-medium text-[#F5F1E8]">
              Iconic Delivered &amp; Ongoing Landmarks
            </h3>
            <span className="text-xs text-white/50 hidden sm:inline-block">
              Noida &amp; Delhi NCR Portfolio
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerStory.deliveredLandmarks.map((item) => (
              <div
                key={item.name}
                className="group rounded-2xl border border-white/10 bg-[#171717] p-5 transition hover:border-[#B59A6A]/50 hover:shadow-xl shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B59A6A] font-display">
                    {item.name}
                  </span>
                  <span className="text-[10px] rounded-full bg-white/5 px-2.5 py-0.5 text-white/60">
                    {item.sector}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-white">{item.type}</p>
                <p className="mt-1 text-xs text-[#DED3C1]/70 leading-relaxed">
                  {item.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Partner Credibility Box */}
        <div className="mt-12 rounded-3xl border border-[#B59A6A]/30 bg-gradient-to-r from-[#171717] via-[#221c17] to-[#171717] p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1 mb-4 sm:mb-0">
            <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-bold uppercase tracking-widest text-[#B59A6A]">
              <ShieldCheck size={16} />
              <span>Certified Channel Advisory</span>
            </div>
            <h4 className="text-xl font-display font-medium text-white">
              Marketed with Pride by Agarwal &amp; Gehlot Realtors
            </h4>
            <p className="text-xs text-[#DED3C1]/75 max-w-xl">
              100% transparent transactions, zero brokerage for new developer allotments, priority unit inventory access, and end-to-end legal support.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-md hover:scale-105 transition shrink-0"
          >
            <span>About A&amp;G Realtors</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
