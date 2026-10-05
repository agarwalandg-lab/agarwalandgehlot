import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAbout } from '../data/siteStore';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default function About() {
  const { about } = useAbout();

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="mx-auto max-w-[1000px] px-6 md:px-10">
        <FadeIn>
          <div className="relative mb-12 overflow-hidden border border-stroke bg-surface">
            {about.heroVideo ? <video src={about.heroVideo} autoPlay muted loop playsInline className="h-[min(55vh,520px)] w-full object-cover" /> : about.heroImage ? <img src={about.heroImage} alt="A&G Realtors property consulting in Noida and Delhi NCR" className="h-[min(55vh,520px)] w-full object-cover" /> : null}
            <h1 className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-8 pt-24 text-center text-5xl font-display text-white md:text-7xl">A&amp;G Realtors: Real Estate Consultants in Noida</h1>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-20">
            <section className="max-w-3xl">
              <h2 className="mb-6 text-4xl font-display md:text-5xl">{about.introTitle}</h2>
              <div className="space-y-5 text-lg leading-relaxed text-muted">
                {about.introParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <p className="mt-8 text-sm uppercase tracking-[0.25em] text-text-primary">Clarity. Transparency. Perspective.</p>
              <Link to="/projects" className="mt-8 inline-block rounded-full border border-stroke px-6 py-3 text-sm text-text-primary transition-colors hover:bg-text-primary hover:text-bg">
                Discover A&amp;G <span aria-hidden="true">-&gt;</span>
              </Link>
            </section>

            <section className="border-t border-stroke/50 pt-16">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">{about.directorEyebrow}</p>
              <h2 className="mb-6 text-4xl font-display md:text-5xl">{about.directorTitle}</h2>
              <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
                <p className="text-xl text-text-primary"><strong>{about.directorName}</strong></p>
                <p className="text-sm uppercase tracking-[0.2em]">{about.directorRole}</p>
                {about.directorParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <Link to="/contact" className="mt-8 inline-block rounded-full border border-stroke px-6 py-3 text-sm text-text-primary transition-colors hover:bg-text-primary hover:text-bg">
                Know More About Arpit <span aria-hidden="true">-&gt;</span>
              </Link>
            </section>

            <blockquote className="border-l-2 border-accent py-2 pl-6 md:pl-8">
              <p className="max-w-3xl text-3xl font-display leading-tight md:text-4xl">&ldquo;{about.quote}&rdquo;</p>
              <cite className="mt-6 block text-sm not-italic uppercase tracking-[0.2em] text-muted">- {about.quoteAuthor}</cite>
            </blockquote>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {about.values.map((value, i) => (
              <div key={i} className="border-l-2 border-accent pl-6">
                <h3 className="mb-2 text-xl font-medium">{value.title}</h3>
                <p className="text-sm text-muted">{value.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}


