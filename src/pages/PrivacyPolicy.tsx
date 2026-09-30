import { motion } from 'framer-motion';
import { useEffect } from 'react';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | A&G Realtors';
    const description = document.querySelector('meta[name="description"]') ?? document.head.appendChild(document.createElement('meta'));
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'Read the Privacy Policy of A&G Realtors to understand how we collect, use, protect, and manage personal information submitted through our website.');
    
    const canonical = document.querySelector('link[rel="canonical"]') ?? document.head.appendChild(document.createElement('link'));
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://agarwalandgehlot.com/privacy-policy');
  }, []);

  return (
    <div className="w-full pt-32 pb-24 overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Legal</p>
            <h1 className="text-5xl md:text-7xl font-display mb-6 text-text-primary">Privacy Policy</h1>
            <p className="text-lg text-muted max-w-2xl mb-6">
              Your privacy matters to us. Learn how A&G Realtors collects, uses, and protects your information.
            </p>
            <p className="text-sm text-muted">Last Updated: 30 September 2026</p>
          </div>
        </FadeIn>

        <div className="space-y-12">
          <FadeIn delay={0.1}>
            <div className="prose prose-lg max-w-none">
              <div className="border-b border-stroke/50 pb-8 mb-8">
                <p className="text-sm text-muted mb-4">Effective Date: 30 September 2026</p>
                <p className="text-muted leading-relaxed">
                  At A&G Realtors, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, disclose, and protect your information when you visit or use our website, submit an enquiry, request property information, or interact with our services.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  By using our website, you acknowledge that you have read and understood this Privacy Policy.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">1. About A&G Realtors</h2>
                <p className="text-muted leading-relaxed">
                  A&G Realtors is a real estate advisory and property consultancy providing information and assistance relating to residential and commercial real estate opportunities.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  For privacy-related queries, you may contact us using the details provided on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">2. Information We Collect</h2>
                <p className="text-muted leading-relaxed mb-4">
                  We may collect information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>Full name</li>
                  <li>Mobile number</li>
                  <li>Email address</li>
                  <li>City or preferred location</li>
                  <li>Property requirements and preferences</li>
                  <li>Budget range</li>
                  <li>Property type and configuration</li>
                  <li>Information provided through enquiry or contact forms</li>
                  <li>Information provided during calls, WhatsApp conversations, emails, or other communications</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4 mb-4">
                  We may also automatically collect certain technical information when you visit our website, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>IP address</li>
                  <li>Browser and device type</li>
                  <li>Operating system</li>
                  <li>Website pages visited</li>
                  <li>Date and time of visits</li>
                  <li>Referral/source information</li>
                  <li>General website usage and interaction data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">3. How We Use Your Information</h2>
                <p className="text-muted leading-relaxed mb-4">
                  We may use the information collected to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>Respond to your property enquiries and requests.</li>
                  <li>Provide information about properties, projects, prices, offers, and availability.</li>
                  <li>Contact you regarding your enquiry through phone calls, SMS, email, WhatsApp, or other communication channels.</li>
                  <li>Understand your property requirements and provide relevant recommendations.</li>
                  <li>Schedule property visits, meetings, or consultations.</li>
                  <li>Improve our website, services, marketing, and customer experience.</li>
                  <li>Maintain records of enquiries and communications.</li>
                  <li>Conduct analytics and measure website and marketing performance.</li>
                  <li>Prevent fraud, misuse, spam, and unauthorized activity.</li>
                  <li>Comply with applicable laws and regulatory requirements.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">4. Marketing Communications</h2>
                <p className="text-muted leading-relaxed">
                  If you provide your contact information through our website or enquiry forms, you may receive communications from A&G Realtors regarding properties, projects, real estate opportunities, updates, offers, or services.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  These communications may be sent through:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted mt-2">
                  <li>Phone calls</li>
                  <li>SMS</li>
                  <li>Email</li>
                  <li>WhatsApp</li>
                  <li>Other permitted digital communication channels</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4">
                  You may request to stop receiving marketing communications at any time by contacting us or using the applicable unsubscribe/opt-out mechanism provided in the communication.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">5. Property Enquiries</h2>
                <p className="text-muted leading-relaxed">
                  When you submit an enquiry regarding a specific property or project, we may use your information to connect you with the appropriate sales or advisory representative and provide information relevant to your request.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  Property information, including pricing, availability, specifications, offers, and timelines, may change without prior notice and may be subject to the terms and conditions of the respective developer or project.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="text-muted leading-relaxed">
                  Our website may use cookies and similar technologies to improve website functionality and understand how visitors interact with our website.
                </p>
                <p className="text-muted leading-relaxed mt-4 mb-4">
                  Cookies may be used for purposes such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>Website functionality</li>
                  <li>Analytics</li>
                  <li>Performance monitoring</li>
                  <li>Marketing and advertising</li>
                  <li>Remembering user preferences</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4">
                  You may manage or disable cookies through your browser settings. Disabling certain cookies may affect some website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">7. Third-Party Services</h2>
                <p className="text-muted leading-relaxed">
                  We may use third-party services and platforms to operate, analyze, advertise, communicate, or improve our website and services.
                </p>
                <p className="text-muted leading-relaxed mt-4 mb-4">
                  These may include services related to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>Website analytics</li>
                  <li>Advertising and remarketing</li>
                  <li>Customer relationship management</li>
                  <li>Email communication</li>
                  <li>WhatsApp or messaging</li>
                  <li>Lead management</li>
                  <li>Website hosting and security</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4">
                  Such third-party providers may process information in accordance with their own privacy policies and applicable terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">8. Sharing of Information</h2>
                <p className="text-muted leading-relaxed">
                  We do not sell or rent your personal information as a standalone commercial product.
                </p>
                <p className="text-muted leading-relaxed mt-4 mb-4">
                  We may share relevant information with trusted parties where reasonably necessary to provide our services, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>Our employees and authorized representatives</li>
                  <li>Property developers or project representatives, where relevant to your enquiry</li>
                  <li>Technology and hosting service providers</li>
                  <li>Marketing and analytics service providers</li>
                  <li>Communication and CRM service providers</li>
                  <li>Professional advisers or service providers</li>
                  <li>Government authorities or law-enforcement agencies where legally required</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4">
                  We aim to limit information sharing to what is reasonably necessary for the relevant purpose.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">9. Data Security</h2>
                <p className="text-muted leading-relaxed">
                  We take reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, loss, or misuse.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  However, no method of transmitting or storing information electronically can be guaranteed to be completely secure. Accordingly, we cannot guarantee absolute security of information transmitted to or through our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">10. Data Retention</h2>
                <p className="text-muted leading-relaxed">
                  We retain personal information for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing services, maintaining business records, resolving disputes, complying with legal obligations, and protecting our legitimate interests.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  When information is no longer required, we may delete, anonymize, or securely dispose of it in accordance with applicable requirements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">11. Your Rights</h2>
                <p className="text-muted leading-relaxed mb-4">
                  Subject to applicable law, you may have rights relating to your personal information, including the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted">
                  <li>Request information about personal data held by us.</li>
                  <li>Request correction of inaccurate or incomplete information.</li>
                  <li>Request deletion of information where legally applicable.</li>
                  <li>Withdraw consent where processing is based on consent.</li>
                  <li>Opt out of certain marketing communications.</li>
                  <li>Raise concerns regarding the processing of your personal information.</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4">
                  To exercise an applicable right or raise a privacy concern, please contact us using the contact details available on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">12. Children's Privacy</h2>
                <p className="text-muted leading-relaxed">
                  Our website is not specifically directed toward children. We do not knowingly request or collect personal information from children where such collection is prohibited by applicable law.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  If you believe that a child has provided personal information to us without appropriate authorization, please contact us so that we can take appropriate action.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">13. External Links</h2>
                <p className="text-muted leading-relaxed">
                  Our website may contain links to third-party websites, including property developers, service providers, social media platforms, payment services, or other websites.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  A&G Realtors is not responsible for the privacy practices, security, content, or policies of third-party websites. We recommend reviewing the privacy policy of any external website you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">14. Changes to This Privacy Policy</h2>
                <p className="text-muted leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, or business practices.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  Any updated version will be published on this page with a revised "Last Updated" date. We encourage you to review this page periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text-primary mb-4">15. Contact Us</h2>
                <p className="text-muted leading-relaxed">
                  If you have any questions, concerns, requests, or complaints regarding this Privacy Policy or the handling of your personal information, please contact A&G Realtors through the contact information provided on our website.
                </p>
                <div className="mt-6 p-6 bg-surface border border-stroke rounded-2xl">
                  <p className="text-text-primary font-medium mb-2">A&G Realtors</p>
                  <p className="text-muted">Website: agarwalandgehlot.com</p>
                  <p className="text-muted">Phone: +91 96543 22224</p>
                  <p className="text-muted mt-4 text-sm">Privacy / Data Protection Queries:</p>
                  <p className="text-muted text-sm">Please contact us through our website's Contact Us section.</p>
                </div>
              </section>

              <div className="pt-8 border-t border-stroke/50">
                <p className="text-muted leading-relaxed">
                  By using this website, you acknowledge that you have read and understood this Privacy Policy and agree to the processing of your information as described above, subject to applicable law.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}