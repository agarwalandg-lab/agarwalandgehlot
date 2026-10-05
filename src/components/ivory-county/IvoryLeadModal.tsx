import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { X, CheckCircle2, Mail, User, Calendar, Home, ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { getUtmParams, trackEvent } from '../../utils/analytics';

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  email: z.string().email('Please enter a valid email address'),
  configuration: z.string().optional(),
  preferredVisitDate: z.string().optional(),
  budgetRange: z.string().optional(),
  message: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export type ModalType = 'brochure' | 'price' | 'floorplan' | 'sitevisit' | 'general';

interface IvoryLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  unitTitle?: string;
  sourceSection?: string;
}

export default function IvoryLeadModal({
  isOpen,
  onClose,
  type = 'general',
  unitTitle,
  sourceSection = 'microsite',
}: IvoryLeadModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customError, setCustomError] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<LeadFormData>({
    defaultValues: {
      configuration: unitTitle || '3 BHK Luxury Suite',
      budgetRange: '₹3 Cr - ₹5 Cr',
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      trackEvent('modal_open', { type, unitTitle, sourceSection });
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
      setCustomError({});
      reset();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, type, unitTitle, sourceSection, reset]);

  if (!isOpen) return null;

  const getModalHeader = () => {
    switch (type) {
      case 'brochure':
        return {
          title: 'Download Official E-Brochure',
          subtitle: 'Receive the complete 48-page architectural catalog, floor blueprints & master layout instantly.',
          buttonText: 'Download Brochure Now',
          icon: Download,
        };
      case 'price':
        return {
          title: 'Request Detailed Cost Sheet',
          subtitle: 'Get all-inclusive price breakdown, floor rise charges, PLC & 40:60 payment schedules.',
          buttonText: 'Get Instant Price Sheet',
          icon: ArrowRight,
        };
      case 'floorplan':
        return {
          title: `Get ${unitTitle || 'Residence'} Floor Plan`,
          subtitle: 'Detailed architectural dimension drawings, carpet area breakdown & room layouts.',
          buttonText: 'Send Floor Plans',
          icon: Home,
        };
      case 'sitevisit':
        return {
          title: 'Schedule Private VIP Site Tour',
          subtitle: 'Experience sample mock-up residences, tower elevations & clubhouse walkthrough with an A&G Advisor.',
          buttonText: 'Confirm VIP Site Visit',
          icon: Calendar,
        };
      default:
        return {
          title: 'Enquire About Ivory County',
          subtitle: 'Connect with a certified A&G Luxury Property Consultant for priority unit allocations.',
          buttonText: 'Submit Enquiry',
          icon: ArrowRight,
        };
    }
  };

  const header = getModalHeader();
  const Icon = header.icon;

  const onFormSubmit = async (formData: LeadFormData) => {
    setCustomError({});
    const validation = leadSchema.safeParse(formData);

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) {
          errMap[String(err.path[0])] = err.message;
        }
      });
      setCustomError(errMap);
      return;
    }

    setLoading(true);
    const utm = getUtmParams();

    const payload = {
      ...formData,
      project: 'Ivory County Sector 115 Noida',
      modalType: type,
      sourceSection,
      unitTitle: unitTitle || formData.configuration,
      utm,
      timestamp: new Date().toISOString(),
    };

    trackEvent('lead_submission', payload);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setLoading(false);

      if (type === 'brochure') {
        const link = document.createElement('a');
        link.href = '/project-details/ivory map.webp';
        link.download = 'Ivory-County-Brochure-AG-Realtors.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const whatsappDirectMsg = encodeURIComponent(
    `Hi A&G Realtors, I am requesting immediate information regarding Ivory County Sector 115 (${type.toUpperCase()} request). Please assist.`
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#DED3C1]/30 bg-[#171717] p-6 text-white shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B59A6A]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#B59A6A] animate-pulse" />
              Ivory County • Sector 115 Noida
            </div>

            <h2 id="modal-title" className="mt-2 text-2xl font-display md:text-3xl text-[#F5F1E8]">
              {header.title}
            </h2>
            <p className="mt-2 text-sm text-[#DED3C1]/80 leading-relaxed">
              {header.subtitle}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-white/10 py-3 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={15} /> UP RERA Approved
              </span>
              <span>•</span>
              <span>Zero Brokerage</span>
              <span>•</span>
              <span>Direct Developer Allocation</span>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                  Full Name <span className="text-[#B59A6A]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name')}
                    className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 transition-colors focus:border-[#B59A6A] focus:bg-white/10 focus:outline-none ${
                      customError.name ? 'border-rose-500' : 'border-white/15'
                    }`}
                  />
                </div>
                {customError.name && (
                  <p className="mt-1 text-xs text-rose-400">{customError.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                  Mobile Number (India) <span className="text-[#B59A6A]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    {...register('phone')}
                    className={`w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder-white/40 transition-colors focus:border-[#B59A6A] focus:bg-white/10 focus:outline-none ${
                      customError.phone ? 'border-rose-500' : 'border-white/15'
                    }`}
                  />
                </div>
                {customError.phone && (
                  <p className="mt-1 text-xs text-rose-400">{customError.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                  Email Address <span className="text-[#B59A6A]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 transition-colors focus:border-[#B59A6A] focus:bg-white/10 focus:outline-none ${
                      customError.email ? 'border-rose-500' : 'border-white/15'
                    }`}
                  />
                </div>
                {customError.email && (
                  <p className="mt-1 text-xs text-rose-400">{customError.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                    Preferred Configuration
                  </label>
                  <select
                    {...register('configuration')}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#222] py-3 px-3 text-sm text-white focus:border-[#B59A6A] focus:outline-none"
                  >
                    <option value="3 BHK Luxury Suite (2,034 sq ft)">3 BHK (2,034 sq ft)</option>
                    <option value="3 BHK + Utility Grand (2,304 sq ft)">3 BHK + Utility (2,304 sq ft)</option>
                    <option value="4 BHK Grand Residence (2,727 sq ft)">4 BHK Grand (2,727 sq ft)</option>
                    <option value="4 BHK Estate Suite (3,195 sq ft)">4 BHK Estate (3,195 sq ft)</option>
                    <option value="Ivory Gold 4 BHK Palatial (3,987 sq ft)">Ivory Gold 4 BHK (3,987+ sq ft)</option>
                    <option value="Ivory Gold 5 BHK Penthouse (6,939 sq ft)">Ivory Gold 5 BHK (6,939 sq ft)</option>
                  </select>
                </div>

                {type === 'sitevisit' ? (
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      {...register('preferredVisitDate')}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#222] py-3 px-3 text-sm text-white focus:border-[#B59A6A] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                      Budget Expectation
                    </label>
                    <select
                      {...register('budgetRange')}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#222] py-3 px-3 text-sm text-white focus:border-[#B59A6A] focus:outline-none"
                    >
                      <option value="₹2.5 Cr - ₹3.5 Cr">₹2.5 Cr - ₹3.5 Cr</option>
                      <option value="₹3.5 Cr - ₹5 Cr">₹3.5 Cr - ₹5 Cr</option>
                      <option value="₹5 Cr - ₹8 Cr">₹5 Cr - ₹8 Cr</option>
                      <option value="₹8 Cr+ (Ivory Gold)">₹8 Cr+ (Ivory Gold)</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B59A6A] to-[#D4AF37] px-6 py-4 text-sm font-semibold tracking-wide text-black shadow-lg shadow-[#B59A6A]/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                ) : (
                  <>
                    <Icon size={18} />
                    {header.buttonText}
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-white/50">
                🔒 Your privacy is 100% protected. No spam. A verified luxury advisor will contact you shortly.
              </p>
            </form>

            <div className="mt-5 border-t border-white/10 pt-4 text-center">
              <span className="text-xs text-white/60">Prefer instant WhatsApp communication? </span>
              <a
                href={`https://wa.me/919654322224?text=${whatsappDirectMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { type: 'modal_shortcut' })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
              >
                Chat on WhatsApp ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="mt-4 text-2xl font-display text-[#F5F1E8]">
              Thank You! Request Received
            </h3>
            <p className="mt-2 text-sm text-[#DED3C1]/80 max-w-md mx-auto leading-relaxed">
              Our Senior Ivory County Portfolio Manager has received your details. We have also queued the official project documents to your contact.
            </p>

            {type === 'brochure' && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                ✓ Brochure download initiated automatically.
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/919654322224?text=${whatsappDirectMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Connect on WhatsApp Instantly
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
