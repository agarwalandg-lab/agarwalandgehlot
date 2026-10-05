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
      desc: "Before considering a residential plot, verify title, land use, layout approval, access, utilities, encumbrances and development restrictions with official records and qualified professionals."
    },
    {
      title: "Commercial Plots",
      desc: "For commercial land, confirm permitted use, development controls, access, utility capacity, title and any conditions that apply to the specific parcel."
    },
    {
      title: "Township Plots",
      desc: "For a plot within a township, verify the approved layout, services, maintenance obligations, transfer conditions and which facilities are operational."
    },
    {
      title: "Future Growth Areas",
      desc: "Infrastructure proposals and delivery timelines can change. Check official plans and current access, and do not treat proposed development as a guarantee of price appreciation."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Plot Buying Advisory in Noida</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Learn what to check for land use, title, approvals and access before considering a plot in Noida or Delhi NCR.</p>
        </FadeIn>
        
        <div className="space-y-16">
          {categories.map((cat, i) => (
            <FadeIn key={i} delay={0.1}>
              <div className="flex flex-col md:flex-row gap-8 items-start border-b border-stroke pb-16 last:border-0 last:pb-0 group cursor-default">
                <h2 className="text-3xl font-display w-full md:w-1/3 shrink-0 text-text-primary group-hover:opacity-80 transition-opacity duration-300">{cat.title}</h2>
                <p className="text-muted leading-relaxed flex-1 text-lg group-hover:text-text-primary transition-colors duration-500">{cat.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
