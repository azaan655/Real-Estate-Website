import React, { useEffect } from 'react';
import SiteFooter from '../components/SiteFooter';
import { TransitionLink } from '../components/PageTransition';
import { BRAND_NAME, CONTACT_PHONE, CONTACT_EMAIL, ADDRESS_LINES } from '../data/siteInfo';

export const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: '01',
      title: 'Introduction & Acceptance of Terms',
      content: [
        `Welcome to ${BRAND_NAME} ("we", "our", or "us"). By accessing or utilizing our website, private advisory services, property dossiers, or consultation appointments, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions ("Terms").`,
        'If you do not agree with any part of these Terms, please discontinue use of our digital platforms and services immediately.',
      ],
    },
    {
      id: '02',
      title: 'Scope of Luxury Advisory & Brokerage Services',
      content: [
        `${BRAND_NAME} operates as an elite boutique real estate consultancy in Hyderabad, Telangana, specializing in the representation, acquisition, marketing, and leasing of high-value residential and commercial properties.`,
        'Our services include private client consultations, property valuations, bespoke viewing arrangements, price negotiation facilitation, and transactional due diligence advisory. We do not act as financial institutions, escrow custodians, or legal guarantors.',
      ],
    },
    {
      id: '03',
      title: 'Listing Accuracy, Pricing & Availability',
      content: [
        'All listing descriptions, architectural photographs, virtual walkthroughs, floor plans, dimensions, and financial figures presented on this platform are curated with meticulous care and verified against available builder and owner documentation.',
        'However, market dynamics, builder revisions, and municipal approvals may alter specifications without prior notice. Listed prices and square footage figures are indicative and subject to contractual confirmation during formal transaction execution.',
      ],
    },
    {
      id: '04',
      title: 'Private Viewings & Client Conduct',
      content: [
        'To protect owner privacy and security, private viewings for ultra-luxury residences, bespoke penthouses, and gated villa communities may require prior qualification, identity verification, or letter of intent.',
        'Clients agree to maintain strict confidentiality regarding proprietary property disclosures, unlisted asset details, and seller identities shared during advisory engagements.',
      ],
    },
    {
      id: '05',
      title: 'Intellectual Property & Content Usage',
      content: [
        `All visual collateral, brand typography, architectural photography, curated copy, and proprietary interface designs on this website are the intellectual property of ${BRAND_NAME} or our licensed partners.`,
        'Unauthorized reproduction, automated data scraping, commercial redistribution, or public display of any website assets without prior written consent is strictly prohibited.',
      ],
    },
    {
      id: '06',
      title: 'Limitation of Liability',
      content: [
        'To the fullest extent permitted by Indian law, neither VESTA nor its directors, advisors, or affiliates shall be liable for indirect, incidental, punitive, or consequential damages resulting from transactions conducted between independent property owners, developers, and prospective buyers.',
        'Prospective purchasers and lessees are strongly encouraged to engage independent legal counsel and technical auditors to conduct independent title verification prior to formal execution.',
      ],
    },
    {
      id: '07',
      title: 'Telangana RERA & Regulatory Disclosures',
      content: [
        'VESTA conducts operations in strict adherence to the Real Estate (Regulation and Development) Act, 2016 (RERA) and rules notified by Telangana State Real Estate Regulatory Authority (TSRERA).',
        'Registered projects featured on this platform reflect applicable RERA project registration numbers. Prospective buyers may verify regulatory filings directly via the official TSRERA portal.',
      ],
    },
    {
      id: '08',
      title: 'Governing Law & Jurisdiction',
      content: [
        'These Terms and Conditions shall be governed by and construed in accordance with the laws of India.',
        'Any dispute, controversy, or claim arising out of or relating to your engagement with our platform or advisory services shall be subject to the exclusive jurisdiction of the competent courts situated in Hyderabad, Telangana.',
      ],
    },
    {
      id: '09',
      title: 'Modifications & Contact Enquiries',
      content: [
        'We reserve the right to revise these Terms periodically. Updates take effect immediately upon publication on this page, with the revision timestamp displayed at the top.',
        `For legal inquiries, documentation verification, or advisory clarifications, contact our legal desk at ${CONTACT_EMAIL} or visit our registered office in ${ADDRESS_LINES[1]}.`,
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
            <span>Governance</span>
            <span className="text-[#D4AF6A]/40">&middot;</span>
            <span>Legal Framework</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F4EFE6] tracking-tight mb-4 sm:mb-6">
            Terms &amp; Conditions
          </h1>

          <p className="text-sm sm:text-base md:text-[17px] text-[rgba(244,239,230,0.68)] max-w-2xl mx-auto leading-relaxed mb-4">
            Governing your access to {BRAND_NAME}&rsquo;s bespoke advisory platforms, curated property portfolios, and transactional representation.
          </p>

          <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[rgba(244,239,230,0.4)]">
            Effective Date: November 2026 &middot; Version 2.4
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
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
                Have questions regarding our terms?
              </h3>
              <p className="text-xs sm:text-[14px] text-[rgba(244,239,230,0.6)]">
                Our private concierge is available to address questions directly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center px-6 py-3 rounded-full bg-[#F4EFE6] text-[#0C0C0C] font-medium text-[13px] hover:bg-[#D4AF6A] transition-colors"
              >
                Email Concierge
              </a>
              <TransitionLink
                to="/faqs"
                transitionLabel="FAQs"
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center px-6 py-3 rounded-full border border-[rgba(244,239,230,0.2)] text-[#F4EFE6] font-medium text-[13px] hover:border-[#D4AF6A] hover:text-[#D4AF6A] transition-colors"
              >
                Read FAQs
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

export default Terms;

