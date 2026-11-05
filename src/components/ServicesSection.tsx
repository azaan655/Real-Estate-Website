import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesData, Service } from '../data/services';

gsap.registerPlugin(ScrollTrigger);

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowDashRef = useRef<HTMLDivElement>(null);
  const eyebrowTextRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion) {
      // In reduced motion, ensure everything is immediately visible
      return;
    }

    const ctx = gsap.context(() => {
      // =========================================================================
      // 1. HEADING & EYEBROW ANIMATION
      // =========================================================================
      const dash = eyebrowDashRef.current;
      const eyebrowText = eyebrowTextRef.current;
      const heading = headingRef.current;
      const intro = introRef.current;

      const charSpansLine1 = heading?.querySelectorAll('.char-line-1');
      const charSpansLine2 = heading?.querySelectorAll('.char-line-2');

      // Pre-set initial states
      if (dash) gsap.set(dash, { scaleX: 0, transformOrigin: 'left' });
      if (eyebrowText) gsap.set(eyebrowText, { opacity: 0, y: 12 });
      if (charSpansLine1 && charSpansLine1.length) {
        gsap.set(charSpansLine1, { opacity: 0, yPercent: 110, filter: 'blur(6px)' });
      }
      if (charSpansLine2 && charSpansLine2.length) {
        gsap.set(charSpansLine2, { opacity: 0, yPercent: 110, filter: 'blur(6px)' });
      }
      if (intro) gsap.set(intro, { opacity: 0, y: 16, filter: 'blur(6px)' });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: 'top 75%',
          once: true,
        },
      });

      // Eyebrow dash draws
      if (dash) {
        headerTl.to(dash, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power3.out',
        }, 0);
      }

      // Eyebrow text fades and rises
      if (eyebrowText) {
        headerTl.to(eyebrowText, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        }, 0.2);
      }

      // Heading line 1 characters stagger
      if (charSpansLine1 && charSpansLine1.length) {
        headerTl.to(charSpansLine1, {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.022,
          onComplete: () => {
            gsap.set(charSpansLine1, { clearProps: 'willChange' });
          },
        }, 0.3);
      }

      // Heading line 2 characters stagger, starting after 60% of line 1
      const line1Duration = 0.9 + (charSpansLine1 ? (charSpansLine1.length - 1) * 0.022 : 0);
      const line2Start = 0.3 + line1Duration * 0.6;

      if (charSpansLine2 && charSpansLine2.length) {
        headerTl.to(charSpansLine2, {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.022,
          onComplete: () => {
            gsap.set(charSpansLine2, { clearProps: 'willChange' });
          },
        }, line2Start);
      }

      // Intro paragraph fades in
      if (intro) {
        headerTl.to(intro, {
          opacity: 0.6,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.0,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(intro, { clearProps: 'willChange' });
          },
        }, 0.8);
      }

      // =========================================================================
      // 2. ROWS ANIMATION (ScrollTrigger.batch with 0.1s cascade)
      // =========================================================================
      const listItems = listRef.current?.querySelectorAll('li');
      if (listItems && listItems.length > 0) {
        // Set initial hidden states before paint
        listItems.forEach((li) => {
          const hairLine = li.querySelector('.row-hairline');
          const numeral = li.querySelector('.row-numeral');
          const name = li.querySelector('.row-name');
          const desc = li.querySelector('.row-desc');
          const chips = li.querySelectorAll('.row-chip');
          const arrowCircle = li.querySelector('.row-arrow-circle');

          if (hairLine) gsap.set(hairLine, { scaleX: 0, transformOrigin: 'left' });
          if (numeral) gsap.set(numeral, { yPercent: 100 });
          if (name) gsap.set(name, { yPercent: 100 });
          if (desc) gsap.set(desc, { opacity: 0, y: 16, filter: 'blur(6px)' });
          if (chips && chips.length) gsap.set(chips, { opacity: 0, y: 10 });
          if (arrowCircle) gsap.set(arrowCircle, { scale: 0.6, opacity: 0 });
        });

        ScrollTrigger.batch(listItems, {
          start: 'top 88%',
          once: true,
          interval: 0.1,
          onEnter: (batch) => {
            batch.forEach((li, batchIdx) => {
              const hairLine = li.querySelector('.row-hairline');
              const numeral = li.querySelector('.row-numeral');
              const name = li.querySelector('.row-name');
              const desc = li.querySelector('.row-desc');
              const chips = li.querySelectorAll('.row-chip');
              const arrowCircle = li.querySelector('.row-arrow-circle');

              const delay = batchIdx * 0.1;
              const rowTl = gsap.timeline({ delay });

              // a) hairline draws
              if (hairLine) {
                rowTl.to(hairLine, {
                  scaleX: 1,
                  duration: 0.9,
                  ease: 'power3.inOut',
                }, 0);
              }

              // b) numeral rises through mask (starts at 0.1s)
              if (numeral) {
                rowTl.to(numeral, {
                  yPercent: 0,
                  duration: 0.9,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.set(numeral, { clearProps: 'willChange' });
                  },
                }, 0.1);
              }

              // c) name rises through mask (starts at 0.18s)
              if (name) {
                rowTl.to(name, {
                  yPercent: 0,
                  duration: 0.9,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.set(name, { clearProps: 'willChange' });
                  },
                }, 0.18);
              }

              // d) description fades and rises (starts at 0.3s)
              if (desc) {
                rowTl.to(desc, {
                  opacity: 0.6,
                  y: 0,
                  filter: 'blur(0px)',
                  duration: 0.8,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.set(desc, { clearProps: 'willChange' });
                  },
                }, 0.3);
              }

              // e) chips stagger (starts at 0.42s)
              if (chips && chips.length) {
                rowTl.to(chips, {
                  opacity: 0.8,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.06,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.set(chips, { clearProps: 'willChange' });
                  },
                }, 0.42);
              }

              // f) arrow circle pop-in (starts at 0.5s)
              if (arrowCircle) {
                rowTl.to(arrowCircle, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.6,
                  ease: 'back.out(1.6)',
                  onComplete: () => {
                    gsap.set(arrowCircle, { clearProps: 'willChange' });
                  },
                }, 0.5);
              }
            });
          },
        });
      }

      // =========================================================================
      // 3. CTA BLOCK ANIMATION
      // =========================================================================
      const cta = ctaRef.current;
      if (cta) {
        gsap.set(cta, { opacity: 0, y: 24, filter: 'blur(8px)' });
        gsap.to(cta, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 90%',
            once: true,
          },
          onComplete: () => {
            gsap.set(cta, { clearProps: 'willChange' });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="services-title"
      className="relative z-30 w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] text-[#0C0C0C] px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-28 md:py-36"
      style={{
        backgroundColor: '#FAF8F4',
        marginTop: 'calc(var(--services-overlap, 60px) * -1)',
        '--ink': '#0C0C0C',
        '--accent': '#D4AF6A',
        '--accent-ink': '#A8832F',
        '--hair': 'rgba(12, 12, 12, 0.15)',
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        {/* ========================================================================= */}
        {/* HEADING & INTRO BLOCK (SECTION 2)                                         */}
        {/* ========================================================================= */}
        <div className="mb-16 sm:mb-20 md:mb-28 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div
                ref={eyebrowDashRef}
                className="w-8 h-[2px] rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <p
                ref={eyebrowTextRef}
                className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#0C0C0C]"
              >
                Our Services
              </p>
            </div>

            {/* Heading: "Every step of\nyour *property journey.*" */}
            <h2
              id="services-title"
              ref={headingRef}
              className="font-serif font-normal text-[#0C0C0C] leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,7vw,6.5rem)]"
            >
              {/* Line 1: Every step of */}
              <span className="block overflow-hidden pb-[0.12em]">
                <span className="inline-block whitespace-nowrap mr-[0.25em]">
                  {'Every'.split('').map((char, cIdx) => (
                    <span
                      key={`l1-ev-${cIdx}`}
                      className="char-line-1 inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="inline-block whitespace-nowrap mr-[0.25em]">
                  {'step'.split('').map((char, cIdx) => (
                    <span
                      key={`l1-st-${cIdx}`}
                      className="char-line-1 inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="inline-block whitespace-nowrap">
                  {'of'.split('').map((char, cIdx) => (
                    <span
                      key={`l1-of-${cIdx}`}
                      className="char-line-1 inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>

              {/* Line 2: your *property journey.* */}
              <span className="block overflow-hidden pb-[0.12em]">
                <span className="inline-block whitespace-nowrap mr-[0.25em]">
                  {'your'.split('').map((char, cIdx) => (
                    <span
                      key={`l2-your-${cIdx}`}
                      className="char-line-2 inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="inline-block whitespace-nowrap mr-[0.25em] italic" style={{ color: 'var(--accent-ink)' }}>
                  {'property'.split('').map((char, cIdx) => (
                    <span
                      key={`l2-prop-${cIdx}`}
                      className="char-line-2 inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="inline-block whitespace-nowrap italic" style={{ color: 'var(--accent-ink)' }}>
                  {'journey.'.split('').map((char, cIdx) => (
                    <span
                      key={`l2-jour-${cIdx}`}
                      className="char-line-2 inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            </h2>
          </div>

          {/* Intro Paragraph */}
          <p
            ref={introRef}
            className="font-sans font-light text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed max-w-sm text-[#0C0C0C] mt-6 lg:mt-0"
            style={{ opacity: 0.6 }}
          >
            From the first viewing to the final handover, one dedicated team manages every detail of your move.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SEMANTIC SERVICES LIST (SECTION 3 & 4)                                    */}
        {/* ========================================================================= */}
        <ol
          ref={listRef}
          className="w-full max-w-6xl mx-auto border-t"
          style={{ borderColor: 'var(--hair)' }}
        >
          {servicesData.map((service: Service) => (
            <li
              key={service.id}
              className="relative w-full border-b group"
              style={{ borderColor: 'var(--hair)' }}
            >
              {/* Entire Row Wrapper Anchor */}
              <a
                href="#contact"
                aria-label={`Enquire about ${service.name}`}
                className="relative block w-full py-8 sm:py-10 md:py-12 transition-colors duration-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  outlineColor: 'var(--accent-ink)',
                }}
              >
                {/* Background Hover Sheen */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                  style={{ backgroundColor: 'rgba(12, 12, 12, 0.03)' }}
                />

                {/* Grid Container */}
                <div className="relative z-10 grid grid-cols-[auto_1fr] md:grid-cols-[clamp(4.5rem,12vw,9rem)_1fr_auto] items-start gap-4 sm:gap-6 md:gap-10">
                  {/* LEFT: Outlined Two-Digit Numeral */}
                  <div className="overflow-hidden">
                    <div
                      className="row-numeral font-serif tabular-nums text-[clamp(2.25rem,12vw,3.5rem)] md:text-[clamp(3rem,9vw,120px)] leading-none transition-colors duration-600 select-none"
                      style={{
                        color: 'transparent',
                        WebkitTextStroke: '1px rgba(12, 12, 12, 0.4)',
                      }}
                    >
                      {service.id}
                    </div>
                  </div>

                  {/* MIDDLE: Name, Description, Chips (Stacked, gap 12px) */}
                  <div className="flex flex-col gap-3 min-w-0">
                    {/* Name: masked rise on reveal, shifts 12px on hover */}
                    <div className="overflow-hidden">
                      <h3
                        className="row-name font-serif font-normal text-[#0C0C0C] text-[clamp(1.6rem,3.2vw,2.9rem)] leading-[1.05] tracking-[-0.02em] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3"
                      >
                        {service.name}
                      </h3>
                    </div>

                    {/* Description: shifts 8px on hover */}
                    <p
                      className="row-desc font-sans font-light text-[clamp(0.9rem,1.4vw,1.15rem)] leading-relaxed max-w-2xl text-[#0C0C0C] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2"
                      style={{ opacity: 0.6 }}
                    >
                      {service.description}
                    </p>

                    {/* Tag Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {service.tags.map((tag: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="row-chip font-sans font-medium text-[11px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border transition-colors duration-600 group-hover:border-[#A8832F] group-focus-visible:border-[#A8832F]"
                          style={{
                            borderColor: 'rgba(12, 12, 12, 0.2)',
                            color: 'var(--ink)',
                            opacity: 0.8,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: 52px Circular Action Button (md+ only) */}
                  <div className="hidden md:flex items-center justify-center pt-2">
                    <div
                      className="row-arrow-circle w-[52px] h-[52px] rounded-full border flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#0C0C0C] group-hover:border-[#0C0C0C] group-focus-visible:bg-[#0C0C0C] group-focus-visible:border-[#0C0C0C]"
                      style={{
                        borderColor: 'var(--hair)',
                        color: 'var(--ink)',
                      }}
                    >
                      <ArrowUpRight
                        size={20}
                        className="transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white group-hover:rotate-45 group-focus-visible:text-white group-focus-visible:rotate-45"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Hairline (draws on scroll reveal) */}
                <div
                  className="row-hairline absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
                  style={{ backgroundColor: 'var(--hair)' }}
                />

                {/* Bottom Gold Line on Hover (scaleX 0 -> 1 from left) */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left transform scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-10"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              </a>
            </li>
          ))}
        </ol>

        {/* ========================================================================= */}
        {/* CLOSING CTA (SECTION 6)                                                   */}
        {/* ========================================================================= */}
        <div
          ref={ctaRef}
          className="mt-20 sm:mt-24 text-center max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* CTA Headline: "Not sure where to *begin?*" */}
          <h3 className="font-serif font-normal text-[#0C0C0C] text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em]">
            <span>Not sure where to </span>
            <span className="italic" style={{ color: 'var(--accent-ink)' }}>
              begin?
            </span>
          </h3>

          {/* Sub line */}
          <p
            className="font-sans font-light text-[16px] leading-relaxed text-[#0C0C0C] mt-4"
            style={{ opacity: 0.6 }}
          >
            Speak with a senior advisor. A private consultation is always complimentary.
          </p>

          {/* Button */}
          <a
            href="#contact"
            className="group mt-8 inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full text-white font-sans font-medium text-[12px] uppercase tracking-[0.14em] transition-all duration-400 w-full sm:w-auto focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              backgroundColor: 'var(--ink)',
              outlineColor: 'var(--accent-ink)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--ink)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ink)';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <span>Book a Private Consultation</span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-400 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
            />
          </a>
        </div>
      </div>

      {/* Scoped Hover CSS rules for desktop fine-pointer */}
      <style>{`
        @media (pointer: fine) {
          .group:hover .row-numeral {
            color: var(--ink) !important;
            -webkit-text-stroke: 1px var(--ink) !important;
          }
        }
        .group:focus-visible .row-numeral {
          color: var(--ink) !important;
          -webkit-text-stroke: 1px var(--ink) !important;
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;

