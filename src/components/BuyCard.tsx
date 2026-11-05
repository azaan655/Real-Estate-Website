import React from 'react';
import { Bookmark, ArrowUpRight, Check } from 'lucide-react';
import { Property, formatPrice, pricePerUnit } from '../data/properties';
import { BuyPageTheme, MotionVariant } from '../data/buyPages';

interface BuyCardProps {
  property: Property;
  index: number;
  theme?: BuyPageTheme;
  motion?: MotionVariant;
  isSaved?: boolean;
  onToggleSave?: (id: string | number, e: React.MouseEvent) => void;
  onSelectProperty?: (property: Property) => void;
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

export const BuyCard: React.FC<BuyCardProps> = ({
  property,
  index,
  theme,
  motion,
  isSaved = false,
  onToggleSave,
  onSelectProperty,
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
    if (onSelectProperty) onSelectProperty(property);
  };

  return (
    <div
      onClick={handleClick}
      className={`buy-card group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between ${
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
          <span
            className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 z-20 pointer-events-none"
            style={{ borderColor: theme?.accent || '#D4AF6A' }}
          />
          <span
            className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 z-20 pointer-events-none"
            style={{ borderColor: theme?.accent || '#D4AF6A' }}
          />
        </>
      )}

      {/* GoldSweep Diagonal Light Sweep Element */}
      {isGoldSweep && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transform -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/40">
        <img
          src={property.image}
          alt={property.name.replace('\n', ' ')}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ objectPosition: property.focal || 'center center' }}
        />

        {/* Gradient Shadow over image bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {isSuggested ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-[#D4AF6A] text-black">
                Suggested
              </span>
            ) : property.badge ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                {property.badge}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-black/50 backdrop-blur-md text-white/90 border border-white/10">
                {property.subtype}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              type="button"
              aria-label={isSaved ? "Saved" : "Save property"}
              onClick={(e) => onToggleSave(property.id, e)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF6A] hover:text-black hover:border-[#D4AF6A] transition-colors"
            >
              <Bookmark size={13} className={isSaved ? 'fill-current' : 'fill-none'} />
            </button>
          )}
        </div>

        {/* Location Eyebrow on image bottom-left */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/90 drop-shadow">
            {property.location}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Property Name in var(--font-display) */}
          <h3
            className="text-2xl leading-tight mb-2 group-hover:text-[#D4AF6A] transition-colors line-clamp-1"
            style={{ fontFamily: 'var(--font-display, "Instrument Serif", serif)' }}
          >
            {property.name.replace('\n', ' ')}
          </h3>

          {/* Tagline / Subtitle */}
          <p
            className={`font-sans text-xs mb-4 line-clamp-1 ${
              isToneB ? 'text-black/75' : 'text-white/70'
            }`}
          >
            {property.tagline}
          </p>

          {/* Specs Row */}
          <div
            className={`flex flex-wrap items-center gap-2 text-xs font-sans pb-3 mb-3 border-b ${
              isToneB ? 'border-black/15 text-black/85' : 'border-white/10 text-white/80'
            }`}
          >
            {property.beds !== null ? (
              <>
                <span className="font-medium">{property.beds} BHK</span>
                <span className="opacity-40">\u00B7</span>
                <span>{property.baths} Baths</span>
                <span className="opacity-40">\u00B7</span>
                <span>{property.area.toLocaleString('en-IN')} {property.areaUnit}</span>
              </>
            ) : property.type === 'plot' ? (
              <>
                <span className="font-medium">{property.area.toLocaleString('en-IN')} sq yd</span>
                <span className="opacity-40">\u00B7</span>
                <span>{property.facing} Facing</span>
              </>
            ) : (
              <>
                <span className="font-medium">{property.subtype}</span>
                <span className="opacity-40">\u00B7</span>
                <span>{property.area.toLocaleString('en-IN')} sq ft</span>
              </>
            )}
          </div>

          {/* Highlights 2 items */}
          <div className="space-y-1 mb-4 font-sans text-[11px]">
            {property.highlights.slice(0, 2).map((hl, idx) => (
              <div key={idx} className="flex items-center gap-1.5 opacity-80 line-clamp-1">
                <Check size={11} className="text-[#D4AF6A] flex-shrink-0" strokeWidth={3} />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Price & View CTA */}
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col">
            <span
              className="font-serif text-2xl font-normal leading-none"
              style={{
                color: isToneB ? '#0C0C0C' : theme ? theme.accentInk : '#D4AF6A',
              }}
            >
              {formatPrice(property.priceCr)}
            </span>
            <span className={`font-sans text-[10px] mt-0.5 ${isToneB ? 'text-black/60' : 'text-white/50'}`}>
              {pricePerUnit(property)}
            </span>
          </div>

          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black ${
              isToneB
                ? 'border-black/30 text-black'
                : 'border-white/20 text-white group-hover:border-white'
            }`}
          >
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCard;

