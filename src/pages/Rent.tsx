import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, ArrowUpRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { rentals, Rental, rentBucket, bhkBucketRent } from '../data/rentals';
import { RENT_TAXONOMY_GROUPS, countForRent } from '../data/rentTaxonomy';
import { getRentPageConfig } from '../data/rentPages';
import SearchBar from '../components/SearchBar';
import RentCard from '../components/RentCard';
import RentDetail from '../components/RentDetail';
import CategoryModules from '../components/CategoryModules';
import { TransitionLink } from '../components/PageTransition';
import { RUPEE, DOT, formatInr } from '../lib/money';

export const Rent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [budgetFilter, setBudgetFilter] = useState(searchParams.get('budget') || '');
  const [bhkFilter, setBhkFilter] = useState(searchParams.get('bhk') || '');
  const [furnishingFilter, setFurnishingFilter] = useState(searchParams.get('furnishing') || '');
  const [tenantFilter, setTenantFilter] = useState(searchParams.get('tenants') || '');
  const [availableNowOnly, setAvailableNowOnly] = useState(searchParams.get('available') === 'now');
  const [sortOrder, setSortOrder] = useState<'featured' | 'rent-asc' | 'rent-desc' | 'area-desc'>('featured');

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const allConfig = getRentPageConfig('all');

  useEffect(() => {
    document.title = 'Rentals in Hyderabad | VESTA';
  }, []);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (typeFilter) params.set('type', typeFilter);
    if (budgetFilter) params.set('budget', budgetFilter);
    if (bhkFilter) params.set('bhk', bhkFilter);
    if (furnishingFilter) params.set('furnishing', furnishingFilter);
    if (tenantFilter) params.set('tenants', tenantFilter);
    if (availableNowOnly) params.set('available', 'now');
    setSearchParams(params, { replace: true });
  }, [q, typeFilter, budgetFilter, bhkFilter, furnishingFilter, tenantFilter, availableNowOnly, setSearchParams]);

  // Filter listings
  const filteredRentals = useMemo(() => {
    let list = rentals.filter((r) => {
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
  }, [q, typeFilter, budgetFilter, bhkFilter, furnishingFilter, tenantFilter, availableNowOnly, sortOrder]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectRental = (r: Rental) => {
    setSelectedRental(r);
    setIsDetailOpen(true);
  };

  const headline = allConfig?.headline || 'Find the rental\nyou will call *home.*';
  const lead =
    allConfig?.lead ||
    "From compact city apartments to sprawling independent villas and fitted corporate offices across Hyderabad's premier neighborhoods.";

  return (
    <div className="relative w-full min-h-screen bg-[#0C0C0C] text-white overflow-x-hidden">
      {/* Top Header with Search Bar */}
      <section className="w-full pb-20 pt-28 sm:pt-32 px-6 md:px-12 lg:px-16 bg-[#0C0C0C] relative z-30">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-3">
            Rentals &amp; Leases
          </h1>
          <p className="font-sans text-sm text-white/70 max-w-lg mx-auto">
            Explore 12 curated residential and commercial rental properties across Hyderabad.
          </p>
        </div>

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

      {/* Main Ivory Body Section */}
      <section className="relative w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#FAF8F4] text-[#0C0C0C] px-6 sm:px-10 md:px-16 lg:px-20 py-20 -mt-14 z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header Introduction from config 'all' */}
          <div className="max-w-3xl space-y-4">
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-[#8C671D] block font-medium">
              Hyderabad Rental Portfolio
            </span>
            <h2
              className="text-[clamp(2.5rem,5.5vw,4.2rem)] leading-[1.08] font-normal"
              style={{ fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)' }}
            >
              {headline.split('\n').map((line, idx) => (
                <span key={idx} className="block">
                  {line.includes('*') ? (
                    <>
                      {line.split('*')[0]}
                      <span className="italic text-[#8C671D]">{line.split('*')[1]}</span>
                      {line.split('*')[2] || ''}
                    </>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h2>
            <p className="font-sans text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
              {lead}
            </p>
          </div>

          {/* Thin Rule */}
          <div className="w-full h-[1px] bg-black/10" />

          {/* ===================================================================== */}
          {/* 4 LINK COLUMNS (NAVIGATES WITH TRANSITIONLINK)                        */}
          {/* ===================================================================== */}
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-[#8C671D] block mb-2 font-medium">
              Browse by Category
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#0C0C0C] mb-8">
              Explore Rental Collections
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {RENT_TAXONOMY_GROUPS.map((group) => (
                <div key={group.key} className="flex flex-col">
                  <h4 className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[#0C0C0C]/80 pb-3 border-b border-black/10 mb-4">
                    {group.title}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {group.options.map((opt) => (
                      <TransitionLink
                        key={opt.slug}
                        to={opt.route}
                        transitionLabel={opt.label}
                        className="group flex items-center justify-between py-1 text-left text-sm font-sans text-black/75 hover:text-black transition-colors"
                      >
                        <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A] mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="font-serif text-[22px] leading-tight">
                            {opt.label}
                          </span>
                          {opt.badge && (
                            <span className="border border-black/30 text-black font-sans text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] ml-2">
                              {opt.badge}
                            </span>
                          )}
                        </span>
                        {group.key === 'explore' ? (
                          <ArrowUpRight
                            size={14}
                            className="text-black/40 group-hover:text-black transition-colors"
                          />
                        ) : (
                          <span className="text-xs text-black/40 font-sans">
                            {countForRent(opt.slug)}
                          </span>
                        )}
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RESULTS BAR (ALL 12, RENTAL FILTER PILLS & FLIP)                      */}
          {/* ===================================================================== */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-y border-black/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-xs text-black/60 mr-2">
                Showing <strong className="text-black">{filteredRentals.length}</strong> of{' '}
                {rentals.length} rentals
              </span>

              {/* Furnishing Pills */}
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

              {/* Tenants Pills */}
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-sans text-black/60 uppercase tracking-wider">
                Sort:
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-black/5 border border-black/15 rounded-lg px-3 py-1.5 text-xs font-sans text-black focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="rent-asc">Rent: Low to High</option>
                <option value="rent-desc">Rent: High to Low</option>
                <option value="area-desc">Largest Area</option>
              </select>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* ALL RENTALS GRID                                                      */}
          {/* ===================================================================== */}
          {filteredRentals.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-black/5 border border-black/10">
              <h3 className="font-serif text-2xl text-black mb-2">No matching rentals found</h3>
              <p className="font-sans text-sm text-black/60 max-w-md mx-auto mb-6">
                Try clearing search terms or removing filters to view all available Hyderabad
                rentals.
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
                className="px-6 py-2.5 rounded-lg bg-black text-white text-xs font-sans font-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRentals.map((rental, idx) => (
                <RentCard
                  key={rental.id}
                  rental={rental}
                  index={idx}
                  theme={{
                    mode: 'light',
                    bg: '#FAF8F4',
                    ink: '#0C0C0C',
                    accent: '#D4AF6A',
                    accentInk: '#8C671D',
                    dark1: '#1C1C1C',
                    dark2: '#0D0D0D',
                  }}
                  motion="maskRise"
                  isSaved={Boolean(savedIds[rental.id])}
                  onToggleSave={toggleSave}
                  onSelectRental={handleSelectRental}
                />
              ))}
            </div>
          )}

          {/* ===================================================================== */}
          {/* RENTAL TOOLKIT (RENT BUDGET MODULE + OBSIDIAN CHECKLIST CARD)         */}
          {/* ===================================================================== */}
          <div className="space-y-8 pt-12 border-t border-black/10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.22em] text-[#8C671D] block mb-2 font-medium">
                  Rental Advisory &amp; Tools
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#0C0C0C]">
                  Rent with <span className="italic text-[#8C671D]">confidence.</span>
                </h3>
              </div>
              <TransitionLink
                to="/faqs?cat=renting"
                transitionLabel="FAQs"
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.18em] text-[#8C671D] hover:text-[#0C0C0C] transition-colors pb-1 border-b border-[#8C671D]/30"
              >
                <span>Read the FAQs</span>
                <span>&rarr;</span>
              </TransitionLink>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: RentBudget Module preset at 30,000 */}
              <div className="lg:col-span-7">
                <CategoryModules
                  modules={[
                    {
                      kind: 'rentBudget',
                      title: 'Rent & Move-in Cost Estimator',
                      presetRent: 30000,
                    },
                  ]}
                  theme={{
                    mode: 'light',
                    bg: '#FFFFFF',
                    accent: '#D4AF6A',
                    accentInk: '#8C671D',
                    dark1: '#1C1C1C',
                    dark2: '#0D0D0D',
                  }}
                  topProperties={[]}
                />
              </div>

              {/* Right: Obsidian "Before you rent" Checklist Card */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#0E0E0E] text-white border border-white/10 space-y-6 shadow-2xl mt-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#D4AF6A] block">
                      Tenancy Advisory
                    </span>
                    <h4 className="font-serif text-2xl">Before You Sign a Lease</h4>
                  </div>
                </div>

                <p className="font-sans text-xs opacity-70 leading-relaxed">
                  Key verifications recommended by our Hyderabad leasing team before transferring
                  security deposits:
                </p>

                <div className="space-y-3.5 text-xs font-sans">
                  {[
                    'Verify ownership through property tax receipts or utility bill name matching',
                    'Insist on an 11-month registered or legally stamped agreement with notice clauses',
                    'Document inventory of fixtures and air conditioning units with dated photos',
                    'Clarify monthly society maintenance and power backup diesel generator slab rates',
                    'Confirm move-in elevator booking and society shifting charges in advance',
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 text-[#D4AF6A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="opacity-85 leading-snug">{tip}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sans">
                  <span className="opacity-60">Need personalized guidance?</span>
                  <TransitionLink
                    to="/rent/share-requirement"
                    transitionLabel="Share Requirement"
                    className="text-[#D4AF6A] hover:underline font-medium"
                  >
                    Consult an Advisor
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* CTA BAND (CANNOT FIND THE RIGHT HOME? TELL US WHAT YOU NEED)           */}
          {/* ===================================================================== */}
          <div className="rounded-3xl p-8 sm:p-12 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-3xl">Cannot find the right home?</h3>
              <p className="font-sans text-xs sm:text-sm opacity-70">
                Tell us what you need. Our executive leasing team matches private, unlisted inventory
                across Hyderabad directly to your brief.
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
      </section>

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

export default Rent;

