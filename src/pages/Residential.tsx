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
      desc: "Experience elevated living in our collection of luxury apartments. Featuring contemporary designs, state-of-the-art smart home technologies, and world-class community amenities, these residences are crafted for those who expect nothing but the finest in modern urban living."
    },
    {
      title: "Premium Residences",
      desc: "Our premium residences strike the perfect balance between sophistication and warmth. Located in the most sought-after neighborhoods, these homes offer spacious interiors, elegant finishes, and proximity to elite schools, healthcare, and entertainment hubs."
    },
    {
      title: "Villas",
      desc: "Discover the ultimate expression of privacy and exclusivity. Our curated selection of independent villas offers sprawling lawns, private pools, and grand architectural designs. Step into a sanctuary where luxury is defined by space and serenity."
    },
    {
      title: "Independent Homes",
      desc: "For those who value autonomy and custom living, we offer prime independent homes. Situated in peaceful, secure locales, these properties provide the perfect canvas to create a living space that is entirely your own."
    },
    {
      title: "Gated Communities",
      desc: "Safety meets a vibrant lifestyle in our featured gated communities. Enjoy exclusive access to clubhouses, manicured parks, and sports facilities, all within a highly secure, meticulously maintained environment ideal for families."
    }
  ];

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-center">Residential</h1>
          <p className="text-center text-muted max-w-2xl mx-auto mb-20 text-lg">Curating the finest homes for elevated living.</p>
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
