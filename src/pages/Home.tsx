import { useEffect, useRef } from 'react';
import gsap from 'gsap';
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

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".name-reveal", { opacity: 1, y: 0, duration: 1.2, delay: 0.1 });
    tl.to(".blur-in", { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 }, "-=1");
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center px-6">
        <video
          ref={videoRef}
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0 scale-105"
        />
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent z-0"></div>

        <div className="relative z-10 flex flex-col items-center max-w-5xl mt-16">
          <p className="text-xs text-white uppercase tracking-[0.3em] mb-8 blur-in opacity-0 translate-y-5" style={{ filter: 'blur(10px)' }}>A&G Real Estate</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[1] tracking-tight text-white mb-6 name-reveal opacity-0 translate-y-12">
            Elevating Your Address. <br /> Defining Your Legacy.
          </h1>
          <p className="text-base md:text-lg text-white max-w-2xl mb-12 blur-in opacity-0 translate-y-5" style={{ filter: 'blur(10px)' }}>
            Discover premium residential and commercial spaces curated for the most discerning individuals across Delhi NCR. Step into a world of architectural brilliance, strategic locations, and unmatched investment potential.
          </p>

          <div className="inline-flex gap-4 blur-in opacity-0 translate-y-5 flex-col sm:flex-row" style={{ filter: 'blur(10px)' }}>
            <Link to="/projects" className="group relative bg-text-primary text-bg hover:bg-bg hover:text-text-primary rounded-full text-sm px-8 py-4 hover:scale-105 transition-all w-full sm:w-auto overflow-hidden">
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
              <span className="relative z-10">Explore Premium Properties</span>
            </Link>
            <Link to="/contact" className="group relative border border-stroke bg-bg text-text-primary hover:border-transparent rounded-full text-sm px-8 py-4 hover:scale-105 transition-all w-full sm:w-auto overflow-hidden">
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
              <span className="relative z-10 bg-bg w-full h-full rounded-full flex items-center justify-center group-hover:bg-transparent transition-colors">Schedule a Private Viewing</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-stroke bg-bg py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div><p className="text-xs uppercase tracking-[0.3em] text-muted">A&amp;G Smart Advisory</p><h2 className="mt-4 max-w-2xl text-4xl font-display md:text-5xl">What are you looking for?</h2><p className="mt-4 max-w-xl leading-relaxed text-muted">Choose an objective and location to search the current A&amp;G property catalogue.</p></div>
              <Link to="/property-finder" className="shrink-0 bg-text-primary px-7 py-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-bg">Open Property Finder</Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-px bg-stroke md:grid-cols-4">
              {[['Buy', 'buy'], ['Rent', 'rent'], ['Sell', 'sell'], ['Talk to Agent', 'agent']].map(([label, value]) => <Link key={value} to={`/property-finder?requirement=${value}`} className="group flex min-h-28 items-center justify-between bg-bg p-5 text-lg uppercase transition-colors hover:bg-surface"><span>{label}</span><span className="transition-transform group-hover:translate-x-1">→</span></Link>)}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-bg py-24 border-b border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-display mb-6">A Heritage of Trust in Modern Real Estate</h2>
              <p className="text-muted leading-relaxed mb-6 text-lg">
                We are more than property advisors; we are curators of exceptional lifestyles and strategic commercial addresses. Our journey is defined by an unwavering commitment to bringing you properties that reflect your ambitions. 
              </p>
              <p className="text-muted leading-relaxed text-lg">
                Navigating the dynamic landscape of Delhi NCR, Noida, and Gurgaon, we handpick spaces that offer enduring value, superior design, and absolute peace of mind. Your legacy deserves a foundation built on expertise and integrity.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-bg py-24 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-16">
              <div className="w-8 h-px bg-stroke hidden md:block"></div>
              <span className="text-xs text-muted uppercase tracking-[0.3em] text-center">Featured Projects</span>
              <div className="w-8 h-px bg-stroke hidden md:block"></div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Project 1 */}
            <FadeIn delay={0.1}>
              <div className="group relative bg-surface border border-stroke rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-500 shadow-lg hover:shadow-2xl shadow-black/20">
                <div className="aspect-[4/3] bg-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none z-20" style={{ background: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  <img src="/cover/ivory-county.png" alt="Ivory County" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">Sector 115, Noida • Ultra-Luxury Apartments</div>
                  <h3 className="text-3xl font-display mb-4">Ivory County</h3>
                  <p className="text-muted mb-6 flex-1">
                    A sanctuary of refined living. Ivory County offer uninterrupted vistas, bespoke interiors, and world-class amenities designed for the modern elite. Experience a lifestyle where luxury knows no bounds.
                  </p>
                  <div className="mb-8">
                    <strong className="text-sm">Key Highlights:</strong>
                    <ul className="text-sm text-muted mt-2 space-y-1">
                      <li>• Golf-course facing</li>
                      <li>• Expansive balconies</li>
                      <li>• Private elevator access</li>
                    </ul>
                  </div>
                  <Link to="/projects/ivory-county-sector-115-noida" className="text-sm font-medium border border-stroke rounded-full px-6 py-3 text-center hover:bg-text-primary hover:text-bg transition-colors">View Project Details</Link>
                </div>
              </div>
            </FadeIn>

            {/* Project 2 */}
            <FadeIn delay={0.2}>
              <div className="group relative bg-surface border border-stroke rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-500 shadow-lg hover:shadow-2xl shadow-black/20">
                <div className="aspect-[4/3] bg-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none z-20" style={{ background: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  <img src="/cover/clove-county.png" alt="Clove County" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">Clove County, Noida • Premium Commercial Office Space</div>
                  <h3 className="text-3xl font-display mb-4">Clove County</h3>
                  <p className="text-muted mb-6 flex-1">
                    Redefine your corporate identity. Clove County sits at the pinnacle of commercial excellence, offering cutting-edge infrastructure to accelerate your business growth.
                  </p>
                  <div className="mb-8">
                    <strong className="text-sm">Key Highlights:</strong>
                    <ul className="text-sm text-muted mt-2 space-y-1">
                      <li>• Platinum LEED certified</li>
                      <li>• State-of-the-art security</li>
                      <li>• High-street retail on ground floor</li>
                    </ul>
                  </div>
                  <Link to="/projects/clove-county-sector-151-noida" className="text-sm font-medium border border-stroke rounded-full px-6 py-3 text-center hover:bg-text-primary hover:text-bg transition-colors">View Project Details</Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-surface py-24 border-y border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-display mb-16 text-center">Why Choose Us</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Market Expertise", desc: "Leverage our deep understanding of the Delhi NCR market to secure properties with maximum appreciation potential and prime connectivity." },
              { title: "Verified Properties", desc: "Every listing undergoes rigorous legal and structural due diligence to guarantee absolute safety and transparency for your investment." },
              { title: "Customer Trust", desc: "Our foundation is built on lasting relationships. We prioritize your unique needs, ensuring a seamless and strictly confidential transaction process." },
              { title: "Investment Guidance", desc: "Gain access to data-driven insights and exclusive off-market opportunities that align perfectly with your wealth-building strategies." },
              { title: "End-to-End Assistance", desc: "From the initial property viewing to the final registration, our dedicated advisory team remains by your side, managing every intricate detail." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex flex-col group">
                  <h3 className="text-xl mb-3 font-medium group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="bg-bg py-24 border-b border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-display mb-16">Property Categories</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Residential", desc: "Discover a curated selection of premium apartments, penthouses, and independent villas crafted for unparalleled comfort and modern elegance.", link: "/residential" },
              { title: "Commercial", desc: "Strategically located office spaces and retail shops designed to elevate your business presence and attract maximum footfall.", link: "/commercial" },
              { title: "Plots", desc: "Secure your future with prime residential and commercial plots in rapidly developing corridors, offering total freedom to build your vision.", link: "/plots" },
              { title: "Luxury Properties", desc: "An exclusive portfolio of ultra-luxury estates and bespoke residences reserved for individuals who demand the absolute best in life.", link: "/projects" }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link to={item.link} className="block p-8 border border-stroke rounded-3xl hover:bg-surface hover:-translate-y-1 transition-all duration-300 group h-full">
                  <h3 className="text-2xl font-display mb-4 group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted mb-8">{item.desc}</p>
                  <div className="text-xs uppercase tracking-widest text-accent flex items-center gap-2">Explore <span className="group-hover:translate-x-2 transition-transform">→</span></div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-bg py-24 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-display mb-4">Services Overview</h2>
                <p className="text-muted max-w-lg">Comprehensive real estate advisory ensuring your property transactions are secure, profitable, and effortless.</p>
              </div>
              <Link to="/services" className="border border-stroke rounded-full px-6 py-3 hover:bg-text-primary hover:text-bg transition-colors text-sm hover:scale-105">View All Services</Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { title: "Property Buying Assistance", desc: "Tailored property hunting based on your exact lifestyle and investment requirements." },
              { title: "Property Selling Assistance", desc: "Strategic marketing and elite networking to secure the highest value for your premium asset." },
              { title: "Investment Consultancy", desc: "Expert portfolio building and ROI analysis in the fast-growing NCR real estate market." },
              { title: "Documentation Support", desc: "Flawless handling of legal paperwork, title checks, and registration processes." },
              { title: "Home Loan Assistance", desc: "Seamless financial advisory and rapid loan processing through our network of leading banking partners." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-4 group cursor-default">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-24 border-y border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-display mb-16 text-center">Client Testimonials</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Their understanding of the luxury market in Gurgaon is truly unmatched. They found us a residence that perfectly matched our taste, making the entire acquisition process completely effortless and entirely transparent.", author: "Rahul S." },
              { quote: "When expanding our business operations into Noida, we needed a commercial space that reflected our brand value. The advisory team secured a prime location for us with exceptional professionalism.", author: "Anjali V." },
              { quote: "Investing in real estate always felt daunting until I consulted their team. Their data-driven approach to high-growth corridors helped me secure a plot that has already seen remarkable appreciation.", author: "Vikram M." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 border border-stroke rounded-3xl bg-bg flex flex-col justify-between h-full hover:border-text-primary/30 transition-colors">
                  <p className="text-muted text-sm leading-relaxed mb-8">"{item.quote}"</p>
                  <div className="font-medium text-sm">— {item.author}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bg py-24 overflow-hidden">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-display mb-16 text-center">Frequently Asked Questions</h2>
          </FadeIn>
          <div className="space-y-8">
            {[
              { q: "What regions do you primarily operate in?", a: "We specialize in premium real estate across Delhi NCR, with a strong focus on high-growth corridors in Noida and Gurgaon." },
              { q: "Are all your properties legally verified?", a: "Absolutely. Every property in our portfolio undergoes a stringent multi-point legal verification process to ensure clean titles and risk-free transactions." },
              { q: "Do you assist with financing and home loans?", a: "Yes, we provide end-to-end financial assistance. Our dedicated team coordinates with top-tier financial institutions to secure the most favorable loan terms for our clients." },
              { q: "Can you help me build a real estate investment portfolio?", a: "Yes, our investment consultancy service is designed specifically to identify high-yield assets, manage risk, and maximize your long-term capital appreciation and rental yields." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border-b border-stroke pb-6 group cursor-default">
                  <h3 className="text-lg font-medium mb-3 group-hover:text-accent transition-colors">{item.q}</h3>
                  <p className="text-muted text-sm">{item.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent text-bg py-24 text-center overflow-hidden">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-display mb-6 text-black">Ready to Secure Your Next Prime Asset?</h2>
            <p className="text-black/80 text-lg mb-10">Connect with our expert advisors today to explore exclusive opportunities in the residential and commercial sectors.</p>
            <Link to="/contact" className="inline-block bg-black text-white hover:scale-105 border border-transparent rounded-full px-10 py-4 text-sm font-medium transition-all shadow-xl shadow-black/20">
              Request a Consultation
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
