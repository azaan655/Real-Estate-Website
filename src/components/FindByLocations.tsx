import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { locations, Location } from '../data/locations';
import { properties } from '../data/properties';
import { rentals } from '../data/rentals';
import { TransitionLink } from './PageTransition';

if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger && typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TabType = 'all' | 'buy' | 'rent';

export const FindByLocations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedListingsCount, setDisplayedListingsCount] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const tabsNavRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const indicatorRef = useRef<HTMLDivElement>(null);
  const extraWrapperRef = useRef<HTMLDivElement>(null);

  // Compute live listing counts
  const buyCounts = useMemo(() => {
    const map: Record<string, number> = {};
    locations.forEach((loc) => {
      const term = loc.name.toLowerCase();
      map[loc.slug] = properties.filter((p) =>
        (p.location || '').toLowerCase().includes(term)
      ).length;
    });
    return map;
  }, []);

  const rentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    locations.forEach((loc) => {
      const term = loc.name.toLowerCase();
      map[loc.slug] = rentals.filter((r) =>
        (r.location || '').toLowerCase().includes(term)
      ).length;
    });
    return map;
  }, []);

  // Total verified listings for active tab
  const totalVerifiedListings = useMemo(() => {
    return locations.reduce((sum, loc) => {
      const b = buyCounts[loc.slug] || 0;
      const r = rentCounts[loc.slug] || 0;
      const count = activeTab === 'all' ? b + r : activeTab === 'buy' ? b : r;
      return sum + count;
    }, 0);
  }, [activeTab, buyCounts, rentCounts]);

  // Read URL query parameter "?loc=all|buy|rent" on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const locParam = params.get('loc');
    if (locParam === 'all' || locParam === 'buy' || locParam === 'rent') {
      setActiveTab(locParam);
    }
  }, []);

  // Sort locations by active tab's count descending, ties by order ascending
  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      const countA =
        activeTab === 'all'
          ? (buyCounts[a.slug] || 0) + (rentCounts[a.slug] || 0)
          : activeTab === 'buy'
          ? buyCounts[a.slug] || 0
          : rentCounts[a.slug] || 0;
      const countB =
        activeTab === 'all'
          ? (buyCounts[b.slug] || 0) + (rentCounts[b.slug] || 0)
          : activeTab === 'buy'
          ? buyCounts[b.slug] || 0
          : rentCounts[b.slug] || 0;

      if (countB !== countA) return countB - countA;
      return a.order - b.order;
    });
  }, [activeTab, buyCounts, rentCounts]);

  // First 8 initially visible; remaining 4 in collapsible expansion
  const visibleLocations = useMemo(() => sortedLocations.slice(0, 8), [sortedLocations]);
  const extraLocations = useMemo(() => sortedLocations.slice(8), [sortedLocations]);

  // Sync tab sliding indicator
  const updateIndicator = useCallback(() => {
    const btn = tabButtonRefs.current[activeTab];
    const nav = tabsNavRef.current;
    const indicator = indicatorRef.current;
    if (!btn || !nav || !indicator) return;

    gsap.to(indicator, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: 0.5,
      ease: 'power3.inOut',
    });
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // Tween stats line listings count
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedListingsCount(totalVerifiedListings);
      return;
    }

    const obj = { val: displayedListingsCount };
    gsap.to(obj, {
      val: totalVerifiedListings,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => setDisplayedListingsCount(Math.round(obj.val)),
    });
  }, [totalVerifiedListings]);

  // Initial Entrance Animation with ScrollTrigger
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedListingsCount(totalVerifiedListings);
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

      // Eyebrow dash
      tl.fromTo(
        '.loc-eyebrow-dash',
        { scaleX: 0, transformOrigin: 'center' },
        { scaleX: 1, duration: 0.6, ease: 'power2.out' }
      );

      // Heading words rise through masks
      const words = sectionEl.querySelectorAll('.loc-heading-word');
      tl.fromTo(
        words,
        { yPercent: 110, filter: 'blur(6px)' },
        { yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.05, ease: 'power3.out' },
        '-=0.3'
      );

      // Gold sheen sweep
      const sheen = sectionEl.querySelector('.loc-accent-sheen');
      if (sheen) {
        tl.fromTo(
          sheen,
          { backgroundPosition: '200% 0' },
          { backgroundPosition: '-200% 0', duration: 1.2, ease: 'power2.inOut' },
          '-=0.5'
        );
      }

      // Intro
      tl.fromTo(
        '.loc-intro',
        { y: 16, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 0.65, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
        '-=0.6'
      );

      // Stats line
      tl.fromTo(
        '.loc-stats',
        { opacity: 0, y: 12 },
        { opacity: 0.6, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      );

      // Segmented control
      tl.fromTo(
        '.loc-tabs',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      // Cards batch entrance
      const cards = sectionEl.querySelectorAll('.location-card');
      tl.fromTo(
        cards,
        { y: 32, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.07, ease: 'power3.out' },
        '-=0.3'
      );
    }, sectionEl);

    return () => ctx.revert();
  }, [totalVerifiedListings]);

  // Tab switch handler
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab || isAnimating) return;
    setIsAnimating(true);
    setActiveTab(tab);

    // Sync URL parameter without reload
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('loc', tab);
      window.history.replaceState({}, '', url.toString());
    }

    const sectionEl = sectionRef.current;
    if (!sectionEl) {
      setIsAnimating(false);
      return;
    }

    // GSAP Flip animation if Flip is available, otherwise crossfade
    const flipPlugin = typeof window !== 'undefined' ? (window as any).Flip : null;
    if (flipPlugin && gsap.plugins?.flip) {
      const cardEls = sectionEl.querySelectorAll('.location-card');
      const state = flipPlugin.getState(cardEls);

      requestAnimationFrame(() => {
        flipPlugin.from(state, {
          duration: 0.8,
          ease: 'power3.inOut',
          stagger: 0.03,
          absolute: true,
          onComplete: () => setIsAnimating(false),
        });
      });
    } else {
      // Smooth fade transition fallback
      const cards = sectionEl.querySelectorAll('.location-card');
      gsap.fromTo(
        cards,
        { opacity: 0.6, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        }
      );
    }
  };

  // Keyboard navigation on tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabs: TabType[] = ['all', 'buy', 'rent'];
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(index + 1) % tabs.length];
      handleTabChange(next);
      tabButtonRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(index - 1 + tabs.length) % tabs.length];
      handleTabChange(prev);
      tabButtonRefs.current[prev]?.focus();
    }
  };

  // Toggle "Browse More Locations" expansion
  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (nextState) {
      // Smooth scroll into view when expanding
      setTimeout(() => {
        extraWrapperRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 150);
    }
  };

  // Render individual location card
  const renderCard = (loc: Location) => {
    const b = buyCounts[loc.slug] || 0;
    const r = rentCounts[loc.slug] || 0;
    const count = activeTab === 'all' ? b + r : activeTab === 'buy' ? b : r;
    const isEmpty = count === 0;

    // Link Target
    const linkTarget =
      activeTab === 'rent' || (activeTab === 'all' && b === 0)
        ? `/rent?q=${encodeURIComponent(loc.name)}`
        : `/buy?q=${encodeURIComponent(loc.name)}`;

    // Top-left chip text
    const chipText =
      activeTab === 'all'
        ? `Buy ${b} \u00B7 Rent ${r}`
        : activeTab === 'buy'
        ? `${b} for sale`
        : `${r} for rent`;

    const cardInner = (
      <>
        {/* 1. PHOTO */}
        <div className="relative aspect-[3/2] max-sm:aspect-[4/3] w-full rounded-[16px] overflow-hidden bg-[#E9E4D8]">
          <img
            src={loc.image}
            alt={`${loc.name}, Hyderabad`}
            width={600}
            height={400}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            style={{ objectPosition: loc.focal || 'center center' }}
          />
          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '45%',
              background: 'linear-gradient(to top, rgba(12,12,12,0.45) 0%, transparent 100%)',
            }}
          />

          {/* Top-left glass chip */}
          {!isEmpty && (
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.14em] backdrop-blur-md bg-black/35 text-white border border-white/10">
                {chipText}
              </span>
            </div>
          )}
        </div>

        {/* 2. TEXT ROW */}
        <div className="px-2 mt-5 flex justify-between items-end gap-3">
          <div className="overflow-hidden min-w-0 flex-1">
            {/* Location Name */}
            <div className="relative inline-block max-w-full">
              <h3
                title={loc.name}
                className="font-serif text-[clamp(1.5rem,1.9vw,1.85rem)] max-sm:text-[20px] leading-[1.1] text-[#0C0C0C] truncate group-hover:-translate-y-0.5 transition-transform duration-300"
              >
                {loc.name}
              </h3>
              {/* Gold underline reveal on hover */}
              {!isEmpty && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF6A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              )}
            </div>

            {/* Count line */}
            <p className="font-sans text-[14px] max-sm:text-[13px] text-[#0C0C0C]/65 mt-1">
              {isEmpty ? 'New listings soon' : `${count} ${count === 1 ? 'Property' : 'Properties'}`}
            </p>

            {/* Tagline */}
            <p className="font-sans text-[13px] text-[#0C0C0C]/55 truncate mt-0.5 max-sm:hidden">
              {loc.tagline}
            </p>
          </div>

          {/* Circle Action Button */}
          {isEmpty ? (
            <div className="w-11 h-11 sm:w-[46px] sm:h-[46px] rounded-full border border-[rgba(12,12,12,0.14)] flex items-center justify-center flex-shrink-0">
              <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#0C0C0C]/50">
                Soon
              </span>
            </div>
          ) : (
            <div className="w-11 h-11 sm:w-[46px] sm:h-[46px] rounded-full border border-[rgba(12,12,12,0.14)] bg-white flex items-center justify-center text-[#0C0C0C] group-hover:bg-[#D4AF6A] transition-all duration-300 shadow-sm flex-shrink-0">
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </div>
          )}
        </div>
      </>
    );

    return (
      <li key={loc.slug} className="location-card list-none">
        {isEmpty ? (
          <div
            aria-disabled="true"
            className="group rounded-[24px] bg-white border border-[rgba(12,12,12,0.14)] p-2.5 pb-[22px] shadow-[0_10px_30px_rgba(12,12,12,0.05)] opacity-60 flex flex-col justify-between select-none h-full"
          >
            {cardInner}
          </div>
        ) : (
          <TransitionLink
            to={linkTarget}
            aria-label={`${loc.name}: ${count} properties`}
            className="group rounded-[24px] bg-white border border-[rgba(12,12,12,0.14)] p-2.5 pb-[22px] shadow-[0_10px_30px_rgba(12,12,12,0.05)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(12,12,12,0.14)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] focus-visible:ring-offset-2 h-full block"
          >
            {cardInner}
          </TransitionLink>
        )}
      </li>
    );
  };

  return (
    <section
      id="locations"
      ref={sectionRef}
      aria-labelledby="locations-title"
      className="relative z-30 w-full bg-[#FAF8F4] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-24 md:pt-32 pb-[130px] sm:pb-[140px] md:pb-[160px]"
      style={{
        marginTop: 'calc(var(--home-overlap, 60px) * -1)',
      }}
    >
      <div className="max-w-[1180px] mx-auto">
        {/* ========================================================================= */}
        {/* 1. HEADER                                                                 */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#A8832F] rounded-full loc-eyebrow-dash" />
            <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#A8832F]">
              Explore Hyderabad
            </span>
          </div>

          {/* Heading with word rise */}
          <h2
            id="locations-title"
            className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-center text-[#0C0C0C]"
          >
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="inline-block loc-heading-word">Find your</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="inline-block italic text-[#A8832F] loc-heading-word loc-accent-sheen">
                neighbourhood.
              </span>
            </span>
          </h2>

          {/* Intro Description */}
          <p className="loc-intro font-sans font-light text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[#0C0C0C]/65 max-w-2xl mx-auto mt-6">
            Discover homes in prime neighbourhoods and fast-growing corridors, chosen for connectivity, amenities and long-term value. Each area is backed by verified listings and a local advisor.
          </p>

          {/* Stats Line with live tweened counter */}
          <p
            aria-live="polite"
            className="loc-stats font-sans text-[13px] text-[#0C0C0C]/60 mt-8"
          >
            12 localities &middot; {displayedListingsCount} verified listings
          </p>

          {/* ========================================================================= */}
          {/* 2. SEGMENTED CONTROL ("All", "Buy", "Rent")                               */}
          {/* ========================================================================= */}
          <div className="loc-tabs mt-8 flex justify-center">
            <div
              ref={tabsNavRef}
              role="radiogroup"
              aria-label="Filter locations by property type"
              className="relative inline-flex p-1.5 rounded-full border border-[rgba(12,12,12,0.14)] bg-white shadow-sm"
            >
              {/* Sliding Indicator Pill */}
              <div
                ref={indicatorRef}
                className="absolute top-1.5 bottom-1.5 rounded-full bg-[#0C0C0C] pointer-events-none"
                style={{
                  boxShadow: '0 4px 12px rgba(12,12,12,0.25)',
                }}
              />

              {(['all', 'buy', 'rent'] as TabType[]).map((tab, idx) => {
                const isSelected = activeTab === tab;
                const label = tab === 'all' ? 'All' : tab === 'buy' ? 'Buy' : 'Rent';

                return (
                  <button
                    key={tab}
                    ref={(el) => {
                      tabButtonRefs.current[tab] = el;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleTabChange(tab)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    className={`relative z-10 h-11 px-6 rounded-full font-sans font-medium text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] cursor-pointer flex items-center justify-center ${
                      isSelected ? 'text-white' : 'text-[#0C0C0C]/70 hover:text-[#0C0C0C]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. LOCATIONS GRID (INITIAL 8 CARDS)                                       */}
        {/* ========================================================================= */}
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-10 sm:mt-14">
          {visibleLocations.map(renderCard)}
        </ul>

        {/* ========================================================================= */}
        {/* 4. COLLAPSIBLE WRAPPER (EXTRA 4 CARDS)                                     */}
        {/* ========================================================================= */}
        <div
          id="extra-locations-wrapper"
          ref={extraWrapperRef}
          aria-hidden={!isExpanded}
          className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          style={{
            visibility: isExpanded ? 'visible' : 'hidden',
          }}
        >
          <div className="overflow-hidden">
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-4 sm:pt-5 lg:pt-6">
              {extraLocations.map(renderCard)}
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. "BROWSE MORE LOCATIONS" EXPANSION BUTTON                               */}
        {/* ========================================================================= */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            aria-controls="extra-locations-wrapper"
            className="group relative h-14 min-h-[44px] w-full max-w-xs sm:w-auto px-8 rounded-full bg-[#0C0C0C] text-white font-sans font-medium text-[12px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] cursor-pointer shadow-md"
          >
            {/* Gold fill sweep on hover */}
            <span className="absolute inset-0 bg-[#D4AF6A] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-[#0C0C0C] transition-colors duration-300">
              <span>{isExpanded ? 'Show Fewer Locations' : 'Browse More Locations'}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </span>
          </button>

          {/* When expanded: Text link to view all properties */}
          {isExpanded && (
            <div className="mt-5 animate-fade-in">
              <TransitionLink
                to={activeTab === 'rent' ? '/rent' : '/buy'}
                className="font-sans font-medium text-[13px] uppercase tracking-[0.16em] underline underline-offset-[6px] text-[#0C0C0C] hover:text-[#A8832F] transition-colors inline-flex items-center gap-1.5"
              >
                <span>View all properties</span>
                <ArrowUpRight size={14} />
              </TransitionLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FindByLocations;

