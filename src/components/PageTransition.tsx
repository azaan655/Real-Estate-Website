import React, { createContext, useContext, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionContextType {
  transitionTo: (to: string, label?: string) => void;
  isTransitioning: boolean;
  curtainLabel: string | null;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  transitionTo: () => {},
  isTransitioning: false,
  curtainLabel: null,
});

export const usePageTransition = () => useContext(PageTransitionContext);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [curtainLabel, setCurtainLabel] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const transitionTo = (to: string, label?: string) => {
    // If it's a hash link on the current page, let browser/scrollManager handle it directly
    if (to.startsWith('/#') && location.pathname === '/') {
      const hash = to.replace('/', '');
      window.location.hash = hash;
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (to === location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurtainLabel(label || null);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const overlay = overlayRef.current;

    if (prefersReducedMotion || !overlay) {
      navigate(to);
      setIsTransitioning(false);
      setCurtainLabel(null);
      return;
    }

    // GSAP cinematic curtain wipe
    const tl = gsap.timeline({
      onComplete: () => {
        navigate(to);
        // After route commits, wipe out curtain
        gsap.to(overlay, {
          yPercent: -100,
          duration: 0.52,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(overlay, { yPercent: 100 });
            setIsTransitioning(false);
            setCurtainLabel(null);
          },
        });
      },
    });

    tl.fromTo(
      overlay,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.52, ease: 'power3.inOut' }
    );

    if (labelWrapRef.current) {
      tl.fromTo(
        labelWrapRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        0.2
      );
    }
  };

  return (
    <PageTransitionContext.Provider value={{ transitionTo, isTransitioning, curtainLabel }}>
      {children}
      {/* Luxury Curtain Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] bg-[#0C0C0C] pointer-events-none translate-y-full flex flex-col items-center justify-center px-6"
      >
        <div ref={labelWrapRef} className="flex flex-col items-center text-center">
          <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mb-3 animate-pulse" />
          {curtainLabel ? (
            <span className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-white tracking-[-0.01em]">
              {curtainLabel}
            </span>
          ) : (
            <span className="font-sans text-xs tracking-[0.25em] text-white/50 uppercase">
              VESTA
            </span>
          )}
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
};

export interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  transitionLabel?: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = '',
  transitionLabel,
  onClick,
  ...rest
}) => {
  const { transitionTo } = usePageTransition();
  const location = useLocation();

  const isExactActive = location.pathname === to;
  const combinedClassName = `${className} ${isExactActive ? activeClassName : ''}`.trim();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    transitionTo(to, transitionLabel);
  };

  return (
    <a href={to} onClick={handleClick} className={combinedClassName} {...rest}>
      {children}
    </a>
  );
};

export default TransitionLink;
