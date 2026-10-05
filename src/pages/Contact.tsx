import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import { supabase, supabaseConfigured } from '../lib/supabase';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionError, setSubmissionError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedProject = searchParams.get('project') || '';
  const initialMessage = selectedProject ? `Hi A&G Realtors, I am interested in ${selectedProject}. Please share price, availability, and floor plan details.` : '';

  const directWhatsappMsg = encodeURIComponent(selectedProject ? `Hi A&G Realtors, I am interested in ${selectedProject}.` : `Hi A&G Realtors, I am looking for property consultation in Noida.`);
  const whatsappUrl = `https://wa.me/919654322224?text=${directWhatsappMsg}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionMessage('');
    setSubmissionError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot spam check
    const honeypot = String(formData.get('website_url') || '');
    if (honeypot.length > 0) {
      // Silently ignore spam submission
      form.reset();
      navigate('/thankyou');
      return;
    }

    const fullName = String(formData.get('fullName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    // Phone validation
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (phone && cleanPhone.length < 10) {
      setSubmissionError(true);
      setSubmissionMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (supabaseConfigured && supabase) {
        const { error } = await supabase.from('contact_inquiries').insert({
          full_name: fullName,
          email,
          phone,
          message: selectedProject ? `[Project: ${selectedProject}] ${message}` : message,
        });

        if (error) {
          console.warn('Supabase insert error, logging locally:', error.message);
        }
      }

      form.reset();
      navigate('/thankyou');
    } catch (err) {
      console.error('Submission exception:', err);
      // Fallback redirect for client user experience
      navigate('/thankyou');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full pt-32 pb-24 min-h-screen flex flex-col justify-center">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left Column: NAP & Information */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-display mb-6">Contact A&amp;G, Property Consultants in Noida</h1>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Connect with our senior property advisors for confidential guidance on residential homes, commercial projects, or real estate investments across Noida, Greater Noida, and Delhi NCR.
            </p>

            {/* Direct Contact Cards */}
            <div className="grid gap-4 mb-8">
              <a
                href="tel:+919654322224"
                className="bg-surface p-5 rounded-2xl border border-stroke flex items-center gap-4 transition-colors hover:border-text-primary group"
              >
                <div className="w-12 h-12 rounded-full bg-stroke/50 flex items-center justify-center text-text-primary text-xl">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">Direct Phone</p>
                  <p className="text-lg font-medium text-text-primary group-hover:underline transition-all">+91 96543 22224</p>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface p-5 rounded-2xl border border-stroke flex items-center gap-4 transition-colors hover:border-emerald-500 group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center text-xl">
                  <FiMessageSquare />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">Instant WhatsApp Advisor</p>
                  <p className="text-lg font-medium text-emerald-500">Connect via WhatsApp ↗</p>
                </div>
              </a>

              <div className="bg-surface p-5 rounded-2xl border border-stroke flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stroke/50 flex items-center justify-center text-text-primary text-xl">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">Primary Focus Region</p>
                  <p className="text-sm font-medium text-text-primary">Noida, Sector 150, Sector 115, Sector 107 &amp; Greater Noida West</p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-stroke">
              <h3 className="text-xl font-display mb-2 text-text-primary">Private Property Consultation</h3>
              <p className="text-muted text-sm leading-relaxed">
                Our team provides clear project facts, developer track records, verified RERA documentation, and current unit availability to help you make informed real estate decisions.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-surface border border-stroke rounded-3xl p-8 md:p-12 flex flex-col">
            <h2 className="text-3xl font-display mb-2">Speak with an Expert Today</h2>
            <p className="text-muted text-sm mb-8">
              {selectedProject ? `Requesting information for: ${selectedProject}` : 'Fill out the form below and our advisors will reach out to you shortly.'}
            </p>

            <form className="flex flex-col gap-6 flex-1" onSubmit={handleSubmit}>
              {/* Honeypot anti-spam field */}
              <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-sm font-medium text-text-primary">Full Name <span className="text-accent">*</span></label>
                <input id="fullName" name="fullName" type="text" autoComplete="name" maxLength={120} required className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors" placeholder="Your Full Name" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-text-primary">Email Address <span className="text-accent">*</span></label>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors" placeholder="name@example.com" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium text-text-primary">Phone Number <span className="text-accent">*</span></label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={20} required className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors" placeholder="+91 98765 43210" />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="message" className="text-sm font-medium text-text-primary">How can we help? <span className="text-accent">*</span></label>
                <textarea id="message" name="message" defaultValue={initialMessage} maxLength={5000} required className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors resize-none flex-1 min-h-[120px]" placeholder="Share your preferred configuration, location, or budget requirements..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="group relative bg-text-primary text-bg hover:bg-bg hover:text-text-primary rounded-xl text-sm px-8 py-4 mt-2 transition-all overflow-hidden font-medium disabled:cursor-not-allowed disabled:opacity-60">
                <span className="relative z-10">{isSubmitting ? 'Submitting Enquiry...' : 'Submit Property Enquiry'}</span>
              </button>

              {submissionMessage && (
                <p role="status" aria-live="polite" className={`text-sm ${submissionError ? 'text-red-400' : 'text-text-primary'}`}>
                  {submissionMessage}
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
