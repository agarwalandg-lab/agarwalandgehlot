import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiKey, FiTag, FiUser, FiArrowUpRight, FiArrowRight } from 'react-icons/fi';
import { useHome } from '../data/homeStore';
import { canonicalProjectAliases } from '../data/seoLandingPages';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}>{children}</motion.div>;

const advisoryCards = [
  {
    value: 'buy',
    label: 'Buy Property',
    badge: 'Residential & Commercial',
    desc: 'Explore luxury apartments, villas, plots, and penthouses with verified pricing.',
    icon: FiHome,
  },
  {
    value: 'rent',
    label: 'Rent Property',
    badge: 'Verified Listings',
    desc: 'High-end executive leases and premium family residences in prime sectors.',
    icon: FiKey,
  },
  {
    value: 'sell',
    label: 'Sell Property',
    badge: 'Owner Advisory',
    desc: 'Position your property directly to high-intent buyers, NRI investors, and funds.',
    icon: FiTag,
  },
  {
    value: 'agent',
    label: 'Talk to Advisor',
    badge: 'Private Consultation',
    desc: 'Get unbiased project analysis, RERA legal verification, and site visit scheduling.',
    icon: FiUser,
  },
];

export default function Home() {
  const { home } = useHome();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } }); timeline.to('.name-reveal', { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }); timeline.to('.blur-in', { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 }, '-=1'); }, []);
  return <div className="w-full">
    <section className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#090b10] px-6 pb-24 pt-32 text-center text-white">
      <video ref={videoRef} src={home.heroVideo} poster="/video-poster.jpg" preload="metadata" autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 z-0 h-full w-full object-cover" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.2)_0%,rgba(8,10,15,0.34)_38%,rgba(8,10,15,0.92)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
        <p className="blur-in mb-5 translate-y-5 text-[10px] uppercase tracking-[0.28em] text-white/75 opacity-0 md:text-xs">A&amp;G Realtors · Noida &amp; Delhi NCR</p>
        <p className="blur-in mb-7 inline-flex translate-y-5 items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-2 text-xs text-white/90 opacity-0 backdrop-blur-md md:px-5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d9a441]" aria-hidden="true" />
          {home.heroTitle.replace('\n', ' ')}
        </p>
        <h1 className="name-reveal max-w-5xl translate-y-12 text-5xl leading-[0.98] text-white opacity-0 sm:text-6xl md:text-8xl lg:text-8xl">
          Property in <span className="font-display italic text-[#e0b04f]">Noida.</span>
          <span className="mt-2 block font-body text-4xl font-medium leading-[1.04] sm:text-5xl md:text-7xl">A more considered move.</span>
        </h1>
        <p className="blur-in mt-7 max-w-2xl translate-y-5 text-sm leading-relaxed text-white/80 opacity-0 sm:text-base md:text-lg">{home.heroDescription}</p>
        <div className="blur-in mt-9 flex translate-y-5 flex-col items-center gap-3 opacity-0 sm:flex-row">
          <Link to="/projects" className="group inline-flex min-h-12 items-center gap-5 border border-white/75 bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.13em] text-black transition-colors hover:bg-transparent hover:text-white">
            {home.heroPrimaryCta}<span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
          <Link to="/contact" className="inline-flex min-h-12 items-center border border-white/30 bg-black/20 px-6 py-3 text-xs uppercase tracking-[0.13em] text-white backdrop-blur-sm transition-colors hover:border-white/80">Talk to an advisor</Link>
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-5 z-10 flex max-w-[1400px] flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4 text-[9px] uppercase tracking-[0.2em] text-white/65 md:inset-x-10 md:bottom-6 md:mx-auto md:text-[10px]">
        <span>Residential · Commercial · Advisory</span>
        <span>Noida · Greater Noida · Delhi NCR</span>
      </div>
    </section>

    {/* Luxury Advisory Section */}
    <section className="border-b border-stroke bg-bg py-24">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <FadeIn>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{home.advisoryEyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-display md:text-5xl">{home.advisoryTitle}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">{home.advisoryDescription}</p>
            </div>
            <Link to="/property-finder" className="shrink-0 rounded-full bg-text-primary px-8 py-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-bg transition-transform hover:scale-105">
              {home.advisoryCta}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {advisoryCards.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.value}
                  to={`/property-finder?requirement=${item.value}`}
                  className="group relative flex flex-col justify-between rounded-3xl border border-stroke bg-surface p-7 transition-all duration-300 hover:border-text-primary hover:shadow-xl hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-bg border border-stroke flex items-center justify-center text-text-primary text-xl transition-all duration-300 group-hover:scale-110 group-hover:border-text-primary shadow-sm">
                        <Icon />
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg border border-stroke text-muted transition-all duration-300 group-hover:bg-text-primary group-hover:text-bg group-hover:border-text-primary shadow-sm">
                        <FiArrowUpRight className="text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium block mb-1.5">
                      {item.badge}
                    </span>
                    <h3 className="text-2xl font-display text-text-primary leading-snug group-hover:underline">
                      {item.label}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stroke/60 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-text-primary">
                    <span>Explore Options</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>

    <section className="overflow-hidden border-b border-stroke/50 bg-bg py-24"><div className="mx-auto max-w-[1200px] px-6 md:px-10"><FadeIn><div className="max-w-3xl"><h2 className="mb-6 text-4xl font-display md:text-5xl">{home.introTitle}</h2><div className="space-y-6 text-lg leading-relaxed text-muted">{home.introParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></FadeIn></div></section>
    <section className="overflow-hidden bg-bg py-24"><div className="mx-auto max-w-[1200px] px-6 md:px-10"><FadeIn><div className="mb-16 flex items-center justify-center gap-4"><div className="hidden h-px w-8 bg-stroke md:block" /><span className="text-center text-xs uppercase tracking-[0.3em] text-muted">{home.featuredEyebrow}</span><div className="hidden h-px w-8 bg-stroke md:block" /></div></FadeIn><div className="grid gap-12 md:grid-cols-2">{home.featured.map((item, index) => <FadeIn key={item.slug} delay={index * 0.1}><article className="flex flex-col overflow-hidden rounded-3xl border border-stroke bg-surface"><div className="aspect-[4/3] overflow-hidden"><img src={item.image} alt={`${item.title} ${item.kicker}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" /></div><div className="flex flex-1 flex-col p-8"><p className="mb-2 text-xs uppercase tracking-wider text-muted">{item.kicker}</p><h3 className="mb-4 text-3xl font-display">{item.title}</h3><p className="mb-6 flex-1 text-muted">{item.description}</p><strong className="text-sm">Key Highlights:</strong><ul className="mt-2 space-y-1 text-sm text-muted">{item.highlights.map((highlight) => <li key={highlight}>- {highlight}</li>)}</ul><Link to={`/projects/${canonicalProjectAliases[item.slug] || item.slug}`} className="mt-8 rounded-full border border-stroke px-6 py-3 text-center text-sm transition-colors hover:bg-text-primary hover:text-bg">View Project Details</Link></div></article></FadeIn>)}</div></div></section>
    <section className="overflow-hidden border-y border-stroke/50 bg-surface py-24"><div className="mx-auto max-w-[1200px] px-6 md:px-10"><FadeIn><h2 className="mb-16 text-center text-4xl font-display md:text-5xl">{home.whyTitle}</h2></FadeIn><div className="grid gap-12 md:grid-cols-3">{home.whyItems.map((item, index) => <FadeIn key={item.title} delay={index * 0.1}><div><h3 className="mb-3 text-xl font-medium">{item.title}</h3><p className="text-sm leading-relaxed text-muted">{item.desc}</p></div></FadeIn>)}</div></div></section>
    <section className="overflow-hidden border-b border-stroke/50 bg-bg py-24"><div className="mx-auto max-w-[1200px] px-6 md:px-10"><FadeIn><h2 className="mb-16 text-4xl font-display md:text-5xl">{home.categoriesTitle}</h2></FadeIn><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{home.categories.map((item, index) => <FadeIn key={item.title} delay={index * 0.1}><Link to={item.link} className="group block h-full rounded-3xl border border-stroke p-8 transition-all hover:-translate-y-1 hover:bg-surface"><h3 className="mb-4 text-2xl font-display">{item.title}</h3><p className="mb-8 text-sm text-muted">{item.desc}</p><span className="text-xs uppercase tracking-widest text-text-primary inline-flex items-center gap-2 group-hover:underline">Explore <FiArrowRight className="transition-transform group-hover:translate-x-1" /></span></Link></FadeIn>)}</div></div></section>
    <section className="overflow-hidden bg-bg py-24"><div className="mx-auto max-w-[1200px] px-6 md:px-10"><FadeIn><div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><h2 className="mb-4 text-4xl font-display md:text-5xl">{home.servicesTitle}</h2><p className="max-w-lg text-muted">{home.servicesDescription}</p></div><Link to="/services" className="rounded-full border border-stroke px-6 py-3 text-sm hover:bg-text-primary hover:text-bg transition-colors">View All Services</Link></div></FadeIn><div className="grid gap-x-12 gap-y-8 md:grid-cols-2">{home.serviceItems.map((item, index) => <FadeIn key={item.title} delay={index * 0.1}><div className="flex gap-4"><div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-text-primary" /><div><h3 className="mb-1 text-lg font-medium">{item.title}</h3><p className="text-sm text-muted">{item.desc}</p></div></div></FadeIn>)}</div></div></section>
    {home.testimonials.length > 0 && <section className="overflow-hidden border-y border-stroke/50 bg-surface py-24"><div className="mx-auto max-w-[1200px] px-6 md:px-10"><FadeIn><h2 className="mb-16 text-center text-4xl font-display md:text-5xl">{home.testimonialsTitle}</h2></FadeIn><div className="grid gap-8 md:grid-cols-3">{home.testimonials.map((item, index) => <FadeIn key={item.author} delay={index * 0.1}><div className="flex h-full flex-col justify-between rounded-3xl border border-stroke bg-bg p-8"><p className="mb-8 text-sm leading-relaxed text-muted">&quot;{item.quote}&quot;</p><div className="text-sm font-medium">- {item.author}</div></div></FadeIn>)}</div></div></section>}
    <section className="overflow-hidden bg-bg py-24"><div className="mx-auto max-w-[800px] px-6 md:px-10"><FadeIn><h2 className="mb-16 text-center text-4xl font-display md:text-5xl">{home.faqTitle}</h2></FadeIn><div className="space-y-8">{home.faqs.map((item, index) => <FadeIn key={item.q} delay={index * 0.1}><div className="border-b border-stroke pb-6"><h3 className="mb-3 text-lg font-medium">{item.q}</h3><p className="text-sm text-muted">{item.a}</p></div></FadeIn>)}</div></div></section>
    <section className="overflow-hidden bg-surface border-t border-stroke py-24 text-center"><div className="mx-auto max-w-[800px] px-6"><FadeIn><h2 className="mb-6 text-4xl font-display text-text-primary md:text-6xl">{home.ctaTitle}</h2><p className="mb-10 text-lg text-muted">{home.ctaDescription}</p><Link to="/contact" className="inline-block rounded-full bg-text-primary px-10 py-4 text-sm font-medium text-bg transition-all hover:scale-105">{home.ctaLabel}</Link></FadeIn></div></section>
  </div>;
}
