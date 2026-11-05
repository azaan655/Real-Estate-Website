import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FadeIn from './FadeIn';
import { usePageTransition } from './PageTransition';
import { RUPEE } from '../lib/money';

export const SearchCard: React.FC = () => {
  const [mode, setMode] = useState<'buy' | 'rent'>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [bhk, setBhk] = useState('');
  const { transitionTo } = usePageTransition();

  const isRent = mode === 'rent';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType) params.set('type', propertyType);
    if (budget) params.set('budget', budget);
    if (bhk) params.set('bhk', bhk);

    const queryString = params.toString();
    const targetUrl = isRent
      ? queryString
        ? `/rent?${queryString}`
        : '/rent'
      : queryString
      ? `/buy?${queryString}`
      : '/buy';

    transitionTo(targetUrl, isRent ? 'Rental Search' : 'Property Search');
  };

  return (
    <FadeIn delay={1500} duration={1000} y={12} className="w-full max-w-md">
      <div className="liquid-glass border border-white/20 rounded-2xl p-4 sm:p-5 w-full">
        {/* Title and Segmented Buy | Rent Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl text-white">Start your search</h2>
          <div className="flex bg-white/10 p-0.5 rounded-lg border border-white/10 text-xs font-sans">
            <button
              type="button"
              onClick={() => {
                setMode('buy');
                setPropertyType('');
                setBudget('');
                setBhk('');
              }}
              className={`px-3.5 py-1.5 min-h-[36px] sm:min-h-[30px] flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                mode === 'buy'
                  ? 'bg-white text-black font-medium'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('rent');
                setPropertyType('');
                setBudget('');
                setBhk('');
              }}
              className={`px-3.5 py-1.5 min-h-[36px] sm:min-h-[30px] flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                mode === 'rent'
                  ? 'bg-[#D4AF6A] text-black font-medium'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Property Type Select */}
          <div>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-4 py-3 w-full font-sans focus:outline-none focus:border-white/40 transition-colors cursor-pointer"
            >
              <option value="" className="bg-black text-white">Any type</option>
              {isRent ? (
                <>
                  <option value="flats-for-rent" className="bg-black text-white">Flats</option>
                  <option value="houses-for-rent" className="bg-black text-white">Houses</option>
                  <option value="villas-for-rent" className="bg-black text-white">Villas</option>
                  <option value="commercial-for-rent" className="bg-black text-white">Commercial</option>
                  <option value="office-for-rent" className="bg-black text-white">Office</option>
                </>
              ) : (
                <>
                  <option value="flats-apartments" className="bg-black text-white">Flats/Apartments</option>
                  <option value="independent-houses" className="bg-black text-white">Independent Houses</option>
                  <option value="villas" className="bg-black text-white">Villas</option>
                  <option value="plots-land" className="bg-black text-white">Plots/Land</option>
                  <option value="commercial" className="bg-black text-white">Commercial</option>
                </>
              )}
            </select>
          </div>

          {/* Budget Select */}
          <div>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-4 py-3 w-full font-sans focus:outline-none focus:border-white/40 transition-colors cursor-pointer"
            >
              <option value="" className="bg-black text-white">Any budget</option>
              {isRent ? (
                <>
                  <option value="under-10000" className="bg-black text-white">Under {RUPEE}10,000</option>
                  <option value="10000-to-25000" className="bg-black text-white">{RUPEE}10,000 - {RUPEE}25,000</option>
                  <option value="25000-to-50000" className="bg-black text-white">{RUPEE}25,000 - {RUPEE}50,000</option>
                  <option value="above-50000" className="bg-black text-white">Above {RUPEE}50,000</option>
                </>
              ) : (
                <>
                  <option value="under-50-lacs" className="bg-black text-white">Under {RUPEE}50 Lacs</option>
                  <option value="50-lacs-to-1-cr" className="bg-black text-white">{RUPEE}50 Lacs - {RUPEE}1 Cr</option>
                  <option value="1-cr-to-5-cr" className="bg-black text-white">{RUPEE}1 Cr - {RUPEE}5 Cr</option>
                  <option value="above-5-cr" className="bg-black text-white">Above {RUPEE}5 Cr</option>
                </>
              )}
            </select>
          </div>

          {/* BHK Select */}
          <div>
            <select
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-4 py-3 w-full font-sans focus:outline-none focus:border-white/40 transition-colors cursor-pointer"
            >
              <option value="" className="bg-black text-white">Any BHK</option>
              {isRent ? (
                <>
                  <option value="1-bhk-for-rent" className="bg-black text-white">1 BHK</option>
                  <option value="2-bhk-for-rent" className="bg-black text-white">2 BHK</option>
                  <option value="3-bhk-for-rent" className="bg-black text-white">3 BHK</option>
                  <option value="4-bhk-for-rent" className="bg-black text-white">4 BHK</option>
                </>
              ) : (
                <>
                  <option value="1-bhk" className="bg-black text-white">1 BHK</option>
                  <option value="2-bhk" className="bg-black text-white">2 BHK</option>
                  <option value="3-bhk" className="bg-black text-white">3 BHK</option>
                  <option value="4-bhk" className="bg-black text-white">4 BHK</option>
                  <option value="4-plus-bhk" className="bg-black text-white">4+ BHK</option>
                </>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-200 mt-1 font-sans cursor-pointer"
          >
            <Search size={16} />
            <span>{isRent ? 'Search Rentals' : 'Search Properties'}</span>
          </button>
        </form>

        <div className="text-xs text-white/60 text-center mt-3 font-sans">
          {'Hyderabad \u00B7 Jubilee Hills \u00B7 Banjara Hills \u00B7 Kokapet'}
        </div>
      </div>
    </FadeIn>
  );
};

export default SearchCard;
