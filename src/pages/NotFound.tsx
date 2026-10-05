import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHome, FiMail, FiGrid } from 'react-icons/fi';
import { useProjects } from '../data/projectStore';
import { canonicalProjectAliases } from '../data/seoLandingPages';

export default function NotFound() {
  const { projects } = useProjects();
  const featuredProjects = projects.slice(0, 3);

  useEffect(() => {
    document.title = 'Page Not Found | A&G Realtors';
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex,follow';
  }, []);

  return (
    <main className="min-h-screen w-full pt-36 pb-24 px-6 md:px-10 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* A&G Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-4 py-1.5 text-xs font-medium text-muted mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Error 404 — Page Not Found
        </div>

        <h1 className="text-6xl md:text-8xl font-display tracking-tight text-text-primary mb-6">
          The requested page doesn’t exist.
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let us guide you back to our real estate portfolio and services.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-text-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-bg transition-transform hover:scale-105"
          >
            <FiHome className="text-base" />
            Back to Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-primary transition-colors hover:bg-stroke/50"
          >
            <FiGrid className="text-base" />
            Browse Projects
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-stroke px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-primary transition-colors hover:bg-stroke/30"
          >
            <FiMail className="text-base" />
            Contact Advisory
          </Link>
        </div>

        {/* Popular Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="border-t border-stroke pt-16 text-left w-full">
            <p className="text-xs uppercase tracking-[0.25em] text-muted mb-8 text-center">
              Explore Popular Real Estate Projects in Noida
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  to={`/projects/${canonicalProjectAliases[project.slug] || project.slug}`}
                  className="group block rounded-2xl border border-stroke bg-surface p-5 transition-all hover:border-text-primary"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-bg">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">{project.location}</p>
                  <h3 className="text-xl font-display text-text-primary flex items-center justify-between">
                    {project.title}
                    <FiArrowRight className="text-sm opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-xs text-muted mt-2 line-clamp-2">{project.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
