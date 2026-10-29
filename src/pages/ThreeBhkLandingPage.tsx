import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  CheckCircle2,
  Compass,
  IndianRupee,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { projects } from '../data/projects';

const featuredSlugs = [
  'ivory-county-sector-115-noida',
  'cleo-county-sector-121-noida',
  'ivy-county-sector-75-noida',
];

const featuredProjects = featuredSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const sectorNotes = [
  {
    sector: 'Sector 75',
    character: 'Established & connected',
    detail: 'A practical choice for buyers who prefer a completed community and established daily conveniences.',
    project: 'Ivy County',
  },
  {
    sector: 'Sector 115',
    character: 'New luxury living',
    detail: 'Suited to buyers comparing larger new-build layouts, landscaped planning and phase-wise delivery.',
    project: 'Ivory County',
  },
  {
    sector: 'Sector 121',
    character: 'Ready community',
    detail: 'An established residential pocket with a lived-in community and ready-to-move resale options.',
    project: 'Cleo County',
  },
];

const buyerChecklist = [
  {
    icon: Compass,
    title: 'Start with your routine',
    text: 'Shortlist sectors around your actual office, school and family routes—not only a map radius.',
  },
  {
    icon: BedDouble,
    title: 'Compare usable space',
    text: 'Review the carpet area, room dimensions, utility space, balconies and storage in the exact layout.',
  },
  {
    icon: IndianRupee,
    title: 'Calculate the full cost',
    text: 'Ask for a dated cost sheet covering parking, floor charges, maintenance, taxes and transfer costs.',
  },
  {
    icon: ShieldCheck,
    title: 'Verify before booking',
    text: 'Match the tower, phase, approvals and RERA record to the home you are actually considering.',
  },
];

const faqs = [
  {
    question: 'Which areas are practical for a 3 BHK flat in Noida?',
    answer:
      'Sector 75 and Sector 121 suit buyers who prefer established communities, while Sector 115 offers newer luxury developments. The right choice depends on your commute, budget, possession preference and the specific unit available.',
  },
  {
    question: 'Can I find ready-to-move 3 BHK flats in Noida?',
    answer:
      'Yes. Established communities such as Ivy County and Cleo County may have ready-to-move or resale inventory. Availability changes by tower, floor and owner, so request a current unit-level shortlist.',
  },
  {
    question: 'What should I compare besides the quoted price?',
    answer:
      'Compare carpet area, room sizes, balcony and utility space, parking, recurring maintenance, project status, documents and the all-inclusive acquisition cost. A lower base price does not always mean a lower final cost.',
  },
  {
    question: 'How does A&G help with my 3 BHK search?',
    answer:
      'A&G can prepare a focused shortlist, share available floor plans and cost sheets, arrange site visits and help you organise the questions needed for independent legal and financial due diligence.',
  },
];

const whatsappUrl = `https://wa.me/919654322224?text=${encodeURIComponent(
  'Hi A&G Realtors, I am looking for a 3 BHK flat in Noida. Please share a current shortlist based on my budget and preferred location.',
)}`;

function projectHref(slug: string) {
  if (slug === 'ivory-county-sector-115-noida') return '/projects/ivory-county';
  return `/projects/${slug}`;
}

export default function ThreeBhkLandingPage() {
  return (
    <div className="overflow-hidden bg-[#f6f2ea] text-[#1d1b18]">
      <section className="relative min-h-[760px] border-b border-[#d9d1c4] pt-32 lg:min-h-[800px] lg:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(172,138,80,0.16),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(89,116,104,0.12),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 pb-20 md:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16">
          <div>
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6e6559]">
              <span className="h-px w-9 bg-[#9e855c]" />
              Curated homes across Noida
            </div>
            <h1 className="max-w-3xl font-display text-[clamp(3.5rem,7.4vw,7.4rem)] leading-[0.86] tracking-[-0.035em]">
              Find a 3 BHK that fits your life.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-[#625b52] md:text-lg">
              Compare spacious 3 BHK flats in Noida by location, layout and possession status—then request a current, unit-level shortlist from A&amp;G.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/property-finder"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1b18] px-7 py-4 text-sm font-semibold text-[#f7f2e9] transition-transform hover:-translate-y-0.5"
              >
                Build my shortlist <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a9a094] px-7 py-4 text-sm font-semibold transition-colors hover:bg-white/60"
              >
                <MessageCircle size={16} /> WhatsApp an advisor
              </a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#d9d1c4] pt-6">
              {[
                ['3', 'Noida communities'],
                ['Ready + new', 'Possession choices'],
                ['Unit-level', 'Comparison support'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl md:text-3xl">{value}</p>
                  <p className="mt-1 text-[10px] uppercase leading-4 tracking-[0.16em] text-[#746c62]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] pb-12 pl-5 md:pl-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#d9d1c4] shadow-[0_30px_80px_rgba(50,42,30,0.18)]">
              <img
                src="/cover/ivory-county.webp"
                alt="Luxury 3 BHK apartments at Ivory County in Noida"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Featured new-build option</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl">Ivory County</p>
                    <p className="mt-1 text-sm text-white/75">Sector 115 · 3 BHK &amp; 3 BHK + Utility</p>
                  </div>
                  <Link to="/projects/ivory-county" aria-label="Explore Ivory County" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105">
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-[48%] overflow-hidden rounded-2xl border-4 border-[#f6f2ea] bg-[#d9d1c4] shadow-xl">
              <img src="/cover/ivy-county.webp" alt="Ready-to-move 3 BHK homes at Ivy County" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute right-4 top-8 rounded-2xl border border-white/50 bg-[#f6f2ea]/90 p-4 shadow-lg backdrop-blur-md">
              <Sparkles size={18} className="text-[#8d6f3d]" />
              <p className="mt-2 text-xs font-semibold">Curated, not crowded</p>
              <p className="mt-1 max-w-[145px] text-[11px] leading-4 text-[#6d655b]">A focused shortlist built around your priorities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1f2924] py-8 text-[#f5f0e7]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 text-[11px] font-medium uppercase tracking-[0.16em] md:px-10">
          {['Current availability on request', 'Floor plan comparison', 'RERA-first due diligence', 'Private site visits'].map((item) => (
            <span key={item} className="flex items-center gap-2 text-white/78"><Check size={14} className="text-[#d5b97d]" />{item}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#756b5f]">The current shortlist</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.94] md:text-6xl">Three distinct ways to live in Noida.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#665e55]">
              Compare a new luxury development with completed, lived-in communities. Each project card reflects the information already published in A&amp;G&apos;s project catalogue; live units and pricing still require confirmation.
            </p>
          </div>

          <div className="space-y-6">
            {featuredProjects.map((project, index) => (
              <article key={project.slug} className="group overflow-hidden rounded-[1.75rem] border border-[#d8d0c4] bg-[#fbf8f2]">
                <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-[290px] overflow-hidden">
                    <img src={project.image} alt={`${project.title} in ${project.location}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                    <span className="absolute left-5 top-5 rounded-full bg-[#f7f2e9]/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur">0{index + 1}</span>
                  </div>
                  <div className="flex flex-col p-7 md:p-9">
                    <div className="flex items-center gap-2 text-xs text-[#756c61]"><MapPin size={14} /> {project.location}</div>
                    <h3 className="mt-4 font-display text-4xl">{project.title}</h3>
                    <p className="mt-3 text-sm font-medium text-[#3f3a34]">{project.status}</p>
                    <p className="mt-4 text-sm leading-6 text-[#6a6258]">{project.description}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#ded7cc] py-5 text-xs">
                      <div>
                        <p className="uppercase tracking-[0.14em] text-[#8a8175]">Layouts</p>
                        <p className="mt-2 font-medium">{project.configurations}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.14em] text-[#8a8175]">Price</p>
                        <p className="mt-2 font-medium">{project.price}</p>
                      </div>
                    </div>
                    <Link to={projectHref(project.slug)} className="mt-6 inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-[0.13em]">
                      View project details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d6cec2] bg-[#e9e1d5]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-28">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#756b5f]">Location lens</p>
            <h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">Choose the neighbourhood before the view.</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#625b52]">A 3 BHK purchase becomes much easier when the sector matches the way your week actually works.</p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-[#cfc4b6] bg-[#cfc4b6] lg:grid-cols-3">
            {sectorNotes.map((item, index) => (
              <article key={item.sector} className="min-h-[310px] bg-[#f6f2ea] p-8 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl text-[#9b8664]">{String(index + 1).padStart(2, '0')}</span>
                  <Building2 size={20} className="text-[#8b8174]" />
                </div>
                <h3 className="mt-8 font-display text-3xl">{item.sector}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#756b5f]">{item.character}</p>
                <p className="mt-5 text-sm leading-6 text-[#665e55]">{item.detail}</p>
                <p className="mt-7 text-xs"><span className="text-[#8b8174]">Explore:</span> {item.project}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#756b5f]">A smarter comparison</p>
            <h2 className="mt-5 max-w-2xl font-display text-5xl leading-[0.95] md:text-6xl">Four checks that matter more than brochure claims.</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {buyerChecklist.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-[#d9d1c4] bg-[#fbf8f2] p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8dfd1]"><Icon size={18} /></div>
                  <h3 className="mt-5 font-display text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#686056]">{text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] bg-[#1f2924] p-8 text-[#f5f0e7] md:p-11">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4ba82]">What you receive</p>
            <h3 className="mt-5 font-display text-4xl leading-tight">A shortlist you can actually act on.</h3>
            <p className="mt-5 text-sm leading-7 text-white/65">Tell us your preferred sectors, budget and move-in timeline. We&apos;ll organise the next step around current availability.</p>
            <ul className="mt-8 space-y-4">
              {[
                'A concise set of matching 3 BHK options',
                'Latest available floor plans and cost sheets',
                'Side-by-side notes on status and location',
                'Coordinated site visits for selected homes',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/80"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#d4ba82]" />{item}</li>
              ))}
            </ul>
            <Link to="/contact" className="mt-10 inline-flex w-full items-center justify-between rounded-full bg-[#f5f0e7] px-6 py-4 text-sm font-semibold text-[#1f2924] transition-transform hover:-translate-y-0.5">
              Request my shortlist <ArrowRight size={16} />
            </Link>
            <p className="mt-4 text-center text-[10px] leading-4 text-white/45">No promise of availability or price is made until the specific unit is confirmed in writing.</p>
          </aside>
        </div>
      </section>

      <section className="border-t border-[#d9d1c4] bg-[#fbf8f2]">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 md:px-10 md:py-28 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#756b5f]">Questions, answered</p>
            <h2 className="mt-5 font-display text-5xl leading-none">Before you shortlist.</h2>
          </div>
          <div className="border-t border-[#d9d1c4]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group border-b border-[#d9d1c4] py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium">
                  <span>{faq.question}</span>
                  <span className="mt-0.5 text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-7 text-[#686056]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#c5a66d] px-6 py-24 md:px-10 md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#1d1b18_1px,transparent_0)] [background-size:22px_22px]" />
        <div className="relative mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#453b2b]">Your next move</p>
            <h2 className="mt-5 max-w-3xl font-display text-5xl leading-[0.92] md:text-7xl">Let&apos;s narrow Noida down to the right front door.</h2>
          </div>
          <Link to="/property-finder" className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#1d1b18] px-7 py-4 text-sm font-semibold text-[#f7f2e9] transition-transform hover:-translate-y-0.5">
            Find my 3 BHK <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
