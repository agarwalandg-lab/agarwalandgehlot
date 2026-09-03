import { motion } from 'framer-motion';

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

export default function Plots() {
  const categories = [
    {
      title: "Residential Plots",
      desc: "Build the home of your dreams on your own terms. We offer clear-title residential plots in elite, carefully planned communities. Secure a piece of premium land in serene environments with excellent infrastructure and connectivity."
    },
    {
      title: "Commercial Plots",
      desc: "Strategically located commercial land parcels designed for high-return developments. Whether you intend to build a retail complex or a corporate office, our commercial plots provide the ideal foundation in high-visibility, high-traffic zones."
    },
    {
      title: "Township Plots",
      desc: "Invest in the future with plots located within mega-townships. Benefit from integrated urban planning, complete with commercial centers, educational institutions, and healthcare facilities right at your doorstep."
    },
    {
      title: "Future Growth Areas",
      desc: "Stay ahead of the curve. We specialize in identifying land parcels in emerging corridors poised for rapid infrastructure development. Investing in these future growth areas guarantees exceptional long-term capital appreciation."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Premium Plots</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Secure your legacy with prime land acquisitions in high-growth corridors.</p>
        </FadeIn>
        
        <div className="space-y-16">
          {categories.map((cat, i) => (
            <FadeIn key={i} delay={0.1}>
              <div className="flex flex-col md:flex-row gap-8 items-start border-b border-stroke pb-16 last:border-0 last:pb-0 group cursor-default">
                <h2 className="text-3xl font-display w-full md:w-1/3 shrink-0 group-hover:text-accent transition-colors duration-500">{cat.title}</h2>
                <p className="text-muted leading-relaxed flex-1 text-lg group-hover:text-text-primary transition-colors duration-500">{cat.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
