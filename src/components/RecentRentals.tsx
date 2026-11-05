import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Eye,
  MapPin,
  BedDouble,
  Maximize2,
  Store,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowUpRight,
  Heart,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { rentals, Rental, rentalViews } from '../data/rentals';
import { RUPEE, DOT, formatInr } from '../lib/money';
import { RentDetail } from './RentDetail';
import { TransitionLink } from './PageTransition';
import { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../data/services';

if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger && typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TYPE_LABEL_MAP: Record<string, string> = {
  flat: 'Apartment',
  house: 'Independent House',
  villa: 'Villa',
  commercial: 'Retail',
  office: 'Office',
};

// -----------------------------------------------------------------------------
// INDIVIDUAL RENTAL CARD
// -----------------------------------------------------------------------------
interface RentalCardProps {
  rental: Rental;
  index: number;
  isGlobalPaused: boolean;
  onOpenDetail: (rental: Rental, viewIndex: number) => void;
  hasDraggedRef: React.RefObject<boolean>;
}

const RentalCard: React.FC<RentalCardProps> = ({
  rental,
  index,
  isGlobalPaused,
  onOpenDetail,
  hasDraggedRef,
}) => {
  const views = useMemo(() => rentalViews(rental), [rental]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [, setPrevSlideLabel] = useState(views[0]?.label || '');
  const [currSlideLabel, setCurrSlideLabel] = useState(views[0]?.label || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInView, setIsInView] = useState(index < 3); // Eager load first 3
  const [animatedPrice, setAnimatedPrice] = useState(0);

  const cardRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const kenBurnsTween = useRef<gsap.core.Tween | null>(null);

  const SLIDE_MS = 2000;
  const TRAVEL = 0.8;
  const fullName = rental.name.replace(/\n/g, ' ');
  const idNum = rental.id.replace('R', '');
  const idLabel = `ID: 10${idNum}`;

  // IntersectionObserver for lazy loading and pausing when off-screen
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { rootMargin: '100px' }
    );

    observer.observe(cardEl);
    return () => observer.disconnect();
  }, []);

  // Card entrance animation with ScrollTrigger
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAnimatedPrice(rental.rent);
      return;
    }

    const ctx = gsap.context(() => {
      const badges = cardEl.querySelectorAll('.card-badge-anim');
      const titleEl = cardEl.querySelector('.card-title-anim');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardEl,
          start: 'top 88%',
          once: true,
        },
      });

      tl.fromTo(
        cardEl,
        { y: 28, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
      );

      if (badges.length > 0) {
        tl.fromTo(
          badges,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(2)' },
          '-=0.6'
        );
      }

      if (titleEl) {
        tl.fromTo(
          titleEl,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
      }

      // Count up price
      const priceObj = { val: 0 };
      tl.to(
        priceObj,
        {
          val: rental.rent,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => setAnimatedPrice(Math.round(priceObj.val)),
        },
        '-=0.5'
      );
    }, cardEl);

    return () => ctx.revert();
  }, [rental.rent]);

  // View Label Roll Animation
  const animateLabelRoll = useCallback((newLabel: string) => {
    setPrevSlideLabel(currSlideLabel);
    setCurrSlideLabel(newLabel);

    if (labelRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          labelRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    }
  }, [currSlideLabel]);

  // Slideshow transition logic
  const goToSlide = useCallback((targetSlide: number) => {
    if (!trackRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextIdx = targetSlide % 4;

    const currentImg = trackRef.current.querySelector<HTMLImageElement>(`.slide-img-${nextIdx}`);
    if (currentImg && !prefersReducedMotion) {
      if (kenBurnsTween.current) kenBurnsTween.current.kill();
      gsap.set(currentImg, { scale: 1 });
      kenBurnsTween.current = gsap.to(currentImg, {
        scale: 1.07,
        duration: 2.8,
        ease: 'none',
      });
    }

    animateLabelRoll(views[nextIdx]?.label || '');

    if (prefersReducedMotion) {
      setActiveSlide(nextIdx);
      gsap.set(trackRef.current, { xPercent: -100 * nextIdx });
      return;
    }

    // Normal slide animation
    if (targetSlide === 4) {
      // Transition to clone (index 4) then instantly reset to 0
      gsap.to(trackRef.current, {
        xPercent: -400,
        duration: TRAVEL,
        ease: 'power3.inOut',
        onComplete: () => {
          if (trackRef.current) {
            gsap.set(trackRef.current, { xPercent: 0 });
          }
          setActiveSlide(0);
        },
      });
    } else {
      gsap.to(trackRef.current, {
        xPercent: -100 * targetSlide,
        duration: TRAVEL,
        ease: 'power3.inOut',
        onComplete: () => {
          setActiveSlide(targetSlide);
        },
      });
    }
  }, [TRAVEL, animateLabelRoll, views]);

  // Pre-decode next slide image 1 second before change
  const predecodeNext = useCallback((current: number) => {
    const next = (current + 1) % 4;
    const view = views[next];
    if (view && typeof window !== 'undefined') {
      const img = new Image();
      img.src = view.src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    }
  }, [views]);

  // Autoplay timer with staggered phase
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPaused = isGlobalPaused || isHovered || isFocused || !isInView || prefersReducedMotion;

    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Stagger initial phase: (index * 370) % 2000 ms
    const initialDelay = (index * 370) % SLIDE_MS;

    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => {
          const next = prev + 1;
          goToSlide(next);
          predecodeNext(next % 4);
          return next % 4;
        });
      }, SLIDE_MS);
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goToSlide, index, isFocused, isGlobalPaused, isHovered, isInView, predecodeNext]);

  // Touch & Pointer Swipe on Photo
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX.current === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diffX = touchStartX.current - clientX;
    touchStartX.current = null;

    if (Math.abs(diffX) >= 40) {
      if (diffX > 0) {
        // Next
        goToSlide((activeSlide + 1) % 4);
      } else {
        // Prev
        goToSlide((activeSlide - 1 + 4) % 4);
      }
    }
  };

  const handlePhotoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide((activeSlide + 1) % 4);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide((activeSlide - 1 + 4) % 4);
    }
  };

  // WhatsApp link message
  const whatsappText = encodeURIComponent(
    `Hi, I am interested in ${fullName} (${idLabel}) listed at \u20B9${formatInr(rental.rent)} per month.`
  );
  const emailSubject = encodeURIComponent(`Enquiry: ${fullName} (${idLabel})`);

  return (
    <article
      ref={cardRef}
      aria-label={fullName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="rental-card group/card w-full h-full relative rounded-[24px] bg-white border border-[rgba(12,12,12,0.14)] p-[14px_14px_22px] shadow-[0_10px_30px_rgba(12,12,12,0.05)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(12,12,12,0.14)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between"
    >
      {/* Top Section: Photo Slideshow */}
      <div>
        <div className="relative aspect-[3/2] w-full rounded-[16px] overflow-hidden bg-[#E9E4D8] select-none">
          {/* Slideshow button trigger */}
          <button
            type="button"
            onClick={(e) => {
              if (hasDraggedRef.current) return;
              e.preventDefault();
              onOpenDetail(rental, activeSlide);
            }}
            onKeyDown={handlePhotoKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            aria-label={`View details of ${fullName}`}
            className="w-full h-full block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] relative overflow-hidden"
          >
            {/* Slide Track (4 slides + 1 clone) */}
            <div
              ref={trackRef}
              className="flex w-[500%] h-full"
              style={{ willChange: 'transform' }}
            >
              {[...views, views[0]].map((v, i) => (
                <div key={`${v.src}-${i}`} className="w-[20%] h-full relative overflow-hidden">
                  <img
                    src={i === 0 || isInView ? v.src : undefined}
                    data-src={v.src}
                    alt={v.alt}
                    width={600}
                    height={400}
                    loading={index < 3 && i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`slide-img-${i % 4} w-full h-full object-cover transition-transform duration-700 pointer-events-none`}
                    style={{ objectPosition: rental.focal || 'center center' }}
                  />
                </div>
              ))}
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          </button>

          {/* Top-Left: Availability Chip */}
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.14em] backdrop-blur-md bg-black/40 text-white border border-white/10">
              {rental.availableFrom.toLowerCase() === 'immediate'
                ? 'Available now'
                : `From ${rental.availableFrom}`}
            </span>
          </div>

          {/* Top-Right: Glass Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved((prev) => !prev);
            }}
            aria-pressed={isSaved}
            aria-label={isSaved ? `Remove ${fullName} from saved` : `Save ${fullName}`}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
          >
            <Heart
              size={15}
              className={isSaved ? 'fill-[#D4AF6A] text-[#D4AF6A]' : 'text-white'}
            />
          </button>

          {/* Bottom-Left: View Label Chip */}
          <div className="absolute bottom-3 left-3 pointer-events-none z-10">
            <div className="h-6 overflow-hidden px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center">
              <span
                ref={labelRef}
                className="text-[10px] font-sans font-medium uppercase tracking-[0.12em] text-white/90 block"
              >
                {currSlideLabel}
              </span>
            </div>
          </div>

          {/* Bottom-Center: Slide Dots */}
          <div className="absolute bottom-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
              {views.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(dotIdx);
                  }}
                  aria-label={`Show ${views[dotIdx]?.label || `view ${dotIdx + 1}`}`}
                  className={`relative overflow-hidden rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === dotIdx ? 'w-[26px] h-[7px] bg-white/40' : 'w-[7px] h-[7px] bg-white/55 hover:bg-white'
                  }`}
                >
                  {activeSlide === dotIdx && (
                    <span
                      className="absolute inset-0 bg-[#D4AF6A] rounded-full"
                      style={{
                        animation: isGlobalPaused || isHovered || isFocused ? 'none' : `rent-dot-fill ${SLIDE_MS}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. BADGE ROW */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="card-badge-anim font-sans font-semibold text-[11px] px-3 py-1.5 rounded-lg bg-[rgba(29,122,107,0.10)] text-[#1D7A6B]">
            For Rent
          </span>
          <span className="card-badge-anim font-sans font-semibold text-[11px] px-3 py-1.5 rounded-lg bg-[rgba(212,175,106,0.20)] text-[#8A6420]">
            {TYPE_LABEL_MAP[rental.type] || rental.type}
          </span>
          <span className="card-badge-anim font-sans font-semibold text-[11px] px-3 py-1.5 rounded-lg bg-[rgba(12,12,12,0.06)] text-[rgba(12,12,12,0.7)]">
            {idLabel}
          </span>
        </div>

        {/* 3. TITLE */}
        <div className="overflow-hidden mt-3">
          <button
            type="button"
            onClick={(e) => {
              if (hasDraggedRef.current) return;
              e.preventDefault();
              onOpenDetail(rental, activeSlide);
            }}
            title={fullName}
            className="card-title-anim group/title block w-full text-left font-serif text-[clamp(1.5rem,2vw,1.85rem)] leading-[1.15] text-[#0C0C0C] truncate cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A]"
          >
            <span className="relative inline-block truncate max-w-full pb-0.5">
              {fullName}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF6A] transition-all duration-300 group-hover/title:w-full" />
            </span>
          </button>
        </div>

        {/* 4. LOCATION */}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-[#D4AF6A]/15 text-[#A8832F] flex items-center justify-center flex-shrink-0">
            <MapPin size={14} />
          </div>
          <span className="font-sans text-[14px] text-[#0C0C0C]/65 truncate">
            {rental.location}
          </span>
        </div>

        {/* 5. SPECS ROW */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[rgba(12,12,12,0.05)] flex items-center justify-center text-[#0C0C0C]/80 flex-shrink-0">
              {rental.type === 'commercial' ? (
                <Store size={14} />
              ) : rental.type === 'office' ? (
                <Briefcase size={14} />
              ) : (
                <BedDouble size={14} />
              )}
            </div>
            <span className="font-sans text-[13px] text-[#0C0C0C]/80">
              {rental.beds !== null
                ? `${rental.beds} BHK ${DOT} ${rental.baths || 1} Baths`
                : rental.subtype}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#0C0C0C]/80">
            <Maximize2 size={13} className="text-[#0C0C0C]/60" />
            <span className="font-sans font-medium text-[13px] uppercase tracking-[0.08em]">
              {rental.area.toLocaleString('en-IN')} SQFT
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Divider, Price, Action Buttons */}
      <div>
        {/* 6. DIVIDER */}
        <div className="h-[1px] bg-[rgba(12,12,12,0.14)] my-5" />

        {/* 7. PRICE ROW */}
        <div className="flex items-end justify-between gap-3">
          {/* Price & Deposit */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-[clamp(1.9rem,2.6vw,2.4rem)] text-[#0C0C0C] leading-none">
                <span className="rupee">{RUPEE}</span>
                {formatInr(animatedPrice || rental.rent)}
              </span>
              <span className="font-sans font-medium text-[13px] text-[#0C0C0C]/60">
                / month
              </span>
            </div>
            <div className="font-sans text-[12px] text-[#0C0C0C]/60 mt-1">
              Deposit {RUPEE}{formatInr(rental.rent * rental.depositMonths)} {DOT} {rental.furnishing}
            </div>
          </div>

          {/* Action Buttons: Phone, WhatsApp, Mail, Eye */}
          <div className="flex items-center gap-2">
            {/* Phone */}
            <a
              href={`tel:${CONTACT_PHONE}`}
              aria-label={`Call about ${fullName}`}
              title={`Call about ${fullName}`}
              className="group/btn relative w-11 h-11 rounded-full bg-white border border-[rgba(12,12,12,0.14)] shadow-[0_6px_18px_rgba(12,12,12,0.10)] flex items-center justify-center text-[#0C0C0C] hover:-translate-y-[3px] hover:bg-[#D4AF6A] transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] cursor-pointer"
            >
              <Phone size={17} className="transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0C0C0C] text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                Call
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp about ${fullName}`}
              title={`WhatsApp about ${fullName}`}
              className="group/btn relative w-11 h-11 rounded-full bg-white border border-[rgba(12,12,12,0.14)] shadow-[0_6px_18px_rgba(12,12,12,0.10)] flex items-center justify-center text-[#0C0C0C] hover:-translate-y-[3px] hover:bg-[#D4AF6A] transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] cursor-pointer"
            >
              <MessageCircle size={17} className="transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0C0C0C] text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                WhatsApp
              </span>
            </a>

            {/* Mail */}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}`}
              aria-label={`Email about ${fullName}`}
              title={`Email about ${fullName}`}
              className="group/btn relative w-11 h-11 rounded-full bg-white border border-[rgba(12,12,12,0.14)] shadow-[0_6px_18px_rgba(12,12,12,0.10)] flex items-center justify-center text-[#0C0C0C] hover:-translate-y-[3px] hover:bg-[#D4AF6A] transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] cursor-pointer"
            >
              <Mail size={17} className="transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0C0C0C] text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                Email
              </span>
            </a>

            {/* Eye (Detail view) */}
            <button
              type="button"
              onClick={(e) => {
                if (hasDraggedRef.current) return;
                e.preventDefault();
                onOpenDetail(rental, activeSlide);
              }}
              aria-label={`View details of ${fullName}`}
              title={`View details of ${fullName}`}
              className="group/btn relative w-11 h-11 rounded-full bg-white border border-[rgba(12,12,12,0.14)] shadow-[0_6px_18px_rgba(12,12,12,0.10)] flex items-center justify-center text-[#0C0C0C] hover:-translate-y-[3px] hover:bg-[#D4AF6A] transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F] cursor-pointer"
            >
              <Eye size={17} className="transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0C0C0C] text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                View
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// -----------------------------------------------------------------------------
// MAIN RECENT RENTALS SECTION
// -----------------------------------------------------------------------------
export const RecentRentals: React.FC = () => {
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [selectedViewIdx, setSelectedViewIdx] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);
  const rAFId = useRef<number | null>(null);

  const totalItems = rentals.length;

  // Compute cardsPerView based on viewport
  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }, []);

  const totalStops = useMemo(() => {
    // 10 stops on desktop (12 - 3 + 1)
    return Math.max(1, totalItems - getCardsPerView() + 1);
  }, [getCardsPerView, totalItems]);

  // Section Entrance Animation
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 85%',
          once: true,
        },
      });

      // Heading words rise through masks
      const words = sectionEl.querySelectorAll('.recent-heading-word');
      tl.fromTo(
        words,
        { yPercent: 110, filter: 'blur(6px)' },
        { yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.05, ease: 'power3.out' }
      );

      // Gold sheen sweep on accent text
      const sheenEl = sectionEl.querySelector('.recent-accent-sheen');
      if (sheenEl) {
        tl.fromTo(
          sheenEl,
          { backgroundPosition: '200% 0' },
          { backgroundPosition: '-200% 0', duration: 1.2, ease: 'power2.inOut' },
          '-=0.4'
        );
      }

      // Description fades up
      const descEl = sectionEl.querySelector('.recent-desc');
      if (descEl) {
        tl.fromTo(
          descEl,
          { y: 16, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 0.65, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' },
          '-=0.7'
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  // Sync scrollLeft with activeDot and edge fades
  const handleScroll = useCallback(() => {
    if (rAFId.current) cancelAnimationFrame(rAFId.current);

    rAFId.current = requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const firstCard = scroller.firstElementChild as HTMLElement | null;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 24;
      const step = cardWidth + gap;

      const newIdx = Math.round(scroller.scrollLeft / step);
      setActiveDot(Math.min(Math.max(0, newIdx), totalStops - 1));

      setCanScrollLeft(scroller.scrollLeft > 5);
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      setCanScrollRight(scroller.scrollLeft < maxScroll - 5);
    });
  }, [totalStops]);

  // Scroll to stop index
  const scrollToStop = useCallback((stopIdx: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstCard = scroller.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    const step = firstCard.offsetWidth + 24;
    scroller.scrollTo({
      left: stopIdx * step,
      behavior: 'smooth',
    });
  }, []);

  // Arrow button step
  const scrollStep = (direction: 1 | -1) => {
    const target = activeDot + direction;
    if (target >= 0 && target < totalStops) {
      scrollToStop(target);
    }
  };

  // Mouse Drag on Desktop Scroller
  const handleMouseDown = (e: React.MouseEvent) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    isMouseDown.current = true;
    startX.current = e.pageX - scroller.offsetLeft;
    scrollLeftStart.current = scroller.scrollLeft;
    hasDragged.current = false;
    scroller.style.scrollSnapType = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }

    scroller.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.style.scrollSnapType = 'x mandatory';

    const firstCard = scroller.firstElementChild as HTMLElement | null;
    if (firstCard) {
      const step = firstCard.offsetWidth + 24;
      const nearestStop = Math.round(scroller.scrollLeft / step);
      scroller.scrollTo({
        left: nearestStop * step,
        behavior: 'smooth',
      });
    }

    // Reset hasDragged after a small delay to prevent click firing
    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  };

  // Keyboard navigation on Scroller
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollStep(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollStep(-1);
    }
  };

  const handleOpenDetail = (rental: Rental, viewIndex: number) => {
    setSelectedRental(rental);
    setSelectedViewIdx(viewIndex);
    setIsDetailOpen(true);
  };

  return (
    <>
      <section
        id="recent-rentals"
        ref={sectionRef}
        aria-labelledby="recent-rentals-title"
        className="relative z-30 w-full bg-[#FAF8F4] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-24 md:pt-32 pb-28 sm:pb-36 md:pb-44"
        style={{
          marginTop: 'calc(var(--home-overlap, 60px) * -1)',
        }}
      >
        <div className="max-w-[1180px] mx-auto">
          {/* ========================================================================= */}
          {/* 1. HEADER                                                                 */}
          {/* ========================================================================= */}
          <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-end gap-10 mb-14">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-[#A8832F] rounded-full" />
                <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#A8832F]">
                  Fresh on the market
                </span>
              </div>

              {/* Title with word rise mask */}
              <h2
                id="recent-rentals-title"
                className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-left text-[#0C0C0C]"
              >
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="inline-block recent-heading-word">Recent</span>{' '}
                  <span className="inline-block recent-heading-word">rentals,</span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="inline-block italic text-[#A8832F] recent-heading-word recent-accent-sheen">
                    ready to move in.
                  </span>
                </span>
              </h2>

              {/* Description */}
              <p className="font-sans font-light text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed max-w-xl text-[#0C0C0C]/65 mt-6 recent-desc">
                Discover our newest rental listings: verified apartments, villas and workspaces across Hyderabad&rsquo;s finest neighbourhoods, with deposits and charges shown upfront.
              </p>
            </div>

            {/* Controls Cluster */}
            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              {/* Pause / Play Slideshows Toggle */}
              <button
                type="button"
                onClick={() => setIsGlobalPaused((prev) => !prev)}
                aria-pressed={isGlobalPaused}
                aria-label={isGlobalPaused ? 'Play photo slideshows' : 'Pause photo slideshows'}
                className="w-11 h-11 rounded-full border border-[rgba(12,12,12,0.14)] bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F]"
              >
                {isGlobalPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>

              {/* Prev Button (hidden below 640px) */}
              <button
                type="button"
                onClick={() => scrollStep(-1)}
                disabled={activeDot === 0}
                aria-label="Previous rental listings"
                className="hidden sm:flex w-12 h-12 rounded-full border border-[rgba(12,12,12,0.14)] bg-white/70 backdrop-blur-sm items-center justify-center text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white disabled:opacity-35 disabled:hover:bg-white/70 disabled:hover:text-[#0C0C0C] disabled:cursor-not-allowed transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F]"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Button (hidden below 640px) */}
              <button
                type="button"
                onClick={() => scrollStep(1)}
                disabled={activeDot >= totalStops - 1}
                aria-label="Next rental listings"
                className="hidden sm:flex w-12 h-12 rounded-full border border-[rgba(12,12,12,0.14)] bg-white/70 backdrop-blur-sm items-center justify-center text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white disabled:opacity-35 disabled:hover:bg-white/70 disabled:hover:text-[#0C0C0C] disabled:cursor-not-allowed transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8832F]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. THE CAROUSEL CONTAINER WITH EDGE MASKS                                 */}
          {/* ========================================================================= */}
          <div className="relative">
            {/* Left Edge Mask */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FAF8F4] to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Right Edge Mask */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAF8F4] to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Scroller */}
            <div
              ref={scrollerRef}
              role="region"
              aria-label="Recent rentals"
              tabIndex={0}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onKeyDown={handleKeyDown}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-6 md:py-12 no-scrollbar overscroll-x-contain cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A]"
              style={{
                scrollPaddingLeft: '0px',
              }}
            >
              {rentals.map((rental, idx) => (
                <div
                  key={rental.id}
                  className="flex-shrink-0 snap-start w-[88%] sm:w-[84%] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
                >
                  <RentalCard
                    rental={rental}
                    index={idx}
                    isGlobalPaused={isGlobalPaused}
                    onOpenDetail={handleOpenDetail}
                    hasDraggedRef={hasDragged}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. PAGINATION DOTS & COUNTER                                              */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Mobile Counter */}
            <div className="sm:hidden font-serif text-[20px] text-[#0C0C0C] mr-2">
              {String(activeDot + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
            </div>

            {/* Dots */}
            {Array.from({ length: totalStops }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToStop(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  activeDot === dotIdx
                    ? 'w-7 bg-[#0C0C0C]'
                    : 'w-2 bg-[rgba(12,12,12,0.14)] hover:bg-[rgba(12,12,12,0.3)]'
                }`}
              />
            ))}
          </div>

          {/* ========================================================================= */}
          {/* 4. EXPLORE ALL RENTALS LINK                                               */}
          {/* ========================================================================= */}
          <div className="mt-12 flex justify-center">
            <TransitionLink
              to="/rent"
              className="h-14 px-8 rounded-full border border-[#0C0C0C] font-sans font-medium text-[12px] uppercase tracking-[0.14em] text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore all rentals</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* RENTAL DETAIL OVERLAY WITH 4-PHOTO GALLERY */}
      {selectedRental && (
        <RentDetail
          rental={selectedRental}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          initialViewIndex={selectedViewIdx}
        />
      )}
    </>
  );
};

export default RecentRentals;
