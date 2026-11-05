import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  PieChart,
  Users,
  BadgeCheck,
  Search,
  FileCheck,
  Key,
  TrendingUp,
  Megaphone,
  Handshake,
  ShieldCheck,
  Eye,
  UserCheck,
  Lock,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOW_TABS, HowStep, HowTab } from '../data/howItWorks';
import { CONTACT_EMAIL } from '../data/services';
import { TransitionLink } from './PageTransition';

if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger && typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TINT_COLORS = {
  t1: {
    main: '#3FB59A',
    bg: 'rgba(63, 181, 154, 0.10)',
    stroke: 'rgba(63, 181, 154, 0.45)',
    glow: 'rgba(63, 181, 154, 0.28)',
  },
  t2: {
    main: '#D4AF6A',
    bg: 'rgba(212, 175, 106, 0.10)',
    stroke: 'rgba(212, 175, 106, 0.45)',
    glow: 'rgba(212, 175, 106, 0.28)',
  },
  t3: {
    main: '#D98A5F',
    bg: 'rgba(217, 138, 95, 0.10)',
    stroke: 'rgba(217, 138, 95, 0.45)',
    glow: 'rgba(217, 138, 95, 0.28)',
  },
};

// Helper to safely render icons by name
const renderStepIcon = (iconName: string, size = 38) => {
  switch (iconName) {
    case 'PieChart':
    case 'ChartPie':
      return <PieChart size={size} strokeWidth={1.5} />;
    case 'Users':
      return <Users size={size} strokeWidth={1.5} />;
    case 'BadgeCheck':
      return <BadgeCheck size={size} strokeWidth={1.5} />;
    case 'Search':
      return <Search size={size} strokeWidth={1.5} />;
    case 'FileCheck':
      return <FileCheck size={size} strokeWidth={1.5} />;
    case 'Key':
      return <Key size={size} strokeWidth={1.5} />;
    case 'TrendingUp':
      return <TrendingUp size={size} strokeWidth={1.5} />;
    case 'Megaphone':
      return <Megaphone size={size} strokeWidth={1.5} />;
    case 'Handshake':
      return <Handshake size={size} strokeWidth={1.5} />;
    default:
      return <Check size={size} strokeWidth={1.5} />;
  }
};

export const HowItWorks: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [isAnimatingTab, setIsAnimatingTab] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulsedSteps, setPulsedSteps] = useState<{ [key: number]: boolean }>({ 1: true });

  const sectionRef = useRef<HTMLElement>(null);
  const tabsNavRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const indicatorRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLOListElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  const activeTab = useMemo(() => {
    return HOW_TABS.find((t) => t.id === activeTabId) || HOW_TABS[0];
  }, [activeTabId]);

  // Read URL query parameter "?how=buy|rent|sell" on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const howParam = params.get('how');
    if (howParam === 'buy' || howParam === 'rent' || howParam === 'sell') {
      setActiveTabId(howParam);
    }
  }, []);

  // Sync tab indicator position
  const updateIndicator = useCallback(() => {
    const btn = tabButtonRefs.current[activeTabId];
    const nav = tabsNavRef.current;
    const indicator = indicatorRef.current;
    if (!btn || !nav || !indicator) return;

    const left = btn.offsetLeft;
    const width = btn.offsetWidth;

    gsap.to(indicator, {
      x: left,
      width,
      duration: 0.5,
      ease: 'power3.inOut',
    });
  }, [activeTabId]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // Initial Entrance Animation with ScrollTrigger
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(1);
      setPulsedSteps({ 1: true, 2: true, 3: true });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 75%',
          once: true,
        },
      });

      // 1. Eyebrow dash draws
      tl.fromTo(
        '.how-eyebrow-dash',
        { scaleX: 0, transformOrigin: 'center' },
        { scaleX: 1, duration: 0.6, ease: 'power2.out' }
      );

      // 2. Heading words rise through masks
      const words = sectionEl.querySelectorAll('.how-heading-word');
      tl.fromTo(
        words,
        { yPercent: 110, filter: 'blur(6px)' },
        { yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.05, ease: 'power3.out' },
        '-=0.3'
      );

      // Gold sheen sweep on accent
      const sheen = sectionEl.querySelector('.how-accent-sheen');
      if (sheen) {
        tl.fromTo(
          sheen,
          { backgroundPosition: '200% 0' },
          { backgroundPosition: '-200% 0', duration: 1.2, ease: 'power2.inOut' },
          '-=0.5'
        );
      }

      // 3. Tabs segmented pill rises
      tl.fromTo(
        '.how-tabs-container',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.6'
      );

      // 4. Step columns rise in stagger
      const stepCols = sectionEl.querySelectorAll('.how-step-column');
      tl.fromTo(
        stepCols,
        { y: 40, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.15, ease: 'power3.out' },
        '-=0.4'
      );

      // Diamond borders draw
      const rects = sectionEl.querySelectorAll('.diamond-rect');
      rects.forEach((rect) => {
        tl.fromTo(
          rect,
          { strokeDasharray: 260, strokeDashoffset: 260 },
          { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' },
          '-=0.8'
        );
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  // Intro word scrubbed opacity ramp
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const introWords = sectionEl.querySelectorAll('.how-intro-word');
      if (introWords.length > 0) {
        gsap.fromTo(
          introWords,
          { opacity: 0.25 },
          {
            opacity: 1,
            stagger: 0.02,
            ease: 'none',
            scrollTrigger: {
              trigger: '.how-intro-paragraph',
              start: 'top 85%',
              end: 'top 45%',
              scrub: true,
            },
          }
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  // Scroll Progress Driver for Connectors and Diamond Activations
  useEffect(() => {
    const stepsEl = stepsContainerRef.current;
    if (!stepsEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stepsEl,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Step 2 activation at p >= 0.45
          if (p >= 0.45 && !pulsedSteps[2]) {
            setPulsedSteps((prev) => ({ ...prev, 2: true }));
            const diamond2 = stepsEl.querySelector('.diamond-wrap-2');
            if (diamond2) {
              gsap.fromTo(
                diamond2,
                { scale: 0.92 },
                { scale: 1, duration: 0.6, ease: 'back.out(2)' }
              );
            }
          } else if (p < 0.42 && pulsedSteps[2]) {
            setPulsedSteps((prev) => ({ ...prev, 2: false }));
          }

          // Step 3 activation at p >= 0.88
          if (p >= 0.88 && !pulsedSteps[3]) {
            setPulsedSteps((prev) => ({ ...prev, 3: true }));
            const diamond3 = stepsEl.querySelector('.diamond-wrap-3');
            if (diamond3) {
              gsap.fromTo(
                diamond3,
                { scale: 0.92 },
                { scale: 1, duration: 0.6, ease: 'back.out(2)' }
              );
            }
          } else if (p < 0.85 && pulsedSteps[3]) {
            setPulsedSteps((prev) => ({ ...prev, 3: false }));
          }
        },
      });
    }, stepsEl);

    return () => ctx.revert();
  }, [pulsedSteps]);

  // Handle Tab Switch
  const handleTabChange = (tabId: 'buy' | 'rent' | 'sell') => {
    if (tabId === activeTabId || isAnimatingTab) return;
    setIsAnimatingTab(true);

    // Announce to screen readers
    if (announcerRef.current) {
      const labelMap = { buy: 'buying', rent: 'renting', sell: 'selling' };
      announcerRef.current.textContent = `Showing the ${labelMap[tabId]} process`;
    }

    // Update URL query parameter
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('how', tabId);
      window.history.replaceState({}, '', url.toString());
    }

    const contentEl = contentWrapperRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !contentEl) {
      setActiveTabId(tabId);
      setIsAnimatingTab(false);
      return;
    }

    // 0.7s total timeline transition
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimatingTab(false);
      },
    });

    // Outgoing content fades and rises -14px
    tl.to('.how-step-content', {
      y: -14,
      opacity: 0,
      filter: 'blur(4px)',
      duration: 0.25,
      ease: 'power2.in',
    });

    // RotateY illusion on icon
    tl.to(
      '.diamond-icon-wrap',
      {
        rotateY: 90,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setActiveTabId(tabId);
        },
      },
      '-=0.15'
    );

    // Incoming content rises in
    tl.fromTo(
      '.how-step-content',
      { y: 18, opacity: 0, filter: 'blur(6px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.06, ease: 'power3.out' }
    );

    tl.fromTo(
      '.diamond-icon-wrap',
      { rotateY: 90, scale: 0.85 },
      { rotateY: 0, scale: 1, duration: 0.45, ease: 'power2.out' },
      '-=0.4'
    );
  };

  // Keyboard navigation on tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabs: ('buy' | 'rent' | 'sell')[] = ['buy', 'rent', 'sell'];
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % tabs.length;
      handleTabChange(tabs[nextIdx]);
      tabButtonRefs.current[tabs[nextIdx]]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + tabs.length) % tabs.length;
      handleTabChange(tabs[prevIdx]);
      tabButtonRefs.current[tabs[prevIdx]]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(tabs[0]);
      tabButtonRefs.current[tabs[0]]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(tabs[tabs.length - 1]);
      tabButtonRefs.current[tabs[tabs.length - 1]]?.focus();
    }
  };

  // Compute Connector Progress
  // Connector 1: progress 0.12 -> 0.42
  const conn1Progress = Math.min(Math.max((progress - 0.12) / 0.3, 0), 1);
  // Connector 2: progress 0.55 -> 0.85
  const conn2Progress = Math.min(Math.max((progress - 0.55) / 0.3, 0), 1);

  // Intro paragraph text
  const introText =
    'Our streamlined process makes finding, renting or selling a property clear and stress-free. From personalised matching to paperwork and negotiation, one dedicated advisor guides you through every step.';
  const introWords = introText.split(' ');

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-title"
      className="relative z-30 w-full bg-[#0B0907] text-[#F4EFE6] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-28 md:pt-40 pb-28 sm:pb-36 md:pb-48 overflow-hidden"
      style={{
        marginTop: 'calc(var(--home-overlap, 60px) * -1)',
      }}
    >
      {/* Visually Hidden Live Announcer for Screen Readers */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        className="sr-only"
      />

      {/* Ambient Lighting & Faint Dot Grid (aria-hidden, static) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Radial spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 18%, rgba(212,175,106,0.10) 0%, transparent 60%)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(244,239,230,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto">
        {/* ========================================================================= */}
        {/* 1. HEADER & INTRO                                                         */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#E9DCC0] rounded-full how-eyebrow-dash" />
            <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#E9DCC0]">
              How it works
            </span>
          </div>

          {/* Heading */}
          <h2
            id="how-title"
            className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-center text-[#F4EFE6]"
          >
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="inline-block how-heading-word">A simple path to</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="inline-block italic text-[#E9DCC0] how-heading-word how-accent-sheen">
                your next address.
              </span>
            </span>
          </h2>

          {/* Intro Paragraph with scrubbed word-by-word opacity ramp */}
          <p className="how-intro-paragraph font-sans font-light text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[rgba(244,239,230,0.62)] mt-6">
            {introWords.map((word, i) => (
              <span key={i} className="how-intro-word inline-block mr-1.5 transition-opacity">
                {word}
              </span>
            ))}
          </p>

          {/* ========================================================================= */}
          {/* 2. TABS SEGMENTED PILL                                                    */}
          {/* ========================================================================= */}
          <div className="how-tabs-container mt-12 flex justify-center">
            <div
              ref={tabsNavRef}
              role="tablist"
              aria-label="Process categories"
              className="relative inline-flex p-1.5 rounded-full border border-[rgba(244,239,230,0.14)] bg-[rgba(244,239,230,0.04)] backdrop-blur-md w-full max-w-md sm:w-auto grid grid-cols-3 sm:flex"
            >
              {/* Sliding Pill Indicator */}
              <div
                ref={indicatorRef}
                className="absolute top-1.5 bottom-1.5 rounded-full bg-[#F4EFE6] pointer-events-none"
                style={{
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                }}
              />

              {HOW_TABS.map((tab, idx) => {
                const isSelected = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabButtonRefs.current[tab.id] = el;
                    }}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isSelected}
                    aria-controls={`tabpanel-${tab.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleTabChange(tab.id as 'buy' | 'rent' | 'sell')}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    className={`relative z-10 h-11 px-6 rounded-full font-sans font-medium text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] cursor-pointer flex items-center justify-center ${
                      isSelected ? 'text-[#0B0907]' : 'text-[rgba(244,239,230,0.7)] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. THE THREE STEPS                                                        */}
        {/* ========================================================================= */}
        <div
          ref={contentWrapperRef}
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="mt-20 md:mt-24"
        >
          <ol
            ref={stepsContainerRef}
            className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] items-center lg:items-start gap-y-12 lg:gap-y-0 lg:gap-x-6"
          >
            {activeTab.steps.map((step, idx) => {
              const stepNum = idx + 1;
              const tint = TINT_COLORS[step.tint];
              const isStepActive =
                stepNum === 1
                  ? true
                  : stepNum === 2
                  ? progress >= 0.45
                  : progress >= 0.88;

              return (
                <React.Fragment key={stepNum}>
                  {/* STEP COLUMN */}
                  <li
                    aria-label={`Step ${stepNum} of 3`}
                    className="how-step-column group/step flex flex-col items-center text-center w-full max-w-sm lg:max-w-none"
                  >
                    {/* 1. Step Label */}
                    <span
                      className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] mb-6 transition-colors"
                      style={{ color: tint.main }}
                    >
                      Step 0{stepNum}
                    </span>

                    {/* 2. Diamond Icon (104px square wrapper with SVG rounded square rotated 45deg) */}
                    <div
                      className={`diamond-wrap-${stepNum} relative w-[104px] h-[104px] flex items-center justify-center mx-auto cursor-default`}
                      style={{
                        margin: '12px auto',
                      }}
                    >
                      {/* Glow effect when active */}
                      <div
                        className="absolute inset-0 rounded-[26px] transition-all duration-500 pointer-events-none group-hover/step:-translate-y-1.5"
                        style={{
                          boxShadow: isStepActive ? `0 0 48px ${tint.glow}` : 'none',
                          transform: 'rotate(45deg)',
                        }}
                      />

                      {/* SVG Diamond Shape */}
                      <svg
                        width="104"
                        height="104"
                        viewBox="0 0 104 104"
                        className="absolute inset-0 transition-transform duration-500 group-hover/step:-translate-y-1.5"
                      >
                        <rect
                          x="16"
                          y="16"
                          width="72"
                          height="72"
                          rx="22"
                          transform="rotate(45 52 52)"
                          fill={tint.bg}
                          stroke={tint.stroke}
                          strokeWidth="1.2"
                          className="diamond-rect transition-all duration-500"
                          style={{
                            opacity: isStepActive ? 1 : 0.4,
                          }}
                        />
                      </svg>

                      {/* Activation Ring Pulse */}
                      {pulsedSteps[stepNum] && (
                        <div
                          className="absolute inset-0 rounded-[22px] pointer-events-none diamond-pulse-ring"
                          style={{
                            border: `1px solid ${tint.main}`,
                            transform: 'rotate(45deg)',
                          }}
                        />
                      )}

                      {/* Lucide Icon counter-rotated to remain upright */}
                      <div
                        className="diamond-icon-wrap relative z-10 flex items-center justify-center transition-all duration-500 group-hover/step:-translate-y-1.5"
                        style={{
                          color: tint.main,
                          opacity: isStepActive ? 1 : 0.45,
                        }}
                      >
                        {renderStepIcon(step.icon, 38)}
                      </div>
                    </div>

                    {/* Dynamic Step Content (animated on tab switch) */}
                    <div className="how-step-content flex flex-col items-center w-full">
                      {/* 3. Duration Chip */}
                      <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(244,239,230,0.14)] font-sans font-medium text-[11px] uppercase tracking-[0.14em] text-[rgba(244,239,230,0.62)] bg-[rgba(244,239,230,0.02)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A]" />
                        <span>{step.duration}</span>
                      </div>

                      {/* 4. Title */}
                      <h3 className="font-serif text-[clamp(1.75rem,2.4vw,2.2rem)] leading-[1.1] text-[#F4EFE6] mt-5 group-hover/step:-translate-y-0.5 transition-transform duration-300">
                        {step.title}
                      </h3>

                      {/* 5. Description */}
                      <p className="font-sans font-light text-[16px] leading-[1.75] text-[rgba(244,239,230,0.62)] max-w-sm mx-auto mt-4">
                        {step.text}
                      </p>

                      {/* 6. Check List */}
                      <ul className="mt-6 max-w-xs mx-auto text-left space-y-2.5 w-full">
                        {step.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <div
                              className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ borderColor: tint.main }}
                            >
                              <Check size={12} style={{ color: tint.main }} />
                            </div>
                            <span className="font-sans text-[14px] text-[rgba(244,239,230,0.8)] leading-snug">
                              {pt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>

                  {/* ARROW CONNECTOR BETWEEN STEPS */}
                  {idx < 2 && (
                    <>
                      {/* Desktop Horizontal Connector (hidden below lg) */}
                      <div
                        aria-hidden="true"
                        className="hidden lg:flex flex-col items-center justify-center min-w-[96px] h-full"
                        style={{
                          marginTop: '68px', // Center aligned with the 104px diamond
                        }}
                      >
                        <div className="relative w-full h-[24px] flex items-center">
                          {/* Base line */}
                          <div className="w-full h-[1px] bg-[rgba(244,239,230,0.14)]" />

                          {/* Gold scroll progress fill */}
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#D4AF6A] transition-transform duration-100 ease-out"
                            style={{
                              width: '100%',
                              transformOrigin: 'left',
                              transform: `scaleX(${idx === 0 ? conn1Progress : conn2Progress})`,
                            }}
                          />

                          {/* Travelling gold dot once complete */}
                          {(idx === 0 ? conn1Progress : conn2Progress) >= 1 && (
                            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4AF6A] shadow-[0_0_8px_#D4AF6A] how-travelling-dot-h" />
                          )}

                          {/* Arrowhead on right end */}
                          <svg
                            width="8"
                            height="12"
                            viewBox="0 0 8 12"
                            className="absolute -right-1 top-1/2 -translate-y-1/2 fill-none stroke-[rgba(244,239,230,0.4)]"
                            style={{
                              stroke:
                                (idx === 0 ? conn1Progress : conn2Progress) >= 0.95
                                  ? '#D4AF6A'
                                  : 'rgba(244,239,230,0.4)',
                            }}
                          >
                            <polyline points="1,1 7,6 1,11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>

                      {/* Mobile / Tablet Vertical Connector (hidden on lg) */}
                      <div
                        aria-hidden="true"
                        className="flex lg:hidden flex-col items-center justify-center w-full h-16 relative my-2"
                      >
                        <div className="relative w-[24px] h-full flex flex-col items-center">
                          {/* Base line */}
                          <div className="w-[1px] h-full bg-[rgba(244,239,230,0.14)]" />

                          {/* Gold scroll progress fill */}
                          <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#D4AF6A] transition-transform duration-100 ease-out"
                            style={{
                              height: '100%',
                              transformOrigin: 'top',
                              transform: `scaleY(${idx === 0 ? conn1Progress : conn2Progress})`,
                            }}
                          />

                          {/* Travelling gold dot once complete */}
                          {(idx === 0 ? conn1Progress : conn2Progress) >= 1 && (
                            <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D4AF6A] shadow-[0_0_8px_#D4AF6A] how-travelling-dot-v" />
                          )}

                          {/* Arrowhead at bottom */}
                          <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 fill-none"
                            style={{
                              stroke:
                                (idx === 0 ? conn1Progress : conn2Progress) >= 0.95
                                  ? '#D4AF6A'
                                  : 'rgba(244,239,230,0.4)',
                            }}
                          >
                            <polyline points="1,1 6,7 11,1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </div>

        {/* ========================================================================= */}
        {/* 4. TRUST STRIP                                                            */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-24 border-t border-b border-[rgba(244,239,230,0.14)] py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[rgba(244,239,230,0.10)]">
            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0">
              <ShieldCheck size={20} className="text-[#D4AF6A] flex-shrink-0" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.16em] text-[rgba(244,239,230,0.85)]">
                Verified listings only
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0">
              <Eye size={20} className="text-[#D4AF6A] flex-shrink-0" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.16em] text-[rgba(244,239,230,0.85)]">
                No hidden fees
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0">
              <UserCheck size={20} className="text-[#D4AF6A] flex-shrink-0" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.16em] text-[rgba(244,239,230,0.85)]">
                One dedicated advisor
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0">
              <Lock size={20} className="text-[#D4AF6A] flex-shrink-0" />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.16em] text-[rgba(244,239,230,0.85)]">
                Private and discreet
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. CTA BLOCK                                                              */}
        {/* ========================================================================= */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h3 className="font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight text-[#F4EFE6]">
            Ready to take the{' '}
            <span className="italic text-[#E9DCC0]">first step?</span>
          </h3>
          <p className="font-sans font-light text-[16px] text-[rgba(244,239,230,0.62)] mt-3">
            Your first consultation is complimentary and without obligation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            {/* Primary Button: Book a Free Consultation */}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Consultation Request: VESTA Real Estate')}`}
              className="group relative h-14 px-8 rounded-full bg-[#F4EFE6] text-[#0B0907] font-sans font-medium text-[12px] uppercase tracking-[0.14em] flex items-center gap-2 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] cursor-pointer shadow-lg"
            >
              {/* Gold fill sweep on hover */}
              <span className="absolute inset-0 bg-[#D4AF6A] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative z-10 flex items-center gap-2 text-[#0B0907] group-hover:text-black">
                <span>Book a Free Consultation</span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>

            {/* Secondary Button: Explore Our Services */}
            <TransitionLink
              to="/services"
              className="h-14 px-8 rounded-full border border-[rgba(233,220,192,0.4)] text-white hover:bg-white hover:text-black transition-all duration-300 font-sans font-medium text-[12px] uppercase tracking-[0.14em] flex items-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] cursor-pointer"
            >
              <span>Explore Our Services</span>
              <ArrowUpRight size={14} />
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

