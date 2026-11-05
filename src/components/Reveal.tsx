import React, { useState, useEffect, useRef } from 'react';
import { usePageTransition } from './PageTransition';

export interface RevealProps {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  once?: boolean;
  children?: React.ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  style = {},
  as: Component = 'div',
  once = true,
  children,
}) => {
  const { ready } = usePageTransition();
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (!ready) return;

    const el = domRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: '50px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ready, once]);

  return (
    <Component
      ref={domRef}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : `translate3d(${x}px, ${y}px, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </Component>
  );
};

export const FadeIn = Reveal;
export default Reveal;

