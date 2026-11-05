import React, { useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TransitionLink } from './PageTransition';
import {
  BRAND_NAME,
  ADDRESS_LINES,
  PHONES,
  EMAILS,
  OFFICE_HOURS,
  DESCRIPTION,
  SOCIAL_LINKS,
  NAV_LINKS,
  SERVICE_LINKS,
  LEGAL_LINKS,
} from '../data/siteInfo';

if (typeof window !== 'undefined' && typeof gsap !== 'undefined') {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export interface SiteFooterProps {
  overlap?: boolean;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ overlap = false }) => {
  const footerRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !footerRef.current) return;

    const ctx = gsap.context(() => {
      // Top hairline draw animation if not overlapping
      if (!overlap && topLineRef.current) {
        gsap.fromTo(
          topLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Columns rise in
      const cols = footerRef.current?.querySelectorAll('.site-footer-col');
      if (cols && cols.length > 0) {
        gsap.fromTo(
          cols,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, [overlap]);

  const currentYear = new Date().getFullYear();

  const renderSocialIcon = (name: string) => {
    switch (name) {
      case 'Facebook':
        return (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      case 'Instagram':
        return (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        );
      case 'YouTube':
      default:
        return (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className={`relative w-full bg-[#0B0907] text-[rgba(244,239,230,0.62)] overflow-hidden isolate select-none ${
        overlap
          ? 'z-30 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] pt-24 md:pt-32'
          : 'pt-20 md:pt-28'
      }`}
      style={
        overlap
          ? {
              marginTop: 'calc(var(--home-overlap, 60px) * -1)',
              paddingTop: 'calc(6rem + var(--home-overlap, 60px))',
            }
          : undefined
      }
    >
      {/* Non-overlapping top hairline */}
      {!overlap && (
        <div
          ref={topLineRef}
          className="w-full h-[1px] bg-[rgba(244,239,230,0.12)] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      )}

      {/* Ambient background decorations */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Radial spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(212,175,106,0.10) 0%, transparent 60%)',
          }}
        />
        {/* Giant subtle watermark wordmark */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[-2vw] font-serif text-[18vw] leading-none text-[#F4EFE6] opacity-[0.03] select-none tracking-widest pointer-events-none"
        >
          {BRAND_NAME}
        </div>
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-10">
        {/* 4-area Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_1fr_1.3fr] gap-10 sm:gap-12 lg:gap-10 mb-12 sm:mb-16">
          {/* (1) Brand Column */}
          <div className="site-footer-col space-y-5">
            <div className="flex items-center gap-3">
              <span className="font-serif text-3xl sm:text-4xl tracking-wider text-[#F4EFE6]">
                {BRAND_NAME}
              </span>
              <span className="inline-block w-8 h-[1px] bg-[#D4AF6A]" />
            </div>
            <p className="max-w-[320px] text-[14px] leading-relaxed text-[rgba(244,239,230,0.62)]">
              {DESCRIPTION}
            </p>
            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Follow VESTA on ${item.name}`}
                  className="w-11 h-11 rounded-full border border-[rgba(244,239,230,0.14)] bg-white/[0.02] flex items-center justify-center text-[rgba(244,239,230,0.7)] hover:text-[#D4AF6A] hover:border-[#D4AF6A] transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A]"
                >
                  {renderSocialIcon(item.name)}
                </a>
              ))}
            </div>
          </div>

          {/* (2) Navigation Column */}
          <div className="site-footer-col">
            <h4 className="font-sans font-semibold text-[12px] uppercase tracking-[0.22em] text-[#F4EFE6] mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 text-[14px]">
              {NAV_LINKS.map((link) => {
                const isExternal = link.href.startsWith('mailto:') || link.href.startsWith('http');
                return (
                  <li key={link.label}>
                    {isExternal ? (
                      <a
                        href={link.href}
                        className="inline-block text-[rgba(244,239,230,0.65)] hover:text-[#F4EFE6] transition-all duration-300 hover:translate-x-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A] rounded"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <TransitionLink
                        to={link.href}
                        transitionLabel={link.label}
                        className="inline-block text-[rgba(244,239,230,0.65)] hover:text-[#F4EFE6] transition-all duration-300 hover:translate-x-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A] rounded"
                      >
                        {link.label}
                      </TransitionLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* (3) Services Column */}
          <div className="site-footer-col">
            <h4 className="font-sans font-semibold text-[12px] uppercase tracking-[0.22em] text-[#F4EFE6] mb-6">
              Services
            </h4>
            <ul className="space-y-3 text-[14px]">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <TransitionLink
                    to={link.href}
                    transitionLabel={link.label}
                    className="inline-block text-[rgba(244,239,230,0.65)] hover:text-[#F4EFE6] transition-all duration-300 hover:translate-x-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A] rounded"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* (4) Contact Details Column */}
          <div className="site-footer-col space-y-4">
            <h4 className="font-sans font-semibold text-[12px] uppercase tracking-[0.22em] text-[#F4EFE6] mb-6">
              Contact Details
            </h4>

            {/* Address */}
            <div className="flex items-start gap-3 text-[14px] leading-relaxed">
              <MapPin size={16} className="text-[#D4AF6A] shrink-0 mt-1" />
              <div>
                {ADDRESS_LINES.map((line, idx) => (
                  <p key={idx} className="text-[rgba(244,239,230,0.78)]">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Phones */}
            <div className="flex items-start gap-3 text-[14px]">
              <Phone size={16} className="text-[#D4AF6A] shrink-0 mt-1" />
              <div className="space-y-1">
                {PHONES.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="block text-[rgba(244,239,230,0.78)] hover:text-[#D4AF6A] transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            {/* Mail */}
            <div className="flex items-start gap-3 text-[14px]">
              <Mail size={16} className="text-[#D4AF6A] shrink-0 mt-1" />
              <div className="space-y-1">
                {EMAILS.map((email, idx) => (
                  <a
                    key={idx}
                    href={`mailto:${email}`}
                    className="block text-[rgba(244,239,230,0.78)] hover:text-[#D4AF6A] transition-colors"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-3 text-[13px] text-[rgba(244,239,230,0.5)] pt-1">
              <Clock size={15} className="text-[#D4AF6A] shrink-0" />
              <span>{OFFICE_HOURS}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgba(244,239,230,0.12)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[rgba(244,239,230,0.5)] text-center sm:text-left">
          <div>
            <span>&copy; {currentYear} {BRAND_NAME}. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <TransitionLink
                key={link.label}
                to={link.href}
                transitionLabel={link.label}
                className="text-[rgba(244,239,230,0.65)] hover:text-[#D4AF6A] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A] rounded"
              >
                {link.label}
              </TransitionLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
