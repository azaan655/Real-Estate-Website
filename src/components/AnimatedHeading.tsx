import React, { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  delay?: number;
  charDelay?: number;
  className?: string;
}

interface ParsedSegment {
  text: string;
  isItalic: boolean;
}

interface ParsedLine {
  segments: ParsedSegment[];
  totalLength: number;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  delay = 300,
  charDelay = 22,
  className = '',
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
      setIsTriggered(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsTriggered(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Parse text into lines and handle *italic accent* markers
  const lines: ParsedLine[] = text.split('\n').map((lineStr) => {
    const segments: ParsedSegment[] = [];
    const parts = lineStr.split('*');
    let isItalic = false;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length > 0) {
        segments.push({
          text: parts[i],
          isItalic,
        });
      }
      isItalic = !isItalic;
    }

    const totalLength = segments.reduce((sum, seg) => sum + seg.text.length, 0);
    return { segments, totalLength };
  });

  return (
    <h1 className={className}>
      {lines.map((line, lineIndex) => {
        let globalCharIndexInLine = 0;

        return (
          <span key={lineIndex} className="block overflow-hidden pb-[0.12em]">
            {line.segments.map((segment, segIndex) => {
              const chars = segment.text.split('');

              return (
                <span
                  key={segIndex}
                  style={segment.isItalic ? { color: '#E9DCC0', fontStyle: 'italic' } : undefined}
                >
                  {chars.map((char, cIdx) => {
                    const charIndex = globalCharIndexInLine++;
                    const staggerDelay = reducedMotion
                      ? 0
                      : lineIndex * line.totalLength * charDelay * 0.6 + charIndex * charDelay;

                    return (
                      <span
                        key={cIdx}
                        className="inline-block"
                        style={{
                          opacity: isTriggered ? 1 : 0,
                          transform: isTriggered ? 'translateY(0)' : 'translateY(110%)',
                          filter: isTriggered ? 'blur(0)' : 'blur(6px)',
                          transition: reducedMotion
                            ? 'none'
                            : 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1), filter 800ms cubic-bezier(0.22, 1, 0.36, 1)',
                          transitionDelay: reducedMotion ? '0ms' : `${staggerDelay}ms`,
                          willChange: 'transform, opacity, filter',
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

export default AnimatedHeading;

