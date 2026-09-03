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
      title: "Office Spaces",
      desc: "Transform your work environment with our premium office spaces. We offer Grade-A commercial properties equipped with intelligent infrastructure, sustainable designs, and premier facilities, ensuring your workspace fosters innovation and corporate excellence."
    },
    {
      title: "Retail Spaces",
      desc: "Position your brand for success. Our retail spaces are located in high-footfall corridors and premium commercial hubs. Designed for maximum visibility and customer engagement, these locations are ideal for luxury boutiques, flagship stores, and fine dining."
    },
    {
      title: "Commercial Towers",
      desc: "Establish your corporate headquarters in iconic commercial towers that define the city skyline. Offering expansive floor plates, elite networking environments, and unparalleled operational efficiency, these towers are the hallmark of business success."
    },
    {
      title: "Business Parks",
      desc: "Integrated business parks that offer a holistic corporate ecosystem. Featuring a blend of workspaces, recreational zones, and hospitality services, these parks are designed to attract top talent and support large-scale enterprise operations."
    },
    {
      title: "Investment Opportunities",
      desc: "Capitalize on the booming commercial sector. We identify high-yield commercial assets that promise robust rental income and steady capital appreciation, offering a secure and highly profitable avenue for wealth generation."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Commercial</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Strategic spaces engineered for corporate growth and high yields.</p>
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
