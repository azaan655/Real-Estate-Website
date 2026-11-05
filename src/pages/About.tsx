import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowUpRight,
  Phone,
  MessageCircle,
  MapPin,
  Quote,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import { TransitionLink, usePageTransition } from '../components/PageTransition';
import {
  BRAND_NAME,
  FOUNDED_YEAR,
  ABOUT_STATS,
  ABOUT_TIMELINE,
  ABOUT_VALUES,
  ABOUT_MISSION,
  ABOUT_VISION,
  ABOUT_PROCESS,
  ABOUT_TEAM,
  ABOUT_AREAS,
  ABOUT_TESTIMONIALS,
} from '../data/about';
import { properties } from '../data/properties';
import { rentals } from '../data/rentals';
import { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../data/services';

gsap.registerPlugin(ScrollTrigger);

// Four Corner Objects Metadata
const CORNER_OBJECTS = [
  {
    id: 'key',
    name: 'Brass key',
    src: '/about/obj-key.webp',
    posClass: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    sizeClass: 'w-[120px] sm:w-[160px] md:w-[210px]',
    enterX: -80,
    delay: 0.1,
    pair: 'left',
  },
  {
    id: 'villa',
    name: 'Villa model',
    src: '/about/obj-villa.webp',
    posClass: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    sizeClass: 'w-[100px] sm:w-[140px] md:w-[180px]',
    enterX: -80,
    delay: 0.25,
    pair: 'left',
  },
  {
    id: 'compass',
    name: 'Compass',
    src: '/about/obj-compass.webp',
    posClass: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    sizeClass: 'w-[120px] sm:w-[160px] md:w-[210px]',
    enterX: 80,
    delay: 0.15,
    pair: 'right',
  },
  {
    id: 'blueprint',
    name: 'Blueprint roll',
    src: '/about/obj-blueprint.webp',
    posClass: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    sizeClass: 'w-[130px] sm:w-[170px] md:w-[220px]',
    enterX: 80,
    delay: 0.3,
    pair: 'right',
  },
];

// Inline Line-Art Fallback SVG Icons
const FallbackArt: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'key':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF6A" strokeWidth="1.5" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,106,0.3)]">
          <circle cx="35" cy="35" r="18" strokeDasharray="120" strokeDashoffset="0" />
          <circle cx="35" cy="35" r="8" />
          <path d="M48 48 L82 82 L74 90 L68 84 L72 80 L64 72 L68 68 L60 60" strokeDasharray="100" strokeDashoffset="0" />
        </svg>
      );
    case 'villa':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF6A" strokeWidth="1.5" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,106,0.3)]">
          <path d="M20 75 L20 45 L50 22 L80 45 L80 75 Z" strokeDasharray="200" strokeDashoffset="0" />
          <rect x="36" y="52" width="16" height="23" />
          <rect x="58" y="48" width="14" height="14" />
          <path d="M12 75 L88 75" />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF6A" strokeWidth="1.5" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,106,0.3)]">
          <circle cx="50" cy="54" r="32" strokeDasharray="210" strokeDashoffset="0" />
          <circle cx="50" cy="54" r="26" strokeDasharray="4 4" />
          <polygon points="50,34 56,54 50,74 44,54" />
          <circle cx="50" cy="16" r="6" />
          <path d="M50 22 L50 26" />
        </svg>
      );
    case 'blueprint':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF6A" strokeWidth="1.5" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,106,0.3)]">
          <ellipse cx="25" cy="30" rx="8" ry="16" />
          <ellipse cx="75" cy="70" rx="8" ry="16" />
          <path d="M25 14 L75 54 M25 46 L75 86" />
          <line x1="32" y1="28" x2="68" y2="58" strokeDasharray="4 4" />
          <line x1="16" y1="84" x2="84" y2="16" stroke="#E9DCC0" strokeWidth="1" />
        </svg>
      );
    default:
      return null;
  }
};

export const About: React.FC = () => {
  const { ready } = usePageTransition();

  // Pointer drift tracking for Hero objects
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Fallback states for images if load fails
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});

  // Hero Heading & Character reveal refs
  const headingCharsRef = useRef<HTMLSpanElement[]>([]);
  const headingSheenRef = useRef<HTMLHeadingElement>(null);
  const heroParaContainerRef = useRef<HTMLDivElement>(null);
  const heroCharsRef = useRef<HTMLSpanElement[]>([]);

  // Journey paragraph word-by-word scrub ref
  const journeyParaRef = useRef<HTMLDivElement>(null);
  const journeyWordsRef = useRef<HTMLSpanElement[]>([]);
  const journeyLineRef = useRef<HTMLDivElement>(null);

  // Spotlights
  const ctaCardRef = useRef<HTMLDivElement>(null);

  // SEO & Head title
  useEffect(() => {
    document.title = 'About Us | VESTA';

    let meta = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
      createdMeta = true;
    }
    const prevDesc = meta.getAttribute('content') || '';
    meta.setAttribute(
      'content',
      'Meet the team behind VESTA: verified listings, transparent pricing and dedicated advisors across Hyderabad.'
    );

    // JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const agentSchema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: BRAND_NAME,
      areaServed: 'Hyderabad, Telangana, India',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      foundingDate: String(FOUNDED_YEAR),
      description:
        'Luxury real estate advisory in Hyderabad specializing in verified residences, premium villas, commercial spaces and private property management.',
    };
    script.textContent = JSON.stringify(agentSchema);
    document.head.appendChild(script);

    return () => {
      if (createdMeta && meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        meta.setAttribute('content', prevDesc);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Pointer drift loop for corner objects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 640;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) return;

    let animId: number;
    const handleMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mouseTargetRef.current = { x: nx * 18, y: ny * 18 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const loop = () => {
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.08;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.08;
      setMousePos({ x: mouseCurrentRef.current.x, y: mouseCurrentRef.current.y });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Hero animations when `ready` is true
  useEffect(() => {
    if (!ready || !heroRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion: show static
        heroCharsRef.current.forEach((c) => {
          if (c) c.style.opacity = '1';
        });
        return;
      }

      // 1. Heading Character Mask Rise
      if (headingCharsRef.current.length > 0) {
        gsap.fromTo(
          headingCharsRef.current,
          { y: '110%', opacity: 0, filter: 'blur(6px)' },
          {
            y: '0%',
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.03,
            ease: 'power3.out',
            onComplete: () => {
              // Metallic sheen sweep across heading
              if (headingSheenRef.current) {
                gsap.fromTo(
                  headingSheenRef.current,
                  { backgroundPosition: '200% 0' },
                  { backgroundPosition: '-200% 0', duration: 1.6, ease: 'power2.inOut', delay: 0.4 }
                );
              }
            },
          }
        );
      }

      // 2. Scroll-Driven Hero Paragraph Reveal
      if (heroParaContainerRef.current && heroCharsRef.current.length > 0) {
        const totalChars = heroCharsRef.current.length;
        ScrollTrigger.create({
          trigger: heroParaContainerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            for (let i = 0; i < totalChars; i++) {
              const el = heroCharsRef.current[i];
              if (!el) continue;
              const p = i / totalChars;
              const start = Math.max(0, p - 0.1);
              const end = Math.min(1, p + 0.05);
              const t = Math.min(Math.max((progress - start) / (end - start), 0), 1);
              const op = 0.2 + 0.8 * t;
              el.style.opacity = op.toFixed(2);
            }
          },
        });
      }

      // 3. Journey Story Paragraph Word Scrub
      if (journeyParaRef.current && journeyWordsRef.current.length > 0) {
        const totalWords = journeyWordsRef.current.length;
        ScrollTrigger.create({
          trigger: journeyParaRef.current,
          start: 'top 80%',
          end: 'bottom 30%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            for (let i = 0; i < totalWords; i++) {
              const wEl = journeyWordsRef.current[i];
              if (!wEl) continue;
              const p = i / totalWords;
              const start = Math.max(0, p - 0.12);
              const end = Math.min(1, p + 0.08);
              const t = Math.min(Math.max((progress - start) / (end - start), 0), 1);
              wEl.style.opacity = (0.25 + 0.75 * t).toFixed(2);
            }
          },
        });
      }

      // 4. Vertical Timeline Line Draw
      if (journeyLineRef.current) {
        gsap.fromTo(
          journeyLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#journey-timeline',
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: true,
            },
          }
        );
      }

      // 5. Odometer digit rolling on entering ivory section
      const statOdometers = document.querySelectorAll('.stat-odometer');
      statOdometers.forEach((odo) => {
        const target = parseInt(odo.getAttribute('data-target') || '0', 10);
        const strip = odo.querySelector('.odometer-strip') as HTMLElement | null;
        if (strip) {
          ScrollTrigger.create({
            trigger: odo,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(strip, {
                y: `-${target * 10}%`,
                duration: 1.6,
                ease: 'power3.inOut',
              });
            },
          });
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, [ready]);

  // CTA Card pointer spotlight tracking
  const handleCtaMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = ctaCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  }, []);

  // Area tile spotlight
  const handleAreaMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const tile = e.currentTarget;
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tile.style.setProperty('--mx', `${x}px`);
    tile.style.setProperty('--my', `${y}px`);
  }, []);

  // Compute live counts for 12 areas
  const areaCounts = useMemo(() => {
    const map: Record<string, { buy: number; rent: number }> = {};
    ABOUT_AREAS.forEach((area) => {
      const q = area.toLowerCase();
      const buy = properties.filter((p) => p.location.toLowerCase().includes(q)).length;
      const rent = rentals.filter((r) => r.location.toLowerCase().includes(q)).length;
      map[area] = { buy, rent };
    });
    return map;
  }, []);

  // Build Hero split characters
  const heroParagraphText =
    "For more than a decade we have helped families, investors and businesses across Hyderabad find homes they love and assets that grow. Every listing is verified, every price is transparent and every viewing is private. Let's find your next address together.";

  const heroWords = useMemo(() => {
    const words = heroParagraphText.split(' ');
    const highlightSet = new Set(['Hyderabad', 'verified,', 'transparent', 'private.']);
    return words.map((w) => {
      const isAccent = highlightSet.has(w);
      return { word: w, isAccent };
    });
  }, [heroParagraphText]);

  // Journey story words
  const journeyStoryText =
    'VESTA began with a simple belief: buying or renting a home should feel personal, not transactional. What started as a two-person desk in Banjara Hills has grown into a full-service agency covering residences, commercial space, plots and property management, still run on the same principle: one dedicated advisor and total transparency.';

  const journeyWords = useMemo(() => {
    return journeyStoryText.split(' ');
  }, [journeyStoryText]);

  return (
    <div
      style={
        {
          '--bg': '#0B0907',
          '--bg2': '#12100C',
          '--ink-on-dark': '#F4EFE6',
          '--muted': 'rgba(244,239,230,0.62)',
          '--hair': 'rgba(244,239,230,0.14)',
          '--accent': '#D4AF6A',
          '--accent-ink': '#E9DCC0',
          '--ivory': '#FAF8F4',
          '--ink': '#0C0C0C',
          '--accent-on-ivory': '#A8832F',
        } as React.CSSProperties
      }
      className="relative w-full min-h-screen bg-[#0B0907] text-[#F4EFE6] font-sans antialiased overflow-x-hidden selection:bg-[#D4AF6A]/30 selection:text-white"
    >
      {/* ===================================================================== */}
      {/* 2. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section
        id="top"
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-28 sm:py-32 overflow-hidden bg-[#0B0907]"
      >
        {/* Top shared navbar */}
        <Navbar />

        {/* Ambient spotlight behind everything */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, rgba(212,175,106,0.10) 0%, transparent 60%)',
          }}
        />

        {/* Faint grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 z-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* FOUR CORNER DECORATIVE OBJECTS */}
        {CORNER_OBJECTS.map((obj) => {
          const isLeft = obj.pair === 'left';
          const driftX = isLeft ? mousePos.x : -mousePos.x;
          const driftY = isLeft ? mousePos.y : -mousePos.y;

          return (
            <div
              key={obj.id}
              aria-hidden="true"
              className={`absolute z-0 ${obj.posClass} ${obj.sizeClass} pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]`}
              style={{
                opacity: ready ? 1 : 0,
                transform: ready
                  ? `translate3d(${driftX}px, ${driftY}px, 0)`
                  : `translate3d(${obj.enterX}px, 0, 0)`,
                transitionDelay: `${obj.delay}s`,
              }}
            >
              {/* Blurred gold glow behind object */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(212,175,106,0.25) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  transform: 'scale(1.2)',
                }}
              />

              {/* Object image or SVG fallback */}
              <div
                className="relative w-full aspect-square flex items-center justify-center"
                style={{
                  animation: `about-float-${isLeft ? '1' : '2'} ${7 + obj.delay * 10}s ease-in-out infinite`,
                }}
              >
                {!imgFailed[obj.id] ? (
                  <img
                    src={obj.src}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    onError={() => setImgFailed((prev) => ({ ...prev, [obj.id]: true }))}
                    className="w-full h-full object-contain mix-blend-screen select-none"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <FallbackArt type={obj.id} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* CENTRE CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-14 sm:gap-18 md:gap-20 mt-8 sm:mt-12">
          {/* GROUP 1: Eyebrow + Heading + Scroll-driven paragraph */}
          <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#D4AF6A]" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#E9DCC0]">
                About Us &#183; Est. {FOUNDED_YEAR} &#183; Hyderabad
              </span>
            </div>

            {/* <h1> About VESTA */}
            <h1
              ref={headingSheenRef}
              className="font-serif font-normal leading-none tracking-tight text-[clamp(3.25rem,12vw,10rem)] select-none pb-[0.12em]"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #7A705D 0%, #F1E7D0 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {'About '.split('').map((char, cIdx) => (
                <span
                  key={cIdx}
                  ref={(el) => {
                    if (el) headingCharsRef.current[cIdx] = el;
                  }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              <span
                className="italic"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, #B88A44 0%, #F1DFAE 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {BRAND_NAME.split('').map((char, cIdx) => {
                  const globalIdx = 6 + cIdx;
                  return (
                    <span
                      key={globalIdx}
                      ref={(el) => {
                        if (el) headingCharsRef.current[globalIdx] = el;
                      }}
                      className="inline-block"
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </h1>

            {/* SCROLL-DRIVEN PARAGRAPH */}
            <div ref={heroParaContainerRef} className="max-w-[560px] md:max-w-[620px] px-4">
              <p
                aria-label={heroParagraphText}
                className="font-sans font-medium text-[clamp(1rem,2vw,1.35rem)] leading-relaxed text-[#E9E2D3]"
              >
                {heroWords.map((item, wIdx) => (
                  <span
                    key={wIdx}
                    aria-hidden="true"
                    className={`inline-block whitespace-nowrap mr-[0.28em] ${
                      item.isAccent ? 'text-[#D4AF6A]' : ''
                    }`}
                  >
                    {item.word.split('').map((char, cIdx) => (
                      <span
                        key={cIdx}
                        ref={(el) => {
                          if (el) heroCharsRef.current.push(el);
                        }}
                        className="inline-block transition-opacity duration-75"
                        style={{ opacity: 0.2 }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* GROUP 2: CTA Pill Button + Link to Team + Scroll Cue */}
          <div className="flex flex-col items-center gap-6">
            <TransitionLink
              to="/#contact"
              transitionLabel="Contact"
              className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-4 rounded-full text-[#0C0C0C] font-sans font-medium text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:
                  'linear-gradient(123deg, #B88A44 0%, #D4AF6A 38%, #F1DFAE 72%, #D4AF6A 100%)',
                boxShadow:
                  '0 4px 14px rgba(212,175,106,0.30), 4px 4px 12px rgba(255,255,255,0.35) inset',
                outline: '2px solid rgba(255,255,255,0.45)',
                outlineOffset: '-3px',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Book a Private Consultation</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>

              {/* Hover Sheen Sweep */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                style={{
                  transform: 'translateX(-120%) skewX(-20deg)',
                  animation: 'about-sheen 3s infinite',
                }}
              />
            </TransitionLink>

            {/* Meet the team anchor link */}
            <a
              href="#team"
              className="font-sans font-medium text-[13px] uppercase tracking-[0.16em] text-white/70 hover:text-[#D4AF6A] underline underline-offset-6 transition-colors"
            >
              Meet the team &darr;
            </a>

            {/* Tiny Scroll Cue */}
            <div className="flex flex-col items-center gap-2 mt-4 opacity-60">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#F4EFE6]/60">
                Scroll
              </span>
              <div className="relative w-[1px] h-12 bg-white/15 overflow-hidden">
                <span
                  className="absolute top-0 left-0 w-full h-3 bg-[#D4AF6A] rounded-full"
                  style={{ animation: 'about-scroll-dot 2.4s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. BRAND STRIP (SLOW MARQUEE DIVIDER)                                */}
      {/* ===================================================================== */}
      <section
        aria-label="Values Marquee"
        className="w-full bg-[#12100C] border-y border-[rgba(244,239,230,0.14)] py-6 overflow-hidden select-none"
      >
        <div className="about-marquee-track flex items-center">
          {[...Array(4)].map((_, repIdx) => (
            <div key={repIdx} className="flex items-center shrink-0">
              <span className="font-sans font-semibold text-[12px] uppercase tracking-[0.3em] text-[#F4EFE6]/60">
                VERIFIED LISTINGS &#183; TRANSPARENT PRICING &#183; PRIVATE VIEWINGS &#183; DEDICATED ADVISORS &#183; HYDERABAD
              </span>
              <span className="inline-block w-1.5 h-1.5 bg-[#D4AF6A] rotate-45 mx-8 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. OUR STORY AND JOURNEY (VERTICAL TIMELINE)                         */}
      {/* ===================================================================== */}
      <section
        id="journey"
        aria-labelledby="journey-heading"
        className="relative w-full py-28 md:py-40 bg-[#0B0907]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-20 items-start">
            {/* LEFT: Sticky Heading & Scrubbed Paragraph */}
            <div className="lg:sticky lg:top-28 space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#D4AF6A]" />
                <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#D4AF6A]">
                  Our Story
                </span>
              </div>

              <h2
                id="journey-heading"
                className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-white"
              >
                A decade of
                <br />
                <span className="italic text-[#D4AF6A]">quiet</span> results.
              </h2>

              <div ref={journeyParaRef} className="max-w-md">
                <p
                  aria-label={journeyStoryText}
                  className="font-sans font-light text-[17px] leading-relaxed text-[#F4EFE6]/70"
                >
                  {journeyWords.map((word, wIdx) => (
                    <span
                      key={wIdx}
                      ref={(el) => {
                        if (el) journeyWordsRef.current[wIdx] = el;
                      }}
                      className="inline-block mr-[0.28em] transition-opacity duration-75"
                      style={{ opacity: 0.25 }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* RIGHT: Vertical Milestone Timeline */}
            <div id="journey-timeline" className="relative pl-6 sm:pl-10 space-y-16">
              {/* Background 1px Line */}
              <div className="absolute left-[7px] sm:left-[11px] top-4 bottom-4 w-[1px] bg-[rgba(244,239,230,0.14)]" />

              {/* Scrubbed Drawing Gold Line */}
              <div
                ref={journeyLineRef}
                className="absolute left-[7px] sm:left-[11px] top-4 bottom-4 w-[2px] bg-[#D4AF6A] origin-top"
                style={{ transform: 'scaleY(0)' }}
              />

              {ABOUT_TIMELINE.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-6 sm:gap-8 group">
                  {/* Timeline Node Dot */}
                  <div className="relative z-10 w-3.5 h-3.5 rounded-full border border-[#D4AF6A] bg-[#0B0907] group-hover:bg-[#D4AF6A] transition-colors mt-2 -ml-[13px] sm:-ml-[17px] shrink-0" />

                  <div className="space-y-2 flex-1">
                    <span className="font-serif text-4xl sm:text-5xl text-[#D4AF6A]/90 block">
                      {item.year}
                    </span>
                    <h3 className="font-sans font-semibold text-[16px] text-white">
                      {item.title}
                    </h3>
                    <p className="font-sans font-light text-[15px] leading-relaxed text-[#F4EFE6]/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 40px black gap before ivory band */}
      <div className="h-10 w-full bg-[#0B0907]" />

      {/* ===================================================================== */}
      {/* 5. NUMBERS AND VALUES (IVORY BAND, ROUNDED)                          */}
      {/* ===================================================================== */}
      <section
        aria-label="Numbers and Values"
        className="relative z-20 w-[calc(100%-24px)] lg:w-[calc(100%-48px)] mx-auto bg-[#FAF8F4] text-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] py-24 md:py-32 px-6 sm:px-10 md:px-16 shadow-2xl"
      >
        <div className="max-w-[1180px] mx-auto space-y-24 md:space-y-32">
          {/* (a) STATS STRIP WITH ODOMETER ROLL */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y-0 lg:divide-x divide-black/10">
              {ABOUT_STATS.map((stat, sIdx) => {
                const digits = String(stat.value).split('');
                return (
                  <div key={stat.key} className={sIdx > 0 ? 'lg:pl-8' : ''}>
                    <div className="flex items-baseline font-serif text-[clamp(3rem,6vw,5.5rem)] leading-none text-[#0C0C0C]">
                      {digits.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          data-target={d}
                          className="stat-odometer inline-block h-[1.05em] overflow-hidden align-baseline"
                        >
                          <span className="odometer-strip flex flex-col transition-transform will-change-transform">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                              <span key={num} className="h-[1.05em] flex items-center justify-center">
                                {num}
                              </span>
                            ))}
                          </span>
                        </span>
                      ))}
                      {stat.suffix && (
                        <span className="text-[#A8832F] ml-0.5">{stat.suffix}</span>
                      )}
                    </div>
                    <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#0C0C0C]/60 mt-3 font-medium">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="font-sans text-[12px] text-[#0C0C0C]/50 pt-2">
              Sample figures for demonstration.
            </p>
          </div>

          {/* (b) VALUES */}
          <div className="space-y-12">
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#0C0C0C]">
              What we stand <span className="italic text-[#A8832F]">for.</span>
            </h2>

            <div className="divide-y divide-black/15 border-b border-black/15">
              {ABOUT_VALUES.map((val) => (
                <div
                  key={val.index}
                  className="group py-10 md:py-12 grid grid-cols-1 md:grid-cols-[6rem_1fr_1.2fr] gap-4 md:gap-8 items-baseline transition-all duration-300"
                >
                  <span className="font-serif italic text-2xl md:text-3xl text-[#A8832F]">
                    {val.index}
                  </span>
                  <h3 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-[#0C0C0C] transition-transform duration-300 group-hover:translate-x-3">
                    {val.name}
                  </h3>
                  <p className="font-sans font-light text-[17px] leading-relaxed text-[#0C0C0C]/70">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* (c) MISSION AND VISION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="rounded-[24px] p-8 md:p-10 border border-black/12 bg-white hover:-translate-y-1.5 transition-transform duration-300 shadow-sm">
              <span className="block font-sans text-[11px] uppercase tracking-[0.2em] text-[#A8832F] font-semibold mb-3">
                Our Mission
              </span>
              <p className="font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-snug text-[#0C0C0C]">
                &ldquo;{ABOUT_MISSION}&rdquo;
              </p>
            </div>

            <div className="rounded-[24px] p-8 md:p-10 border border-black/12 bg-white hover:-translate-y-1.5 transition-transform duration-300 shadow-sm">
              <span className="block font-sans text-[11px] uppercase tracking-[0.2em] text-[#A8832F] font-semibold mb-3">
                Our Vision
              </span>
              <p className="font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-snug text-[#0C0C0C]">
                &ldquo;{ABOUT_VISION}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 40px black gap after ivory band */}
      <div className="h-10 w-full bg-[#0B0907]" />

      {/* ===================================================================== */}
      {/* 6. HOW WE WORK (STACKING STICKY CARDS)                                */}
      {/* ===================================================================== */}
      <section
        aria-labelledby="how-heading"
        className="relative w-full py-28 md:py-40 bg-[#0B0907]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 space-y-16">
          <div className="max-w-xl space-y-3">
            <h2
              id="how-heading"
              className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] text-white"
            >
              Five steps to
              <br />
              <span className="italic text-[#D4AF6A]">your keys.</span>
            </h2>
            <p className="font-sans text-[16px] text-[#F4EFE6]/60">
              A calm, transparent process, whether you are buying, renting or selling.
            </p>
          </div>

          {/* Cards List / Stacking Desktop Container */}
          <div className="space-y-6 lg:space-y-0 relative">
            {ABOUT_PROCESS.map((step, idx) => (
              <div
                key={step.numeral}
                className="lg:sticky rounded-[28px] min-h-[380px] md:min-h-[440px] p-8 md:p-12 border border-[rgba(244,239,230,0.14)] flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                  top: `calc(96px + ${idx * 18}px)`,
                  backgroundColor: idx % 2 === 0 ? '#12100C' : '#18140E',
                }}
              >
                {/* Huge Outlined Numeral */}
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-4 md:right-8 font-serif text-[clamp(8rem,18vw,16rem)] leading-none select-none pointer-events-none opacity-25"
                  style={{
                    WebkitTextStroke: '1.5px rgba(212,175,106,0.4)',
                    color: 'transparent',
                  }}
                >
                  {step.numeral}
                </span>

                <div className="relative z-10 max-w-lg space-y-4">
                  <span className="font-serif italic text-xl text-[#D4AF6A]">
                    Step {step.numeral}
                  </span>
                  <h3 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] text-white">
                    {step.title}
                  </h3>
                  <p className="font-sans font-light text-[17px] leading-relaxed text-[#F4EFE6]/70">
                    {step.copy}
                  </p>
                </div>

                {/* Chips */}
                <div className="relative z-10 flex flex-wrap gap-2.5 pt-8">
                  {step.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-4 py-1.5 rounded-full border border-[rgba(244,239,230,0.14)] font-sans text-[11px] uppercase tracking-wider text-[#F4EFE6]/80 bg-white/[0.02]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. MEET THE TEAM                                                      */}
      {/* ===================================================================== */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="relative w-full py-28 md:py-40 bg-[#12100C] border-t border-[rgba(244,239,230,0.14)]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 space-y-16">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#D4AF6A]" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#D4AF6A]">
                Our Team
              </span>
            </div>
            <h2
              id="team-heading"
              className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] text-white"
            >
              The people
              <br />
              <span className="italic text-[#D4AF6A]">behind the keys.</span>
            </h2>
            <p className="font-sans text-[16px] text-[#F4EFE6]/60">
              Experienced advisors who treat your move like their own.
            </p>
          </div>

          {/* 4 Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_TEAM.map((member) => (
              <div
                key={member.id}
                className="group rounded-[28px] border border-[rgba(244,239,230,0.14)] bg-[#0B0907] overflow-hidden flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF6A]/50 shadow-lg"
              >
                {/* 4:5 Monogram Portrait Panel */}
                <div className="relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-[#1C160E] to-[#0B0907] border border-white/5 flex items-center justify-center overflow-hidden mb-6">
                  {/* Rotating Conic Ring */}
                  <div
                    className="about-conic-ring absolute w-[160px] h-[160px] rounded-full p-[1px] opacity-40 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-full h-full rounded-full bg-[#0B0907]" />
                  </div>

                  {/* Monogram */}
                  <span className="relative z-10 font-serif text-[clamp(4rem,9vw,6rem)] text-[#E9DCC0] select-none transition-transform duration-500 group-hover:scale-105">
                    {member.monogram}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-serif text-[24px] text-white">
                    {member.name}
                  </h3>
                  <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-[#D4AF6A] font-medium">
                    {member.role}
                  </p>
                  <p className="font-sans font-light text-[14px] text-[#F4EFE6]/70 pt-1">
                    {member.specialty}
                  </p>
                </div>

                {/* Languages chips */}
                <div className="pt-6 border-t border-[rgba(244,239,230,0.10)] mt-6 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {member.languages.map((lang, lIdx) => (
                      <span
                        key={lIdx}
                        className="px-2.5 py-0.5 rounded-full bg-white/5 text-[11px] text-[#F4EFE6]/60 font-sans"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Consultation with ${encodeURIComponent(member.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white hover:text-[#D4AF6A] transition-colors"
                  >
                    <span>Book a call</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="font-sans text-[12px] text-[#F4EFE6]/50">
            Sample team for demonstration. Real profiles and photographs will replace these.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. WHERE WE WORK (AREAS TILES)                                        */}
      {/* ===================================================================== */}
      <section
        aria-labelledby="areas-heading"
        className="relative w-full py-28 md:py-40 bg-[#0B0907]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 space-y-16">
          <div className="max-w-xl space-y-3">
            <h2
              id="areas-heading"
              className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] text-white"
            >
              Hyderabad,
              <br />
              <span className="italic text-[#D4AF6A]">street by street.</span>
            </h2>
            <p className="font-sans text-[16px] text-[#F4EFE6]/60">
              Deep knowledge of the city&apos;s premium and fast-growing micro-markets.
            </p>
          </div>

          {/* 12 Locality Tiles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ABOUT_AREAS.map((area) => {
              const counts = areaCounts[area] || { buy: 0, rent: 0 };
              const targetRoute =
                counts.buy > 0
                  ? `/buy?q=${encodeURIComponent(area)}`
                  : `/rent?q=${encodeURIComponent(area)}`;

              return (
                <TransitionLink
                  key={area}
                  to={targetRoute}
                  onMouseMove={handleAreaMouseMove}
                  className="group relative rounded-[20px] border border-[rgba(244,239,230,0.14)] p-6 min-h-[150px] bg-[#12100C] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#D4AF6A]/60"
                  style={
                    {
                      '--mx': '50%',
                      '--my': '50%',
                    } as React.CSSProperties
                  }
                >
                  {/* Pointer Spotlight Hover Layer */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(circle 180px at var(--mx) var(--my), rgba(212,175,106,0.18), transparent 70%)',
                    }}
                  />

                  <div className="flex items-start justify-between">
                    <MapPin size={16} className="text-[#D4AF6A]" />
                    <ArrowUpRight
                      size={15}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    />
                  </div>

                  <div className="space-y-1 relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="font-serif text-[24px] text-white">
                      {area}
                    </h3>
                    <div className="flex items-center gap-3 font-sans text-xs text-[#F4EFE6]/60">
                      {counts.buy > 0 && <span>Buy {counts.buy}</span>}
                      {counts.buy > 0 && counts.rent > 0 && <span>&#183;</span>}
                      {counts.rent > 0 && <span>Rent {counts.rent}</span>}
                      {counts.buy === 0 && counts.rent === 0 && (
                        <span>Verified listings</span>
                      )}
                    </div>
                  </div>
                </TransitionLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. CLIENT WORDS (TESTIMONIALS)                                        */}
      {/* ===================================================================== */}
      <section
        aria-labelledby="words-heading"
        className="relative w-full py-28 bg-[#12100C] border-t border-[rgba(244,239,230,0.14)]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 space-y-14">
          <div className="max-w-xl space-y-3">
            <h2
              id="words-heading"
              className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] text-white"
            >
              Kind words,
              <br />
              <span className="italic text-[#D4AF6A]">in their own.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] border border-[rgba(244,239,230,0.14)] p-8 bg-[#0B0907] flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <Quote size={28} className="text-[#D4AF6A]" />
                  <p className="font-serif text-[clamp(1.35rem,2vw,1.75rem)] leading-snug text-white">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[rgba(244,239,230,0.10)]">
                  <p className="font-sans text-[13px] text-[#F4EFE6]/60">
                    &mdash; {item.attribution}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-sans text-[12px] text-[#F4EFE6]/50">
            Sample testimonials for demonstration. Real client words will replace these.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 10. FINAL CTA + SITE FOOTER                                           */}
      {/* ===================================================================== */}
      <section className="relative w-full pt-16 pb-20 bg-[#0B0907] px-5 sm:px-8 md:px-12 lg:px-16">
        <div
          ref={ctaCardRef}
          onMouseMove={handleCtaMouseMove}
          className="relative max-w-[1180px] mx-auto rounded-[40px] min-h-[480px] flex flex-col items-center justify-center text-center p-10 md:p-16 border border-[rgba(233,220,192,0.22)] overflow-hidden shadow-2xl"
          style={
            {
              background: 'radial-gradient(120% 120% at 50% 0%, #2A2218 0%, #0B0907 70%)',
              '--mx': '50%',
              '--my': '50%',
            } as React.CSSProperties
          }
        >
          {/* Spotlight Following Pointer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle 320px at var(--mx) var(--my), rgba(212,175,106,0.22), transparent 70%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#D4AF6A]" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#E9DCC0]">
                Let&apos;s talk
              </span>
            </div>

            <h2 className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] text-white">
              Let&apos;s find your
              <br />
              <span className="italic text-[#D4AF6A]">next address.</span>
            </h2>

            <p className="font-sans font-light text-[17px] text-[#F4EFE6]/70 max-w-lg leading-relaxed">
              Your first consultation is complimentary, private and without obligation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[#0C0C0C] font-sans font-medium text-xs sm:text-sm uppercase tracking-widest transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  background:
                    'linear-gradient(123deg, #B88A44 0%, #D4AF6A 38%, #F1DFAE 72%, #D4AF6A 100%)',
                  boxShadow:
                    '0 4px 14px rgba(212,175,106,0.30), 4px 4px 12px rgba(255,255,255,0.35) inset',
                }}
              >
                <span>Book a Private Consultation</span>
                <ArrowUpRight size={15} />
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(233,220,192,0.4)] text-white font-sans text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(233,220,192,0.4)] text-white font-sans text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                <Phone size={15} />
                <span>Call us</span>
              </a>
            </div>

            <p className="font-sans text-[12px] text-[#F4EFE6]/60 mt-4">
              Monday to Saturday, 9:30 am to 7:00 pm
            </p>
          </div>
        </div>
      </section>

      {/* Shared SiteFooter at bottom of /about */}
      <SiteFooter />
    </div>
  );
};

export default About;

