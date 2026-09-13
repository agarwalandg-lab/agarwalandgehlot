import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiHeart, FiSearch, FiX } from 'react-icons/fi';
import { Project, projects } from '../data/projects';

const cities = ['All Cities', ...Array.from(new Set(projects.map((project) => {
  const parts = project.location.split(',');
  return parts[parts.length - 1].trim() || project.location;
})))];
const developers = ['All Developers', ...Array.from(new Set(projects.map((project) => project.developer)))];
const configurations = ['All Configurations', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Penthouse', 'Duplex', 'Office', 'Retail'];
const inputClass = 'h-12 w-full border border-stroke bg-bg px-4 text-sm text-text-primary outline-none focus:border-text-primary';

function ProjectCard({ project, selected, saved, onCompare, onSave }: { project: Project; selected: boolean; saved: boolean; onCompare: () => void; onSave: () => void }) {
  const ready = /ready|completed/i.test(`${project.status} ${project.type}`);
  return <article className="group border-t border-stroke pt-5">
    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
      <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}><img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /></Link>
      <span className="absolute left-4 top-4 bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">{ready ? 'Ready to Move' : project.status}</span>
      <button type="button" onClick={onSave} aria-label={saved ? `Remove ${project.title} from saved projects` : `Save ${project.title}`} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"><FiHeart className={saved ? 'fill-current' : ''} /></button>
    </div>
    <div className="py-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{project.developer}</p>
      <Link to={`/projects/${project.slug}`}><h2 className="mt-2 text-3xl font-display text-text-primary">{project.title}</h2></Link>
      <p className="mt-2 text-sm text-muted">{project.location}</p>
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-stroke py-4 text-sm">
        <div><span className="block text-[10px] uppercase tracking-[0.15em] text-muted">Configuration</span><span className="mt-1 block">{project.configurations}</span></div>
        <div><span className="block text-[10px] uppercase tracking-[0.15em] text-muted">Starting Price</span><span className="mt-1 block">{project.price}</span></div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
      <div className="mt-5 flex items-center gap-2">
        <Link to={`/projects/${project.slug}`} className="flex-1 bg-text-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-bg">View Project</Link>
        <button type="button" onClick={onCompare} className={`flex items-center gap-2 border px-4 py-3 text-xs uppercase tracking-[0.12em] ${selected ? 'border-text-primary bg-surface' : 'border-stroke text-muted'}`}>{selected && <FiCheck />} Compare</button>
      </div>
    </div>
  </article>;
}

export default function ProjectsListing() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [developer, setDeveloper] = useState('All Developers');
  const [status, setStatus] = useState('All Statuses');
  const [configuration, setConfiguration] = useState('All Configurations');
  const [sort, setSort] = useState('Recommended');
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('ag-saved-projects') || '[]'); } catch { return []; } });

  useEffect(() => localStorage.setItem('ag-saved-projects', JSON.stringify(saved)), [saved]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = projects.filter((project) => {
      const text = [project.title, project.location, project.developer, project.category, project.status, project.configurations, project.type].join(' ').toLowerCase();
      const statusMatch = status === 'All Statuses' || (status === 'New Launch' ? /new/i.test(project.type) : status === 'Under Construction' ? /under|development/i.test(`${project.status} ${project.type}`) : /ready|completed/i.test(`${project.status} ${project.type}`));
      return (!query || text.includes(query)) && (city === 'All Cities' || project.location.endsWith(city)) && (developer === 'All Developers' || project.developer === developer) && statusMatch && (configuration === 'All Configurations' || project.configurations.toLowerCase().includes(configuration.toLowerCase()));
    });
    return sort === 'Possession' ? [...matches].sort((a, b) => a.possession.localeCompare(b.possession)) : sort === 'Newest' ? [...matches].sort((a, b) => Number(/new|under/i.test(`${b.type} ${b.status}`)) - Number(/new|under/i.test(`${a.type} ${a.status}`))) : matches;
  }, [search, city, developer, status, configuration, sort]);

  const clear = () => { setSearch(''); setCity('All Cities'); setDeveloper('All Developers'); setStatus('All Statuses'); setConfiguration('All Configurations'); setSort('Recommended'); };
  const toggleCompare = (slug: string) => setCompare((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : current);
  const compared = projects.filter((project) => compare.includes(project.slug));
  const rows: [string, (project: Project) => string][] = [['Developer', (p) => p.developer], ['Location', (p) => p.location], ['Price', (p) => p.price], ['Configuration', (p) => p.configurations], ['Status', (p) => p.status], ['Possession', (p) => p.possession], ['RERA', (p) => p.rera], ['A&G View', (p) => p.bestSuitedFor]];

  return <main className="min-h-screen bg-bg pb-28 pt-32">
    <section className="mx-auto max-w-[1400px] px-6 md:px-10">
      <div className="border-b border-stroke pb-14 text-center"><p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">A&amp;G Portfolio</p><h1 className="mx-auto max-w-4xl text-5xl font-display leading-tight md:text-7xl">Find a Home That Fits Your Vision.</h1><p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">Explore a curated portfolio of premium residences and investment opportunities across Delhi NCR.</p><Link to="/projects/gallery" className="mt-7 inline-block border-b border-text-primary pb-1 text-xs uppercase tracking-[0.18em]">Open Project Gallery</Link></div>
      <div className="sticky top-20 z-30 mt-8 border border-stroke bg-bg/95 p-4 backdrop-blur-xl">
        <div className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} pl-11`} placeholder="Search project, sector, developer or location" /></div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select value={city} onChange={(event) => setCity(event.target.value)} className={inputClass}>{cities.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={developer} onChange={(event) => setDeveloper(event.target.value)} className={inputClass}>{developers.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={configuration} onChange={(event) => setConfiguration(event.target.value)} className={inputClass}>{configurations.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}><option>All Statuses</option><option>New Launch</option><option>Under Construction</option><option>Ready to Move</option></select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className={inputClass}><option>Recommended</option><option>Newest</option><option>Possession</option></select>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-stroke py-7"><p className="text-sm">{filtered.length} {filtered.length === 1 ? 'Project' : 'Projects'} Found</p><button type="button" onClick={clear} className="text-xs uppercase tracking-[0.15em] text-muted hover:text-text-primary">Clear All Filters</button></div>
      {filtered.length ? <div className="mt-8 grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => <ProjectCard key={project.slug} project={project} selected={compare.includes(project.slug)} saved={saved.includes(project.slug)} onCompare={() => toggleCompare(project.slug)} onSave={() => setSaved((current) => current.includes(project.slug) ? current.filter((item) => item !== project.slug) : [...current, project.slug])} />)}</div> : <div className="py-28 text-center"><h2 className="text-3xl font-display">No matching projects</h2><p className="mt-3 text-muted">Try removing a filter or searching another location.</p></div>}
    </section>
    {compare.length > 0 && <button type="button" onClick={() => setShowCompare(true)} className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 bg-text-primary px-7 py-4 text-sm font-medium text-bg shadow-2xl">Compare {compare.length} {compare.length === 1 ? 'Project' : 'Projects'}</button>}
    {showCompare && <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true"><div className="mx-auto my-8 max-w-6xl bg-bg p-6 md:p-10"><div className="flex items-center justify-between"><h2 className="text-4xl font-display">Project Comparison</h2><button type="button" onClick={() => setShowCompare(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke" aria-label="Close comparison"><FiX /></button></div><div className="mt-8 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr><th className="border-b border-stroke p-4 text-muted">Details</th>{compared.map((project) => <th key={project.slug} className="border-b border-stroke p-4 text-xl font-display">{project.title}</th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th className="border-b border-stroke p-4 font-normal text-muted">{label}</th>{compared.map((project) => <td key={project.slug} className="border-b border-stroke p-4 align-top leading-relaxed">{value(project)}</td>)}</tr>)}</tbody></table></div></div></div>}
  </main>;
}
