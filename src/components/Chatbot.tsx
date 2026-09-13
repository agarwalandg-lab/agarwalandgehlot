import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight, FiChevronDown, FiMessageCircle, FiSend, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

type Message = { id: number; role: 'assistant' | 'user'; text: string };

const welcome: Message = {
  id: 1,
  role: 'assistant',
  text: "Hey, I'm Aira — your property bestie at A&G. Tell me the location, budget, or BHK you want and I'll find the good stuff. Endless scrolling? Couldn't be us. ✨",
};

const quickPrompts = ['Ready-to-move homes', '3 BHK in Noida', 'Investment options', 'Book a site visit'];

const savageOffTopicReplies = [
  "Bold question for a property chatbot. I admire the confidence, even if the assignment was missed completely. 😭 Ask me about homes, investments, or site visits and I'll actually cook.",
  "Bestie, I'm Aira — not Google with better cheekbones. Ask me about property and watch me become useful again. ✨",
  "That question took a wrong turn and ended up in a real-estate office. I can help with projects, prices, locations, RERA, and site visits though.",
  "My expertise has boundaries, unlike your imagination. 😌 Bring it back to property and I'll give you answers worth reading.",
  "I could pretend to know, but misinformation is deeply embarrassing. Ask me something property-related, or tap below for a human advisor.",
  "Sir, this is a property desk. 😭 Give me a location, budget, or BHK and let's make this conversation productive.",
];

const abuseReplies = [
  "Cute vocabulary. Now try again with basic manners and I’ll be happy to help. 🙂",
  "I handle property enquiries, not tantrums. Reset the tone and we can continue.",
  "That attitude has zero carpet area and even less resale value. Keep it respectful, please.",
  "Your message failed the vibe check. Ask respectfully about a property and we’ll start fresh.",
  "Being rude is free, but it still looks overpriced. Let’s keep this conversation respectful.",
];

function offTopicReply(query: string) {
  const score = [...query].reduce((total, character) => total + character.charCodeAt(0), 0);
  return savageOffTopicReplies[score % savageOffTopicReplies.length];
}

function containsAbuse(query: string) {
  const abusiveTerms = [
    'fuck', 'fucking', 'bitch', 'bastard', 'asshole', 'idiot', 'stupid', 'moron',
    'chutiya', 'chutiye', 'madarchod', 'behenchod', 'bhenchod', 'gandu', 'harami',
  ];
  return abusiveTerms.some((term) => new RegExp(`\\b${term}\\b`, 'i').test(query));
}

function abuseReply(query: string) {
  const score = [...query].reduce((total, character) => total + character.charCodeAt(0), 0);
  return abuseReplies[score % abuseReplies.length];
}

function makeReply(input: string) {
  const query = input.toLowerCase();

  if (containsAbuse(query)) return abuseReply(query);

  if (/site visit|book|appointment|call|agent|human|contact/.test(query)) {
    return "Okay, serious buyer energy — we love to see it. Use “Speak to an advisor” below and share your preferred date and project. A real A&G expert will take it from there. 🤝";
  }

  const mentioned = projects.find((project) =>
    query.includes(project.title.toLowerCase()) || query.includes(project.slug.split('-')[0])
  );
  if (mentioned) {
    return `${mentioned.title}? Solid pick. It's in ${mentioned.location}, offers ${mentioned.configurations}, and is listed as ${mentioned.status}. Pricing is ${mentioned.price.toLowerCase()} — because luxury prices love a little mystery. Open the project page for sizes, amenities, RERA details, and live inventory.`;
  }

  const locations = ['greater noida', 'indirapuram', 'vasundhara', 'ghaziabad', 'gurugram', 'noida', 'delhi'];
  const location = locations.find((item) => query.includes(item));
  const bedroom = query.match(/\b([2-5])\s*(?:bhk|bed)/)?.[1];
  const readyOnly = /ready|completed|resale|move in/.test(query);
  let matches = projects.filter((project) => {
    const locationMatch = !location || project.location.toLowerCase().includes(location);
    const bedroomMatch = !bedroom || project.configurations.includes(`${bedroom} BHK`);
    const readyMatch = !readyOnly || /ready|completed/.test(project.status.toLowerCase());
    return locationMatch && bedroomMatch && readyMatch;
  });

  if (/commercial|office|retail/.test(query)) matches = projects.filter((project) => /commercial/i.test(project.category));
  if (/invest|investment|return|roi/.test(query)) {
    return "Let's make your money work harder than your group-chat planner. For a smart shortlist, I need your budget, holding period, rental goals, and risk comfort. We have new launches and ready-to-move options across Noida, Greater Noida, Ghaziabad, Gurugram, and Delhi.";
  }
  if (/price|budget|cost/.test(query) && !location && !bedroom) {
    return 'The budget is the main character here. Prices change by tower, floor, size, and live availability — tell me your approximate budget and preferred location, and we’ll skip the wildly unrealistic options.';
  }
  if (matches.length && (location || bedroom || readyOnly || /project|home|property|flat/.test(query))) {
    const shortlist = matches.slice(0, 3).map((project) => `${project.title} (${project.configurations}, ${project.location})`).join('; ');
    return `I did the scrolling so you don't have to. Top matches: ${shortlist}. Pick your favourite, or drop your budget and I'll make the shortlist even sharper.`;
  }
  if (/hello|hi|hey|help/.test(query)) return "Hey! Drop your preferred location, budget, or home size — try “3 BHK in Noida.” Give me the details; my crystal ball is currently in maintenance. 🔮";
  if (/rera/.test(query)) return 'RERA details are on each project page — because receipts matter. Please verify the latest record on the official state RERA portal before deciding; an A&G advisor can help review the paperwork.';

  return offTopicReply(query);
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);

  const submit = async (value: string) => {
    const clean = value.trim();
    if (!clean || isTyping) return;
    const userMessage: Message = { id: Date.now(), role: 'user', text: clean };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.map(({ role, text }) => ({ role, text })),
          catalogue: projects.map(({ title, location, configurations, status, price, category, rera, possession, highlights }) => ({ title, location, configurations, status, price, category, rera, possession, highlights })),
        }),
      });
      if (!response.ok) throw new Error('AI unavailable');
      const data: { reply?: string } = await response.json();
      if (!data.reply) throw new Error('Empty AI reply');
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: data.reply! }]);
    } catch {
      // The catalogue-aware local assistant keeps support working if the AI service is unavailable.
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: makeReply(clean) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(input);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[70] sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-[72px] right-0 flex h-[min(650px,calc(100vh-110px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-[28px] border border-stroke bg-bg shadow-2xl shadow-black/30"
            aria-label="A&G customer support chat"
          >
            <header className="relative overflow-hidden border-b border-white/10 bg-[#0d3154] px-5 pb-5 pt-5 text-white">
              <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-[#76aee5]/30 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 font-brand text-sm">A&amp;G</div>
                  <div>
                    <div className="flex items-center gap-2"><h2 className="font-medium">Aira</h2><span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider">AI</span></div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Online · replies instantly</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close chat"><FiChevronDown size={20} /></button>
              </div>
              <p className="relative mt-5 text-xs leading-relaxed text-white/65">Property guidance, available 24/7</p>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-surface/40 px-4 py-5" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-[#3979b9] text-white' : 'rounded-bl-md border border-stroke bg-bg text-text-primary'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex justify-start"><div className="flex gap-1 rounded-2xl rounded-bl-md border border-stroke bg-bg px-4 py-4"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-.3s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-.15s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" /></div></div>}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickPrompts.map((prompt) => <button key={prompt} onClick={() => submit(prompt)} className="rounded-full border border-stroke bg-bg px-3 py-2 text-left text-[11px] text-muted transition hover:border-[#4e85bf] hover:text-text-primary">{prompt}</button>)}
                </div>
              )}
            </div>

            <div className="border-t border-stroke bg-bg p-3">
              <Link to="/contact" onClick={() => setIsOpen(false)} className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-xs text-text-primary transition hover:bg-stroke">Speak to an advisor <FiArrowRight /></Link>
              <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-stroke bg-surface px-3 py-2 focus-within:border-[#4e85bf]">
                <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-text-primary outline-none placeholder:text-muted" placeholder="Ask about a property…" aria-label="Chat message" />
                <button type="submit" disabled={!input.trim() || isTyping} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3979b9] text-white transition hover:bg-[#2f6da9] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><FiSend size={15} /></button>
              </form>
              <p className="mt-2 text-center text-[9px] text-muted">AI responses may need verification · A&amp;G customer support</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="group relative flex h-14 items-center gap-2.5 rounded-full bg-[#3979b9] px-4 text-white shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-[#2f6da9] sm:h-16 sm:px-5"
        aria-label={isOpen ? 'Close A&G assistant' : 'Open A&G assistant'}
        aria-expanded={isOpen}
      >
        <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-bg bg-emerald-400" />
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={23} />}
        <span className="hidden text-sm font-medium sm:block">Ask Aira</span>
      </button>
    </div>
  );
}
