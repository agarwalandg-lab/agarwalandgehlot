import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBriefcase, FiFileText, FiGlobe, FiHome, FiKey, FiMapPin, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';
import { services } from '../data/services';

const icons = [FiHome, FiKey, FiBriefcase, FiTrendingUp, FiGlobe, FiMessageCircle, FiMapPin, FiHome, FiFileText];

export default function Services() {
  useEffect(() => {
    document.title = 'Real Estate Services in Noida & Delhi NCR | A&G Realtors';
  }, []);

  return <main className="w-full overflow-hidden pb-28 pt-32">
    <section className="mx-auto max-w-[1200px] px-6 md:px-10">
      <div className="border-b border-stroke pb-20 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Real Estate Services</p>
        <h1 className="mx-auto max-w-4xl text-5xl font-display leading-tight md:text-7xl">Advisory that goes beyond finding a property.</h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted">From property discovery and investment advisory to documentation and site visits, A&amp;G helps you make informed real-estate decisions at every stage.</p>
        <Link to="/services/property-consultation" className="mt-9 inline-block bg-text-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.15em] text-bg">Talk to an Advisor</Link>
      </div>
      <div className="grid border-l border-stroke md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = icons[index];
          return <Link key={service.slug} to={`/services/${service.slug}`} className="group min-h-[280px] border-b border-r border-stroke p-8 transition-colors hover:bg-surface md:p-10">
            <Icon size={22} strokeWidth={1.3} className="text-muted transition-transform duration-300 group-hover:scale-110" />
            <p className="mt-12 text-[10px] uppercase tracking-[0.2em] text-muted">{service.group}</p>
            <h2 className="mt-3 text-2xl font-display">{service.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">{service.shortDescription}</p>
            <span className="mt-7 flex items-center gap-2 text-xs uppercase tracking-[0.14em]">Learn More <FiArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
          </Link>;
        })}
      </div>
    </section>
  </main>;
}
