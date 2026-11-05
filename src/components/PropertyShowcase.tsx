import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { properties, Property, formatPrice, pricePerUnit } from '../data/properties';
import PropertyDetail from './PropertyDetail';

const EXPAND_DURATION = 0.88;
const EXPAND_EASE = "power3.inOut";
const TEXT_EASE = "power3.out";
const AUTOPLAY_MS = 8000;
const CARD_RADIUS = 14;

export const PropertyShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<Record<string | number, boolean>>({});
  const [displayNumber, setDisplayNumber] = useState(1);
  const [prevNumber, setPrevNumber] = useState(1);
  const [isRollDown, setIsRollDown] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const activeBgRef = useRef<HTMLImageElement>(null);
  const incomingBgRef = useRef<HTMLImageElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterOldRef = useRef<HTMLSpanElement>(null);
  const counterNewRef = useRef<HTMLSpanElement>(null);
  const viewPropertyBtnRef = useRef<HTMLButtonElement>(null);

  const isAnimating = useRef(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const isHoveredOrFocused = useRef(false);
  const isIntersecting = useRef(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Showcase slider uses the first 6 listings only
  const showcaseListings = properties.filter((p) => Number(p.id) <= 6);
  const total = showcaseListings.length;
  const currentProperty = showcaseListings[activeIndex];

  // Circular queue of the remaining upcoming properties
  const upcomingQueue: { property: Property; originalIndex: number }[] = [];
  for (let i = 1; i <= total; i++) {
    const idx = (activeIndex + i) % total;
    upcomingQueue.push({ property: showcaseListings[idx], originalIndex: idx });
  }

  // Preload next upcoming images
  const preloadUpcoming = useCallback((currIdx: number) => {
    for (let i = 1; i <= 3; i++) {
      const nextIdx = (currIdx + i) % total;
      const img = new Image();
      img.src = showcaseListings[nextIdx].image;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    }
  }, [total, showcaseListings]);

  useEffect(() => {
    preloadUpcoming(activeIndex);
  }, [activeIndex, preloadUpcoming]);

  // Toggle bookmark save state
  const toggleSave = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Run transition to a specific target index
  const goToSlide = useCallback((targetIdx: number, direction: 'next' | 'prev', sourceCardElement?: HTMLElement | null) => {
    if (isAnimating.current || targetIdx === activeIndex || isDetailOpen) return;
    isAnimating.current = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetProperty = showcaseListings[targetIdx];
    const section = sectionRef.current;
    if (!section) {
      isAnimating.current = false;
      return;
    }

    // Restart autoplay timer
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);

    // Update slide number rolling state
    setPrevNumber(activeIndex + 1);
    setDisplayNumber(targetIdx + 1);
    setIsRollDown(direction === 'next');

    if (prefersReducedMotion) {
      setActiveIndex(targetIdx);
      if (activeBgRef.current) {
        activeBgRef.current.src = targetProperty.image;
        activeBgRef.current.style.objectPosition = targetProperty.focal;
      }
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      }
    });

    const sectionRect = section.getBoundingClientRect();

    // =========================================================================
    // NEXT / STRIP CARD CLICK: SEAMLESS EXPANSION TRANSITION
    // =========================================================================
    if (direction === 'next') {
      const cardEl = sourceCardElement || cardRefs.current[0];
      let expander: HTMLDivElement | null = null;

      if (cardEl) {
        // Reset any tilt styles before computing bounds
        cardEl.style.transform = 'none';
        const cardRect = cardEl.getBoundingClientRect();
        const initialLeft = cardRect.left - sectionRect.left;
        const initialTop = cardRect.top - sectionRect.top;
        const initialWidth = cardRect.width;
        const initialHeight = cardRect.height;

        // Hide source card smoothly so it doesn't double-render
        cardEl.style.opacity = '0';

        // Preload incoming background buffer immediately behind expander
        if (incomingBgRef.current) {
          incomingBgRef.current.src = targetProperty.image;
          incomingBgRef.current.style.objectPosition = targetProperty.focal;
          incomingBgRef.current.style.opacity = '1';
        }

        // Create the expanding clone element
        expander = document.createElement('div');
        expander.style.position = 'absolute';
        expander.style.left = `${initialLeft}px`;
        expander.style.top = `${initialTop}px`;
        expander.style.width = `${initialWidth}px`;
        expander.style.height = `${initialHeight}px`;
        expander.style.borderRadius = `${CARD_RADIUS}px`;
        expander.style.overflow = 'hidden';
        expander.style.zIndex = '24';
        expander.style.boxShadow = '0 25px 60px rgba(0,0,0,0.6)';
        expander.style.contain = 'paint';
        expander.style.willChange = 'left, top, width, height, border-radius';

        const expImg = document.createElement('img');
        expImg.src = targetProperty.image;
        expImg.alt = targetProperty.name.replace('\n', ' ');
        expImg.style.width = '100%';
        expImg.style.height = '100%';
        expImg.style.objectFit = 'cover';
        expImg.style.objectPosition = targetProperty.focal;
        expImg.style.display = 'block';

        expander.appendChild(expImg);
        section.appendChild(expander);

        // Expand to fill the entire showcase section smoothly
        tl.to(expander, {
          left: 0,
          top: 0,
          width: sectionRect.width,
          height: sectionRect.height,
          borderRadius: 0,
          duration: EXPAND_DURATION,
          ease: EXPAND_EASE,
        }, 0);

        // Smoothly fade out old text
        if (textContainerRef.current) {
          const elements = textContainerRef.current.querySelectorAll('.showcase-anim-in');
          tl.to(elements, {
            opacity: 0,
            y: -12,
            filter: 'blur(6px)',
            duration: 0.3,
            ease: 'power2.in',
          }, 0);
        }

        // Shift remaining strip cards smoothly
        if (stripContainerRef.current) {
          const firstCardWidth = cardRefs.current[0]?.offsetWidth || 180;
          const gap = window.innerWidth >= 640 ? 36 : 16;
          const shiftX = firstCardWidth + gap;

          tl.fromTo(stripContainerRef.current,
            { x: 0 },
            { x: -shiftX, duration: EXPAND_DURATION, ease: EXPAND_EASE },
            0
          );
        }

        // At 75% through the expansion (expander fully blankets the screen):
        // Commit React state change seamlessly underneath the expander
        tl.call(() => {
          setActiveIndex(targetIdx);
          if (activeBgRef.current) {
            activeBgRef.current.src = targetProperty.image;
            activeBgRef.current.style.objectPosition = targetProperty.focal;
          }
          if (stripContainerRef.current) {
            stripContainerRef.current.style.transform = 'none';
          }
          if (cardEl) {
            cardEl.style.opacity = '1';
          }
        }, undefined, EXPAND_DURATION * 0.75);

        // At 100% expansion, smoothly dissolve expander and remove it
        tl.to(expander, {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.out',
          onComplete: () => {
            if (expander && expander.parentNode) {
              expander.parentNode.removeChild(expander);
            }
            if (incomingBgRef.current) {
              incomingBgRef.current.style.opacity = '0';
            }
          }
        }, EXPAND_DURATION);
      } else {
        setActiveIndex(targetIdx);
      }

      // Slide number vertical roll
      if (counterOldRef.current && counterNewRef.current) {
        tl.fromTo(counterOldRef.current,
          { yPercent: 0 },
          { yPercent: -100, duration: 0.6, ease: "power2.inOut" },
          0.25
        );
        tl.fromTo(counterNewRef.current,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, ease: "power2.inOut" },
          0.25
        );
      }

      // Progress fill animation
      if (progressBarRef.current) {
        const nextPercent = ((targetIdx + 1) / total) * 100;
        tl.to(progressBarRef.current, {
          width: `${nextPercent}%`,
          duration: EXPAND_DURATION,
          ease: "power2.inOut"
        }, 0.1);
      }

      // Stagger in the new text block elements cleanly
      if (textContainerRef.current) {
        tl.call(() => {
          const elements = textContainerRef.current?.querySelectorAll('.showcase-anim-in');
          if (elements && elements.length > 0) {
            gsap.fromTo(elements,
              { opacity: 0, y: 26, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                ease: TEXT_EASE,
                stagger: 0.08,
              }
            );
          }
        }, undefined, EXPAND_DURATION * 0.8);
      }
    } else {
      // =========================================================================
      // PREV: SMOOTH DUAL-BUFFER CROSSFADE TRANSITION
      // =========================================================================
      if (incomingBgRef.current) {
        incomingBgRef.current.src = targetProperty.image;
        incomingBgRef.current.style.objectPosition = targetProperty.focal;
        incomingBgRef.current.style.opacity = '0';

        tl.to(incomingBgRef.current, { opacity: 1, duration: 0.75, ease: EXPAND_EASE }, 0);
        tl.fromTo(incomingBgRef.current,
          { scale: 1.08 },
          { scale: 1, duration: 0.75, ease: EXPAND_EASE },
          0
        );
      }

      if (textContainerRef.current) {
        const elements = textContainerRef.current.querySelectorAll('.showcase-anim-in');
        tl.to(elements, { opacity: 0, y: 15, duration: 0.3, ease: 'power2.in' }, 0);
      }

      tl.call(() => {
        setActiveIndex(targetIdx);
        if (activeBgRef.current) {
          activeBgRef.current.src = targetProperty.image;
          activeBgRef.current.style.objectPosition = targetProperty.focal;
        }
        if (incomingBgRef.current) {
          incomingBgRef.current.style.opacity = '0';
        }
      }, undefined, 0.4);

      if (counterOldRef.current && counterNewRef.current) {
        tl.fromTo(counterOldRef.current,
          { yPercent: 0 },
          { yPercent: 100, duration: 0.6, ease: "power2.inOut" },
          0.2
        );
        tl.fromTo(counterNewRef.current,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.6, ease: "power2.inOut" },
          0.2
        );
      }

      if (progressBarRef.current) {
        const prevPercent = ((targetIdx + 1) / total) * 100;
        tl.to(progressBarRef.current, {
          width: `${prevPercent}%`,
          duration: EXPAND_DURATION,
          ease: "power2.inOut"
        }, 0.1);
      }

      if (textContainerRef.current) {
        tl.call(() => {
          const elements = textContainerRef.current?.querySelectorAll('.showcase-anim-in');
          if (elements && elements.length > 0) {
            gsap.fromTo(elements,
              { opacity: 0, y: -22, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                ease: TEXT_EASE,
                stagger: 0.08,
              }
            );
          }
        }, undefined, 0.45);
      }
    }
  }, [activeIndex, total, isDetailOpen]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % total;
    goToSlide(nextIdx, 'next');
  }, [activeIndex, total, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + total) % total;
    goToSlide(prevIdx, 'prev');
  }, [activeIndex, total, goToSlide]);

  // Autoplay management
  const startAutoplay = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (isDetailOpen) return;

    autoplayTimer.current = setInterval(() => {
      if (!isHoveredOrFocused.current && isIntersecting.current && !isAnimating.current && !isDetailOpen) {
        handleNext();
      }
    }, AUTOPLAY_MS);
  }, [handleNext, isDetailOpen]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [startAutoplay, isDetailOpen]);

  // IntersectionObserver for 50% visibility
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting.current = entry.isIntersecting;
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDetailOpen) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  // Touch Swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    if (isDetailOpen) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isDetailOpen) return;
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // =========================================================================
  // MOUSE INTERACTIONS: SPOTLIGHT & PARALLAX
  // =========================================================================
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    section.style.setProperty('--mouse-x', `${x}px`);
    section.style.setProperty('--mouse-y', `${y}px`);

    // Subtle gentle parallax for background & text
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    if (activeBgRef.current) {
      activeBgRef.current.style.transform = `translate3d(${normX * -10}px, ${normY * -10}px, 0) scale(1.04)`;
    }
    if (incomingBgRef.current) {
      incomingBgRef.current.style.transform = `translate3d(${normX * -10}px, ${normY * -10}px, 0) scale(1.04)`;
    }
    if (textContainerRef.current) {
      textContainerRef.current.style.transform = `translate3d(${normX * 6}px, ${normY * 6}px, 0)`;
    }
  };

  // 3D Tilt on Hover for Cards in the strip
  const handleCardMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px) scale3d(1.04, 1.04, 1.04)`;

    const glare = card.querySelector('.card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255, 255, 255, 0.25) 0%, rgba(212, 175, 106, 0.12) 35%, transparent 70%)`;
    }
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px) scale3d(1, 1, 1)';
    const glare = card.querySelector('.card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '0';
    }
  };

  return (
    <>
      <section
        id="properties"
        ref={sectionRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseMove={handleSectionMouseMove}
        onMouseEnter={() => {
          isHoveredOrFocused.current = true;
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          isHoveredOrFocused.current = false;
          setIsHovered(false);
          if (activeBgRef.current) {
            activeBgRef.current.style.transform = 'translate3d(0, 0, 0) scale(1.02)';
          }
          if (textContainerRef.current) {
            textContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }}
        onFocus={() => { isHoveredOrFocused.current = true; }}
        onBlur={() => { isHoveredOrFocused.current = false; }}
        aria-roledescription="carousel"
        aria-label="Featured properties"
        className="relative w-full h-[100svh] min-h-[640px] bg-black text-white overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] focus-visible:ring-offset-2"
        style={{
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        } as React.CSSProperties}
      >
        {/* ========================================================================= */}
        {/* 1. ACTIVE PROPERTY FULL-BLEED BACKGROUND PHOTO (Z-INDEX 0)                */}
        {/* ========================================================================= */}
        <img
          ref={activeBgRef}
          src={currentProperty.image}
          alt={currentProperty.name.replace('\n', ' ')}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0 block pointer-events-none transition-transform duration-700 ease-out"
          style={{
            objectPosition: currentProperty.focal,
            transform: 'translate3d(0, 0, 0) scale(1.02)',
          }}
        />

        {/* ========================================================================= */}
        {/* 1B. INCOMING BACKGROUND PHOTO BUFFER (Z-INDEX 1)                          */}
        {/* ========================================================================= */}
        <img
          ref={incomingBgRef}
          alt=""
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-[1] block pointer-events-none opacity-0 transition-opacity duration-300"
          style={{ transform: 'translate3d(0, 0, 0) scale(1.02)' }}
        />

        {/* ========================================================================= */}
        {/* 2. LEGIBILITY DUAL GRADIENT OVERLAYS (Z-INDEX 5)                           */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: `
              linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0) 72%),
              linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0) 60%)
            `,
          }}
        />

        {/* ========================================================================= */}
        {/* 2B. INTERACTIVE AMBIENT CURSOR SPOTLIGHT (Z-INDEX 6)                      */}
        {/* ========================================================================= */}
        <div
          className="pointer-events-none absolute inset-0 z-[6] transition-opacity duration-500 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            background: 'radial-gradient(750px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 106, 0.12) 0%, rgba(212, 175, 106, 0.02) 40%, transparent 70%)',
          }}
        />

        {/* ========================================================================= */}
        {/* 3. LEFT TEXT BLOCK (BOTTOM-ANCHORED, Z-INDEX 10)                          */}
        {/* ========================================================================= */}
        <div
          ref={textContainerRef}
          aria-live="polite"
          className="absolute left-0 z-10 w-full lg:w-[48vw] px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col items-start pointer-events-auto transition-transform duration-500 ease-out"
          style={{
            bottom: 'calc(clamp(14svh, 16svh, 18svh) + var(--home-overlap, var(--services-overlap, 60px)))',
          }}
        >
          {/* Short white dash */}
          <div
            className="showcase-anim-in w-8 h-[3px] bg-white rounded-full mb-3 sm:mb-4"
            style={{ transformOrigin: 'left' }}
          />

          {/* Location Eyebrow */}
          <p className="showcase-anim-in font-sans font-medium text-[11px] sm:text-[12px] uppercase tracking-[0.22em] text-white/90 mb-2 sm:mb-3">
            {currentProperty.location}
          </p>

          {/* Huge 2-line Heading in Instrument Serif */}
          <h2 className="showcase-anim-in font-serif font-normal text-white leading-[0.98] tracking-[-0.02em] mb-4 sm:mb-5 text-[clamp(2.1rem,5.5vw,6rem)]">
            {currentProperty.name.split('\n').map((line, idx) => (
              <span key={idx} className="block overflow-hidden pb-[0.12em]">
                <span className="block">{line}</span>
              </span>
            ))}
          </h2>

          {/* Description */}
          <p className="showcase-anim-in font-sans font-normal text-xs sm:text-[14px] leading-[1.6] text-white/80 max-w-[28rem] line-clamp-3 sm:line-clamp-4 md:line-clamp-none mb-4 sm:mb-5">
            {currentProperty.description}
          </p>

          {/* Spec Row (Hyderabad Market Specs) */}
          <div className="showcase-anim-in flex flex-wrap items-center gap-2.5 sm:gap-4 font-sans font-medium text-xs sm:text-[13px] text-white mb-5 sm:mb-6">
            {currentProperty.beds !== null && currentProperty.baths !== null ? (
              <>
                <span>{currentProperty.beds} BHK</span>
                <span className="w-[1px] h-3.5 bg-white/25" />
                <span>{currentProperty.baths} Baths</span>
                <span className="w-[1px] h-3.5 bg-white/25" />
              </>
            ) : (
              <>
                <span>{currentProperty.subtype}</span>
                <span className="w-[1px] h-3.5 bg-white/25" />
              </>
            )}
            <span>{currentProperty.area.toLocaleString('en-IN')} {currentProperty.areaUnit}</span>
            <span className="w-[1px] h-3.5 bg-white/25" />
            <span className="font-semibold text-[#D4AF6A]">{formatPrice(currentProperty.priceCr)}</span>
          </div>

          {/* Buttons Row */}
          <div className="showcase-anim-in flex items-center gap-3 font-sans">
            {/* Round Bookmark Save Button */}
            <button
              type="button"
              onClick={(e) => toggleSave(currentProperty.id, e)}
              aria-label={savedIds[currentProperty.id] ? "Saved property" : "Save property"}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[#D4AF6A] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,175,106,0.5)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <Bookmark
                size={16}
                className={`transition-colors ${savedIds[currentProperty.id] ? 'fill-white' : 'fill-none'}`}
              />
            </button>

            {/* Pill View Property Button (Opens Detail Overlay) */}
            <button
              ref={viewPropertyBtnRef}
              type="button"
              onClick={() => setIsDetailOpen(true)}
              aria-label={`View ${currentProperty.name.replace('\n', ' ')}`}
              className="group h-11 min-h-[44px] px-5 sm:px-6 rounded-full border border-white/70 bg-transparent text-white text-[11px] font-medium uppercase tracking-[0.14em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
            >
              <span>View Property</span>
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. HORIZONTAL STRIP OF PORTRAIT CARDS (Z-INDEX 30)                        */}
        {/* ========================================================================= */}
        <div
          className="hidden sm:block absolute sm:left-[42vw] lg:left-[48vw] z-30 pointer-events-auto"
          style={{
            bottom: 'calc(clamp(96px, 11svh, 120px) + var(--home-overlap, var(--services-overlap, 60px)))',
          }}
        >
          <div
            ref={stripContainerRef}
            className="flex items-center gap-[16px] sm:gap-[36px] overflow-visible"
            style={{ willChange: 'transform' }}
          >
            {upcomingQueue.map(({ property, originalIndex }, i) => {
              const isSaved = !!savedIds[property.id];

              return (
                <button
                  key={`${property.id}-${i}`}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  type="button"
                  onClick={(e) => goToSlide(originalIndex, 'next', e.currentTarget)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  aria-label={`Switch to ${property.name.replace('\n', ' ')}`}
                  className="group relative flex-shrink-0 rounded-[14px] overflow-hidden text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A]"
                  style={{
                    height: 'clamp(160px, 30svh, 280px)',
                    width: 'calc(clamp(160px, 30svh, 280px) * 0.66)',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
                    transformStyle: 'preserve-3d',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  {/* Card Image */}
                  <img
                    src={property.image}
                    alt={property.name.replace('\n', ' ')}
                    decoding="async"
                    className="w-full h-full object-cover block pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: property.focal }}
                  />

                  {/* Card Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0) 70%)',
                    }}
                  />

                  {/* Interactive Dynamic Glare */}
                  <div
                    className="card-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
                  />

                  {/* Card Badge if any */}
                  {property.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-sans font-semibold tracking-wider uppercase bg-black/60 text-[#D4AF6A] border border-[#D4AF6A]/40 backdrop-blur-sm z-10">
                      {property.badge}
                    </span>
                  )}

                  {/* Bookmark indicator if saved */}
                  {isSaved && (
                    <span className="absolute top-3 right-3 text-[#D4AF6A] z-10">
                      <Bookmark size={14} className="fill-[#D4AF6A]" />
                    </span>
                  )}

                  {/* Card Bottom Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 flex flex-col items-start pointer-events-none z-10">
                    <div className="w-[18px] h-[2px] bg-white rounded-full mb-1.5 transition-all duration-300 group-hover:w-6 group-hover:bg-[#D4AF6A]" />
                    <span className="font-sans text-[11px] text-white/85 uppercase tracking-[0.14em] line-clamp-1">
                      {property.city || property.location.split(',')[0].trim()}
                    </span>
                    <span className="font-serif text-[20px] sm:text-[22px] leading-[1.05] text-white line-clamp-2 mt-0.5 group-hover:text-[#E9DCC0] transition-colors duration-300">
                      {property.name.replace('\n', ' ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. CONTROLS ROW (ARROWS, GOLD PROGRESS LINE, SLIDE NUMBER) (Z-INDEX 30)   */}
        {/* ========================================================================= */}
        <div
          className="absolute left-4 sm:left-[42vw] lg:left-[48vw] right-4 sm:right-6 md:right-12 lg:right-16 z-30 flex items-center justify-between pointer-events-auto"
          style={{
            bottom: 'calc(clamp(1.5rem, 4svh, 2rem) + var(--home-overlap, var(--services-overlap, 60px)))',
          }}
        >
          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous property"
              className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Next Arrow (Gold ring by default) */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next property"
              className="w-11 h-11 rounded-full border border-[#D4AF6A] flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-[#D4AF6A] hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Progress Line */}
          <div className="flex-1 mx-4 sm:mx-6 h-[2px] bg-white/30 rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full bg-[#D4AF6A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
            />
          </div>

          {/* Slide Counter */}
          <div className="block sm:hidden font-sans text-xs text-white/70 font-medium tracking-widest tabular-nums">
            0{activeIndex + 1} / 0{total}
          </div>

          <div className="hidden sm:block relative h-[44px] overflow-hidden">
            <div className="relative font-serif text-[44px] leading-none text-white tabular-nums h-[44px] flex items-center justify-center">
              <span
                ref={counterOldRef}
                className="absolute inset-0 flex items-center justify-center"
              >
                {prevNumber}
              </span>
              <span
                ref={counterNewRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: isRollDown ? 'translateY(100%)' : 'translateY(-100%)',
                }}
              >
                {displayNumber}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PROPERTY DETAIL OVERLAY (SECTION 11)                                    */}
      {/* ========================================================================= */}
      <PropertyDetail
        property={currentProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        triggerButtonRef={viewPropertyBtnRef}
      />
    </>
  );
};

export default PropertyShowcase;
