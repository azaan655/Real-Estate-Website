import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Plus, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getBuyPageConfig, BuyPageConfig } from '../data/buyPages';
import {
  BUY_TAXONOMY_GROUPS,
  getPropertiesForSlug,
  getPropertiesWithFallback,
  countFor,
} from '../data/buyTaxonomy';
import { Property, formatPrice } from '../data/properties';
import SearchBar from '../components/SearchBar';
import BuyCard from '../components/BuyCard';
import CategoryModules from '../components/CategoryModules';
import PropertyDetail from '../components/PropertyDetail';
import { TransitionLink, usePageTransition } from '../components/PageTransition';
import NotFound from './NotFound';

gsap.registerPlugin(ScrollTrigger);

export const BuyCategory: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getBuyPageConfig(slug) : undefined;

  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [bhkFilter, setBhkFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string | number, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tickerWrapRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { isTransitioning } = usePageTransition();

  // If slug is unknown, return NotFound immediately
  if (!config || !slug) {
    return <NotFound />;
  }

  // Manage dynamic document title
  useEffect(() => {
    document.title = `${config.label} | VESTA`;
  }, [config.label]);

  // Set Theme CSS Variables on mount, cleanup on unmount
  useEffect(() => {
    const root = document.documentElement;
    const { theme, displayFont } = config;

    const fontMap = {
      instrument: '"Instrument Serif", Georgia, serif',
      cormorant: '"Cormorant Garamond", Georgia, serif',
      fraunces: 'Fraunces, Georgia, serif',
      grotesk: '"Space Grotesk", sans-serif',
    };

    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--ink', theme.ink || '#0C0C0C');
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-ink', theme.accentInk);
    root.style.setProperty('--dark1', theme.dark1);
    root.style.setProperty('--dark2', theme.dark2);
    root.style.setProperty('--font-display', fontMap[displayFont]);
    root.setAttribute('data-mode', theme.mode);

    // Preload font to prevent FOIT
    if (document.fonts) {
      document.fonts.load(`1em ${fontMap[displayFont]}`).catch(() => {});
    }

    return () => {
      root.style.removeProperty('--bg');
      root.style.removeProperty('--ink');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-ink');
      root.style.removeProperty('--dark1');
      root.style.removeProperty('--dark2');
      root.style.removeProperty('--font-display');
      root.removeAttribute('data-mode');
    };
  }, [config]);

  // Fetch category listings & fallback suggestions
  const { primary: baseProperties, suggestions } = useMemo(() => {
    return getPropertiesWithFallback(slug);
  }, [slug]);

  // Filter listings based on user search inputs within the category
  const filteredProperties = useMemo(() => {
    let list = baseProperties.filter((p) => {
      // Search query (keyword in name, location, description, highlights, subtype)
      if (q.trim()) {
        const query = q.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesLoc = p.location.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSubtype = p.subtype.toLowerCase().includes(query);
        const matchesHighlights = p.highlights.some((h) => h.toLowerCase().includes(query));
        if (!matchesName && !matchesLoc && !matchesDesc && !matchesSubtype && !matchesHighlights) {
          return false;
        }
      }

      // Type filter
      if (typeFilter) {
        if (typeFilter === 'flats-apartments' && p.type !== 'apartment') return false;
        if (typeFilter === 'independent-houses' && p.type !== 'house') return false;
        if (typeFilter === 'villas' && p.type !== 'villa') return false;
        if (typeFilter === 'plots-land' && p.type !== 'plot') return false;
        if (typeFilter === 'commercial' && p.type !== 'commercial') return false;
      }

      // Budget filter
      if (budgetFilter) {
        if (budgetFilter === 'under-50-lacs' && p.priceCr >= 0.5) return false;
        if (budgetFilter === '50-lacs-to-1-cr' && (p.priceCr < 0.5 || p.priceCr >= 1)) return false;
        if (budgetFilter === '1-cr-to-5-cr' && (p.priceCr < 1 || p.priceCr >= 5)) return false;
        if (budgetFilter === 'above-5-cr' && p.priceCr < 5) return false;
      }

      // BHK filter
      if (bhkFilter) {
        if (bhkFilter === '1-bhk' && p.beds !== 1) return false;
        if (bhkFilter === '2-bhk' && p.beds !== 2) return false;
        if (bhkFilter === '3-bhk' && p.beds !== 3) return false;
        if (bhkFilter === '4-bhk' && p.beds !== 4) return false;
        if (bhkFilter === '4-plus-bhk' && (p.beds === null || p.beds <= 4)) return false;
      }

      return true;
    });

    // Sorting
    if (sortOrder === 'price-asc') {
      list = [...list].sort((a, b) => a.priceCr - b.priceCr);
    } else if (sortOrder === 'price-desc') {
      list = [...list].sort((a, b) => b.priceCr - a.priceCr);
    }

    return list;
  }, [baseProperties, q, typeFilter, budgetFilter, bhkFilter, sortOrder]);

  // Combined shown cards: If filteredProperties has fewer than 3, append suggestions
  const displayedCards = useMemo(() => {
    if (filteredProperties.length >= 3) {
      return { primary: filteredProperties, suggested: [] };
    }
    const currentIds = new Set(filteredProperties.map((p) => p.id));
    const extraSuggestions = suggestions.filter((p) => !currentIds.has(p.id));
    return {
      primary: filteredProperties,
      suggested: extraSuggestions.slice(0, 3 - filteredProperties.length),
    };
  }, [filteredProperties, suggestions]);

  // Compute Stats for Stats Strip
  const stats = useMemo(() => {
    const list = baseProperties.length > 0 ? baseProperties : filteredProperties;
    const count = list.length;
    if (count === 0) {
      return { count: 0, priceRange: '\u2014', avgRate: '\u2014', unitLabel: 'per sq ft' };
    }

    const prices = list.map((p) => p.priceCr);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange =
      minPrice === maxPrice
        ? formatPrice(minPrice)
        : `${formatPrice(minPrice)} \u2013 ${formatPrice(maxPrice)}`;

    const allPlots = list.every((p) => p.areaUnit === 'sq yd');
    const allSqFt = list.every((p) => p.areaUnit === 'sq ft');

    let avgRate = '\u2014';
    let unitLabel = 'per sq ft';

    if (allPlots) {
      const totalCost = list.reduce((sum, p) => sum + p.priceCr * 1e7, 0);
      const totalArea = list.reduce((sum, p) => sum + p.area, 0);
      avgRate = `\u20B9${Math.round(totalCost / totalArea).toLocaleString('en-IN')}`;
      unitLabel = 'per sq yd';
    } else if (allSqFt) {
      const totalCost = list.reduce((sum, p) => sum + p.priceCr * 1e7, 0);
      const totalArea = list.reduce((sum, p) => sum + p.area, 0);
      avgRate = `\u20B9${Math.round(totalCost / totalArea).toLocaleString('en-IN')}`;
      unitLabel = 'per sq ft';
    }

    return { count, priceRange, avgRate, unitLabel };
  }, [baseProperties, filteredProperties]);

  // Motion Animations setup
  useEffect(() => {
    if (isTransitioning) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const { motion } = config;

      // 1. maskRise
      if (motion === 'maskRise') {
        const words = headlineRef.current?.querySelectorAll('.mask-word');
        if (words && words.length > 0) {
          gsap.fromTo(
            words,
            { yPercent: 110, filter: 'blur(6px)', opacity: 0 },
            { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }
          );
        }
      }

      // 2. blueprint
      if (motion === 'blueprint') {
        const bgGrid = containerRef.current?.querySelector('.blueprint-grid');
        if (bgGrid) {
          gsap.fromTo(
            bgGrid,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }
          );
        }
        const lines = headlineRef.current?.querySelectorAll('.headline-line');
        if (lines && lines.length > 0) {
          gsap.fromTo(
            lines,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.out', stagger: 0.15 }
          );
        }
      }

      // 3. ticker
      if (motion === 'ticker') {
        const words = headlineRef.current?.querySelectorAll('.mask-word');
        if (words && words.length > 0) {
          gsap.fromTo(
            words,
            { y: 60, scale: 1.06, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)', stagger: 0.05 }
          );
        }
      }

      // 4. contour
      if (motion === 'contour') {
        const lines = headlineRef.current?.querySelectorAll('.headline-line');
        if (lines && lines.length > 0) {
          gsap.fromTo(
            lines,
            { opacity: 0, y: 24, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', stagger: 0.2 }
          );
        }
      }

      // 5. numeral
      if (motion === 'numeral') {
        if (numeralRef.current) {
          gsap.fromTo(
            numeralRef.current,
            { yPercent: 100 },
            { yPercent: 0, duration: 1.2, ease: 'power3.out' }
          );
          // Parallax on scroll
          gsap.to(numeralRef.current, {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        }
        const words = headlineRef.current?.querySelectorAll('.mask-word');
        if (words && words.length > 0) {
          gsap.fromTo(
            words,
            { yPercent: 110, filter: 'blur(6px)', opacity: 0 },
            { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }
          );
        }
      }

      // 6. goldSweep
      if (motion === 'goldSweep') {
        const words = headlineRef.current?.querySelectorAll('.mask-word');
        if (words && words.length > 0) {
          gsap.fromTo(
            words,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }
          );
        }
      }

      // Cards ScrollTrigger reveal
      const cards = cardsGridRef.current?.querySelectorAll('.buy-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [config, isTransitioning, slug]);

  const toggleSave = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectProperty = (p: Property) => {
    setSelectedProperty(p);
    setIsDetailOpen(true);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  // Find previous and next options in the same taxonomy group
  const { currentGroup, prevOption, nextOption, otherGroups } = useMemo(() => {
    const group = BUY_TAXONOMY_GROUPS.find((g) => g.key === config.group);
    if (!group) {
      return { currentGroup: null, prevOption: null, nextOption: null, otherGroups: [] };
    }
    const idx = group.options.findIndex((o) => o.slug === config.slug);
    const prev = group.options[(idx - 1 + group.options.length) % group.options.length];
    const next = group.options[(idx + 1) % group.options.length];
    const others = BUY_TAXONOMY_GROUPS.filter((g) => g.key !== config.group);
    return { currentGroup: group, prevOption: prev, nextOption: next, otherGroups: others };
  }, [config]);

  // Helper to parse headline with *italic* accent
  const renderHeadline = (headline: string) => {
    return headline.split('\n').map((line, lIdx) => {
      // Split words while preserving spaces
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <span key={lIdx} className="headline-line block overflow-hidden pb-2">
          {parts.map((part, pIdx) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              const text = part.slice(1, -1);
              return (
                <span
                  key={pIdx}
                  className="mask-word inline-block italic font-normal"
                  style={{ color: config.theme.accent }}
                >
                  {text}&nbsp;
                </span>
              );
            }
            return part.split(' ').map((word, wIdx) => {
              if (!word) return null;
              return (
                <span key={`${pIdx}-${wIdx}`} className="mask-word inline-block">
                  {word}&nbsp;
                </span>
              );
            });
          })}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen text-[var(--ink)] overflow-x-hidden"
      style={{ backgroundColor: config.theme.dark2 }}
    >
      {/* ========================================================================= */}
      {/* 1. BLACK HEADER WITH NAVBAR & STICKY SEARCH BAR                            */}
      {/* ========================================================================= */}
      <div className="w-full pb-20 pt-4 px-6 md:px-12 lg:px-16" style={{ backgroundColor: config.theme.dark2 }}>
        <SearchBar
          q={q}
          onQChange={setQ}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          budget={budgetFilter}
          onBudgetChange={setBudgetFilter}
          bhk={bhkFilter}
          onBhkChange={setBhkFilter}
          categoryLabel={config.label}
          onReset={() => {
            setQ('');
            setTypeFilter('');
            setBudgetFilter('');
            setBhkFilter('');
          }}
          className="mt-6"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. THEMED ROUNDED BODY SECTION (60px OVERLAP)                             */}
      {/* ========================================================================= */}
      <section
        className="relative w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-6 sm:px-10 md:px-16 lg:px-20 py-20 -mt-14 z-20 transition-colors duration-500 shadow-2xl"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--ink)',
        }}
      >
        {/* Background Blueprint Grid if motion is blueprint */}
        {config.motion === 'blueprint' && (
          <div
            className="blueprint-grid absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, ${config.theme.accent} 1px, transparent 1px), linear-gradient(to bottom, ${config.theme.accent} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        )}

        {/* Background Topographic Contour if motion is contour */}
        {config.motion === 'contour' && (
          <svg
            className="absolute -top-10 right-0 w-[600px] h-[600px] pointer-events-none opacity-15 overflow-visible"
            viewBox="0 0 600 600"
            fill="none"
            stroke={config.theme.accent}
            strokeWidth="1"
          >
            <path d="M50,300 C150,150 450,100 550,280 C650,460 350,550 200,480 Z" />
            <path d="M100,320 C180,200 420,160 500,300 C580,440 320,500 220,440 Z" />
            <path d="M150,340 C210,250 390,220 450,320 C510,420 290,460 240,400 Z" />
            <path d="M200,360 C240,300 360,280 400,340 C440,400 260,420 230,380 Z" />
          </svg>
        )}

        {/* Giant Numeral Background for 'numeral' variant */}
        {config.motion === 'numeral' && config.numeral && (
          <div
            ref={numeralRef}
            aria-hidden="true"
            className="absolute top-12 right-6 sm:right-16 select-none pointer-events-none leading-none opacity-40 font-serif"
            style={{
              fontSize: 'clamp(14rem, 36vw, 30rem)',
              color: 'transparent',
              WebkitTextStroke: `1px ${config.theme.accent}`,
              fontFamily: 'var(--font-display)',
            }}
          >
            {config.numeral}
          </div>
        )}

        {/* Full-width Marquee Ticker if motion is ticker */}
        {config.motion === 'ticker' && (
          <div
            ref={tickerWrapRef}
            className="w-full overflow-hidden border-y py-2.5 mb-12 -mx-6 sm:-mx-10 md:-mx-16 lg:-mx-20 px-6 sm:px-10 border-white/10"
            style={{ backgroundColor: `${config.theme.accent}15` }}
          >
            <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] gap-8 font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-[var(--ink)]">
              <span>{config.label} Collection</span>
              <span style={{ color: config.theme.accent }}>\u25C6</span>
              <span>Direct Developer Allocation</span>
              <span style={{ color: config.theme.accent }}>\u25C6</span>
              <span>Verified Title & RERA Compliant</span>
              <span style={{ color: config.theme.accent }}>\u25C6</span>
              <span>Jubilee Hills \u00B7 Banjara Hills \u00B7 Kokapet \u00B7 Financial District</span>
              <span style={{ color: config.theme.accent }}>\u25C6</span>
              <span>{config.label} Collection</span>
              <span style={{ color: config.theme.accent }}>\u25C6</span>
              <span>Direct Developer Allocation</span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Eyebrow & Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] rounded-full" style={{ backgroundColor: config.theme.accent }} />
            <span
              className="font-sans text-xs uppercase tracking-[0.25em] font-medium"
              style={{ color: config.theme.mode === 'dark' ? config.theme.accentInk : config.theme.accent }}
            >
              {config.eyebrow}
            </span>
          </div>

          {/* Headline in var(--font-display) */}
          <h1
            ref={headlineRef}
            className="leading-[1.02] tracking-[-0.02em] mb-6 text-[clamp(2.75rem,7vw,6.25rem)]"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif", serif)',
              fontWeight: config.displayFont === 'grotesk' ? 500 : 400,
            }}
          >
            {renderHeadline(config.headline)}
          </h1>

          {/* Lead Paragraph */}
          <p className="font-sans font-light text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed mb-10">
            {config.lead}
          </p>

          {/* Rule */}
          <div className="w-full h-[1px] opacity-20 mb-12" style={{ backgroundColor: 'var(--ink)' }} />

          {/* ========================================================================= */}
          {/* STATS STRIP                                                               */}
          {/* ========================================================================= */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-white/10 mb-16"
          >
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-serif leading-none" style={{ color: config.theme.accent }}>
                {stats.count}
              </span>
              <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mt-2">
                Residences Available
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-serif leading-none truncate" style={{ color: config.theme.accent }}>
                {stats.priceRange}
              </span>
              <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mt-2">
                Price Range
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-serif leading-none" style={{ color: config.theme.accent }}>
                {stats.avgRate}
              </span>
              <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mt-2">
                Avg Rate ({stats.unitLabel})
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RESULTS BAR                                                               */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 font-sans text-xs opacity-75">
              <span>Showing {displayedCards.primary.length} of {baseProperties.length} residences</span>
              {hasActiveFilters(q, typeFilter, budgetFilter, bhkFilter) && (
                <span className="text-[#D4AF6A]">(Filtered)</span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-sans opacity-60 uppercase tracking-wider">Sort:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                style={{ color: 'var(--ink)' }}
              >
                <option value="default" className="bg-[#121212] text-white">Curated Order</option>
                <option value="price-asc" className="bg-[#121212] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#121212] text-white">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARDS GRID                                                                */}
          {/* ========================================================================= */}
          {displayedCards.primary.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 mb-12">
              <h3 className="font-serif text-2xl mb-2">No matching listings found</h3>
              <p className="font-sans text-sm opacity-60 max-w-md mx-auto mb-6">
                Try adjusting your search query or reset dropdown filters to see available properties.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  setTypeFilter('');
                  setBudgetFilter('');
                  setBhkFilter('');
                }}
                className="px-6 py-2.5 rounded-full border border-white/30 text-xs font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              ref={cardsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayedCards.primary.map((p, idx) => (
                <BuyCard
                  key={p.id}
                  property={p}
                  index={idx}
                  theme={config.theme}
                  motion={config.motion}
                  isSaved={Boolean(savedIds[p.id])}
                  onToggleSave={toggleSave}
                  onSelectProperty={handleSelectProperty}
                />
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* "YOU MAY ALSO LIKE" SECTION (MIN-RESULTS RULE)                             */}
          {/* ========================================================================= */}
          {displayedCards.suggested.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-[1px] bg-[#D4AF6A]" />
                <h3 className="font-serif text-2xl text-white">
                  You may also like
                </h3>
                <span className="font-sans text-xs text-white/50">
                  (Closest matching neighborhood residences)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedCards.suggested.map((p, idx) => (
                  <BuyCard
                    key={p.id}
                    property={p}
                    index={displayedCards.primary.length + idx}
                    theme={config.theme}
                    motion={config.motion}
                    isSaved={Boolean(savedIds[p.id])}
                    onToggleSave={toggleSave}
                    onSelectProperty={handleSelectProperty}
                    isSuggested
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY MODULES                                                          */}
          {/* ========================================================================= */}
          <CategoryModules
            modules={config.modules}
            theme={config.theme}
            topProperties={baseProperties}
            onEnquireClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
          />

          {/* ========================================================================= */}
          {/* FAQ ACCORDION (2 ITEMS)                                                   */}
          {/* ========================================================================= */}
          <div className="mt-20 pt-16 border-t border-white/10">
            <h2
              className="text-3xl sm:text-4xl leading-tight mb-8"
              style={{ fontFamily: 'var(--font-display, "Instrument Serif", serif)' }}
            >
              Frequently Answered Inquiries
            </h2>

            <div className="space-y-4">
              {config.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A]"
                    >
                      <span className="font-serif text-xl sm:text-2xl pr-4">
                        {item.q}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-45 bg-[#D4AF6A] text-black border-[#D4AF6A]' : 'text-white'
                        }`}
                      >
                        <Plus size={16} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 font-sans text-sm opacity-80 leading-relaxed border-t border-white/5 animate-[fadeIn_0.35s_ease-out]">
                        <p>{item.hint}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLLECTION NAVIGATION: EXPLORE MORE COLLECTIONS                           */}
          {/* ========================================================================= */}
          <div className="mt-24 pt-16 border-t border-white/10">
            <span className="font-sans text-xs uppercase tracking-[0.2em] opacity-60 block mb-2">
              Explore more collections
            </span>
            <h2 className="font-serif text-3xl mb-8">
              Navigate {currentGroup?.title || 'Taxonomy'}
            </h2>

            {/* Previous and Next in Same Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {prevOption && (
                <TransitionLink
                  to={`/buy/${prevOption.slug}`}
                  transitionLabel={prevOption.label}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <ArrowLeft size={18} className="text-[#D4AF6A] group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-wider opacity-50 block">Previous</span>
                      <span className="font-serif text-xl group-hover:text-[#D4AF6A] transition-colors">{prevOption.label}</span>
                    </div>
                  </div>
                  <span className="font-sans text-xs opacity-40">{countFor(prevOption.slug)} units</span>
                </TransitionLink>
              )}

              {nextOption && (
                <TransitionLink
                  to={`/buy/${nextOption.slug}`}
                  transitionLabel={nextOption.label}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-wider opacity-50 block">Next</span>
                    <span className="font-serif text-xl group-hover:text-[#D4AF6A] transition-colors">{nextOption.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-xs opacity-40">{countFor(nextOption.slug)} units</span>
                    <ArrowRight size={18} className="text-[#D4AF6A] group-hover:translate-x-1 transition-transform" />
                  </div>
                </TransitionLink>
              )}
            </div>

            {/* Other Groups as Chip Rows */}
            <div className="space-y-6">
              {otherGroups.map((g) => (
                <div key={g.key}>
                  <span className="font-sans text-xs uppercase tracking-[0.16em] opacity-50 block mb-3">
                    {g.title}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {g.options.map((opt) => (
                      <TransitionLink
                        key={opt.slug}
                        to={`/buy/${opt.slug}`}
                        transitionLabel={opt.label}
                        className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black hover:border-white text-xs font-sans transition-all duration-200 flex items-center gap-2"
                      >
                        <span>{opt.label}</span>
                        {opt.badge && (
                          <span className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[8px] uppercase tracking-wider px-1 py-0.2 rounded">
                            {opt.badge}
                          </span>
                        )}
                        <span className="opacity-40 text-[10px]">({countFor(opt.slug)})</span>
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CLOSING CTA PILL                                                          */}
          {/* ========================================================================= */}
          <div className="mt-20 text-center">
            <button
              type="button"
              onClick={() => {
                const mail = `mailto:advisory@vesta.in?subject=Enquiry%20regarding%20${encodeURIComponent(config.label)}`;
                window.location.href = mail;
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF6A] hover:text-white transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>{config.cta.label}</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Property Detail Full Overlay */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};

function hasActiveFilters(q: string, type: string, budget: string, bhk: string): boolean {
  return Boolean(q || type || budget || bhk);
}

export default BuyCategory;

