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

export default function Residential() {
  const categories = [
    {
      title: "Luxury Apartments",
      desc: "Compare luxury apartments by their actual layout, usable area, specifications, services and location. Confirm which features are included for the specific unit and project phase."
    },
    {
      title: "Premium Residences",
      desc: "Review premium residences against your budget, commute and day-to-day needs. Verify the exact address, nearby services, area statement, project status and current availability."
    },
    {
      title: "Villas",
      desc: "For villas, check plot and built-up areas, land title, permitted use, approvals, maintenance obligations and the condition of the individual home."
    },
    {
      title: "Independent Homes",
      desc: "Independent homes can differ significantly in title, construction, services and permitted use. Have the property and its records reviewed by qualified professionals."
    },
    {
      title: "Gated Communities",
      desc: "Compare community rules, maintenance, security arrangements, facilities and recurring charges. Ask which amenities are operational and included for the unit you are considering."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Residential Property in Noida</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Compare residential property by location, layout, project status and current documentation across Noida and Delhi NCR.</p>
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
