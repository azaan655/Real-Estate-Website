import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { properties, Property } from '../data/properties';
import { BUY_TAXONOMY_GROUPS, countFor } from '../data/buyTaxonomy';
import SearchBar from '../components/SearchBar';
import BuyCard from '../components/BuyCard';
import PropertyDetail from '../components/PropertyDetail';
import { TransitionLink } from '../components/PageTransition';

export const Buy: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [budgetFilter, setBudgetFilter] = useState(searchParams.get('budget') || '');
  const [bhkFilter, setBhkFilter] = useState(searchParams.get('bhk') || '');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string | number, boolean>>({});

  useEffect(() => {
    document.title = 'Buy Luxury Real Estate in Hyderabad | VESTA';
  }, []);

  // Update URL search query params on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (typeFilter) params.set('type', typeFilter);
    if (budgetFilter) params.set('budget', budgetFilter);
    if (bhkFilter) params.set('bhk', bhkFilter);
    setSearchParams(params, { replace: true });
  }, [q, typeFilter, budgetFilter, bhkFilter, setSearchParams]);

  // Filter listings
  const filteredProperties = useMemo(() => {
    let list = properties.filter((p) => {
      // Query search
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

    if (sortOrder === 'price-asc') {
      list = [...list].sort((a, b) => a.priceCr - b.priceCr);
    } else if (sortOrder === 'price-desc') {
      list = [...list].sort((a, b) => b.priceCr - a.priceCr);
    }

    return list;
  }, [q, typeFilter, budgetFilter, bhkFilter, sortOrder]);

  const toggleSave = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectProperty = (p: Property) => {
    setSelectedProperty(p);
    setIsDetailOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0C0C0C] text-white">
      {/* Top Header with Search Bar */}
      <div className="w-full pb-20 pt-4 px-6 md:px-12 lg:px-16 bg-[#0C0C0C]">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-3">
            Residences & Collections
          </h1>
          <p className="font-sans text-sm text-white/70 max-w-lg mx-auto">
            Explore 12 signature Hyderabad properties across 18 specialized architectural and investment collections.
          </p>
        </div>

        <SearchBar
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
          }}
        />
      </div>

      {/* Main Ivory Body Section */}
      <section className="relative w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#FAF8F4] text-[#0C0C0C] px-6 sm:px-10 md:px-16 lg:px-20 py-20 -mt-14 z-20 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          {/* ===================================================================== */}
          {/* 4 LINK COLUMNS (NAVIGATES TO /buy/:slug)                              */}
          {/* ===================================================================== */}
          <div className="mb-20 pb-16 border-b border-black/10">
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-[#8C671D] block mb-2 font-medium">
              Browse by Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0C0C0C] mb-8">
              Explore Specialized Portfolios
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {BUY_TAXONOMY_GROUPS.map((group) => (
                <div key={group.key} className="flex flex-col">
                  <h3 className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[#0C0C0C]/80 pb-3 border-b border-black/10 mb-4">
                    {group.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {group.options.map((opt) => (
                      <TransitionLink
                        key={opt.slug}
                        to={`/buy/${opt.slug}`}
                        transitionLabel={opt.label}
                        className="group flex items-center justify-between py-1 text-left text-sm font-sans text-black/75 hover:text-black transition-colors"
                      >
                        <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A] mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="font-serif text-lg leading-tight">{opt.label}</span>
                          {opt.badge && (
                            <span className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] ml-2">
                              {opt.badge}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-black/40 font-sans">
                          {countFor(opt.slug)}
                        </span>
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RESULTS BAR                                                           */}
          {/* ===================================================================== */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="font-sans text-xs text-black/60">
              Showing <strong className="text-black">{filteredProperties.length}</strong> of {properties.length} residences
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-sans text-black/60 uppercase tracking-wider">Sort:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-black/5 border border-black/15 rounded-lg px-3 py-1.5 text-xs font-sans text-black focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
              >
                <option value="default">Curated Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* ALL PROPERTIES GRID                                                   */}
          {/* ===================================================================== */}
          {filteredProperties.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-black/5 border border-black/10">
              <h3 className="font-serif text-2xl text-black mb-2">No matching listings found</h3>
              <p className="font-sans text-sm text-black/60 max-w-md mx-auto mb-6">
                Try clearing search terms or removing dropdown filters to see available properties.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  setTypeFilter('');
                  setBudgetFilter('');
                  setBhkFilter('');
                }}
                className="px-6 py-2.5 rounded-full border border-black text-xs font-sans uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((p, idx) => (
                <BuyCard
                  key={p.id}
                  property={p}
                  index={idx}
                  theme={{
                    mode: 'light',
                    bg: '#FAF8F4',
                    ink: '#0C0C0C',
                    accent: '#D4AF6A',
                    accentInk: '#8C671D',
                    dark1: '#1F1E1B',
                    dark2: '#0C0C0C',
                  }}
                  isSaved={Boolean(savedIds[p.id])}
                  onToggleSave={toggleSave}
                  onSelectProperty={handleSelectProperty}
                />
              ))}
            </div>
          )}
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

export default Buy;

