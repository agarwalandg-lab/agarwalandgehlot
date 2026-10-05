import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';

export default function IvoryStats() {
  return (
    <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 rounded-3xl border border-[#B59A6A]/30 bg-[#1e1a17]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        {IVORY_COUNTY_DATA.keyStats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center p-3 text-center transition-all duration-300 hover:bg-white/5 rounded-2xl group ${
              idx === 4 ? 'col-span-2 md:col-span-1' : ''
            }`}
          >
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F1E8] group-hover:text-[#B59A6A] transition-colors">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B59A6A]">
                {stat.unit}
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-widest text-[#DED3C1]/75">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
