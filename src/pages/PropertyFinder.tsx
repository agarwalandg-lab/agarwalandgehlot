import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiHome, FiKey, FiTag, FiUser, FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { projects } from '../data/projects';

type Requirement = 'buy' | 'rent' | 'sell' | 'agent';

const requirements = [
  { value: 'buy' as const, label: 'Buy', description: 'Find a home or investment property', icon: FiHome },
  { value: 'rent' as const, label: 'Rent', description: 'Explore explicitly listed rental opportunities', icon: FiKey },
  { value: 'sell' as const, label: 'Sell', description: 'Get help positioning your property', icon: FiTag },
  { value: 'agent' as const, label: 'Agent', description: 'Speak with an A&G property advisor', icon: FiUser },
];

const cityFromLocation = (location: string) => {
  const parts = location.split(',');
  return parts[parts.length - 1].trim();
};

function AdvisorForm({ requirement, location }: { requirement: Requirement; location: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [property, setProperty] = useState('');
  const [budget, setBudget] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const intent = requirement === 'sell' ? 'sell a property' : requirement === 'rent' ? 'find a rental property' : 'speak with a property advisor';
    const message = [`Hi A&G, I would like to ${intent}.`, `Name: ${name}`, `Phone: ${phone}`, email && `Email: ${email}`, `Preferred location: ${location}`, property && `Project / Property: ${property}`, budget && `Budget / Expected price: ${budget}`].filter(Boolean).join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  const inputClass = 'mt-2 w-full border border-stroke bg-bg px-4 py-3 text-text-primary outline-none focus:border-text-primary';
  return <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
    <label className="text-xs text-muted">Full Name<input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></label>
    <label className="text-xs text-muted">Phone Number<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} /></label>
    <label className="text-xs text-muted">Email (optional)<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
    <label className="text-xs text-muted">Selected Location<input readOnly value={location} className={`${inputClass} text-muted`} /></label>
    <label className="text-xs text-muted">Project / Property Name<input value={property} onChange={(e) => setProperty(e.target.value)} className={inputClass} /></label>
    <label className="text-xs text-muted">{requirement === 'sell' ? 'Expected Price (optional)' : 'Budget (optional)'}<input value={budget} onChange={(e) => setBudget(e.target.value)} className={inputClass} /></label>
    <button className="bg-text-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.14em] text-bg sm:col-span-2">{requirement === 'sell' ? 'Submit Property via WhatsApp' : requirement === 'rent' ? 'Notify Me via WhatsApp' : 'Talk to an Advisor'}</button>
    <p className="text-xs leading-relaxed text-muted sm:col-span-2">Your information is prepared for your review in WhatsApp. It is not presented as saved until you send the message.</p>
  </form>;
}

export default function PropertyFinder() {
  const [params, setParams] = useSearchParams();
  const initialRequirement = params.get('requirement');
  const [requirement, setRequirement] = useState<Requirement | null>(requirements.some((item) => item.value === initialRequirement) ? initialRequirement as Requirement : null);
  const [location, setLocation] = useState(params.get('location') || '');
  const [otherLocation, setOtherLocation] = useState('');

  useEffect(() => { document.title = 'Find Your Property | A&G Realtors'; }, []);

  const inventory = useMemo(() => requirement === 'rent' ? projects.filter((project) => /rent|rental/i.test(`${project.price} ${project.status} ${project.description}`)) : projects, [requirement]);
  const locations = useMemo(() => Array.from(new Set(inventory.map((project) => cityFromLocation(project.location)))).sort(), [inventory]);
  const selectedLocation = location === 'Other Location' ? otherLocation.trim() : location;
  const matches = useMemo(() => requirement === 'buy' && selectedLocation ? inventory.filter((project) => cityFromLocation(project.location).toLowerCase() === selectedLocation.toLowerCase()) : requirement === 'rent' && selectedLocation ? inventory.filter((project) => cityFromLocation(project.location).toLowerCase() === selectedLocation.toLowerCase()) : [], [requirement, selectedLocation, inventory]);

  const chooseRequirement = (value: Requirement) => {
    setRequirement(value); setLocation(''); setOtherLocation('');
    setParams({ requirement: value });
  };
  const chooseLocation = (value: string) => {
    setLocation(value);
    if (value !== 'Other Location' && requirement) setParams({ requirement, location: value });
  };
  const resetRequirement = () => { setRequirement(null); setLocation(''); setOtherLocation(''); setParams({}); };
  const resetLocation = () => { setLocation(''); setOtherLocation(''); if (requirement) setParams({ requirement }); };

  const showResult = requirement && selectedLocation;
  return <main className="min-h-screen bg-bg pb-28 pt-32"><div className="mx-auto max-w-[1200px] px-6 md:px-10">
    <div className="border-b border-stroke pb-12 text-center"><p className="text-xs uppercase tracking-[0.3em] text-muted">A&amp;G Smart Advisory</p><h1 className="mt-5 text-5xl font-display md:text-7xl">Find Your Property</h1><p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">A simple inventory-based search shaped around what you need and where you need it.</p></div>
    <AnimatePresence mode="wait">
      {!requirement && <motion.section key="requirement" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="py-16"><p className="text-center text-xs uppercase tracking-[0.25em] text-muted">Step 1 of 2</p><h2 className="mt-4 text-center text-4xl font-display">What are you looking for?</h2><div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">{requirements.map((item) => { const Icon = item.icon; return <button key={item.value} type="button" onClick={() => chooseRequirement(item.value)} className="group min-h-52 border border-stroke p-6 text-left transition-colors hover:bg-surface"><Icon size={24} strokeWidth={1.4} /><span className="mt-12 block text-2xl font-display uppercase">{item.label}</span><span className="mt-2 block text-xs leading-relaxed text-muted">{item.description}</span></button>; })}</div></motion.section>}
      {requirement && !showResult && <motion.section key="location" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="py-16"><button onClick={resetRequirement} className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted"><FiArrowLeft /> Change Requirement</button><p className="mt-10 text-center text-xs uppercase tracking-[0.25em] text-muted">Step 2 of 2 · {requirement}</p><h2 className="mt-4 text-center text-4xl font-display">Choose your location</h2><div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-3">{locations.map((item) => <button key={item} type="button" onClick={() => chooseLocation(item)} className="min-h-28 border border-stroke p-5 text-lg transition-colors hover:bg-surface">{item}</button>)}<button type="button" onClick={() => chooseLocation('Other Location')} className="min-h-28 border border-stroke p-5 text-lg transition-colors hover:bg-surface">Other Location</button></div>{location === 'Other Location' && <div className="mx-auto mt-6 flex max-w-lg gap-2"><input autoFocus value={otherLocation} onChange={(e) => setOtherLocation(e.target.value)} placeholder="Enter city or area" className="h-12 flex-1 border border-stroke bg-bg px-4 outline-none focus:border-text-primary" /><button type="button" disabled={!otherLocation.trim()} onClick={() => requirement && setParams({ requirement, location: otherLocation.trim() })} className="bg-text-primary px-5 text-xs uppercase tracking-[0.12em] text-bg disabled:opacity-40">Continue</button></div>}</motion.section>}
      {showResult && <motion.section key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-14"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke pb-7"><div><p className="text-xs uppercase tracking-[0.22em] text-muted">{requirement} · {selectedLocation}</p><h2 className="mt-2 text-4xl font-display">{requirement === 'sell' ? `Sell Your Property in ${selectedLocation}` : requirement === 'agent' ? 'Connect With a Property Advisor' : matches.length ? 'Recommended Properties For You' : "No exact match. Let's find one for you."}</h2></div><div className="flex gap-4 text-xs uppercase tracking-[0.12em] text-muted"><button onClick={resetRequirement}>Change Requirement</button><button onClick={resetLocation}>Change Location</button></div></div>
        {(requirement === 'sell' || requirement === 'agent') && <div className="mx-auto mt-10 max-w-3xl bg-surface p-7 md:p-10"><p className="leading-relaxed text-muted">{requirement === 'sell' ? 'Share a few details and our team will help you understand market positioning, buyer opportunities and the next steps.' : 'Our team can help you shortlist properties, understand the market and plan site visits based on your requirements.'}</p><AdvisorForm requirement={requirement} location={selectedLocation} /></div>}
        {(requirement === 'buy' || requirement === 'rent') && matches.length > 0 && <><p className="mt-7 text-muted">Based on your requirement and preferred location, these projects from the current A&amp;G catalogue match your search. Unit availability must be confirmed.</p><div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{matches.map((project) => <article key={project.slug} className="border-t border-stroke pt-4"><Link to={`/projects/${project.slug}`}><img src={project.image} alt={project.title} className="aspect-[4/3] w-full object-cover" /></Link><p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-muted">{project.developer}</p><h3 className="mt-2 text-3xl font-display">{project.title}</h3><p className="mt-2 text-sm text-muted">{project.location}</p><p className="mt-4 text-sm leading-relaxed text-muted">{project.configurations} · {project.price}</p><div className="mt-5 flex gap-2"><Link to={`/projects/${project.slug}`} className="flex-1 bg-text-primary px-4 py-3 text-center text-xs uppercase tracking-[0.12em] text-bg">View Property</Link><Link to="/services/site-visits" className="border border-stroke px-4 py-3 text-xs uppercase tracking-[0.12em]">Book Visit</Link></div></article>)}</div></>}
        {(requirement === 'buy' || requirement === 'rent') && matches.length === 0 && <div className="mx-auto mt-10 max-w-3xl bg-surface p-7 md:p-10"><p className="leading-relaxed text-muted">Our current catalogue does not include an exact {requirement} match in {selectedLocation}. Send your requirement to an advisor instead of being shown an unrelated property.</p><AdvisorForm requirement={requirement} location={selectedLocation} /></div>}
      </motion.section>}
    </AnimatePresence>
    <div className="border-t border-stroke pt-8 text-center"><Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">Browse All Projects <FiArrowUpRight /></Link></div>
  </div></main>;
}
