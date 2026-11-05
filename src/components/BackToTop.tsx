import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rAFRef = useRef<number | null>(null);

  // Radius for 56px circular SVG ring (cx=28, cy=28, r=24)
  const RADIUS = 24;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~150.796

  // Scroll handler throttled via requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);

    rAFRef.current = requestAnimationFrame(() => {
      if (typeof window === 'undefined') return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max(scrollY / scrollHeight, 0), 1) : 0;

      setScrollProgress(progress);
      setIsVisible(scrollY > 600);

      // Check if body scroll is locked by an overlay or drawer
      const bodyOverflow = document.body.style.overflow;
      setIsLocked(bodyOverflow === 'hidden');
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // MutationObserver to detect body style changes (e.g. overflow: hidden)
    const observer = new MutationObserver(() => {
      const bodyOverflow = document.body.style.overflow;
      setIsLocked(bodyOverflow === 'hidden');
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [handleScroll]);

  // Entrance / Exit animation
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldShow = isVisible && !isLocked;

    if (prefersReducedMotion) {
      gsap.set(btn, {
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? 'auto' : 'none',
      });
      return;
    }

    if (shouldShow) {
      gsap.fromTo(
        btn,
        { scale: 0.8, opacity: 0, pointerEvents: 'none' },
        { scale: 1, opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(btn, {
        scale: 0.8,
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power3.in',
      });
    }
  }, [isVisible, isLocked]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Move focus to page h1 if present without scrolling
    const h1 = document.querySelector('h1');
    if (h1) {
      (h1 as HTMLElement).tabIndex = -1;
      (h1 as HTMLElement).focus({ preventScroll: true });
    }
  };

  const strokeDashoffset = CIRCUMFERENCE * (1 - scrollProgress);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed right-5 bottom-5 md:right-7 md:bottom-7 w-14 h-14 rounded-full bg-[rgba(11,9,7,0.85)] backdrop-blur-md border border-[rgba(233,220,192,0.25)] shadow-[0_14px_40px_rgba(0,0,0,0.35)] z-[65] flex items-center justify-center text-[#F4EFE6] hover:text-[#D4AF6A] transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] focus-visible:ring-offset-2 opacity-0 pointer-events-none"
    >
      {/* Circular Progress Ring */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        className="absolute inset-0 -rotate-90 pointer-events-none"
      >
        {/* Background track circle */}
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="rgba(244,239,230,0.12)"
          strokeWidth="2"
        />
        {/* Animated progress circle */}
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="#D4AF6A"
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>

      {/* Up Arrow Icon with lift on hover */}
      <ArrowUp
        size={20}
        className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-[#D4AF6A]"
      />
    </button>
  );
};

export default BackToTop;

