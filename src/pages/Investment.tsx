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

export default function Investment() {
  const categories = [
    {
      title: "Set an Investment Objective",
      desc: "Decide whether a property is intended for personal use, rental income, resale or portfolio diversification. Each objective has a different time horizon, cash-flow profile and risk, and no property investment outcome is guaranteed."
    },
    {
      title: "Research Noida and Delhi NCR Locations",
      desc: "Transport and development plans can affect a location, but timelines, routes and market effects may change. Check current official updates and existing access, and compare local supply, services and demand before assigning value to a future project."
    },
    {
      title: "Model Costs and Resale Conditions",
      desc: "Include stamp duty, registration, financing, taxes, maintenance, repairs and transaction costs in your analysis. Consider how long you may hold the asset and who a potential future buyer could be. Past price movement does not predict future appreciation."
    },
    {
      title: "Estimate Rental Income Carefully",
      desc: "Estimate rent using recent comparable leases, then account for vacancy, tenant turnover, maintenance, furnishing, taxes and management costs. Rental yield in Noida varies by unit and market conditions; an estimate is not a promise of future income."
    },
    {
      title: "Complete Independent Due Diligence",
      desc: "Property carries legal, construction, liquidity and market risks. Verify the promoter and project records, approvals, title, sanctioned plans, payment terms and possession status with official sources and qualified legal and financial professionals. Due diligence cannot eliminate every risk."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Property Investment in Noida</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">A practical framework for assessing property costs, documents, rental assumptions and risk in Noida and Delhi NCR. Returns are not guaranteed.</p>
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
