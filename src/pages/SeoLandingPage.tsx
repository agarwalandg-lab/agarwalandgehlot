import { Link, Navigate } from 'react-router-dom';
import { seoLandingPages } from '../data/seoLandingPages';

export default function SeoLandingPage({ path }: { path: string }) {
  const page = seoLandingPages[path];
  if (!page) return <Navigate to="/projects" replace />;

  return (
    <main className="min-h-screen bg-bg pb-24 pt-32">
      <section className="mx-auto grid max-w-[1200px] gap-10 border-b border-stroke px-6 pb-16 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-muted">A&amp;G Realtors · Noida &amp; Delhi NCR</p>
          <h1 className="max-w-3xl text-4xl font-display leading-tight md:text-6xl">{page.heading}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projects" className="bg-text-primary px-6 py-3 text-sm text-bg transition-opacity hover:opacity-80">Browse Projects</Link>
            <Link to="/contact" className="border border-stroke px-6 py-3 text-sm text-text-primary transition-colors hover:bg-surface">Speak with A&amp;G</Link>
          </div>
        </div>
        {page.image && (
          <img
            src={page.image}
            alt={page.imageAlt || page.primaryKeyword}
            width="1200"
            height="900"
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover"
          />
        )}
      </section>

      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        {page.sections.map((section) => (
          <section key={section.heading} className="border-b border-stroke py-12 md:py-16">
            <h2 className="mb-5 text-3xl font-display md:text-4xl">{section.heading}</h2>
            <p className="text-base leading-relaxed text-muted md:text-lg">{section.body}</p>
            {section.links && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {section.links.map((link) => <Link key={link.href} className="border-b border-stroke pb-1 text-text-primary hover:border-text-primary" to={link.href}>{link.label}</Link>)}
              </div>
            )}
          </section>
        ))}

        <section className="border-b border-stroke py-12 md:py-16">
          <h2 className="mb-6 text-3xl font-display md:text-4xl">Frequently Asked Questions</h2>
          <div className="divide-y divide-stroke border-y border-stroke">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-6 text-base text-text-primary md:text-lg">
                  {faq.question}<span className="float-right text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <nav aria-label="Related property guides" className="flex flex-wrap gap-x-6 gap-y-3 py-8 text-sm">
          {page.links.map((link) => <Link key={link.href} className="border-b border-stroke pb-1 text-text-primary hover:border-text-primary" to={link.href}>{link.label}</Link>)}
        </nav>
      </div>
    </main>
  );
}