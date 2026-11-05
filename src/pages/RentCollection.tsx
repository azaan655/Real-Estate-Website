import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getRentPageConfig, RentPageConfig } from '../data/rentPages';
import {
  RENT_TAXONOMY_GROUPS,
  getRentalsForSlug,
  getRentalsWithFallback,
  countForRent,
} from '../data/rentTaxonomy';
import { Rental, formatRentMonthly } from '../data/rentals';
import SearchBar from '../components/SearchBar';
import RentCard from '../components/RentCard';
import CategoryModules from '../components/CategoryModules';
import RentDetail from '../components/RentDetail';
import { TransitionLink, usePageTransition } from '../components/PageTransition';
import NotFound from './NotFound';
import { RUPEE, DOT, formatInr } from '../lib/money';

gsap.registerPlugin(ScrollTrigger);

export const RentCollection: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getRentPageConfig(slug) : undefined;

  // Search & Filter state
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [bhkFilter, setBhkFilter] = useState('');
  const [furnishingFilter, setFurnishingFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [availableNowOnly, setAvailableNowOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<
    'featured' | 'rent-asc' | 'rent-desc' | 'area-desc'
  >('featured');

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tickerWrapRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const { isTransitioning } = usePageTransition();

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

  // Fetch category rentals & fallback suggestions (min 3 rule)
  const { primary: baseRentals, suggestions } = useMemo(() => {
    return getRentalsWithFallback(slug);
  }, [slug]);

  // Filter listings based on user search inputs within the category
  const filteredRentals = useMemo(() => {
    let list = baseRentals.filter((r) => {
      if (q.trim()) {
        const query = q.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesLoc = r.location.toLowerCase().includes(query);
        const matchesDesc = r.description.toLowerCase().includes(query);
        const matchesSubtype = r.subtype.toLowerCase().includes(query);
        const matchesProject = r.project ? r.project.toLowerCase().includes(query) : false;
        const matchesHighlights = r.highlights.some((h) => h.toLowerCase().includes(query));
        if (
          !matchesName &&
          !matchesLoc &&
          !matchesDesc &&
          !matchesSubtype &&
          !matchesProject &&
          !matchesHighlights
        ) {
          return false;
        }
      }

      if (typeFilter) {
        if (typeFilter === 'flats-for-rent' && r.type !== 'flat') return false;
        if (typeFilter === 'houses-for-rent' && r.type !== 'house') return false;
        if (typeFilter === 'villas-for-rent' && r.type !== 'villa') return false;
        if (typeFilter === 'commercial-for-rent' && r.type !== 'commercial') return false;
        if (typeFilter === 'office-for-rent' && r.type !== 'office') return false;
      }

      if (budgetFilter) {
        if (budgetFilter === 'under-10000' && r.rent >= 10000) return false;
        if (budgetFilter === '10000-to-25000' && (r.rent < 10000 || r.rent >= 25000)) return false;
        if (budgetFilter === '25000-to-50000' && (r.rent < 25000 || r.rent >= 50000)) return false;
        if (budgetFilter === 'above-50000' && r.rent < 50000) return false;
      }

      if (bhkFilter) {
        if (bhkFilter === '1-bhk-for-rent' && r.beds !== 1) return false;
        if (bhkFilter === '2-bhk-for-rent' && r.beds !== 2) return false;
        if (bhkFilter === '3-bhk-for-rent' && r.beds !== 3) return false;
        if (bhkFilter === '4-bhk-for-rent' && r.beds !== 4) return false;
      }

      if (furnishingFilter && r.furnishing.toLowerCase() !== furnishingFilter.toLowerCase()) {
        return false;
      }

      if (tenantFilter && !r.tenants.some((t) => t.toLowerCase() === tenantFilter.toLowerCase())) {
        return false;
      }

      if (availableNowOnly && r.availableFrom.toLowerCase() !== 'immediate') {
        return false;
      }

      return true;
    });

    if (sortOrder === 'rent-asc') {
      list = [...list].sort((a, b) => a.rent - b.rent);
    } else if (sortOrder === 'rent-desc') {
      list = [...list].sort((a, b) => b.rent - a.rent);
    } else if (sortOrder === 'area-desc') {
      list = [...list].sort((a, b) => b.area - a.area);
    }

    return list;
  }, [
    baseRentals,
    q,
    typeFilter,
    budgetFilter,
    bhkFilter,
    furnishingFilter,
    tenantFilter,
    availableNowOnly,
    sortOrder,
  ]);

  // Stats calculation
  const totalDisplayCount = filteredRentals.length;
  const rentsList = filteredRentals.map((r) => r.rent);
  const minRent = rentsList.length > 0 ? Math.min(...rentsList) : 0;
  const maxRent = rentsList.length > 0 ? Math.max(...rentsList) : 0;

  // Average rent per sq ft (only if types are comparable: all residential flats/houses/villas or commercial/office)
  const isComparableTypes = useMemo(() => {
    if (filteredRentals.length === 0) return false;
    const commercialCount = filteredRentals.filter(
      (r) => r.type === 'commercial' || r.type === 'office'
    ).length;
    return commercialCount === 0 || commercialCount === filteredRentals.length;
  }, [filteredRentals]);

  const avgRentPerSqFt = useMemo(() => {
    if (!isComparableTypes || filteredRentals.length === 0) return null;
    const totalRent = filteredRentals.reduce((sum, r) => sum + r.rent, 0);
    const totalArea = filteredRentals.reduce((sum, r) => sum + r.area, 0);
    if (totalArea === 0) return 0;
    return Math.round(totalRent / totalArea);
  }, [filteredRentals, isComparableTypes]);

  // Motion variants entrance animations
  useEffect(() => {
    if (isTransitioning) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. maskRise
      if (config.motion === 'maskRise' && headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll('.headline-line');
        gsap.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, ease: 'power4.out', stagger: 0.12, delay: 0.1 }
        );
      }

      // 2. ticker
      if (config.motion === 'ticker' && tickerWrapRef.current) {
        gsap.to(tickerWrapRef.current, {
          xPercent: -50,
          duration: 25,
          ease: 'none',
          repeat: -1,
        });
      }

      // 3. numeral
      if (config.motion === 'numeral' && numeralRef.current) {
        gsap.fromTo(
          numeralRef.current,
          { opacity: 0, scale: 0.85, y: 30 },
          { opacity: 0.08, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.15 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [config.motion, isTransitioning]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectRental = (r: Rental) => {
    setSelectedRental(r);
    setIsDetailOpen(true);
  };

  const currentGroup = RENT_TAXONOMY_GROUPS.find((g) => g.key === config.group);
  const currentIndexInGroup =
    currentGroup?.options.findIndex((opt) => opt.slug === config.slug) ?? -1;

  const prevOption =
    currentGroup && currentIndexInGroup > 0
      ? currentGroup.options[currentIndexInGroup - 1]
      : null;
  const nextOption =
    currentGroup &&
    currentIndexInGroup !== -1 &&
    currentIndexInGroup < currentGroup.options.length - 1
      ? currentGroup.options[currentIndexInGroup + 1]
      : null;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen text-[#0C0C0C] transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor: 'var(--bg, #F8F6F0)',
        color: 'var(--ink, #0C0C0C)',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. BLACK HEADER (TOP NAVBAR + STICKY RENT SEARCH BAR)                    */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#0C0C0C] pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative z-30">
        <SearchBar
          mode="rent"
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
            setFurnishingFilter('');
            setTenantFilter('');
            setAvailableNowOnly(false);
          }}
        />
      </section>

      {/* ========================================================================= */}
      {/* 2. THEMED ROUNDED SECTION (CATEGORY HERO & DETAILS)                       */}
      {/* ========================================================================= */}
      <div className="relative -mt-6 sm:-mt-8 rounded-t-[32px] sm:rounded-t-[44px] bg-[var(--bg)] px-4 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-24 z-20 overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
        {/* Background Numeral */}
        {config.motion === 'numeral' && config.numeral && (
          <div
            ref={numeralRef}
            aria-hidden="true"
            className="absolute -top-12 -right-8 font-serif text-[clamp(14rem,30vw,26rem)] font-light leading-none select-none pointer-events-none opacity-0"
            style={{ color: 'var(--ink, #0C0C0C)' }}
          >
            {config.numeral}
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="max-w-3xl space-y-4">
            <span className="font-sans text-xs uppercase tracking-[0.25em] opacity-60 block">
              {config.eyebrow}
            </span>

            <h1
              ref={headlineRef}
              className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight font-normal"
              style={{ fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)' }}
            >
              {config.headline.split('\n').map((line, lIdx) => (
                <span key={lIdx} className="block overflow-hidden">
                  <span className="headline-line block">
                    {line.includes('*') ? (
                      <>
                        {line.split('*')[0]}
                        <span className="italic" style={{ color: 'var(--accent-ink)' }}>
                          {line.split('*')[1]}
                        </span>
                        {line.split('*')[2] || ''}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p className="font-sans text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
              {config.lead}
            </p>
            {config.note && (
              <span className="inline-block text-xs font-sans tracking-wide px-3 py-1 rounded-full bg-black/5 border border-black/10 opacity-70 mt-2">
                {config.note}
              </span>
            )}
          </div>

          {/* Ticker Strip for ticker motion variant */}
          {config.motion === 'ticker' && config.numeral && (
            <div className="w-full overflow-hidden py-3 border-y border-black/10 my-2">
              <div ref={tickerWrapRef} className="flex whitespace-nowrap text-xs font-sans uppercase tracking-[0.2em] opacity-80">
                <span className="mr-8">{config.numeral} &bull; {config.numeral} &bull; </span>
                <span className="mr-8">{config.numeral} &bull; {config.numeral} &bull; </span>
              </div>
            </div>
          )}

          {/* Thin Rule */}
          <div className="w-full h-[1px] opacity-15 bg-current" />

          {/* ========================================================================= */}
          {/* STATS STRIP                                                               */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-sans opacity-60 block mb-1">
                Rentals Available
              </span>
              <span
                className="text-3xl sm:text-4xl font-serif"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {totalDisplayCount}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-sans opacity-60 block mb-1">
                Monthly Rent Range
              </span>
              <span
                className="text-2xl sm:text-3xl font-serif flex items-baseline gap-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="rupee font-sans">{RUPEE}</span>
                {formatInr(minRent)} &ndash; {formatInr(maxRent)}
              </span>
            </div>

            {avgRentPerSqFt !== null && (
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs uppercase tracking-wider font-sans opacity-60 block mb-1">
                  Average Rent per Sq Ft
                </span>
                <span
                  className="text-2xl sm:text-3xl font-serif"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="rupee font-sans">{RUPEE}</span>
                  {avgRentPerSqFt}
                  <span className="text-xs font-sans opacity-60 ml-1">/ sq ft / mo</span>
                </span>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RESULTS BAR (PILLS & SORT)                                                */}
          {/* ========================================================================= */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-y border-black/10">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Furnishing Filter */}
              <div className="flex items-center gap-1 bg-black/5 rounded-xl p-1 border border-black/10">
                {['', 'Unfurnished', 'Semi-furnished', 'Furnished'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFurnishingFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                      furnishingFilter === f
                        ? 'bg-black text-white font-medium shadow-sm'
                        : 'text-black/60 hover:text-black'
                    }`}
                  >
                    {f || 'All Furnishing'}
                  </button>
                ))}
              </div>

              {/* Tenants Filter */}
              <div className="flex items-center gap-1 bg-black/5 rounded-xl p-1 border border-black/10">
                {['', 'Family', 'Bachelors', 'Company'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenantFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                      tenantFilter === t
                        ? 'bg-black text-white font-medium shadow-sm'
                        : 'text-black/60 hover:text-black'
                    }`}
                  >
                    {t || 'All Tenants'}
                  </button>
                ))}
              </div>

              {/* Available Now Toggle */}
              <button
                type="button"
                onClick={() => setAvailableNowOnly((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  availableNowOnly
                    ? 'bg-[#D4AF6A] text-black border-[#D4AF6A] font-medium'
                    : 'bg-black/5 text-black/70 border-black/10 hover:border-black/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${availableNowOnly ? 'bg-black' : 'bg-green-500'}`}
                />
                <span>Available Now</span>
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans opacity-60">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="h-9 px-3 rounded-lg bg-black/5 border border-black/10 text-xs font-sans focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="rent-asc">Rent: Low to High</option>
                <option value="rent-desc">Rent: High to Low</option>
                <option value="area-desc">Largest Area</option>
              </select>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LISTINGS GRID                                                             */}
          {/* ========================================================================= */}
          <div ref={cardsGridRef} className="space-y-12">
            {filteredRentals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredRentals.map((rental, idx) => (
                  <RentCard
                    key={rental.id}
                    rental={rental}
                    index={idx}
                    theme={config.theme}
                    motion={config.motion}
                    isSaved={Boolean(savedIds[rental.id])}
                    onToggleSave={toggleSave}
                    onSelectRental={handleSelectRental}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-black/5 border border-black/10 space-y-3">
                <h3 className="font-serif text-2xl">No rentals match your current filter combination</h3>
                <p className="font-sans text-xs opacity-60">
                  Try clearing specific filter pills or reset search parameters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQ('');
                    setTypeFilter('');
                    setBudgetFilter('');
                    setBhkFilter('');
                    setFurnishingFilter('');
                    setTenantFilter('');
                    setAvailableNowOnly(false);
                  }}
                  className="px-5 py-2 rounded-lg bg-black text-white text-xs font-sans font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* MIN RESULTS RULE (3 matches): Suggestions Row */}
            {suggestions.length > 0 && (
              <div className="pt-8 border-t border-black/10 space-y-6">
                <div>
                  <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#8C6A2E] block">
                    Curated Alternatives
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-normal mt-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    You May Also Like
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {suggestions.map((rental, idx) => (
                    <RentCard
                      key={rental.id}
                      rental={rental}
                      index={idx + filteredRentals.length}
                      theme={config.theme}
                      motion={config.motion}
                      isSaved={Boolean(savedIds[rental.id])}
                      onToggleSave={toggleSave}
                      onSelectRental={handleSelectRental}
                      isSuggested
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* CATEGORY MODULES                                                          */}
          {/* ========================================================================= */}
          {config.modules && config.modules.length > 0 && (
            <CategoryModules
              modules={config.modules}
              theme={config.theme}
              topProperties={[]}
              onEnquireClick={() => {
                if (filteredRentals[0]) handleSelectRental(filteredRentals[0]);
              }}
            />
          )}

          {/* ========================================================================= */}
          {/* FAQ SECTION                                                               */}
          {/* ========================================================================= */}
          {config.faq && config.faq.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-black/10">
              <h2
                className="text-3xl sm:text-4xl font-normal"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {config.faq.map((item, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="rounded-2xl border border-black/10 bg-black/5 overflow-hidden transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left font-sans font-medium text-base hover:text-[#8C6A2E] transition-colors cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <Plus
                          size={18}
                          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-45 text-[#8C6A2E]' : 'opacity-60'
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 font-sans text-sm opacity-80 leading-relaxed border-t border-black/5">
                          {item.hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* COLLECTION NAVIGATION                                                     */}
          {/* ========================================================================= */}
          <div className="space-y-8 pt-12 border-t border-black/10">
            <div className="flex items-center justify-between">
              {prevOption ? (
                <TransitionLink
                  to={prevOption.route}
                  transitionLabel={prevOption.label}
                  className="flex items-center gap-2 text-sm font-sans font-medium hover:text-[#8C6A2E] transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Previous: {prevOption.label}</span>
                </TransitionLink>
              ) : (
                <div />
              )}

              {nextOption ? (
                <TransitionLink
                  to={nextOption.route}
                  transitionLabel={nextOption.label}
                  className="flex items-center gap-2 text-sm font-sans font-medium hover:text-[#8C6A2E] transition-colors"
                >
                  <span>Next: {nextOption.label}</span>
                  <ArrowRight size={16} />
                </TransitionLink>
              ) : (
                <div />
              )}
            </div>

            {/* Other Groups as Chips */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-sans tracking-wider opacity-60 block">
                Explore Other Collections
              </span>
              <div className="flex flex-wrap gap-2">
                {RENT_TAXONOMY_GROUPS.flatMap((g) => g.options)
                  .filter((opt) => opt.slug !== config.slug)
                  .map((opt) => (
                    <TransitionLink
                      key={opt.slug}
                      to={opt.route}
                      transitionLabel={opt.label}
                      className="px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-xs font-sans transition-colors"
                    >
                      {opt.label}
                    </TransitionLink>
                  ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM CTA BANNER                                                         */}
          {/* ========================================================================= */}
          <div className="rounded-3xl p-8 sm:p-12 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-3xl">Looking for specific rental parameters?</h3>
              <p className="font-sans text-xs sm:text-sm opacity-70">
                Share your criteria and budget directly with our dedicated Hyderabad leasing advisors.
              </p>
            </div>

            <TransitionLink
              to="/rent/share-requirement"
              transitionLabel="Share Requirement"
              className="px-7 py-4 rounded-full bg-[#D4AF6A] text-[#0C0C0C] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#e0be7d] transition-colors flex-shrink-0 shadow-lg"
            >
              Share Your Requirement
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Rent Detail Overlay Modal */}
      {selectedRental && (
        <RentDetail
          rental={selectedRental}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedRental(null);
          }}
        />
      )}
    </div>
  );
};

export default RentCollection;

