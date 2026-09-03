import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default function Services() {
  const services = [
    {
      title: 'Residential Property Services',
      desc: 'Finding a home is an intimate journey. We provide access to a distinguished portfolio of premium apartments, penthouses, and villas. Our advisors take the time to understand your lifestyle requirements, guiding you through handpicked selections to find the residence that truly resonates with your vision of luxury and comfort.',
    },
    {
      title: 'Commercial Property Services',
      desc: 'Your business address speaks volumes. We specialize in sourcing Grade-A office spaces, premium retail shops, and commercial towers in thriving business districts. Our team analyzes footfall, accessibility, and infrastructural advantages to secure locations that act as catalysts for your corporate growth.',
    },
    {
      title: 'Plot Investment Services',
      desc: 'The foundation of a great legacy begins with the right piece of land. We assist clients in acquiring residential, commercial, and township plots in highly lucrative, fast-developing zones. Our thorough due diligence ensures your land acquisition is secure and poised for substantial future appreciation.',
    },
    {
      title: 'Property Buying Assistance',
      desc: 'Acquiring a premium property requires precision. We curate a bespoke selection of assets that match your stringent criteria, arrange exclusive private viewings, and negotiate fiercely to secure your asset at the optimum valuation.',
    },
    {
      title: 'Property Selling Assistance',
      desc: 'When it is time to divest, your asset deserves elite positioning. We employ discreet, highly targeted marketing strategies to connect your property with qualified high-net-worth buyers, ensuring maximum return and complete confidentiality.',
    },
    {
      title: 'Investment Consultancy',
      desc: 'Real estate is a powerful tool for wealth generation. We provide exhaustive ROI analysis, forecast market trends, and identify undervalued assets in emerging corridors to help you build a robust and highly profitable property portfolio.',
    },
    {
      title: 'Documentation Support',
      desc: 'We eliminate the complexities of property transactions. Our legal experts manage all due diligence, title verifications, and regulatory compliances, ensuring that your acquisition is entirely legally sound and flawlessly executed.',
    },
    {
      title: 'Home Loan Assistance',
      desc: 'Capital efficiency is crucial. Leveraging our partnerships with premier financial institutions, we secure bespoke financing solutions, favorable interest rates, and expedited processing for our discerning clientele.',
    },
  ];

  return (
    <div className="w-full overflow-hidden pb-24 pt-32">
      <div className="mx-auto max-w-[1000px] px-6 md:px-10">
        <FadeIn>
          <h1 className="mb-6 text-center text-5xl font-display md:text-7xl">Our Services</h1>
          <p className="mx-auto mb-20 max-w-2xl text-center text-lg text-muted">An end-to-end advisory experience designed for the elite.</p>
        </FadeIn>

        <div className="space-y-16">
          {services.map((service, i) => (
            <FadeIn key={i} delay={0.1}>
              <div className="flex flex-col items-start gap-8 border-b border-stroke pb-16 last:border-0 last:pb-0 group cursor-default md:flex-row">
                <h2 className="w-full shrink-0 text-3xl font-display transition-colors duration-500 group-hover:text-accent md:w-1/3">{service.title}</h2>
                <p className="flex-1 text-lg leading-relaxed text-muted transition-colors duration-500 group-hover:text-text-primary">{service.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
