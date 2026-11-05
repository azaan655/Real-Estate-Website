import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { TransitionLink } from './PageTransition';
import { RUPEE, DOT } from '../lib/money';

interface SearchBarProps {
  q: string;
  onQChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  budget: string;
  onBudgetChange: (val: string) => void;
  bhk: string;
  onBhkChange: (val: string) => void;
  categoryLabel?: string;
  className?: string;
  onReset?: () => void;
  mode?: 'buy' | 'rent';
  onSearchSubmit?: () => void;
}

const RENT_PLACEHOLDERS = [
  'Try Kondapur',
  `Try 2 BHK under ${RUPEE}25,000`,
  'Try furnished villa',
  'Try office for a team of 8',
];

const BUY_PLACEHOLDERS = [
  'Try Jubilee Hills',
  `Try 3 BHK under ${RUPEE}2 Cr`,
  'Try gated villa in Kokapet',
  'Try ready to move flat',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  q,
  onQChange,
  type,
  onTypeChange,
  budget,
  onBudgetChange,
  bhk,
  onBhkChange,
  categoryLabel,
  className = '',
  onReset,
  mode = 'buy',
  onSearchSubmit,
}) => {
  const isRent = mode === 'rent';
  const placeholders = isRent ? RENT_PLACEHOLDERS : BUY_PLACEHOLDERS;

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [placeholders.length]);

  const hasActiveFilters = Boolean(q || type || budget || bhk);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center gap-2 ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="w-full liquid-glass rounded-2xl p-2.5 sm:p-3 border border-white/20 shadow-2xl backdrop-blur-xl bg-black/60 flex flex-col md:flex-row items-center gap-2"
      >
        {/* Search Query Input */}
        <div className="relative flex-1 w-full min-w-[200px] flex items-center">
          <Search size={16} className="absolute left-3.5 text-white/50 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full h-11 pl-10 pr-8 bg-white/5 hover:bg-white/10 rounded-xl text-white placeholder-white/45 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] transition-colors"
          />
          {q && (
            <button
              type="button"
              onClick={() => onQChange('')}
              className="absolute right-3 text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group (Dropdowns) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
          {/* Property Type Dropdown */}
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-11 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] border border-white/10 transition-colors flex-1 sm:flex-none cursor-pointer"
          >
            <option value="" className="bg-[#121212] text-white">Any type</option>
            {isRent ? (
              <>
                <option value="flats-for-rent" className="bg-[#121212] text-white">Flats</option>
                <option value="houses-for-rent" className="bg-[#121212] text-white">Houses</option>
                <option value="villas-for-rent" className="bg-[#121212] text-white">Villas</option>
                <option value="commercial-for-rent" className="bg-[#121212] text-white">Commercial</option>
                <option value="office-for-rent" className="bg-[#121212] text-white">Office</option>
              </>
            ) : (
              <>
                <option value="flats-apartments" className="bg-[#121212] text-white">Flats/Apartments</option>
                <option value="independent-houses" className="bg-[#121212] text-white">Independent Houses</option>
                <option value="villas" className="bg-[#121212] text-white">Villas</option>
                <option value="plots-land" className="bg-[#121212] text-white">Plots/Land</option>
                <option value="commercial" className="bg-[#121212] text-white">Commercial</option>
              </>
            )}
          </select>

          {/* Budget Dropdown */}
          <select
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="h-11 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] border border-white/10 transition-colors flex-1 sm:flex-none cursor-pointer"
          >
            <option value="" className="bg-[#121212] text-white">Any budget</option>
            {isRent ? (
              <>
                <option value="under-10000" className="bg-[#121212] text-white">Under {RUPEE}10,000</option>
                <option value="10000-to-25000" className="bg-[#121212] text-white">{RUPEE}10,000 - {RUPEE}25,000</option>
                <option value="25000-to-50000" className="bg-[#121212] text-white">{RUPEE}25,000 - {RUPEE}50,000</option>
                <option value="above-50000" className="bg-[#121212] text-white">Above {RUPEE}50,000</option>
              </>
            ) : (
              <>
                <option value="under-50-lacs" className="bg-[#121212] text-white">Under {RUPEE}50 Lacs</option>
                <option value="50-lacs-to-1-cr" className="bg-[#121212] text-white">{RUPEE}50 Lacs - {RUPEE}1 Cr</option>
                <option value="1-cr-to-5-cr" className="bg-[#121212] text-white">{RUPEE}1 Cr - {RUPEE}5 Cr</option>
                <option value="above-5-cr" className="bg-[#121212] text-white">Above {RUPEE}5 Cr</option>
              </>
            )}
          </select>

          {/* BHK Dropdown */}
          <select
            value={bhk}
            onChange={(e) => onBhkChange(e.target.value)}
            className="h-11 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] border border-white/10 transition-colors flex-1 sm:flex-none cursor-pointer"
          >
            <option value="" className="bg-[#121212] text-white">Any BHK</option>
            {isRent ? (
              <>
                <option value="1-bhk-for-rent" className="bg-[#121212] text-white">1 BHK</option>
                <option value="2-bhk-for-rent" className="bg-[#121212] text-white">2 BHK</option>
                <option value="3-bhk-for-rent" className="bg-[#121212] text-white">3 BHK</option>
                <option value="4-bhk-for-rent" className="bg-[#121212] text-white">4 BHK</option>
              </>
            ) : (
              <>
                <option value="1-bhk" className="bg-[#121212] text-white">1 BHK</option>
                <option value="2-bhk" className="bg-[#121212] text-white">2 BHK</option>
                <option value="3-bhk" className="bg-[#121212] text-white">3 BHK</option>
                <option value="4-bhk" className="bg-[#121212] text-white">4 BHK</option>
                <option value="4-plus-bhk" className="bg-[#121212] text-white">4+ BHK</option>
              </>
            )}
          </select>

          {/* Gold Circular Search / Action Button */}
          <button
            type="submit"
            aria-label="Submit search"
            className="w-11 h-11 rounded-full bg-[#D4AF6A] text-[#0C0C0C] flex items-center justify-center hover:bg-[#e0be7d] transition-all duration-300 flex-shrink-0 cursor-pointer shadow-md"
          >
            <Search size={16} strokeWidth={2.5} />
          </button>

          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              title="Reset all filters"
              className="h-11 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-sans flex items-center gap-1 transition-colors"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </form>

      {/* Category Sub-caption */}
      {categoryLabel && (
        <div className="flex items-center gap-2 text-xs font-sans text-white/60 mt-1">
          <span>
            Searching within <strong className="text-white font-medium">{categoryLabel}</strong>
          </span>
          <span className="text-white/30">{DOT}</span>
          <TransitionLink
            to={isRent ? '/rent' : '/buy'}
            transitionLabel={isRent ? 'All Rentals' : 'All Properties'}
            className="text-[#D4AF6A] hover:underline transition-colors"
          >
            {isRent ? 'Search all rentals' : 'Search all properties'}
          </TransitionLink>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
