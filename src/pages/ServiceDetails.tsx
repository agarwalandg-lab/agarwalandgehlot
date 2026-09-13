import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { services } from '../data/services';

const whatsappNumber = '';

function EmiCalculator() {
  const [price, setPrice] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const result = useMemo(() => {
    const loan = Math.max(0, price - downPayment);
    const months = years * 12;
    const monthlyRate = rate / 1200;
    const emi = monthlyRate && months ? loan * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : 0;
    return { loan, emi, interest: emi * months - loan };
  }, [price, downPayment, rate, years]);
  const field = 'w-full border border-stroke bg-bg px-4 py-3 text-text-primary outline-none focus:border-text-primary';
  return <section className="mt-20 border-y border-stroke py-14"><p className="text-xs uppercase tracking-[0.25em] text-muted">Planning Tool</p><h2 className="mt-3 text-4xl font-display">Estimate Your EMI</h2><div className="mt-8 grid gap-4 md:grid-cols-4"><label className="text-xs text-muted">Property Price<input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={`${field} mt-2`} /></label><label className="text-xs text-muted">Down Payment<input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className={`${field} mt-2`} /></label><label className="text-xs text-muted">Interest Rate (%)<input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className={`${field} mt-2`} /></label><label className="text-xs text-muted">Loan Tenure (years)<input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className={`${field} mt-2`} /></label></div><div className="mt-6 grid gap-px bg-stroke sm:grid-cols-3"><div className="bg-bg p-5"><span className="text-xs text-muted">Loan Amount</span><strong className="mt-2 block text-xl">₹{Math.round(result.loan).toLocaleString('en-IN')}</strong></div><div className="bg-bg p-5"><span className="text-xs text-muted">Estimated Monthly EMI</span><strong className="mt-2 block text-xl">₹{Math.round(result.emi).toLocaleString('en-IN')}</strong></div><div className="bg-bg p-5"><span className="text-xs text-muted">Estimated Total Interest</span><strong className="mt-2 block text-xl">₹{Math.round(result.interest).toLocaleString('en-IN')}</strong></div></div><p className="mt-4 text-xs text-muted">Illustrative estimate only. Rates, eligibility and approval are determined by the lender.</p></section>;
}

function AdvisorForm({ serviceTitle, message }: { serviceTitle: string; message: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const body = `${message}\n\nName: ${name}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ''}\nService: ${serviceTitle}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
  };
  return <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-xs text-muted">Full Name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-stroke bg-bg px-4 py-3 text-text-primary outline-none focus:border-text-primary" /></label><label className="text-xs text-muted">Phone<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full border border-stroke bg-bg px-4 py-3 text-text-primary outline-none focus:border-text-primary" /></label><label className="text-xs text-muted sm:col-span-2">Email (optional)<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-stroke bg-bg px-4 py-3 text-text-primary outline-none focus:border-text-primary" /></label><button className="bg-text-primary px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-bg sm:col-span-2">Continue with WhatsApp</button><p className="text-xs leading-relaxed text-muted sm:col-span-2">Your details are passed to WhatsApp for your review. Nothing is presented as saved until you send the message.</p></form>;
}

export default function ServiceDetails() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  useEffect(() => { if (service) { document.title = service.seoTitle; const meta = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement('meta')); meta.setAttribute('name', 'description'); meta.setAttribute('content', service.seoDescription); } }, [service]);
  if (!service) return <Navigate to="/services" replace />;
  return <main className="w-full pb-28 pt-32"><div className="mx-auto max-w-[1100px] px-6 md:px-10">
    <nav className="text-xs uppercase tracking-[0.14em] text-muted"><Link to="/">Home</Link> <span className="px-2">/</span> <Link to="/services">Services</Link> <span className="px-2">/</span> {service.title}</nav>
    <section className="grid gap-12 border-b border-stroke py-16 lg:grid-cols-[1fr_0.55fr] lg:items-end"><div><p className="text-xs uppercase tracking-[0.3em] text-muted">{service.group}</p><h1 className="mt-5 text-5xl font-display leading-tight md:text-7xl">{service.heading}</h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{service.intro}</p></div><Link to="/contact" className="flex items-center justify-between border border-stroke px-6 py-4 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-text-primary hover:text-bg">{service.cta}<FiArrowUpRight /></Link></section>
    <section className="py-16"><p className="text-xs uppercase tracking-[0.25em] text-muted">How A&amp;G Helps</p><div className="mt-8 grid gap-px bg-stroke sm:grid-cols-2 lg:grid-cols-3">{service.features.map((feature) => <div key={feature} className="flex min-h-32 items-start gap-4 bg-bg p-6"><FiCheck className="mt-1 shrink-0" /><span className="leading-relaxed">{feature}</span></div>)}</div></section>
    {service.slug === 'home-loan-assistance' && <EmiCalculator />}
    <section className="mt-16 grid gap-10 bg-surface p-7 md:grid-cols-2 md:p-12"><div><p className="text-xs uppercase tracking-[0.25em] text-muted">Speak with A&amp;G</p><h2 className="mt-4 text-4xl font-display">Start with a private conversation.</h2><p className="mt-5 leading-relaxed text-muted">Share your contact details and review the prepared message before sending it to an advisor on WhatsApp.</p></div><AdvisorForm serviceTitle={service.title} message={service.whatsapp} /></section>
    {service.slug === 'legal-documentation' && <p className="mt-8 text-sm leading-relaxed text-muted">A&amp;G provides real-estate advisory and coordination. Specialist legal advice may be provided by qualified independent professionals where required.</p>}
  </div></main>;
}
