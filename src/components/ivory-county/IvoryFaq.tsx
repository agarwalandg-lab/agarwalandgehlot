import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';
import { trackEvent } from '../../utils/analytics';

export default function IvoryFaq() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const categories = ['All', 'General', 'Pricing & Payment', 'Amenities & Handover', 'Legal & RERA'];

  const filteredFaqs = IVORY_COUNTY_DATA.faqs.filter((faq) => {
    if (activeCategory === 'All') return true;
    return faq.category === activeCategory;
  });

  const toggleFaq = (idx: number) => {
    setOpenIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <section id="faqs" className="w-full bg-[#171717] py-24 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B59A6A]">
            Clear Answers
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-light text-[#F5F1E8]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-[#DED3C1]/80">
            Everything you need to know about Ivory County Sector 115 Noida, RERA approvals, pricing, and possession.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                trackEvent('amenity_tab_change', { faqCategory: cat });
              }}
              className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#B59A6A] text-black font-semibold shadow-md'
                  : 'bg-white/5 text-[#DED3C1] hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-12 space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = !!openIndices[index];
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e1a17] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/5 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-display font-medium text-[#F5F1E8] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[#B59A6A] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 p-5 bg-[#171717]/80 text-sm text-[#DED3C1]/85 font-light leading-relaxed animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
