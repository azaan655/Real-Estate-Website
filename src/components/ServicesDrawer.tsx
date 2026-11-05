import React, { useEffect, useRef } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { servicesData, Service } from '../data/services';

interface ServicesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServicesDrawer: React.FC<ServicesDrawerProps> = ({ isOpen, onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Entrance & Exit animation
  useEffect(() => {
    const backdrop = backdropRef.current;
    const drawer = drawerRef.current;
    if (!backdrop || !drawer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isOpen) {
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 1, pointerEvents: 'auto' });
        gsap.set(drawer, { x: 0 });
      } else {
        gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power2.out', pointerEvents: 'auto' });
        gsap.fromTo(drawer,
          { x: '100%' },
          { x: '0%', duration: 0.6, ease: 'power3.out' }
        );
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 0, pointerEvents: 'none' });
        gsap.set(drawer, { x: '100%' });
      } else {
        gsap.to(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.in', pointerEvents: 'none' });
        gsap.to(drawer, { x: '100%', duration: 0.45, ease: 'power3.in' });
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-400 ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Services Column"
    >
      {/* Dark backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md opacity-0 transition-opacity"
        aria-hidden="true"
      />

      {/* Side Column Drawer */}
      <div
        ref={drawerRef}
        className="absolute top-0 right-0 bottom-0 w-full sm:w-[90vw] md:w-[680px] lg:w-[740px] xl:w-[820px] bg-[#FAF8F4] text-[#0C0C0C] shadow-2xl flex flex-col z-10 translate-x-full overflow-hidden"
        style={{
          '--ink': '#0C0C0C',
          '--accent': '#D4AF6A',
          '--accent-ink': '#A8832F',
          '--hair': 'rgba(12, 12, 12, 0.15)',
        } as React.CSSProperties}
      >
        {/* Sticky Drawer Header */}
        <div className="sticky top-0 z-20 px-6 sm:px-10 py-5 bg-[#FAF8F4]/95 backdrop-blur-sm border-b flex items-center justify-between" style={{ borderColor: 'var(--hair)' }}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-[2px] rounded-full bg-[#D4AF6A]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#0C0C0C]">
              VESTA SERVICES
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close services column"
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:bg-[#0C0C0C] hover:text-white cursor-pointer"
            style={{ borderColor: 'var(--hair)', color: 'var(--ink)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 sm:py-12">
          {/* Eyebrow & Heading */}
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] rounded-full bg-[#D4AF6A]" />
              <p className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#0C0C0C]">
                Our Services
              </p>
            </div>

            {/* Heading with UNBROKEN words */}
            <h2 className="font-serif font-normal text-[#0C0C0C] leading-[0.98] tracking-[-0.02em] text-[clamp(2.25rem,5.5vw,3.75rem)] mb-5">
              <span className="block">
                <span className="inline-block whitespace-nowrap mr-[0.25em]">Every</span>
                <span className="inline-block whitespace-nowrap mr-[0.25em]">step</span>
                <span className="inline-block whitespace-nowrap">of</span>
              </span>
              <span className="block mt-1">
                <span className="inline-block whitespace-nowrap mr-[0.25em]">your</span>
                <span className="inline-block whitespace-nowrap mr-[0.25em] italic text-[#A8832F]">property</span>
                <span className="inline-block whitespace-nowrap italic text-[#A8832F]">journey.</span>
              </span>
            </h2>

            <p className="font-sans font-light text-[15px] leading-relaxed max-w-xl text-[#0C0C0C]/70">
              From the first viewing to the final handover, one dedicated team manages every detail of your move.
            </p>
          </div>

          {/* List of 8 Services */}
          <ol className="w-full border-t" style={{ borderColor: 'var(--hair)' }}>
            {servicesData.map((service: Service) => (
              <li
                key={service.id}
                className="relative border-b group transition-colors duration-300 hover:bg-black/[0.02]"
                style={{ borderColor: 'var(--hair)' }}
              >
                <a
                  href="#contact"
                  onClick={onClose}
                  aria-label={`Enquire about ${service.name}`}
                  className="block py-6 sm:py-8 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: 'var(--accent-ink)' }}
                >
                  <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[4.5rem_1fr_auto] items-start gap-4 sm:gap-6">
                    {/* Numeral */}
                    <div
                      className="font-serif tabular-nums text-[2.5rem] sm:text-[3rem] leading-none transition-colors duration-300 select-none"
                      style={{
                        color: 'transparent',
                        WebkitTextStroke: '1px rgba(12, 12, 12, 0.4)',
                      }}
                    >
                      {service.id}
                    </div>

                    {/* Middle Details */}
                    <div className="flex flex-col gap-2 min-w-0">
                      <h3 className="font-serif text-[1.4rem] sm:text-[1.75rem] leading-[1.1] text-[#0C0C0C] group-hover:translate-x-1.5 transition-transform duration-300">
                        {service.name}
                      </h3>
                      <p className="font-sans font-light text-[13px] sm:text-[14px] leading-relaxed text-[#0C0C0C]/70">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {service.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-sans font-medium text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border border-black/15 text-[#0C0C0C]/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow Circle */}
                    <div className="hidden sm:flex items-center justify-center pt-1">
                      <div
                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-[#0C0C0C] group-hover:text-white"
                        style={{ borderColor: 'var(--hair)', color: 'var(--ink)' }}
                      >
                        <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ol>

          {/* Drawer Closing CTA */}
          <div className="mt-12 pt-8 border-t text-center flex flex-col items-center" style={{ borderColor: 'var(--hair)' }}>
            <h3 className="font-serif text-[1.75rem] leading-tight text-[#0C0C0C]">
              <span>Not sure where to </span>
              <span className="italic text-[#A8832F]">begin?</span>
            </h3>
            <p className="font-sans font-light text-sm text-[#0C0C0C]/70 mt-2">
              Speak with a senior advisor. A private consultation is always complimentary.
            </p>
            <a
              href="#contact"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[#0C0C0C] text-white font-sans text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 hover:bg-[#D4AF6A] hover:text-[#0C0C0C]"
            >
              <span>Book a Private Consultation</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDrawer;

