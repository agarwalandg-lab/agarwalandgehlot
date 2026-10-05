import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiChevronDown, FiChevronUp, FiHeart, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { Project } from '../data/projects';
import { useProjects } from '../data/projectStore';
import { canonicalProjectAliases } from '../data/seoLandingPages';

const configurations = ['All Configurations', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Penthouse', 'Duplex', 'Office', 'Retail'];
const inputClass = 'h-11 w-full border border-stroke bg-bg px-3.5 text-xs md:text-sm text-text-primary outline-none focus:border-text-primary rounded-xl transition-colors';

function ProjectCard({ project, selected, saved, onCompare, onSave }: { project: Project; selected: boolean; saved: boolean; onCompare: () => void; onSave: () => void }) {
  const ready = /ready|completed/i.test(`${project.status} ${project.type}`);
  const projectPath = `/projects/${canonicalProjectAliases[project.slug] || project.slug}`;
  return <article className="group border-t border-stroke pt-5">
    <div className="relative aspect-[4/3] overflow-hidden bg-surface rounded-2xl">
      <Link to={projectPath} aria-label={`View ${project.title}`}><img src={project.image} alt={`${project.title} residential project in ${project.location}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /></Link>
      <span className="absolute left-4 top-4 bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm rounded-md">{ready ? 'Ready to Move' : project.status}</span>
      <button type="button" onClick={onSave} aria-label={saved ? `Remove ${project.title} from saved projects` : `Save ${project.title}`} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110"><FiHeart className={saved ? 'fill-current text-rose-500' : ''} /></button>
    </div>
    <div className="py-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{project.developer}</p>
      <Link to={projectPath}><h2 className="mt-2 text-3xl font-display text-text-primary hover:underline">{project.title}</h2></Link>
      <p className="mt-2 text-sm text-muted">{project.location}</p>
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-stroke py-4 text-sm">
        <div><span className="block text-[10px] uppercase tracking-[0.15em] text-muted">Configuration</span><span className="mt-1 block font-medium">{project.configurations}</span></div>
        <div><span className="block text-[10px] uppercase tracking-[0.15em] text-muted">Starting Price</span><span className="mt-1 block font-medium">{project.price}</span></div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
      <div className="mt-5 flex items-center gap-2">
        <Link to={projectPath} className="flex-1 bg-text-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-bg rounded-xl transition-transform hover:scale-[1.02]">View Project</Link>
        <button type="button" onClick={onCompare} className={`flex items-center gap-2 border px-4 py-3 text-xs uppercase tracking-[0.12em] rounded-xl transition-colors ${selected ? 'border-text-primary bg-text-primary text-bg' : 'border-stroke text-muted hover:border-text-primary'}`}>{selected && <FiCheck />} Compare</button>
      </div>
    </div>
  </article>;
}

export default function ProjectsListing() {
  const { projects } = useProjects();
  const cities = ['All Cities', ...Array.from(new Set(projects.map((project) => { const parts = project.location.split(','); return parts[parts.length - 1].trim() || project.location; })))];
  const developers = ['All Developers', ...Array.from(new Set(projects.map((project) => project.developer)))];
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [developer, setDeveloper] = useState('All Developers');
  const [status, setStatus] = useState('All Statuses');
  const [configuration, setConfiguration] = useState('All Configurations');
  const [sort, setSort] = useState('Recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('ag-saved-projects') || '[]'); } catch { return []; } });

  useEffect(() => localStorage.setItem('ag-saved-projects', JSON.stringify(saved)), [saved]);

  const activeFilterCount = [
    city !== 'All Cities',
    developer !== 'All Developers',
    configuration !== 'All Configurations',
    status !== 'All Statuses',
    sort !== 'Recommended',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = projects.filter((project) => {
      const text = [project.title, project.location, project.developer, project.category, project.status, project.configurations, project.type].join(' ').toLowerCase();
      const statusMatch = status === 'All Statuses' || (status === 'New Launch' ? /new/i.test(project.type) : status === 'Under Construction' ? /under|development/i.test(`${project.status} ${project.type}`) : /ready|completed/i.test(`${project.status} ${project.type}`));
      return (!query || text.includes(query)) && (city === 'All Cities' || project.location.endsWith(city)) && (developer === 'All Developers' || project.developer === developer) && statusMatch && (configuration === 'All Configurations' || project.configurations.toLowerCase().includes(configuration.toLowerCase()));
    });
    return sort === 'Possession' ? [...matches].sort((a, b) => a.possession.localeCompare(b.possession)) : sort === 'Newest' ? [...matches].sort((a, b) => Number(/new|under/i.test(`${b.type} ${b.status}`)) - Number(/new|under/i.test(`${a.type} ${a.status}`))) : matches;
  }, [projects, search, city, developer, status, configuration, sort]);

  const clear = () => {
    setSearch('');
    setCity('All Cities');
    setDeveloper('All Developers');
    setStatus('All Statuses');
    setConfiguration('All Configurations');
    setSort('Recommended');
  };
  const toggleCompare = (slug: string) => setCompare((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : current);
  const compared = projects.filter((project) => compare.includes(project.slug));
  const rows: [string, (project: Project) => string][] = [['Developer', (p) => p.developer], ['Location', (p) => p.location], ['Price', (p) => p.price], ['Configuration', (p) => p.configurations], ['Status', (p) => p.status], ['Possession', (p) => p.possession], ['RERA', (p) => p.rera], ['A&G View', (p) => p.bestSuitedFor]];

  return <main className="min-h-screen bg-bg pb-28 pt-32">
    <section className="mx-auto max-w-[1400px] px-6 md:px-10">
      <div className="border-b border-stroke pb-12 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">A&amp;G Portfolio</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-display leading-tight md:text-7xl">Residential Projects in Noida &amp; NCR</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted text-sm md:text-base">Compare verified project details, configurations and locations across Noida and Greater Noida.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.14em]">
          <Link to="/projects/gallery" className="border-b border-text-primary pb-1 hover:text-muted">Open Project Gallery</Link>
          <Link to="/property-in-noida" className="border-b border-text-primary pb-1 hover:text-muted">Property in Noida</Link>
          <Link to="/property-in-greater-noida" className="border-b border-text-primary pb-1 hover:text-muted">Property in Greater Noida</Link>
        </div>
      </div>

      {/* Responsive Filter Container */}
      <div className="sticky top-20 z-30 mt-6 rounded-2xl border border-stroke bg-surface/95 p-3.5 md:p-4 shadow-lg backdrop-blur-xl">
        {/* Top Compact Bar (Search + Filter Toggle for Mobile) */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-base" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={`${inputClass} pl-10`}
              placeholder="Search project, sector, or location..."
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary p-1"
                aria-label="Clear search"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`inline-flex lg:hidden items-center gap-2 h-11 px-4 rounded-xl border text-xs font-medium uppercase tracking-[0.12em] shrink-0 transition-colors ${
              activeFilterCount > 0 || mobileFiltersOpen
                ? 'border-text-primary bg-text-primary text-bg'
                : 'border-stroke bg-bg text-text-primary hover:border-text-primary'
            }`}
            aria-expanded={mobileFiltersOpen}
          >
            <FiSliders className="text-sm" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bg text-text-primary text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
            {mobileFiltersOpen ? <FiChevronUp className="text-xs" /> : <FiChevronDown className="text-xs" />}
          </button>
        </div>

        {/* Dropdowns: Always visible on Desktop (lg:), Collapsible on Mobile/Tablet */}
        <div className={`mt-3 ${mobileFiltersOpen ? 'block' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-stroke`}>
          <div>
            <label className="block lg:hidden text-[10px] uppercase tracking-wider text-muted mb-1">City / Region</label>
            <select value={city} onChange={(event) => setCity(event.target.value)} className={inputClass} aria-label="Filter by City">
              {cities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="block lg:hidden text-[10px] uppercase tracking-wider text-muted mb-1">Developer</label>
            <select value={developer} onChange={(event) => setDeveloper(event.target.value)} className={inputClass} aria-label="Filter by Developer">
              {developers.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="block lg:hidden text-[10px] uppercase tracking-wider text-muted mb-1">Configuration</label>
            <select value={configuration} onChange={(event) => setConfiguration(event.target.value)} className={inputClass} aria-label="Filter by Configuration">
              {configurations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="block lg:hidden text-[10px] uppercase tracking-wider text-muted mb-1">Construction Status</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass} aria-label="Filter by Status">
              <option>All Statuses</option>
              <option>New Launch</option>
              <option>Under Construction</option>
              <option>Ready to Move</option>
            </select>
          </div>

          <div>
            <label className="block lg:hidden text-[10px] uppercase tracking-wider text-muted mb-1">Sort By</label>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className={inputClass} aria-label="Sort Projects">
              <option>Recommended</option>
              <option>Newest</option>
              <option>Possession</option>
            </select>
          </div>

          {/* Mobile Action Controls inside expanded filter drawer */}
          <div className="flex lg:hidden items-center justify-between gap-3 sm:col-span-2 pt-2 mt-1 border-t border-stroke">
            <button
              type="button"
              onClick={clear}
              className="text-xs uppercase tracking-[0.14em] text-muted hover:text-text-primary underline py-2"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="bg-text-primary text-bg px-6 py-2.5 rounded-xl text-xs font-medium uppercase tracking-[0.12em]"
            >
              Apply &amp; Show ({filtered.length})
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-stroke py-6">
        <p className="text-xs md:text-sm text-muted">
          Showing <strong className="text-text-primary font-medium">{filtered.length}</strong> {filtered.length === 1 ? 'project' : 'projects'}
        </p>
        {(activeFilterCount > 0 || search) && (
          <button type="button" onClick={clear} className="text-xs uppercase tracking-[0.14em] text-muted hover:text-text-primary underline">
            Clear All Filters ({activeFilterCount + (search ? 1 : 0)})
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filtered.length ? (
        <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              selected={compare.includes(project.slug)}
              saved={saved.includes(project.slug)}
              onCompare={() => toggleCompare(project.slug)}
              onSave={() => setSaved((current) => current.includes(project.slug) ? current.filter((item) => item !== project.slug) : [...current, project.slug])}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <h2 className="text-3xl font-display text-text-primary">No matching projects found</h2>
          <p className="mt-3 text-muted text-sm">Try removing one of your filters or searching for another sector or builder.</p>
          <button
            type="button"
            onClick={clear}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-text-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-bg"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>

    {/* Project Comparison Modal & Floating Button */}
    {compare.length > 0 && (
      <button
        type="button"
        onClick={() => setShowCompare(true)}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-text-primary px-7 py-3.5 text-xs md:text-sm font-medium uppercase tracking-[0.14em] text-bg shadow-2xl transition-transform hover:scale-105"
      >
        Compare ({compare.length})
      </button>
    )}

    {showCompare && (
      <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
        <div className="mx-auto my-8 max-w-6xl rounded-3xl bg-bg p-6 md:p-10 border border-stroke shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-stroke">
            <h2 className="text-3xl md:text-4xl font-display text-text-primary">Project Comparison</h2>
            <button
              type="button"
              onClick={() => setShowCompare(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke hover:bg-surface text-text-primary"
              aria-label="Close comparison"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr>
                  <th className="border-b border-stroke p-4 text-muted font-normal text-xs uppercase tracking-wider">Feature</th>
                  {compared.map((project) => (
                    <th key={project.slug} className="border-b border-stroke p-4 text-xl font-display text-text-primary">
                      {project.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label} className="border-b border-stroke/60">
                    <th className="p-4 font-normal text-muted text-xs uppercase tracking-wider">{label}</th>
                    {compared.map((project) => (
                      <td key={project.slug} className="p-4 align-top leading-relaxed text-text-primary">
                        {value(project)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </main>;
}
