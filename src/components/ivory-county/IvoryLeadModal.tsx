import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { getUtmParams, trackEvent } from '../../utils/analytics';
import { supabase } from '../../lib/supabase';

const leadSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  propertyType: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export type ModalType = 'brochure' | 'price' | 'general';

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
      propertyType: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      reset({ propertyType: '' });
      trackEvent('modal_open', { type, unitTitle, sourceSection });
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
      setCustomError({});
      reset({ propertyType: '' });
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
          title: 'Request Price Sheet',
          subtitle: 'EXCLUSIVE BUYER BENEFITS',
          priceText: 'Price starts from ₹2.95 Cr*',
          buttonText: 'GET INSTANT PRICE & BROCHURE →',
          icon: ArrowRight,
        };
      case 'price':
        return {
          title: 'Request Price Sheet',
          subtitle: 'EXCLUSIVE BUYER BENEFITS',
          priceText: 'Price starts from ₹2.95 Cr*',
          buttonText: 'GET INSTANT PRICE & BROCHURE →',
          icon: ArrowRight,
        };
      default:
        return {
          title: 'Request Price Sheet',
          subtitle: 'EXCLUSIVE BUYER BENEFITS',
          priceText: 'Price starts from ₹2.95 Cr*',
          buttonText: 'GET INSTANT PRICE & BROCHURE →',
          icon: ArrowRight,
        };
    }
  };

  const header = getModalHeader();
  const Icon = header.icon;

  const onFormSubmit = async (formData: LeadFormData) => {
    setCustomError({});
    const normalizedFormData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').replace(/^91(\d{10})$/, '$1'),
    };
    const validation = leadSchema.safeParse(normalizedFormData);

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
      unitTitle: unitTitle || formData.propertyType,
      utm,
      timestamp: new Date().toISOString(),
    };

    try {
      const { error, data } = await supabase.from('ivory_county_leads').insert({
        full_name: 'Prospective Buyer',
        phone: validation.data.phone,
        email: 'N/A',
        preferred_configuration: validation.data.propertyType || null,
        budget_expectation: null,
        preferred_visit_date: null,
        message: null,
        project: payload.project,
        modal_type: payload.modalType,
        source_section: payload.sourceSection,
        unit_title: payload.unitTitle || null,
        utm_params: payload.utm,
      }).select();

      console.log('Supabase response:', { error, data });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Lead saved successfully:', data);
      trackEvent('lead_submission', {
        project: payload.project,
        modalType: payload.modalType,
        sourceSection: payload.sourceSection,
        unitTitle: payload.unitTitle,
      });
      setSubmitted(true);

      if (type === 'brochure') {
        const link = document.createElement('a');
        link.href = '/project-details/ivory map.webp';
        link.download = 'Ivory-County-Brochure-AG-Realtors.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Unable to save Ivory County enquiry:', error);
      console.error('Error type:', typeof error);
      console.error('Error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      // Fallback: Still allow brochure download even if database fails
      if (type === 'brochure') {
        const link = document.createElement('a');
        link.href = '/project-details/ivory map.webp';
        link.download = 'Ivory-County-Brochure-AG-Realtors.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSubmitted(true);
        setCustomError({ form: 'Brochure downloaded (database save failed). Contact support.' });
      } else {
        setCustomError({ form: `Error: ${errorMessage}. Please try again or contact us on WhatsApp.` });
      }
    } finally {
      setLoading(false);
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
            <p className="mt-2 text-lg font-semibold text-[#B59A6A]">
              {header.priceText}
            </p>
            <p className="mt-1 text-sm text-[#DED3C1]/80 leading-relaxed">
              {header.subtitle}
            </p>

            <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                  MOBILE NUMBER <span className="text-[#B59A6A]">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
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
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-3">
                  SELECT PROPERTY TYPE
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-white/15 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      value="3-4-bhk"
                      {...register('propertyType')}
                      className="w-4 h-4 accent-[#B59A6A]"
                    />
                    <div>
                      <div className="font-medium text-white">3 & 4 BHK</div>
                      <div className="text-xs text-white/60">2,034 - 3,195 sq ft</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-white/15 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      value="ivory-gold"
                      {...register('propertyType')}
                      className="w-4 h-4 accent-[#B59A6A]"
                    />
                    <div>
                      <div className="font-medium text-white">Ivory Gold</div>
                      <div className="text-xs text-white/60">3,987 - 6,939 sq ft</div>
                    </div>
                  </label>
                </div>
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

              {customError.form && <p role="alert" className="text-center text-xs text-rose-400">{customError.form}</p>}

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-[10px] text-white/40">
                  RERA: UPRERAPRJ256314 &nbsp; T&C Apply*
                </p>
              </div>
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
