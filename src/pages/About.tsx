import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  const values = [
    { title: 'Precision', desc: 'Every recommendation is anchored in data, intuition, and a deep understanding of market nuances.' },
    { title: 'Confidentiality', desc: 'High-value transactions deserve discretion, care, and complete privacy at every stage.' },
    { title: 'Commitment', desc: 'Forging lifelong relationships built on mutual success.' },
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="mx-auto max-w-[1000px] px-6 md:px-10">
        <FadeIn>
          <h1 className="mb-12 text-center text-5xl font-display md:text-7xl">About A&G</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-20">
            <section className="max-w-3xl">
              <h2 className="mb-6 text-4xl font-display md:text-5xl">Real Estate Guidance, Built Around You.</h2>
              <div className="space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  At <strong className="text-text-primary">Agarwal &amp; Gehlot Realtors</strong>, we believe the right property decision begins with understanding the client, not the inventory.
                </p>
                <p>
                  A&amp;G helps homebuyers and investors explore premium real estate opportunities across <strong className="text-text-primary">Noida and Delhi NCR</strong> through a more transparent, informed and personalized approach.
                </p>
                <p>
                  From understanding your requirements and shortlisting suitable properties to project comparisons, site visits, negotiations and documentation assistance, our team supports you throughout the property-buying journey.
                </p>
                <p>
                  Our objective is simple: to help you evaluate every opportunity with greater clarity and choose a property that genuinely aligns with your <strong className="text-text-primary">lifestyle, budget and investment goals</strong>.
                </p>
              </div>
              <p className="mt-8 text-sm uppercase tracking-[0.25em] text-text-primary">Clarity. Transparency. Perspective.</p>
              <Link to="/projects" className="mt-8 inline-block rounded-full border border-stroke px-6 py-3 text-sm text-text-primary transition-colors hover:bg-text-primary hover:text-bg">
                Discover A&amp;G <span aria-hidden="true">-&gt;</span>
              </Link>
            </section>

            <section className="border-t border-stroke/50 pt-16">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Meet Arpit Gehlot</p>
              <h2 className="mb-6 text-4xl font-display md:text-5xl">The Perspective Behind A&amp;G.</h2>
              <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
                <p className="text-xl text-text-primary"><strong>Arpit Gehlot</strong></p>
                <p className="text-sm uppercase tracking-[0.2em]">Director, Agarwal &amp; Gehlot Realtors</p>
                <p>Arpit Gehlot leads A&amp;G with a client-first approach to real estate advisory.</p>
                <p>His philosophy is simple: <strong className="text-text-primary">understand the client's objective first, then find the property that fits it.</strong></p>
                <p>By focusing on factors such as location, developer credibility, pricing, lifestyle requirements and long-term potential, Arpit works to help buyers and investors look beyond sales pitches and make more informed property decisions.</p>
                <p>For him, real estate is not simply about completing a transaction. It is about building <strong className="text-text-primary">long-term relationships based on trust, knowledge and responsible guidance.</strong></p>
              </div>
              <Link to="/contact" className="mt-8 inline-block rounded-full border border-stroke px-6 py-3 text-sm text-text-primary transition-colors hover:bg-text-primary hover:text-bg">
                Know More About Arpit <span aria-hidden="true">-&gt;</span>
              </Link>
            </section>

            <blockquote className="border-l-2 border-accent py-2 pl-6 md:pl-8">
              <p className="max-w-3xl text-3xl font-display leading-tight md:text-4xl">&ldquo;The right property is not simply the one you can buy. It is the one that makes sense for where you want to go.&rdquo;</p>
              <cite className="mt-6 block text-sm not-italic uppercase tracking-[0.2em] text-muted">- Arpit Gehlot</cite>
            </blockquote>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {values.map((value, i) => (
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


