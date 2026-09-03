import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: contentRef.current,
      pinSpacing: false
    });

    const items = gsap.utils.toArray('.parallax-item');
    items.forEach((item: any, i: number) => {
      const speed = i % 2 === 0 ? 0.5 : 1.2;
      gsap.to(item, {
        y: -500 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-bg overflow-hidden pt-16">
      <div ref={contentRef} className="absolute inset-x-0 top-0 z-10 flex h-screen w-full flex-col items-center justify-center pointer-events-none">
        <div className="flex w-full items-center justify-center px-6 pointer-events-auto">
          <div className="w-full max-w-3xl rounded-3xl border border-stroke/50 bg-bg/80 p-8 text-center backdrop-blur-md">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">A&G Portfolio</p>
            <h2 className="mb-6 text-center text-5xl font-body font-light md:text-7xl">Featured <span className="font-display">Projects</span></h2>
            <p className="mx-auto mb-8 max-w-md text-muted">A curated selection of the most prestigious addresses in the NCR region, crafted for luxury and high returns.</p>
            <Link to="/contact" className="rounded-full border border-stroke bg-surface px-8 py-3 text-text-primary transition-colors hover:bg-text-primary hover:text-bg">
              Enquire Now
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pt-[50vh] pb-[50vh] z-20 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 md:gap-40 relative">
            {projects.map((proj, i) => (
              <div key={i} className={`parallax-item pointer-events-auto ${i % 2 === 0 ? 'mt-48 md:mt-96' : ''}`}>
                <Link to={`/projects/${proj.slug}`} className="block aspect-square max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden relative group">
                  <img src={proj.image} alt={proj.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none" style={{ background: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-display text-white drop-shadow-md">{proj.title}</h3>
                    <p className="text-xs text-white/80 uppercase tracking-widest mt-1 drop-shadow-md">{proj.type}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
