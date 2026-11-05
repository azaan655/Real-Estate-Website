import React from 'react';
import {
  Building2,
  Home,
  TreePine,
  Store,
  Briefcase,
  Heart,
  ArrowUpRight,
} from 'lucide-react';
import { Rental, getKeyDetails, deposit, formatRentMonthly } from '../data/rentals';
import { BuyPageTheme, MotionVariant } from '../data/buyPages';
import { RUPEE, DOT, formatInr } from '../lib/money';

interface RentCardProps {
  rental: Rental;
  index: number;
  theme?: BuyPageTheme;
  motion?: MotionVariant;
  isSaved?: boolean;
  onToggleSave?: (id: string, e: React.MouseEvent) => void;
  onSelectRental?: (rental: Rental) => void;
  isSuggested?: boolean;
}

// Color mix helper in hex
function mixColor(color1: string, color2: string, weight: number): string {
  const c1 = color1.replace('#', '');
  const c2 = color2.replace('#', '');
  const r1 = parseInt(c1.substring(0, 2), 16) || 0;
  const g1 = parseInt(c1.substring(2, 4), 16) || 0;
  const b1 = parseInt(c1.substring(4, 6), 16) || 0;

  const r2 = parseInt(c2.substring(0, 2), 16) || 0;
  const g2 = parseInt(c2.substring(2, 4), 16) || 0;
  const b2 = parseInt(c2.substring(4, 6), 16) || 0;

  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);

  return `rgb(${r}, ${g}, ${b})`;
}

export const RentCard: React.FC<RentCardProps> = ({
  rental,
  index,
  theme,
  motion,
  isSaved = false,
  onToggleSave,
  onSelectRental,
  isSuggested = false,
}) => {
  const toneIndex = index % 3;

  // Derive tone background if theme is present
  let cardBgStyle: React.CSSProperties = {};
  let isToneB = false;

  if (theme) {
    if (toneIndex === 0) {
      // Tone A
      cardBgStyle = {
        background: `radial-gradient(120% 90% at 20% 0%, ${theme.dark1} 0%, ${theme.dark2} 100%)`,
        color: '#FFFFFF',
      };
    } else if (toneIndex === 1) {
      // Tone B
      isToneB = true;
      const mixedAccent = mixColor(theme.accent, '#FFFFFF', 0.55);
      cardBgStyle = {
        background: `linear-gradient(160deg, ${mixedAccent} 0%, ${theme.accent} 100%)`,
        color: '#0C0C0C',
      };
    } else {
      // Tone C
      const mixedDark1 = mixColor(theme.dark1, theme.accent, 0.3);
      cardBgStyle = {
        background: `radial-gradient(120% 90% at 20% 0%, ${mixedDark1} 0%, ${theme.dark2} 100%)`,
        color: '#FFFFFF',
      };
    }
  }

  const isBlueprint = motion === 'blueprint';
  const isGoldSweep = motion === 'goldSweep';

  const handleClick = () => {
    if (onSelectRental) onSelectRental(rental);
  };

  const keyDetails = getKeyDetails(rental);
  const depositAmount = deposit(rental);

  const renderTypeIcon = () => {
    const iconProps = { size: 20, strokeWidth: 1.6 };
    switch (rental.type) {
      case 'flat':
        return <Building2 {...iconProps} />;
      case 'house':
        return <Home {...iconProps} />;
      case 'villa':
        return <TreePine {...iconProps} />;
      case 'commercial':
        return <Store {...iconProps} />;
      case 'office':
        return <Briefcase {...iconProps} />;
      default:
        return <Building2 {...iconProps} />;
    }
  };

  const availabilityLabel =
    rental.availableFrom.toLowerCase() === 'immediate'
      ? 'Available now'
      : `From ${rental.availableFrom}`;

  return (
    <div
      onClick={handleClick}
      className={`rent-card group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between ${
        theme?.mode === 'dark' ? 'border-white/15' : 'border-black/10'
      } ${isBlueprint ? 'relative' : ''}`}
      style={cardBgStyle}
    >
      {/* Blueprint Corner Tick Marks */}
      {isBlueprint && (
        <>
          <span
            className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 z-20 pointer-events-none"
            style={{ borderColor: theme?.accent || '#D4AF6A' }}
          />
          <span
            className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 z-20 pointer-events-none"
            style={{ borderColor: theme?.accent || '#D4AF6A' }}
          />
        </>
      )}

      {/* Gold Sweep Shimmer Effect */}
      {isGoldSweep && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden z-20"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(212,175,106,0.15) 50%, transparent 80%)',
            transform: 'translateX(-100%)',
            animation: 'goldSweepAnim 1.6s ease-in-out infinite',
          }}
        />
      )}

      {/* Suggested Listing Banner */}
      {isSuggested && (
        <div className="bg-[#D4AF6A]/20 text-[#D4AF6A] px-4 py-1 text-[11px] font-sans font-medium uppercase tracking-wider border-b border-[#D4AF6A]/30">
          Curated Alternative
        </div>
      )}

      {/* Card Header & Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
        <div>
          {/* Top Row: Location Eyebrow and 44px Circular Type Icon */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span
              className={`font-sans text-xs uppercase tracking-[0.18em] ${
                isToneB ? 'text-black/70' : 'text-white/60'
              }`}
            >
              {rental.location}
            </span>

            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                isToneB ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
              }`}
            >
              {renderTypeIcon()}
            </div>
          </div>

          {/* Listing Name (2 lines) in Display Font */}
          <h3
            className="text-[clamp(1.5rem,2.8vw,1.9rem)] leading-[1.1] mb-2 font-normal"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)',
              color: isToneB ? '#0C0C0C' : '#FFFFFF',
            }}
          >
            {rental.name.split('\n').map((line, idx) => (
              <span key={idx} className="block overflow-hidden">
                <span className="block transform transition-transform duration-500 ease-out group-hover:translate-x-1">
                  {line}
                </span>
              </span>
            ))}
          </h3>

          {/* Tagline */}
          <p
            className={`font-sans text-xs sm:text-sm line-clamp-1 mb-6 ${
              isToneB ? 'text-black/75' : 'text-white/70'
            }`}
          >
            {rental.tagline}
          </p>

          {/* Stats Section (Rent & Area separated by a thin rule) */}
          <div
            className={`grid grid-cols-2 gap-4 py-4 border-y ${
              isToneB ? 'border-black/15' : 'border-white/15'
            }`}
          >
            {/* Monthly Rent */}
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[34px] sm:text-[40px] leading-none font-normal"
                  style={{
                    fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)',
                    color: isToneB ? '#0C0C0C' : '#FFFFFF',
                  }}
                >
                  <span className="rupee font-sans mr-0.5">{RUPEE}</span>
                  {formatInr(rental.rent)}
                </span>
                <span className="text-[11px] font-sans opacity-60">/ month</span>
              </div>
              <span
                className={`text-[11px] font-sans block mt-1 ${
                  isToneB ? 'text-black/60' : 'text-white/50'
                }`}
              >
                Deposit {RUPEE}{formatInr(depositAmount)} ({rental.depositMonths} mo)
              </span>
            </div>

            {/* Total Area */}
            <div className="pl-4 border-l border-white/10">
              <span
                className="text-[34px] sm:text-[40px] leading-none font-normal block"
                style={{
                  fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)',
                  color: isToneB ? '#0C0C0C' : '#FFFFFF',
                }}
              >
                {rental.area.toLocaleString('en-IN')}
              </span>
              <span
                className={`text-[11px] font-sans block mt-1 ${
                  isToneB ? 'text-black/60' : 'text-white/50'
                }`}
              >
                {rental.areaUnit} built-up
              </span>
            </div>
          </div>

          {/* Key Details Strip (3 cells) */}
          <div className="grid grid-cols-3 gap-2 py-4">
            {keyDetails.slice(0, 3).map((det, dIdx) => (
              <div key={dIdx} className="overflow-hidden">
                <span
                  className={`text-[10px] uppercase font-sans tracking-wider block ${
                    isToneB ? 'text-black/50' : 'text-white/40'
                  }`}
                >
                  {det.label}
                </span>
                <span
                  className={`text-xs font-sans font-medium truncate block mt-0.5 ${
                    isToneB ? 'text-black/90' : 'text-white/90'
                  }`}
                >
                  {det.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Block on Two Paper Layers (3:2) */}
        <div className="relative mt-2 pt-2">
          {/* Subtle paper shadow layers */}
          <div
            className={`absolute inset-x-2 -bottom-1.5 h-6 rounded-xl transform scale-[0.96] opacity-30 ${
              isToneB ? 'bg-black/20' : 'bg-white/15'
            }`}
          />
          <div
            className={`absolute inset-x-1 -bottom-0.5 h-6 rounded-xl transform scale-[0.98] opacity-50 ${
              isToneB ? 'bg-black/25' : 'bg-white/20'
            }`}
          />

          <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden bg-black/40 z-10">
            <img
              src={rental.image}
              alt={rental.name.replace('\n', ' ')}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: rental.focal || 'center center' }}
            />

            {/* Gradient bottom shadow inside photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Glass Chip Top-Left: Availability */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full liquid-glass bg-black/60 backdrop-blur-md text-[11px] font-sans font-medium text-white border border-white/20 shadow-md">
              {availabilityLabel}
            </div>

            {/* Glass Heart Button Bottom-Right */}
            <button
              type="button"
              aria-label="Save rental"
              aria-pressed={isSaved}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleSave) onToggleSave(rental.id, e);
              }}
              className={`absolute bottom-3 right-3 w-9 h-9 rounded-full liquid-glass backdrop-blur-md flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                isSaved
                  ? 'bg-[#D4AF6A] text-black border-[#D4AF6A]'
                  : 'bg-black/60 text-white border-white/25 hover:bg-white hover:text-black'
              }`}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Row */}
      <div
        className={`px-6 py-4 flex items-center justify-between border-t ${
          isToneB ? 'border-black/10 text-black' : 'border-white/10 text-white'
        }`}
      >
        <span
          className="font-sans text-xs font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          style={{ color: isToneB ? '#0C0C0C' : theme?.accent || '#D4AF6A' }}
        >
          <span>View Rental</span>
          <ArrowUpRight size={14} />
        </span>

        <span
          className={`font-sans text-[11px] ${
            isToneB ? 'text-black/50' : 'text-white/45'
          }`}
        >
          {rental.tenants.join(' / ')}
        </span>
      </div>
    </div>
  );
};

export default RentCard;

