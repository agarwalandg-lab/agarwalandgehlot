import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { projects } from '../data/projects';

type GalleryImage = { src: string; label: string };

const projectGalleries: Record<string, GalleryImage[]> = {
  'clove-county-sector-151-noida': ['clove building.webp', 'clove ariel building.jpg', 'clove garden.webp', 'clove outside sitting.jpg', 'clove map.jpeg'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'ivory-county-sector-115-noida': ['IVORY BANNER.webp', 'ivory building.webp', 'ivory gaarden.png', 'ivory garden.webp', 'ivory sitting.jpg', 'ivory map.webp'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'jade-county-wave-city-ghaziabad': ['jade building.webp', 'jade ariel garden.jpg', 'jade garden.jpg', 'jade map.webp'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'county-107-sector-107-noida': ['107 building.jpg', '107 balcony view.jpg', '107 map.webp'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'cleo-county-sector-121-noida': ['cleo.webp', 'cleo building.jpg', 'cleo garden.jpeg', 'cleo interior.jpg', 'cleo map.jpg'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'coco-county-greater-noida-west': ['coco building.avif', 'coco club house.webp', 'coco locationmap.jpg', 'mapcoco.jpg'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'ivy-county-sector-75-noida': ['ivy building.webp', 'ivy inside.webp'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'cherry-county-greater-noida-west': ['cherry building.webp', 'cherry aminities.jpg', 'cherry garden.jpeg', 'cherry map.jpeg'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'olive-county-vasundhara-ghaziabad': ['olive building.jpg', 'olive garden.jpg', 'olive map.jpg'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'the-center-court-sector-88a-gurugram': ['center court.webp', 'center court front elevation.webp', 'center court club house.jpeg', 'center court gym.webp', 'center court swimming pool.jpg', 'center court location map.jpg'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
  'county-courtyard-netaji-subhash-place': ['countycourtyard.webp', 'courtyard.png'].map((name) => ({ src: `/project-details/${name}`, label: name.replace(/\.[^.]+$/, '') })),
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const gallery = project ? projectGalleries[project.slug] || [{ src: project.image, label: project.title }] : [];

  useEffect(() => {
    if (!project) return;
    document.title = project.seo.title;
    const description = document.querySelector('meta[name="description"]') ?? document.head.appendChild(document.createElement('meta'));
    description.setAttribute('name', 'description');
    description.setAttribute('content', project.seo.description);
  }, [project]);

  useEffect(() => {
    if (activeImage === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null);
      if (event.key === 'ArrowLeft') setActiveImage((current) => current === null ? null : (current - 1 + gallery.length) % gallery.length);
      if (event.key === 'ArrowRight') setActiveImage((current) => current === null ? null : (current + 1) % gallery.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [activeImage, gallery.length]);

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <main className="w-full overflow-hidden pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Link to="/projects" className="mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text-primary"><span aria-hidden="true">&larr;</span> Back to Projects</Link>
        <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl border border-stroke bg-surface"><img src={project.image} alt={project.title} className="aspect-[4/3] h-full w-full object-cover" /></div>
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">{project.type}</p>
            <h1 className="mb-5 text-5xl font-display leading-tight md:text-7xl">{project.title}</h1>
            <p className="mb-6 text-lg leading-relaxed text-muted">{project.description}</p>
            <div className="grid gap-4 border-y border-stroke py-5 text-sm sm:grid-cols-2">{[['Location', project.location], ['Configuration', project.configurations], ['Status', project.status], ['Price', project.price]].map(([label, value]) => <div key={label}><p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p><p className="mt-1 text-text-primary">{value}</p></div>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/contact" className="rounded-full bg-text-primary px-6 py-3 text-sm text-bg transition-transform hover:scale-105">View Price &amp; Inventory</Link><Link to="/contact" className="rounded-full border border-stroke px-6 py-3 text-sm text-text-primary">Book a Site Visit</Link><Link to="/contact" className="rounded-full border border-stroke px-6 py-3 text-sm text-text-primary">Download Brochure</Link></div>
          </div>
        </section>

        <section className="mt-24 max-w-4xl border-t border-stroke pt-12"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Project Overview</p><h2 className="mb-6 text-4xl font-display md:text-5xl">A considered address in {project.location.split(',')[0]}.</h2><p className="text-lg leading-relaxed text-muted">{project.overview}</p></section>

        <section className="mt-20"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Quick Project Facts</p><div className="grid gap-px overflow-hidden rounded-2xl border border-stroke bg-stroke sm:grid-cols-2 lg:grid-cols-3">{[{ label: 'Developer', value: project.developer }, { label: 'Promoter', value: project.promoter }, { label: 'Category', value: project.category }, { label: 'Possession', value: project.possession }, { label: 'RERA', value: project.rera }, { label: 'Price', value: project.price }, ...project.facts.map((fact) => { const [label, ...value] = fact.split(': '); return { label, value: value.join(': ') }; })].map((fact) => <div key={`${fact.label}-${fact.value}`} className="bg-bg p-5"><p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted">{fact.label}</p><p className="text-sm leading-relaxed text-text-primary">{fact.value}</p></div>)}</div></section>

        <section className="mt-20"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Project Highlights</p><div className="grid gap-5 md:grid-cols-2">{project.highlights.map((highlight) => <div key={highlight} className="border-l-2 border-accent pl-5 text-lg text-text-primary">{highlight}</div>)}</div></section>

        <section className="mt-20 grid gap-12 lg:grid-cols-2"><div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Configurations</p><div className="space-y-3">{project.sizes.map((size) => <div key={size} className="border-b border-stroke py-4 text-sm text-text-primary">{size}</div>)}</div></div><div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Current Price &amp; Availability</p><div className="rounded-2xl border border-stroke p-6"><p className="text-2xl font-display">{project.price}</p><p className="mt-4 text-sm leading-relaxed text-muted">Contact A&amp;G for current inventory, latest pricing, available towers, floors, facing and unit-level details.</p><Link to="/contact" className="mt-6 inline-block rounded-full border border-stroke px-6 py-3 text-sm text-text-primary">Request Current Price</Link></div></div></section>

        <section className="mt-20"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Amenities</p><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{project.amenities.map((group) => <div key={group.category} className="border-t border-stroke pt-5"><h3 className="mb-3 text-xl font-display">{group.category}</h3><ul className="space-y-2 text-sm text-muted">{group.items.map((item) => <li key={item}>- {item}</li>)}</ul></div>)}</div></section>

        <section className="mt-20" id="gallery">
          <div className="mb-7 flex items-end justify-between"><div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Project Gallery</p><h2 className="text-4xl font-display md:text-5xl">Explore {project.title}</h2></div><p className="hidden text-xs uppercase tracking-[0.15em] text-muted sm:block">Select an image to enlarge</p></div>
          <div className="grid auto-rows-[180px] gap-3 sm:grid-cols-2 sm:auto-rows-[240px] lg:grid-cols-3">
            {gallery.map((image, index) => <button key={image.src} type="button" onClick={() => setActiveImage(index)} className={`group relative overflow-hidden bg-surface text-left ${index === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}`} aria-label={`Open ${image.label}`}><img src={image.src} alt={`${project.title} - ${image.label}`} loading={index === 0 ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-xs capitalize text-white opacity-0 transition-opacity group-hover:opacity-100">{image.label}</span></button>)}
          </div>
        </section>

        <section className="mt-20 grid gap-12 border-t border-stroke pt-12 lg:grid-cols-2"><div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">The A&amp;G View</p><h2 className="mb-5 text-4xl font-display">A clearer way to evaluate it.</h2><h3 className="mb-3 text-xl">What We Like</h3><ul className="mb-8 space-y-3 text-muted">{project.highlights.slice(0, 4).map((item) => <li key={item}>- {item}</li>)}</ul><h3 className="mb-3 text-xl">Things to Consider</h3><ul className="space-y-3 text-muted">{project.considerations.map((item) => <li key={item}>- {item}</li>)}</ul></div><div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Best Suited For</p><p className="text-2xl font-display leading-tight">{project.bestSuitedFor}</p><p className="mt-10 mb-4 text-xs uppercase tracking-[0.3em] text-muted">Compare With</p><div className="flex flex-wrap gap-3">{project.similar.map((similar) => <span key={similar} className="rounded-full border border-stroke px-4 py-2 text-sm text-muted">{similar}</span>)}</div></div></section>

        <section className="mt-20"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">RERA &amp; Legal Information</p><div className="rounded-2xl border border-stroke p-6 text-sm leading-relaxed text-muted"><p><strong className="text-text-primary">Project RERA:</strong> {project.rera}</p><p className="mt-2"><strong className="text-text-primary">Promoter:</strong> {project.promoter}</p><p className="mt-5">Buyers should independently review the latest project information, approvals and documentation on the relevant RERA portal before making a purchase decision.</p></div></section>

        <section className="mt-20"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Frequently Asked Questions</p><div className="divide-y divide-stroke border-y border-stroke">{project.faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="cursor-pointer list-none pr-6 text-lg text-text-primary">{faq.question}<span className="float-right text-muted transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{faq.answer}</p></details>)}</div></section>

        <section className="mt-20 border-y border-stroke py-12"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Need Help Making a Decision?</p><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><h2 className="text-4xl font-display md:text-5xl">Use the right advice at the right stage.</h2><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted"><Link to="/services/property-consultation">Property Consultation</Link><Link to="/services/property-investment">Investment Advisory</Link><Link to="/services/home-loan-assistance">Home Loan Assistance</Link><Link to="/services/legal-documentation">Legal Guidance</Link></div></div><Link to="/services" className="shrink-0 bg-text-primary px-6 py-4 text-xs uppercase tracking-[0.14em] text-bg">Explore A&amp;G Services</Link></div></section>

        <section className="mt-20 border-t border-stroke pt-12"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Want the Complete Project Details?</p><h2 className="mb-4 text-4xl font-display md:text-5xl">Get the latest project information.</h2><p className="max-w-2xl text-lg text-muted">Get the latest brochure, floor plans, pricing and available inventory directly from A&amp;G.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/contact" className="rounded-full bg-text-primary px-6 py-3 text-sm text-bg">Download Brochure</Link><Link to="/contact" className="rounded-full border border-stroke px-6 py-3 text-sm text-text-primary">Request Price Sheet</Link></div></section>
      </div>
      {activeImage !== null && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label={`${project.title} image viewer`} onClick={() => setActiveImage(null)}>
        <button type="button" onClick={() => setActiveImage(null)} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white" aria-label="Close image viewer"><FiX size={20} /></button>
        {gallery.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage - 1 + gallery.length) % gallery.length); }} className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white md:left-8" aria-label="Previous image"><FiChevronLeft size={24} /></button>}
        <figure className="max-h-[88vh] max-w-[86vw]" onClick={(event) => event.stopPropagation()}><img src={gallery[activeImage].src} alt={`${project.title} - ${gallery[activeImage].label}`} className="max-h-[82vh] max-w-full object-contain" /><figcaption className="mt-3 text-center text-xs capitalize tracking-[0.12em] text-white/70">{gallery[activeImage].label} · {activeImage + 1} / {gallery.length}</figcaption></figure>
        {gallery.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage + 1) % gallery.length); }} className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white md:right-8" aria-label="Next image"><FiChevronRight size={24} /></button>}
      </div>}
    </main>
  );
}
