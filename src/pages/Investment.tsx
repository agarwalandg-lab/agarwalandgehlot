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
      title: "Why Invest in Real Estate",
      desc: "Real estate remains the most tangible, secure, and rewarding asset class. It provides a unique combination of steady passive income and long-term capital appreciation, acting as a powerful hedge against inflation and a cornerstone for generational wealth."
    },
    {
      title: "NCR Market Growth",
      desc: "The Delhi NCR region is experiencing unprecedented infrastructural development. With new expressways, expanding metro networks, and the upcoming international airport, Noida and Gurgaon are rapidly transforming into global economic hubs, driving immense value into the property market."
    },
    {
      title: "Long-Term Appreciation",
      desc: "We guide our clients toward properties with the strongest fundamentals. By investing in prime locations and premium developments, you secure assets that have historically demonstrated consistent, high-percentage value appreciation over the years."
    },
    {
      title: "Rental Income Potential",
      desc: "Generate robust and reliable cash flow. Our commercial and premium residential properties are located in high-demand zones, ensuring excellent tenant profiles, minimal vacancy rates, and superior rental yields year after year."
    },
    {
      title: "Safe Investment Opportunities",
      desc: "Your financial security is our priority. We exclusively recommend properties from renowned, financially stable developers with proven track records. Every investment opportunity is vetted through exhaustive legal and financial due diligence to eliminate risk."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Investment Advisory</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Data-driven strategies to build a highly profitable real estate portfolio.</p>
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
