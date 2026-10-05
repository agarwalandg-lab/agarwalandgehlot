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

export default function Commercial() {
  const categories = [
    {
      title: "Office Spaces in Noida",
      desc: "Compare office space in Noida by building location, floor plate, access, services, parking, operating costs and lease or purchase terms. Confirm the specifications and availability for each unit before planning an occupancy or investment."
    },
    {
      title: "Retail Shops and Commercial Space",
      desc: "When reviewing retail shops in Noida, assess the actual frontage, permitted use, access, surrounding occupancy, maintenance and fit-out requirements. Footfall and customer demand vary by location and time; request current evidence rather than relying on projections."
    },
    {
      title: "Commercial Towers",
      desc: "Commercial towers differ in floor plans, common facilities, operating costs, access and ownership structure. Review approved plans and the specific unit documentation, and compare the complete cost of ownership with suitable alternatives."
    },
    {
      title: "Business Parks and Office Locations",
      desc: "A business park may combine offices with shared services and amenities. Check which facilities are operational, what charges apply, how the property is managed and whether the location suits your staff, customers or tenants."
    },
    {
      title: "Commercial Property Investment",
      desc: "Commercial property investment involves vacancy, leasing, financing, maintenance and resale risks. Compare asking rent with signed lease evidence, account for downtime and expenses, and treat projected yields or appreciation as uncertain rather than guaranteed."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Commercial Property in Noida</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Review office space, retail shops and commercial projects in Noida with a focus on unit details, costs and documentation.</p>
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
