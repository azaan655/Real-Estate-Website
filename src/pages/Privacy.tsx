import React, { useEffect } from 'react';
import SiteFooter from '../components/SiteFooter';
import { TransitionLink } from '../components/PageTransition';
import { BRAND_NAME, CONTACT_EMAIL, ADDRESS_LINES, WHATSAPP_NUMBER } from '../data/siteInfo';

export const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: '01',
      title: 'Our Commitment to Discretion & Confidentiality',
      content: [
        `At ${BRAND_NAME}, client confidentiality and data discretion form the bedrock of our high-net-worth real estate practice. Whether engaging for acquisitions in Jubilee Hills, private villa transactions, or commercial portfolio strategies, your personal information is treated with unwavering discretion.`,
        'This Privacy Policy outlines how we collect, safeguard, process, and respect your personal information across our website, private dossiers, messaging channels, and advisory consultations.',
      ],
    },
    {
      id: '02',
      title: 'Categories of Information We Collect',
      content: [
        'Client Identity & Contact: Full name, verified telephone number, primary email address, professional affiliation, and preferred modes of contact.',
        'Property & Investment Criteria: Target locality preferences, budget parameters, architectural specifications, investment horizons, and viewing availability.',
        'Transaction & Regulatory KYC: For verified offers and acquisition contracts, regulatory identity verification documents (PAN, Aadhaar, Passport, OCI documents for NRI clients) as mandated by Indian statutory authorities.',
        'Digital Diagnostics: Standard diagnostic metadata including device parameters, IP address, and browser session metrics collected solely to optimize portal performance.',
      ],
    },
    {
      id: '03',
      title: 'How We Utilize Your Information',
      content: [
        'To curate bespoke property portfolios precisely matched to your investment or lifestyle parameters.',
        'To schedule private viewings, coordinate with estate managers, and facilitate direct negotiations under strict confidentiality.',
        'To transmit confidential property digests, unlisted off-market opportunities, and market research reports aligned with your expressed interests.',
        'To fulfill statutory obligations under the Real Estate (Regulation and Development) Act, 2016, Prevention of Money Laundering Act (PMLA), and Indian tax legislation.',
      ],
    },
    {
      id: '04',
      title: 'Strict Non-Disclosure & Restricted Sharing',
      content: [
        `${BRAND_NAME} maintains an absolute policy: We never sell, rent, commercialize, or broadcast your personal data to third-party telemarketers, data brokers, or advertising networks.`,
        'Information is shared exclusively with accredited partners strictly necessary to complete your transaction: vetted legal counsel, title verification specialists, authorized escrow institutions, and TSRERA filing desks with explicit client consent.',
      ],
    },
    {
      id: '05',
      title: 'Data Security & Encryption Safeguards',
      content: [
        'We enforce industry-standard security protocols, including TLS 1.3 encryption in transit, AES-256 encryption at rest for sensitive transaction dossiers, and strict role-based access governance.',
        'Access to private client files and identity documentation is restricted exclusively to authorized Senior Advisory Directors bound by comprehensive non-disclosure covenants.',
      ],
    },
    {
      id: '06',
      title: 'Messaging & WhatsApp Advisory Concierge',
      content: [
        `When communicating via our verified WhatsApp Business concierge (${WHATSAPP_NUMBER}), interactions are governed by WhatsApp end-to-end encryption standards.`,
        'You may request to transition communication to secure end-to-end encrypted email or in-person consultations at any time.',
      ],
    },
    {
      id: '07',
      title: 'Client Rights & Control Over Your Information',
      content: [
        'Right to Access: You may request an itemized transcript of personal data held in your advisory profile at any time.',
        'Right to Rectification: You may update or correct your contact information, financial criteria, or preferences instantly by notifying your dedicated advisor.',
        'Right to Erasure ("Right to be Forgotten"): Upon termination of advisory representation and subject to statutory record-retention laws, you may instruct us to permanently purge your data from our systems.',
      ],
    },
    {
      id: '08',
      title: 'Cookies & Digital Tracking Preferences',
      content: [
        'Our digital platform uses strictly necessary cookies and minimalist performance telemetry to preserve session state and navigation preferences.',
        'We do not employ cross-site tracking cookies, behavioral tracking pixels, or third-party advertising retargeters.',
      ],
    },
    {
      id: '09',
      title: 'Contact Privacy Concierge',
      content: [
        `If you have inquiries regarding this Privacy Policy, wish to exercise data rights, or desire to discuss our security protocols, please contact our Data Protection Officer directly:`,
        `Email: privacy@vesta.example (or ${CONTACT_EMAIL}) \u00B7 Address: ${ADDRESS_LINES.join(', ')}.`,
      ],
    },
  ];

  return (
    <div className="w-full bg-[#0B0907] text-[#FAF8F4] min-h-screen flex flex-col justify-between">
      {/* Header section */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,106,0.3) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-[860px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(212,175,106,0.25)] bg-[rgba(212,175,106,0.06)] text-[#D4AF6A] text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
            <span>Confidentiality</span>
            <span className="text-[#D4AF6A]/40">&middot;</span>
            <span>Data Protection</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F4EFE6] tracking-tight mb-4 sm:mb-6">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base md:text-[17px] text-[rgba(244,239,230,0.68)] max-w-2xl mx-auto leading-relaxed mb-4">
            How {BRAND_NAME} preserves client discretion, safeguards confidential dossiers, and protects your personal data across all advisory channels.
          </p>

          <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[rgba(244,239,230,0.4)]">
            Effective Date: November 2026 &middot; Version 2.4
          </p>
        </div>
      </section>

      {/* Main Privacy Content */}
      <main className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-20 sm:pb-24">
        <div className="max-w-[860px] mx-auto space-y-8 sm:space-y-12">
          {sections.map((sec) => (
            <article
              key={sec.id}
              className="p-5 sm:p-8 md:p-10 rounded-[20px] sm:rounded-[24px] bg-[rgba(244,239,230,0.02)] border border-[rgba(244,239,230,0.08)] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-mono uppercase tracking-widest text-[#D4AF6A]">
                  Section {sec.id}
                </span>
                <span className="h-[1px] w-6 bg-[#D4AF6A]/30" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#F4EFE6] tracking-wide mb-4 sm:mb-5">
                {sec.title}
              </h2>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-[14px] md:text-[15px] leading-relaxed text-[rgba(244,239,230,0.72)]">
                {sec.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </article>
          ))}

          {/* Quick Help Card */}
          <div className="p-6 sm:p-8 rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#15120D] to-[#0E0C09] border border-[#D4AF6A]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-serif text-xl sm:text-2xl text-[#F4EFE6] mb-1">
                Have a privacy inquiry or data request?
              </h3>
              <p className="text-xs sm:text-[14px] text-[rgba(244,239,230,0.6)]">
                Contact our data discretion officer for immediate assistance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center px-6 py-3 rounded-full bg-[#F4EFE6] text-[#0C0C0C] font-medium text-[13px] hover:bg-[#D4AF6A] transition-colors"
              >
                Contact Officer
              </a>
              <TransitionLink
                to="/terms"
                transitionLabel="Terms & Conditions"
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center px-6 py-3 rounded-full border border-[rgba(244,239,230,0.2)] text-[#F4EFE6] font-medium text-[13px] hover:border-[#D4AF6A] hover:text-[#D4AF6A] transition-colors"
              >
                Terms of Service
              </TransitionLink>
            </div>
          </div>
        </div>
      </main>

      {/* Flat Footer */}
      <SiteFooter overlap={false} />
    </div>
  );
};

export default Privacy;

